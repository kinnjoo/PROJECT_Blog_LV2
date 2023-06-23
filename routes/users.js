const express = require("express");
const router = express.Router();

const User = require("../schemas/user.js");

// 회원 가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  // 3가지 항목 입력하지 않을시 오류
  if (!nickname || !password || !confirmPassword) {
    return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  // 닉네임 : 최소 3자 이상, 알파벳 대소문자, 숫자로 구성
  // 알파벳, 숫자로만 구성 조건 추가
  if (nickname.length < 3) {
    return res.status(412).json({ errorMessage: "닉네임의 형식이 올바르지 않습니다." });
  }

  // 패스워드 : 최소 4자 이상, 닉네임과 같을 시 오류
  // 패스워드와 닉네임 일치 아닌 패스워드에 닉네임 포함으로 오류 값 수정
  if (password.length < 4) {
    return res.status(412).json(({ errorMessage: "패스워드 형식이 올바르지 않습니다." }));
  } else if (password === nickname) {
    return res.status(412).json(({ errorMessage: "패스워드는 닉네임과 다르게 설정해야 합니다." }));
  } else if (password !== confirmPassword) {
    return res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
  }

  // DB에 존재하는 닉네임 입력시 오류
  const isExistUser = await User.findOne({ nickname });

  if (isExistUser) {
    return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
  }

  // DB에 회원가입 정보 저장하기
  // 패스워드 암호화해서 저장하기 -> crypto 라이브러리 사용
  const user = new User({ nickname, password });
  await user.save();

  return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
});

module.exports = router;