
angular.module("um_CheckInOutService", ['db_CheckInOutService']).factory("CheckInOutService", function ($q, dbCheckInOutService) {

    var getAllByUserId = function (facebookId) {

        var deferred = $q.defer();

        dbCheckInOutService.GetAllByUserId(facebookId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    return {
        GetAllByUserId: getAllByUserId
    }
});
