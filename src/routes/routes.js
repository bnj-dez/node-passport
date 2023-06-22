import express from "express";
import { authRouter } from "./auth.js";

import addUser from "../controllers/addUser.js";

const router = express.Router();

// router.post()
// router.get()
// router.delete()

router.post("/users", addUser);
router.use('/login', authRouter)

export default router;
