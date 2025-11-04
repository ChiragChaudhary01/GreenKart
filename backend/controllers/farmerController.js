import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";

const farmerController = {
  getProducts: async (req, res) => {
    const farmer_id = req.user.user_id;
    try {
      const rows = await ProductModel.getFarmersProducts(farmer_id);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  // add Product
  addProduct: async (req, res) => {
    const farmer_id = req.user.user_id;
    let img_url = null;
    if (req.file && req.file.cloudinaryURL) {
      img_url = req.file.cloudinaryURL;
      console.log("req.file.cloudinaryURL", img_url);
    }
    const { name, description, price, stock } = req.body;
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ error: "All fields are reqaired" });
    }
    try {
      await ProductModel.add(
        farmer_id,
        name,
        description,
        price,
        stock,
        img_url
      );
      res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  // update Product
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    let img_url = null;
    if (req.file && req.file.cloudinaryURL) {
      img_url = req.file.cloudinaryURL;
      console.log("req.file.cloudinaryURL", img_url);
    }
    if (!id) {
      return res.status(400).json({ error: "product_id reqaired" });
    }
    try {
      const rows = await ProductModel.findById(id);
      const product = rows[0];
      const updateDate = {
        name: name ?? product.name,
        description: description ?? product.description,
        price: price ?? product.price,
        stock: stock ?? product.stock,
        img_url: img_url,
      };
      await ProductModel.update(id, updateDate);
      res.status(201).json({ message: "Product Updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  // delete product
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "All fields are reqaired" });
    }
    try {
      await ProductModel.delete(id);
      res.status(201).json({ message: "Product delete successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  // View orders for their products
  getOrders: async (req, res) => {
    const farmer_id = req.user.user_id;
    try {
      const rows = await OrderModel.getAllForFarmer(farmer_id);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
};

export default farmerController;
