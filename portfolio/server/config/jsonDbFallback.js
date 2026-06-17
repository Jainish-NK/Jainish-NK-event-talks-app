const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

function setupJsonDbFallback() {
  console.log("⚠️ MongoDB offline. Activating Local JSON Database Fallback in server/.data/...");
  global.useJsonDb = true;

  // Make sure we have the models loaded
  // Import them explicitly to register them with mongoose
  require("../models/Admin");
  require("../models/Profile");
  require("../models/Skill");
  require("../models/Experience");
  require("../models/Project");
  require("../models/Certification");
  require("../models/Education");
  require("../models/Message");

  const models = mongoose.modelNames();
  for (let modelName of models) {
    const Model = mongoose.model(modelName);
    const collectionName = Model.collection.name; // e.g. "projects", "skills", "profiles"
    const jsonPath = path.join(__dirname, "../.data", `${collectionName}.json`);

    // Helper to read data
    const readData = () => {
      try {
        if (fs.existsSync(jsonPath)) {
          return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        }
      } catch (e) {
        console.error(`Error reading JSON for ${collectionName}:`, e);
      }
      return [];
    };

    // Helper to write data
    const writeData = (data) => {
      try {
        // Ensure parent dir exists
        fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf8");
      } catch (e) {
        console.error(`Error writing JSON for ${collectionName}:`, e);
      }
    };

    // Mock Query Class for chaining (sort, select, etc.)
    class MockQuery {
      constructor(data) {
        this.data = data;
      }
      sort(sortObj) {
        if (!sortObj) return this;
        let keys = [];
        let directions = [];
        if (typeof sortObj === "object") {
          keys = Object.keys(sortObj);
          directions = keys.map(k => sortObj[k]);
        } else if (typeof sortObj === "string") {
          const parts = sortObj.split(" ").filter(Boolean);
          keys = parts.map(p => p.startsWith("-") ? p.substring(1) : p);
          directions = parts.map(p => p.startsWith("-") ? -1 : 1);
        }
        this.data.sort((a, b) => {
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const dir = directions[i];
            let valA = a[key];
            let valB = b[key];
            if (typeof valA === "boolean") valA = valA ? 1 : 0;
            if (typeof valB === "boolean") valB = valB ? 1 : 0;
            if (valA < valB) return dir === -1 ? 1 : -1;
            if (valA > valB) return dir === -1 ? -1 : 1;
          }
          return 0;
        });
        return this;
      }
      exec() {
        return Promise.resolve(this.data);
      }
      then(onResolve, onReject) {
        return Promise.resolve(this.data).then(onResolve, onReject);
      }
    }

    // Override find
    Model.find = function(filter) {
      let data = readData();
      if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
        data = data.filter(item => {
          for (let key in filter) {
            if (key === "_id" && filter[key] && filter[key].$in) {
              if (!filter[key].$in.includes(item._id)) return false;
              continue;
            }
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
      }
      return new MockQuery(data);
    };

    // Override findOne
    Model.findOne = function(filter) {
      let data = readData();
      let found = null;
      if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
        found = data.find(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
      } else {
        found = data[0] || null;
      }
      return new MockQuery(found);
    };

    // Override findById
    Model.findById = function(id) {
      let data = readData();
      let found = data.find(item => item._id === id || String(item._id) === String(id)) || null;
      return new MockQuery(found);
    };

    // Override create
    Model.create = function(docOrDocs) {
      let data = readData();
      if (Array.isArray(docOrDocs)) {
        const docs = docOrDocs.map(d => ({
          _id: `json_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...d
        }));
        data = [...data, ...docs];
        writeData(data);
        return Promise.resolve(docs);
      } else {
        const doc = {
          _id: `json_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...docOrDocs
        };
        data.push(doc);
        writeData(data);
        return Promise.resolve(doc);
      }
    };

    // Override insertMany
    Model.insertMany = function(docs) {
      return Model.create(docs);
    };

    // Override deleteMany
    Model.deleteMany = function(filter) {
      if (!filter || Object.keys(filter).length === 0) {
        writeData([]);
        return Promise.resolve({ deletedCount: 0 });
      }
      let data = readData();
      const initialCount = data.length;
      data = data.filter(item => {
        for (let key in filter) {
          if (item[key] === filter[key]) return false;
        }
        return true;
      });
      writeData(data);
      return Promise.resolve({ deletedCount: initialCount - data.length });
    };

    // Override findOneAndUpdate
    Model.findOneAndUpdate = function(filter, update, options = {}) {
      let data = readData();
      let index = -1;
      if (filter && Object.keys(filter).length > 0) {
        index = data.findIndex(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
      } else {
        index = 0;
      }

      if (index === -1) {
        if (options.upsert) {
          const doc = {
            _id: `json_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...update
          };
          data.push(doc);
          writeData(data);
          return new MockQuery(doc);
        }
        return new MockQuery(null);
      }

      const updatedDoc = {
        ...data[index],
        ...update,
        updatedAt: new Date().toISOString()
      };
      data[index] = updatedDoc;
      writeData(data);
      return new MockQuery(updatedDoc);
    };

    // Override findByIdAndUpdate
    Model.findByIdAndUpdate = function(id, update, options = {}) {
      let data = readData();
      let index = data.findIndex(item => item._id === id || String(item._id) === String(id));
      if (index === -1) {
        if (options.upsert) {
          const doc = {
            _id: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...update
          };
          data.push(doc);
          writeData(data);
          return new MockQuery(doc);
        }
        return new MockQuery(null);
      }
      const updatedDoc = {
        ...data[index],
        ...update,
        updatedAt: new Date().toISOString()
      };
      data[index] = updatedDoc;
      writeData(data);
      return new MockQuery(updatedDoc);
    };

    // Override findByIdAndDelete
    Model.findByIdAndDelete = function(id) {
      let data = readData();
      let index = data.findIndex(item => item._id === id || String(item._id) === String(id));
      if (index === -1) {
        return new MockQuery(null);
      }
      const deletedDoc = data[index];
      data.splice(index, 1);
      writeData(data);
      return new MockQuery(deletedDoc);
    };
  }
}

module.exports = setupJsonDbFallback;
