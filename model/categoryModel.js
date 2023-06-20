const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        maxLength: 32,
        require:true
    },
    slug: {
        type: String,
        unique: true,
        lowercase:true
    }
}, { timestamps: true, versionKey: false })

const categoryModel = mongoose.model("categories", categorySchema)
module.exports=categoryModel