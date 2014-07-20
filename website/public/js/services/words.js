angular.module('wordService', [])

	.factory('Words', function($http,$q) {
        return {
			getNGrams : function(terms,numWords) {
                var deferred = $q.defer();
                console.log(numWords);
                if (!numWords)
                    numWords = 50;
                $http({method:"GET",url:'/api/ngrams/'+terms+'/'+numWords})
                .success(function(result){
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
        }
    });


