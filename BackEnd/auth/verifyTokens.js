import jwt from "jsonwebtoken";

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.type !== "access") {
      throw new Error("El token no es de tipo access");
    }
    return decoded;
  } catch (error) {
    console.error("Error verificando access token:", error.message);
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY_REFRESH);
    if (decoded.type !== "refresh") {
      throw new Error("El token no es de tipo refresh");
    }
    return decoded;
  } catch (error) {
    console.error("Error verificando refresh token:", error.message);
    return null;
  }
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
};
