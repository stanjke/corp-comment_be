import { type Document } from "mongoose";

export interface ICommentResponse extends Document {
  _id: string;
  companyName: string;
  author: IAuthor;
  content: string;
  createdAt: string;
  rating: number;
  __v: number;
}

interface IAuthor {
  _id: string;
  login: string;
}
