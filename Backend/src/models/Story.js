const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      default: "Unknown",
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: "Hacker News",
    },
    hnId: {
      type: Number,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Index for sorting by points efficiently
storySchema.index({ points: -1 });

module.exports = mongoose.model("Story", storySchema);
