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
  getAllByPincode: async (req, res) => {
    const { pincode } = req.params;
    try {
      if (!pincode) {
        res.status(400).json({ error: "pincode is required" });
      }

      const rows = await ProductModel.getAllByPincode(pincode);
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

  //fileter product
  getFileteredProducts: async (req, res) => {
    try {
      const { name, pincode } = req.query;

      if (!name) {
        const rows = await ProductModel.getAll();
        return res.json(rows);
      }

      const rows = await ProductModel.getFilteredProducts(pincode, name);
      return res.json(rows);
    } catch (error) {
      console.error("Error in getFileteredProducts:", error);
      return res.status(500).json({ error: "Server error" });
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
    const cartId = parseInt(id, 10);
    const { quantity } = req.body;
    if (!quantity || !id)
      return res.status(400).json({ error: "All fields are required" });
    try {
      await CartModel.update(quantity, cartId);
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
  // GET /address View Address
  getAddress: async (req, res) => {
    const user_id = req.user.user_id;
    try {
      const rows = await AddressModel.findAddress(user_id);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.state(500).json({ error: "Server error" });
    }
  },
};

export default consumerController;
