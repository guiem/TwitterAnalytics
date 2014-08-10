var TwitterUser = require('./models/twitterUser');
var Tweet = require('./models/tweet');
var Word = require('./models/word');
var HashTag = require('./models/hashtag');
var Project = require('./models/project');

module.exports = function(app) {

    /* EXECUTED IN ALL API REQUESTS */
    app.all('/api/*', function(req, res, next){
            console.log('awaiting for future auth implementation here.'); // TODO
            next();
        }
    );
    /* END EXECUTED IN ALL API REQUESTS */

    /* PROJECTS */

    // list all projects
    app.get('/api/projects', function(req, res) {
        Project
        .find()
        .select('title name config')
        .exec(function(err, projects) {
            if (err) {
                res.send(err);
            } 
            res.json(projects); 
        });
    });

    /* END PROJECTS */

    /* TWEETS */
    
    // get number of tweets
    app.get('/api/projects/:projectId/totaltweets', function(req, res) {
        Tweet.find({'twitteranalytics_project_id':req.params.projectId}).count(function(err, count) {
            if (err)
                res.send(err)                    
            res.json(count); 
        });
    });

    // get number of rtweets
    app.get('/api/projects/:projectId/totalrtweets', function(req, res) {
        Tweet.find({'twitteranalytics_project_id':req.params.projectId,'retweeted': true}).count(function(err, count) {
            if (err)
                res.send(err)                     
            res.json(count);
        });
    });

    // get num tweets per user
    app.get('/api/projects/:projectId/tweetsperuser', function(req, res) {
        Tweet
        .aggregate([
            {$match : {'twitteranalytics_project_id':req.params.projectId}},
            {$group:{_id:"$user.screen_name",count:{$sum:1}}},
            {$sort:{count:-1}}], function(err,result) {
            if (err)
                res.send(err)                   
            res.json(result);
        });
    });

    // get num tweets geolocalized
    app.get('/api/projects/:projectId/numgeo', function(req, res) {            
        Tweet.find({'twitteranalytics_project_id':req.params.projectId,'coordinates':{$ne:null}}).count(function(err,count) {                            
            if (err)
                res.send(err)
            res.json(count); 
        });
    });

    // get tweets by screen_name
    app.get('/api/projects/:projectId/usertweets/:screen_name', function(req, res) {
        Tweet.find({'twitteranalytics_project_id':req.params.projectId,
            "user.screen_name" : req.params.screen_name}, function(err, tweets) {
            if (err)
                res.send(err);
            res.json(tweets);
        });
    });

    // get date of first collected tweet
    app.get('/api/projects/:projectId/tweetmindate', function(req, res) {
        Tweet
        .find({'twitteranalytics_project_id':req.params.projectId},{created_at:1,created_at_dt:1})
        .limit(1)
        .sort('created_at_dt')
        .exec(function(err,date) {
            if (err)
                res.send(err)
            res.json(date);
        });
    });
    
    // get date of last collected tweet
    app.get('/api/projects/:projectId/tweetmaxdate', function(req, res) {
        Tweet
        .find({'twitteranalytics_project_id':req.params.projectId},{created_at:1,created_at_dt:1})
        .limit(1)
        .sort('-created_at_dt')
        .exec(function(err,date) {
            if (err)
                res.send(err)
            res.json(date);
        });
    });

    // get tweets between dates
    app.get('/api/projects/:projectId/tweetsintimegap/:start_date/:end_date', function(req, res) {
        var dateStartAux = req.params.start_date.split("-");
        var dateStart = new Date(dateStartAux[0],(parseInt(dateStartAux[1])-1).toString(),dateStartAux[2],'00','00','00');
        var dateEndAux = req.params.end_date.split("-");
        var dateEnd = new Date(dateEndAux[0],(parseInt(dateEndAux[1])-1).toString(),dateEndAux[2],'23','59','59');
        Tweet.find({'twitteranalytics_project_id':req.params.projectId,
            "created_at_dt" :{$gte : dateStart, $lte : dateEnd } })
        .select('user.screen_name text created_at_dt')
        .sort('-created_at_dt')
        .exec(function(err, tweets) {
            if (err)
                res.send(err);
            res.json(tweets);
        });
    });

    // get num tweets per day between dates
    app.get('/api/projects/:projectId/tweetsperday/:start_date/:end_date', function(req, res) {
        var dateStartAux = req.params.start_date.split("-");
        var dateStart = new Date(Date.UTC(dateStartAux[0],(parseInt(dateStartAux[1])-1).toString(),dateStartAux[2],'00','00','00'));
        var dateEndAux = req.params.end_date.split("-");
        var dateEnd = new Date(Date.UTC(dateEndAux[0],(parseInt(dateEndAux[1])-1).toString(),dateEndAux[2],'23','59','59'));
        Tweet//.find({"created_at_dt" :{$gte : dateStart, $lte : dateEnd } })
        .aggregate(
            { $match : {'twitteranalytics_project_id':req.params.projectId,"created_at_dt" :{$gt : dateStart, $lte : dateEnd } } },
            { $group : {
                _id : { year: { $year : "$created_at_dt" }, month: { $month : "$created_at_dt" },day: { $dayOfMonth : "$created_at_dt" }},
                count : { $sum : 1 }}
            },function(err, tweets) {
            if (err)
                res.send(err);
            res.json(tweets);
        });
    });

    // get tweets that contain certain terms
    app.get('/api/projects/:projectId/tweetsbyterm/:user/:terms/:mode', function(req, res) {
        var i = 0;
        var terms_aux = req.params.terms.split(',');
        var terms = [];
        var query = {};
        while (i < terms_aux.length) {
            if (req.params.mode !== 'and')
                terms.push(eval('/'+terms_aux[i]+'/i'));
            else
                terms.push({text: { $in: [eval('/'+terms_aux[i]+'/i')]}});
            i += 1;
        }
        if (req.params.mode !== 'and')
            query = {text: { $in: terms}};
        else {
            query = {$and: terms}
        }
        if (req.params.user !== 'false')// TODO: make this prettier and use false value, not string
            query['user.screen_name'] = req.params.user;
        query['twitteranalytics_project_id'] = req.params.projectId;
        Tweet.find(query)
        .select('user.screen_name text created_at_dt')
        .sort('-created_at_dt')
        .exec(function(err,tweets){
            if (err)
                res.send(err);
            res.json(tweets);
        });
    });

    /* END TWEETS */

    /* HASHTAGS */
	

    // get num words for HashTagCloud
    app.get('/api/projects/:projectId/nhashtags/:numHashTags', function(req, res) {
        var blackList = ["#diversidadfuncional"];
        HashTag
        .find({'twitteranalytics_project_id':req.params.projectId,hashtag:{$nin:blackList}})
        .limit(req.params.numHashTags)
        .sort('-count')
        .exec(function(err,hashtag){
            if (err)
                res.send(err);
            res.json(hashtag);
        });
    });

    /* END HASHTAGS */

    /* WORDS */

    // Basic characters filter based on this url: http://www.skorks.com/2010/05/what-every-developer-should-know-about-urls/
    var reservedCharacters = [";", "/", "?", ":", "@", "&", "=", "+", "$", ","];
    var unreservedCharacters = ["-", "_", ".", "!", "~", "*", "'", "(", ")"];
    var unwiseCharacters = ["{", "}", "|", "\"", "^", "[", "]", "`"];
    var asciiCharacters = ["<", ">", "#", "%", '"'];
    var personalCharacters = ["…",'“',"`","\"","``","''","..."];

    // get num words for WordCloud
    app.get('/api/projects/:projectId/ngrams/:terms/:numWords', function(req, res) {
        var blackList = req.params.terms//.split(',');
        var blackList = eval(req.params.terms).concat(reservedCharacters).concat(unwiseCharacters)
        .concat(unreservedCharacters).concat(asciiCharacters).concat(personalCharacters);
        Word
        .find({'twitteranalytics_project_id':req.params.projectId,word:{$nin:blackList}})
        .limit(req.params.numWords)
        .sort('-count')
        .exec(function(err,word){
            if (err)
                res.send(err);
            res.json(word);
        });
    });

    /* END WORDS */

    /* USERS */

	// get all users
	app.get('/api/users', function(req, res) {
		TwitterUser.find(function(err, users) {
			if (err)
				res.send(err)
			res.json(users); 
		});
	});

    // get number of users
    app.get('/api/projects/:projectId/totalusers', function(req, res) {
        TwitterUser.find({'twitteranalytics_project_id':req.params.projectId}).count(function(err, count) {
            if (err)
                res.send(err)

            res.json(count);
        });
    });
    
    // get all usernames
    app.get('/api/projects/:projectId/usernames', function(req, res) {
        TwitterUser
        .find({'twitteranalytics_project_id':req.params.projectId})
        .select('screen_name')
        .exec(function(err, user) {
            if (err)
                res.send(err)
            res.json(user); 
        });
    });
    
    /* END USERS */
    
	// application -------------------------------------------------------------

    // projects page route (http://localhost:8080/projects)
    app.get('/projects', function(req, res) {
        res.sendfile('./public/projects.html'); 
    });

    app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};