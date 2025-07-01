import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1, min: 1 },

  // Optional: Product-specific options (ex: size for clothing)
  selectedOptions: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Snapshot fields to avoid issues if product details change
  priceAtTime: { type: Number, required: true },
  nameAtTime: { type: String, required: true },
  imageAtTime: { type: String, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default CartModel;
