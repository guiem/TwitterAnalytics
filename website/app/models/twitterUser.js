var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TwitterUser = new Schema({
	screen_name : String,
	created_at : Date,
	processed : String, // should be Mixed type?
	since_id : Number,
});

module.exports = mongoose.model('TwitterUser', TwitterUser,'users_df');