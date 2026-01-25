import type { Request, Response } from "express";
import {
  createCardSchema,
  getAllCardsSchema,
  deleteCardSchema,
  updateCardSchema,
} from "../zod-schemas/card.schema";
import { formatZodError } from "../utils/format-error";
import { Board } from "../models/board.model";
import { Card } from "../models/card.model";
import mongoose from "mongoose";

export const handleGetCards = async (req: Request, res: Response) => {
  const result = getAllCardsSchema.safeParse(req.params);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, errors: formatZodError(result.error) });
  }

  const { boardId } = result.data;

  if (!mongoose.isValidObjectId(boardId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Board ID",
    });
  }

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "No such board exists",
      });
    }

    const cards = await Card.find({ board: boardId }).select("-board");
    return res.status(200).json({
      success: true,
      message: "All cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Error fetching cards", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while fetching cards",
    });
  }
};

export const handleCreateCard = async (req: Request, res: Response) => {
  const result = createCardSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, errors: formatZodError(result.error) });
  }

  const {
    title,
    description,
    completed,
    startDate,
    dueDate,
    assignedTo,
    labels,
    boardId,
  } = result.data;

  try {
    const existingCard = await Card.findOne({ title });
    if (existingCard) {
      return res.status(409).json({
        success: false,
        message: "Card with this title already exists",
      });
    }

    const card = await Card.create({
      title,
      description,
      completed,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo: assignedTo || undefined,
      labels: labels || [],
      board: boardId,
    });

    return res.status(201).json({
      success: true,
      message: "Card created successfully",
    });
  } catch (error) {
    console.error("Create card error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occured while creating card",
    });
  }
};

export const handleUpdateCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  if (!cardId) {
    return res.status(401).json({
      success: false,
      message: "Card ID is required",
    });
  }

  if (!mongoose.isValidObjectId(cardId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Card ID",
    });
  }

  const result = updateCardSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.flatten().fieldErrors,
    });
  }

  const {
    title,
    description,
    completed,
    startDate,
    dueDate,
    assignedTo,
    labels,
  } = result.data;

  const updateData: any = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (completed !== undefined) updateData.completed = completed;
  if (startDate !== undefined) updateData.startDate = new Date(startDate);
  if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
  if (labels !== undefined) updateData.labels = labels;

  if (assignedTo !== undefined) {
    if (!mongoose.isValidObjectId(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignedTo user ID",
      });
    }
    updateData.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  }

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-board");

    if (!updatedCard) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update card",
      error: error.message,
    });
  }
};

export const handleDeleteCard = async (req: Request, res: Response) => {
  const result = deleteCardSchema.safeParse(req.params);

  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, errors: formatZodError(result.error) });
  }

  const { cardId } = result.data;

  if (!mongoose.isValidObjectId(cardId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Card ID",
    });
  }

  try {
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    console.error("Delete card error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occured while deleting the card",
    });
  }
};
