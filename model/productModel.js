const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema


const productSchema = mongoose.Schema({

    name: {
        type: String,
        trim:true,
        require: true,
        maxlength: 160,
    },
    slug: {
        type:String,
        lowercase:true
    },
    description: {
        type: String,
        require: true,
        maxlength:2000
    },
    price: {
        type: Number,
        require: true,
        trim:true
    },
    category: {
        type: ObjectId,
        ref: 'categories',
        require:true
    },
    quantity: {
        type:Number
    },
    sold: {
        type: Number,
        default: 0,
    },
    photo: {
        data: Buffer,
        contentType:String
    },
    shipping: {
        required: false,
        type: Boolean,
    }

}, { timestamps: true, versionkey: false })

const productModel = mongoose.model("Products", productSchema)
module.exports = productModel;