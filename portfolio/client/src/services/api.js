import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Axios Request Interceptor - attaches JWT token if logged in
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  // Auth REST Endpoints
  auth: {
    login: async (username, password) => {
      const res = await API.post("/auth/login", { username, password });
      return res.data;
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    isAuthenticated: () => {
      return !!localStorage.getItem("token");
    },
    getCurrentUser: () => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch (e) {
        return null;
      }
    },
  },

  // Profile REST Endpoints
  profile: {
    get: async () => {
      const res = await API.get("/profile");
      return res.data;
    },
    update: async (profileFormData) => {
      // Expects FormData object due to photo & resume uploads
      const res = await API.put("/profile", profileFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
  },

  // Projects CRUD Endpoints
  projects: {
    getAll: async () => {
      const res = await API.get("/projects");
      return res.data;
    },
    create: async (projectFormData) => {
      const res = await API.post("/projects", projectFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    update: async (id, projectFormData) => {
      const res = await API.put(`/projects/${id}`, projectFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    delete: async (id) => {
      const res = await API.delete(`/projects/${id}`);
      return res.data;
    },
  },

  // Skills CRUD Endpoints
  skills: {
    getAll: async () => {
      const res = await API.get("/skills");
      return res.data;
    },
    create: async (skillData) => {
      const res = await API.post("/skills", skillData);
      return res.data;
    },
    update: async (id, skillData) => {
      const res = await API.put(`/skills/${id}`, skillData);
      return res.data;
    },
    delete: async (id) => {
      const res = await API.delete(`/skills/${id}`);
      return res.data;
    },
  },

  // Experiences CRUD Endpoints
  experiences: {
    getAll: async () => {
      const res = await API.get("/experiences");
      return res.data;
    },
    create: async (expData) => {
      const res = await API.post("/experiences", expData);
      return res.data;
    },
    update: async (id, expData) => {
      const res = await API.put(`/experiences/${id}`, expData);
      return res.data;
    },
    delete: async (id) => {
      const res = await API.delete(`/experiences/${id}`);
      return res.data;
    },
  },

  // Certifications CRUD Endpoints
  certifications: {
    getAll: async () => {
      const res = await API.get("/certifications");
      return res.data;
    },
    create: async (certData) => {
      const res = await API.post("/certifications", certData);
      return res.data;
    },
    update: async (id, certData) => {
      const res = await API.put(`/certifications/${id}`, certData);
      return res.data;
    },
    delete: async (id) => {
      const res = await API.delete(`/certifications/${id}`);
      return res.data;
    },
  },

  // Education CRUD Endpoints
  education: {
    getAll: async () => {
      const res = await API.get("/education");
      return res.data;
    },
    create: async (eduData) => {
      const res = await API.post("/education", eduData);
      return res.data;
    },
    update: async (id, eduData) => {
      const res = await API.put(`/education/${id}`, eduData);
      return res.data;
    },
    delete: async (id) => {
      const res = await API.delete(`/education/${id}`);
      return res.data;
    },
  },

  // Messages/Inquiries Endpoints
  messages: {
    submit: async (msgData) => {
      const res = await API.post("/messages", msgData);
      return res.data;
    },
    getAll: async () => {
      const res = await API.get("/messages");
      return res.data;
    },
    markAsRead: async (id) => {
      const res = await API.put(`/messages/${id}/read`);
      return res.data;
    },
    delete: async (id) => {
      const res = await API.delete(`/messages/${id}`);
      return res.data;
    },
  },
};
