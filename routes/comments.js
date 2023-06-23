const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 댓글 목록 조회 API
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  const comments = await Comments.find({}).sort({ createdAt: -1 });

  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "postId 형식이 올바르지 않습니다." });
  }

  const findPostId = await Posts.findOne({ _id: postId });

  if (findPostId) {
    const commentList = comments.map((comment) => {
      return {
        commentId: comment._id,
        nickname: comment.nickname,
        content: comment.content,
        createdAt: comment.createdAt,
        postId: comment.postId
      }
    })
    res.status(200).json({ comments: commentList });
  } else {
    res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  }
});

// 댓글 작성 API
router.post("/comments/:postId", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  const { postId } = req.params;
  const { content } = req.body;

  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "postId 형식이 올바르지 않습니다." });
  }

  const findPostId = await Posts.findOne({ _id: postId });

  if (!findPostId) {
    return res.status(404).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  } else if (!content) {
    return res.status(412).json({ errorMessage: "댓글 내용이 비어있습니다." });
  } else {
    await Comments.create({ content, nickname });
    return res.status(200).json({ message: "댓글을 생성하였습니다." });
  }
});

// 댓글 수정 API
router.put("/comments/:commentId", authMiddleware, async (req, res) => {
  const user = res.locals.user;
  const { commentId } = req.params;
  const { content } = req.body;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ errorMessage: "commentId 형식이 올바르지 않습니다." });
  }

  const findCommentId = await Comments.findOne({ _id: commentId });

  if (!findCommentId) {
    return res.status(404).json({ errorMessage: "댓글 조회에 실패하였습니다." });
  } else if (user.nickname !== findCommentId.nickname) {
    return res.status(403).json({ errorMessage: "댓글의 수정 권한이 존재하지 않습니다." });
  } else if (!content) {
    return res.status(412).json({ errorMessage: "댓글 내용이 비어있습니다." });
  } else {
    await Comments.updateOne(
      { _id: commentId },
      { $set: { content } });
    return res.status(200).json({ message: "댓글을 수정하였습니다." });
  }
});

// 댓글 삭제 API
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
  const user = res.locals.user;
  const { commentId } = req.params;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "commentId 형식이 올바르지 않습니다." });
  }

  const findCommentId = await Comments.findOne({ _id: commentId });

  if (!findCommentId) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  } else if (user.nickname !== findCommentId.nickname) {
    return res.status(403).json({ message: "댓글의 삭제 권한이 존재하지 않습니다." });
  } else {
    await Comments.deleteOne({ _id: commentId });
    return res.status(200).json({ message: "댓글을 삭제하였습니다." });
  }
});

module.exports = router;