import getTokenFromHeader from "../auth/getTokenFromHeader.js"
import { jsonResponse } from "../lib/jsonResponse.js";
import verifyTokens from '../auth/verifyTokens.js';

export const authenticate = (req, res, next) => {
  const token = getTokenFromHeader(req.headers);
  if (!token) {
    res.status(401).json(jsonResponse(401,{ error: 'No Token Provided.' }));
  }
  const decoded = verifyTokens.verifyAccessToken(token);
  if (!decoded) {
    res.status(401).json(jsonResponse(401,{ error: 'No Token Provided.' }));
  }
  req.user = {... decoded.data};
  console.log("decode" + decoded.data)
  next();
}
