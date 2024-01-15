const express = require("express");
const {
  postQuestions,
  allQuestions,
  singleQuestions,
} = require("../controller/questionController");
const router = express.Router();
//post questions routes
router.post("/post_question", postQuestions);
//all questions routes
router.get("/all-questions", allQuestions);
//single questions routes
router.get("/question/:questionid", singleQuestions);
module.exports = router;

// *************************************************
// const express = require("express");
// const router = express.Router();

// const {
//   postQuestions,
//   allQuestions,
//   singleQuestions,
// } = require("../../server/controller/questionController");

// // - Post a new question route:
// router.post("/post_question", postQuestions);

// // - Get all questions routes:
// router.get("/all-questions", allQuestions);

// // - Single questions by an id route:
// router.get("/single-question/:questionid", singleQuestions);

// module.exports = router;

// // router.get("/post-question", (req, res) => {
// //   res.send("post questions");
// // })
