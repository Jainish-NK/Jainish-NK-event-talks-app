const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
let useMongoose = false;

// Fallback JSON DB Implementation
const dataDir = path.join(__dirname, "../.data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

class JsonModel {
  constructor(filename, defaultData = []) {
    this.filePath = path.join(dataDir, `${filename}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    let items = this.read();
    return items.filter((item) => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async findById(id) {
    let items = this.read();
    return items.find((item) => item._id === id) || null;
  }

  async findOne(query = {}) {
    let items = this.read();
    return (
      items.find((item) => {
        for (let key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      }) || null
    );
  }

  async create(data) {
    let items = this.read();
    const newItem = {
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...data,
    };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, data, options = {}) {
    let items = this.read();
    const index = items.findIndex((item) => item._id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.write(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    let items = this.read();
    const index = items.findIndex((item) => item._id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    this.write(items);
    return deleted;
  }
}

// Default Seed Data
const defaultProjects = [
  {
    _id: "proj1",
    title: "Neural-Visual Path Finder",
    description: "Deep learning path planning visualizer built for drone navigation in obstacle-dense dynamic environments.",
    category: "Machine Learning",
    tags: ["Python", "PyTorch", "TensorFlow", "React", "OpenCV"],
    github: "https://github.com/Jainish-NK",
    live: "https://github.com/Jainish-NK",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    _id: "proj2",
    title: "BigQuery Release Feed Tracker",
    description: "Full-stack real-time tracker that parses Google Cloud BigQuery RSS/Atom release notes into a dynamic glassmorphic feeds panel.",
    category: "Web Development",
    tags: ["Node.js", "Express", "Flask", "Vanilla CSS", "JavaScript"],
    github: "https://github.com/Jainish-NK/Jainish-NK-event-talks-app",
    live: "https://github.com/Jainish-NK/Jainish-NK-event-talks-app",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
];

const defaultSkills = [
  { _id: "s1", name: "Python", category: "Languages", level: 90 },
  { _id: "s2", name: "JavaScript", category: "Languages", level: 85 },
  { _id: "s3", name: "PyTorch & TensorFlow", category: "AI / ML", level: 80 },
  { _id: "s4", name: "Scikit-Learn", category: "AI / ML", level: 85 },
  { _id: "s5", name: "React.js", category: "Web Development", level: 80 },
  { _id: "s6", name: "Node.js & Express", category: "Web Development", level: 75 },
  { _id: "s7", name: "MongoDB / SQL", category: "Web Development", level: 75 },
  { _id: "s8", name: "Git & Docker", category: "Tools", level: 85 },
];

const defaultExperiences = [
  {
    _id: "exp1",
    role: "AI/ML Engineering Student",
    company: "University Academic Program",
    duration: "2023 - Present",
    description: "Conducting research in neural pathfinder planning and convolutional model optimization.",
  },
  {
    _id: "exp2",
    role: "Full-Stack Web Intern",
    company: "Dev Corp",
    duration: "Summer 2025",
    description: "Developed internal dashboard widgets, reducing API data loading overhead by 30%.",
  },
];

// Seed Admin User (default login: admin / admin123)
const bcrypt = require("bcryptjs");
const hashedPassword = bcrypt.hashSync("admin123", 10);
const defaultUsers = [
  {
    _id: "u1",
    username: "admin",
    password: hashedPassword,
    name: "Jainish Khunt",
  },
];

// Export Models Container
const db = {
  Project: null,
  Skill: null,
  Experience: null,
  User: null,
  Message: null,
  connect: async () => {
    if (MONGODB_URI) {
      try {
        await mongoose.connect(MONGODB_URI);
        console.log("🟢 Connected to MongoDB database successfully.");
        useMongoose = true;

        // Mongoose Schema Definitions
        const ProjectSchema = new mongoose.Schema(
          {
            title: { type: String, required: true },
            description: { type: String, required: true },
            category: { type: String, required: true },
            tags: [String],
            github: String,
            live: String,
            image: String,
            featured: Boolean,
          },
          { timestamps: true }
        );

        const SkillSchema = new mongoose.Schema(
          {
            name: { type: String, required: true },
            category: { type: String, required: true },
            level: { type: Number, required: true },
          },
          { timestamps: true }
        );

        const ExperienceSchema = new mongoose.Schema(
          {
            role: { type: String, required: true },
            company: { type: String, required: true },
            duration: { type: String, required: true },
            description: { type: String, required: true },
          },
          { timestamps: true }
        );

        const UserSchema = new mongoose.Schema(
          {
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            name: String,
          },
          { timestamps: true }
        );

        const MessageSchema = new mongoose.Schema(
          {
            name: { type: String, required: true },
            email: { type: String, required: true },
            subject: String,
            message: { type: String, required: true },
          },
          { timestamps: true }
        );

        db.Project = mongoose.model("Project", ProjectSchema);
        db.Skill = mongoose.model("Skill", SkillSchema);
        db.Experience = mongoose.model("Experience", ExperienceSchema);
        db.User = mongoose.model("User", UserSchema);
        db.Message = mongoose.model("Message", MessageSchema);

        // Seed Mongoose collections if empty
        const count = await db.Project.countDocuments();
        if (count === 0) {
          await db.Project.insertMany(defaultProjects);
          await db.Skill.insertMany(defaultSkills);
          await db.Experience.insertMany(defaultExperiences);
          await db.User.insertMany(defaultUsers);
          console.log("⭐ Seeded MongoDB collections with initial data.");
        }
        return;
      } catch (err) {
        console.error("🔴 MongoDB connection failed. Falling back to JSON database...", err.message);
      }
    } else {
      console.warn("⚠️ No MONGODB_URI found. Falling back to local JSON database storage.");
    }

    // Fallback JSON DB Assignment
    db.Project = new JsonModel("projects", defaultProjects);
    db.Skill = new JsonModel("skills", defaultSkills);
    db.Experience = new JsonModel("experiences", defaultExperiences);
    db.User = new JsonModel("users", defaultUsers);
    db.Message = new JsonModel("messages", []);
    console.log("📂 JSON Database initialized. Data stored in: " + dataDir);
  },
};

module.exports = db;
