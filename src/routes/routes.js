import express from "express";

import addUser from "../controllers/addUser.js";

const router = express.Router();

// router.post()
// router.get()
// router.delete()

router.post("/users", addUser);

export default router;
