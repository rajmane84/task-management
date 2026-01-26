import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
  title: string;
  description?: string;
  completed?: boolean;
  startDate?: Date;
  dueDate?: Date;
  assignedTo?: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  board: mongoose.Types.ObjectId;
  labels: string[];
}

const cardSchema = new Schema<ICard>({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  comments: {
    type: [mongoose.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
  board: {
    type: mongoose.Types.ObjectId,
    ref: "Board",
    required: [true, "A card must belong to a board"],
  },
  labels: {
    type: [String],
    default: [],
  },
});

export const Card = mongoose.model<ICard>("Card", cardSchema);
