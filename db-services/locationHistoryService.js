
angular.module("db_LocationHistoryService", ['parse']).factory("dbLocationHistoryService", function ($q, ParseService) {

    /**
     * Function: get candidate's tracking information for a specific period of time
     * @param STRING candidateId
     * @param STRING mintuesBefore(to enquire about past minutes result)
     * @return ARRAY Result-Set
     * @dev: Baljeet
     *
     */
    var getLocationHistory = function(candidateId, minutesBefore) {

        var deferred        = $q.defer();
            
        var utc             = new Date();
        utc                 = new Date( utc.setMinutes(utc.getMinutes() - parseInt(minutesBefore) ) );
        iso                 = utc.toISOString();

        var User            = Parse.Object.extend("User");
        var userquery       = new Parse.Query(User);

        userquery.equalTo("objectId", candidateId);
        
        userquery.first({
            success : function(userFound) {

                var locationHistory = Parse.Object.extend("locationHistory");
                var query           = new Parse.Query(locationHistory);

                query.greaterThan("createdAt",iso);
                query.equalTo("user",userFound);
        
                query.find({
                    success:function(result){
                        
                        deferred.resolve(result);
                        
                    }, 
                    error:function(error){
                        deferred.resolve(error.message);
                    
                    }
                });
                
            },
            error : function(error) {
        
                deferred.resolve(error.message);

            }
        });

        return deferred.promise;
    
    }

    return {
        GetLocationHistory: getLocationHistory
    }
});
