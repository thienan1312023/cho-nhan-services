const express = require('express');
const mongoose = require('mongoose');
expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const validatorOptions = {

};
const cors = require('cors');
//const { mongoose } = require('./db.js');
mongoose.connect('mongodb://localhost:27017/GiftShareDB', (err) => {
    if (!err)
        console.log('MongoDB connection succeeded.');
    else
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
});
var app = express();
var MongoStore = require('connect-mongo')(session);
app.use(expressValidator(validatorOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: 'http://localhost:4200' }));

app.listen(3001, () => console.log('Server started at port : 3001'));
app.use('/api', require('./api/api'));
app.use(session({
    secret: 'mysupersecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  }));


