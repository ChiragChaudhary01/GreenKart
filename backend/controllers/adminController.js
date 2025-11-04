import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import bcrypt from "bcrypt";
import OrderModel from "../models/OrderModel.js";

const adminController = {
  getUsers: async (req, res) => {
    try {
      const rows = await UserModel.getAllUsers();
      res.json(rows);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "DB error" });
    }
  },

  addUser: async (req, res) => {
    const { user_name, email, password, phone, role } = req.body;

    if (!user_name || !email || !password || !role || !phone) {
      return res.status(400).json({ error: "All fields required" });
    }

    try {
      const result = await UserModel.findByEmail(email);

      if (result.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // hash password
      const hashPassword = await bcrypt.hash(password, 10);

      // if not, create new user
      const insertResult = await UserModel.createUser(
        user_name,
        email,
        hashPassword,
        phone,
        role,
        null,
        null,
        true
      );

      res.json({ message: "User created", userId: insertResult.insertId });
    } catch (error) {
      console.error("Error in creating account:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  updateUser: async (req, res) => {
    const { user_id } = req.params;
    const { user_name, email, password, phone, role } = req.body;

    if (!user_id)
      return res.status(400).json({ error: "user id is required." });

    try {
      const result = await UserModel.findById(user_id);
      const user = result[0];

      if (!user) return res.status(404).json({ error: "user not found" });

      let hashedPassword = user.password;

      if (password && password.trim()) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updateData = {
        user_name: user_name ?? user.user_name,
        email: email ?? user.email,
        password: hashedPassword,
        phone: phone ?? user.phone,
        role: role ?? user.role,
      };

      await UserModel.updateUser(user_id, updateData);

      res.json({
        message: "User updated successfully",
        user: { ...updateData, user_id },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    const { user_id } = req.params;

    if (!user_id)
      return res.status(400).json({ error: "user id is required." });

    try {
      const result = await UserModel.findById(user_id);
      const user = result[0];
      if (!user) return res.status(404).json({ error: "User not found" });

      await UserModel.deleteUser(user_id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // get all products
  getAllProducts: async (req, res) => {
    try {
      const rows = await ProductModel.getAll();
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Approve/Reject product
  approveProduct: async (req, res) => {
    const { id } = req.params; // product_id
    const { status } = req.body; // approved/rejected

    try {
      if (!["approved", "rejected"].includes(status))
        return res.status(400).json({ error: "Invalied status value" });

      await ProductModel.updateStatus(id, status);
      res.status(200).json({
        message: "Product status updated successfully",
        product: { product_id: id, status },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  // View all orders
  getAllOrders: async (req, res) => {
    try {
      const rows = await OrderModel.getAll();
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  assignOrder: async (req, res) => {
    const { id } = req.params; // order_id
    const { delivery_person_id } = req.body; // delivery_person_id

    if (!id || !delivery_person_id) {
      return res.status(400).json({ error: "All fields required" });
    }

    try {
      const result = await OrderModel.assignOrder(id, delivery_person_id);
      res.status(200).json({
        message: "Order is assigned to the delivery person.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
};

export default adminController;
