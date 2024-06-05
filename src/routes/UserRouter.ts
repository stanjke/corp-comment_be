import passport from "passport";
import { getUser, loginUser, registerUser } from "../controllers/users/users";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/user", getUser);
router.get("/user", passport.authenticate("jwt", { session: false }), getUser);

export default router;
