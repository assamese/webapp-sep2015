$(document).ready(function () {

    angular.module('um_RegisterController', ['um_RegisterService']).controller("registerController", function ($scope, $location, RegisterService) {
        $scope.Register = function () {

            if (angular.isDefined($scope.user) && angular.isDefined($scope.user.name) && angular.isDefined($scope.user.email) && angular.isDefined($scope.user.password)) {

                $scope.user.email = angular.lowercase($scope.user.email);

                RegisterService.Signup($scope.user).then(function (response) {
                    if (angular.isObject(response)) {
                        $scope.message = "A verification email has been sent to your email address (The email was sent from this email account - 'info@espronto.com'). Please verify your email. (Check your spam folder if the email does not show up in your In-Box).";
                        $scope.user = null;
                    }
                    else {
                        $scope.message = response;
                    }
                });

            }
            else {
                $scope.message = "All fields are mandatory";
            }
        }
    });

});   
    