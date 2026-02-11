export const setUserAccessTokenCookie = (res, userAccessToken) => {
  res.cookie("userAccessToken", userAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none", // or 'None' if cross-site
    maxAge: 15 * 60 * 1000,
  });
};

export const setUserRefreshTokenCookie = (res, userRefreshToken) => {
  res.cookie("userRefreshToken", userRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none", // or 'None' if cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const setAdminAccessTokenCookie = (res, adminAccessToken) => {
  res.cookie("adminAccessToken", adminAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none", // or 'None' if cross-site
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};

export const setAdminRefreshTokenCookie = (res, adminRefreshToken) => {
  res.cookie("adminRefreshToken", adminRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none", // or 'None' if cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
