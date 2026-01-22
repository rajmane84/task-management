import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio?: string;
  myBoards: mongoose.Types.ObjectId[];
  refreshToken?: string;
  savePassword(): Promise<void>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
      default: "",
    },
    myBoards: {
      type: [Schema.Types.ObjectId],
      ref: "Board",
      default: [],
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.ACCESS_TOKEN_SECRET || "access_secret",
    { expiresIn: "60m" },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
    { expiresIn: "7d" },
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
