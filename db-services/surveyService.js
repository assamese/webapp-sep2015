

angular.module("db_SurveyService", ['parse']).factory("dbSurveyService", function ($q, ParseService) {

    var save = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("Survey", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve("System Error, "+ error.message);
        });

        return deferred.promise;
    }

    return {
        
        Save: save
    }
});
