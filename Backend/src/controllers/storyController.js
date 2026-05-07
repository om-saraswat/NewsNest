const Story = require("../models/Story");
const User = require("../models/User");

/**
 * @desc    Fetch all stories sorted by points (descending)
 * @route   GET /api/stories
 * @access  Public
 */
const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1 }).skip(skip).limit(limit).lean(),
      Story.countDocuments(),
    ]);

    res.json({
      stories,
      page,
      totalPages: Math.ceil(total / limit),
      totalStories: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories" });
  }
};

/**
 * @desc    Fetch a single story by ID
 * @route   GET /api/stories/:id
 * @access  Public
 */
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(story);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid story ID" });
    }
    res.status(500).json({ message: "Error fetching story" });
  }
};

/**
 * @desc    Toggle bookmark on a story (add/remove)
 * @route   POST /api/stories/:id/bookmark
 * @access  Private (requires auth)
 */
const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    // Verify story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const user = await User.findById(userId);
    const bookmarkIndex = user.bookmarks.findIndex(id => id.toString() === storyId.toString());

    if (bookmarkIndex === -1) {
      // Add bookmark
      user.bookmarks.push(storyId);
      await user.save();
      res.json({ message: "Story bookmarked", bookmarked: true, bookmarks: user.bookmarks });
    } else {
      // Remove bookmark
      user.bookmarks.splice(bookmarkIndex, 1);
      await user.save();
      res.json({ message: "Bookmark removed", bookmarked: false, bookmarks: user.bookmarks });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid story ID" });
    }
    res.status(500).json({ message: "Error toggling bookmark" });
  }
};

/**
 * @desc    Get user's bookmarked stories
 * @route   GET /api/stories/my/bookmarks
 * @access  Private
 */
const getBookmarkedStories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookmarked stories" });
  }
};

module.exports = { getStories, getStoryById, toggleBookmark, getBookmarkedStories };
