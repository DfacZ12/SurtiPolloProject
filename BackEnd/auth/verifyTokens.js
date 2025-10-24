import jwt from "jsonwebtoken"

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY);
}

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY_REFRESH);
}

export default {
  verifyAccessToken,
  verifyRefreshToken,
};