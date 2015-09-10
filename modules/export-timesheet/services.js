
angular.module("um_ExportTimesheetService", ['db_CheckInOutService']).factory("ExportTimesheetService", function ($q, dbCheckInOutService) {

      var getTimesheet = function (model) {

        var deferred = $q.defer();

		var timesheets=[];

		dbCheckInOutService.GetAllByJobId(model).then(function (data) {
			
			if (data.length > 0)
			{	

				var obj;
	 
				for (var index = 0; index <= data.length-1; index++) {
					 
					  obj = data[index];

					 var existingTimeSheet = GetObject(timesheets,"userId",obj.userId);

					 if(existingTimeSheet==null)
					 {
				  	    timesheets.push({
			                 userId: data[index].userId,
			                 value:{
										status: data[index].status, 
							   			createdAt: data[index].createdAt
			               		   }
			                 
		                });
					 }
					 else
					 {
					 		
						var duration=timesheets[existingTimeSheet.index]["value"]["duration"];

						if(data[index].status=="out")
						{
							var calculateTime = TimeDiff(existingTimeSheet.obj.value.createdAt, data[index].createdAt);

							if(duration!=null)
							{
								duration=calculateTime+duration;
							}
							else
							{
								duration=calculateTime;
							}
						}
						
					 	timesheets[existingTimeSheet.index]["value"]={
								
								status: data[index].status,
							   	duration: duration,
							   	createdAt: data[index].createdAt
					 		};
					 }	
				}
			}

		}).then(function () {
			deferred.resolve(timesheets);
		});

        return deferred.promise;
    }

	var TimeDiff=function (start, end) {

		 	// var difference = start.getTime() - end.getTime();
		 
		  //   var daysDifference = Math.floor(difference/1000/60/60/24);
		  //   difference -= daysDifference*1000*60*60*24
		 
		  //   var hoursDifference = Math.floor(difference/1000/60/60);
		  //   difference -= hoursDifference*1000*60*60
		 
		  //   var minutesDifference = Math.floor(difference/1000/60);
		  //   difference -= minutesDifference*1000*60
		 
		  //   var secondsDifference = Math.floor(difference/1000);
		 
		 	return Math.abs(end.getTime() - start.getTime())/1000/60/60;

	}

	var GetObject=function (list, key, value) {
		
		var retVal = null;

		for (var index = 0; index <= list.length-1; index++) {
			
			if(list[index][key]==value)
			{
               retVal={
						index:index,
		               	obj:list[index]
               		};
               break;
			}
		};

		return retVal;
	}

    return {
        GetTimesheet: getTimesheet
    }
});
