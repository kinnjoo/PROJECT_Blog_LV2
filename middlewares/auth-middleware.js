const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;

  // Authorization 쿠키가 존재하지 않았을때를 대비
  const [authType, authToken] = (Authorization ?? "").split(" ");

  // authType === Bearer 값인지 확인
  // authToken 검증
  if (authType !== "Bearer" || !authToken) {
    return res.status(400).json({ errorMessage: "로그인 후에 이용할 수 있는 기능입니다." });
  }

  // JWT 검증
  try {
    // authToken이 만료되었는지 확인
    // authToken이 서버가 발급한 토큰이 맞는지 검증
    const { userId } = jwt.verify(authToken, "customized-secret-key");

    // authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
    const user = await User.findById(userId);
    res.locals.user = user;
    console.log(res.locals.user);

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ errorMessage: "로그인 후에 이용할 수 있는 기능입니다." });
    return;
  }
};