const mysql = require("mysql2");
const path = require("path");
const User = require("./models/user.js");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MYSQLath@2024",
  database: "",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database.");
  connection.query("CREATE DATABASE IF NOT EXISTS LMS", (err, results) => {
    if (err) {
      console.error("Error creating database:", err);
      return;
    }
    console.log("Database created or already exists.");
  });

  connection.end((err) => {
    if (err) {
      console.error("Error closing connection:", err);
      return;
    }
    console.log("Connection closed.");
  });
});



const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const register = require("./routes/register.js");
const login = require("./routes/login.js");
const protected = require("./routes/protected.js");
const authenticate = require("./routes/authenticate.js");

const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/register", register);
app.use("/login", login);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
