const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: "root",
  password: "123",
  database: "college_news",
  port: 3306,
});
//connecting to my database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    console.log(err);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});
