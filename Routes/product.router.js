const express = require('express');
const jwt = require('jsonwebtoken');
const {ProductModel} = require('../model/product.model');
const ProductRouter = express.Router();


ProductRouter.get("/", async(req, res) => {
     let query = {};

     if (req.query.isOffer) {
       query.isOffer = req.query.isOffer === "true";
     }
     if (req.query.newProduct) {
       query.newProduct = req.query.newProduct === "true";
     }
     if (req.query.search) {
          query.$or = [     
               { name: { $regex: req.query.search, $options: "i" } },    
               { brand: { $regex: req.query.search, $options: "i" } },      
               { category: { $regex: req.query.search, $options: "i" } },    
          ];
        }
     if (req.query.price) {
       query.price = { $lte: Number(req.query.price) };
     }
     if (req.query.rating) {
       query.rating = { $gte: Number(req.query.rating) };
     }
     if (req.query.qnty) {
       query.qnty = { $gte: Number(req.query.qnty) };
     }
     if (req.query.brand) {
          const brands = Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand];
          query.brand = { $in: brands };
     }
   
     const sortOrder = req.query.sortOrder === "low to high" ? 1 : -1;
     const sort = {};
     sort[req.query.sortBy || "price"] = sortOrder;
   
     const limit = parseInt(req.query.limit) || 10;
     const page = parseInt(req.query.page) || 1;
     const perPage = parseInt(req.query.perPage) || 10;
     try {
       const products = await ProductModel.find(query)
         .sort(sort)
         .skip((page - 1) * perPage)
         .limit(limit)
         .exec();
       res.send(products);
     } catch (err) {
       res.status(500).send(err);
     }
});


ProductRouter.get("/singleProduct/:id", async (req, res) => {
    const { id } = req.params;
    try {
         const data = await ProductModel.findById({ _id: id });
         res.status(200).json({ data });
    } catch (err) {
         console.log(err);
         res.status(404).send({
              msg: "something wrong while getting products",
         });
    }
});



ProductRouter.post("/update", async (req, res) => {
    const data = req.body;
    try {
        await ProductModel.insertMany(data);
        console.log("Bulk Data Uploaded SUCCESSFULLY");
   } catch (error) {
        console.log(error, "FAILED TO Upload Bulk Data");
   }
});


ProductRouter.post("/create", async (req, res) => {
     const products = req.body;
     // console.log(data)
     // console.log(req)
     try {
          const createdProducts = await ProductModel.insertMany(products)
          res.status(201).json(createdProducts);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
 });

 ProductRouter.patch("/updatem", async (req, res) => {
     const data = req.body;
     try {
         await ProductModel.updateMany({}, data, {multi: true})
         .then(result => console.log(result))
         .catch(error => console.log(error));
     //     console.log("Bulk Data Uploaded SUCCESSFULLY");
         res.send("updated many")
    } catch (error) {
         console.log(error, "FAILED TO Upload Bulk Data");
    }
 });

module.exports = {ProductRouter};