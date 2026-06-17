# Jainish Khunt - MERN Stack Dynamic Personal Portfolio & CMS

A complete, production-grade, fully dynamic personal portfolio website built using the **MERN Stack** (MongoDB, Express, React, Node.js). All public page data—including profile metadata, catalogued skills, career timelines, project grids, education history, and certification cards—is loaded dynamically from a database and managed via a secured administrative dashboard.

---

## 🛠️ Tech Stack & Badges

- **Frontend**: ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
- **Backend**: ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
- **Database**: ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
- **Media Uploads**: Multer & Cloudinary
- **Emails**: Nodemailer SMTP
- **State Management**: Zustand
- **Dev Servers Tooling**: Vite

---

## 📂 Project Directory Structure

```
portfolio/
├── DEPLOYMENT.md            # Detailed hosting instructions (Render, Netlify, MongoDB Atlas)
├── .gitignore                # Folder-level gitignore rules
├── client/                   # React.js SPA (Vite configuration)
│   ├── .env.example          # Client environment configurations
│   ├── public/               # Static public assets (including _redirects for Netlify)
│   └── src/
│       ├── components/       # Shared UI (Navbar, Footer, AdminLayout, Toast alerts)
│       ├── services/         # Axios interceptor API controllers
│       ├── store/            # Zustand stores (useThemeStore dark/light mode toggle)
│       └── pages/            # Public sheets & Admin CMS CRUD panels
└── server/                   # Express.js API
    ├── .env.example          # Backend environment variables example
    ├── config/               # Database, SMTP mailer configurations
    ├── middleware/           # Token validation & Multer upload middlewares
    ├── models/               # Profile, Skill, Experience, Project, Certification, Education schemas
    ├── routes/               # Express routing dispatchers
    ├── controllers/          # CRUD controllers implementing Mongoose operations
    └── seed/                 # seed.js database seeder script
```

---

## 📦 Local Installation & Running Instructions

### 1. Prerequisite Setup

Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/Jainish-NK/Jainish-NK-event-talks-app.git
cd Jainish-NK-event-talks-app/portfolio
```

### 2. Configure Environment Files

Create local `.env` files in both the client and server directories:

- In **`portfolio/server/`**, create a `.env` file based on `server/.env.example`:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_atlas_connection_string
  JWT_SECRET=your_long_random_jwt_secret_phrase
  ADMIN_EMAIL=khuntjainish48@gmail.com
  ADMIN_PASSWORD=your_custom_admin_password
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
  SMTP_EMAIL=
  SMTP_PASSWORD=
  CLIENT_URL=http://localhost:5173
  ```

- In **`portfolio/client/`**, create a `.env` file based on `client/.env.example`:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

### 3. Install Dependencies

Install packages for both backend and frontend:
```bash
# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
```

### 4. Seed Database

To populate the database with Jainish Khunt's real experience, education, skills, and projects, run the seeder script inside the `portfolio/server` folder:
```bash
cd ../server
npm run seed
```

### 5. Launch Development Servers

Start both services concurrently:

- **Start Backend** (inside `portfolio/server`):
  ```bash
  npm run dev
  ```
- **Start Frontend** (inside `portfolio/client`):
  ```bash
  npm run dev
  ```

Once started, open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔒 CMS Admin Panel Credentials
- Login Page: **[http://localhost:5173/admin/login](http://localhost:5173/admin/login)**
- Default Username: `admin`
- Default Password: `admin123`

---

## 🔗 Live Demo Links
- **Frontend App (Netlify/Vercel)**: `https://your-frontend-url.netlify.app` *(To be filled after deployment)*
- **Backend API (Render)**: `https://your-backend-url.onrender.com` *(To be filled after deployment)*

---

## 📸 Screenshots Placeholders

### 🖥️ Desktop UI (Home & About)
```
[Insert Desktop Home Screenshot here]
```

### 📱 Responsive Mobile Views
```
[Insert Mobile Responsive views screenshot here]
```

### 🔐 Administrative Dashboard (CMS)
```
[Insert Admin Login and Dashboard screenshot here]
```

