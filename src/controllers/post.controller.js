import { BlogPostModel } from "../models/BlogPost.js";
import { CommentModel } from "../models/Comment.js";
import { UserModel } from "../models/User.js";

export const addPost = async (req, res) => {
    const {title, content} = req.body;
    const post = new BlogPostModel({title, content})
    await post.save();

    const user = await UserModel.findById(req.user.id)

    user.blog_posts_id.push(post._id);
    await user.save();

    return res.send({error: false, message:`"${title}" has been created sucessfully`});
}

export const getPosts = async (req, res) => {
    const posts = await BlogPostModel.find();
    return res.send({error: false, data: posts});
}

export const getPostComments = async (req, res) => {
    const { postId } = req.params;
    const post = await BlogPostModel.findById(postId);

    const comments = await CommentModel.find({ _id: { $in: post.comments_id }});
    return res.send({error: false, data: comments});
}