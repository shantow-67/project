const User = require("../model/userModel")
const {hashPassword,comparePassword} = require("../helper/auth")
const jwt = require('jsonwebtoken')



exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // name,email require
        
        if (!name || !email) {
            res.status(401).json("Name and Email require")
        }
// password check
        if (!password || password.length < 6) {
            res.status(401).json("password must contain more then 6 charecter")
        }
// check if user exist
        const existingUser = await User.findOne({ email })
        
        if (existingUser) {
              res.status(401).json("Email is already exist")
        }



        //   hashing pass
        const hsspass = await hashPassword(password);

       
        // register user 

        const user = await new User({
            name,
            email,
            password: hsspass
        }).save();

        const token = jwt.sign({ _id: user._id }, "secret_key", {expiresIn:"2h"})
        

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                
        }, token})


    } catch (error) {
       console.log(error.message)
    }
}


// login controller

exports.loginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        
        if (!email || !password) {
              res.status(401).json("Email and password require")
        }
  // find user from model
        const user = await User.findOne({ email })
        
        if (!user) {
             res.status(401).json("User not found")
        }
// compare password
        const match = comparePassword(password, user.password);

        
console.log(match);
        if (!match) {
            res.status(401).json("Wrong password or email")
        }
// create token
        const token = jwt.sign({_id:user._id},"secret_key",{expiresIn:"2h"})

// send response
        res.status(200).json({
            user: {
                name: user.name,
                email:user.email
            },token
        })


    } catch (error) {
        console.log(error.message);
    }
}