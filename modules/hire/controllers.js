$(document).ready(function () {

    angular.module('um_HireController', ['um_JobService', 'um_UserService', 'um_SessionService', 'um_EngagementService', 'um_StatusService']).controller("hireController", function ($scope, $location, $routeParams, JobService, UserService, SessionService, EngagementService, StatusService) {

        $scope.PopulateData = function () {
            $scope.SetBreadCrumb("Offer Detail");
            JobService.GetJobFromTaskNew($routeParams.jobId).then(function (job) {
                $scope.job = job;
                $scope.job.startDate = eval(job.month + 1) + "-" + job.day + "-" + job.year;

            }).then(function () {
                UserService.Get($routeParams.candidateId).then(function (candidate) {
                    $scope.candidate = candidate;
                });

            });
        }

        $scope.OfferSent = function () {
            $scope.SetBreadCrumb("Offer Sent");
        }

        $scope.OfferSend = function (candidate, jobId) {
            /*first get statuses then do processing*/
            StatusService.GetStatuses().then(function(response){

                StatusService2 = response;
                if (angular.isObject(candidate) && angular.isDefined(jobId)) {
               
                    var model = {
                        posterId: SessionService.User.email,
                        seekerId: candidate.email,
                        taskId: jobId,
                        status: StatusService2.JobSeekerAccepted
                    };

                    EngagementService.Insert(model).then(function (response) {
               
                        $location.path("HireFinalNotification/" + candidate.name);
                    });
                }
            });
        }
    });
}); 