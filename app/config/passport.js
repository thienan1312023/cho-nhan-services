var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
  req.checkBody('email', 'Email invalid').notEmpty().isEmail();
  req.checkBody('password', 'Password invalid').notEmpty().isLength({
      min: 6
  }); 
  var errors = req.validationErrors();
  if(error){
      var message = [];
      errors.forEach(function(error){
          message.push(errir.msg);
      });
      return done(null, false, req.flash('error', massges));

  }
  User.findOne({
      'email': email
  }, function(err, user){
      if(err){
          return done(err);
      }
      if(user){
          return done(null, false, {
              message: 'this email is already beingn used'
          });
      }
      var newUser = new User();
      newUser.name = req.body.name;
      newUser.address = req.body.address;
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);
      newUser.save(function(err, result){
          if(err){
              return done(err);

          }
          return done(null, newUser);
      });
  });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Email invalid').notEmpty().isEmail();
    req.checkBody('password', 'Password invalid').notEmpty();
    var error = req.validationErrors();
    if(error){
        var message = [];
        errors.forEach(function(error){
            message.push(error.msg);
        });
        return done(null, false, req.flash('error', masssge));
    }
    User.findOne({
        'email': email
    }, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {
                message: 'User not found'     
            });
            
        }
        if(!user.validPassword(password)){
            return done(null, false, {
                message: 'Password error!'
            });
        }
        return done(null, user);
    });
}));