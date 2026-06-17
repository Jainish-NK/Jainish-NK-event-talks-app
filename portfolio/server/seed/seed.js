require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Import models
const Admin = require("../models/Admin");
const Profile = require("../models/Profile");
const Skill = require("../models/Skill");
const Experience = require("../models/Experience");
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const Education = require("../models/Education");

// Real Content Data from Section 1
const profileData = {
  name: "Jainish Khunt",
  title: "AI / ML Engineer & Full-Stack Developer",
  tagline: "Crafting Neural Intelligence & Web Architectures.",
  summary: "AI/ML engineering student actively pursuing a B.Tech and building full-stack web solutions. Experienced in developing machine learning models for early health prediction and agricultural crop production forecasting. Deeply passionate about deep learning, cloud computing, and startup innovation.",
  profilePhotoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
  resumeUrl: "https://jainish-khunt-portfolio.netlify.app/Jainish_Khunt_Resume.pdf" // Placeholder or actual link
};

const skillsData = [
  // Languages & Tools
  { name: "Python", category: "Languages & Tools", level: 90, iconName: "fa-brands fa-python" },
  { name: "JavaScript", category: "Languages & Tools", level: 85, iconName: "fa-brands fa-js" },
  { name: "C / C++", category: "Languages & Tools", level: 80, iconName: "fa-solid fa-code" },
  { name: "Java", category: "Languages & Tools", level: 75, iconName: "fa-brands fa-java" },
  { name: "SQL", category: "Languages & Tools", level: 80, iconName: "fa-solid fa-database" },
  { name: "Git & GitHub", category: "Languages & Tools", level: 85, iconName: "fa-brands fa-github" },
  { name: "VS Code", category: "Languages & Tools", level: 90, iconName: "fa-solid fa-laptop-code" },
  { name: "Jupyter & Colab", category: "Languages & Tools", level: 90, iconName: "fa-solid fa-chart-line" },

  // AI / Machine Learning
  { name: "Scikit-Learn", category: "AI / Machine Learning", level: 85, iconName: "fa-solid fa-brain" },
  { name: "XGBoost", category: "AI / Machine Learning", level: 80, iconName: "fa-solid fa-bolt" },
  { name: "Supervised & Unsupervised Learning", category: "AI / Machine Learning", level: 85, iconName: "fa-solid fa-diagram-project" },
  { name: "Feature Engineering & Selection", category: "AI / Machine Learning", level: 80, iconName: "fa-solid fa-sliders" },
  { name: "Deep Learning & NLP Fundamentals", category: "AI / Machine Learning", level: 75, iconName: "fa-solid fa-network-wired" },
  { name: "LLMs & RAG Pipelines (learning)", category: "AI / Machine Learning", level: 70, iconName: "fa-solid fa-robot" },

  // Data Science
  { name: "NumPy & Pandas", category: "Data Science", level: 90, iconName: "fa-solid fa-table" },
  { name: "Matplotlib & Seaborn", category: "Data Science", level: 85, iconName: "fa-solid fa-chart-simple" },
  { name: "EDA & Data Cleaning", category: "Data Science", level: 88, iconName: "fa-solid fa-broom" },
  { name: "Statistical Analysis", category: "Data Science", level: 80, iconName: "fa-solid fa-calculator" },

  // Backend & Deployment
  { name: "FastAPI", category: "Backend & Deployment", level: 85, iconName: "fa-solid fa-bolt" },
  { name: "Node.js & Express", category: "Backend & Deployment", level: 80, iconName: "fa-brands fa-node-js" },
  { name: "MongoDB & Firebase", category: "Backend & Deployment", level: 80, iconName: "fa-solid fa-server" },
  { name: "REST APIs", category: "Backend & Deployment", level: 85, iconName: "fa-solid fa-gears" }
];

const experiencesData = [
  {
    company: "Grownited Pvt. Ltd., Ahmedabad",
    role: "AI/ML Intern",
    location: "Ahmedabad, Gujarat, India",
    startDate: "May 2025",
    endDate: "Jul 2025",
    bulletPoints: [
      "Developed LifeLine AI, an ML-powered Health Prediction System covering 3 disease categories (Alzheimer's, Diabetes, Cancer) for early risk assessment.",
      "Trained and deployed 3+ ML models using Python, Pandas, NumPy, Scikit-Learn; integrated FastAPI backend with Firebase for cloud-based storage and authentication.",
      "Contributed to model training, evaluation, documentation, and QA, ensuring on-time deployment."
    ],
    companyLogoUrl: ""
  },
  {
    company: "Royal Technosoft Pvt. Ltd., Ahmedabad",
    role: "Apprenticeship Trainee",
    location: "Ahmedabad, Gujarat, India",
    startDate: "Jul 2024",
    endDate: "Present",
    bulletPoints: [
      "Trained in Full Stack Development and AI/ML fundamentals through practical workshops.",
      "Contributed to collaborative projects, technical presentations, software testing, and documentation."
    ],
    companyLogoUrl: ""
  }
];

