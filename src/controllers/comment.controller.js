import { CommentModel } from "../models/Comment.js";

export const addComment = async (req, res) => {
    const {content, postId} = req.body;
    
    const comment = new CommentModel({content, blog_post_id: postId, user_id: req.user.id})
    await comment.save();
    return res.send({error: false, message:`Comment has been created sucessfully`});
}

export const updateComment = async (req, res) => {
    const { commentId } = req.params; 
    const {content} = req.body;
    
    const comment = await CommentModel.findById(commentId);
    // Case comment not found for specified id
    if(!comment) return res.this.status(404).send({error: 404, message: 'No comment find for id "commentId".'})

    // Case comment found but user owner are not the same than connected one in session
    if(comment.user_id.valueOf() !== req.user.id) return res.status(403).send({error: 403, message: 'You\'re not the owner of this comment.'}) 

    // We can modify only content in comment
    if(content) comment.content = content;
    await comment.save();
    return res.send({error: false, message:`Comment has been updated sucessfully`});
}
