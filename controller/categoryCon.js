const categoryModel = require("../model/categoryModel")
const slugify = require("slugify")

exports.create = async (req, res) => {
    try {
        const { name } = req.body

        if (!name.trim()) {
            return res.json({ error: "name is required" })
        }

        const existCategory = await categoryModel.findOne({ name })

        if (existCategory) {
            return res.json({ error: "Category Alredy exist" });
        }

        const category = await new categoryModel({
            name,
            slug:slugify(name)
        }).save()
        res.json(category)

    } catch (error) {
        return res.json({status:"failed",data:error.message})
    }
}

exports.update = async (req, res) => {
    try {
        const { name } = req.body
        const { categoryId } = req.params
        
        const updated = await categoryModel.findByIdAndUpdate(
             {_id:categoryId},
            {
                name,
                slug: slugify(name)
            },
            { new: true }
        );
        res.json(updated)


    } catch (error) {
        res.json({status:"update failed",data:error.message})
    }
}

exports.remove = async (req, res) => {

    try {
          await categoryModel.findByIdAndDelete(req.params.categoryId)
        res.json({ status: "Delete Successful" })
        
    } catch (error) {
         res.json({status:"delete failed",data:error.message})
    }
}

exports.list = async (req, res) => {
    try {
        const categoryList = await categoryModel.find()
        res.status(200).json({status:"List found",lists:categoryList})
    } catch (error) {
         res.json({status:"List not found",data:error.message})
    }
}

exports.read = async (req, res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.json({status: "category found", data: category})
    } catch (error) {
        res.json({status:"category not found",data:error.message})
    }
}