import db from "../config/db.js";

const AddressModel = {
  add: (user_id, address_line, city, state, pincode, is_default) => {
    return new Promise((resolve, reject) => {
      const sql =
        "insert into address (user_id, address_line, city, state, pincode, is_default) values (?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [user_id, address_line, city, state, pincode, is_default],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
  findAddress: (user_id) => {
    return new Promise((resolve, reject) => {
      const sql = "select * from Address where user_id = ?";
      db.query(sql, [user_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

export default AddressModel;
