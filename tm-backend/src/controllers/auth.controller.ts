import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../zod-schemas/auth.schema";
import { formatZodError } from "../utils/format-error";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { COOKIE_OPTIONS } from "../constants";

export const handleUserLogin = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, errors: formatZodError(result.error) });
  }

  const { email, password } = result.data;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .cookie("accessToken", accessToken)
      .json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
          },
        },
      });
  } catch (error: any) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const handleUserSignup = async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, errors: formatZodError(result.error) });
  }

  const { email, password } = result.data;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      email,
      password,
      username: email.split("@")[0],
      bio: "",
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(201)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .cookie("accessToken", accessToken)
      .json({
        success: true,
        message: "User created successfully",
        data: {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
          },
        },
      });
  } catch (error: any) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token missing" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as JwtPayload;

    const user = await User.findById(decoded._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const accessToken = user.generateAccessToken();

    return res.status(200).cookie("accessToken", accessToken).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    // Clear cookies if the token is invalid or expired
    res.clearCookie("refreshToken");
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};
