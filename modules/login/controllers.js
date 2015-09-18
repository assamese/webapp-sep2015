$(document).ready(function () {

    angular.module('um_LoginController', ['um_AuthService']).controller("loginController", function ($scope, $location, AuthService) {

        $scope.Login = function () {

            $scope.IsButtonClick = true;
            if (angular.isDefined($scope.email) && angular.isDefined($scope.password)) {

                AuthService.Authenticate(angular.lowercase($scope.email), $scope.password).then(function (response) {
                    if (angular.isObject(response)) {

                        if (response.get("emailVerified") && response.get('currentRegMode')=='P') {
                        
                            window.location = "authenticated.htm#/company-profile";
                        } 

                        else if( response.get('currentRegMode')!='P' ){
                            
                            Parse.User.logOut();
                            $scope.message = "Web-site login is available only for employers";
                            $scope.IsButtonClick = false;
                        }
                        else {
                            $scope.message = "You need to verify the email address before logining into the system";
                            $scope.IsButtonClick = false;
                        }
                    }
                    else {
                        $scope.message = response;
                        $scope.IsButtonClick = false;
                    }
                });
            }
            else {
                $scope.message = "Invalid email/password";
                $scope.IsButtonClick = false;
            }
        }
    });
});


