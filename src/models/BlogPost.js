import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BlogPostSchema = new Schema({
  id: String,
  title: String,
  content: String,
  comments_id : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    }
  ],
});

export const BlogPostModel = model("blogPost", BlogPostSchema);
