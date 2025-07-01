import jwt from "jsonwebtoken";

const adminAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.cookies.adminAccessToken;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No access token provided",
      });
    }

    try {
      const decoded = jwt.verify(
        authHeader,
        process.env.ADMIN_ACCESS_TOKEN_SECRET
      );
      const admin = decoded.email;

      if (admin !== process.env.ADMIN_EMAIL) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }
      req.admin = admin;

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

export default adminAuthenticate;
