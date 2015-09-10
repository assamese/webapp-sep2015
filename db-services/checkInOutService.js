
angular.module("db_CheckInOutService", ['parse']).factory("dbCheckInOutService", function ($q, ParseService) {

    var getAllByUserId = function (facebookId) {

        var deferred = $q.defer();

        var param = [{ key: "facebookId", value: facebookId, constraint: "equalTo"}];

        var checkInOuts = [];

        ParseService.GetAll("CheckInOut", param).then(function (data) {

            if (data.length > 0) {
               
                var geoCodeObj;
                var obj
               
                for (var index = 0; index <= data.length - 1; index++) {
                    obj = data[index];
                    geoCodeObj = obj.get("location");

                    checkInOuts.push({
                        UserId: obj.get("facebookId"),
                        Status: obj.get("status"),
                        geoCode: geoCodeObj,
                        isLocation:angular.isObject(geoCodeObj),
                        CreatedBy: obj.createdAt


                    });
                }
            }


        }, function (error) {
            deferred.resolve(error.message);
        }).then(function () {

            deferred.resolve(checkInOuts);
        });

        return deferred.promise;


    }

     var getAllByJobId = function (model) {

        var deferred = $q.defer();

        var tasks = Parse.Object.extend("Tasks");
        var _tasks = new tasks();
        _tasks.id = model.jobId;

       var param = [
                     { key: "taskId", value: _tasks, constraint: "equalTo"},
                     { key: "createdAt", value: model.start, constraint: "greaterThanOrEqualTo"},
                     { key: "createdAt", value:  model.end, constraint: "lessThanOrEqualTo"},
                     { key: "createdAt", order: "asc", constraint: "sortableType"}
                    ];

        var checkInOuts = [];

        ParseService.GetAll("CheckInOut", param).then(function (data) {

            if (data.length > 0) {
               
                var obj;
               
                for (var index = 0; index <= data.length - 1; index++) {

                    obj = data[index];

                    checkInOuts.push({
                        userId: obj.get("facebookId"),
                        status: obj.get("status"),
                        createdAt: obj.createdAt
                    });
                }
            }


        }, function (error) {
            deferred.resolve(error.message);
        }).then(function () {

            deferred.resolve(checkInOuts);
        });

        return deferred.promise;
    }


    var save = function (model) {

        ////        var deferred = $q.defer();

        ////        ParseService.Insert("Images", model).then(function (response) {
        ////            deferred.resolve(response);
        ////        }, function (error) {
        ////            deferred.resolve(error.message);
        ////        });

        ////        return deferred.promise;
    }

    return {
        GetAllByUserId: getAllByUserId,
        GetAllByJobId: getAllByJobId,
        Save: save
    }
});
