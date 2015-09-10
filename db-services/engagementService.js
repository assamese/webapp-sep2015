
angular.module("db_EngagementService", ['parse']).factory("dbEngagementService", function ($q, ParseService) {

    var insert = function (model) {

        var deferred = $q.defer();

        if (angular.isObject(model)) {

            var Obj = Parse.Object.extend("Engagement");
            var obj = new Obj();
            obj.set("posterId", model.posterId);
            obj.set("seekerId", model.seekerId);
            obj.set("taskId", model.taskId);

            if (angular.isObject(model)) {
                var Status = Parse.Object.extend("Status");
                var status = new Status();
                status.id = model.status;
                var relation = obj.relation("statustype");
                relation.add(status);
            }

            obj.save(function (response) {
                //                alert(response.id);
            }, function (error) {
                deferred.resolve(error.message);
            }).then(function () {
                deferred.resolve(true);
            });
        }

        return deferred.promise;
    }


    var getEngagements = function (name) {

        var deferred = $q.defer();

        var param1 = [{ key: "posterId", value: name, constraint: "equalTo"}];
        var param2 = [{ key: "seekerId", value: name, constraint: "equalTo"}];

        ParseService.GetAllWithOR("Engagement", param1, param2).then(function (response) {
            if (response.length > 0) {
                deferred.resolve(response);
            }
        }, function (error) {
            deferred.resolve(error.message);
        });


        return deferred.promise;
    }

    return {
        Insert: insert,
        GetEngagements: getEngagements
    }
});
