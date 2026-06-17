const API_BASE_URL = "http://localhost:5001/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

export const api = {
  // Authentication API
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
      });
      return handleResponse(res);
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

  // Projects API
  projects: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (projectData) => {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(projectData),
      });
      return handleResponse(res);
    },
    update: async (id, projectData) => {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(projectData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Skills API
  skills: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/skills`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (skillData) => {
      const res = await fetch(`${API_BASE_URL}/skills`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(skillData),
      });
      return handleResponse(res);
    },
    update: async (id, skillData) => {
      const res = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(skillData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Experiences API
  experiences: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/experiences`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (experienceData) => {
      const res = await fetch(`${API_BASE_URL}/experiences`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(experienceData),
      });
      return handleResponse(res);
    },
    update: async (id, experienceData) => {
      const res = await fetch(`${API_BASE_URL}/experiences/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(experienceData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/experiences/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Messages API
  messages: {
    submit: async (messageData) => {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(messageData),
      });
      return handleResponse(res);
    },
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/messages/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
