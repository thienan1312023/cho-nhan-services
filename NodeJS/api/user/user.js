var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

// var Order = require('../models/order');
// var Cart = require('../models/cart');
var User = require('../../models/user');

var csrfProtection = csrf();

router.post('/removeUser', function(req, res, next) {
  User.findOneAndRemove({email: req.user.email}, function(err, success) {
    if(err) {
      console.log(err.message);
      req.flash('error', 'Falha ao remover usuário!');
    }
    if(success) {
      req.flash('success', 'Usuário removido com sucesso!');
      res.redirect('/');
    }
  });
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect();
});

router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {
    crsfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.old = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});
router.get('signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin',{
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/sigin', passport.authenticate('local.sigin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});

router.use('/', notLoggedIn, function(req, res, next){
  next();
});
module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}