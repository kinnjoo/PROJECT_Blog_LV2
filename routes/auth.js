const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../schemas/user.js");

// 로그인 API
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  // 닉네임 일치하는 유저 찾기
  const user = await User.findOne({ nickname });

  // 닉네임 일치하지 않거나 패스워드 일치하지 않을때
  if (!user || user.password !== password) {
    return res.status(412).json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." })
  }

  // JWT 생성
  const token = jwt.sign({ userId: user._id }, "customized-secret-key");

  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});

module.exports = router;