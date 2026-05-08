# NewsNest


**Live Demo:** [https://news-nest-gules.vercel.app](https://news-nest-gules.vercel.app)

NewsNest is a full-stack web application that allows users to discover news stories, authenticate, and manage their saved bookmarks.

## Tech Stack
- **Frontend:** React 19, Vite, React Router DOM, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs, Cheerio

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

## Environment Variables

To run this project, you will need to add environment variables to both the backend and frontend.

### Backend (`Backend/.env`)
Create a `.env` file in the `Backend` directory and add the following variables:

```env
# The port your backend server will run on
PORT=5001

# Your MongoDB connection string
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=Cluster0"

# Secret key for signing JSON Web Tokens
JWT_SECRET="your_super_secret_jwt_key_change_in_production"

# CORS allowed origins (Frontend URL)
ALLOWED_ORIGINS="http://localhost:5173/"
```

### Frontend (`Frontend/frontend/.env`)
Create a `.env` file in the `Frontend/frontend` directory and add the following variables:

```env
# The URL of your backend API
VITE_API_URL="http://localhost:5001/api"
```
*(Note: Change the URL to your production backend URL when deploying, e.g., `https://newsnest-09tm.onrender.com/api`)*

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd NewsNest
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../Frontend/frontend
npm install
```

## How to Run the Project Locally

You will need to start both the backend and frontend development servers to run the full application.

### 1. Start the Backend Server
Open a terminal window, navigate to the backend directory, and run the development server (this uses `nodemon` for auto-reloading):
```bash
cd Backend
npm run dev
```
The backend server should now be running on `http://localhost:5001`.

### 2. Start the Frontend Server
Open a new terminal window, navigate to the frontend directory, and run the Vite development server:
```bash
cd Frontend/frontend
npm run dev
```
The frontend should now be accessible in your browser at `http://localhost:5173`.

## Core Features
- **User Authentication:** Secure login and registration flows utilizing JWT and bcrypt password hashing.
- **Bookmark Management:** Protected routes that allow authenticated users to save and retrieve their favorite stories.
- **Story Fetching:** Backend endpoints that scrape or fetch news stories using Cheerio.
- **RESTful API:** Clean API structure with robust error handling and Mongoose integration.
