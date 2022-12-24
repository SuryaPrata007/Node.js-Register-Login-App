const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registration = require('../Models/registrationModel');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');





//user registration
var registerUser = async (req, res) => {
   
    try {
        const password = req.body.Password;
        
        const cpassword = req.body.confirmPassword;

        if (password === cpassword) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const hashConfirmPassword = await bcrypt.hash(cpassword, salt);

            const registerUser = new registration({
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                Email: req.body.Email,
                Password: hashPassword,
                confirmPassword: hashConfirmPassword,
                role: req.body.role,
                department: req.body.department
            })

            if(registerUser.role == "Admin" || registerUser.role == "admin"){
                res.send("you are not allowed to register as Admin");
            }
            if(!(registerUser.firstName && registerUser.middleName && registerUser.lastName && registerUser.Email && registerUser.Password && registerUser.confirmPassword && registerUser.role && registerUser.department)){
                res.status(400).send("Please fill all the fields");
            }
            
            const existUser = await registration.findOne({Email: registerUser.Email});
             if(existUser) {
                res.status(400).send("User already exists");
                
            }
            
            const token = jwt.sign(
                {id: registerUser.Email},
                 process.env.SECRET_KEY,
            {
                expiresIn : "10h"
            }
        );
        
        registerUser.token = token;
    
        const registered = await registerUser.save();
        console.log(registered);
            res.status(201).send(registered);
        
        }else{
            res.status(400).send("Password are not matching");
        }

    }catch (error) {
        res.status(400);
        res.send(error);
    }
    };


//user login
var loginUser = async (req, res) => {
    console.log("he");
    try{
        const email = req.body.Email;
        console.log(email);
        const password = req.body.Password;

        const user = await registration.findOne({Email: email});

        var match = await bcrypt.compare(password, user.Password);
        if(match){
            const token = jwt.sign(
                {id: user.Email},
                process.env.SECRET_KEY,
                {
                    expiresIn : "10h"
                }
            );
            res.cookie("jwtAuth", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            });
            res.status(201).send(user);
           
    } else{
        res.status(400).send("Invalid login details");
    }
    }catch(error) {
        res.status(400).send(`Invalid login details - ${error}`);
    }
}


//view all users
var viewUsers = async (req, res) => {

    try{
        const users = await registration.find({role:"User", role:"user"});
        res.status(201).send(users);
    }catch(error) {
        res.status(400).send(`Invalid login details - ${error}`);
    }
}

//update user
var updateUser = async (req, res) => {
    try{
        const _id = req.params.id;
        const updateUsers = await registration.findByIdAndUpdate(_id, req.body.firstName, req.body.middleName, req.body.lastName, req.body.Email, req.body.role, req.body.department, {
            new: true
        });
        res.status(201).send(updateUsers);
    }catch(error) {
        res.status(400).send(`Invalid login details - ${error}`);
    }
}
        


module.exports = {registerUser, loginUser, viewUsers, updateUser
};