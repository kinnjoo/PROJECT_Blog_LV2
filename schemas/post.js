const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  nickname: {
    type: String,
    ref: "User"
  },
  title: {
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
  }
});

module.exports = mongoose.model("Posts", postSchema);