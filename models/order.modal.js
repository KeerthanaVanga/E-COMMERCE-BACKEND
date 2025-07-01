import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cod"],
      default: "pending",
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        nameAtTime: { type: String, required: true },
        imageAtTime: { type: String, required: true },
        priceAtTime: { type: Number, required: true },
        quantity: { type: Number, required: true },
        selectedOptions: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
