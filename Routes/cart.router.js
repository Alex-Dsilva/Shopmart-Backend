const express = require('express');
const Cart = require('../model/cart.model');
const cartRouter = express.Router();



cartRouter.get('/cart/:userId', (req, res, next) => {
    Cart.find({ userId: req.params.userId })
      .then(userCart => res.status(200).json({ cart: userCart }))
      .catch(error => next(error));
  });

cartRouter.post('/add-to-cart/:userId', (req, res, next) => {
    const { productId, quantity } = req.body;
    User.findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return Cart.findOne({ userId: user._id });
      })
      .then(existingCart => {
        if (existingCart) {
          const updatedCart = { ...existingCart };
          const existingProduct = updatedCart.products.find(product => product.productId.toString() === productId.toString());
          if (existingProduct) {
            existingProduct.quantity = quantity;
          } else {
            updatedCart.products.push({ productId, quantity });
          }
          return Cart.findByIdAndUpdate(existingCart._id, { products: updatedCart.products }, { new: true });
        }
        const cart = new Cart({
          products: [{ productId, quantity }],
          userId: req.params.userId
        });
        return cart.save();
      })
      .then(savedCart => res.status(200).json({ message: 'Product added to cart', cart: savedCart }))
      .catch(error => next(error));
  });



cartRouter.patch('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  const updatedCart = req.body;

  Cart.findOneAndUpdate({ userId }, { $set: { items: updatedCart.items } }, { new: true })
    .then(cart => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json({ message: "Cart updated", cart });
    })
    .catch(error => next(error));
});

cartRouter.delete('/delete-cart-item/:cartId', (req, res, next) => {
    Cart.findByIdAndDelete(req.params.cartId)
      .then(deletedCart => res.status(200).json({ message: 'Cart item deleted', cart: deletedCart }))
      .catch(error => next(error));
  });


cartRouter.delete('/delete-all-cart-items/:userId', (req, res, next) => {
    Cart.deleteMany({ userId: req.params.userId })
      .then(() => res.status(200).json({ message: 'All cart items deleted' }))
      .catch(error => next(error));
  });


module.exports = {cartRouter};
