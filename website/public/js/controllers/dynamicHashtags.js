angular.module('dynamicHashtags', ['btford.socket-io'])
    
    .factory('socket', function(socketFactory) {
        return socketFactory({
            ioSocket: io.connect('http://twitteranalytics.ml:8085')
        });
    })


	.controller('DynamicHashtagsCtrl', function($scope, $http, $routeParams, DynHashtags, socket) {

        $scope.lastRestart = '';
        $scope.start = '';

        socket.on('dyn_hashtags_updated', function (data) {
            $scope.lastRestart = data.lastRestart;
            $scope.start = data.start;
            updateDynHashtags();
        });

        function updateDynHashtags(){ 
            DynHashtags.getNDynashtags("guiem_df",50)
            .then(function(data) {
                $scope.nDynHashtags = data;
                changeMaxDynHashTagsChart();
            });    
        }

        function changeMaxDynHashTagsChart(){
            var wordsData = [];
            var maxCount = 0;
            angular.forEach($scope.nDynHashtags, function(res) {
                maxCount = Math.max(maxCount,res.count); // we know, because it comes in desc order that we'll keep the first value
                wordsData.push([res.hashtag, res.count*100/maxCount,res.count]);
            });
            WordCloud(document.getElementById('word-cloud-chart-dynhashtags'), { list: wordsData, shuffle: false, wait: 10} );
        }
        
    });
