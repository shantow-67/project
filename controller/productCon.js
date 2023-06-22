const fs = require("fs");
const productModel = require("../model/productModel");
const slugify = require("slugify");


exports.create = async (req, res) => {
    try {      
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        
        switch (true) {
            case !name?.trim():
                return res.json({ error: "Name is required" });
            case !description?.trim():
                return res.json({ error: "Description is required" });
            case !price?.trim():
                return res.json({ error: "Price is required" });
            case !category?.trim():
                return res.json({ error: "Category is required" });
            case !quantity?.trim():
                return res.json({ error: "Quantity is required" });
            case !shipping?.trim():
                return res.json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:
                return res.json({ error: "Image should be less than 1mb in size" }); 
        }

        const product = new productModel({ ...req.fields, slug: slugify(name) })
        
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);          
            product.photo.contentType = photo.type;
        }
        await product.save()
         
   

        res.json(product)     
     } catch (error) {
        res.json({status:"failed",data:error.message})
     }
}
 

exports.list = async (req, res) => {
    try {
        const product = await productModel.find({})
            .populate('category')
            .select('-photo')
            .limit(2)
            .sort({ createdAt: -1 });
        
        res.json(product)

    } catch (error) {
        res.json({ status: "list not found", data: error.message })
    }
};

exports.read = async (req, res) => {
    try {
        const product = await productModel.find({ slug: req.params.slug })
            .populate('category')
            .select('-photo')
        
        res.json(product)

    } catch (error) {
          res.json({ status: "product not found", data: error.message })    
    }
}

exports.photo = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.productId)
            .select('photo')
        
        if (product.photo.data) {
            res.set("Content-Type",product.photo.contentType)
            res.set("Cross-Origin-Resource-Policy", "cross-origin")
            res.send(product.photo.data)
        }
   
    } catch (error) {
        res.json({ status: "photo not found", data: error.message })  
    }
}

exports.remove = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.productId)
            .select('-photo');
        if (!product) {
            res.json({status:"Delete failed",data:product})
        } else {
             res.json({status:"Delete Succesfull",data:product})
       }

    } catch (error) {
         res.json({ status: "Delete failed", data: error.message })    
    }
}

exports.update = async (req, res) => {
    try {      
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        
        switch (true) {
            case !name?.trim():
                return res.json({ error: "Name is required" });
            case !description?.trim():
                return res.json({ error: "Description is required" });
            case !price?.trim():
                return res.json({ error: "Price is required" });
            case !category?.trim():
                return res.json({ error: "Category is required" });
            case !quantity?.trim():
                return res.json({ error: "Quantity is required" });
            case !shipping?.trim():
                return res.json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:
                return res.json({ error: "Image should be less than 1mb in size" }); 
        }
        const product = await productModel.findByIdAndUpdate(req.params.productId,
            { ...req.fields, slug: slugify(name) },
            { new: true })
        
        console.log(product);
        
      
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save()
        res.json(product)     
     } catch (error) {
        res.json({status:"update failed",data:error.message})
     }
}

exports.filteredProduct = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args ={}
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
// const products = await Product.find({cagegory:"catagory id",price:{$gte:0,$lte:20000}});
        const product = await productModel.find(args)
        res.json(product)
    } catch (error) {
           res.json({ status: "filter procces failed", data: error.message })   
    }
}

exports.productCount = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()

        res.json(total)

    } catch (error) {
        res.json({ status: "product count failed", data: error.message })   
    }
}

exports.listProduct = async (req, res) => {
    try {

        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;

        const product = await productModel.find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        
        res.json(product)
    } catch (error) {
         res.json({ status: "List not found", data: error.message })  
    }
}

exports.productSearch = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or :[
                { name: { $regex: keyword ,$options:"i"}},
                { description: { $regex: keyword ,$options:"i"}}
            ]
        }).select("-photo")

        res.json(result)
    } catch (error) {
         res.json({ status: "Product not found", data: error.message }) 
    }
}

exports.relatedProduct = async (req, res) => {
    try {
        const { productId, categoryId } = req.params

         
        console.log(req.params);

        const related = await productModel.find({
            category: categoryId,
            _id: { $ne: productId }
        }).populate("category")
            .select("-photo")
            .limit(2);
       
        
        
        res.json(related)

    } catch (error) {
         res.json({ status: "Related Product not found", data: error.message }) 
    }
    
}