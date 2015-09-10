$(document).ready(function () {
    angular.module('um_SharedControllers', ['um_SessionService', 'db_UserService']).controller("headerController", function ($scope, $location, SessionService, dbUserService) {
        
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
        if (SessionService.IsAuthenticated) {
            dbUserService.Get(Parse.User.current().id).then(function (company) {
                $scope.name = company.name;
                $scope.avtar = company.avtar;
            });
        }
        else {
            window.location = "index.htm#/Login";
        }

        $scope.jobNavigation_toggle = false;
        $scope.ShowJobNavigation = function () {
            $scope.jobNavigation_toggle = !$scope.jobNavigation_toggle;
            $scope.settingNavigation_toggle = false;
        }


        $scope.settingNavigation_toggle = false;
        $scope.ShowSettingNavigation = function () {
            $scope.settingNavigation_toggle = !$scope.settingNavigation_toggle;
            $scope.jobNavigation_toggle = false;
        }

        $scope.Logout = function () {

            if (confirm("Do you want to log-out?")) {
                Parse.User.logOut();
                window.location = "index.htm#/Login";
            }
        }
    });
});  