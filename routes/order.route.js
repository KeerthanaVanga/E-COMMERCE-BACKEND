import express from "express";
import {
  fetchUserOrders,
  cancelOrder,
} from "../controllers/orders.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const orderRouter = express.Router();

orderRouter.get("/get-orders", authenticate, fetchUserOrders);
orderRouter.patch("/cancel/:orderId", authenticate, cancelOrder);
export default orderRouter;
