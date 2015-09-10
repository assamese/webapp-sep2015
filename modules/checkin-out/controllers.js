
$(document).ready(function () {
    angular.module('um_CheckInOutController', ['um_CheckInOutService']).controller("checkInOutController", function ($scope, $routeParams, CheckInOutService) {
        $scope.PopulateData = function () {
            $scope.SetBreadCrumb("Check In/Out");

            CheckInOutService.GetAllByUserId($routeParams.candidateEmail).then(function (data) {
                $scope.checkInOuts = data;
            });

        }
    });

});