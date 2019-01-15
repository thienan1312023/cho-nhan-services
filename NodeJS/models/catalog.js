var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CatalogSchema = new Schema({
    //catalogId: {type: String, required: true, unique: true},
    catalogName: {type: String, required: true},
    imagePath:{type: String, required: true},
    linkDirect:{type: String, required: true},
    createdBy: {type: String, required: false},
    updatedBy: {type: String, required: false},
    createdAt:{type: Date, required: true},
    updatedAt: {type: Date, required: false}
});

module.exports = mongoose.model('Catalog', CatalogSchema);

