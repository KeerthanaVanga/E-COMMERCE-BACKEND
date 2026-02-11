import Order from "../models/order.modal.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import CartModel from "../models/cart.model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZOREPAY_KEY_SECRET,
});

const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
      paymentMethod,
      cartDetails,
    } = req.body;

    const cartItems = cartDetails.cart.map((item) => ({
      productId: item.product._id,
      nameAtTime: item.nameAtTime,
      imageAtTime: item.imageAtTime,
      priceAtTime: item.priceAtTime,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
    }));

    const order = await Order.create({
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      cartItems,
      subtotal: cartDetails.subtotal,
      shippingFee: cartDetails.shippingFee,
      total: cartDetails.total,
    });

    if (paymentMethod === "stripe") {
      const lineItems = cartItems.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.nameAtTime,
              images: [item.imageAtTime],
            },
            unit_amount: item.priceAtTime * 100,
          },
          quantity: item.quantity || 1,
        };
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        billing_address_collection: "required",
        success_url: `${process.env.USER_PANEL}/payment-success?orderId=${order._id}`,
        cancel_url: `${process.env.USER_PANEL}/payment-failed?orderId=${order._id}`,
        shipping_address_collection: {
          allowed_countries: ["IN"],
        },
        phone_number_collection: {
          enabled: true,
        },
      });

      return res.json({ success: true, sessionId: session.id });
    }
    if (paymentMethod === "razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: cartDetails.total * 100,
        currency: "INR",
        receipt: `order_${order._id}`,
      });

      return res.json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        orderId: order._id,
      });
    }

    res.json({
      success: true,
      message: "Order placed with Cash on Delivery",
      orderId: order._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;
    const userId = req.user._id;

    if (!["paid", "failed", "cod"].includes(paymentStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    if (paymentStatus === "paid" || paymentStatus === "cod") {
      await CartModel.updateOne({ userId }, { $set: { items: [] } });
    }

    res.json({ success: true, message: "Payment status updated", order });
  } catch (error) {
    console.error("Payment status update failed:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update payment status" });
  }
};

export { createPayment, confirmPayment };
