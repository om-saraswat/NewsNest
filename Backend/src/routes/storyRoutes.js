const express = require("express");
const {
  getStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
} = require("../controllers/storyController");
const protect = require("../middleware/auth");

const router = express.Router();

// GET /api/stories
router.get("/", getStories);

// GET /api/stories/my/bookmarks
router.get("/my/bookmarks", protect, getBookmarkedStories);

// GET /api/stories/:id
router.get("/:id", getStoryById);

// POST /api/stories/:id/bookmark (auth required)
router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;
