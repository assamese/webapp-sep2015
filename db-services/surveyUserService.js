

angular.module("db_SurveyUserService", ['parse']).factory("dbSurveyUserService", function ($q, ParseService) {

    var save = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("SurveyUser", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

     var get = function (facebookId) {

        var deferred = $q.defer();

        var param = [{ key: "facebookId", value: facebookId, constraint: "equalTo"}];
        
        ParseService.Get("SurveyUser", param).then(function (response) {

            if(angular.isObject(response))
            {
                deferred.resolve({
                    PolljoyAppId: response.get("polljoyAppId"),
                    FacebookId: response.get("facebookId")
                });
            }
            else
            {
                deferred.resolve(null);
            }
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    return {
        Save: save,
        Get: get
    }
});
