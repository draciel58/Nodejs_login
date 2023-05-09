const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.get('/', (req,res) => {
    res.render('login');
})

router.get('/register', (req,res) => {
    res.render('register');
})

router.get('/home', authController.isLoggedIn, (req, res) => {
    if(req.user) res.render('home');
    else res.redirect('/');
})  

module.exports = router;