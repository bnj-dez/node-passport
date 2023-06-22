import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BlogPostSchema = new Schema({
  id: String,
  title: String,
  content: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

export const BlogPostModel = model("blogPost", BlogPostSchema);
