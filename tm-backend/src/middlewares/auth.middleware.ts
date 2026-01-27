import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { type IUser, User } from "../models/user.model";

export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken =
    req.header("Authorization")?.split(" ")[1] || req.cookies["accessToken"];

  if (!accessToken) {
    return res
      .status(403)
      .json({ success: false, message: "Token is required" });
  }

  const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;

  if (!decodedToken) {
    return res.status(403).json({ success: false, message: "Invalid Token" });
  }

  const { _id, name, email, username } = decodedToken;

  let user: IUser | null;

  try {
    user = await User.findById(_id);
  } catch (_error) {
    return res
      .status(500)
      .json({ success: false, message: "Unexpected error" });
  }

  if (!user) {
    return res
      .status(403)
      .json({ success: false, message: "No such user exists" });
  }

  req.user = {
    _id,
    name,
    email,
    username,
  };

  next();
}
