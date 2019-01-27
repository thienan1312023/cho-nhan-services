const jwt = require('jsonwebtoken');
const User = require('../models/user');
var jwtDecode = require('jwt-decode');
require('dotenv').config();

module.exports = function (req, res, next) {
  var token = req.headers.authorization;
  var decodedValue = jwtDecode(token);
  if (decodedValue.userId) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        const error = new Error('Failed to authenticate');
        error.status = 401;
        next(error);
      } else {
        req.currentUserId = decodedValue.userId;
        // User.findById(decodedValue.userId).then(user => {
        //   if (!user) {
        //     const err = { status: 404, message: 'No such user' };
        //     throw err;
        //   }
        //   req.currentUser = user;

          return next();
        // })
        // .catch(err => next(err));
      }
    });
  } else {
    req.user = undefined;
    const error = new Error('Failed to authenticate');
    error.status = 401;
    next(error);

  }
  

  // if (token) {
  //   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
  //     if (err) {
  //       const error = new Error('Failed to authenticate');
  //       error.status = 401;
  //       next(error);
  //     } else {
        // const { _doc: { _id: id } } = decoded;
        // User.findById(id).then(user => {
        //   if (!user) {
        //     const err = { status: 404, message: 'No such user' };
        //     throw err;
        //   }
        //   req.currentUser = user;

          return next();
        //})
        //.catch(err => next(err));
    //   }
    // });
  // } else {
  //   const error = new Error('Failed to authenticate');
  //   error.status = 401;
  //   next(error);
  // }
};
