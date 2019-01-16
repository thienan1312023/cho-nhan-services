var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    userEmail: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phone: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: Object, required: true},
    favoritePosts: {type: Array, required: true},
    access_token: {type: String, default:"", required: true}
});

userSchema.pre('save', function(next){
    const user = this;
    bcrypt.genSaltSync(10, (err, salt) =>{
        if(err)
        return next(err);
        bcrypt.hashSync(user.password, salt, (err, hash) =>{
            if(err) return next(err);
            user.password = hash;
            user.access_token = getToken(user);
            next();
        });
    });

});

userSchema.methods.comparePassword = function(candidatePassword){
    return new Promise((resolve, reject) =>{
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if(err) return reject(err);
            resolve(isMatch);
        });        
    });
}

module.exports = mongoose.model('user', userSchema);

