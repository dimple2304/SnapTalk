import express from 'express';
import { verifyToken } from '../middlewares/auth.middlewares.js';
import { getUserDetails } from '../controllers/auth.controllers.js';
import { Profile } from '../models/profile.models.js';
import { Posts } from '../models/post.models.js';
import { Users } from '../models/user.models.js';

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
        const loggedInUser = await getUserDetails(req.user.id);
        const loggedInProfile = await Profile.findOne({user : req.user.id})
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
            loggedInProfile,
            user,
            profile: profile ? profile : { profilepic: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` },
            posts: enrichedPosts,
            source: "feed"
        });
    } catch (err) {
        next(err);
    }
})


router.get('/profile/:username', verifyToken, async (req, res, next) => {
    try {
        const loggedInUser = await getUserDetails(req.user.id);
        const loggedInProfile = await Profile.findOne({user : req.user.id})
        console.log(loggedInUser);
        
        console.log(loggedInProfile);
        
        
        // 🔵 [STEP 1] Get profile user
        const profileUser = await Users.findOne({ username: req.params.username })
            .select("name username");

        if (!profileUser) {
            return res.status(404).send("User not found");
        }

        // 🔵 [STEP 2] Check ownership
        const isOwnProfile = profileUser._id.toString() === req.user.id.toString();

        // 🔵 [STEP 3] Fetch profile + posts in parallel (PERFORMANCE BOOST)
        const [profile, userPosts] = await Promise.all([
            Profile.findOne({ user: profileUser._id }),
            Posts.find({ user: profileUser._id })
                .populate("user", "name username")
                .sort({ createdAt: -1 })
        ]);

        // 🔵 [STEP 4] Fetch liked posts ONLY if own profile
        let likedPosts = [];
        if (isOwnProfile && profile?.likes?.length) {
            likedPosts = await Posts.find({
                _id: { $in: profile.likes }
            })
                .populate("user", "name username")
                .sort({ createdAt: -1 });
        }

        // 🔵 [STEP 5] Collect all userIds from posts (NO duplicate queries)
        const allPosts = [...userPosts, ...likedPosts];

        const userIds = [
            ...new Set(allPosts.map(post => post.user._id.toString()))
        ];

        // 🔵 [STEP 6] Fetch all profiles in ONE query
        const profiles = await Profile.find({ user: { $in: userIds } });

        // 🔵 [STEP 7] Convert profiles to MAP (O(1) lookup instead of find)
        const profileMap = {};
        profiles.forEach(p => {
            profileMap[p.user.toString()] = p;
        });

        // 🔵 [STEP 8] Enrich posts (FAST now)
        const enrich = (posts) =>
            posts.map(post => {
                const postProfile = profileMap[post.user._id.toString()];

                post.profile = postProfile?.profilepic?.url
                    ? postProfile
                    : {
                        profilepic: {
                            url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${post.user.name[0].toUpperCase()}`
                        }
                    };

                return post;
            });

        const enrichedUserPosts = enrich(userPosts);
        const enrichedLikedPosts = enrich(likedPosts);

        // 🔵 [STEP 9] Default profile fallback
        const defaultProfile = {
            profilepic: {
                url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${profileUser.name[0].toUpperCase()}`
            },
            banner: { url: "" },
            bio: "",
            link: { url: "", label: "" },
            uploads: []
        };

        // 🔵 [STEP 10] Final render
        res.render('profile/profile', {
            loggedInProfile: loggedInProfile || defaultProfile,
            user: profileUser,
            profile: profile || defaultProfile,
            posts: enrichedUserPosts,
            likedPosts: enrichedLikedPosts,
            isOwnProfile,
            source: isOwnProfile ? "profile" : "otherProfile",
            profileUsername: profileUser.username
        });

    } catch (err) {
        next(err);
    }
});


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

        const source = req.query.from;
        const profileUsername = req.query.username;

        let backTo = "/feed";

        if (source === "profile" && profileUsername) {
            backTo = `/profile/${profileUsername}`;
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