const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
  const token = authHeader.split(" ")[1];
  // console.log(authHeader);
  // console.log(token);
  try {
    const { username, userid } = jwt.verify(token, "secret");
    req.user = { username, userid };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
}

module.exports = authMiddleware;

// ****************************************************************************
// const { StatusCodes } = require("http-status-codes");
// const jwt = require("jsonwebtoken");
// async function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     return res
//       .status(StatusCodes.UNAUTHORIZED)
//       .json({ msg: "Authentication Invalid" });
//   }
//   const token = authHeader.split(" ")[1];
//   // console.log(authHeader);
//   // console.log(token);

//   try {
//     // const data = jwt.verify(authHeader, "secret");
//     // return res.status(StatusCodes.OK).json({ data });
//     const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { username, userid }; // - Attach aditional object/ custom property
//     next();
//   } catch (error) {
//     return res
//       .status(StatusCodes.UNAUTHORIZED)
//       .json({ msg: "authentication invalid" });
//   }
// }

// module.exports = authMiddleware;