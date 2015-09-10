$(document).ready(function () {

    // create the module and name it esProntoApp
    var esProntoApp = angular.module("esProntoApp");

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
});   
    