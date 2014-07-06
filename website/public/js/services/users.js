angular.module('userService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Users', function($http) {
		return {
			getTotalUsers : function() {
				return $http.get('/api/totalusers');
			},
            getUserNames : function() {
                return $http.get('/api/usernames');
            }
		}
	});