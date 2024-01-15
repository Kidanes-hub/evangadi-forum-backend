// db connection
const dbConnection = require("../db/dbConfig.jsx");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already registered" });
    }
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES(?,?,?,?,?)",
      [username, firstname, lastname, email, hashedpassword]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "user registered" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "select username, userid, password from users where email=? ",
      [email]
    );
    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, "secret", { expiresIn: "1d" });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successful", token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
}

module.exports = { register, login, checkUser };

// **********************************************************************
// const dbConnection = require("../db/dbConfig.jsx");
// const bcrypt = require("bcrypt");
// const { StatusCodes } = require("http-status-codes");
// const jwt = require("jsonwebtoken");

// // - Register controller
// async function register(req, res) {
//   // res.send("register user"); // - Test register on postman

//   // - Validate register data tabele (All required filleds must be added to the tabel)
//   const { username, firstname, lastname, email, password } = req.body;
//   if (!username || !firstname || !lastname || !email || !password) {
//     // return res.json({ msg: "please, provide all requred fields" }); // returns data as a json object
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "please provide all required information!" });
//   }

//   try {
//     // - Filter user using userid and email to stip regs with same userid and/or email
//     const [user] = await dbConnection.query(
//       "SELECT username, userid from users WHERE username = ? or email = ? ",
//       [username, email]
//     );
//     // return res.json({ user: user }); // test on postman to see registered user/s

//     // - If user is > 0 or already user exists, stop
//     if (user.length > 0) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: " user already registred " });
//     }
//     // - Password length (ensures password length must beat least 8 char)
//     if (password.length <= 8) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: " password must be at least 8 characters" });
//     }

//     // - Encrypt the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // - INSERT data inito users table's column
//     await dbConnection.query(
//       " INSERT INTO users (	username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
//       [username, firstname, lastname, email, hashedPassword]
//     );
//     return res.status(StatusCodes.CREATED).json({ msg: "user registered" });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Somethig went wrong, try again later" });
//   }
// }

// // - Login controller
// async function login(req, res) {
//   // res.send("Login user"); // - Test on postman
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Please enter all required fields" });
//   }
//   try {
//     const [user] = await dbConnection.query(
//       "select username, userid, password from users where email = ? ",
//       [email]
//     );
//     // return res.json({ user: user }); // check username, userid, password on postman
//     if (user.length <= 0) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "Invalid credential " }); // - invalid email
//     }
//     // else {
//     //   res.json("user existed");
//     // } // - Else method is used here to check code on postman and to stop it from runnung endlessly

//     // - Compare/verify password
//     const isMatch = await bcrypt.compare(password, user[0].password);
//     if (!isMatch) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "Invalid credential " }); // invalid password
//     }

//     // return res.json({ user }); // test user details on postman
//     // return res.json({ user: user[0].password }); // shows only password on postman

//     const username = user[0].username;
//     const userid = user[0].userid;
//     const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     return res
//       .status(StatusCodes.OK)
//       .json({ msg: "User login successful", token, username });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: " Something went awry" });
//   }
// }

// // - CheckUser controller
// async function checkUser(req, res) {
//   const username = req.user.username;
//   const userid = req.user.userid;

//   res.status(StatusCodes.OK).json({ msg: " valid user", username, userid });
//   // res.send("check user");
// }

// module.exports = { register, login, checkUser };
