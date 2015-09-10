
angular.module("um_CandidateService", ['db_UserService', 'db_ReviewService', 'db_ImageService', 'um_GoogleMapService', 'um_LocationHistoryService']).factory("CandidateService", function ($q, dbUserService, dbReviewService, dbImageService, GoogleMapService, dbLocationHistoryService) {

    var getCandidates = function (jobId, statusId) {

        var deferred = $q.defer();

        dbUserService.GetUsersByJobId(jobId, statusId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;

    }


    var getCandidateProfile = function (id) {

        var deferred = $q.defer();

        var model = '';

        dbUserService.Get(id).then(function (response) {
            if (angular.isObject(response)) {
                model = response;
            }
        }).then(function () {

            dbReviewService.GetRating(model.email).then(function (data) {
                model.rating = data;
            }).then(function () {

                if (angular.isObject(model.geoCode)) {

                    GoogleMapService.GetZipCode(model.geoCode).then(function (response) {
                        if (angular.isObject(response)) {
                            model.location = response.zipCode;
                        }
                        else {
                            model.location = "Unknown";
                        }
                    }).then(function () {
                        deferred.resolve(model);
                    });
                }
                else {
                    deferred.resolve(model);
                }
            });
        });

        return deferred.promise;
    }


    var getCandidateGallery = function (facebookId) {

        var deferred = $q.defer();


        dbImageService.GetAll(facebookId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }
    
    /**
     * function to get all interested candidated who has applied  to any of my jobs
     *
     */
    var getAllInterestedCandidates = function(posterEmail, statusId){
        var deferred = $q.defer();
        dbUserService.GetAllInterestedUsers(posterEmail, statusId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    /**
     * Function: get candidate's tracking information for a specific period of time
     * @param STRING candidateId
     * @param STRING mintuesBefore(to enquire about past minutes result)
     * @return ARRAY Result-Set
     * @dev: Baljeet
     *
     */
    var getLocationHistory = function(candidateId, minutesBefore) {

        var deferred = $q.defer();
        dbLocationHistoryService.GetLocationHistory(candidateId, minutesBefore).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    
    return {
        GetCandidates               : getCandidates,
        GetCandidateProfile         : getCandidateProfile,
        GetCandidateGallery         : getCandidateGallery,
        GetAllInterestedCandidates  : getAllInterestedCandidates,
        GetLocationHistory          : getLocationHistory
    }
});
