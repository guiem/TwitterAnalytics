angular.module('expdemController', ['ui.bootstrap'])

    .directive('loading', function () {
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
    })

	.controller('mainController', function($scope, $filter, $http,$sce, Users, Tweets, Words, HashTags) {
                
        Tweets.getMinDate()
        .success(function(data) {
            $scope.dtStart = new Date(data[0].created_at_dt);
        });
            
        Tweets.getMaxDate()
        .success(function(data) {
            $scope.dtEnd = new Date(data[0].created_at_dt);
        });
                
        $scope.datepickers = {
            dtStart: $scope.dtStart,
            dtEnd: $scope.dtEnd,
        }
                
        $scope.clear = function () {
            $scope.dtStart = null;
            $scope.dtEnd= null;
        };
                
        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return false;
            //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };
                
        $scope.toggleMin = function() {
            $scope.minDate = null // $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
                
        $scope.open = function($event, which) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepickers[which]= true;
        };
                
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false,
        };
                
        $scope.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
                
        Tweets.getTweetsPerUser()
            .success(function(data){
                $scope.tweetsperuser = data;
            });
        
        $scope.blackList = [":","@","http","el","la","de","en","y","los","''","a","``",".","sobre","por","con","para","rt","las","!","no","que","una","un","l","|","san","s","tel","es","se","al","su","-","scoopit","del","d","amb","i","te","lo","e","24","per","https",")","(","o","diversidad","funcional","diversidadfuncional","funcional."];
        Words.getNGrams($scope.blackList)
        .then(function(data) {
            $scope.ngrams = data;
        });
                
                
                $scope.getNGramsUpdate = function() {
                Words.getNGrams($scope.blackList)
                .then(function(data) {
                      $scope.ngrams = data;
                      });
                };
                
        HashTags.getNHashtags()
        .success(function(data){
            $scope.nhashtags = data;
        });
                
        Users.getTotalUsers()
            .success(function(data) {
                $scope.totalusers = data;
        });
                
        Users.getUserNames()
            .success(function(data) {
                $scope.usernames = data;
        });
        
        function changeMaxTwittersChart(numPeople){
            tweetsPerUserData = [];
            var count = 0;
            angular.forEach($scope.tweetsperuser, function(res) {
                count += 1;
                if (count > numPeople){
                    return;
                }
                tweetsPerUserData.push({label:res._id,value:res.count});
                });
            change(tweetsPerUserData);
        }
                
        $scope.changeMaxTwitters = function() {
            if (!$scope.maxTweeters)
                changeMaxTwittersChart(10);
            else
                changeMaxTwittersChart($scope.maxTweeters);
        };
                
        function changeMaxWordsChart(numWords){
            var wordsData = [];
            var usersBlackList = [];
            angular.forEach($scope.usernames, function(res) {
                usersBlackList.push(res.screen_name);
            });
            var count = 0;
            var maxCount = 0;
            angular.forEach($scope.ngrams, function(res) {
                count += 1;
                if (count > numWords){
                    return;
                }
                maxCount = Math.max(maxCount,res.count);
                var isUser = usersBlackList.indexOf(res.word);
                if(isUser == -1)
                    wordsData.push([res.word, res.count*100/maxCount]);
            });
            WordCloud(document.getElementById('word-cloud-chart'), { list: wordsData } );
        }
                
                $scope.changeMaxWords = function() {
                if (!$scope.maxWords)
                changeMaxWordsChart(50);
                else
                changeMaxWordsChart($scope.maxWords);
                };
                
        $scope.changeMaxHashTags = function() {
            if (!$scope.maxHashTags)
                changeMaxHashTagsChart(50);
            else
                changeMaxHashTagsChart($scope.maxHashTags);
        };
                
        function changeMaxHashTagsChart(numWords){
                var wordsData = [];
                var usersBlackList = [];
                angular.forEach($scope.usernames, function(res) {
                                usersBlackList.push(res.screen_name);
                                });
                var count = 0;
                var maxCount = 0;
                angular.forEach($scope.nhashtags, function(res) {
                                count += 1;
                                if (count > numWords){
                                return;
                                }
                                maxCount = Math.max(maxCount,res.count);
                                var isUser = usersBlackList.indexOf(res.word);
                                if(isUser == -1)
                                wordsData.push([res.hashtag, res.count*100/maxCount]);
                                });
                WordCloud(document.getElementById('word-cloud-chart-hashtags'), { list: wordsData } );
                }

                
		$scope.formData = {};
		$scope.loading = true;
        

        Tweets.getTotalTweets()
        .success(function(data) {
                 $scope.totaltweets = data;
                 $scope.loading = false;
                 });
        
        Tweets.getTotalRTweets()
        .success(function(data) {
            $scope.totalrtweets = data;
            $scope.loading = false;
        });
        
        Tweets.getNumGeo()
        .success(function(data) {
            $scope.numgeo = data;
            $scope.loading = false;
        });
        
        $scope.getTweetsByUser = function() {
            Tweets.getByUser($scope.currentuser)
            .then(function(data) {
                $scope.currenttweets = data;
                $scope.ctTotalItems = $scope.currenttweets.length;
                $scope.ctCurrentPage = 1;
                $scope.ctItemsPerPage = 6;
                $scope.ctMaxSize = 5;
                updateCurrentTweetsPaging();
            });
        };
                
        $scope.searchTerms = function(mode) {
            $scope.loading = true;
            Tweets.tweetsByTerm($scope.userTerms,$scope.terms,mode)
            .then(function(data) {
                  $scope.tweetsterms = data;
                  $scope.ttTotalItems = $scope.tweetsterms.length;
                  $scope.ttCurrentPage = 1;
                  $scope.ttItemsPerPage = 6;
                  $scope.ttMaxSize = 5;
                  updateTweetsTermsPaging();
                  $scope.loading = false;
            });
        };
        
        $scope.searchTermsAnd = function() {
            $scope.searchTerms('and');
        }
                
        $scope.getTweetsInGap = function() {
            if(!$scope.checkTweetsGap){
                return;
            }
            Tweets.getInGap($filter('date')($scope.dtStart,'yyyy-MM-dd'),$filter('date')($scope.dtEnd,'yyyy-MM-dd'))
            .then(function(data) {
                $scope.tweetsingap = data;
                $scope.tfTotalItems = $scope.tweetsingap.length;
                $scope.tfCurrentPage = 1;
                $scope.tfItemsPerPage = 6;
                $scope.tfMaxSize = 5;
                updateTweetsInGapPaging();
            });
        };
        
        $scope.terms = [];
        
        $scope.addTerm = function() {
            $scope.terms.push($scope.termText);
            $scope.termText = '';
        };
                
        $scope.clearTerms = function() {
            $scope.terms = [];
        };
        
        function drawTweetsPerDay(){
            var dayList = [['Día','Núm.Tweets']];
            var currDate = $scope.dtStart;
            if (currDate < $scope.dtEnd) {
                while (currDate <= $scope.dtEnd) {
                    dayList.push([currDate.getDate()+'/'+((parseInt(currDate.getMonth())+1).toString()+'/'+currDate.getFullYear()),0]);
                    currDate = new Date(currDate.setDate(currDate.getDate() + 1));
                }
            }
            angular.forEach($scope.tweetsperday, function(res) {
                var i = 0;
                while (i < dayList.length) {
                    if (""+res._id.day+'/'+res._id.month+'/'+res._id.year+"" === dayList[i][0]) {
                        dayList[i][1] = res.count;
                        break;
                    }
                    i += 1;
                }
            });
            drawTweetsPerDayChart(dayList);
        }
                
        $scope.getTweetsPerDay = function() {
            var ini = $filter('date')($scope.dtStart,'yyyy-MM-dd');
            var end = $filter('date')($scope.dtEnd,'yyyy-MM-dd');
            console.log('ini '+ini);
            console.log('end '+end);
            Tweets.getPerDay(ini,end)
            .success(function(data) {
                $scope.tweetsperday = data;
                drawTweetsPerDay();
            });
        };
        
        // tweets per user paging
        $scope.filteredTweetsPerUser = []
                
        $scope.tpuPageChanged = function(tpuCurrentPage) {
            $scope.tpuCurrentPage = tpuCurrentPage;
            updateRankingTweeterosPaging();
        };
                
        $scope.getRankingTweeteros = function() {
            $scope.tpuTotalItems = $scope.tweetsperuser.length;
            $scope.tpuCurrentPage = 1;
            $scope.tpuItemsPerPage = 10;
            $scope.tpuMaxSize = 5;
            updateRankingTweeterosPaging();
        };
        
        function updateRankingTweeterosPaging(){
            var begin = (($scope.tpuCurrentPage - 1) * $scope.tpuItemsPerPage)
            , end = begin + $scope.tpuItemsPerPage;
            $scope.filteredTweetsPerUser = $scope.tweetsperuser.slice(begin, end);
        }
        // end tweets per user paging
                
        // tweets in gap paging
        $scope.filteredTweetsInGap = []
        
        $scope.tfPageChanged = function(tfCurrentPage) {
            $scope.tfCurrentPage = tfCurrentPage;
            updateTweetsInGapPaging();
        };
        
        function updateTweetsInGapPaging(){
            var begin = (($scope.tfCurrentPage - 1) * $scope.tfItemsPerPage)
            , end = begin + $scope.tfItemsPerPage;
            $scope.filteredTweetsInGap = $scope.tweetsingap.slice(begin, end);
        }
        // end tweets in gap paging
                
        // current tweets per user
        $scope.filteredCurrentTweets= []
        
        $scope.ctPageChanged = function(ctCurrentPage) {
            $scope.ctCurrentPage = ctCurrentPage;
            updateCurrentTweetsPaging();
        };
        
        function updateCurrentTweetsPaging(){
            var begin = (($scope.ctCurrentPage - 1) * $scope.ctItemsPerPage)
            , end = begin + $scope.ctItemsPerPage;
            $scope.filteredCurrentTweets = $scope.currenttweets.slice(begin, end);
        }
        // end current tweets per user
                
                // current tweets term
                $scope.filteredTweetsTerms= []
                
                $scope.ttPageChanged = function(ttCurrentPage) {
                $scope.ttCurrentPage = ttCurrentPage;
                updateTweetsTermsPaging();
                };
                
                function updateTweetsTermsPaging(){
                var begin = (($scope.ttCurrentPage - 1) * $scope.ttItemsPerPage)
                , end = begin + $scope.ttItemsPerPage;
                $scope.filteredTweetsTerms = $scope.tweetsterms.slice(begin, end);
                }
                // end current tweets per terms
                
        $scope.formatText = function(text) {
            var aux_text = text;
            angular.forEach($scope.terms, function(term) {
                console.log(term);
                var query = '/'+term+'/gi';
                console.log(query);
                aux_text = aux_text.replace(eval(query), '<strong style="color:#428bca">'+term+'</strong>');
            });
            return $sce.trustAsHtml(aux_text);
        };
                
});