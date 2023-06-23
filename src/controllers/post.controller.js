import { BlogPostModel } from "../models/BlogPost.js";
import { CommentModel } from "../models/Comment.js";

export const addPost = async (req, res) => {
    const {title, content} = req.body;
    const post = new BlogPostModel({title, content, user_id: req.user.id})
    await post.save();
    return res.send({error: false, message:`"${title}" has been created sucessfully`});
}

export const getPosts = async (req, res) => {
    const posts = await BlogPostModel.find();
    return res.send({error: false, data: posts});
}

export const getPostComments = async (req, res) => {
    const { postId } = req.params;
    const comments = await CommentModel.find({ blog_post_id: postId });
    return res.send({error: false, data: comments});
}