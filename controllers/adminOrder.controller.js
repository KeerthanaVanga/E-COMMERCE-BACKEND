import Order from "../models/order.modal.js";

const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const validStatuses = [
  "pending",
  "shipped",
  "out for delivery",
  "delivered",
  "delayed",
  "cancelled",
];

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status provided",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a cancelled order",
      });
    }

    order.status = newStatus;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const dashboardOrders = async (req, res) => {
  try {
    const deliveredOrders = await Order.find({ status: "delivered" });
    const pendingOrders = await Order.find({ status: "pending" });
    const cancelledOrders = await Order.find({ status: "cancelled" });
    const delayed = await Order.find({ status: "delayed" });
    const outForDeliveryOrders = await Order.find({
      status: "out for delivery",
    });
    const shippedOrders = await Order.find({ status: "shipped" });

    const totalOrders = await Order.countDocuments();

    // Calculate Total Revenue for paid orders
    const paidOrders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    // Calculate COD Revenue where paymentMethod is "cod" and paymentStatus is "paid"
    const codOrders = await Order.find({
      paymentMethod: "cod",
      status: "delivered",
    });
    const codRevenue = codOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    res.status(200).json({
      success: true,
      totalOrders,
      delivered: deliveredOrders,
      pending: pendingOrders,
      cancelled: cancelledOrders,
      outForDelivery: outForDeliveryOrders,
      shipped: shippedOrders,
      totalRevenue,
      delayed,
      codRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard orders" });
  }
};

export { allOrders, updateOrderStatus, dashboardOrders };
