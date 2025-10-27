import { Posts } from "../models/post.models.js";
import { Profile } from "../models/profile.models.js";
import { BadRequestError, InternalServerError } from "../utils/customErrorHandler/customError.js";
import { getUserDetails } from "./auth.controllers.js";

const extractHashtags = (text) => {
    const matches = text.match(/#[\w]+/g);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
};

export const createPost = async (req, res, next) => {
    try {
        let { thought, url, fileId, hashtags } = req.body;

        const user = await getUserDetails(req.user.id);
        if (!user) throw new BadRequestError("User not found!");

        const profile = await Profile.findOne({ user: req.user.id });

        let post = await Posts.findOne({ user: req.user.id });

        hashtags = extractHashtags(thought);

        const newPost = new Posts({
            user: req.user.id,
            thought: thought,
            media: {
                url: url || null,
                fileId: fileId || null
            },
            hashtags: hashtags || []
        })

        const savedPost = await newPost.save();
        if (!savedPost) throw new InternalServerError("Something went wrong.");

        return res.status(200).json({ success: true, message: "Post uploaded seccessfully." });

    } catch (err) {
        next(err);
    }
}