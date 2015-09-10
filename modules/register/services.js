
angular.module("um_RegisterService", ['parse','db_BaAttributeService']).factory("RegisterService", function ($q, ParseService, dbBaAttributeService) {

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

     var signUpViaSpreadsheet = function (model) {

        var deferred = $q.defer();

        var user = new Parse.User();
        user.set("name", model.name);
        user.set("email", model.email);
        user.set("facebookId", model.facebookId);
        user.set("username", model.username);
        user.set("password", model.password);
        user.set("currentRegMode", model.currentRegMode);
        user.set("phoneNumber", model.phoneNumber);
        user.set("address", model.address);
        user.set("sex", model.sex);
        user.set("links", model.links);
        user.set("ownVehicle", model.ownVehicle);
        user.set("vehicleType", model.vehicleType);
        user.set("languagesKnown", model.languagesKnown);
        user.set("skills", model.skills);
        user.set("driversLicense", model.driversLicense);
        user.set("height", model.height);
        user.set("addedBy", model.addedBy);

        user.signUp(null, {
            success: function (user) {
               dbBaAttributeService.Save({
                    "tshirtSize": model.tshirtSize,
                    "garageOrStorageSpaceForPackages": model.garageOrStorageSpaceForPackages,
                    "preferredShippingAddress": model.preferredShippingAddress,
                    "ownDigitalCamera": model.ownDigitalCamera,
                    "facebookId": model.facebookId
                }).then(function (response) {
                    deferred.resolve(response);
                });
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
        SignUpViaSpreadsheet: signUpViaSpreadsheet,
        AddNewCandidate : addNewCandidate
    }
});
