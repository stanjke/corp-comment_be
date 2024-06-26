import { Request, Response } from "express";
import { IUserDocument } from "../../models/User";
// import _ from "lodash";
import { Comment, IComment } from "../../models/Comment";
import { ICommentRequestDelete } from "./types";
import { ObjectId } from "mongoose";

export const createComment = async (req: Request, res: Response) => {
  console.log(req.user);
  const { id } = req.user as IUserDocument;
  const { content, companyName, createdAt, rating } = req.body as IComment;

  console.log("content", content);
  console.log("companyName", companyName);
  console.log("createdAt", createdAt);
  console.log("rating", rating);

  if (!content || !companyName || !createdAt || (!rating && rating !== 0)) {
    return res.status(400).json({ message: "Fill correct fields" });
  }

  const newComment = new Comment({ author: id, content, companyName, createdAt, rating });

  try {
    await newComment.populate({ path: "author", select: "_id login" });
    await newComment.save();
    return res.status(201).json({ message: "Comment was successfuly added", newComment });
  } catch (error) {
    return res.status(400).json({ message: `Error happend on server ${error}` });
  }
};

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find().populate({ path: "author", select: "_id login" });
    return res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: `Error happend on server ${error}` });
  }
};

export const upVoteComment = async (req: Request, res: Response) => {
  const { _id } = req.user as IUserDocument;
  const { postId } = req.body;

  console.log("ID: ", _id);

  if (!_id) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  if (!postId) {
    return res.status(400).json({ message: "Fill correct fields" });
  }

  try {
    const comment = await Comment.findById(postId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.ratedBy.includes(_id as ObjectId)) {
      return res.status(400).json({ message: "You have already rated this comment" });
    }

    comment.ratedBy.push(_id as ObjectId);

    comment.rating = comment.rating + 1;
    await comment.save();

    return res.status(200).json({ message: "Comment was successfuly up voted" });
  } catch (error) {
    return res.status(400).json({ message: `Error happens on server!` });
  }
}; //PATCH

export const downVoteComment = async (req: Request, res: Response) => {
  const { _id } = req.user as IUserDocument;
  const { postId } = req.body;

  if (!_id) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  if (!postId) {
    return res.status(400).json({ message: "Fill correct fields" });
  }
  try {
    const comment = await Comment.findById(postId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.ratedBy.includes(_id as ObjectId)) {
      comment.ratedBy = [...comment.ratedBy.filter((id) => id == _id)];

      comment.rating = comment.rating - 1;

      await comment.save();

      return res.status(200).json({ message: "Comment was successfuly down voted" });
    }
  } catch (error) {
    return res.status(400).json({ message: `Error happens on server!` });
  }
}; //PATCH

//CODE NOT WORKING PROPERLY. NEED TO FIX DELETECOMMENT FUNCTION

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.user as IUserDocument;
  const { userId, postId } = req.body as ICommentRequestDelete;

  if (!postId || !userId) {
    return res.status(400).json({ message: "Fill correct fields" });
  }

  if (id !== userId) {
    return res.status(403).json({ message: "You have not enought permissions" });
  }

  try {
    const comment = await Comment.findById(postId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await Comment.deleteOne({ _id: postId });

    return res.status(200).json({ message: "Comment was successfuly deleted" });
  } catch (error) {
    res.status(400).json({ message: `Error happens on server!` });
  }
};

export const editComment = () => {}; //PATCH
