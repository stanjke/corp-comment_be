import mongoose, { type Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IUser extends Document {
  email: string;
  login: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  login: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
