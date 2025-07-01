import Order from "../models/order.modal.js";

const fetchUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    if (order.status === "delivered") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Delivered orders cannot be cancelled.",
        });
    }

    if (order.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Order is already cancelled." });
    }

    order.status = "cancelled";
    await order.save();

    return res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export { fetchUserOrders, cancelOrder };
