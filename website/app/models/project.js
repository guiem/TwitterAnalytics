var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
	name : String,
	title: String,
	created_at : Date,
	written_at : Date,
});

module.exports = mongoose.model('Project', Project);