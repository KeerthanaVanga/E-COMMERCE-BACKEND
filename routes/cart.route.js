import express from "express";
import {
  getUserCart,
  updateCartItemQuantity,
  addToCart,
  deleteCartItem,
} from "../controllers/cart.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const cartRouter = express.Router();

cartRouter.get("/get-cart", authenticate, getUserCart);
cartRouter.post("/add-to-cart", authenticate, addToCart);
cartRouter.patch(
  "/update-quantity/:itemId",
  authenticate,
  updateCartItemQuantity
);
cartRouter.delete("/delete-cart/:id", authenticate, deleteCartItem);

export default cartRouter;
