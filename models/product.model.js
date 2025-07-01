import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    // Common fields for all products
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be positive"],
    },
    images: [
      {
        type: String,
        required: [true, "At least one product image is required"],
      },
    ],
    productType: {
      type: String,
      required: [true, "Product type is required"],
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    // Dynamic fields storage
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (value) {
          // Validate based on productType
          switch (this.productType) {
            case "clothing":
              return value.size && value.color && value.material;
            case "electronics":
              return value.brand && value.model;
            case "books":
              return value.author && value.publisher;
            default:
              return true;
          }
        },
        message: "Attributes validation failed for product type",
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ productType: 1, bestSeller: 1 });
ProductSchema.index({ createdAt: -1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
