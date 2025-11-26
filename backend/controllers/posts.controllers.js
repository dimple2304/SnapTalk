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

        hashtags = extractHashtags(thought);

        let media = url ? true : false;

        const newPost = new Posts({
            user: req.user.id,
            thought: thought,
            media: {
                url: url || null,
                fileId: fileId || null
            },
            hashtags: hashtags || [],
            isMedia: media
        })



        const savedPost = await newPost.save();
        if (!savedPost) throw new InternalServerError("Something went wrong.");

        const post = await Posts.findOne({ _id: savedPost._id });
        if (!post) throw new BadRequestError("Post not found!");

        let profile = await Profile.findOne({ user: req.user.id });
        console.log("post is:", post._id);

        if (!profile) {
            profile = new Profile({
                user: req.user.id,
                uploads: post._id,
                profilepic: {
                    url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name[0].toUpperCase()}`,
                    fileId: null
                },
            })
        } else {
            profile.uploads.push(post._id);
        }

        const savedProfile = await profile.save();
        if (!savedProfile) throw new InternalServerError("Something went wrong!");

        return res.status(200).json({ success: true, message: "Post uploaded seccessfully." });

    } catch (err) {
        next(err);
    }
}


export const likes = async (req, res, next) => {
    try {
        const { postId } = req.body;
        if (!postId) throw new BadRequestError("Post not found!");

        const user = await getUserDetails(req.user.id);
        if (!user) throw new BadRequestError("User not found!");

        const post = await Posts.findOne({ _id: postId });
        if (!post) throw new BadRequestError("Post not found!");

        const userIdStr = user._id.toString();
        const existed = post.likes.some(like => like?.user?.toString() === userIdStr);

        if (!existed || post.likes === null) {
            post.likes.push({ user: user._id });
        } else {
            post.likes = post.likes.filter(like => like?.user?.toString() !== userIdStr);
        }

        let profile = await Profile.findOne({ user: req.user.id });
        const profileLikeExisted = profile?.likes?.some(like => like.toString() === post._id.toString())
        if (!profileLikeExisted) {
            if (!profile) {
                profile = new Profile({
                    likes: alreadyLiked ? [] : [post._id]
                })
            } else {
                profile.likes.push(post._id)
            }
        } else {
            profile.likes = profile?.likes?.filter(like => like.toString() !== post._id.toString());
        }

        const savedPost = await post.save();
        if (!savedPost) throw new InternalServerError("Something went wrong!");

        const savedProfile = await profile.save();
        if (!savedProfile) throw new InternalServerError("Something went wrong!");

        return res.status(200).json({
            success: true, message: "Like updated successfully.",
            likesCount: post.likes.length,
            likes: post.likes
        });

    } catch (err) {
        next(err);
    }
}



export const comments = async (req, res, next) => {
    try {
        const { commentInput, postId } = req.body;
        if (!commentInput || !postId) throw new BadRequestError("Either post or comment not found!");

        const user = await getUserDetails(req.user.id);
        if (!user) throw new BadRequestError("User not found!");

        const post = await Posts.findOne({ _id: postId })
        if (!post) throw new BadRequestError("Post not found!");

        post.comments.push({ user: user._id, comment: commentInput });

        const savedComment = await post.save();
        if (!savedComment) throw new InternalServerError("Something went wrong!");

        return res.status(200).json({
            success: true, message: "Comment posted successfully.",
            comment: commentInput, commentLength: post.comments.length
        });

    } catch (err) {
        next(err)
    }
}