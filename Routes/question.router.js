const express = require('express');
const { Question } = require('../model/question.model');
const questionRouter = express.Router();
const stringSimilarity = require('string-similarity');

questionRouter.get("/", (req, res) => {
  res.send("welcome");
})

questionRouter.get('/:productId', async (req, res) => {
  Question.find({ productId: req.params.productId })
    .then(userQuestion => res.status(200).json({ question: userQuestion }))
    .catch(error => next(error));
});

questionRouter.post('/:productId', async (req, res) => {
  const { questionText,user } = req.body;
  const existingQuestions = await Question.find({
    productId: req.params.productId
  });
  const similarities = existingQuestions.map(existingQuestion => {
    const similarity = stringSimilarity.compareTwoStrings(questionText, existingQuestion.question);
    return similarity;
  });
  const maxSimilarity = Math.max(...similarities);
  if (maxSimilarity >= 0.7) {
    // Similar question already exists, send error message
    res.status(400).json({ error: 'Similar question already asked' });
    return;
  }
  const newQuestion = new Question({
    question: questionText,
    userId: user,
    productId: req.params.productId,
    isAnswered: false 
  });
  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json({ question: savedQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

questionRouter.put('/:questionId', (req, res) => {
  const { answer } = req.body;
  const { questionId } = req.params;
  Question.findByIdAndUpdate(
    questionId,
    { answer: answer, isAnswered: true, answeredAt:Date.now() },
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
