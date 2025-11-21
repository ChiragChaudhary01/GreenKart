import db from "../config/db.js";

const OrderModel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql =
        "select o.order_id, u.user_name as consumer_name, u.phone as consumer_phone, a.address_line as consumer_address, p.name as product_name, oi.quantity, oi.price as item_price, o.total_amount, o.created_at, case when o.order_status in ('confirmed', 'shipped', 'delivered') then 'paid' else 'unpaid' end as payment_status, d.delivery_status, dp.user_name as delivery_persone_name, dp.phone as delivery_person_phone from orders o join users u on o.consumer_id = u.user_id left join address a on o.address_id = a.address_id join order_items oi on o.order_id = oi.order_id join products p on oi.product_id = p.product_id left join delivery d on o.order_id = d.order_id left join users dp on d.delivery_person_id = dp.user_id order by o.created_at desc";
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  assignOrder: (order_id, delivery_person_id) => {
    return new Promise((resolve, reject) => {
      const sql1 =
        "insert into delivery (order_id, delivery_person_id) values (?, ?)";
      db.query(sql1, [order_id, delivery_person_id], (err, result) => {
        if (err) return reject(err);
        const sql2 =
          "update orders set order_status = 'confirmed' where order_id = ?";
        db.query(sql2, [order_id], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
  },
  checkoutOrder: (consumer_id, address_id, product_id, quantity, price) => {
    console.log(consumer_id);
    return new Promise((resolve, reject) => {
      const total_amount = quantity * price;
      const sql1 =
        "insert into orders (consumer_id, total_amount, address_id) values (?, ?, ?)";
      db.query(sql1, [consumer_id, total_amount, address_id], (err, result) => {
        if (err) return reject(err);
        const sql2 =
          "insert into order_items (order_id, product_id, quantity, price) values (?, ?, ?, ?)";
        db.query(
          sql2,
          [result.insertId, product_id, quantity, price],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    });
  },
  getAllForConsumer: (consumer_id) => {
    return new Promise((resolve, reject) => {
      const sql =
        "select o.order_id, o.created_at, u.phone as consumer_phone, a.address_line as consumer_address, p.name as product_name, oi.quantity, oi.price as item_price, o.total_amount, case when o.order_status in ('confirmed', 'shipped', 'delivered') then 'paid' else 'unpaid' end as payment_status, d.delivery_status, dp.user_name as delivery_persone_name, dp.phone as delivery_person_phone from orders o join users u on o.consumer_id = u.user_id left join address a on o.address_id = a.address_id join order_items oi on o.order_id = oi.order_id join products p on oi.product_id = p.product_id left join delivery d on o.order_id = d.order_id left join users dp on d.delivery_person_id = dp.user_id where o.consumer_id = ? order by o.created_at desc";
      db.query(sql, [consumer_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  // view order of the farmer
  getAllForFarmer: (farmer_id) => {
    return new Promise((resolve, reject) => {
      const sql =
        "select o.order_id, p.name, p.price, oi.quantity, o.total_amount, uc.user_name, o.created_at, a.address_line, a.city from orders o left join order_items oi on o.order_id = oi.order_id left join users uc on uc.user_id = o.consumer_id left join products p on oi.product_id = p.product_id left join users uf on p.farmer_id = uf.user_id left join address a on o.address_id = a.address_id where uf.user_id = ? order by o.created_at desc";
      db.query(sql, [farmer_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  // View assigned orders of the delivery person
  getAllForDeliveryPerson: (delivery_person_id) => {
    console.log("delivery_person_id", delivery_person_id);
    return new Promise((resolve, reject) => {
      const sql =
        "select d.delivery_id, d.deliverY_status, d.assigned_at, d.delivery_status, d.delivered_at, o.order_status, o.address_id, oi.quantity, oi.price, p.name, p.img_url,uf.user_name as farmer_name, uf.phone as farmer_phone, (CONCAT(af.address_line, ', ', af.city, ', ',af.state, ', ', af.pincode)) as farmer_address, uc.user_name as consumer_name, uc.phone as consumer_phone, (CONCAT(ac.address_line, ', ', ac.city, ', ',ac.state, ', ', ac.pincode)) as consumer_address from delivery d join orders o on d.order_id = o.order_id left join order_items oi on o.order_id = oi.order_id left join products p on oi.product_id = p.product_id left join users uf on uf.user_id = p.farmer_id left join address af on af.user_id = uf.user_id left join users uc on uc.user_id = o.consumer_id left join address ac on ac.user_id = uc.user_id where d.delivery_person_id = ?";
      db.query(sql, [delivery_person_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  // Update delivery status by delivery person
  updateDelivery: (delivery_id, delivery_status) => {
    return new Promise((resolve, reject) => {
      const sql1 =
        "update delivery set delivery_status = ? where delivery_id = ?";
      const sql2 = "select order_id from delivery where delivery_id = ?";
      db.query(sql1, [delivery_status, delivery_id], (err, result) => {
        if (err) return reject(err);
        db.query(sql2, [delivery_id], (err, rows) => {
          if (err) return reject(err);
          const result = rows[0];
          const { order_id } = result;
          console.log(order_id);
          if (delivery_status == "in_progress") {
            const sql3 =
              "update orders set order_status = 'shipped' where order_id = ?";
            db.query(sql3, [order_id], (err, result) => {
              if (err) return reject(err);
            });
          } else if (delivery_status == "delivered") {
            const sql4 =
              "update orders set order_status = 'delivered' where order_id = ?";
            db.query(sql4, [order_id], (err, result) => {
              if (err) return reject(err);
            });
          }
        });
        resolve(result);
      });
    });
  },
};

export default OrderModel;
