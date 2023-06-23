import express from "express";
import passport from "passport";
import { addPost, getPostComments, getPosts } from "../controllers/post.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const postRouter = express.Router();
postRouter.use(passport.session());

postRouter.post("", isAuthenticated, addPost);
postRouter.get("", getPosts);
postRouter.get("/:postId/comments", getPostComments);

export { postRouter };
