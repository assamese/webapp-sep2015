
angular.module("db_ChatService", ['parse']).factory("dbChatService", function ($q, ParseService) {

    var insert = function (model) {

        var deferred = $q.defer();
        ParseService.Insert("Chat", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }


    var getAll = function (chatRooms) {

        var deferred = $q.defer();
        var param = [{ key: "room", value: chatRooms, constraint: "containedIn" },
                     { key: "createdAt", order: "asc", constraint: "sortableType"}];

        ParseService.GetAll("Chat", param).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    return {
        Insert: insert,
        GetAll: getAll
    }
});
