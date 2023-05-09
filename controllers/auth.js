const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
 
const db = require('../db.js')

const login = async (req, res) => {
    const { email, password } = req.body;
    if( !email || !password ){
        return res.status(400).render('login', {
            message: "Missing email or password"
        });
    }
    db.query('Select * from users where email = ?', [email], async (err, result) => {
        if(!result || !(await bcrypt.compare(password, result[0].password))){
            return res.status(401).render('login', {
                message: "Invalid email or password"
            });
        }
        else{
            const id = result[0].Id;

            const token = jwt.sign({id}, process.env.SECRET_KEY, {
                expiresIn: process.env.LOGIN_EXPIRES_IN
            });

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.LOGIN_COOKIE_EXPIRE*1000
                ),
                httpOnly: true
            }

            res.cookie('jwt', token, cookieOptions);
            res.status(200).redirect('/home');
        }

    })
}

const register = (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    db.query('Select email from users where email = ?', [email], async (err, result) => {
        if(err) console.log(err);
        if(result.length > 0){
            return res.render('register', {
                message: "Email already in use"
            });
        }
        else if(password !== confirmpassword){
            return res.render('register', {
                message: "Password does not match"
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query('Insert into users SET ?', {name: name, email: email, password: hashedPassword}, (err,result2) => {
            if(err) console.log(err);
            else{
                return res.render('register',{
                    message: "User registered"
                })
            }
        });
    });
}

const isLoggedIn = async (req, res, next) => {
    if(req.cookies.jwt){
        jwt.verify(req.cookies.jwt, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
            }
            else{
                db.query('select * from users where id = ?', [decoded.id], (err, result) => {
                    if(!result) return next();
                    req.user = result[0];
                    return next();
                })
            }
        });
    }
    else{
        next();
    }

}

const logout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
    });
    res.status(200).redirect('/');
}

module.exports = {
    register,
    login,
    isLoggedIn,
    logout
};