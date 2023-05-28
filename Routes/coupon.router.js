const express = require('express');
const {ProductModel} = require('../model/product.model');
const couponRouter = express.Router();

function generateCouponCode() {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let couponCode = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      couponCode += characters.charAt(randomIndex);
    }
  
    return couponCode;
  }

  
  app.get('/coupons', async (req, res) => {
    try {
        const products = await ProductModel.aggregate([{ $sample: { size: 10 } }]);

        const couponCodes = products.map(product => {
          const couponCode = generateCouponCode();
          return { product, couponCode };
        });
    
        res.status(200).json({ coupons: couponCodes });
        
    } catch (error) {
        next(error);
    }
  });

  module.exports = couponRouter;