import { Profile } from "../models/profile.models.js";
import { Users } from "../models/user.models.js";
import { BadRequestError, NotFoundError } from "../utils/customErrorHandler/customError.js";

export const searchUser = async (req, res, next) => {
    try {
        const { searchQuery } = req.query;
        let users = await Users.find({
            $or: [
                {
                    name: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                },
                {
                    username: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                }
            ]
        }).select("name username").limit(10);
        if (!users.length) throw new BadRequestError("No user found with this name.");

        users = await Promise.all(
            users.map(async (u) => {
                const profileData = await Profile.findOne({ user: u._id });
                return {
                    ...u.toObject(),
                    profilepic: profileData?.profilepic?.url ? profileData.profilepic.url : `https://placehold.co/128x128/1d4ed8/ffffff?text=${u.name.split('')[0].toUpperCase()}`
                }
            })
        )

        return res.status(200).json({
            success: true,
            count: users.length,
            users: users || []
        });
    } catch (error) {
        next(error)
    }
}