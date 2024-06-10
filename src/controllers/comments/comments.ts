import { Request, Response } from "express";
import { IUserDocument } from "../../models/User";
// import _ from "lodash";
import { Comment, IComment } from "../../models/Comment";
import { ICommentRequestDelete } from "./types";

export const createComment = async (req: Request, res: Response) => {
  const { id } = req.user as IUserDocument;
  const { content, companyName, createdAt, rating } = req.body as IComment;

  if (!content || !companyName || !createdAt || !rating) {
    res.status(400).json({ message: "Fill correct fields" });
  }

  const newComment = new Comment({ author: id, content, companyName, createdAt, rating });

  try {
    await newComment.populate({ path: "author", select: "_id login" });
    await newComment.save();
    return res.status(200).json({ message: "Comment was successfuly added", newComment });
  } catch (error) {
    res.status(400).json({ message: `Error happend on server ${error}` });
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

export const rateComment = async (req: Request, res: Response) => {
  const userData = req.user as IUserDocument;
  const commentData = req.body;

  if (!userData) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  if (!commentData.postId || !commentData.rating) {
    return res.status(400).json({ message: "Fill correct fields" });
  }
}; //PATCH

//CODE NOT WORKING PROPERLY. NEED TO FIX DELETECOMMENT FUNCTION

export const deleteComment = (req: Request, res: Response) => {
  const { id } = req.user as IUserDocument;
  const { userId, postId } = req.body as ICommentRequestDelete;

  if (!postId || !userId) {
    return res.status(400).json({ message: "Fill correct fields" });
  }

  if (id !== userId) {
    return res.status(403).json({ message: "You have not enought permissions" });
  } else {
    try {
      const comment = Comment.findByIdAndDelete(postId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      return res.status(200).json({ message: "Comment was successfuly deleted" });
    } catch (error) {
      res.status(400).json({ message: `Error happens on server!` });
    }
    // Comment.findById(postId)
    //   .then((comment) => comment?.author.toString() === userData.id ?? res.status(400).json({ message: "Comment not found" }))
    //   .catch(() => res.status(400).json({ message: `Error happens on server!` }));
  }
};

export const editComment = () => {}; //PATCH
