import jwt from "jsonwebtoken";

const USER_ACCESS_TOKEN_SECRET = process.env.USER_ACCESS_TOKEN_SECRET;
const USER_REFRESH_TOKEN_SECRET = process.env.USER_REFRESH_TOKEN_SECRET;
const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;

// Generate tokens
export const generateUserAccessToken = async (userId) => {
  const userAccessToken = jwt.sign({ id: userId }, USER_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  return userAccessToken;
};

export const generateUserRefreshToken = async (userId) => {
  const userRefreshToken = jwt.sign({ id: userId }, USER_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return userRefreshToken;
};

export const generateAdminAccessToken = async (email) => {
  const adminAccessToken = jwt.sign(
    { email, isAdmin: true },
    ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  return adminAccessToken;
};

export const generateAdminRefreshToken = async (email) => {
  const adminRefreshToken = jwt.sign(
    { email, isAdmin: true },
    ADMIN_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return adminRefreshToken;
};
