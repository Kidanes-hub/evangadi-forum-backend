const express = require("express");
const router = express.Router();

const { post_answer, all_answer } = require("../controller/answerController");

router.post("/postanswer/:questionid", post_answer);
router.get("/allanswer/:questionid", all_answer);

module.exports = router;

// ********************************************************

// const express = require("express");
// const router = express.Router();

// const { allAnswer, postAnswer } = require("../controller/answerController");

// //post answer route
// router.post("/postanswer/:questionid", postAnswer);

// //all answer route (not all question)
// router.get("/all-answers/:questionid", allAnswer);

// module.exports = router;
