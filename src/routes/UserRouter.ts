import passport from "passport";
import { getUser, loginUser, registerUser, updatePassword } from "../controllers/users/users";
import express from "express";
import { UserRoute } from "../config/constants";

const router = express.Router();

router.post(UserRoute.REGISTER, registerUser);
router.post(UserRoute.LOGIN, loginUser);
router.get(UserRoute.GET_USER, passport.authenticate("jwt", { session: false }), getUser);
router.put(UserRoute.UPDATE_PASSWORD, passport.authenticate("jwt", { session: false }), updatePassword);

export default router;
