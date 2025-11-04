import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import deliveryController from "../controllers/deliveryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const deliveryRouter = express.Router();

// GET /delivery/orders → View assigned orders
deliveryRouter.get(
  "/orders",
  authMiddleware,
  roleMiddleware("delivery"),
  deliveryController.getAll
);

// PUT /delivery/orders/:id → Update delivery status
deliveryRouter.put(
  "/orders/:id",
  authMiddleware,
  roleMiddleware("delivery"),
  deliveryController.updateStatus
);
