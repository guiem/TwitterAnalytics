angular.module('projectsService', [])

	.factory('Projects', function($http,$q) {
        return {
			getProjects : function() {
                var deferred = $q.defer();
                $http({method:"GET",url:'/api/projects/'})
                .success(function(result){
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
        }
    });