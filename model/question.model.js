const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: '',
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = {Question};