const express = require('express')
const router = express.Router()
const formidable = require('express-formidable')

const { requireSignin, isAdmin } = require('../middleware/auth')

const {
    create,
    list,
    read,
    photo,
    remove,
    update
} = require("../controller/productCon")

router.post("/create-product", requireSignin, isAdmin, formidable(), create)
router.get("/product-list", list)
router.get("/product/:slug", read)
router.get("/product/photo/:productId", photo)
router.delete("/del-product/:productId", requireSignin, isAdmin, remove)
router.put("/product-update/:productId",requireSignin,isAdmin,formidable(),update)


module.exports=router