import type { Request, Response } from "express";
import {
  addMemberSchema,
  createBoardSchema,
  deleteBoardSchema,
  updateBoardSchema,
  updateRoleSchema,
} from "../zod-schemas/board.schema";
import { formatZodError } from "../utils/format-error";
import { Board } from "../models/board.model";
import mongoose from "mongoose";
import { Card } from "../models/card.model";
import { ShareableLink } from "../models/link.model";

export const handleCreateBoard = async (req: Request, res: Response) => {
  const result = createBoardSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, errors: formatZodError(result.error) });
  }

  const { title, background } = result.data;

  const user = req.user!;

  try {
    const board = await Board.findOne({ title });

    if (board) {
      return res.status(401).json({
        success: false,
        message: "Board with this title already exists",
      });
    }

    const newBoard = await Board.create({
      title,
      background: {
        type: background?.type,
        value: background?.value,
      },
      createdBy: user._id,
      members: [
        {
          user: user._id,
          role: "admin",
        },
      ],
      favorite: false,
      cards: [],
      visibility: "private",
    });

    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: newBoard,
    });
  } catch (error) {
    console.error("Create Board error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while creating board",
    });
  }
};

export const handleGetBoards = async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const boards = await Board.find({ createdBy: user._id }).select(
      "-cards -members -visibility",
    );

    if (boards.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No boards found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Boards fetched successfully",
      data: boards,
    });
  } catch (error) {
    console.error("Get Boards error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while fetching boards",
    });
  }
};

export const handleDeleteBoard = async (req: Request, res: Response) => {
  const result = deleteBoardSchema.safeParse(req.params);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, errors: formatZodError(result.error) });
  }

  const { id } = result.data;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a valid Board ID" });
  }

  try {
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    if (board.cards && board.cards.length > 0) {
      await Card.deleteMany({
        _id: { $in: board.cards },
      });
    }

    await ShareableLink.updateMany(
      {
        targetId: board._id,
        status: "active",
      },
      {
        $set: { status: "revoked" },
      },
    );

    await ShareableLink.deleteMany({
      targetId: board._id,
    });

    await Board.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Board and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Board error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while deleting board",
    });
  }
};

export const handleToggleFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a valid Board ID" });
  }

  try {
    const board = await Board.findById(id);

    if (!board) {
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });
    }

    board.favorite = !board.favorite;
    await board.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: `Board ${board.favorite ? "added to" : "removed from"} favorites`,
      data: board,
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const handleSearchBoards = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const searchQuery = req.query.q as string;

  if (!searchQuery || searchQuery.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Search query (q) is required",
    });
  }

  try {
    const boards = await Board.find({
      title: { $regex: searchQuery, $options: "i" }, // case-insensitive
      $or: [
        { createdBy: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    })
      .select("_id title favorite visibility background createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Search result fetched successfully",
      data: { count: boards.length, boards },
    });
  } catch (error) {
    console.error("Search Boards error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while searching boards",
    });
  }
};

export const handleGetFavoriteBoards = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const favoriteBoards = await Board.find({
      favorite: true,
      $or: [
        { createdBy: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    })
      .select("_id title background visibility createdAt updatedAt")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Favorite boards fetched successfully",
      data: { count: favoriteBoards.length, favoriteBoards },
    });
  } catch (error) {
    console.error("Get Favorite Boards error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while fetching favorite boards",
    });
  }
};

export const handleChangeVisibility =  async(req: Request, res: Response) => {
  const { id } = req.params;
  const { visibility } = req.body;
  const userId = req.user!.id;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid board id",
    });
  }

  if (!["public", "private"].includes(visibility)) {
    return res.status(400).json({
      success: false,
      message: "Visibility must be either 'public' or 'private'",
    });
  }

  try {
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const isAdmin =
      board.createdBy.toString() === userId ||
      board.members.some(
        (member) =>
          member.user.toString() === userId && member.role === "admin"
      );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can change board visibility",
      });
    }

     board.visibility = visibility;
    await board.save();

    return res.status(200).json({
      success: true,
      message: "Board visibility updated successfully",
      data: {
        id: board._id,
        visibility: board.visibility,
      },
    });

  } catch (error) {
    console.error("Change Visibility error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while changing visibility",
    });
  }
};

