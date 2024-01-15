const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig.jsx");
//post answer
const post_answer = async (req, res) => {
  const { answer } = req.body;
  const questionid = req.params.questionid;
  const { userid } = req.user;
  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "provide answer field" });
  }
  try {
    await dbConnection.query(
      "INSERT INTO answers(questionid,userid, answer  ) value(?,?,?)",
      [questionid, userid, answer]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "somethin went to wrong try again later" });
  }
};

//all answer
const all_answer = async (req, res) => {
  const questionid = req.params.questionid;
  try {
    const [answer] = await dbConnection.query(
      "SELECT answer, username FROM answers JOIN users ON answers.userid = users.userid WHERE questionid = ? ",
      [questionid]
    );
    return res.status(StatusCodes.OK).json({ answer });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "somethin went to wrong try again later" });
  }
};
module.exports = { post_answer, all_answer };

// ***************************************************************

// const { StatusCodes } = require("http-status-codes");
// const dbConnection = require("../db/dbConfig.jsx");

// // Post Answer
// async function postAnswer(req, res) {
//   try {
//     const { answer } = req.body;
//     // const questionId = req.params.questionId; // wrong
//     const questionId = req.params.questionid;
//     const userId = req.user.userid;
//     // const { userid } = req.user; // Abraham destructured this part and kept it inside the try catch method, but doesn't make a diffrence

//     if (!answer) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "Please provide answer. field/s" });
//     }

//     await dbConnection.query(
//       "INSERT INTO answers (answer, questionid, userid) VALUES (?, ?, ?)",
//       [answer, questionId, userId]
//     );

//     // console.log("Answer posted successfully.");
//     return res
//       .status(StatusCodes.CREATED)
//       .json({ msg: "Answer posted successfully." });
//   } catch (error) {
//     console.error("Error posting answer:", error.message);

//     // Handle specific database error
//     if (error.code === "ER_NO_REFERENCED_ROW_2") {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "Invalid question ID." });
//     }

//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// }

// // Get all answers for a specific question
// async function allAnswer(req, res) {
//   try {
//     //  const questionId = req.params.questionId; //wrong
//     const questionId = req.params.questionid;

//     // Fetch all answers for the specified question
//     const [answers] = await dbConnection.query(
//       "SELECT * FROM answers WHERE questionid = ?",
//       [questionId]
//     );

//     // Respond with the fetched answers
//     return res.status(StatusCodes.OK).json(answers);
//   } catch (error) {
//     console.error("Error fetching answers:", error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// }
// module.exports = { postAnswer, allAnswer };
