import { Schema, model, Document } from "mongoose";

export interface CommentDocument extends Document {
  comment_title: string;
  comment_likes: number;
}
export const CommentSchema = new Schema(
  {
    comment_title: { type: String },
    comment_likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
