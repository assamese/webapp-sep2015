
angular.module("db_Emails2sendService", ['parse']).factory("dbEmails2sendService", function ($q, ParseService) {

    var save = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("emails2send", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    return {
        Save: save
    }
});
