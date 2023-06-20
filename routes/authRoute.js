const express = require("express");
const router = express.Router();

const {requireSignin, isAdmin }=require("../middleware/auth")
const {registerUser,loginUser, secret,updateProfile} = require("../controller/authController")


router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/auth-check", requireSignin, (req, res) => {
    res.json({yooo:"Authentication done"})
})
// admin check
router.get("/isAdmin", requireSignin, isAdmin, (req, res) => {
    res.status(200).json({message : "Admin authentication done"})
})
// testing
router.get("/secret", requireSignin, isAdmin, secret)
router.put("/update-profile",requireSignin,updateProfile)


module.exports = router;