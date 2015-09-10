
angular.module("db_ConfigService", ['parse']).factory("dbConfigService", function ($q, ParseService) {

    var get = function () {

        var deferred = $q.defer();

        ParseService.Get("Config", null).then(function (response) {
            if (angular.isObject(response)) {
                deferred.resolve({
                    surveysURL: response.get("surveysURL"),
                    SeekerAPIURL: response.get("jobDescriptionURL")
                });
            }
        }, function (err) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    return {
        Get: get
    }
});
