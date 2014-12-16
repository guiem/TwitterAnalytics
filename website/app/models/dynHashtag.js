var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DynHashtag = new Schema({
	hashtag : String,
	count : Number, 
	twitteranalytics_project_id : String,
	lastTimeUsed: Date,
});

module.exports = mongoose.model('DynHashtag', DynHashtag,'dyn_hashtags');