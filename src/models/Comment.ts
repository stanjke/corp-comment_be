import mongoose, { type ObjectId } from "mongoose";
const Schema = mongoose.Schema;

export interface IComment extends Document {
  companyName: string;
  content: string;
  createdAt: Date;
  author: ObjectId;
  rating: number;
  ratedBy: ObjectId[];
}

const commentSchema = new Schema<IComment>({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    required: true,
  },
  ratedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
export const Comment = mongoose.model<IComment>("Comment", commentSchema);
