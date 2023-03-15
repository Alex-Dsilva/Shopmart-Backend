const express = require('express');
const { Question } = require('../model/question.model');
const questionRouter = express.Router();

questionRouter.get('/products/:productId/questions', async (req, res) => {
  Question.find({ productId: req.params.productId })
    .then(userQuestion => res.status(200).json({ question: userQuestion }))
    .catch(error => next(error));
});

questionRouter.post('/products/:productId/questions', (req, res) => {
  const { questionText } = req.body;
  const newQuestion = new Question({
    questionText,
    productId: req.params.productId,
    answeredByAdmin: false, // Set to false by default
  });
  newQuestion
    .save()
    .then((savedQuestion) => {
      res.status(201).json({ question: savedQuestion });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

questionRouter.put('/questions/:questionId', (req, res) => {
  const { answer } = req.body;
  const { questionId } = req.params;
  Question.findByIdAndUpdate(
    questionId,
    { answer: answer, isAnswered: true },
    { new: true },
    (err, updatedQuestion) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ question: updatedQuestion });
      }
    }
  );
});

module.exports = { questionRouter };
