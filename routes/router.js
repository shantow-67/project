const express = require("express");
const router = express.Router();

const {registerUser,loginUser} = require("../controller/authController")
const {requireSignin, isAdmin }=require("../middleware/auth")

router.post("/register", registerUser)
router.post("/login", loginUser)

router.get("/auth-check", requireSignin, (req, res) => {
    res.json({yooo:"Authentication done"})
})

router.get("/isAdmin", requireSignin, isAdmin, (req, res) => {
    res.json("yess  Admin")
})


module.exports = router;