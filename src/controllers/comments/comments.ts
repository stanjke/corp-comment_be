import { Request, Response } from "express";
import { IUserDocument } from "../../models/User";
// import _ from "lodash";
import { Comment, IComment } from "../../models/Comment";
import { ICommentResponse } from "./types";

export const createComment = (req: Request, res: Response) => {
  const userData = req.user as IUserDocument;
  const commentData: IComment = req.body;
  commentData.author = userData?.id;

  if (!commentData.content || !commentData.companyName || !commentData.createdAt || !commentData.rating) {
    res.status(400).json({ message: "Fill correct fields" });
  }
  const { author, content, companyName, createdAt, rating } = commentData;
  const newComment = new Comment({ author, content, companyName, createdAt, rating });
  newComment.populate({ path: "author", select: "_id login" });
  newComment
    .save()
    .then((comment) => res.status(200).json({ message: "Comment was successfuly added", comment }))
    .catch((err) => res.status(400).json({ message: `Error happend on server ${err}` }));
};

export const getAllComments = (req: Request, res: Response) => {
  Comment.find()
    .populate({ path: "author", select: "_id login" })
    .then((comments) => {
      console.log(comments);
      return res.status(200).json(comments);
    })
    .catch((err) => res.status(400).json({ message: `Error happend on server ${err}` }));
};

export const rateComment = (req: Request, res: Response) => {
  const userData = req.user as IUserDocument;
  const commentData = req.body;

  if (!req.body.postId || !req.body.userId) {
    return res.status(400).json({ message: "Fill correct fields" });
  }
}; //PATCH

export const deleteComment = (req: Request, res: Response) => {
  const userData = req.user as IUserDocument;
  const commentData = req.body;

  if (!req.body.postId || !req.body.userId) {
    return res.status(400).json({ message: "Fill correct fields" });
  }

  if (userData.id !== commentData.userId) {
    return res.status(403).json({ message: "You have not enought permissions" });
  } else {
    Comment.findById(commentData.postId)
      .then((comment) => comment?.author.toString() === userData.id ?? res.status(400).json({ message: "Comment not found" }))
      .catch(() => res.status(400).json({ message: `Error happens on server!` }));
  }
};

export const editComment = () => {}; //PATCH
