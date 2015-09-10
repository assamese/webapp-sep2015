

angular.module("db_AvailableSurveyService", ['parse']).factory("dbAvailableSurveyService", function ($q, ParseService) {

    var save = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("AvailableSurvey", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

     var get = function (posterFacebookId, surveyType) {

        var deferred = $q.defer();

        var param = [
                    { key: "posterFacebookId", value: posterFacebookId, constraint: "equalTo"},
                    { key: "surveyType", value: surveyType, constraint: "equalTo"}
                    ];
        ParseService.GetAll("AvailableSurveys", param).then(function (data) {

            var surveys = [];

            if (data.length > 0) {
                for (var index = 0; index <= data.length - 1; index++) {
                    var response = data[index];
                    surveys.push({
                        NameOfSurvey: response.get("nameOfSurvey"),
                        Filename: response.get("filename"),
                        PosterFacebookId: response.get("posterFacebookId")
                    });
                }
            }

            deferred.resolve(surveys);


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
