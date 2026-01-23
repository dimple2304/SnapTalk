import express from 'express';
import { verifyToken } from '../middlewares/auth.middlewares.js';
import { getUserDetails } from '../controllers/auth.controllers.js';
import { Profile } from '../models/profile.models.js';
import { Posts } from '../models/post.models.js';

const router = express.Router();

router.get('/', (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        console.log("Token found", token);
        return res.redirect("/feed");
    }
    res.render("home");
})

router.get('/registration', (req, res) => {
    res.render("registration");
})

router.get('/login', (req, res) => {
    res.render("login");
})

router.get('/setting-username', verifyToken, async (req, res, next) => {
    if (req.user.username) {
        return res.redirect("/feed");
    }
    res.render("setusername")
})


router.get('/feed', verifyToken, async (req, res, next) => {
    try {
        const user = await getUserDetails(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });
        const posts = await Posts.find().sort({ createdAt: -1 }).populate("user", "name username").lean();

        const enrichedPosts = await Promise.all(
            posts.map(async (post) => {
                const userProfile = await Profile.findOne({ user: post.user._id });
                post.profile = userProfile.profilepic.url ? userProfile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` } }
                return post
            })
        )

        res.render("feedpage", {
            user,
            profile: profile ? profile : { profilepic: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` },
            posts: enrichedPosts,
            source: "feed"
        });
    } catch (err) {
        next(err);
    }
})


router.get('/profile', verifyToken, async (req, res, next) => {
    try {
        const user = await getUserDetails(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });
        const posts = await Posts.find({ user: req.user.id }).populate("user", "name username").sort({ createdAt: -1 });
        const enrichedPosts = posts.map((post) => {
            post.profile = profile.profilepic.url ? profile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` } }
            return post;
        })

        res.render('profile/profile', {
            user,
            profile: profile ? profile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` }, banner: { url: "" }, bio: "", link: { url: "", label: "" }, uploads: [] },
            posts: enrichedPosts,
            source: "profile",
            profileUsername: user.username
        });
    } catch (err) {
        next(err);
    }

})


router.get('/post/:id', verifyToken, async (req, res, next) => {
    try {
        const user = await getUserDetails(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });

        const post = await Posts.findById(req.params.id).populate("user", "name username").populate("comments.user", "name username");
        post.comments.sort((a, b) => b.createdAt - a.createdAt);

        const userProfile = await Profile.findOne({ user: post.user._id });
        post.profile = userProfile.profilepic.url ? userProfile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` } }

        const enrichedComments = await Promise.all(
            post.comments.map(async (ppost) => {
                const userProfile = await Profile.findOne({ user: ppost.user._id });
                ppost.profile = userProfile.profilepic.url ? userProfile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` } }
                return ppost
            })
        )

        let postUrl = req.url;
        console.log(postUrl);

        const source = req.query.from;
        const profileUsername  = req.query.username;

        let backTo = "/feed"; 

        if (source === "profile" && profileUsername) {
            backTo = `/profile`;
        }

        res.render('postPage', {
            user,
            profile: profile ? profile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` }, banner: { url: "" }, bio: "", link: { url: "", label: "" }, uploads: [] },
            post,
            enrichedComments,
            postUrl,
            backTo,
            source,
            profileUsername
        })
    } catch (err) {
        next(err);
    }
})

export default router;