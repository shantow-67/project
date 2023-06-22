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

        const product = await productModel.findByIdAndUpdate(req.params.prodyctId,
            { ...req.fields, slug: slugify(name) },
            { new: true })
        
        // console.log(product);
        
        // This line execute well
        console.log(req.files);
      
        if (photo) {
            console.log("line 136====",product);
            //   below this line code is not working
            product.photo.data = fs.readFileSync(photo.path);
            // upper this line code is not working
                console.log("okkkkkkk");
            product.photo.contentType = photo.type;
        }

        await product.save()
        res.json(product)     
     } catch (error) {
        res.json({status:"update failed",data:error.message})
     }
}

