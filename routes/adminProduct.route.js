import express from "express";
import {
  addProduct,
  updateProduct,
  removeProduct,
} from "../controllers/adminProduct.controller.js";
import { listProducts } from "../controllers/product.controller.js";
import uploadImages from "../middleware/multer.middleware.js";
import adminAuthenticate from "../middleware/adminAuth.middleware.js";

const adminProductRoute = express.Router();

adminProductRoute.get("/list-products", listProducts);

adminProductRoute.post(
  "/add-product",
  adminAuthenticate,
  uploadImages,
  addProduct
);
adminProductRoute.post(
  "/update-product/:id",
  adminAuthenticate,
  uploadImages,
  updateProduct
);
adminProductRoute.post("/remove-product", adminAuthenticate, removeProduct);

export default adminProductRoute;
