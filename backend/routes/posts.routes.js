import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { createPost } from "../controllers/posts.controllers.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);

export default router;