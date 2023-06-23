import { UserModel } from "../models/User.js";
import { createHmac } from "node:crypto";
import argon2 from 'argon2';
import { BlogPostModel } from "../models/BlogPost.js";
import { CommentModel } from "../models/Comment.js";

export const addUser = async (req, res) => {
  try {
    const { password } = req.body;
    const { SECRET } = process.env;
    const hashSha = createHmac("sha256", SECRET).update(password).digest("hex");
    let hashArgon = await argon2.hash(password);

    const userExist = await UserModel.findOne({ email: req.body.email });
    if(userExist) return res.status(409).json({ error: 409, error: 'Email already used!' });
    const user = new UserModel({ ...req.body, password: {
      sha256: hashSha,
      argon2: hashArgon
    } });
    await user.save();
    return res.status(201).send({
      error: false,
      message: 'You have been registered successfully',
    });
  } catch (error) {
    return res.status(400).json({ error: 400, error: error.message });
  }
}

export const getUserPosts = async (req, res) => {
  const { userId } = req.params;

  const posts = await BlogPostModel.find({user_id: userId});

  return res.send({
    error: false,
    data: posts,
  });
}

export const getUserComments = async (req, res) => {
  const { userId } = req.params;

  const comments = await CommentModel.find({user_id: userId});

  return res.send({
    error: false,
    data: comments,
  });
}