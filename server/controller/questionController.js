const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig.jsx");

//post questions function
async function postQuestions(req, res) {
  const { title, descreption, tag } = req.body;
  if (!title || !descreption) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all questions properties" });
  }
  const userid = req.user.userid;
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  const questionid = uuid();
  try {
    await dbConnection.query(
      " INSERT INTO questions(questionid,	userid,title,descreption,tag ) value(?,?,?,?,?)",
      [questionid, userid, title, descreption, tag]
    );
    return res.status(StatusCodes.CREATED).json({
      msg: "Question posted successfully. Redirecting to home page .",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went to wrong try again later" });
  }
}
//all questions function
async function allQuestions(req, res) {
  try {
    //query all questions from the questions database
    const [allQuestion] = await dbConnection.query(
      "SELECT q.title, q.descreption, q.questionid ,q.tag ,u.username  FROM questions q JOIN users u ON q.userid = u.userid ORDER BY id DESC;"
    );
    return res.status(StatusCodes.OK).json({ allQuestion });
  } catch (error) {
    // Log and return a 500 internal server error response if an error occurs
    // console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again" });
  }
}
//single questions function
async function singleQuestions(req, res) {
  const questionid = req.params.questionid;

  try {
    // Perform a SELECT query to fetch a single question by its ID
    const query = "SELECT * FROM questions WHERE questionid = ?";
    const [question] = await dbConnection.query(query, [questionid]);
    // console.log(query)
    // console.log(question[0]);

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }
    // Send the retrieved question as a JSON response
    res.status(200).json(question[0]);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong while fetching the question" });
  }
}
module.exports = { postQuestions, allQuestions, singleQuestions };

// ****************************************************************************************************
// const dbConnection = require("../../server/db/dbConfig.jsx");
// const { StatusCodes } = require("http-status-codes");
// const { v4: uuidv4 } = require("uuid");

// // - Post a new question (function)
// async function postQuestions(req, res) {
//   const { title, descreption, tag } = req.body;

//   const userid = req.user.userid;

//   // - Validate question's tabele data (All required filleds must be added to the tabel)
//   if (!title || !descreption) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "please provide all questions properties" });
//   }

//   const questionid = uuidv4();

//   try {
//     await dbConnection.query(
//       " INSERT INTO questions (	questionid,	userid, title, descreption, tag ) value(?,?,?,?,?)",
//       [questionid, userid, title, descreption, tag]
//     );
//     return res.status(StatusCodes.CREATED).json({
//       msg: "Question posted successfully. Redirecting to home page",
//     });
//   } catch (error) {
//     console.log("Error posting question", error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went to wrong, try again later!" });
//   }
// }

// // - Get all questions (function)
// async function allQuestions(req, res) {
//   try {
//     // - query all questions from the questions database
//     const [allQuestion] = await dbConnection.query(
//       "SELECT q.title, q.descreption, q.questionid ,q.tag ,u.username  FROM questions q JOIN users u ON q.userid = u.userid ORDER BY id DESC;"
//     );
//     return res.status(StatusCodes.OK).json({ allQuestion });
//   } catch (error) {
//     // Log and return a 500 internal server error response if an error occurs
//     // console.log(error.message);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, please try again" });
//   }
// }

// async function singleQuestions(req, res) {
//   const questionid = req.params.questionid;

//   try {
//     const query = "SELECT * FROM questions WHERE questionid = ?";
//     const [question] = await dbConnection.query(query, [questionid]);

//     if (!question.length) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ msg: "Question not found." });
//     }

//     return res.status(StatusCodes.OK).json(question[0]);
//   } catch (error) {
//     console.log("Error retrieving question:", error); // keep this log always on
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// }

// module.exports = { postQuestions, allQuestions, singleQuestions };
