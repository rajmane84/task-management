import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  title: string;
  background?: {
    type: String,
    value: String
  };
  createdBy: mongoose.Types.ObjectId;
  members: {
    user: mongoose.Types.ObjectId;
    role: String
  }[];
  favorite: boolean;
  cards: mongoose.Types.ObjectId[];
  visibility: String;
}

const boardSchema = new Schema<IBoard>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    background: {
      type: {
        type: String,
        enum: ["image", "color"],
        default: "color"
      },
      value: {
        type: String,
        default: "#ffffff" // white color
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: String,
          enum: ["admin", "editor", "viewer"], // For now we'll keep only one admin ie the creator and others will be editors or viewers
          default: "editor"
        }
      }
    ],
    cards: {
      type: [Schema.Types.ObjectId],
      ref: "Card",
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private"
    }
  },
  { timestamps: true },
);

export const Board = mongoose.model<IBoard>("Board", boardSchema);
