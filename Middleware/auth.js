const jwt = require('jsonwebtoken');
const registration = require('../Models/registrationModel');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');


app.use(cookieParser());

//verifing token 
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwtAuth;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        if(verifyUser) {
            next();
        }else{
            res.status(401).send("Unauthorized: No token provided");
        }
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;