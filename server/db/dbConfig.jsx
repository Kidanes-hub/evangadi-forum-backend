const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  connectionLimit: 10,
});

// production
// const pool = mysql2.createPool({
// host: process.env.NYSQL_HOST,
// user: process.env.MYQL_USER,
// password: process.env.MYSQL_PASS,
// database: process.env.MYSQL_DB,
// ConnectionLimit:10
// });

// dbConnection.execute("select 'test' ", (err, result) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(result);
//   }
// });

module.exports = dbConnection.promise(); //Replacece the call back function and we use async, await
