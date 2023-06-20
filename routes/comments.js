const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// 댓글 목록 조회 API
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comments.find({ postId }).sort({ createdAt: -1 });

  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const findPostId = await Posts.findOne({ _id: postId });
  if (findPostId) {
    const commentList = comments.map((comment) => {
      return {
        commentId: comment._id,
        user: comment.user,
        content: comment.content,
        createdAt: comment.createdAt,
        postId: comment.postId
      }
    })
    res.status(200).json({ comments: commentList });
  } else {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }
});

// 댓글 작성 API
router.post("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const { user, password, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  } else if (!ObjectId.isValid(postId) || !user || !password || !content) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  } else {
    await Comments.create({ user, password, content, postId });
    return res.status(200).json({ message: "댓글을 생성하였습니다." });
  }
})

// 댓글 수정 API
router.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { user, password, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  } else if (!ObjectId.isValid(commentId) || !user || !password || !content) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const findCommentId = await Comments.findOne({ _id: commentId });

  if (!findCommentId) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  } else if (findCommentId.password === password) {
    await Comments.updateOne({ user, password, content });
    return res.status(200).json({ message: "댓글을 수정하였습니다." });
  } else {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
})

// 댓글 삭제 API
router.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;

  if (!ObjectId.isValid(commentId) || !password) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const findCommentId = await Comments.findOne({ _id: commentId });

  if (!findCommentId) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  } else if (findCommentId.password === password) {
    await Comments.deleteOne({ _id: commentId });
    return res.status(200).json({ message: "댓글을 삭제하였습니다." });
  } else {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
})

module.exports = router;