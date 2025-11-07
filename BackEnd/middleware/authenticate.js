import getTokenFromHeader from "../auth/getTokenFromHeader.js"
import { jsonResponse } from "../lib/jsonResponse.js";
import verifyTokens from '../auth/verifyTokens.js';

export const authenticate = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers);
    if (!token) {
      return res
      .status(401)
      .json(jsonResponse(401, { error: "No Token Provided." }));
    }

    const decoded = verifyTokens.verifyAccessToken(token);
    if (!decoded) {
      return res
      .status(401)
      .json(jsonResponse(401, { error: "Invalid or expired token." }));
    }
    req.user = { ...decoded.data };
    next();
  } catch (error) {
    console.error("Error en authenticate middleware:", error);
    return res
      .status(401)
      .json(jsonResponse(401, { error: "Unauthorized: Invalid token." }));
  }
}
