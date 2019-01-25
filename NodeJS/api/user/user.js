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
    


router.post('/login', async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ contactIdentity: req.body.contactIdentity });
    if(user){
      let comparePassword = await bcrypt.compare(req.body.password, user.password);
      if(comparePassword){
      const token = await jwt.sign(
        {
          contactIdentity: req.contactIdentity,
          //userId: user[0]._id
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "1h"
        }
      );
      return res.status(200).json({
        message: "Auth successful",
        token: token
      });
    }
    }
  } catch (err) {
    res.status(401).json({
      message: "Login Failed"
    });
  }
  // if(user){
  // bcrypt.compare(req.body.password, '$2a$10$NFw1CTOBGsDvD4QbZCB9R.VlEJtzBwupwHrQj7oNIWHEQlmwcWThu').then((result) => {
  //   const token = jwt.sign(
  //     {
  //       contactIdentity: req.contactIdentity,
  //       //userId: user[0]._id
  //     },
  //     process.env.JWT_SECRET_KEY,
  //     {
  //         expiresIn: "1h"
  //     }
  //   );
  //   return res.status(200).json({
  //     message: "Auth successful",
  //     token: token
  //   });
  // })
  // .catch(err =>{
  //   return res.status(401).json({
  //           message: "Auth failed"
  //         });
  // });
  //}
  // User.find({ contactIdentity: req.body.contactIdentity })
  // .exec()
  // .then(user => {
  //   if (user.length < 1) {
  //     return res.status(401).json({
  //       message: "Auth failed"
  //     });
  //   }
  //   bcrypt.compare(req.body.password, user[0].password).then((result) => {
  //     const token = jwt.sign(
  //       {
  //         email: user[0].contactIdentity,
  //         userId: user[0]._id
  //       },
  //       process.env.JWT_SECRET_KEY,
  //       {
  //           expiresIn: "1h"
  //       }
  //     );
  //     return res.status(200).json({
  //       message: "Auth successful",
  //       token: token
  //     });
  //   })
  //   .catch(err =>{
  //     return res.status(401).json({
  //             message: "Auth failed"
  //           });
  //   });
    //});
    // bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    //   if (err) {
    //     return res.status(401).json({
    //       message: "Auth failed"
    //     });
    //   }
    //   if (result) {
    //     const token = jwt.sign(
    //       {
    //         email: user[0].contactIdentity,
    //         userId: user[0]._id
    //       },
    //       process.env.JWT_SECRET_KEY,
    //       {
    //           expiresIn: "1h"
    //       }
    //     );
    //     return res.status(200).json({
    //       message: "Auth successful",
    //       token: token
    //     });
    //   }
    //   res.status(401).json({
    //     message: "Auth failed"
    //   });
    // });
  // })
  // .catch(err => {
  //   console.log(err);
  //   res.status(500).json({
  //     error: err
  //   });
   //});
});

module.exports = router;

