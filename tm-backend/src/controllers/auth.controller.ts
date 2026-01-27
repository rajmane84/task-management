import type { Request, Response } from "express";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../zod-schemas/auth.schema";
import { formatZodError } from "../utils/format-error";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { COOKIE_OPTIONS, NODE_ENV } from "../constants";
import { generateUsername } from "../utils/generate-username";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/send-email";

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

  const { name, email, password } = result.data;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const username = await generateUsername(email);

    const user = await User.create({
      name,
      email,
      password,
      username,
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

export const handleUserLogout = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: "" } },
      { new: true },
    );

    res.clearCookie("refreshToken", COOKIE_OPTIONS).clearCookie("accessToken");

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Failed to log out user" });
  }
};

export const handleForgotPassword = async (req: Request, res: Response) => {
  const result = forgotPasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, message: formatZodError(result.error) });
  }

  const { email } = result.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.warn(
        "A forgot password request received for a non existing user",
      );
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

    await user.save({ validateBeforeSave: false });

    let resetUrl;
    if (NODE_ENV === "production") {
      resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    } else {
      resetUrl = `http://localhost:${process.env.PORT}/api/v1/reset-password`;
    }

    await sendResetPasswordEmail(user.email, resetUrl);

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const handleResetPassword = async (req: Request, res: Response) => {
  const result = resetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, message: formatZodError(result.error) });
  }

  const { newPassword, token } = result.data;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // TODO: A MAIL NEED TO BE SEND TO THE USER REGARDING THE PASSWORD CHANGE. USE QUEUES TO HANDLE HUGE NO. OF REQUESTS

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
