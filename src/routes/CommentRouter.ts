import passport from "passport";
import express from "express";
import { createComment, getAllComments } from "../controllers/comments/comments";

const router = express.Router();

router.get("/", getAllComments);
router.post("/create", passport.authenticate("jwt", { session: false }), createComment);

export default router;
