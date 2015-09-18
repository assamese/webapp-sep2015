$(document).ready(function () {

    angular.module('um_ReviewController', ['um_ReviewService', 'um_SessionService', 'um_UserService', 'um_CandidateService']).controller("reviewController", function ($scope, $location, $routeParams, ReviewService, SessionService, UserService, CandidateService) {

        var revieweeId;

        $scope.PopulateData = function () {

            $scope.SetBreadCrumb("Review");

            /*to be used in redirect to candidate profile*/
            $scope.jobId        = $routeParams.jobId;
            $scope.candidateId  = $routeParams.candidateId;
            UserService.Get($routeParams.candidateId).then(function (candidate) {
                $scope.candidate = candidate;
                revieweeId = candidate.email;

            }).then(function () {
                UserService.Get(SessionService.User.id).then(function (user) {
                    $scope.company = user;
                });

            });

        }

        $scope.WriteReview = function () {
            if (angular.isObject($scope.Review)) {
                $scope.Review.taskId = $routeParams.jobId;
                $scope.Review.revieweeId = revieweeId;
                $scope.Review.reviewerID = SessionService.User.email;
                $scope.Review.rating = parseInt($scope.rate);

                ReviewService.WriteReview($scope.Review).then(function (response) {
                    if (angular.isObject(response)) {
                        $scope.ShowMessage("Review has been saved successfully");
                        $scope.Review = null;
                    }
                    else {
                        $scope.ShowMessage(response);
                    }
                });
            }
        }

        /// Get recent reviews
        $scope.GetReviews = function () {

            $scope.SetBreadCrumb("Recent Reviews");
            $scope.IsReviewFound = false;
            ReviewService.GetCandidateReviews($routeParams.candidateEmail).then(function (reviews) {
                $scope.reviews = reviews;
            }).then(function () {
                CandidateService.GetCandidateProfile($routeParams.candidateId).then(function (response) {
                    if (angular.isObject(response)) {
                        $scope.candidate = response;
                        /*$scope.jobId = $routeParams.jobId;*/
                    }
                });
            });
        }
    });
});   
    