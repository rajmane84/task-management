import type { Request, Response } from "express";
import { User } from "../models/user.model";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import {
  checkUsernameSchema,
  updateUserSchema,
} from "../zod-schemas/user.schema";
import { formatZodError } from "../utils/format-error";
import { Board } from "../models/board.model";
import e from "express";
import { COOKIE_OPTIONS } from "../constants";

export const handleGetCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId).select(
      "-password -refreshToken -passwordResetToken -passwordResetExpires",
    );

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const handleUpdateUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: formatZodError(result.error),
      });
    }

    const updateData = result.data;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: false,
      context: "query",
    }).select(
      "-password -refreshToken -passwordResetToken -passwordResetExpires",
    );

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user details error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const handleUpdateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No avatar file uploaded" });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const avatarUrl = await uploadOnCloudinary(req.file.path, "user_avatars");
    if (!avatarUrl)
      return res
        .status(500)
        .json({ success: false, message: "Failed to upload avatar" });

    if (user.avatar) {
      const publicId = user.avatar.split("/").pop()?.split(".")[0]; // crude extraction
      if (publicId) await deleteFromCloudinary(`user_avatars/${publicId}`);
    }

    user.avatar = avatarUrl;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.avatar) {
      const publicId = user.avatar.split("/").pop()?.split(".")[0];
      if (publicId) await deleteFromCloudinary(`user_avatars/${publicId}`);
    }

    const deletedBoards = await Board.deleteMany({ createdBy: user._id });
    await user.deleteOne();

    res.clearCookie("accessToken").clearCookie("refreshToken", COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "User and associated boards deleted successfully",
      data: {
        deletedBoardsCount: deletedBoards.deletedCount,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const handleCheckUsernameExists = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = checkUsernameSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: formatZodError(result.error),
      });
    }

    const { username } = result.data;

    const userExists = await User.exists({
      username: username.toLowerCase().trim(),
    });

    if (userExists) {
      return res.status(200).json({
        success: true,
        message: "This username is already taken",
        data: { usernameExists: false },
      });
    } else {
      res.status(200).json({
        success: true,
        message: "This username is available",
        data: { usernameExists: true },
      });
    }
  } catch (error) {
    console.error("Check username error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
