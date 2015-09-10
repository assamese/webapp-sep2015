$(document).ready(function () {

    angular.module('um_ChatController', ['um_ChatService', 'um_UserService']).controller("chatController", function ($scope, $interval, $location, UserService, ChatService) {

        $scope.username = Parse.User.current().get("username");

        $scope.GetUsers = function () {

            $scope.SetBreadCrumb("Chat");

            var user = Parse.User.current();

            if (angular.isObject(user)) {
                UserService.GetFriends(user.get("email"), user.get("currentRegMode")).then(function (response) {
                    $scope.sender = user.get("username");
                    $scope.users = response;
                });
            }
            else {
                $location.path("Login");
            }
        }

        $scope.send = function () {

            $scope.username = Parse.User.current().get("username");

            var message = $("#txtmessage").val();
            if (angular.isDefined(message) && angular.isDefined($scope.chatroom) && angular.isDefined($scope.sender) && angular.isDefined($scope.receiver.username)) {
                ChatService.SendMessage($scope.chatroom, message, $scope.sender, $scope.receiver.username).then(function (chats) {
                    $("#txtmessage").val('');
                    $scope.chats = chats;
                    scrollDown();
                });
            }
            else {
                $scope.ShowMessage("Sorry, message is not send");
            }
        }

        $scope.chatInitilize = function (sender, receiver) {

            $scope.isChatConversationBoardShow = false;

            ChatService.GetChatRoomName(sender, receiver.username).then(function (chatroom) {

                $("#chatMessage").remove();

                $scope.isChatConversationBoardShow = true;
                $scope.chatroom = chatroom;
                $scope.receiver = receiver;

                // Get the conversation
                ChatService.GetMessages(sender, receiver.username).then(function (chats) {

                    $scope.chats = chats;
                    scrollDown();

                    // Refresh the conversation after 30 seconds
                    $interval(function () {
                        ChatService.GetMessages(sender, $scope.receiver.username).then(function (chats) {
                            $scope.chats = chats;
                            scrollDown();
                        });
                    }, 30000);
                });

            });
        }

        var scrollDown = function () {

            //            alert(("#sss div:last-child").offset().top);

            $("#divMessageBoardContainer").animate({
                scrollTop: 10000
            });
        }

    });
});   
    