const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    enum: ['purchase', 'deposit', 'withdraw'],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [transactionSchema],
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = { Wallet };
