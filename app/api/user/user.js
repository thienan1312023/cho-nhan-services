const express = require('express');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config();
const loginValidator = require('../../shared/validations/login');
const signupValidator = require('../../shared/validations/signup');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  const { isValid, errors } = signupValidator(req.body);
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
  bcrypt.hash(userNew.password, salt, function (err, hash) {
    if (err) return next(err);
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
        if (err.code === 11000) {
          res.status(409);
        } else {
          res.status(500);
        }
        next(err);
      });
  });
});



router.post('/login', async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ contactIdentity: req.body.contactIdentity });
    if (user) {
      let comparePassword = await bcrypt.compare(req.body.password, user.password);
      if (comparePassword) {
        const token = await jwt.sign(
          {
            contactIdentity: user.contactIdentity,
            userId: user._id,
            fullName: user.lastName + " " + user.firstName,
            profileImagePath: user.profileImagePath
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "30d"
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          token: token
        });
      } else {
        res.status(401).json({
          message: "Login Failed"
        });
      }
    } else {
      res.status(401).json({
        message: "Login Failed"
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "Login Failed"
    });
  }
});

module.exports = router;

