$(document).ready(function () {

    angular.module('um_ExportTimesheetController', ["ngSanitize", "ngCsv", "um_ExportTimesheetService"]).controller("exportTimesheetController", function ($scope, $routeParams, ExportTimesheetService) {

		

        $scope.PopulateData = function () {
            
            $scope.SetBreadCrumb("Export Timesheet");   
            $scope.days=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
            $scope.years=[2015,2016,2017,2018,2019,2020,2021];
        }
        
		$scope.export=function () {

            var model= {
	            jobId: $routeParams.jobId,
	            start: new Date($scope.start.year, $scope.start.month, $scope.start.day, 0,0,0),
	            end: new Date($scope.end.year, $scope.end.month, $scope.end.day, 0,0,0)
	        };

			ExportTimesheetService.GetTimesheet(model).then(function (data) {
				
				$scope.timesheets=[];
				var duration;

				if(angular.isObject(data) && data.length > 0)
				{
					for (var index = 0; index <= data.length-1; index++) {
						
						duration=data[index]["value"]["duration"];
						
						if(angular.isDefined(duration))
						{
							$scope.timesheets.push({
								CoCode:"",
								BatchID:"",							
								userId: data[index].userId,
		                        duration: duration,
		                        OTHours:"",
		                        HoursCode:"",
		                        HoursAmount:"",
		                        MemoCode:"",
		                        MemoAmount:"",
		                        rate:$routeParams.price
							});
						}
					};
				}
			
			});
		} 

		// header of the csv file 
		$scope.getHeader = function () { 
			return ["CoCode","Batch ID","File Number", "Regular Hours","O/T Hours","Hours 3 Code","Hours 3 Amount","Memo Code","Memo Amount","Temp Rate"]
		};
    });
});


 