import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { comments, createPost, likes } from "../controllers/posts.controllers.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.post("/like-post", verifyToken, likes)
router.post("/comment-post", verifyToken, comments)

export default router;