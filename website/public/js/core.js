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
      'PROYECTOS': 'Proyectos',
      'INICIO_LINK': 'Inicio',
      'DESCARGAS': 'Descargas',
      'COLABORA': 'Colabora',
      'CONTACTO': 'Contacto',
      'DESCARGA_APP':'Descarga App',
    })
    .translations('en', {
      'PROYECTOS': 'Projects',
      'INICIO_LINK': 'Home',
      'DESCARGAS': 'Downloads',
      'COLABORA': 'Take Part',
      'CONTACTO': 'Contact',
      'DESCARGA_APP':'Download App',
    })
    .preferredLanguage('es');
}])
