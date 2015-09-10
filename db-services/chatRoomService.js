
angular.module("db_ChatRoomService", ['parse']).factory("dbChatRoomService", function ($q, ParseService) {

    var insert = function (roomName) {

        var deferred = $q.defer();

        ParseService.Insert("ChatRooms", { room: roomName }).then(function (response) {         // The object was saved successfully.
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }


    var get = function (chatRooms) {

        var deferred = $q.defer();

        var param = [{ key: "room", value: chatRooms, constraint: "containedIn"}];

        ParseService.Get("ChatRooms", param).then(function (response) {
            if (angular.isObject(response)) {
                deferred.resolve({
                    room: response.get("room")
                });
            }
            else {
                deferred.resolve(response);
            }
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    return {
        Insert: insert,
        Get: get
    }
});
