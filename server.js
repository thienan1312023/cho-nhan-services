const express = require('express');
const mongoose = require('mongoose');
expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT || 3004;
const cors = require('cors');
const validatorOptions = {

};
//const { mongoose } = require('./db.js');
mongoose.connect('mongodb://chonhancontributor:chonhan11111@ds251210.mlab.com:51210/chonhandb', { useNewUrlParser: true }, function(error){
  if(!error){
    console.log("Connect Server mLab chonhanDB Successfully");
  }else{
    console.log("Has error when connect");
  }
}); 
var app = express();
var MongoStore = require('connect-mongo')(session);
app.use(expressValidator(validatorOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.listen(PORT, () => console.log('Server started at port in env'));
app.use('/api', require('./app/api/api'));
app.use(cors({ origin: '*' }));
app.use(session({
    secret: 'mysupersecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  }));


