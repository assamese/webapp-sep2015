
angular.module("um_RegisterService", ['parse']).factory("RegisterService", function ($q, ParseService) {

    var signup = function (model) {

        var deferred = $q.defer();

        var user = new Parse.User();
        user.set("name", model.name);
        user.set("email", model.email);
        user.set("facebookId", model.email);
        user.set("username", model.email);
        user.set("password", model.password);
        user.set("currentRegMode", "P");

        user.signUp(null, {
            success: function (user) {
                deferred.resolve(user);
            },
            error: function (user, error) {
                deferred.resolve(error.message);
            }
        }); 

        return deferred.promise;
    }

    var addNewCandidate = function(newcandidate, parentEmail){

        var deferred = $q.defer();
        newcandidate.parentEmail = parentEmail;
        Parse.Cloud.run('createUserManually',{newcandidate},{
            success:function(result){
                    deferred.resolve({'status':'1'});
            },
            error:function(error){
               deferred.resolve(error);
            }
        });

        return deferred.promise;        
    }

    return {
        Signup          : signup,
        AddNewCandidate : addNewCandidate
    }
});
