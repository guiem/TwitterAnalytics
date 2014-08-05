var app = angular.module('TwitterAnalytics', ['visualizationController','userService','tweetService','wordService',
	,'hashtagService','projectsService','pascalprecht.translate'])

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