export const handleUpdateBoard = async (req: Request, res: Response) => {
   const { id } = req.params;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid board id",
    });
  }

  const result = updateBoardSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: formatZodError(result.error),
    });
  }

  const {title, background} = result.data;

  try {
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const canEdit =
      board.createdBy.toString() === userId ||
      board.members.some(
        (member) =>
          member.user.toString() === userId &&
          ["admin", "editor"].includes(member.role as string)
      );

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this board",
      });
    }

    if (title !== undefined) {
      board.title = title;
    }

    if (background !== undefined) {
      board.background = background;
    }

    await board.save();

    return res.status(200).json({
      success: true,
      message: "Board updated successfully",
      data: {
        id: board._id,
        title: board.title,
        background: board.background
      },
    });
  } catch (error) {
    console.error("Update Board error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while updating board",
    });
  }
};

export const addMemberToBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid board id",
    });
  }

  const result = addMemberSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: formatZodError(result.error),
    });
  }

  const { userId, role = "editor" } = result.data;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  try {
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // Admin check (creator or admin member)
    const isAdmin =
      board.createdBy.toString() === adminId ||
      board.members.some(
        (member) =>
          member.user.toString() === adminId && member.role === "admin"
      );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can add members to this board",
      });
    }

    // Prevent adding creator again
    if (board.createdBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "User is already the board owner",
      });
    }

    // Prevent duplicate members
    const alreadyMember = board.members.some(
      (member) => member.user.toString() === userId
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this board",
      });
    }

    board.members.push({
      user: new mongoose.Types.ObjectId(userId),
      role,
    });

    await board.save();

    return res.status(201).json({
      success: true,
      message: "Member added to board successfully",
      data: {
        boardId: board._id,
        userId,
        role,
      },
    });
  } catch (error) {
    console.error("Add Member error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while adding member",
    });
  }
};

export const removeMemberFromBoard = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const adminId = req.user!.id;

  if (
    !mongoose.Types.ObjectId.isValid(id as string) ||
    !mongoose.Types.ObjectId.isValid(userId as string)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid board or user id",
    });
  }

  try {
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // Admin check
    const isAdmin =
      board.createdBy.toString() === adminId ||
      board.members.some(
        (m) => m.user.toString() === adminId && m.role === "admin"
      );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can remove members",
      });
    }

    // Prevent removing board owner
    if (board.createdBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Board owner cannot be removed",
      });
    }

    const memberIndex = board.members.findIndex(
      (m) => m.user.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this board",
      });
    }

    board.members.splice(memberIndex, 1);
    await board.save();

    return res.status(200).json({
      success: true,
      message: "Member removed from board successfully",
    });
  } catch (error) {
    console.error("Remove Member error:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while removing member",
    });
  }
};

export const handleUpdateRole = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const adminId = req.user!.id;

  if (
    !mongoose.Types.ObjectId.isValid(id as string) ||
    !mongoose.Types.ObjectId.isValid(userId as string)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid board or user id",
    });
  }

  const result = updateRoleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: formatZodError(result.error),
    });
  }

  const {role} = result.data;

  try {
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // Admin check
    const isAdmin =
      board.createdBy.toString() === adminId ||
      board.members.some(
        (m) => m.user.toString() === adminId && m.role === "admin"
      );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can update member roles",
      });
    }

    // Prevent role change of board owner
    if (board.createdBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Board owner role cannot be changed",
      });
    }

    const member = board.members.find(
      (m) => m.user.toString() === userId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this board",
      });
    }

    member.role = role;
    await board.save();

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: {
        userId,
        role: member.role,
      },
    });
  } catch (error) {
    console.error("Update Role error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while updating role",
    });
  }
};


export const handleGetBoardDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid board id",
    });
  }

  try {
    const board = await Board.findById(id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const isMember =
      board.createdBy._id.toString() === userId ||
      board.members.some(
        (m) => m.user._id.toString() === userId
      );

    if (!isMember && board.visibility === "private") {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this board",
      });
    }

    return res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    console.error("Get Board Details error:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while fetching board details",
    });
  }
};

