angular.module('wordService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Words', function($http,$q) {
        return {
			getNGrams : function(terms) {
            var deferred = $q.defer();
             $http({method:"GET",url:'/api/ngrams/'+terms})
             .success(function(result){
                deferred.resolve(result);
             });
             return deferred.promise;
             },
            }
        });


