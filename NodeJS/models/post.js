var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');

var PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    postType: {type: String, required: true, lowercase: true},
    userType: {type: String, required: true, lowercase: true},
    imagePathList: {type: Array, required: true},
    description: {type: String, required: true},
    title:{type: String, required:true},
    address: {type: Object, required: true},
    note: {type: String, required: true},
    categoryId: {type: String, required: false},
    catalogId: {type: String, required: true},
    postStatus: {type: String, required: true, tolowercase: true},
    createdBy: {type: String,  required: false},
    updatedBy: {type: String, required: false},
    createdAt:{type: Date, default: Date.now(),required: true},
    updatedAt: {type: Date, required: false},    
});

module.exports = mongoose.model('Post', PostSchema);

