import CartModel from "../models/cart.model.js";
import Product from "../models/product.model.js";

const addToCart = async (req, res) => {
  try {
    const { productId, selectedOptions } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    // Check if product with same options exists
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.selectedOptions) ===
          JSON.stringify(selectedOptions || {})
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: 1,
        selectedOptions: selectedOptions || {},
        priceAtTime: product.price,
        nameAtTime: product.name,
        imageAtTime: product.images[0],
      });
    }

    await cart.save();

    return res.status(200).json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity;

    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Cart quantity updated" });
  } catch (error) {
    console.error("Update quantity error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter((item) => item._id.toString() !== id);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await CartModel.findOne({ userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        cart: [],
        subtotal: 0,
        total: 0,
        shippingFee: 0,
      });
    }

    let subtotal = 0;
    cart.items.forEach((item) => {
      subtotal += item.priceAtTime * item.quantity;
    });

    const shippingFee = subtotal > 1000 ? 0 : 10; // Example logic
    const total = subtotal + shippingFee;

    return res.status(200).json({
      success: true,
      cart: cart.items,
      cartId: cart._id,
      subtotal,
      shippingFee,
      total,
    });
  } catch (error) {
    console.error("Fetch cart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { addToCart, updateCartItemQuantity, getUserCart, deleteCartItem };
