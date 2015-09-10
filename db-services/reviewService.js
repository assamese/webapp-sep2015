
angular.module("db_ReviewService", ['parse']).factory("dbReviewService", function ($q, ParseService) {

    var writeReview = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("Reviews", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }


    var getReviewsByRevieweeId = function (emailId) {

        var deferred = $q.defer();

        var param = [{ key: "revieweeId", value: emailId, constraint: "equalTo"}];

        ParseService.GetAll("Reviews", param).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;

    }

    var getCandidateReviews = function (emailId) {

        var deferred = $q.defer();

        var candidateReviews = [];

        var param = [{ key: "revieweeId", value: emailId, constraint: "equalTo" },
                     { key: "createdAt", order: "asc", constraint: "sortableType"}];

        ParseService.GetAll("Reviews", param).then(function (reviews) {

            for (var index = 0; index <= reviews.length - 1; index++) {

                var review = reviews[index];

                candidateReviews.push({
                    rating: angular.isDefined(review.get("rating")) ? parseInt(review.get("rating")) : 0,
                    review: review.get("review"),
                    date: review.updatedAt
                });
            }

        }, function (error) {
            deferred.resolve(error.message);
        }).then(function () {
            deferred.resolve(candidateReviews);
        });

        return deferred.promise;
    }

    var getRating = function (revieweeId) {
        var deferred = $q.defer();

        var param = [{ key: "revieweeId", value: revieweeId, constraint: "equalTo"}];

        ParseService.GetAll("Reviews", param).then(function (reviews) {

            var total = reviews.length;
            var rating = 0;

            if (total > 0) {

                for (var index = 0; index <= reviews.length - 1; index++) {
                    rating = reviews[index].get("rating") + rating;
                }

                rating = rating / total;
            }

            deferred.resolve({
                totalReviews: total,
                avgRating: Math.round(rating)
            });


        }, function (error) {
            deferred.resolve(error.message);
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
