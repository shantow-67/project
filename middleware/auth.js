const jwt = require('jsonwebtoken')
const User = require('../model/userModel')


exports.requireSignin = (req, res,next) => {
    try {
        const decode = jwt.verify(req.headers.authorization,
           "secret_key"
        )
         
     
        req.user = decode
            

        next()
    } catch (error) {
        console.log(error.message);
    }
}

exports.isAdmin = async (req, res,next) => {
  try {
    
      const user = await User.findById(req.user._id)
      
      console.log("passssss");
      
    if (user.roll !== 1) {
        res.json("unauthorize")
    }

    next()
  } catch (error) {
    console.log(error.message);
  }
}