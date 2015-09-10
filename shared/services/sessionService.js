
angular.module("um_SessionService", ['db_UserService']).factory("SessionService", function ($q, dbUserService) {

    var isAuthenticated = angular.isObject(Parse.User.current());

    var user = {};

    if (isAuthenticated) {

        var obj                  = Parse.User.current();
        user.id                  = obj.id;
        user.about               = obj.get("about");
        user.email               = obj.get("email");
        user.username            = obj.get("username");
        user.facebookId          = obj.get("facebookId");
    }

    return {
        IsAuthenticated: isAuthenticated,
        User: user
    }
});
