const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  postId: {
    type: String
  }
});

module.exports = mongoose.model("Comment", commentSchema);