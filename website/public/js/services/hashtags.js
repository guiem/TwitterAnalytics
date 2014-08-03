angular.module('hashtagService', [])

	.factory('HashTags', function($http,$q) {
		return {
			getNHashtags : function(projectId,numHashTags) {
				var deferred = $q.defer();
                if (!numHashTags)
                    numHashTags = 50;
				$http({method:"GET",url:'/api/projects/'+projectId+'/nhashtags/'+numHashTags})
                .success(function(result){
                    deferred.resolve(result);
                });
                return deferred.promise;
			},
		}
	});