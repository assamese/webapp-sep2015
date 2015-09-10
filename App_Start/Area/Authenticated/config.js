$(document).ready(function () {

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
                                                        'um_CheckInOutController',
                                                        'um_InviteController',
                                                        'um_SurveyController',
                                                        'xeditable',
                                                        'ngMap',
                                                        'um_ExportTimesheetController',
                                                        'ngMaterial',
                                                        'ngAnimate',
                                                        'um_UtilService' 
                                                    ]);
    esProntoApp.config( function($mdThemingProvider){
      // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
    });
    esProntoApp.config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    });

    // configure our routes
    esProntoApp.config(function ($routeProvider) {
        $routeProvider
                 .when('/company-profile', {
                     templateUrl: 'modules/company-profile/edit.html',
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
                 .when('/Job/send-push/:jobId', {
                     templateUrl: 'modules/job/send-push.html',
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
                  .when('/Candidate/Profile/:id', {
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
                    .when('/Invite/:jobId', {
                        templateUrl: 'modules/invite/index.html'
                    })
                   .when('/Survey/:jobId', {
                        templateUrl: 'modules/survey/index.html'
                    })
                    .when('/Survey/Schedule/:jobId/:polljoyAppId', {
                        templateUrl: 'modules/survey/schedule-survey.html',
                        controller:'surveyController'
                    })
                    .when('/Survey/Send/:jobId', {
                        templateUrl: 'modules/survey/send-survey.html',
                        controller:'surveyController'
                    })
                    .when('/Candidate/All', {
                        templateUrl: 'modules/candidate/all-candidates.html',
                    })
                    .when('/Candidate/All/:jobId', {
                        templateUrl: 'modules/candidate/all-candidates.html',
                    })
                    .when('/Candidate/All/Mark-Hired/:jobId/', {
                        templateUrl: 'modules/candidate/all-candidates.html',
                    })
                    .when('/Candidate/Add', {
                        templateUrl: 'modules/candidate/add-candidate.html',
                    })
                     .when('/Candidate/ImportUserData', {
                        templateUrl: 'modules/candidate/importUserData.html',
                    })
                    .when('/Candidate/Track/:candidateId/:jobId', {
                        templateUrl: 'modules/candidate/track-candidate.html',
                    })
                    .when('/Candidate/Track-full-screen/:candidateId/:jobId', {
                        templateUrl: 'modules/candidate/track-candidate-full-screen.html',
                    })
                    .when('/Candidate/Mark-Hired/:candidateId', {
                        templateUrl: 'modules/candidate/mark-hired.html',
                    })
                    .when('/ExportTimeSheet/:jobId/:price', {
                        templateUrl: 'modules/export-timesheet/index.html',
                        controller: 'exportTimesheetController'
                    })

                 .otherwise({
                     template: '<h1>Sorry, Page is not exist. May be you are using wrong URL</h1>'
                 });
    });
});   
    