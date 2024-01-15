const express = require("express");
const router = express.Router();
// authonthication middleware
const authMiddleware = require("../middleware/authMiddleware");

// user controllers
const { register, login, checkUser } = require("../controller/userController");

// register route
router.post("/register", register);
// login user
router.post("/login", login);

// check user
router.get("/check", authMiddleware, checkUser);

module.exports = router;

// ******************************************************************
// const express = require("express");
// const router = express.Router();
// // authentication middleware
// const authMiddlewar = require("../../server/middleware/authMiddleware");
// // user controllers
// const {
//   register,
//   login,
//   checkUser,
// } = require("../../server/controller/userController");

// // register route
// router.post("/register", register);

// //login user
// router.post("/login", login);

// //check user
// router.get("/check", authMiddlewar, checkUser);

// module.exports = router;

// // router.post("/register", (req, res) => {
// //   res.send("register user");
// // });
