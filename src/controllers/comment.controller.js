import { BlogPostModel } from "../models/BlogPost.js";
import { CommentModel } from "../models/Comment.js";
import { UserModel } from "../models/User.js";

export const addComment = async (req, res) => {
    const {content, postId} = req.body;
    
    const comment = new CommentModel({content})
    await comment.save();

    const user = await UserModel.findById(req.user.id);

    user.comments_id.push(comment._id);
    await user.save();

    const post = await BlogPostModel.findById(postId);

    post.comments_id.push(comment._id);
    await post.save();

    return res.send({error: false, message:`Comment has been created sucessfully`});
}

export const updateComment = async (req, res) => {
    const { commentId } = req.params; 
    const {content} = req.body;
    
    const comment = await CommentModel.findById(commentId);
    // Case comment not found for specified id
    if(!comment) return res.status(404).send({error: 404, message: 'No comment find for id "commentId".'})

    const user = await UserModel.findById(req.user.id);

    const isOwner = user.comments_id.filter((element) => comment._id.valueOf() === element.valueOf());
    // Case comment found but user owner are not the same than connected one in session

    if(!isOwner.length) return res.status(403).send({error: 403, message: 'You\'re not the owner of this comment.'}) 

    // We can modify only content in comment
    if(content) comment.content = content;
    await comment.save();

    return res.send({error: false, message:`Comment has been updated sucessfully`});
}
