angular.module('tweetService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Tweets', function($http,$q) {
		return {
			getTotalTweets : function(projectId) {
				return $http.get('/api/projects/'+projectId+'/totaltweets');
			},
            getTotalRTweets : function(projectId) {
                return $http.get('/api/projects/'+projectId+'/totalrtweets');
            },
            getTweetsPerUser : function(projectId) {
                var deferred = $q.defer();
                $http.get('/api/projects/'+projectId+'/tweetsperuser')
                .success(function(result){
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            getNumGeo: function(projectId) {
                return $http.get('/api/projects/'+projectId+'/numgeo');
            },
            getByUser: function(projectId,screen_name) {
                var deferred = $q.defer();
                $http.get('/api/projects/'+projectId+'/usertweets/' + screen_name)
                .success(function(result){
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            getMinDate: function(projectId) {
                return $http.get('/api/projects/'+projectId+'/tweetmindate/');
            },
            getMaxDate: function(projectId) {
                return $http.get('/api/projects/'+projectId+'/tweetmaxdate/');
            },
            getInGap: function(projectId,start,end) {
                var deferred = $q.defer();
                $http({method:"GET", url:'/api/projects/'+projectId+'/tweetsintimegap/' + start + '/' + end})
                .success(function(result){
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            getPerDay: function(projectId,start,end) {
                return $http.get('/api/projects/'+projectId+'/tweetsperday/' + start + '/' + end)
            },
            tweetsByTerm: function(projectId,user,terms,mode) {
                if (! user)
                    user = false;
                if (mode !== 'and')
                    mode = 'or';
                var deferred = $q.defer();
                $http({method:"GET", url:'/api/projects/'+projectId+'/tweetsbyterm/' + user + '/' + terms + '/' + mode})
                .success(function(result){
                      deferred.resolve(result);
                });
                return deferred.promise;
            },
		}
	});



