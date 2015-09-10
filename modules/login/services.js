
angular.module("um_AuthService", []).factory("AuthService", function ($q) {

    var authenticate = function (emailId, password) {

        var deferred = $q.defer();

        Parse.User.logIn(emailId, password, {
            // If the username and password matches
            success: function (response) {
                deferred.resolve(response);
            },
            // If there is an error
            error: function (user, error) {
                deferred.resolve(error.message);
            }
        });

        return deferred.promise;
    }
     
    return {
        Authenticate: authenticate 
    }
});
