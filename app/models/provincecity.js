var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProvincecitySchema = new Schema({
    ProvinceCityId: {type: String, required: true, unique: true},
    ProvinceCityName: {type: String, required: true},
    CountryId:{type: Number, required: true}
});

ProvincecitySchema.index({ProvinceCityName: "text"});

module.exports = mongoose.model('Provincecity', ProvincecitySchema);

