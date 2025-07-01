import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import adminProductRoute from "./routes/adminProduct.route.js";
import adminRouter from "./routes/admin.route.js";
import connectDB from "./database/mongodb.js";
import cartRouter from "./routes/cart.route.js";
import paymentRouter from "./routes/payment.route.js";
import orderRouter from "./routes/order.route.js";
import adminOrderRouter from "./routes/adminOrder.route.js";
const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // replace with actual frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);
app.use("/admin/product", adminProductRoute);
app.use("/admin/admin-auth", adminRouter);
app.use("/admin/admin-order", adminOrderRouter);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
