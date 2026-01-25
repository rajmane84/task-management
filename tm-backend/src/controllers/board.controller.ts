import type { Request, Response } from "express";
import {
  createBoardSchema,
  deleteBoardSchema,
} from "../zod-schemas/board.schema";
import { formatZodError } from "../utils/format-error";
import { Board } from "../models/board.model";
import mongoose from "mongoose";

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
      background: background || "",
      createdBy: user._id,
      favorite: false,
      cards: [],
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
    const boards = await Board.find({ createdBy: user._id }).select("-cards");

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

  try {
    const deletedBoard = await Board.findByIdAndDelete(id);

    if (!deletedBoard) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Board deleted successfully",
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
