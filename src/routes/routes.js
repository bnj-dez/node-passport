import express from "express";
import { authRouter } from "./auth.js";
import { addUser, deleteUser } from "../controllers/user.controller.js";
import { postRouter } from "./post.js";
import { userRouter } from "./user.js";
import { commentRouter } from "./comment.js";

const router = express.Router();

router.post("/register", addUser);
router.delete("/delete-account", deleteUser);
router.use('/login', authRouter);
router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);

export default router;
