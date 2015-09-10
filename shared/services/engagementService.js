
angular.module("um_EngagementService", ['db_EngagementService']).factory("EngagementService", function ($q, dbEngagementService) {

    var insert = function (model) {

        var deferred = $q.defer();

        dbEngagementService.Insert(model).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    var getEngagements = function (name) {

        var deferred = $q.defer();

        dbEngagementService.GetEngagements(name).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    return {
        Insert: insert,
        GetEngagements: getEngagements
    }
});
