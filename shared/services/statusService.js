
angular.module("um_StatusService", ["parse"]).factory("StatusService", function ($q, ParseService) {

	var stat = {};
	
    return {
        JobSeekerInterested: stat.JobSeekerInterested,
        JobSeekerHired: stat.JobSeekerHired,
        JobSeekerAccepted:stat.JobSeekerAccepted ,
        JobPosterWantsToTrackJobSeeker: stat.JobPosterWantsToTrackJobSeeker,
        GetStatuses: function(){
			
			var tmp =['job-seeker-interested','job-seeker-hired', 'job-seeker-accepted', 'job-poster-wants-to-track-job-seeker'];
			var deferred = $q.defer();

	        ParseService.GetAll("Status", []).then(function (data) {
				
				angular.forEach(data, function(value, index){

				 	if(value.get('type')==tmp[0]){

				 		stat.JobSeekerInterested = value.id;
				 	} else if(value.get('type')==tmp[1]){

				 		stat.JobSeekerHired = value.id;
				 	} else if(value.get('type')==tmp[2]){

				 		stat.JobSeekerAccepted = value.id;
				 	} else if(value.get('type')==tmp[3]){

				 		stat.JobPosterWantsToTrackJobSeeker = value.id;
				 	}
				});
	            deferred.resolve(stat);
	        });
	        return deferred.promise;
		}
    }

/*    return {
        JobSeekerInterested: "Yi2cx1TZ8T",
        JobSeekerHired: "GIAyj1WEOb",
        JobSeekerAccepted: "F6TJED8455",
        JobPosterWantsToTrackJobSeeker: "mBWm9k1xvp",
        GetStatuses:getStatuses
    }
*/
});
