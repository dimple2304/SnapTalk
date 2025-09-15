import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render("registration");
})

router.get('/registration', (req, res) => {
    res.render("auth/registration");
})

router.get('/login', (req, res) => {
    res.render("auth/login");
})

router.get('/homepage', (req, res) => {
    res.render("homepage");
})

export default router;