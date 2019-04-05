var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  categoryName: { type: String, required: true },
  parentId: { type: Number, required: true },
  createdBy: { type: String, required: false },
  updatedBy: { type: String, required: false },
  createdAt: { type: Date, default: Date.now(), required: true },
  updatedAt: { type: Date, required: false },
  highLevelArr: { type: Array, required: false }
});
autoIncrement.initialize(mongoose.connection);
CategorySchema.plugin(autoIncrement.plugin, {
  model: 'CategorySchema',
  field: 'categoryId',
  startAt: 1,
  incrementBy: 1
});
module.exports = mongoose.model('Category', CategorySchema);

