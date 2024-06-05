import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/User";
import "dotenv/config";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  const { login, password }: IUser = req.body;

  try {
    const isUserExist = await User.findOne({ login });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
  }
};

export default passport;
