# Deployment Guide - Jainish Khunt Portfolio (MERN Stack)

This document provides step-by-step instructions for deploying your dynamic portfolio application to production.

---

## 1. MongoDB Atlas Setup (Database)

1. Sign in or create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project and build a database cluster using the **Shared Free Tier**.
3. Select your provider (AWS/GCP) and region closest to your audience.
4. **Database Access Security**:
   - Create a database user (e.g. `jainish_admin`) and set a secure password.
5. **Network Access Security**:
   - Add an IP access entry. For Render hosting, add `0.0.0.0/24` (allow access from anywhere) or whitelist specific Render outbound IPs to ensure the database is accessible by the backend.
6. Click **Connect** on your cluster, select **Connect your application (Drivers)**, copy the connection string, and replace `<password>` with your database user's password.
   - Example connection string: `mongodb+srv://jainish_admin:<password>@cluster0.abcde.mongodb.net/portfolio?retryWrites=true&w=majority`

---

## 2. Backend Deployment on Render

1. Sign in to [Render](https://render.com) using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Link your GitHub repository.
4. **Configure the Web Service Settings**:
   - **Name**: `jainish-portfolio-backend`
   - **Environment**: `Node`
   - **Root Directory**: `portfolio/server` *(Very Important)*
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. **Environment Variables**:
   Click the **Environment** tab on Render and add the following keys:
   - `PORT` = `10000` (Render binds automatically, but setting this is safe)
   - `MONGO_URI` = *Your MongoDB Atlas connection string*
   - `JWT_SECRET` = *A long, secure random string for JWT signatures*
   - `ADMIN_EMAIL` = `khuntjainish48@gmail.com`
   - `ADMIN_PASSWORD` = *A strong password for your admin login*
   - `CLIENT_URL` = `https://your-frontend-url.netlify.app` *(Update this after deploying the frontend)*
   - `NODE_ENV` = `production`
   - *(Optional)* Add Cloudinary API keys and SMTP keys if you configured remote uploads and email triggers.
6. Click **Deploy Web Service**.
   > [!NOTE]
   > Render's Free Tier spins down web services after 15 minutes of inactivity. When a user visits your portfolio after a period of quiet, there may be a **cold start delay of 50-90 seconds** while the server spins back up.

---

## 3. Frontend Deployment on Netlify

1. Sign in to [Netlify](https://www.netlify.com).
2. Click **Add new site** -> **Import an existing project** and connect to your GitHub repository.
3. **Configure the Site Build Settings**:
   - **Base Directory**: `portfolio/client` *(Very Important)*
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist` (Netlify resolves this relative to the base directory: `portfolio/client/dist`)
4. **Environment Variables**:
   Under Site Configuration -> Environment Variables, add:
   - `VITE_API_BASE_URL` = *Your live Render Web Service URL* (e.g., `https://jainish-portfolio-backend.onrender.com`)
5. Click **Deploy site**.
6. **React Router Redirects Config**:
   To prevent `404 Not Found` errors when refreshing routes on Netlify (e.g. going directly to `/admin/dashboard`), we must supply a `_redirects` file in the build.
   - We have configured Vite to automatically generate or copy a `_redirects` file containing:
     ```
     /* /index.html 200
     ```
     This instructs Netlify to route all incoming traffic to the React index page.

---

## 4. Post-Deployment Database Seeding

Once the database and server are live, you can populate the remote database with your real experience, skills, and projects by running the seed script from your local machine:

1. Open `portfolio/server/.env` on your local machine.
2. Temporarily set `MONGODB_URI` to your production MongoDB Atlas connection string.
3. Run the following command in the server folder:
   ```bash
   node seed/seed.js
   ```
4. Verify the database tables inside MongoDB Atlas. Once seeded, you can change your local `.env` back to local database strings.
