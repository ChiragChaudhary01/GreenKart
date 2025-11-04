import AddressModel from "../models/AddressModel.js";
import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";

const consumerController = {
  getAllProducts: async (req, res) => {
    try {
      const rows = await ProductModel.getAll();
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  //   Get product details
  getProductDetails: async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "product_id is required" });
    try {
      const rows = await ProductModel.getProductDetails(id);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  //   Add item to cart
  addItemToCart: async (req, res) => {
    const consumer_id = req.user.user_id;
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity)
      return res.status(400).json({ error: "All fields are required" });
    try {
      await CartModel.addItem(consumer_id, product_id, quantity);
      res.status(200).json({ message: "Item is added to cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  //   View cart
  getItemsFromCart: async (req, res) => {
    const consumer_id = req.user.user_id;
    try {
      const rows = await CartModel.getAll(consumer_id);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Sever error" });
    }
  },

  //   Update cart item (quantity)
  updateItemFromCart: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || !id)
      return res.status(400).json({ error: "All fields are required" });
    try {
      await CartModel.update(quantity, id);
      res.status(200).json({ message: "Cart item updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  //   Remove item from cart
  removeItemFromCart: async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "cart_id is required" });
    try {
      await CartModel.delete(id);
      res
        .status(200)
        .json({ message: "Item deleted successfully from the cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  // POST /checkout Checkout / Place order
  checkoutOrder: async (req, res) => {
    const user_id = req.user.user_id;
    console.log(user_id);
    const { address_data, product_id, quantity, price } = req.body;
    let { address_id, address_line, city, state, pincode, is_default } =
      address_data;
    try {
      if (address_id) {
        if (!product_id || !quantity || !price) {
          return res.status(400).json({ error: "All field are required" });
        }
      } else {
        if (
          !address_line ||
          !city ||
          !state ||
          !pincode ||
          !is_default ||
          !product_id ||
          !quantity ||
          !price
        ) {
          return res.status(400).json({ error: "All field are required" });
        }
        const addresAddResult = await AddressModel.add(
          user_id,
          address_line,
          city,
          state,
          pincode,
          is_default
        );
        address_id = addresAddResult.insertId;
      }
      console.log(user_id);
      await OrderModel.checkoutOrder(
        user_id,
        address_id,
        product_id,
        quantity,
        price
      );
      res.status(201).json({ message: "Order checkout successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  // GET /orders View consumer order history
  getOrderHistory: async (req, res) => {
    const user_id = req.user.user_id;
    try {
      const rows = await OrderModel.getAllForConsumer(user_id);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
};

export default consumerController;
