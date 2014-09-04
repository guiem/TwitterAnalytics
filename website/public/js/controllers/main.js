angular.module('visualizationController', ['ui.bootstrap','general-directives'])

    .service('sharedProperties', function ($translate) {
        this.projectName = null;

        return {
            getProjectName: function () {
                return this.projectName;
            },
            setProjectName: function(value) {
                this.projectName = value;
            },
            changeLanguage: function (key) {
                $translate.use(key);
            },
        };
    })

    .controller('TabController', function(){
        this.tab = 1;

        this.setTab = function(newValue){
          this.tab = newValue;
        };

        this.isSet = function(tabName){
          return this.tab === tabName;
        };
    })

    .controller('HomeController',function(sharedProperties){
        this.language='es';

        this.setProjectName = function(projectName){
            sharedProperties.setProjectName(projectName);
        };

        this.changeLanguage = function(key){
            sharedProperties.changeLanguage(key);
            this.language = key;
        }
    })

	.controller('MainController', function($scope, $filter, $http, $sce, Users, Tweets, Words, HashTags, Projects, sharedProperties) {
              
        $scope.loading = true;
        $scope.formData = {}; // TODO: check if needed
        $scope.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        function initData(){
            /* TWEETS */
            Tweets.getTotalTweets($scope.currentProject.name)
            .success(function(data) {
                $scope.totaltweets = data;
                $scope.loading = false;
            });

            Tweets.getTotalRTweets($scope.currentProject.name)
            .success(function(data) {
                $scope.totalrtweets = data;
                $scope.loading = false;
            });

            Tweets.getTweetsPerUser($scope.currentProject.name)
            .then(function(data){
                $scope.tweetsperuser = data;
                changeMaxTwittersChart(10);
            });

            // get num tweets geolocalized
            Tweets.getNumGeo($scope.currentProject.name)
            .success(function(data) {
                $scope.numgeo = data;
                $scope.loading = false;
            });

            Tweets.getMinDate($scope.currentProject.name)
            .success(function(data) {
                $scope.dtStart = new Date(data[0].created_at_dt);
            });
                
            Tweets.getMaxDate($scope.currentProject.name)
            .success(function(data) {
                $scope.dtEnd = new Date(data[0].created_at_dt);
            });
            /* END TWEETS */

            /* HASHTAGS */
            updateHashtags();
            /* END HASHTAGS */

            /* WORDS */
            updateWords();
            /* END WORDS */

            /* USERS */
            Users.getTotalUsers($scope.currentProject.name)
            .success(function(data) {
                $scope.totalusers = data;
            });
                
            Users.getUserNames($scope.currentProject.name)
            .success(function(data) {
                $scope.usernames = data;
            });
            /* END USERS */

        }
              
        /* PROJECTS */

        function initProject(){
            var projectName = sharedProperties.getProjectName();
            if (projectName){
                var currProject = false;
                angular.forEach($scope.projects, function(value,index){
                    if (value.name === projectName){
                        console.log('valor igual');
                        currProject = value;
                        return currProject;
                    }
                })
                if (currProject)
                    return currProject;
            }
            return $scope.projects[0];
        }

        // List of available projects
        Projects.getProjects()
        .then(function(data) {
            $scope.projects = data;
            if ($scope.projects.length > 0) {
                $scope.currentProject = initProject();
                initData();
            }
        });  

        // Watching the change of project
        $scope.$watch('currentProject', function(newVal, oldVal) {
            if ($scope.currentProject){
                initData();
            }
        });      

        /* END PROJECTS */

        /* TWEETS */

        // get tweets filtered by username
        $scope.getTweetsByUser = function() {
            Tweets.getByUser($scope.currentProject.name,$scope.currentuser)
            .then(function(data) {
                $scope.currenttweets = data;
                $scope.ctTotalItems = $scope.currenttweets.length;
                $scope.ctCurrentPage = 1;
                $scope.ctItemsPerPage = 6;
                $scope.ctMaxSize = 5;
                updateCurrentTweetsPaging();
            });
        };

        // get tweets in time gap
        $scope.getTweetsInGap = function() {
            if(!$scope.checkTweetsGap){
                return;
            }
            Tweets.getInGap($scope.currentProject.name,$filter('date')($scope.dtStart,'yyyy-MM-dd'),$filter('date')($scope.dtEnd,'yyyy-MM-dd'))
            .then(function(data) {
                $scope.tweetsingap = data;
                $scope.tfTotalItems = $scope.tweetsingap.length;
                $scope.tfCurrentPage = 1;
                $scope.tfItemsPerPage = 6;
                $scope.tfMaxSize = 5;
                updateTweetsInGapPaging();
            });
        };

        // get num tweets per day
        $scope.getTweetsPerDay = function() {
            var ini = $filter('date')($scope.dtStart,'yyyy-MM-dd');
            var end = $filter('date')($scope.dtEnd,'yyyy-MM-dd');
            Tweets.getPerDay($scope.currentProject.name,ini,end)
            .success(function(data) {
                $scope.tweetsperday = data;
                drawTweetsPerDay();
            });
        };

        $scope.searchTerms = function(mode) {
            $scope.loading = true;
            Tweets.tweetsByTerm($scope.currentProject.name,$scope.userTerms,$scope.terms,mode)
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

        /* END TWEETS */

        /* HASHTAGS */

        function updateHashtags(){
            HashTags.getNHashtags($scope.currentProject.name,$scope.maxHashTags)
            .then(function(data) {
                $scope.nHashtags = data;
                changeMaxHashTagsChart();
            });    
        }

        // Watching the change of maxWords field to update the cloud
        $scope.$watch('maxHashTags', function(newVal, oldVal) {
            if ($scope.currentProject){
                updateHashtags();   
            }
        });

        function changeMaxHashTagsChart(){
            var wordsData = [];
            var usersBlackList = [];
            angular.forEach($scope.usernames, function(res) {
                usersBlackList.push(res.screen_name);
            });
            var maxCount = 0;
            angular.forEach($scope.nHashtags, function(res) {
                maxCount = Math.max(maxCount,res.count);
                var isUser = usersBlackList.indexOf(res.word);
                if(isUser == -1)
                    wordsData.push([res.hashtag, res.count*100/maxCount]);
                });
            WordCloud(document.getElementById('word-cloud-chart-hashtags'), { list: wordsData } );
        }

        /* END HASHTAGS */

        /* WORDS */

        // TODO: avoid duplicate code from routes.js
        // Basic characters filter based on this url: http://www.skorks.com/2010/05/what-every-developer-should-know-about-urls/
        var reservedCharacters = [";", "/", "?", ":", "@", "&", "=", "+", "$", ","];
        var unreservedCharacters = ["-", "_", ".", "!", "~", "*", "'", "(", ")"];
        var unwiseCharacters = ["{", "}", "|", "\"", "^", "[", "]", "`"];
        var asciiCharacters = ["<", ">", "#", "%", '"'];
        var personalCharacters = ["…",'“',"`","\"","``","''","..."];

        $scope.fixedBlackList = reservedCharacters.concat(unreservedCharacters).concat(unwiseCharacters)
        .concat(asciiCharacters).concat(personalCharacters);
        
        $scope.blackList = ["http","el","la","de","en","y","los","a","sobre","por","con","para","rt","las","no","que","una",
        "un","l","san","s","tel","es","se","al","su","scoopit","del","d","amb","i","te","lo","e","24",
        "per","https","o","diversidad","funcional","diversidadfuncional","funcional.","162","184","07","42"];
        
        // aux function to substract two arrays
        function arrayDiff(a,b){
            var diff = [];
            a.forEach(function(key) {
                if (-1 === b.indexOf(key)) 
                    diff.push(key);
            });
            return diff;
        }

        // aux function to format blacklist
        function formatBlackList() {
            var bl = $scope.blackList;
            if (typeof $scope.blackList === 'string')
                bl = $scope.blackList.split(',');
            return arrayDiff(bl,$scope.fixedBlackList);
        }

        function updateWords(){
            Words.getNGrams($scope.currentProject.name,JSON.stringify(formatBlackList()),$scope.maxWords)
            .then(function(data) {
                $scope.nGrams = data;
                changeMaxWordsChart();
            });
        }

        // Watching the change of maxWords field to update the cloud
        $scope.$watch('maxWords', function(newVal, oldVal) {
            if ($scope.currentProject){
                updateWords();   
            }   
        });

        // Function to update the number of words in the cloud we want to retrieve once filter file has changed
        $scope.getNGramsUpdate = function() {
            updateWords();
        };

        // Updating chart with max words
        function changeMaxWordsChart(){
            var wordsData = [];
            var usersBlackList = [];
            angular.forEach($scope.usernames, function(res) {
                usersBlackList.push(res.screen_name);
            });
            var maxCount = 0;
            angular.forEach($scope.nGrams, function(res) {
                maxCount = Math.max(maxCount,res.count);
                var isUser = usersBlackList.indexOf(res.word);
                if(isUser == -1)
                    wordsData.push([res.word, res.count*100/maxCount]);
            });
            WordCloud(document.getElementById('word-cloud-chart'), { list: wordsData } );
        }

        /* End of Word Cloud */

        /* END WORDS */
                
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

        // Watching the change of Tweets field to update the cloud
        $scope.$watch('maxTweeters', function(newVal, oldVal) {
            if (!$scope.maxTweeters)
                changeMaxTwittersChart(10);
            else
                changeMaxTwittersChart($scope.maxTweeters);
        });

        $scope.searchTermsAnd = function() {
            $scope.searchTerms('and');
        }
        
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