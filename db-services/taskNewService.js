
angular.module("db_TaskNewService", ['parse']).factory("dbTaskNewService", function ($q, ParseService) {

    var getAll = function (userId) {

        var deferred = $q.defer();

        var jobs = [];

        var user = Parse.Object.extend("User");
        var _user = new user();
        _user.id = userId;

        var param = [{ key: "poster", value: _user, constraint: "equalTo" },
                    { key: "createdAt", order: "asc", constraint: "sortableType"}];

        ParseService.GetAll("TaskNew", param).then(function (data) {
            if (data.length > 0) {
                for (var index = 0; index <= data.length - 1; index++) {
                    jobs.push({
                        id: data[index].id,
                        name: data[index].get("name"),
                        taskId: data[index].get("taskId"),
                        price: data[index].get("price"),
                        createdAt:data[index].createdAt
                    });
                }

            }
        }, function (error) {
            deferred.resolve(error.message);
        }).then(function () {
            deferred.resolve(jobs);
        });

        return deferred.promise;
    }


    var get = function (id) {

        var deferred = $q.defer();

        var param = [{ key: "objectId", value: id, constraint: "equalTo"}];

        var model;

        ParseService.Get("TaskNew", param).then(function (response) {

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

    var getByTaskId = function (id) {

        var deferred = $q.defer();

        var param = [{ key: "taskId", value: id, constraint: "equalTo"}];

        var model;

        ParseService.Get("TaskNew", param).then(function (response) {

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
        GetAll: getAll,
        Get: get,
        GetByTaskId:getByTaskId
    }
});
