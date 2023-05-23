const express = require('express');
const WalletRouter = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key
const { Wallet } = require('../models/wallet');

// POST /wallet/topup
WalletRouter.post('/topup', async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',

    });

    const transaction = {
      amount,
      description: 'Wallet top-up',
      type: 'deposit',
      paymentIntentId: paymentIntent.id,
    };

    const wallet = await Wallet.findOneAndUpdate(
      {},
      {
        $inc: { balance: amount },
        $push: { transactions: transaction },
      },
      { new: true }
    );

    res.json({ success: true, wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while topping up the wallet.' });
  }
});

WalletRouter.post('/purchase', async (req, res) => {
    try {
        const { amount, description, productId } = req.body;

        const wallet = await Wallet.findOne();

        if (wallet.balance < amount) {
          return res.status(400).json({ error: 'Insufficient wallet balance.' });
        }

        const transaction = {
          amount: -amount, // Negative amount to deduct from the wallet balance
          description,
          type: 'purchase',
          productId,
        };
    
        // Update the wallet balance and add the purchase transaction
        const updatedWallet = await Wallet.findOneAndUpdate(
          {},
          {
            $inc: { balance: -amount }, // Deduct the purchase amount from the wallet balance
            $push: { transactions: transaction },
          },
          { new: true }
        );
    
        res.json({ success: true, wallet: updatedWallet });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while making the purchase.' });
      }
    });
    
WalletRouter.post('/withdraw', async (req, res) => {
        try {
          const { amount } = req.body;
      
          // Fetch the wallet
          const wallet = await Wallet.findOne();
      
          // Check if the wallet balance is sufficient for the withdrawal
          if (wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient wallet balance.' });
          }
      
          // Create a new wallet transaction for the withdrawal
          const transaction = {
            amount: -amount, // Negative amount to deduct from the wallet balance
            description: 'Withdrawal to bank account',
            type: 'withdraw',
          };
      
          // Update the wallet balance and add the withdrawal transaction
          const updatedWallet = await Wallet.findOneAndUpdate(
            {},
            {
              $inc: { balance: -amount }, // Deduct the withdrawal amount from the wallet balance
              $push: { transactions: transaction },
            },
            { new: true }
          );
      
          res.json({ success: true, wallet: updatedWallet });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while processing the withdrawal.' });
        }
      });
  

module.exports = WalletRouter;
