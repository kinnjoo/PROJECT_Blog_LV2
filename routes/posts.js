const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
  const posts = await Posts.find({}).sort({ createdAt: -1 });

  const postList = posts.map((post) => {
    return {
      postId: post._id,
      user: post.user,
      title: post.title,
      createdAt: post.createdAt
    }
  })
  res.status(200).json({ posts: postList });
})

// 게시글 상세 조회 API
router.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  if (!ObjectId.isValid(postId)) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const detail = await Posts.findOne({ _id: postId });

  if (detail) {
    res.send({
      postId: detail._id,
      user: detail.user,
      title: detail.title,
      content: detail.content,
      createdAt: detail.createdAt
    })
  } else {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  }
})

// 게시글 작성 API
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;

  if (user && password && title && content) {
    await Posts.create({ user, password, title, content });
    return res.status(200).json({ message: "게시글을 생성하였습니다." });
  } else {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
})

// 게시글 수정 API
router.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { user, password, title, content } = req.body;

  if (!ObjectId.isValid(postId) || !user || !password || !title || !content) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const findPostId = await Posts.findOne({ _id: postId });

  if (!findPostId) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다." })
  } else if (findPostId.password === password) {
    await Posts.updateOne({ user, password, title, content });
    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } else {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
})

// 게시글 삭제 API
router.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  if (!ObjectId.isValid(postId) || !password) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const findPostId = await Posts.findOne({ _id: postId });

  if (!findPostId) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  } else if (findPostId.password === password) {
    await Posts.deleteOne({ _id: postId });
    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } else {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
})

module.exports = router;