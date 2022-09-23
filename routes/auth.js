const express = require('express');
const router = require("express").Router();
const User = require('../models/User')
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

// REGISTER 
router.post("/register", async (req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password:  CryptoJs.AES.encrypt(req.body.password , process.env.PASS_ENCRYPT).toString(),
    })
    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    }catch(err){
        res.status(500).json(err);
    }

});


// LOGIN 
router.post("/login", async (req,res) => {
    try{

        const user = await User.findOne({username:req.body.username});
        !user && res.status(401).json('username or password is invalid')
        
        // Decrypting password
        const hashedPassword = CryptoJs.AES.decrypt(
            user.password,
            process.env.PASS_ENCRYPT
        );
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        OriginalPassword !== req.body.password &&
        res.status(401).json('username or password is invalid');

        //Json web token for authentication
        const accessToken = jwt.sign(
            {
                id:user._id,
                isAdmin:user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}

        )

        // hiding the password from dbs
        const { password, ...others} = user._doc;

        res.status(200).json({...others, accessToken})

    }catch(err){
        res.status(500).json(err);
    }
})






module.exports = router;