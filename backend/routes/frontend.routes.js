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
        const post = await Posts.findOne({ user: req.user.id });
        res.render("feedpage", {
            user,
            profile: profile ? profile : { profilepic: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` },
            post
        });
    } catch (err) {
        next(err);
    }
})


router.get('/profile', verifyToken, async (req, res, next) => {
    try {
        const user = await getUserDetails(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });

        res.render('profile/profile', {
            user,
            profile: profile ? profile : { profilepic: { url: `https://placehold.co/128x128/1d4ed8/ffffff?text=${user.name.split('')[0].toUpperCase()}` }, banner: { url: "" }, bio: "", link: { url: "", label: "" }, uploads: [] },
        });
    } catch (err) {
        next(err);
    }

})

export default router;