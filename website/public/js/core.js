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
      'DESARROLLO': 'La aplicación de escritorio está de momento en <strong>fase de desarrollo</strong>. ¡Muy pronto podrás descargar la primera versión beta!',
      'APP_ESCRITORIO':"<strong>Recuperar/analizar</strong> los tweets puede ser un proceso de varios días. Debido a que esto conlleva un uso considerable de recursos de computación se ha optado por desarrollar una App que pueda ser <strong>usada en el ordenador personal</strong> de cada usuario.",
      'CODIGO':'Ver Código',
      'COLABORA_TEXTO':"¿Quieres participar? Se trata de un proyecto de <strong>código abierto</strong> y está esperando la llegada de <strong>nuevas ideas/colaboraciones</strong> ¡Cuantos más seamos, mejor! :)",
      'COLABORA_DESCARGA':"No necesariamente tienes que saber programar (puedes reportar gazapos, sugerir mejoras ...). Pero si te gusta ensuciarte las manos, ¡aquí tienes el código!",
    })
    .translations('en', {
      'PROYECTOS': 'Projects',
      'INICIO_LINK': 'Home',
      'DESCARGAS': 'Downloads',
      'COLABORA': 'Take Part',
      'CONTACTO': 'Contact',
      'DESCARGA_APP':'Download App',
      'DESARROLLO':"Desktop App is still <strong>under developement</strong>. Hopefully you'll be able to download it very soon!",
      'APP_ESCRITORIO':"<strong>Retrieving/analyzing</strong> tweets might involve several days of data processing. In order to avoid stressing too much one single server, a Desktop App has been developed so users can run their projects from any <strong>personal computer</strong>.",
      'CODIGO':'View Source',
      'COLABORA_TEXTO':"Want to help? This is an <strong>Open Source</strong> project and it's awaiting for <strong>new ideas/collaborations</strong>. The more, the merrier! :)",
      'COLABORA_DESCARGA':"No need to be a programmer (you can help by reporting errors, suggesting new functionalities, ...). But in case you want to get your hands dirty, here: the code!",
    })
    .preferredLanguage('es');
}])
