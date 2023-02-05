const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const UserRouter = express.Router();

UserRouter.post('/signup', (req, res, next) => {
  const { name, email, password, phoneNumber, address } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      const newUser = new User({ name, email, password, phoneNumber, address });
      return newUser.save();
    })
    .then(savedUser => {
      const token = jwt.sign({ email: savedUser.email, userId: savedUser._id }, process.env.JWT_KEY, { expiresIn: '1h' });
      res.status(200).json({ token, userId: savedUser._id, name:savedUser.name,expiresIn: 3600 });
    })
    .catch(error => next(error));
});

UserRouter.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Auth failed' });
      }
      return user.comparePassword(password, (error, isMatch) => {
        if (error || !isMatch) {
          return res.status(401).json({ message: 'Auth failed' });
        }
        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id, name: user.name, expiresIn: 3600 });
      });
    })
    .catch(error => next(error));
});

module.exports = {UserRouter};