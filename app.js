const express = require("express");
const app = express();
const port = 3000;

const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");

const connent = require("./schemas");
connent();

app.use(express.json());

app.use("/", [postsRouter, commentsRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});