import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

export const addToCartCollection = async (userId, productId, quantity = 1) => {
  if (!mongoose.Types.ObjectId.isValid(productId) || quantity <= 0) {
    throw new Error("Invalid product ID or quantity");
  }

  const product = await productModel.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Try incrementing if item already in cart
  const updated = await cartModel.findOneAndUpdate(
    { userId, "items.productId": productId },
    {
      $inc: { "items.$.quantity": quantity },
      $set: { updatedAt: new Date() },
    },
    { new: true }
  );

  if (updated) return updated;

  // Otherwise, push new item or create cart
  const newCart = await cartModel.findOneAndUpdate(
    { userId },
    {
      $push: { items: { productId, quantity } },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, new: true }
  );

  return newCart;
};

export const getCartItemCount = (cart) => {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};
