import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  title: string;
  background?: string;
  createdBy: mongoose.Types.ObjectId;
//   members: mongoose.Types.ObjectId[]; -- FUTURE IMPROVEMENT --
  favorite: boolean;
  cards: mongoose.Types.ObjectId[];
}

const boardSchema = new Schema<IBoard>({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  background: {
    type: String,
    default: "", // check how to set default background image or color and add a default value here
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
  cards: {
    type: [Schema.Types.ObjectId],
    ref: "Card",
    default: [],
  }
}, {timestamps: true});

export const Board = mongoose.model<IBoard>("Board", boardSchema);