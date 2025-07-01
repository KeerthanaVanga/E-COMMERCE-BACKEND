import {
  generateUserAccessToken,
  generateUserRefreshToken,
  generateAdminAccessToken,
  generateAdminRefreshToken,
} from "./generateToken.js";
import {
  setUserAccessTokenCookie,
  setUserRefreshTokenCookie,
  setAdminAccessTokenCookie,
  setAdminRefreshTokenCookie,
} from "./setCookies.js";

const setUserTokenCookies = async (res, id) => {
  try {
    const userAccessToken = await generateUserAccessToken(id);
    const userRefreshToken = await generateUserRefreshToken(id);

    setUserAccessTokenCookie(res, userAccessToken);
    setUserRefreshTokenCookie(res, userRefreshToken);
    return true;
  } catch (error) {
    console.log("Error Occured at setTokens", error.message);
    return false;
  }
};

const setAdminTokenCookies = async (res, email) => {
  try {
    const adminAccessToken = await generateAdminAccessToken(email);
    const adminRefreshToken = await generateAdminRefreshToken(email);

    setAdminAccessTokenCookie(res, adminAccessToken);
    setAdminRefreshTokenCookie(res, adminRefreshToken);
    return true;
  } catch (error) {
    console.log("Error Occured at setTokens", error.message);
    return false;
  }
};

export { setUserTokenCookies, setAdminTokenCookies };
