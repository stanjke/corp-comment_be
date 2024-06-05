import mongoose, { type ObjectId } from "mongoose";
const Schema = mongoose.Schema;

export interface IComment extends Document {
  companyName: string;
  content: string;
  createdAt: Date;
  author: ObjectId;
  rating: number;
}

const commentSchema = new Schema<IComment>({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
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
});
export const Comment = mongoose.model<IComment>("Comment", commentSchema);
