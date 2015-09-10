
angular.module("um_ReviewService", ['db_ReviewService']).factory("ReviewService", function ($q, dbReviewService) {

    var writeReview = function (model) {

        var deferred = $q.defer();

        dbReviewService.WriteReview(model).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    var getReviewsByRevieweeId = function (emailId) {

        var deferred = $q.defer();

        dbReviewService.GetReviewsByRevieweeId(emailId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;

    }

    var getCandidateReviews = function (emailId) {

        var deferred = $q.defer();

        dbReviewService.GetCandidateReviews(emailId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    var getRating = function (revieweeId) {
       
        var deferred = $q.defer();

        dbReviewService.GetRating(revieweeId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;


    }

    return {
        GetRating: getRating,
        WriteReview: writeReview,
        GetCandidateReviews: getCandidateReviews,
        GetReviewsByRevieweeId: getReviewsByRevieweeId
    }
});
