import { verifyAccessToken } from "../utils/jwt.js";
import boom from "@hapi/boom";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const boomError = boom.unauthorized(error);
    return res
      .status(boomError.output.statusCode)
      .json(boomError.output.payload);
  }
};
