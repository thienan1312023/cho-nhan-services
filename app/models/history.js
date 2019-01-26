var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    createdAt:{type: Date, required: true}    
});

module.exports = mongoose.model('History', HistorySchema);

