import {
  createUser,
  findUserByEmail,
  getUserProfile,
} from "../services/user.service.js";
import validator from "validator";
import bcrypt from "bcrypt";

import { setUserTokenCookies } from "../utils/setTokens.js";
import jwt from "jsonwebtoken";
import { setUserAccessTokenCookie } from "../utils/setCookies.js";
import { generateUserAccessToken } from "../utils/generateToken.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const setTokens = await setUserTokenCookies(res, user._id);

    if (setTokens) {
      res.json({ success: true, message: "Login Successfully" });
    } else {
      res.json({ success: false, message: "Error at Login" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const exists = await findUserByEmail(email);
    if (exists) {
      return res
        .status(404)
        .json({ success: false, message: "User Already Exists" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(404)
        .json({ success: false, message: "Please Enter Valid Email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser({ name, password: hashedPassword, email });

    const setTokens = await setUserTokenCookies(res, user._id);
    if (setTokens) {
      res.json({ success: true, message: "Login Successfully" });
    } else {
      res.json({ success: false, message: "Error at Login" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkLoggedInStatus = async (req, res) => {
  try {
    const userId = req.user._id;

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

const userRefresh = async (req, res) => {
  try {
    const userRefreshToken = req.cookies.userRefreshToken;

    if (!userRefreshToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      userRefreshToken,
      process.env.USER_REFRESH_TOKEN_SECRET
    );

    const accessToken = await generateUserAccessToken(decoded.id);
    setUserAccessTokenCookie(res, accessToken);

    res.json({ success: true, message: "Token refresh successfully" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { userRefreshToken } = req.cookies;
    if (userRefreshToken) {
      const decoded = jwt.verify(
        userRefreshToken,
        process.env.USER_REFRESH_TOKEN_SECRET
      );
    }
    res.clearCookie("userRefreshToken");
    res.clearCookie("userAccessToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authentication middleware sets req.user

    const user = await getUserProfile(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

export {
  loginUser,
  registerUser,
  logout,
  userRefresh,
  checkLoggedInStatus,
  profile,
};
