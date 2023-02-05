const express = require('express');
const jwt = require('jsonwebtoken');
const {ProductModel} = require('../model/product.model');
const ProductRouter = express.Router();

ProductRouter.get("/", async (req, res) => {
    try {
      
         let {
              productname,
              productBrand,
              productCategory,
              sortBy, 
              sortOrder,
              limit = 10,
              page,
         } = req.query;
         if (productBrand !== undefined) {
              productBrand = productBrand.toString();
         }
         console.log("productBrand", productBrand);
         let queries = {};

         if (
              productname === undefined &&
              productBrand === undefined &&
              productCategory === undefined
         ) {
              queries = {};
         } else if (productname === undefined) {
              queries.productBrand = { $regex: productBrand, $options: "i" };
         } else if (productBrand === undefined) {
              queries.productname = { $regex: productname, $options: "i" };
         } else if (productname === undefined && productBrand === undefined) {
              queries.productBrand = { $regex: productBrand, $options: "i" };
         } else if (productBrand === undefined) {
              queries.productname = { $regex: productname, $options: "i" };
         } else {
              queries.productBrand = { $regex: productBrand, $options: "i" };
              queries.productname = { $regex: productname, $options: "i" };
         }

         let sorting = {};
         if (sortBy != undefined) {
              if(sortOrder==="asc"){
                   sorting[sortBy] =1  
              }else{
                   sorting[sortBy] = -1;
              }
              
         }else{
              sorting["rating"] =-1 
         }


         let products = await ProductModel.find(queries).sort(sorting)
              .skip((page||1 - 1) * limit)
              .limit(limit);
         const totalCount = products?.length;
         res.status(200).json({ data: products, totalCount });
    } catch (err) {
         console.log(err);
         res.status(404).send({
              msg: "something wrong while getting products",
         });
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

ProductRouter.put("/createProductReviwe/:id", async(req,res)=>{
    const {id}=req.params
    const {rating, comment, productId, user_id, username}=req.body
    const review ={
        user:user_id,
        name:username,
        rating:Number(rating),
        comment,
    }
    
    try{
        const product =await ProductModel.findById(productId)

        const isReviewed=product.reviews.find(el=>el.user.toString()===user_id.toString())
        if(isReviewed){
           product.reviews.forEach(el => {
            if(el.user.toString()===user_id.toString()){
                (el.rating=rating),
                (el.comment=comment)
            }
           });
        }else{
            product.reviews.push(review)
            product.ratingCount=product.reviews.length
        }

        let avg=0;
        product.reviews.forEach(rev=>{
            avg+=rev.rating
        })
        product.rating=avg/product.reviews.length

        await product.save({validateBeforeSave:false})
        res.send(`Thank you for your Valuble Feedback`)
    }
    catch(err){
        console.log(err);

        res.send("something wrong while adding your reviwe")
    }

})


ProductRouter.get("productReviews/:id", async (req, res) => {
    const { id } = req.params;
    try {
         const product = await ProductModel.findById({ _id: id });

         if(!product){
            res.send({"msg":"Error while getting the reviews"})
         }
         res.send({reviews:product.reviews})
    } catch (err) {
         console.log(err);
         res.send({
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
         await ProductModel.updateMany({}, {$unset: {id: ""}})
         .then(result => console.log(result))
         .catch(error => console.log(error));
     //     console.log("Bulk Data Uploaded SUCCESSFULLY");
         res.send("updated many")
    } catch (error) {
         console.log(error, "FAILED TO Upload Bulk Data");
    }
 });

module.exports = {ProductRouter};