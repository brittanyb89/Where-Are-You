const mysql = require("mysql2");

require("dotenv").config();

const connectionProps = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
};

const connection = mysql.createConnection(connectionProps);

module.exports = {
  connectionProps,
  connection,
};
