angular.module("parse", []).factory('ParseService', function ($q) {

    function AddConstratints(query, parameters) {

        if (parameters != null) {

            for (var i = 0; i <= parameters.length - 1; i++) {
                switch (parameters[i].constraint) {

                    case "equalTo":
                        query.equalTo(parameters[i].key, parameters[i].value);
                        break;

                    case "notEqualTo":
                        query.notEqualTo(parameters[i].key, parameters[i].value);
                        break;

                    case "containedIn":
                        query.containedIn(parameters[i].key, parameters[i].value);
                        break;

                     case "lessThanOrEqualTo":
                        query.lessThanOrEqualTo(parameters[i].key, parameters[i].value);
                        break;

                    case "greaterThanOrEqualTo":
                        query.greaterThanOrEqualTo(parameters[i].key, parameters[i].value);
                        break;

                    case "sortableType":
                        if (parameters[i].order = "asc") {
                            query.ascending(parameters[i].key);
                        }
                        else {
                            query.descending(parameters[i].key);
                        }
                        break;

                    case "doesNotExist":
                        query.doesNotExist(parameters[i].key);
                        break;

                    case "exists":
                        query.exists(parameters[i].key);
                        break;

                    default:
                }
            }
        }
    }

    var get = function (tableName, parameters) {
        var deferred = $q.defer();
        var model = Parse.Object.extend(tableName);
        var query = new Parse.Query(model);

        AddConstratints(query, parameters);

        query.first().then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.kill(); ///still need to find the reason
        });

        return deferred.promise;
    };

    var getAll = function (tableName, parameters) {
        var deferred = $q.defer();
        var model = Parse.Object.extend(tableName);
        var query = new Parse.Query(model);

        AddConstratints(query, parameters);

        query.find().then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.kill(); ///still need to find the reason
        });

        return deferred.promise;
    };



    var getAllWithOR = function (tableName, parameter1, parameter2) {
        var deferred = $q.defer();

        var model = Parse.Object.extend(tableName);

        var query = new Parse.Query(model);
        AddConstratints(query, parameter1);

        var query1 = new Parse.Query(model);
        AddConstratints(query1, parameter2);

        var mainQuery = Parse.Query.or(query, query1);
        mainQuery.find().then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.kill(); ///still need to find the reason
        });

        return deferred.promise;
    };

    var insert = function (tableName, model) {
        var deferred = $q.defer();
        var Obj = Parse.Object.extend(tableName);
        var obj = new Obj();

        obj.save(model).then(function (response) {         // The object was saved successfully.
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }



    //    var insert = function (tableName,relationTable, model, relationTable) {
    //        var deferred = $q.defer();
    //        var Obj = Parse.Object.extend(tableName);
    //        var obj = new Obj();

    //        obj.save(model).then(function (response) {         // The object was saved successfully.
    //            deferred.resolve(response);
    //        }, function (error) {
    //            deferred.resolve(error.message);
    //        });

    //        return deferred.promise;
    //    }


    return {
        GetAll: getAll,
        GetAllWithOR: getAllWithOR,
        Get: get,
        Insert: insert,
        Update: insert
    };
});