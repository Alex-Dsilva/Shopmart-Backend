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

reviewRouter.patch('/like-dislike/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { action } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (action === 'like') {
      if (review.dislike > 0) {
        review.dislike -= 1;
      }

      if (review.like === 0 || review.like === -1) {
        review.like += 1;
      } else {
        review.like -= 1;
      }
    } else if (action === 'dislike') {
      if (review.like > 0) {
        review.like -= 1;
      }

      if (review.dislike === 0 || review.dislike === -1) {
        review.dislike += 1;
      } else {
        review.dislike -= 1;
      }
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = { reviewRouter };
