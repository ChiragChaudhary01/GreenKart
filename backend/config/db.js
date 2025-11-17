import mysql from "mysql2";

import dotenv from "dotenv";

dotenv.config();

// Create a Connection
const db = mysql.createConnection({
  host: process.env.SQL_HOST || "localhost",
  user: process.env.SQL_USER || "root",
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE || "GreenKart",
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

export default db;
