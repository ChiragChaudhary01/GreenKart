import express from "express";
import adminController from "../controllers/adminController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const adminRouter = express.Router();

// GET /admin/users
adminRouter.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getUsers
);

// POST /admin/users
adminRouter.post(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.addUser
);

// PUT /admin/users:id
adminRouter.put(
  "/users/:user_id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.updateUser
);

// DELETE /admin/users:id
adminRouter.delete(
  "/users/:user_id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.deleteUser
);

// GET /admin/products
adminRouter.get(
  "/products",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllProducts
);

// PUT /admin/products/:id/approve
adminRouter.put(
  "/products/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.approveProduct
);

// GET /admin/orders → View all orders
adminRouter.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllOrders
);

// POST /admin/orders/:id/assign → Assign delivery person
adminRouter.post(
  "/orders/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.assignOrder
);
