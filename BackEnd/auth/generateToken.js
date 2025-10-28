import jwt from "jsonwebtoken";
import crypto from "crypto";

const sign = (payload, isAccessToken) => {
  const secretKey = isAccessToken
    ? process.env.JWT_KEY
    : process.env.JWT_KEY_REFRESH;

  const expiresIn = isAccessToken ? "15m" : "7d";

  return jwt.sign(
    {
      ...payload,
      jti: crypto.randomUUID(),
      type: isAccessToken ? "access" : "refresh",
    },
    secretKey,
    {
      algorithm: "HS256",
      expiresIn,
    }
  );
};

const generateAccessToken = (data) => {
  return sign({ data }, true);
};

const generateRefreshToken = (data) => {
  return sign({ data }, false);
};

export default {
  generateAccessToken,
  generateRefreshToken,
};
