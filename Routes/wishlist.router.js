const express = require('express');
const Wishlist = require('../model/wishlist.model');
const WishlistRouter = express.Router();



WishlistRouter.get('/cart/:userId', (req, res, next) => {
  Wishlist.find({ userId: req.params.userId })
      .then(userWishlist => res.status(200).json({ wishlistt: userWishlist }))
      .catch(error => next(error));
  });


WishlistRouter.delete('/delete-cart-item/:cartId', (req, res, next) => {
  Wishlist.findByIdAndDelete(req.params.cartId)
      .then(deletedWishlist => res.status(200).json({ message: ' Wishlist item deleted', cart: deletedWishlist }))
      .catch(error => next(error));
  });


WishlistRouter.delete('/delete-all-cart-items/:userId', (req, res, next) => {
  Wishlist.deleteMany({ userId: req.params.userId })
      .then(() => res.status(200).json({ message: 'All  Wishlist items deleted' }))
      .catch(error => next(error));
  });


module.exports = {WishlistRouter};
