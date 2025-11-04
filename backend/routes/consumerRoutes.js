import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import consumerController from "../controllers/consumerController.js";

export const consumerRouter = express.Router();

// GET /products → Browse all products
consumerRouter.get(
  "/products",
  authMiddleware,
  consumerController.getAllProducts
);

// GET /products/:id → Get product details
consumerRouter.get(
  "/product/:id",
  authMiddleware,
  consumerController.getProductDetails
);

// POST /cart → Add item to cart
consumerRouter.post("/cart", authMiddleware, consumerController.addItemToCart);

// GET /cart → View cart
consumerRouter.get(
  "/cart",
  authMiddleware,
  consumerController.getItemsFromCart
);

// PUT /cart/:id Update cart item (quantity)
consumerRouter.put(
  "/cart/:id",
  authMiddleware,
  consumerController.updateItemFromCart
);

// DELETE /cart/:id Remove item from cart
consumerRouter.delete(
  "/cart/:id",
  authMiddleware,
  consumerController.removeItemFromCart
);

// POST /checkout Checkout / Place order
consumerRouter.post(
  "/checkout",
  authMiddleware,
  consumerController.checkoutOrder
);

// GET /orders View consumer order history
consumerRouter.get(
  "/orders",
  authMiddleware,
  consumerController.getOrderHistory
);
