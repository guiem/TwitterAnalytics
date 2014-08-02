var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tweet = new Schema({
});

module.exports = mongoose.model('Tweet', Tweet,'tweets');
