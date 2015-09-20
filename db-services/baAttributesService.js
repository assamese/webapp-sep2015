
angular.module("db_BaAttributeService", ['parse']).factory("dbBaAttributeService", function ($q, ParseService) {

    var save = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("BAattributes", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    var getIdByFbId = function(facebookId){

        var deferred = $q.defer();
        
        var param = [{key:'facebookId', value:facebookId, constraint:'equalTo'}];
        
        ParseService.Get('BAattributes',param).then(function(response){

            if(angular.isObject(response)){

                deferred.resolve({id:response.id});
            } else{
                
                deferred.resolve({id:''});
            }
        });

        return deferred.promise;
    }
    return {
        Save: save,
        GetIdByFbId : getIdByFbId
    }
});
