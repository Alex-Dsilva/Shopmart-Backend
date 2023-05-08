const express = require('express');
const { Review } = require('../model/review.model');
const reviewRouter = express.Router();


reviewRouter.get("/", (req, res) => {
  res.send("welcome");
})

reviewRouter.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

reviewRouter.post('/:productId', async (req, res) => {

  const { userId, name, rating, comment } = req.body;
  const newReview = new Review({
    productId: req.params.productId , userId, name, rating, comment
  })
  try {
    const savedReview = await newReview.save();
    res.status(201).json({ review: savedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

reviewRouter.put('/like-dislike/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { action, userId } = req.body;
  console.log(action)

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const likedByUser = review.likedBy.includes(userId);
    const dislikedByUser = review.dislikedBy.includes(userId);

    if (action === 'like') {
      if (likedByUser) {
        return res.status(400).json({ message: 'User has already liked this review' });
      }

      if (dislikedByUser) {
        review.dislike -= 1;
        review.dislikedBy = review.dislikedBy.filter((id) => id != userId);
      }

      review.like += 1;
      review.likedBy.push(userId);
    }
    if (action === 'dislike') {
      if (dislikedByUser) {
        return res.status(400).json({ message: 'User has already disliked this review' });
      }

      if (likedByUser) {
        review.like -= 1;
        review.likedBy = review.likedBy.filter((id) => id != userId);
      }

      review.dislike += 1;
      review.dislikedBy.push(userId);
    } 

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = { reviewRouter };


// ProductRouter.put("/createProductReviwe/:id", async(req,res)=>{
//   const {id}=req.params
//   const {rating, comment, user_id, username}=req.body
//   const review ={
//       user:user_id,
//       name:username,
//       rating:Number(rating),
//       comment,
//   }
  
//   try{
//       const product =await ProductModel.findById({ _id: id })

//       const isReviewed=product.reviews.find(el=>el.user.toString()===user_id.toString())
//       if(isReviewed){
//          product.reviews.forEach(el => {
//           if(el.user.toString()===user_id.toString()){
//               (el.rating=rating),
//               (el.comment=comment)
//           }
//          });
//       }else{
//           product.reviews.push(review)
//           product.ratingCount=product.reviews.length
//       }

//       let avg=0;
//       product.reviews.forEach(rev=>{
//           avg+=rev.rating
//       })
//       product.rating=avg/product.reviews.length

//       await product.save({validateBeforeSave:false})
//       res.send(`Thank you for your Valuble Feedback`)
//   }
//   catch(err){
//       console.log(err);

//       res.send("something wrong while adding your reviwe")
//   }

// })

// ProductRouter.get("/productReviews/:id", async (req, res) => {
//    const { id } = req.params;
   
//    try {
//         const product = await ProductModel.findById({ _id: id });

//         if(!product){
//            res.status(404).send({"msg":"Product not found"})
//         }
//         res.send({reviews:product.reviews})
//    } catch (err) {
//         console.log(err);
//         res.status(500).send({
//              msg: "something wrong while getting product reviews",
//         });
//    }
// });

