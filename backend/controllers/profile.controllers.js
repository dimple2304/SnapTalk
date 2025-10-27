import { Profile } from "../models/profile.models.js";
import { getUserDetails } from "./auth.controllers.js";
import { BadRequestError, InternalServerError } from "../utils/customErrorHandler/customError.js";
import { tokenCreation } from "../utils/jwt_service.js";
import { imagekit } from "../utils/imagekit.js";

export const editDetails = async (req, res, next) => {
    try {
        const { url, fileId, name, username, bio, linkLabel, link } = req.body;
        if (!name || !username) throw new BadRequestError("Name and username are required!");

        const user = await getUserDetails(req.user.id);
        if (!user) throw new BadRequestError("User not found.");

        let profile = await Profile.findOne({ user: req.user.id });
        const existingFileId = profile?.profilepic?.fileId;

        if (existingFileId && fileId && existingFileId !== fileId) {
            try {
                await imagekit.deleteFile(existingFileId);
                console.log(`Deleted old image: ${existingFileId}`);
            } catch (err) {
                console.warn("Failed to delete old image from ImageKit:", err.message);
            }
        }

        if (!profile) {
            profile = new Profile({
                user: req.user.id,
                profilepic: {
                    url: url || `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name[0].toUpperCase()}`,
                    fileId: fileId || null,
                },
                bio,
                link: { url: link, label: linkLabel },
            });
        } else {
            if (url) profile.profilepic.url = url;
            if (fileId) profile.profilepic.fileId = fileId;
            profile.bio = bio;
            profile.link = { url: link, label: linkLabel };
        }

        await profile.save();

        user.name = name;
        user.username = username;
        await user.save();

        const token = tokenCreation({ id: user.id, email: user.email, username });
        res.cookie("token", token);

        return res.status(200).json({ success: true, message: "Details edited successfully." });
    } catch (err) {
        next(err);
    }
};



// banner uploading
export const uploadBanner = async (req, res, next) => {
    try {
        const { url, fileId } = req.body;

        const user = await getUserDetails(req.user.id);
        if (!user) throw new BadRequestError("User not found.");

        let profile = await Profile.findOne({ user: req.user.id });

        const existingFileId = profile?.banner?.fileId;
        if (existingFileId && fileId && existingFileId !== fileId) {
            try {
                await imagekit.deleteFile(existingFileId);
            } catch (err) {
                throw new InternalServerError("Error in deleting previous image.");
            }
        }

        if (!profile) {
            profile = new Profile({
                user: req.user.id,
                banner: {
                    url: url || ``,
                    fileId: fileId || null
                },
                profilepic: {
                    url:  `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name[0].toUpperCase()}`,
                    fileId: null
                },
            });
        } else {
            profile.banner = { url: url || profile.banner?.url || "", fileId: fileId || profile.banner?.fileId || null };
        }
        await profile.save();

        res.status(200).json({ success: true, message: "Banner updated successfully.", profile });
    } catch (err) {
        next(err);
    }
}
