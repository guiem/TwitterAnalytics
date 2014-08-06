(function() {
var app = angular.module('general-directives', []);

app.directive('loading', function () {
        return {
           restrict: 'E',
           replace:true,
           template: '<div style="float:left" class="col-md-offset-4 loading"><h2><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="20" height="20" /><text style="font-size:12px;"> loading...</text></h2></div>',
           link: function (scope, element, attr) {
               scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
           }
        }
    });

})();