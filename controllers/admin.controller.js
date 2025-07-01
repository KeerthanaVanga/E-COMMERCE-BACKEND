import AdminModel from "../models/admin.model.js";
import { setAdminTokenCookies } from "../utils/setTokens.js";
import { generateAdminAccessToken } from "../utils/generateToken.js";
import { setAdminAccessTokenCookie } from "../utils/setCookies.js";
import jwt from "jsonwebtoken";
const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.includes(process.env.ADMIN_EMAIL)) {
      return res.json({
        success: false,
        message: "Email not allowed for admin registration",
      });
    }

    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    const newAdmin = new AdminModel({
      email,
      password,
    });

    await newAdmin.save();

    res.json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email, password });

    if (admin) {
      const setAdminTokens = await setAdminTokenCookies(res, email);

      if (setAdminTokens) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.json({
          success: false,
          message: "Error generating or setting cookies",
        });
      }
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogout = async (req, res) => {
  try {
    const { adminRefreshToken } = req.cookies;
    if (adminRefreshToken) {
      const decoded = jwt.verify(
        adminRefreshToken,
        process.env.ADMIN_REFRESH_TOKEN_SECRET
      );
    }
    res.clearCookie("adminRefreshToken");
    res.clearCookie("adminAccessToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.ADMIN_REFRESH_TOKEN_SECRET
    );

    const accessToken = await generateAdminAccessToken(decoded.email);
    setAdminAccessTokenCookie(res, accessToken);

    res.json({ success: true, message: "Token refresh successfully" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, message: error.message });
  }
};

const adminLoggedInStatus = async (req, res) => {
  try {
    const userId = req.admin;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User authenticated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  adminLogin,
  adminRegister,
  adminLogout,
  adminRefresh,
  adminLoggedInStatus,
};
