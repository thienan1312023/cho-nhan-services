const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    postType: {type: String, required: true, lowercase: true},
    userType: {type: String, required: true, lowercase: true},
    imagePathList: {type: Array, required: true},
    description: {type: String, required: true},
    title:{type: String, required:true},
    phoneNumber: {type: String, required: true},
    address: {type: Object, required: true},
    note: {type: String, required: true},
    categoryId: {type: Number, required: true},
    catalogId: {type: Number, required: true, ref:'catalog', required: true},
    postStatus: {type: String, required: true, tolowercase: true},
    highLevelArr: {type: Array, required: false},
    createdBy: {type: String,  required: true},
    updatedBy: {type: String, required: false},
    createdAt:{type: Date, default: Date.now(),required: true},
    updatedAt: {type: Date, required: false},    
});
PostSchema.plugin(mongoosePaginate);
PostSchema.index({title: "text"});
module.exports = mongoose.model('Post', PostSchema);

