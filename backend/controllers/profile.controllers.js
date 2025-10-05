import { Profile } from "../models/profile.models.js";
import { getUserDetails } from "./auth.controllers.js";
import { BadRequestError, InternalServerError } from "../utils/customErrorHandler/customError.js";
import { tokenCreation } from "../utils/jwt_service.js";
import { getFileId, imagekit } from "../utils/imagekit.js";

export const editDetails = async (req, res, next) => {
    try {
        console.log("running");

        const { profilepic, name, username, bio, linkLabel, link } = req.body;
        if (!name || !username) throw new BadRequestError("Name and username are required!");

        const user = await getUserDetails(req.user.id);
        if (!user) throw new BadRequestError("User not found.");

        const profile = await Profile.findOne({ user: req.user.id })

        const existingUrl = profile.profilepic;
        if (!profile) {
            const newProfile = new Profile({
                user: req.user.id,
                profilepic: profilepic || `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}`,
                bio,
                link: { url: link, label: linkLabel }
            })
            await newProfile.save();
        } else {
            profile.profilepic = profilepic || profile.profilepic;
            profile.bio = bio;
            profile.link = { url: link, label: linkLabel }

            await profile.save();
        }

        user.name = name || user.name;
        user.username = username || user.username;

        const updated = await user.save();
        if (!updated) throw new InternalServerError("Something went wrong!");

        if(existingUrl && existingUrl.includes("imagekit")){
            const fileId = getFileId(existingUrl);
            const deleted = await imagekit.deleteFile(fileId);
            console.log(deleted);
            
        }

        const token = tokenCreation({ id: user.id, email: user.email, username: username });
        res.cookie("token", token);

        return res.status(200).json({ success: true, message: "Details edited successfully." });


    } catch (err) {
        next(err);
    }
}


// banner uploading
export const uploadBanner = async (req, res, next) => {
    try {
        const { banner } = req.body;

        const user = await getUserDetails(req.user.id);
        if (!user) throw new BadRequestError("User not found.");

        const profile = await Profile.findOne({ user: req.user.id });

        let existingUrl = profile.banner;

        if (!profile) {
            const newProfile = new Profile({
                user: req.user.id,
                profilepic: profile.profilepic || `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}`,
                banner: banner
            })
            await newProfile.save();
        } else {
            profile.banner = banner;
            await profile.save();
        }

        if(existingUrl){
            const fileId = getFileId(existingUrl);
            await imagekit.deleteFile(fileId);
        }

        res.status(200).json({ success: true, message: "Banner updated successfully." });
    } catch (err) {
        next(err);
    }
}
