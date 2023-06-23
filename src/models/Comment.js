import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  id: String,
  content: String
});

export const CommentModel = model("comment", CommentSchema);
