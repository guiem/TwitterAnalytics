angular.module('wordService', [])

	.factory('Words', function($http,$q) {
        return {
			getNGrams : function(projectId,terms,numWords) {
                var deferred = $q.defer();
                if (!numWords)
                    numWords = 50;
                $http({method:"GET",url:'/api/projects/'+projectId+'/ngrams/'+terms+'/'+numWords})
                .success(function(result){
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
        }
    });


