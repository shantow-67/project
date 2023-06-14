const User = require("../model/userModel")
const hashPassword = require("../helper/auth")
const jwt = require('jsonwebtoken')



exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // name,email require
        if (!name || !email) {
            res.status(401).json("Name and Email require")
        }

        if (!password || password.length < 6) {
            res.status(401).json("password must contain more then 6 charecter")
        }
        // check if user exist
        const existingUser = await User.findOne({ email })
        
        if (existingUser) {
              res.status(401).json("Email is already exist")
        }


        console.log("line 26---ok");
        //   hashing pass
        const hsspass = await hashPassword(password);

        console.log("line 30---okk");
        // register user 

        const user = await new User({
            name,
            email,
            password: hsspass
        }).save();

        const token = jwt.sign({ _id: user._id }, "secret_key", expiresIn("2h"))
        

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                
        }, token})


    } catch (error) {
       console.log(error)
    }
}