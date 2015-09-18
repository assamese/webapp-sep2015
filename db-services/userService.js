
angular.module("db_UserService", ['parse', 'um_GoogleMapService', 'db_EngagementService']).factory("dbUserService", function ($q, ParseService, GoogleMapService, dbEngagementService) {

    var update = function (model, profilePicture) {

        var deferred = $q.defer();
        var user = new Parse.User();
        user.set("id", model.id);
        user.set("name", model.name);
        user.set("links", model.links);
        user.set("about", model.about);

        if (angular.isObject(profilePicture)) {
            user.set({ profilePicture: { "name": profilePicture.name, "url": profilePicture.url, "__type": "File"} });
        }

        user.save(null, {
            success: function (user) {
                deferred.resolve(user);
            },
            error: function (user, error) {
                deferred.resolve(error.message);
            }
        });

        return deferred.promise;
    }

    var get = function (id) {

        var deferred = $q.defer();
        var model;
        var geoCode;
        var user = Parse.Object.extend("User");
        var query = new Parse.Query(user);
        query.include('city');
        query.equalTo("objectId", id);
        query.first().then(function (response) {

            if (angular.isObject(response)) {
                deferred.resolve(FillUserObject(response));
            }

        }, function (err) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    var getAll = function (ids) {
        var deferred = $q.defer();
        var candidates = [];

        var param = [{ key: "objectId", value: ids, constraint: "containedIn"}];

        ParseService.GetAll("User", param).then(function (users) {
            if (users.length > 0) {
                for (var index = 0; index <= users.length - 1; index++) {
                    candidates.push(FillUserObject(users[index]));
                }
            }

            deferred.resolve(candidates);


        }, function (error) {
            // the save failed. 
            deferred.resolve(error.message);
        }).then(function () {

            //            for (var index = 0; index < candidates.length - 1; index++) {
            //                candidates[index].rating = GetRating("aquarianchd83@gmail.com").then(function (response) {
            //                    return response;
            //                });
            //            }


        });

        return deferred.promise;
    }

    var getAllUsers = function (excludeId) {

        var deferred = $q.defer();

        var candidates = [];

        var param = null;

        if (angular.isDefined(excludeId)) {
            param = [{ key: "objectId", value: excludeId, constraint: "notEqualTo"}]
        }
        
        param.push({ key: "currentRegMode", value: 'S', constraint: "equalTo"});
        ParseService.GetAll("User", param).then(function (users) {
            if (users.length > 0) {
                for (var index = 0; index <= users.length - 1; index++) {
                    candidates.push(FillUserObject(users[index]));
                }
            }

            deferred.resolve(candidates);

        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }


    var getByUsername = function (username) {

        var deferred = $q.defer();
        var model;
        var geoCode;
        var user = Parse.Object.extend("User");
        var query = new Parse.Query(user);
        query.include('city');
        query.equalTo("username", username);
        query.first().then(function (response) {

            if (angular.isObject(response)) {
                deferred.resolve(FillUserObject(response));
            }

        }, function (err) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }



    var getUsersByJobId = function (jobId, statusId) {

        var deferred = $q.defer();
        var seekerIds = [];

        var taskNew = Parse.Object.extend("TaskNew");
        var _task = new taskNew();
        _task.id = jobId;

        var status = Parse.Object.extend("Status");
        var _status = new status();
        _status.id = statusId;

        var model = Parse.Object.extend("EngagementNew");
        var query = new Parse.Query(model);
        query.include('User');
        query.equalTo("task", _task);
        query.equalTo("status", _status);
        query.find().then(function (candidates) {

            if (candidates.length > 0) {

                for (var index = 0; index <= candidates.length - 1; index++) {

                    var seeker = candidates[index].get("seeker")

                    if (angular.isDefined(seeker)) {
                        seekerIds.push(seeker.id);
                    }
                }
            }

        }, function (error) {
            deferred.resolve(error.message);
        }).then(function () {
            getAll(seekerIds).then(function (candidates) {
                deferred.resolve(candidates);
            }, function (error) {
                deferred.resolve(error.message);
            });
        });

        return deferred.promise;

    }



    var getFriends = function (username, currentRegMode) {
        var deferred = $q.defer();

        var param = [];
        var friends = [];

        if (currentRegMode == "V" || currentRegMode == "A") {

            param = [{ key: "email", value: username, constraint: "notEqualTo" },
                     { key: "name", constraint: "exists" },
                     { key: "name", order: "asc", constraint: "sortableType"}];

            ParseService.GetAll("User", param).then(function (users) {
                if (users.length > 0) {
                    for (var index = 0; index <= users.length - 1; index++) {
                        friends.push(FillUserObject(users[index]));
                    }
                }

                deferred.resolve(friends);

            }, function (error) {
                deferred.resolve(error.message);
            });
        }
        else {

            dbEngagementService.GetEngagements(username).then(function (engagements) {

                var emails = [];

                for (var index = 0; index <= engagements.length - 1; index++) {

                    var posterId = engagements[index].get("posterId");

                    var seekerId = engagements[index].get("seekerId");

                    if (posterId != username) {
                        emails.push(posterId);
                    }

                    if (seekerId != username) {
                        emails.push(seekerId);
                    }
                }

                if (emails.length > 0) {

                    param = [{ key: "email", value: emails, constraint: "containedIn" },
                             { key: "name", constraint: "exists" },
                             { key: "name", order: "asc", constraint: "sortableType"}];

                    ParseService.GetAll("User", param).then(function (users) {


                        if (users.length > 0) {
                            for (var index = 0; index <= users.length - 1; index++) {
                                friends.push(FillUserObject(users[index]));
                            }
                        }

                        deferred.resolve(friends);


                    }, function (error) {
                        deferred.resolve(error.message);
                    });
                }
            });
        }

        return deferred.promise;
    }
  
    /**
     * Function: fills user object with the details
     * @param obj raw server data
     * @return user filled object
     * @dev: Baljeet (modified by baljeet not developed)
     *
     */
    var FillUserObject = function (obj) {
        
        var city                = obj.get("city");
        var geoCode             = obj.get("geoCode");
        var ownVehicle          = obj.get("ownVehicle");
        var profilePicture      = obj.get("profilePicture");
        var driversLicense      = obj.get("driversLicense");
        var candidateResume     = obj.get("resume");
        var verifiedFacebookID  = obj.get("verifiedFacebookID");
        var showPublicEmployees = obj.get("showPublicEmployees");
        
        return {

            id                  : obj.id,
            name                : obj.get("name"),
            city                : angular.isDefined(city) ? obj.get("city").get("Name") : "",
            avtar               : angular.isObject(profilePicture) ? profilePicture.url : "http://tedxtalks.ted.com/decor/live/headshot.jpg",
            email               : obj.get("email"),
            about               : obj.get("about") ? obj.get("about") : '',
            links               : obj.get("links"),
            skills              : obj.get("skills"),
            resume              : angular.isObject(candidateResume) ? candidateResume.url : "javascript:alert('Candidate has not uploaded resume');",
            geoCode             : angular.isObject(geoCode) ? geoCode : "Unknown",
            username            : obj.get("username"),
            ownVehicle          : angular.isDefined(ownVehicle) ? ownVehicle == 1 ? "Yes" : "No" : "No",
            facebookId          : obj.get("facebookId"),
            phoneNumber         : obj.get("phoneNumber"),
            vehicleType         : obj.get("vehicleType"),
            languagesKnown      : obj.get("languagesKnown"),
            driversLicense      : angular.isDefined( driversLicense ) ? driversLicense : '' , 
            isResumeAttached    : angular.isObject( candidateResume ),
            verifiedFacebookID  : angular.isDefined( verifiedFacebookID ) ? verifiedFacebookID :'' ,
            showPublicEmployees : showPublicEmployees ? true :false ,
        };

    }

    /**
     * Function(outdated on 23-08-15 while redesigning): filter candidates by drivers license
     * @param Int excludeId Id of current user
     * @param String dl whether DL is yes or no
     * @return Obj of candidates list
     * @dev: baljeet 
     * 
     */
    var filterByDriverLicense = function (excludeId, dl) {

        var deferred = $q.defer();

        var candidates = [];

        var param = null;

        if (angular.isDefined(excludeId)) {
            param = [{ key: "objectId", value: excludeId, constraint: "notEqualTo"}]
        }

        if (angular.isDefined(excludeId)) {
            param.push({ key: "driversLicense", value: dl, constraint: "equalTo"});
        }
            param.push({ key: "currentRegMode", value: 'S', constraint: "equalTo"});

        ParseService.GetAll("User", param).then(function (users) {
            if (users.length > 0) {
                for (var index = 0; index <= users.length - 1; index++) {
                    candidates.push(FillUserObject(users[index]));
                }
            }

            deferred.resolve(candidates);

        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    /**
     * Function: to get my candidates whether they have applied to my jobs Or I have added them manually in DB
     * @oaram String posterEmail email of the parent who wants to get my candidates
     * @param String statusId that defines only fetch users with job-interested as status id from engagement service not all
     * @return Object list of candidates
     * @dev: Baljeet
     * !! function outdated due to the change in requirements updated function is just below !!
     *
     */
/*    var getAllInterestedUsers = function(posterEmail, statusId) {

        var deferred = $q.defer();
        var seekerIds = [];

        var status = Parse.Object.extend("Status");
        var _status = new status();
        _status.id = statusId;

        var model = Parse.Object.extend("EngagementNew");
        var query = new Parse.Query(model);
        query.include('User');
        query.equalTo("status", _status);

        // #1: fetch candidates from Engagement table to find who has applied till now to the jobs created current user
        query.find().then(function (candidates) {

            if (candidates.length > 0) {

                for (var index = 0; index <= candidates.length - 1; index++) {

                    var seeker = candidates[index].get("seeker")

                    if (angular.isDefined(seeker)) {
                        seekerIds.push(seeker.id);
                    }
                }
            }
        }, function (error) {
            deferred.resolve(error.message);
        }).then(function () {
            // #2: Fetch candidates from user attributes table also which are added by current user 
            // it was later updated to point to User table instead of userAttribute table of parse
            var usrAttributesTable = Parse.Object.extend("User");
            var usrAttributesQuery = new Parse.Query(usrAttributesTable);
            usrAttributesQuery.equalTo("addedBy", posterEmail);
            usrAttributesQuery.find().then(function(usersAddedByMe){
                var fbIds = [];
                usersAddedByMe.forEach(function(user){
                    fbIds.push(user.get("facebookId"));
                });
                // #3: fetch object ids of users by thier fbids    
                var userTable       = Parse.Object.extend('User');
                var userTableQuery  = new Parse.Query(userTable);
                userTableQuery.containedIn("facebookId", fbIds);
                userTableQuery.find().then(function(usersAddedByMe){
                    usersAddedByMe.forEach(function(user){
                        // #4: update seekers list by adding users from userAttributes table too
                        seekerIds.push(user.id);
                    
                    });
                        // #5: finally fetching all my candidates 
                        getAll(seekerIds).then(function (candidates) {

                            deferred.resolve(candidates);
                        }, function (error) {
                            deferred.resolve(error.message);
                        });
                });
            });
        });

        return deferred.promise;
    }
*/
    var getAllInterestedUsers = function(posterEmail, statusId) {
 
        var deferred = $q.defer();

        param = [
            {key:'addedBy',value:posterEmail,constraint:'equalTo'}
        ];

        var tmp = this;
        tmp.Get(Parse.User.current().id).then(function (currentUser) {
            console.log(currentUser);
            var candidates = [];
            
            ParseService.GetAll("User", param).then(function (users) {

                if (users.length > 0) {
                
                    for (var index = 0; index <= users.length - 1; index++) {
                
                        candidates.push(FillUserObject(users[index]));
                    }
                }
                if(currentUser.showPublicEmployees){

                    var model = Parse.Object.extend("User");
                    var query = new Parse.Query(model);
                    query.doesNotExist("addedBy");
                    query.equalTo("currentRegMode", "S");
               
                    query.find().then(function (response) {
    
                        if (response.length > 0) {
                
                            for (var index = 0; index <= response.length - 1; index++) {
                        
                                candidates.push(FillUserObject(response[index]));
                            }
                        }

                        deferred.resolve(candidates);
                    });
                } else{
                    
                    deferred.resolve(candidates);
                } 

            }, function (error) {

                deferred.resolve(error.message);
            });
        });      

        return deferred.promise;
    }
 
    /**
     * Function: to update single column in user's profile 
     * @param String columnName
     * @oaram String value
     * @param Sring userEmail
     * @return Response
     *
     */
    var updateUserByColumnName = function(columnName, value, userEmail) {
        
        var deferred        = $q.defer();
        var user            = {};
        user.email          = userEmail;
        user.columnName     = columnName;
        user.updatedValue   = value; 
        if(columnName == 'driversLicense' || columnName == 'ownVehicle' ){
            if(value =='Yes'){
                user.updatedValue = '1';
            } else{
                user.updatedValue = '0';
            }
        }
        Parse.Cloud.run("updateUserByColumnName",{user},{

            success : function(result) {

                deferred.resolve({'status':'1'});

            },
            error : function(error) {

                deferred.resolve(error);

            }
        });

        return deferred.promise;
    }

    var getUsersByFbId = function(fbIds){

        var deferred = $q.defer();
        var candidates = [];

        var param = [{ key: "facebookId", value: fbIds, constraint: "containedIn"}];

        ParseService.GetAll("User", param).then(function (users) {

            if (users.length > 0) {

                for (var index = 0; index <= users.length - 1; index++) {

                    candidates.push(FillUserObject(users[index]));
                }
            }

            deferred.resolve(candidates);
        }, function (error) {

            deferred.resolve(error.message);
        });        

        return deferred.promise;
    }
    return {
        Get: get,
        GetAll: getAll,
        GetAllUsers: getAllUsers,
        GetUsersByJobId: getUsersByJobId,
        GetFriends: getFriends,
        GetByUsername: getByUsername,
        Update: update,
        FilterByDriverLicense: filterByDriverLicense,
        GetAllInterestedUsers: getAllInterestedUsers,
        UpdateUserByColumnName: updateUserByColumnName,
        GetUsersByFbId: getUsersByFbId 
    }
});
