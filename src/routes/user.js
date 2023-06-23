import express from "express";
import passport from "passport";
import { getUserComments, getUserPosts } from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.use(passport.session());

userRouter.get("/:userId/posts", getUserPosts);
userRouter.get("/:userId/comments", getUserComments);

export { userRouter };
