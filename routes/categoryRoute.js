const express = require("express");
const router = express.Router();

const {requireSignin, isAdmin }=require("../middleware/auth")
const { create,
    update,
    remove,
    list,
    read
} = require("../controller/categoryCon");

// create

router.post("/create-category", requireSignin, isAdmin, create)
router.put("/update-category/:categoryId", requireSignin, isAdmin, update)
router.delete("/delete-category/:categoryId", requireSignin, isAdmin, remove)
router.get("/category-list",list)
router.get("/category-list/:slug",read)




module.exports=router