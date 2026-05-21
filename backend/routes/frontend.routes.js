import express from 'express';
import { verifyToken } from '../middlewares/auth.middlewares.js';
import { getUserDetails } from '../controllers/auth.controllers.js';
import { Profile } from '../models/profile.models.js';
import { Posts } from '../models/post.models.js';
import { Users } from '../models/user.models.js';
import { BadRequestError } from '../utils/customErrorHandler/customError.js';

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
        const loggedInProfile = await Profile.findOne({ user: req.user.id })
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

        let isOwnPost;
        posts.map(async (p) => {
            p.isOwnPost = p.user._id.toString() === req.user.id.toString();
            p.isFollowing = profile?.followings?.includes(p.user._id);
        })

        const followingUserPosts = posts.filter(pst => pst.isFollowing);

        res.render("feedpage", {
            loggedInProfile,
            loggedInUser,
            user,
            profile: profile ? profile : { profilepic: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` },
            posts: enrichedPosts,
            followingUserPosts,
            source: "feed"
        });
    } catch (err) {
        next(err);
    }
})


router.get('/profile/:username', verifyToken, async (req, res, next) => {
    try {
        const loggedInUser = await getUserDetails(req.user.id);
        const loggedInProfile = await Profile.findOne({ user: req.user.id })

        const profileUser = await Users.findOne({ username: req.params.username })
            .select("name username followingCount followersCount");

        if (!profileUser) {
            throw new BadRequestError("User not found.");
        }

        const isOwnProfile = profileUser._id.toString() === req.user.id.toString();
        // const posts = await Posts.find().sort({ createdAt: -1 }).populate("user", "name username").lean();
        const [profile, userPosts] = await Promise.all([
            Profile.findOne({ user: profileUser._id }),
            Posts.find({ user: profileUser._id })
                .populate("user", "name username")
                .sort({ createdAt: -1 })
        ]);

        let likedPosts = [];
        if (isOwnProfile && profile?.likes?.length) {
            likedPosts = await Posts.find({
                _id: { $in: profile.likes }
            })
                .populate("user", "name username")
                .sort({ createdAt: -1 });
        }

        if (isOwnProfile) {
            likedPosts.map(async (lp) => {
                lp.isOwnPost = lp.user._id.toString() === req.user.id.toString();
                lp.isFollowing = loggedInProfile.followings.includes(lp.user._id)
            })
        }

        if (!isOwnProfile) {
            userPosts.map(async (p) => {
                p.isFollowing = loggedInProfile.followings.includes(p.user._id);
            })
            profile.isFollowing = loggedInProfile.followings.includes(profile.user._id);
        }

        const allPosts = [...userPosts, ...likedPosts];

        let isOwnPost;
        allPosts.map(async (p) => {
            p.isOwnPost = p.user._id.toString() === req.user.id.toString();
        })

        const userIds = [
            ...new Set(allPosts.map(post => post.user._id.toString()))
        ];

        const profiles = await Profile.find({ user: { $in: userIds } });

        const profileMap = {};
        profiles.forEach(p => {
            profileMap[p.user.toString()] = p;
        });

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

        const defaultProfile = {
            profilepic: {
                url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${profileUser.name[0].toUpperCase()}`
            },
            banner: { url: "" },
            bio: "",
            link: { url: "", label: "" },
            uploads: []
        };

        res.render('profile/profile', {
            loggedInProfile: loggedInProfile || defaultProfile,
            loggedInUser,
            isOwnPost,
            user: profileUser,
            profile: profile || defaultProfile,
            posts: enrichedUserPosts,
            likedPosts: enrichedLikedPosts,
            isOwnProfile,
            source: isOwnProfile ? "profile" : "otherProfile",
            profileUsername: profileUser.username,
            from: req.query.from || "feed",
            connectionOwner: req.query.connectionOwner || null
        });

    } catch (err) {
        next(err);
    }
});


router.get('/profile/:username/follows', verifyToken, async (req, res, next) => {
    try {
        const loggedInUser = await getUserDetails(req.user.id);
        const loggedInProfile = await Profile.findOne({ user: req.user.id })

        const profileUser = await Users.findOne({ username: req.params.username })
            .select("name username followingCount followersCount");
        if (!profileUser) {
            throw new BadRequestError("Profile user not found.");
        }

        const isOwnProfile = profileUser._id.toString() === req.user.id.toString();

        const profile = await Profile.findOne({ user: profileUser._id })
        if (!profile) throw new BadRequestError("Profile not found.");

        let followingList = [];
        if (profile?.followings?.length) {
            followingList = await Users.find({ _id: { $in: profile.followings } });
        }

        const followingUserProfiles = await Profile.find({
            user: { $in: profile.followings }
        });
        // console.log(followingUserProfiles);


        followingList = followingList.map(user => {
            const profileData = followingUserProfiles.find(
                p => p.user.toString() === user._id.toString()
            );

            return {
                ...user.toObject(),
                profilepic: profileData?.profilepic?.url || null,
                isFollowing: loggedInProfile.followings.some(
                    id => id.toString() === user._id.toString()
                )
            };
        });

        let followerList = [];
        if (profile?.followers?.length) {
            followerList = await Users.find({ _id: { $in: profile.followers } })
        }
        // console.log(followerList);
        const followerUserProfile = await Profile.find({
            user: { $in: profile.followers }
        })
        // console.log(followerUserProfile);
        followerList = followerList.map(user => {
            const profileData = followerUserProfile.find(
                p => p.user.toString() === user._id.toString()
            );

            return {
                ...user.toObject(),
                profilepic: profileData?.profilepic?.url || null,
            };
        });
        console.log(followerList)

        if (!isOwnProfile) {
            followingList = followingList.map(fl => ({
                ...fl,
                isItMe: fl._id.toString() === loggedInUser._id.toString()
            }));

            followerList = followerList.map(fl => ({
                ...fl,
                isItMe: fl._id.toString() === loggedInUser._id.toString()
            }));
        }
        res.render('connections.ejs', {
            loggedInUser,
            loggedInProfile,
            profileUser,
            followingUserProfiles,
            followerList,
            followerUserProfile,
            profile: profile ? profile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${profileUser.name[0].toUpperCase()}` } },
            isOwnProfile: isOwnProfile,
            followingList: followingList,
        });

    } catch (error) {
        next(error)
    }
})


router.get('/post/:id', verifyToken, async (req, res, next) => {
    try {
        const user = await getUserDetails(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });

        const loggedInUser = await getUserDetails(req.user.id);
        const loggedInProfile = await Profile.findOne({ user: req.user.id })

        const post = await Posts.findById(req.params.id).populate("user", "name username").populate("comments.user", "name username");
        post.comments.sort((a, b) => b.createdAt - a.createdAt);

        let isOwnPost;
        post.isOwnPost = post.user._id.toString() === req.user.id.toString();

        const userProfile = await Profile.findOne({ user: post.user._id });
        post.profile = userProfile.profilepic.url ? userProfile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` } }

        if (!isOwnPost) {
            post.isFollowing = loggedInProfile?.followings?.includes(userProfile.user._id);
        }

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
            loggedInUser,
            loggedInProfile,
            isOwnPost,
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