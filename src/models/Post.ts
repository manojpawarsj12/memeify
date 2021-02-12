import { Schema, model, Document } from "mongoose";
import { CommentSchema } from "./Comments";

const PostSchema = new Schema({
  text: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema],
});
