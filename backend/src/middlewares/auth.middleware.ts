import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[config.auth_token];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, config.jwt_secret) as { user_id: number };
    req.user_id = decoded.user_id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
