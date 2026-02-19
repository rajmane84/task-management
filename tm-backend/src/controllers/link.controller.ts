import type { Request, Response } from "express";
import crypto from "crypto";
import { ShareableLink } from "../models/link.model";
import { createLinkSchema } from "../zod-schemas/link.schema";
import { formatZodError } from "../utils/format-error";
import { logger } from "../utils/logger";
import mongoose from "mongoose";
import { validateParams } from "../utils/validate-params";

export const handleCreateShareableLink = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = createLinkSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, errors: formatZodError(result.error) });
    }

    const { targetId, role, expiresAt, maxUses } = result.data;

    const token = crypto.randomUUID();

    const link = await ShareableLink.create({
      token,
      targetId,
      role,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxUses: maxUses ?? 5,
      createdBy: req.user!._id,
    });

    logger.info(
      {
        linkId: link._id,
        targetId,
        role,
        createdBy: req.user!._id,
      },
      "Shareable link created",
    );

    return res.status(201).json({
      success: true,
      message: "Shareable link created successfully",
      data: { link },
    });
  } catch (error) {
    logger.error({ error }, "Error creating shareable link");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handleGetLinkByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const paramsValidationResult = validateParams(token);

    if (!paramsValidationResult.success) {
      return res
        .status(400)
        .json({ success: false, message: paramsValidationResult.message });
    }

    const { value } = paramsValidationResult;

    const link = await ShareableLink.findOne({ token: value })
      .select("-__v")
      .lean();

    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found." });
    }

    const now = new Date();

    const isValid =
      link.status === "active" &&
      (!link.expiresAt || link.expiresAt > now) &&
      (!link.maxUses || link.usedCount < link.maxUses);

    return res.status(200).json({ success: true, data: { ...link, isValid } });
  } catch (error) {
    logger.error({ error }, "Error getting shareable link by token");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handleUseLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const paramsValidationResult = validateParams(token);

    if (!paramsValidationResult.success) {
      return res
        .status(400)
        .json({ success: false, message: paramsValidationResult.message });
    }

    const { value } = paramsValidationResult;

    const now = new Date();

    const link = await ShareableLink.findOneAndUpdate(
      {
        token: value,
        status: "active",
        $and: [
          {
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
          },
          {
            $or: [
              { maxUses: null },
              { $expr: { $lt: ["$usedCount", "$maxUses"] } },
            ],
          },
        ],
      },
      { $inc: { usedCount: 1 } },
      { new: true },
    );

    if (!link) {
      // Distinguish between "not found" and "invalid" for better UX
      const existing = await ShareableLink.findOne({ token }).lean();

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Link not found." });
      }
      if (existing.status === "revoked") {
        return res.status(410).json({ message: "This link has been revoked." });
      }
      if (existing.expiresAt && existing.expiresAt <= now) {
        return res
          .status(410)
          .json({ success: false, message: "This link has expired." });
      }
      if (
        existing.maxUses !== null &&
        existing.maxUses !== undefined &&
        existing.usedCount >= existing.maxUses
      ) {
        return res.status(410).json({
          success: false,
          message:
            "This link has reached its maximum number of uses.",
        });
      }
      return res.status(410).json({ message: "This link is no longer valid." });
    }

    logger.info(
      {
        linkId: link._id,
        token,
        useCount: link.usedCount,
        maxUses: link.maxUses,
      },
      "Shareable link used",
    );

    return res.status(200).json({
      success: true,
      data: {
        role: link.role,
        targetId: link.targetId,
        usesRemaining: link.maxUses ? link.maxUses - link.usedCount : null,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error using shareable link");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handleRevokeLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const paramsValidationResult = validateParams(id);

    if (!paramsValidationResult.success) {
      return res
        .status(400)
        .json({ success: false, message: paramsValidationResult.message });
    }

    const { value } = paramsValidationResult;

    if (!mongoose.Types.ObjectId.isValid(value as string)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid link ID format." });
    }

    const link = await ShareableLink.findById(value);

    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found." });
    }

    // Only the creator (or an admin) can revoke
    if (
      link.createdBy.toString() !== req.user!._id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to revoke this link.",
      });
    }

    if (link.status === "revoked") {
      return res
        .status(409)
        .json({ success: false, message: "Link is already revoked." });
    }

    link.status = "revoked";
    await link.save();

    logger.info(
      {
        linkId: link._id,
        revokedBy: req.user!._id,
      },
      "Shareable link revoked",
    );

    return res.json({ success: true, message: "Link revoked successfully." });
  } catch (error) {
    logger.error({ error }, "Error revoking shareable link");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handleGetLinksByTarget = async (req: Request, res: Response) => {
  try {
    const { targetId } = req.params;

    const paramsValidationResult = validateParams(targetId);

    if (!paramsValidationResult.success) {
      return res
        .status(400)
        .json({ success: false, message: paramsValidationResult.message });
    }

    const { value } = paramsValidationResult;

    if (!mongoose.Types.ObjectId.isValid(value as string)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid targetId format." });
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    // Optional: filter by status
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    const [links, total] = await Promise.all([
      ShareableLink.find({ targetId, ...statusFilter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean(),
      ShareableLink.countDocuments({ targetId, ...statusFilter }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        links,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error getting shareable links by target");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handleDeleteLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const paramsValidationResult = validateParams(id);

    if (!paramsValidationResult.success) {
      return res
        .status(400)
        .json({ success: false, message: paramsValidationResult.message });
    }

    const { value } = paramsValidationResult;

    if (!mongoose.Types.ObjectId.isValid(value as string)) {
      return res.status(400).json({ message: "Invalid link ID format." });
    }

    const link = await ShareableLink.findById(value);

    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found." });
    }

    if (
      link.createdBy.toString() !== req.user!._id &&
      req.user!._role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this link." });
    }

    await link.deleteOne();

    logger.info(
      {
        linkId: id,
        deletedBy: req.user!._id,
      },
      "Shareable link deleted",
    );

    return res
      .status(200)
      .json({ success: true, message: "Link deleted successfully." });
  } catch (error) {
    logger.error({ error }, "Error deleting shareable link");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
