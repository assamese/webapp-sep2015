
angular.module("um_SurveyService", ['db_SurveyService', 'db_AvailableSurveyService', 'db_ConfigService']).factory("SurveyService", function ($q, dbSurveyService, dbAvailableSurveyService, dbConfigService) {

    var save = function (model, startDate) {

        var survey;
        
        var deferred = $q.defer();

        /*var startDate = '';
        
        if(isSendNow)
        {
            startDate= new Date(); 
        }
        else
        {
          startDate = new Date(model.year, model.month, model.day, model.hour, model.minute, model.second,"00");
        }*/

        dbConfigService.Get().then(function (response) {
            survey = {
               startDate: startDate,
               url: response.surveysURL + model.filename ,
               facebookId: model.facebookId,
               taskId: model.jobId,
               sendToWho: model.sendToWho,
               surveyType:model.surveyType
            };

        }).then(function (argument) {
            dbSurveyService.Save(survey).then(function (response) {
                deferred.resolve(response);
            });
        });



        return deferred.promise;
    }

    var getAvailableSurvey = function (facebookId, surveyType) {

        var deferred = $q.defer();

        dbAvailableSurveyService.Get(facebookId, surveyType).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    var getSettings = function () {
        var deferred = $q.defer();
        dbConfigService.Get().then(function (response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }


    return {
        Save: save,
        GetAvailableSurvey: getAvailableSurvey
    }
});
