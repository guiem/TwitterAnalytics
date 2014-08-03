angular.module('userService', [])

	.factory('Users', function($http) {
		return {
			getTotalUsers : function(projectId) {
				return $http.get('/api/projects/'+projectId+'/totalusers');
			},
            getUserNames : function(projectId) {
                return $http.get('/api/projects/'+projectId+'/usernames');
            }
		}
	});