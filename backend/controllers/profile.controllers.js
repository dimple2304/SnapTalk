import { Profile } from "../models/profile.models.js";
import { getUserDetails } from "./auth.controllers.js";
import { BadRequestError, InternalServerError } from "../utils/customErrorHandler/customError.js";
import { tokenCreation } from "../utils/jwt_service.js";
import { imagekit } from "../utils/imagekit.js";
import { Posts } from "../models/post.models.js";
import { Users } from "../models/user.models.js";

export const logout = async (req, res, next) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    return res.status(200).json({
        success: true,
        message: "logged out successfully."
    })
}

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
            } catch (err) {
                next(err);
            }
        }

        if (!profile) {
            profile = new Profile({
                user: req.user.id,
                profilepic: {
                    url: url || `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name[0].toUpperCase()}`,
                    fileId: fileId,
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
                    url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name[0].toUpperCase()}`,
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


// follow/unfollow system
export const followSystem = async (req, res, next) => {
    try {
        const { postOwnerUserId } = req.body;

        const loggedInUser = await getUserDetails(req.user.id);
        if (!loggedInUser) throw new BadRequestError("User not found.");

        const postOwnerId = postOwnerUserId;

        if (!postOwnerId) throw new BadRequestError("Post not found or has no owner.");

        let loggedInUserProfile = await Profile.findOne({ user: req.user.id });
        let followingUser = await Users.findOne({ _id: postOwnerId });
        if (!followingUser) throw new BadRequestError("User to follow not found.");

        let followingUserProfile = await Profile.findOne({ user: followingUser._id.toString() });

        if (!loggedInUserProfile) {
            loggedInUserProfile = new Profile({
                user: req.user.id,
                followings: [],
                followers: []
            });
            await loggedInUserProfile.save();
        }

        if (!followingUserProfile) {
            followingUserProfile = new Profile({
                user: followingUser._id,
                followings: [],
                followers: []
            });
            await followingUserProfile.save();
        }

        let alreadyFollowing = loggedInUserProfile.followings?.some(f => f?._id.toString() === postOwnerId?.toString());

        if (!alreadyFollowing) {
            loggedInUserProfile.followings.push(postOwnerId);
            loggedInUser.followingCount = (loggedInUser.followingCount || 0) + 1;

            followingUserProfile.followers.push(loggedInUser._id);
            followingUser.followersCount = (followingUser.followersCount || 0) + 1;
        } else {
            loggedInUserProfile.followings = loggedInUserProfile.followings?.filter(uf => uf?.toString() !== postOwnerId?.toString());
            loggedInUser.followingCount = Math.max(0, (loggedInUser.followingCount || 1) - 1);

            followingUserProfile.followers = followingUserProfile.followers?.filter(rf => rf?.toString() !== loggedInUser._id?.toString());
            followingUser.followersCount = Math.max(0, (followingUser.followersCount || 1) - 1);
        }

        const savedLiup = await loggedInUserProfile.save();
        const savedFup = await followingUserProfile.save();
        const savedLu = await loggedInUser.save();
        const savedFu = await followingUser.save();
        if (!savedLiup || !savedFup || !savedLu || !savedFu) throw new InternalServerError("Something went wrong in saving.");

        return res.status(200).json({
            success: true,
            message: `${loggedInUser.username} ${alreadyFollowing ? 'unfollowed' : 'followed'} successfully.`,
            followingCount: loggedInUser.followingCount,
            followersCount: followingUser.followersCount,
            isFollowing: !alreadyFollowing
        })

    } catch (err) {
        next(err);
    }
}
