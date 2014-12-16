angular.module('dynHashtagsService', [])

	.factory('DynHashtags', function($http,$q) {
		return {
			getNDynashtags : function(projectId,numHashTags) {
				var deferred = $q.defer();
                if (!numHashTags)
                    numHashTags = 50;
				$http({method:"GET",url:'/api/projects/'+projectId+'/dynnhashtags/'+numHashTags})
                .success(function(result){
                	console.log(result);
                    deferred.resolve(result);
                });
                return deferred.promise;
			},
		}
	});