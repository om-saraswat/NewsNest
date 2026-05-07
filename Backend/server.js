const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
const { scrapeHackerNews } = require("./src/services/scraper");

const app = express();
const PORT = process.env.PORT || 5001;

// ── CORS Configuration ──────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:5173,https://news-nest-gules.vercel.app").split(",");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// ── Middleware ──────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ── Start server ───────────────────────────────────────
const startServer = async () => {
  let dbConnected = false;

  try {
    await connectDB();
    dbConnected = true;
  } catch (error) {
    console.error("⚠️  MongoDB not connected — server starting without database");
    console.error("   Set MONGODB_URI in .env to a valid MongoDB connection string");
  }

  // Only scrape if DB is connected
  if (dbConnected) {
    try {
      await scrapeHackerNews();
    } catch (error) {
      console.error("Initial scrape failed, continuing without data:", error.message);
    }

    // Re-scrape every 10 minutes
    setInterval(scrapeHackerNews, 10 * 60 * 1000);
  }

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (!dbConnected) {
      console.log("⚠️  Database not connected — API calls requiring DB will fail");
    }
  });

  // Graceful shutdown for nodemon restarts
  process.on("SIGTERM", () => server.close());
  process.on("SIGINT", () => server.close());
};

startServer();
