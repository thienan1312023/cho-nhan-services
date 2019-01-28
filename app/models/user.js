var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcryptjs');
// const getToken = require('../utils/getTokenForUser');
var userSchema = new Schema({
    firstName: {type: String, required: true}, // Ten
    lastName: {type: String, required: true}, // Ho
    contactIdentity:{type: Object, required: true, unique: true},
    password: {type: String, required: true},
    favoritePosts: {type: Array, required: false},
    createdBy: {type: String,  required: false},
    updatedBy: {type: String, required: false},
    createdAt:{type: Date, default: Date.now(),required: true},
    updatedAt: {type: Date, required: false}
});

// userSchema.methods.comparePassword = function(candidatePassword){
//     return new Promise((resolve, reject) =>{
//         bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//             if(err) return reject(err);
//             resolve(isMatch);
//         });        
//     });
// }

module.exports = mongoose.model('user', userSchema);

