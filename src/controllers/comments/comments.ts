import { Request, Response } from "express";
import { IUserDocument } from "../../models/User";
import _ from "lodash";
import { Comment, IComment } from "../../models/Comment";

export const createComment = (req: Request, res: Response) => {
  const userData = req.user as IUserDocument;
  const commentData: IComment = req.body;
  commentData.author = userData?.id;

  if (!commentData.content || !commentData.companyName || !commentData.createdAt || !commentData.rating) {
    res.status(400).json({ message: "Fill correct fields" });
  }
  const { author, content, companyName, createdAt, rating } = commentData;
  const newComment = new Comment({ author, content, companyName, createdAt, rating });
  newComment.populate("author");
  newComment
    .save()
    .then((comment) => res.status(200).json({ message: "Comment was successfuly added", comment }))
    .catch((err) => res.status(400).json({ message: `Error happend on server ${err}` }));
};

export const getAllComments = (req: Request, res: Response) => {
  Comment.find()
    .populate("author")
    .then((comments) => res.status(200).json(comments))
    .catch((err) => res.status(400).json({ message: `Error happend on server ${err}` }));
};

export const rateComment = () => {}; //PATCH

export const deleteComment = () => {}; //DELTE

export const editComment = () => {}; //PATCH
