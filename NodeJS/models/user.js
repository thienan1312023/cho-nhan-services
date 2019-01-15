var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var bcrypt = require('bcrypt');

var userSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    userEmail: {type: String, required: true, lowercase: true, unique: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: Object, required: true},
    favoritePosts: {type: Array, required: true}
});

// userSchema.methods.encryptPassword = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
// };

// userSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.password);  
// };

module.exports = mongoose.model('User', userSchema);

