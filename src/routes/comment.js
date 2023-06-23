import express from "express";
import passport from "passport";
import { addComment, updateComment } from "../controllers/comment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const commentRouter = express.Router();
commentRouter.use(passport.session());

commentRouter.post("", isAuthenticated, addComment);
commentRouter.put("/:commentId", isAuthenticated, updateComment);

export { commentRouter };
