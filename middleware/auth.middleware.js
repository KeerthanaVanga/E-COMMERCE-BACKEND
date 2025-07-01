import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.cookies.userAccessToken;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No access token provided",
      });
    }

    try {
      const decoded = jwt.verify(
        authHeader,
        process.env.USER_ACCESS_TOKEN_SECRET
      );

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Access token expired",
        });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid access token" });
  }
};

export default authenticate;
