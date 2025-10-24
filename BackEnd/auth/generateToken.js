import jwt from "jsonwebtoken";

const sign = (payload, isAccessToken) => {
  return jwt.sign(
    payload,
    isAccessToken ? process.env.JWT_KEY : process.env.JWT_KEY_REFRESH,
    {
      algorithm: "HS256",
      expiresIn: "3h",
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