$(document).ready(function () {

    angular.module('um_ChangePasswordController', []).controller("changePasswordController", function ($scope) {

        $scope.SetBreadCrumb("Change Password");

        $scope.ChangePassword = function () {

            if (angular.isDefined($scope.email)) {

                Parse.User.requestPasswordReset($scope.email, {
                    success: function () {
                        alert("Password reset instructions have been sent to the email address.");
                    },
                    error: function (error) {
                        $scope.ShowMessage(error.message);
                    }
                });
            }
        }
    });
}); 