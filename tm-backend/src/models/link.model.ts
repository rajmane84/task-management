import mongoose, { Schema, Document } from "mongoose";

interface IShareableLink extends Document {
  token: string;
  targetId: mongoose.Types.ObjectId;
  role: "editor" | "viewer";
  expiresAt?: Date | null;
  maxUses?: number | null;
  usedCount: number;
  status: "active" | "expired" | "revoked";
  createdBy: mongoose.Types.ObjectId;
  isValid: boolean;
}

const ShareableLinkSchema = new Schema<IShareableLink>(
  {
    token: {
      type: String,
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    role: {
      type: String,
      enum: ["editor", "viewer"],
      default: "editor",
    },
    expiresAt: {
      type: Date, // optional expiration
      default: null,
    },
    maxUses: {
      type: Number, // optional max number of uses
      default: 5,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    },
  },
  { timestamps: true }, // automatically adds createdAt and updatedAt
);

// add a virtual field to check if link is valid
ShareableLinkSchema.virtual("isValid").get(function () {
  const now = new Date();
  if (this.status !== "active") return false;
  if (this.expiresAt && now > this.expiresAt) return false;
  if (this.maxUses && this.maxUses !== null && this.usedCount >= this.maxUses)
    return false;
  return true;
});

// Helper method to validate and increment use count
ShareableLinkSchema.methods.validateAndUse = async function (): Promise<{ success: boolean; reason?: string }> {
  const now = new Date();

  if (this.status === "revoked") {
    return { success: false, reason: "revoked" };
  }

  if (this.expiresAt && now > this.expiresAt) {
    this.status = "expired";
    await this.save();
    return { success: false, reason: "expired" };
  }

  if (
    this.maxUses !== null &&
    this.maxUses !== undefined &&
    this.usedCount >= this.maxUses
  ) {
    this.status = "expired";
    await this.save();
    return { success: false, reason: "max_uses_reached" };
  }

  this.usedCount += 1;

  if (
    this.maxUses !== null &&
    this.maxUses !== undefined &&
    this.usedCount >= this.maxUses
  ) {
    this.status = "expired";
  }

  await this.save();

  return { success: true };
};

ShareableLinkSchema.index({ token: 1 });
ShareableLinkSchema.index({ targetId: 1 });
ShareableLinkSchema.index({ createdBy: 1 });

export const ShareableLink = mongoose.model<IShareableLink>(
  "ShareableLink",
  ShareableLinkSchema,
);
