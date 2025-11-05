import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { createPost, likes } from "../controllers/posts.controllers.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.post("/like-post", verifyToken, likes)

export default router;