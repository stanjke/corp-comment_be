import mongoose, { type Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  login: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword: (password: string) => boolean;
}

const UserSchema = new Schema<IUserDocument>({
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

UserSchema.methods.comparePassword = async function (oldPassword: string) {
  return await bcrypt.compare(oldPassword, this.password).then((isMatch) => isMatch);
};

export const User = mongoose.model<IUserDocument>("User", UserSchema);
