import passport from "passport";
import express from "express";
import { createComment, deleteComment, getAllComments } from "../controllers/comments/comments";

const router = express.Router();

router.get("/", getAllComments);
// router.post("/create", passport.authenticate("jwt", { session: false }), createComment);
router.post("/create", createComment);
router.delete("/delete", passport.authenticate("jwt", { session: false }), deleteComment);
export default router;
