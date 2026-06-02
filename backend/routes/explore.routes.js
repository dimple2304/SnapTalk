import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { searchUser } from "../controllers/explore.controllers.js";

const router = express.Router();

router.get('/search-user', verifyToken, searchUser);

export default router;