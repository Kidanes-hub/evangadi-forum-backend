require("dotenv").config();

const express = require("express");
const app = express();
const port = 5500;

// - Cross-origin resource sharingCross-origin resource sharing between the db and front-end
const cors = require("cors");
app.use(cors());

// - Establish db connection
const dbConnection = require("./server/db/dbConfig.jsx");

// - Authenitication middleware file
const authMiddleware = require("./server/middleware/authMiddleware");

// - User routes middlesware file
const userRoutes = require("./server/routes/userRoute.js");

// - Question routes middleware
const questionsRoutes = require("./server/routes/questionRoute");

// - Answer routes middleware
const answerRoutes = require("./server/routes/answerRoute");

// app.use((req, res, next) => {
//   res.set("Content-Type", "application/json");
//   next();
// });

// - json middleware to extract json data (built in express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// - User routes middleware
app.use("/api/users", userRoutes);

// - Question routes middleware
app.use("/api/questions", authMiddleware, questionsRoutes);

// - Answer routes middleawre
app.use("/api/answers", authMiddleware, answerRoutes);

async function start() {
  try {
    const result = await dbConnection.execute("select'test' ");
    await app.listen(port);
    console.log("Connected to MySQL ");
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();

// app.listen(port, (err) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(`listening on ${port}`);
//   }
// });
