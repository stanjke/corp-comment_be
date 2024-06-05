import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../../models/User";
import "dotenv/config";
import { Request, Response } from "express";
import { bcryptSalt } from "../../config/constants";

import { secretOrKey } from "../../config/keys";
import { LoginPayloadType } from "./types";

export const registerUser = (req: Request, res: Response) => {
  const { login, password, email }: IUser = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        if (user.email === email) {
          return res.status(400).json({ message: `Email ${email} already exist` });
        }

        if (user.login === login) {
          return res.status(400).json({ message: `Login ${login} already exist` });
        }
      }

      const newUser = new User({ login, email, password });

      bcrypt.genSalt(bcryptSalt, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return res.status(400).json({ message: `Error happens on server ${err}` });
          }

          newUser.password = hash;
          newUser.save().then((user) => res.status(200).json({ message: `User ${user.email} was succsessfuly registrated!` }));
        });
      });
    })
    .catch((err) => res.status(400).json({ message: `Error happened on server ${err}` }));
};

export const loginUser = async (req: Request, res: Response) => {
  const { loginOrEmail, password } = req.body;

  User.findOne({
    $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: `User not found` });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch && user._id) {
          const payload: LoginPayloadType = {
            id: user._id,
            login: user.login,
          };

          jwt.sign(payload, secretOrKey as string, { expiresIn: 360000 }, (err, token) => res.status(200).json({ success: true, token: "Bearer " + token }));
        } else {
          return res.status(400).json({ message: "Password incorrect" });
        }
      });
    })
    .catch((err) => res.status(400).json({ message: `Error happend on server ${err}` }));
};

export const updatePassword = async () => {};

export default passport;
