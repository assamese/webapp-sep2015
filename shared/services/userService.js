
angular.module("um_UserService", ['db_UserService']).factory("UserService", function ($q, dbUserService) {

    var get = function (id) {

        var deferred = $q.defer();

        dbUserService.Get(id).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    var getByUsername = function (username) {

        var deferred = $q.defer();

        dbUserService.GetByUsername(username).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    var getAll = function (ids) {
        
        var deferred = $q.defer();

        dbUserService.GetAll(ids).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    var getAllUsers = function (excludeId) {

        var deferred = $q.defer();

        dbUserService.GetAllUsers(excludeId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    var getUsersByJobId = function (jobId, statusId) {

        var deferred = $q.defer();

        dbUserService.GetUsersByJobId(jobId, statusId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    var update = function (model, profilePicture) {

        var deferred = $q.defer();

        dbUserService.Update(model, profilePicture).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    var getFriends = function (username, currentRegMode) {

        var deferred = $q.defer();

        dbUserService.GetFriends(username, currentRegMode).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }
    var filterByDriverLicense = function(excludeId, dl){
    
        var deferred = $q.defer();

        dbUserService.FilterByDriverLicense(excludeId, dl).then(function (response) {
   
            deferred.resolve(response);
   
        });

        return deferred.promise;
   
    }


    var updateUserByColumnName = function (columnName, value, userEmail) {

        var deferred = $q.defer();

        dbUserService.UpdateUserByColumnName(columnName, value, userEmail).then(function (response) {
            deferred.resolve(response);
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
        UpdateUserByColumnName: updateUserByColumnName
    }
});
