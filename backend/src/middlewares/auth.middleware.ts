import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[process.env.AUTH_TOKEN as string];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided", ok: false });
  }
  try {
    const decoded = jwt.verify(token, config.jwt_secret) as { user_id: number };
    req.user_id = decoded.user_id;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: "Unauthorized", ok: false });
  }
};
