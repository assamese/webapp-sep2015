
angular.module("um_BaAttributesService", ['db_BaAttributeService']).factory("BaAttributesService", function ($q, dbBaAttributeService) {

    var update = function (model) {

        var deferred = $q.defer();

        dbBaAttributeService.Save(model).then(function (response) {
            
            deferred.resolve(response);
        });

        return deferred.promise;
    }
    
    var getIdByFbId = function(facebookId){

        var deferred = $q.defer();
        
        dbBaAttributeService.GetIdByFbId(facebookId).then(function (response) {
            
            deferred.resolve(response);
        });
    
        return deferred.promise;
    }

    return {
        Update: update,
        GetIdByFbId : getIdByFbId
    }
});