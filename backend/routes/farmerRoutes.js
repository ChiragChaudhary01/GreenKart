import express from "express";
import multer from "multer";
import imgUploadMiddleware from "../middleware/imgUploadMiddleware.js";
import farmerController from "../controllers/farmerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import path from "path";
import roleMiddleware from "../middleware/roleMiddleware.js";

const storage = multer.memoryStorage(); // keep files in buffer

const upload = multer({ storage });

export const farmerRouter = express.Router();

// GET /farmer/products → View own products
farmerRouter.get(
  "/products",
  authMiddleware,
  roleMiddleware("farmer"),
  farmerController.getProducts
);

// POST /farmer/products → Add product
farmerRouter.post(
  "/products",
  authMiddleware,
  roleMiddleware("farmer"),
  upload.single("product_img"),
  imgUploadMiddleware,
  farmerController.addProduct
);

// PUT /farmer/products/:id → Update product
farmerRouter.put(
  "/products/:id",
  authMiddleware,
  roleMiddleware("farmer"),
  upload.single("product_img"),
  imgUploadMiddleware,
  farmerController.updateProduct
);

// DELETE /farmer/products/:id → me Delete product
farmerRouter.delete(
  "/products/:id",
  authMiddleware,
  roleMiddleware("farmer"),
  farmerController.deleteProduct
);

// GET /farmer/orders → View orders for their products
farmerRouter.get(
  "/orders",
  authMiddleware,
  roleMiddleware("farmer"),
  farmerController.getOrders
);
