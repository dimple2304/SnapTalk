import express from "express";
import { editDetails, followSystem, logout, notificationReadProperty, uploadBanner } from "../controllers/profile.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { uploadFile } from "../utils/imagekit.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

router.patch('/edit-profile',verifyToken ,editDetails);
router.post('/upload-file', verifyToken, upload.single("file"), uploadFile);
router.patch('/upload-banner', verifyToken, uploadBanner);
router.patch('/follow-system', verifyToken, followSystem);
router.post('/logout', verifyToken, logout);
router.patch('/isread-true', verifyToken, notificationReadProperty);

export default router;
