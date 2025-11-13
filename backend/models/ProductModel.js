import db from "../config/db.js";

const ProductModel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql =
        "select p.*, u.user_name as farmer_name, u.phone as farmer_phone from Products p join Users u on p.farmer_id = u.user_id order by p.created_at desc";
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  getAllByPincode: (pincode) => {
    return new Promise((resolve, reject) => {
      const sql =
        "select p.*, u.user_name as farmer_name, u.phone as farmer_phone, a.pincode from Products p join Users u on p.farmer_id = u.user_id join address as a on u.user_id = a.user_id where a.pincode = ? order by p.created_at desc";
      db.query(sql, pincode, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  // Approve/reject product
  updateStatus: (prduct_id, status) => {
    return new Promise((resolve, reject) => {
      const sql = "update Products set status = ? where product_id = ?";
      db.query(sql, [status, prduct_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  // Get product details
  getProductDetails: (product_id) => {
    return new Promise((resolve, reject) => {
      const sql = "select * from products where product_id = ?";
      db.query(sql, [product_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  getFarmersProducts: (farmer_id) => {
    return new Promise((resolve, reject) => {
      const sql = "select * from products where farmer_id = ?";
      db.query(sql, [farmer_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  // add product
  add: (farmer_id, name, description, price, stock, img_url) => {
    return new Promise((resolve, reject) => {
      const sql =
        "insert into products (farmer_id, name, description, price, stock, img_url) values ( ?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [farmer_id, name, description, price, stock, img_url],
        (err, resulst) => {
          if (err) return reject(err);
          resolve(resulst);
        }
      );
    });
  },
  // update product
  update: (product_id, data) => {
    return new Promise((resolve, reject) => {
      const sql = "update Products set ? where product_id = ?";
      db.query(sql, [data, product_id], (err, resulst) => {
        if (err) return reject(err);
        resolve(resulst);
      });
    });
  },
  // delete product
  delete: (product_id) => {
    return new Promise((resolve, reject) => {
      const sql = "delete from Products where product_id = ?";
      db.query(sql, [product_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  // finde product by id
  findById: (product_id) => {
    return new Promise((resolve, reject) => {
      const sql = "select * from Products where product_id = ?";
      db.query(sql, [product_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  getFilteredProducts: (pincode, name) => {
    return new Promise((resolve, reject) => {
      const sql =
        "select p.*, u.user_name as farmer_name, u.phone as farmer_phone, a.pincode from Products p join Users u on p.farmer_id = u.user_id join address as a on u.user_id = a.user_id where a.pincode = ? and p.name like ? order by p.created_at desc";
      db.query(sql, [pincode, `%${name}%`], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
};

export default ProductModel;
