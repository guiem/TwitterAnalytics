var app = angular.module('TwitterAnalytics', ['visualizationController','userService','tweetService','wordService',
	,'hashtagService','projectsService','pascalprecht.translate','ngRoute'])

app.config(
  function($routeProvider,$locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeController',
      }).
      when('/projects', {
        templateUrl: 'partials/projects.html',
        controller: 'MainController'
      }).
      otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  })

app.config(['$translateProvider', function($translateProvider) {
	$translateProvider
    .translations('es', {
      'DROPDOWN_PROYECTOS': 'Proyectos',
    })
    .translations('en', {
      'DROPDOWN_PROYECTOS': 'Projects',
    })
    .preferredLanguage('es');
}])
