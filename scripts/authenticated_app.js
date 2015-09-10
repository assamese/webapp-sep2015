(document).ready(function () {

    // create the module and name it esProntoApp
    var esProntoApp = angular.module('esProntoApp', [
                                                        'ngRoute',
                                                        'ngProgress',
                                                        'ui.bootstrap',
                                                        'um_ProfileController',
                                                        'um_JobController',
                                                        'um_CandidateController',
                                                        'um_HireController',
                                                        'um_ReviewController',
                                                        'um_SharedControllers',
                                                        'um_ChangePasswordController',
                                                        'um_ChatController',
                                                        'um_SharedControllers',
                                                        'um_SettingService',
                                                        'um_CheckInOutController'
                                                    ]);

    esProntoApp.run(function (SettingService, $rootScope) {

        var parseKeys = SettingService.GetParseKeys();
        Parse.initialize(parseKeys.ApplicationId, parseKeys.JavascriptKey);

        // Private function
        var Reset = function () {
            $rootScope.activePage = "";
            $rootScope.message = "";
        }

        $rootScope.SetBreadCrumb = function (message) {
            $rootScope.activePage = message;
        }

        $rootScope.ShowMessage = function (message) {
            $rootScope.message = message;
        }

        $rootScope.$on('$routeChangeStart', function (ev, data) {
            Reset();
            //            ngProgress.start();
        });

        $rootScope.$on('$routeChangeSuccess', function (ev, data) {
            //            ngProgress.complete();
        });

    });

    esProntoApp.config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    });


    esProntoApp.controller("mainController", function ($scope) {
        // COLLAPSE =====================
        $scope.isCollapsed = false;
    });

    esProntoApp.filter('range', function () {
        return function (input, total) {
            total = parseInt(total);
            for (var i = 1; i <= total; i++)
                input.push(i);
            return input;
        };
    })

    esProntoApp.directive('hmrating', function () {
        return {
            restrict: 'EA',
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                hmupto: "@",
                hmid: "@",
                hmcolor: '@',
                rate: '=',
                setrating: '&',
                mouseover: '&',
                mouseleave: '&'
            },
            templateUrl: 'rating.html',
            link: function (scope, element, attr) {
                scope.setrating(0);
            },
            controller: function ($scope) {

                $scope.setrating = function (r) {
                    ratingEffect(r);
                    $scope.rate = r;
                };

                $scope.mouseover = function (r) {
                    ratingEffect(r);
                }

                $scope.mouseleave = function () {
                    ratingEffect($scope.rate);
                }

                function ratingEffect(r) {


                    for (i = 0; i <= r; i++)
                        angular.element(document.querySelector("#" + $scope.hmid + i)).removeClass("fa-star-o");

                    for (i = 0; i <= r; i++)
                        angular.element(document.querySelector("#" + $scope.hmid + i)).addClass("fa-star");

                    for (i = r + 1; i <= $scope.hmupto; i++) {
                        angular.element(document.querySelector("#" + $scope.hmid + i)).removeClass("fa-star");
                        angular.element(document.querySelector("#" + $scope.hmid + i)).addClass("fa-star-o");
                    }
                }
            }
        };
    });

    // configure our routes
    esProntoApp.config(function ($routeProvider) {
        $routeProvider
                 .when('/company-profile', {
                     templateUrl: 'modules/company-profile/index.html',
                     controller: 'profileController'
                 })
                  .when('/company-profile/edit', {
                      templateUrl: 'modules/company-profile/edit.html',
                      controller: 'profileController'
                  })
                 .when('/Password/Change', {
                     templateUrl: 'ComingSoon/_index.html'
                 })
        /*Job */
                .when('/Job/Info', {
                    templateUrl: 'modules/job/process-info.html',
                    controller: 'jobController'
                })
                .when('/Job/Post', {
                    templateUrl: 'modules/job/create.html',
                    controller: 'jobController'
                })
                 .when('/Job/Open', {
                     templateUrl: 'modules/job/open-jobs.html',
                     controller: 'jobController'
                 })
                 .when('/Job/Edit/:id', {
                     templateUrl: 'modules/job/create.html',
                     controller: 'jobController'
                 })
                  .when('/Job/SavedNotification/:jobId', {
                      templateUrl: 'modules/job/saved-notification.html',
                      controller: 'jobController'
                  })
                   .when('/Candidate/Interested/:jobId', {
                       templateUrl: 'modules/candidate/candidate-interested.html',
                       controller: 'candidateController'
                   })
                   .when('/Candidate/Hired/:jobId', {
                       templateUrl: 'modules/candidate/candidate-hired.html',
                       controller: 'candidateController'
                   })
                  .when('/Candidate/Profile/:id/:jobId', {
                      templateUrl: 'modules/candidate/profile.html',
                      controller: 'candidateController'
                  })
                  .when('/Hire/:jobId/:candidateId', {
                      templateUrl: 'modules/hire/index.html',
                      controller: 'hireController'
                  })
                  .when('/HireFinalNotification/:candidateName', {
                      templateUrl: 'modules/hire/offer-sent.html',
                      controller: 'hireController'
                  })
                  .when('/Review/Post/:jobId/:candidateId', {
                      templateUrl: 'modules/review/writeReview.html',
                      controller: 'reviewController'
                  })
                  .when('/Review/List/:candidateId/:jobId/:candidateEmail', {
                      templateUrl: 'modules/review/recentReviews.html',
                      controller: 'reviewController'
                  })
                   .when('/Change-password', {
                       templateUrl: 'modules/change-password/index.html'
                   })
                   .when('/Chat', {
                       templateUrl: 'modules/chat/index.html'
                   })
                    .when('/Checkin-out/:candidateEmail', {
                        templateUrl: 'modules/checkin-out/index.html'
                    })

                 .otherwise({
                     template: '<h1>Sorry, Page is not exist. May be you are using wrong URL</h1>'
                 });
    });
});   
    