const projectsData = [
  {
    title: "CropYield AI - Smart Crop Production Predictor",
    description: "AI-powered platform predicting agricultural crop yields based on soil and weather parameters.",
    longDescription: "An AI-driven solution tailored for precision agriculture. Using parameters like soil profile (N, P, K), rainfall, temperature, and region, it outputs recommendations for ideal crop choices and predicts estimated yields using regression algorithms. Aims to minimize crop failures and optimize harvesting outputs.",
    techStack: ["Python", "Pandas", "Scikit-Learn", "FastAPI", "React.js", "Tailwind CSS"],
    liveDemoUrl: "https://github.com/Jainish-NK",
    githubUrl: "https://github.com/Jainish-NK",
    apiDocsUrl: "",
    thumbnailImageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    metrics: "96.49% R² Score"
  },
  {
    title: "LifeLine AI - Health Prediction System",
    description: "Multi-disease healthcare platform predicting risks across Alzheimer's, Diabetes, and Cancer.",
    longDescription: "A smart health assessment engine designed to predict medical condition risks using machine learning classification algorithms. Recruits disease-specific physiological markers to compute early risk profiles, saving user screening reports on Firebase Cloud Storage for instant analysis. Supports Alzheimer's, Diabetes, and Cancer datasets.",
    techStack: ["Python", "Scikit-Learn", "FastAPI", "Firebase", "React.js", "Zustand", "Tailwind CSS"],
    liveDemoUrl: "https://github.com/Jainish-NK",
    githubUrl: "https://github.com/Jainish-NK",
    apiDocsUrl: "",
    thumbnailImageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    metrics: "Early Screening ML Models"
  }
];

const certificationsData = [
  { title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate", issuer: "Oracle", date: "2025", credentialUrl: "" },
  { title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional", issuer: "Oracle", date: "2025", credentialUrl: "" },
  { title: "Oracle Cloud Infrastructure 2025 Certified Data Science Professional", issuer: "Oracle", date: "2025", credentialUrl: "" },
  { title: "Oracle Fusion AI Agent Studio Certificate", issuer: "Oracle", date: "2025", credentialUrl: "" },
  { title: "TCS iON Career Edge Certification", issuer: "TCS iON", date: "2024", credentialUrl: "" },
  { title: "Building with Claude API Course", issuer: "Anthropic", date: "2024", credentialUrl: "" },
  { title: "AI & Machine Learning Engineer Foundation Course", issuer: "Reliance Foundation", date: "2024", credentialUrl: "" },
  { title: "Python 101 for Data Science", issuer: "IBM Developer Skills Network", date: "2023", credentialUrl: "" },
  { title: "Full Stack & AI/ML Fundamentals Certificates", issuer: "Royal Technosoft Pvt. Ltd.", date: "2024", credentialUrl: "" }
];

const educationData = [
  {
    institution: "JG University, Ahmedabad",
    degree: "B.Tech in AI & ML (Semester 4 pursuing)",
    duration: "Aug 2024 - Present",
    score: "8.0/10 CGPA (Sem 3)",
    level: "college"
  },
  {
    institution: "Vedant International School, GSEB",
    degree: "Class XII (Science)",
    duration: "2023 - 2024",
    score: "Completed",
    level: "school"
  },
  {
    institution: "Swaminarayan Dham International School, GSEB",
    degree: "Class X",
    duration: "2021 - 2022",
    score: "Completed",
    level: "school"
  }
];

// Seeding Script logic
const runSeeder = async () => {
  const adminPassword = bcrypt.hashSync("admin123", 10);
  const adminUser = { username: "admin", password: adminPassword };

  // 1. Fallback JSON seeder
  const dataDir = path.join(__dirname, "../.data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const writeJson = (filename, data) => {
    // Generate unique ID placeholders for local json
    const seeded = Array.isArray(data)
      ? data.map((d, index) => ({ _id: `seed_${filename}_${index}`, createdAt: new Date().toISOString(), ...d }))
      : { _id: `seed_${filename}`, createdAt: new Date().toISOString(), ...data };
      
    fs.writeFileSync(path.join(dataDir, `${filename}.json`), JSON.stringify(seeded, null, 2));
  };

  writeJson("users", [adminUser]);
  writeJson("projects", projectsData);
  writeJson("skills", skillsData);
  writeJson("experiences", experiencesData);
  writeJson("certifications", certificationsData);
  writeJson("education", educationData);
  writeJson("profiles", profileData);
  writeJson("messages", []);

  console.log("📂 Local JSON seed database files written successfully to server/.data/");

  // 2. MongoDB Atlas seeder
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log("⚠️ MONGODB_URI not set. Skipping MongoDB seeding (using local JSON fallback instead).");
    process.exit(0);
  }

  try {
    console.log("⏳ Connecting to MongoDB Atlas for database seeding...");
    await mongoose.connect(mongoUri);

    // Clear existing collections
    await Promise.all([
      Admin.deleteMany({}),
      Profile.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Project.deleteMany({}),
      Certification.deleteMany({}),
      Education.deleteMany({})
    ]);

    // Create seeder collections
    await Admin.create(adminUser);
    await Profile.create(profileData);
    await Skill.insertMany(skillsData);
    await Experience.insertMany(experiencesData);
    await Project.insertMany(projectsData);
    await Certification.insertMany(certificationsData);
    await Education.insertMany(educationData);

    console.log("🟢 MongoDB Atlas collections seeded successfully with Jainish Khunt's details!");
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("🔴 Seeding error during MongoDB connection:", err.message);
    process.exit(1);
  }
};

runSeeder();
