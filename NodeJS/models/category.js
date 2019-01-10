var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    categoryId: {type: String, required: false},
    name: {type: String, required: true},
    detail: {type: Array, required: true},
    catalogId: {type: String, required: true},
    createdBy: {type: String, required: true},
    updatedBy: {type: String, required: true},
    createdAt:{type: Date, required: true},
    updatedAt: {type: Date, required: false}
});

module.exports = mongoose.model('Category', CategorySchema);

