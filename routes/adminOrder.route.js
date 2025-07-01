import express from "express";
import {
  allOrders,
  dashboardOrders,
  updateOrderStatus,
} from "../controllers/adminOrder.controller.js";
import adminAuthenticate from "../middleware/adminAuth.middleware.js";
const adminOrderRouter = express.Router();

adminOrderRouter.get("/get-all-orders", adminAuthenticate, allOrders);
adminOrderRouter.patch(
  "/update-order-status/:orderId",
  adminAuthenticate,
  updateOrderStatus
);

adminOrderRouter.get("/dashboard", adminAuthenticate, dashboardOrders);

export default adminOrderRouter;
