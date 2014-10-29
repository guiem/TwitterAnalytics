(function() {
var app = angular.module('general-directives', []);

app.directive('loading', function () {
        return {
           restrict: 'E',
           replace:true,
           template: '<span style="padding-left:5px;"><img  src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="25" height="25" /></span>',
           link: function (scope, element, attr) {
               scope.$watch('elem.loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
           },
           scope : {
               elem : "=elem"
          },
        }
    });

})();