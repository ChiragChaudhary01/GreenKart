import db from "../config/db.js";

const CartModel = {
  // Add item to cart
  addItem: (consumer_id, product_id, quantity) => {
    return new Promise((resolve, reject) => {
      const sql =
        "insert into cart (consumer_id, product_id, quantity) values (?, ?, ?)";
      db.query(sql, [consumer_id, product_id, quantity], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  // View cart
  getAll: (consumer_id) => {
    return new Promise((resolve, reject) => {
      const sql =
        "select c.*, p.name, p.price from Cart c left join products p on c.product_id = p.product_id where consumer_id = ?";
      db.query(sql, [consumer_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  //   Update cart item (quantity)
  update: (quantity, cart_id) => {
    return new Promise((resolve, reject) => {
      const sql = "update cart set quantity = ? where cart_id = ?";
      db.query(sql, [quantity, cart_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  //   Remove item from cart
  delete: (cart_id) => {
    return new Promise((resolve, reject) => {
      const sql = "delete from cart where cart_id = ?";
      db.query(sql, [cart_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

export default CartModel;
