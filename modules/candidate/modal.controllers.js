$(document).ready(function () {

    angular.module('um_CandidateController').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, hireOrInvite, jobIdFromRouteParams) {
      
        $scope.items            = items;
        $scope.hireOrInvite     = hireOrInvite;
        $scope.jobSelectedFromModal = jobIdFromRouteParams;
        $scope.ok = function () {
            $modalInstance.close($scope.jobSelectedFromModal);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
});   
