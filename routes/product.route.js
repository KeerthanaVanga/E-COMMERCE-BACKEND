import express from "express";
import {
  listProducts,
  singleProduct,
  relatedProducts,
  bestSellerProducts,
  latestCollectionProducts,
  searchProduct,
  productReviews,
} from "../controllers/product.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const productRouter = express.Router();

productRouter.get("/list-products", listProducts);
productRouter.get("/get-single-product/:id", singleProduct);
productRouter.get(
  "/get-related-product/:category/:productType/:subCategory",
  relatedProducts
);
productRouter.get("/get-bestseller-products", bestSellerProducts);
productRouter.get("/get-latest-products", latestCollectionProducts);
productRouter.get("/search", searchProduct);
productRouter.post("/:id/reviews", authenticate, productReviews);

export default productRouter;
