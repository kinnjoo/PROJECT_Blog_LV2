const express = require("express");
const router = express.Router();

const User = require("../schemas/user.js");

// 회원 가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  // 닉네임 : 알파벳 대소문자(a~z, A~Z), 숫자(0~9), 최소 3자 이상
  const checkNickname = /^[a-zA-Z0-9]{3,}$/;

  // DB에 존재하는 닉네임 입력시 오류
  const isExistUser = await User.findOne({ nickname });

  // 닉네임 : 형식 checkNickname으로 확인, DB에 존재하는지 확인
  // 패스워드 : 4자 이상, 닉네임 포함하지 않음
  // 3가지 항목 입력하지 않을시 오류
  if (!nickname || !password || !confirmPassword) {
    return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  } else if (!checkNickname.test(nickname)) {
    return res.status(412).json({ errorMessage: "닉네임의 형식이 올바르지 않습니다." });
  } else if (isExistUser) {
    return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
  } else if (password.includes(nickname)) {
    return res.status(412).json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
  } else if (password.length < 4) {
    return res.status(412).json(({ errorMessage: "패스워드 형식이 올바르지 않습니다." }));
  } else if (password !== confirmPassword) {
    return res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
  }

  // DB에 회원가입 정보 저장하기
  const user = new User({ nickname, password });
  await user.save();

  return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
});

module.exports = router;