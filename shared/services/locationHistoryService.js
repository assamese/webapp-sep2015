
angular.module("um_LocationHistoryService", ['db_LocationHistoryService']).factory("LocationHistoryService", function ($q, dbLocationHistoryService) {

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

        dbLocationHistoryService.getLocationHistory(candidateId, minutesBefore).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    return {
        GetLocationHistory: getLocationHistory
    }
});