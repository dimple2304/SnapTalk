import express from "express";
import { editDetails, uploadBanner } from "../controllers/profile.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { uploadFile } from "../utils/imagekit.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

router.patch('/edit-profile',verifyToken ,editDetails);
router.post('/upload-file', verifyToken, upload.single("file"), uploadFile);
router.patch('/upload-banner', verifyToken, uploadBanner);

export default router;
