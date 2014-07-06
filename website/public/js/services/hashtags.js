angular.module('hashtagService', [])

	// super simple service
	// each function returns a promise object 
	.factory('HashTags', function($http) {
		return {
			getNHashtags : function() {
				return $http.get('/api/nhashtags');
			},
		}
	});