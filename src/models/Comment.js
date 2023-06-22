import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  id: String,
  content: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  blogPost_id: { type: mongoose.Schema.Types.ObjectId, ref: "blogPost" },
});

export const CommentModel = model("comment", CommentSchema);
