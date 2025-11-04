import mysql from "mysql2";

// Create a Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Chirag@226681",
  database: "GreenKart",
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

export default db;
