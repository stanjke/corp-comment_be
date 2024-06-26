import passport from "passport";
import express from "express";
import { createComment, deleteComment, downVoteComment, getAllComments, upVoteComment } from "../controllers/comments/comments";

const router = express.Router();

router.get("/", getAllComments);
router.post("/create", passport.authenticate("jwt", { session: false }), createComment);
router.delete("/delete", passport.authenticate("jwt", { session: false }), deleteComment);
router.patch("/upvote", passport.authenticate("jwt", { session: false }), upVoteComment);
router.patch("/downvote", passport.authenticate("jwt", { session: false }), downVoteComment);
export default router;
