$(document).ready(function () {

    // create the module and name it esProntoApp
    var esProntoApp = angular.module('esProntoApp', [
                                                        'ngRoute',
                                                        'ui.bootstrap',
                                                        'um_SettingService',
                                                        'um_LoginController',
                                                        'um_RegisterController'
                                                    ]);

    esProntoApp.run(function (SettingService) {
        var parseKeys = SettingService.GetParseKeys();
        Parse.initialize(parseKeys.ApplicationId, parseKeys.JavascriptKey);
    });


    esProntoApp.controller("mainController", function ($scope) {
        // COLLAPSE =====================
        $scope.isCollapsed = false;
    });

    // configure our routes
    esProntoApp.config(function ($routeProvider) {
        $routeProvider
                .when('/Login', {
                    templateUrl: 'modules/login/index.html',
                    controller: 'loginController'
                })
                 .when('/Register', {
                     templateUrl: 'modules/register/index.html',
                     controller: 'registerController'
                 })
                 .when('/forgot-password', {
                     templateUrl: 'modules/forgot-password/index.html'
                 })
                 .otherwise({
                     redirectTo: '/Login'
                 });
    });
});   
    