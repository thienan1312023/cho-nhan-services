var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    categoryname: {type: String, required: true},
    parentId: {type: Number, required: true},
    createdBy: {type: String, required: true},
    updatedBy: {type: String, required: true},
    createdAt:{type: Date, required: true},
    updatedAt: {type: Date, required: false}
});
autoIncrement.initialize(mongoose.connection);
CategorySchema.plugin(autoIncrement.plugin, {
    model: 'CategorySchema',
    field: 'categoryId',
    startAt: 1,
    incrementBy: 1
  });
module.exports = mongoose.model('Category', CategorySchema);

