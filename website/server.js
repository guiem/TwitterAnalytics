// set up ======================================================================
var express  = require('express');
var app      = express();                               // create our app w/ express
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8085; 				// set the port
var database = require('./config/database'); 			// load the database config
var twitterVars = require('./config/twitter_vars');
//var general_config = require('./config/index');

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
server.listen(port);
console.log("App listening on port " + port);

var util = require('util'), twitter = require('twitter');
var twit = new twitter({
    consumer_key: twitterVars.consumer_key,
    consumer_secret: twitterVars.consumer_secret,
    access_token_key: twitterVars.access_token_key,
    access_token_secret: twitterVars.access_token_secret
});

var nbOpenSockets = 0;
 
io.sockets.on('connection', function(socket) {
    console.log('Client connected !');
    if (nbOpenSockets <= 0) {
        nbOpenSockets = 0;
    }
 
    nbOpenSockets++;
 
    socket.on('disconnect', function() {
        console.log('Client disconnected !');
        nbOpenSockets--;
 
        if (nbOpenSockets <= 0) {
            nbOpenSockets = 0;
        }
    });
});

var trackList = ['hola','diversidad funcional','diversitat funcional','diversidade funcional','dibertsitate funtzionala','diversidadfuncional','diversitatfuncional' ,'diversidadefuncional','dibertsitatefuntzionala']
var hashtags = {}
var DynHashtag = require('./app/models/dynHashtag');
var projectId = 'guiem_df';
twit.stream('filter',{track:trackList}, function(stream) {
    stream.on('data', function(data) {
        if (data.entities){
            if (data.entities.hashtags) {
                console.log(data.entities.hashtags);
                for (i in data.entities.hashtags){
                    hashtag = data.entities.hashtags[i].text;
                    var query = { 'hashtag': hashtag, 'twitteranalytics_project_id':projectId }
                    DynHashtag.findOneAndUpdate(query,{$inc:{ 'count': 1 },$set:{'lastTimeUsed':new Date()}}, {upsert:true} 
                        , function(err, doc){
                            if (err) 
                                console.log(err);
                            return true;
                    });
                }
                if (nbOpenSockets > 0)
                    io.sockets.emit('dyn_hashtags_updated');
                console.log(nbOpenSockets);
            }
        }
    });
});
