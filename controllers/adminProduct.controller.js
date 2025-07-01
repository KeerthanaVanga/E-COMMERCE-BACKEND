import uploadToCloudinary from "../config/cloudToupload.config.js";
import Product from "../models/product.model.js";
const addProduct = async (req, res) => {
  try {
    // Upload images
    const imageUploads = req.files.map((file) =>
      uploadToCloudinary(file.buffer).catch((err) => {
        console.error("Image upload failed:", err);
        throw new Error("Failed to upload some images");
      })
    );

    const uploadedImages = await Promise.all(imageUploads);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // Prepare product data
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      productType: req.body.productType,
      stock: parseInt(req.body.stock) || 0,
      bestSeller: req.body.bestSeller === "on" ? true : false,
      images: imageUrls,
      attributes: JSON.parse(req.body.attributes),
    };

    // Create and save product
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId: product._id,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse existing images
    let imageUrls = [];
    try {
      imageUrls = JSON.parse(req.body.existingImages || "[]");
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid existingImages format. Must be a JSON array.",
      });
    }

    // Handle new image uploads
    if (Array.isArray(req.files) && req.files.length) {
      const imageUploads = req.files.map((file) =>
        uploadToCloudinary(file.buffer).catch((err) => {
          console.error("Image upload failed:", err);
          return null;
        })
      );

      const uploadedImages = (await Promise.all(imageUploads)).filter(Boolean);
      imageUrls.push(...uploadedImages.map((img) => img.secure_url));
    }

    // Parse attributes
    let attributes = {};
    try {
      attributes = JSON.parse(req.body.attributes || "{}");
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid attributes format. Must be a JSON object.",
      });
    }

    // Construct updated product data
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      productType: req.body.productType,
      stock: parseInt(req.body.stock) || 0,
      bestSeller:
        req.body.bestSeller === "true" || req.body.bestSeller === "on",
      images: imageUrls,
      attributes: attributes,
    };

    // Basic required field check (optional but recommended)
    if (
      !updatedData.name ||
      !updatedData.description ||
      isNaN(updatedData.price) ||
      !updatedData.productType
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid required product fields",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, removeProduct, updateProduct };
