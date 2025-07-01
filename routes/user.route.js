import express from "express";
import {
  loginUser,
  registerUser,
  logout,
  userRefresh,
  checkLoggedInStatus,
  profile,
} from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logout);
userRouter.post("/user-refresh", userRefresh);
userRouter.get("/check-user", authenticate, checkLoggedInStatus);
userRouter.get("/get-profile", authenticate, profile);

export default userRouter;
