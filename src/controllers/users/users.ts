import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, type IUserDocument, IUser } from "../../models/User";
import { Request, Response } from "express";
import { bcryptSalt } from "../../config/constants";
import { secretOrKey } from "../../config/keys";
import { LoginPayloadType } from "./types";

export const registerUser = (req: Request, res: Response) => {
  const userData: IUser = req.body;
  //SEPARATE VALIDATION LOGIC TO EXTERNAL VALIDATION CLASS OR FUNCTION.
  if (!userData.email || !userData.login || !userData.password) {
    return res.status(400).json({ message: "Fill correct fields" });
  }

  const { login, password, email } = userData;

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
  const userData = req.body;
  //SEPARATE VALIDATION LOGIC TO EXTERNAL VALIDATION CLASS OR FUNCTION.
  if (!userData.loginOrEmail || !userData.password) {
    return res.status(400).json({ message: "Fill correct fields" });
  }

  const { loginOrEmail, password } = userData;

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

export const getUser = (req: Request, res: Response) => {
  return res.json(req.user);
};

export const updatePassword = async (req: Request, res: Response) => {
  // user object from passport middleware if auth succsess
  const currentUser = req.user as IUserDocument;
  //SEPARATE VALIDATION LOGIC TO EXTERNAL VALIDATION CLASS OR FUNCTION.
  if (!req.body.newPassword || !req.body.password) {
    return res.status(400).json({ message: "Fill required fields" });
  }

  try {
    const user = await User.findById(currentUser.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const oldPassword = req.body.password;

    const isMatch: boolean = await user.comparePassword(oldPassword);

    console.log("isMatch", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Password dosen't match" });
    }

    const newPassword = await bcrypt.hash(req.body.newPassword, bcryptSalt);

    const updatedUser = await User.findByIdAndUpdate({ _id: currentUser.id }, { $set: { password: newPassword } }, { new: true });

    return res.status(200).json({ message: "Password succsessfuly changed", user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error occurred on server" });
  }
};

export default passport;
