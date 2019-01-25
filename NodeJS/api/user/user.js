const express = require('express');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config();
const loginValidator = require('../../shared/validations/login');
const signupValidator = require('../../shared/validations/signup');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const {isValid, errors } = signupValidator(req.body);
  if (!isValid) {
    return res.status(400).json({ error: true, errors });
  }
    var userNew = new User({
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      password: req.body.password,
      contactIdentity: req.body.contactIdentity,
      favoritePosts: req.body.favoritePosts
    });
    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(userNew.password, salt, function(err, hash) {
          if(err) return next(err);
          userNew.password = hash;
          userNew
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
      });
});
    


router.post('/login', (req, res, next) => {
  User.find({ contactIdentity: req.body.contactIdentity })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].contactIdentity,
            userId: user[0]._id
          },
          process.env.JWT_PRIVATE_KEY,
          {
              expiresIn: "1h"
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          token: token
        });
      }
      res.status(401).json({
        message: "Auth failed"
      });
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;

