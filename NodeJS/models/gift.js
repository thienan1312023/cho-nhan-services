var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GiftSchema = new Schema({
    //GiftId: {type: String, required: true},
    title: {type: String, required: true},
    imagePathList: {type: Array, required: true},
    categoryId: {type: String, required: true},
    description: {type: String, required: true},
    address: {type: Object, required: true},
    note: {type: String, required: true},
    createdBy: {type: String, required: true},
    updatedBy: {type: String, required: true},
    createdAt:{type: Date, required: true},
    updatedAt: {type: Date, required: false}
});

module.exports = mongoose.model('Gift', GiftSchema);

