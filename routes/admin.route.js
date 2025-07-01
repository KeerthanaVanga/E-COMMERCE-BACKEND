import express from "express";
import {
  adminLogin,
  adminRegister,
  adminLogout,
  adminRefresh,
  adminLoggedInStatus,
} from "../controllers/admin.controller.js";
import adminAuthenticate from "../middleware/adminAuth.middleware.js";
const adminRouter = express.Router();

adminRouter.post("/signup", adminRegister);
adminRouter.post("/login", adminLogin);
adminRouter.get("/logout", adminLogout);
adminRouter.post("/admin-refresh", adminRefresh);
adminRouter.get("/admin-check", adminAuthenticate, adminLoggedInStatus);

export default adminRouter;
