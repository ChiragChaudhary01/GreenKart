import db from "../config/db.js";

const UserModel = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE email = ?";
      db.query(sql, [email], (err, rows) => {
        if (err) return reject(err);
        console.log("Rows in findByEmail:", rows);
        resolve(rows);
      });
    });
  },

  createUser: (
    user_name,
    email,
    password,
    phone,
    role,
    otp,
    otpExpires,
    isVerified
  ) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO users (user_name, email, password, phone, role, otp, otpExpires, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [user_name, email, password, phone, role, otp, otpExpires, isVerified],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT user_id, user_name, email, phone, role FROM users";
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  findById: (user_id) => {
    return new Promise((resolve, reject) => {
      const sql = "select * from users where user_id = ?";
      db.query(sql, [user_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  updateUser: (user_id, data) => {
    return new Promise((resolve, reject) => {
      const sql = "update users set ? where user_id = ?";
      db.query(sql, [data, user_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  deleteUser: (user_id) => {
    return new Promise((resolve, reject) => {
      const sql = "delete from users where user_id = ?";
      db.query(sql, [user_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

export default UserModel;
