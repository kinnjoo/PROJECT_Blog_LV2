const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  nickname: {
    type: String,
    ref: "User"
  },
  password: {
    type: String,
    ref: "User"
  },
  // userId: {
  //   type: String,
  //   ref: "User"
  // },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
});

module.exports = mongoose.model("Comment", commentSchema);