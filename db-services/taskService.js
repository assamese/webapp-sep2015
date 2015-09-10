
angular.module("db_TaskService", ['parse']).factory("dbTaskService", function ($q, ParseService) {

    var save = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("Tasks", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    var get = function (id) {

        var deferred = $q.defer();

        var param = [{ key: "objectId", value: id, constraint: "equalTo"}];

        ParseService.Get("Tasks", param).then(function (response) {

            if (angular.isObject(response)) {

                var expiryTime = response.get("expiryTime");
                model = {
                    id: response.id,
                    name: response.get("name"),
                    price: response.get("price"),
                    day: new Date(expiryTime).getDate(),
                    month: new Date(expiryTime).getMonth(),
                    year: new Date(expiryTime).getFullYear(),
                    hours: new Date(expiryTime).getHours(),
                    minutes: new Date(expiryTime).getMinutes(),
                    taskId: response.get("taskId"),
                    geoCode: response.get("geoCode")
                };

                deferred.resolve(model);
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
