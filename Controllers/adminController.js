const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registration = require('../Models/registrationModel');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');





//Admin registration
var registerAdmin = async (req, res) => {
   
    try {
        const password = req.body.Password;
        
        const cpassword = req.body.confirmPassword;

        if (password === cpassword) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const hashConfirmPassword = await bcrypt.hash(cpassword, salt);

            const registerAdmin = new registration({
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                Email: req.body.Email,
                Password: hashPassword,
                confirmPassword: hashConfirmPassword,
                role: req.body.role,
                department: req.body.department
            })

            
            if(!(registerAdmin.firstName && registerAdmin.middleName && registerAdmin.lastName && registerAdmin.Email && registerAdmin.Password && registerAdmin.confirmPassword && registerAdmin.role && registerAdmin.department)){
                res.status(400).send("Please fill all the fields");
            }
            
            const existAdmin = await registration.findOne({Email: registerAdmin.Email});
             if(existAdmin) {
                res.status(400).send("Admin already exists");
                
            }
            
            const token = jwt.sign(
                {id: registerAdmin.Email},
                 process.env.SECRET_KEY,
            {
                expiresIn : "10h"
            }
        );
        
        registerAdmin.token = token;
    
        const registered = await registerAdmin.save();
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


//Admin login
var loginAdmin = async (req, res) => {
    console.log("he");
    try{
        const email = req.body.Email;
        console.log(email);
        const password = req.body.Password;

        const Admin = await registration.findOne({Email: email});

        var match = await bcrypt.compare(password, Admin.Password);
        if(match){
            const token = jwt.sign(
                {id: Admin.Email},
                process.env.SECRET_KEY,
                {
                    expiresIn : "10h"
                }
            );
            res.cookie("jwtAuth", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            });
            res.status(201).send(Admin);
           
    } else{
        res.status(400).send("Invalid login details");
    }
    }catch(error) {
        res.status(400).send(`Invalid login details - ${error}`);
    }
}


//view all Admins and users
var viewAllUsers = async (req, res) => {

    try{
        const Admins = await registration.find();
        console.log(Admins);
        res.status(201).send(Admins);
    }catch(error) {
        res.status(400).send(`Invalid login details - ${error}`);
    }
}

//update Admin
var updateUsers = async (req, res) => {
    try{
        const _id = req.params.id;
        const updateAdmins = await registration.findByIdAndUpdate(_id, req.body.firstName, req.body.middleName, req.body.lastName, req.body.Email, req.body.role, req.body.department, {
            new: true
        });
        res.status(201).send(updateAdmins);
    }catch(error) {
        res.status(400).send(`Invalid login details - ${error}`);
    }
}
        


module.exports = {registerAdmin, loginAdmin, viewAllUsers, updateUsers};