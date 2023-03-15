const express = require('express');
const { Question } = require('../model/question.model');
const questionRouter = express.Router();

questionRouter.get('/products/:productId/questions', async (req, res) => {
  Question.find({ productId: req.params.productId })
    .then(userQuestion => res.status(200).json({ question: userQuestion }))
    .catch(error => next(error));
});


module.exports = { questionRouter };
