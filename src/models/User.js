import mongoose from "mongoose";
import { BlogPostModel } from "./BlogPost.js";
import { CommentModel } from "./Comment.js";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  id: String,
  username: String,
  email:  String,
  phone:  String ,
  fb_token: String,
  blog_posts_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogPost"
    }
  ],
  comments_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    }
  ],
  password: {
    sha256: String,
    argon2: String
  },
});

UserSchema.pre('deleteOne', async function(next) {
  const user = await UserModel.findById(this.getQuery()['_id'])

  await BlogPostModel.deleteMany({ _id: { $in: user.blog_posts_id }});
  await CommentModel.deleteMany({ _id: { $in: user.comments_id }});
  next();
})

UserSchema.post('deleteOne', async function(doc) {
  console.log(doc);
  // await BlogPostModel.deleteMany({ _id: { $in: this.blog_posts_id }});
  // await CommentModel.deleteMany({ _id: { $in: this.comments_id }});
})

const UserModel = model("user", UserSchema);
export { UserModel };
