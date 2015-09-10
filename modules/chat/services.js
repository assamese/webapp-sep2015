$(document).ready(function () {

    angular.module("um_ChatService", ['db_ChatRoomService', 'db_ChatService', 'db_UserService']).factory('ChatService', function ($q, dbChatRoomService, dbChatService, dbUserService) {

        function GetChatRoomCombination(sender, receiver) {
            var chatrooms = [];
            chatrooms.push(sender.concat("_", receiver));
            chatrooms.push(receiver.concat("_", sender));
            return chatrooms;
        }

        var getChatRoomName = function (sender, receiver) {
            var deferred = $q.defer();

            var tableName = "ChatRooms";
            var chatRooms = GetChatRoomCombination(sender, receiver);

            if (chatRooms.length == 2) {
                dbChatRoomService.Get(chatRooms).then(function (response) {
                    if (angular.isObject(response)) {
                        deferred.resolve(response.room);
                    }
                    else {
                        // If chatroom is not saved into the database then go to save it  
                        dbChatRoomService.Insert(chatRooms[0]).then(function (response) {         // The object was saved successfully.
                            if (angular.isObject(response)) {
                                deferred.resolve(chatRooms[0]);
                            }
                        }, function (error) {
                            // the save failed. 
                            deferred.resolve(error.message);
                        });
                    }
                });
            }

            return deferred.promise;
        };

        var getMessages = function (sender, receiver) {

            var deferred = $q.defer();
            var conversation = [];

            dbChatService.GetAll(GetChatRoomCombination(sender, receiver)).then(function (chats) {

                if (chats.length > 0) {
                    dbUserService.GetByUsername(receiver).then(function (receiver) {


                        var chat;

                        var sender_avtar = angular.isObject(Parse.User.current().get("profilePicture")) ? Parse.User.current().get("profilePicture").url : "";

                        var isSender = false;

                        for (var index = 0; index <= chats.length - 1; index++) {

                            chat = chats[index];
                            isSender = chat.get('userId') == sender;

                            conversation.push({
                                userId: chat.get("userId"),
                                message: chat.get("text"),
                                updatedAt: chat.updatedAt,
                                name: isSender ? "You" : receiver.name,
                                isSender: isSender,
                                avtar: isSender ? sender_avtar : receiver.avtar
                            });
                        }

                    }).then(function () {
                        deferred.resolve(conversation);
                    });

                }
                else {
                    deferred.resolve(chats);
                }
            });

            return deferred.promise;
        };

        var sendMessage = function (chatroom, message, sender, receiver) {

            var deferred = $q.defer();

            var model = {
                room: chatroom,
                text: message,
                userId: sender
            }

            dbChatService.Insert(model).then(function (response) {
                if (angular.isObject(response)) {
                    deferred.resolve(getMessages(sender, receiver));
                }
                else {
                    deferred.resolve(response);
                }
            });

            return deferred.promise;
        }

        return {
            GetChatRoomName: getChatRoomName,
            GetMessages: getMessages,
            SendMessage: sendMessage
        };
    });

});