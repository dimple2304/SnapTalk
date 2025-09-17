import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render("home");
})

router.get('/registration', (req, res) => {
    res.render("registration");
})

router.get('/login', (req, res) => {
    res.render("login");
})


router.get('/feed', (req, res) => {
    res.render("feedpage");
})

export default router;