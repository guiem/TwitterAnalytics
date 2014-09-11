var app = angular.module('TwitterAnalytics', ['visualizationController','userService','tweetService','wordService',
	,'hashtagService','projectsService','pascalprecht.translate','ngRoute'])

app.config(
  function($routeProvider,$locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeController',
      }).
      when('/projects/:projectId?', {
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
      'CONTACTO_URL':"Puedes comentarme cualquier cosa <a href='http://guiem.info/contact/'>aquí</a>.",
      'VER_PROYECTO':"Ver Proyecto",
      'EUROPEAS_PRE':"Análisis de la presencia del Movimiento de Vida Independiente en torno a las elecciones Europeas en Twitter.",
      'EUROPEAS_POST':"El mismo análisis después de las elecciones.",
      'ESPERANTO':"Uso del esperanto en el mundo siguiendo actividad en Twitter.",
      'EN_CURSO':"<i style='color:#999'>(trabajo en curso)</i>",
      'FUNC_PRINCIPAL':"Recupera - Filtra - Visualiza",
      'FUNC':"<strong>Twitter Analytics</strong> es una herramienta que permite recuperar tweets del pasado y/o el flujo de mensajes en tiempo real. ",
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
      'CONTACTO_URL':"For any comments, you can reach me <a href='http://guiem.info/contact/'>here</a>.",
      'VER_PROYECTO':"View Project",
      'EUROPEAS_PRE':"Study on the Independent Living Movement in Twitter during European Election.",
      'EUROPEAS_POST':"Same study after European Election.",
      'ESPERANTO':"Presence of Esperanto in Twitter around the globe.",
      'EN_CURSO':"<i style='color:#999'>(work in progress)</i>",
      'FUNC_PRINCIPAL':"Retrieve - Filter - Visualize",
      'FUNC':"<strong>Twitter Analytics</strong> is a tool to analyze tweets by retrieving them from the past or directly listening to the Twitter Stream. ",
    })
    .preferredLanguage('es');
}])
