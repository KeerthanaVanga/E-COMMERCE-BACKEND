import express from "express";
import {
  createPayment,
  confirmPayment,
} from "../controllers/payment.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const paymentRouter = express.Router();

paymentRouter.post("/create-payment", authenticate, createPayment);
paymentRouter.post("/confirm-payment", authenticate, confirmPayment);

export default paymentRouter;
