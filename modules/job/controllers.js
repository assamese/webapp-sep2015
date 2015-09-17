$(document).ready(function () {

    angular.module('um_JobController', ['um_JobService', 'um_SessionService','um_CandidateService','um_StatusService',  'um_UploaderService', 'um_UserService']).controller("jobController", 
        function ($scope, $location, $routeParams, JobService, SessionService, CandidateService, StatusService, UploaderService, UserService) {

        $scope.SetJobInfoBreadcrumb = function () {
            $scope.SetBreadCrumb("Job Information");
        }


        $scope.PopulateData = function () {

            /*time picker options*/
            $scope.job = {};
            $scope.job.start_time = new Date();
            $scope.job.start_time.setHours(12,0,0,0);
            $scope.job.end_time = new Date();
            $scope.job.end_time.setHours(14,0,0,0);
            $scope.hstep = 1;
            $scope.mstep = 5;
            $scope.ismeridian = true;
            /*time picker options ends*/
            $scope.header = "Edit Job";
            $scope.button_text = "Submit";

            if (angular.isDefined($routeParams.id)) {
                JobService.GetJobFromTask($routeParams.id).then(function (response) {
                    if (angular.isObject(response)) {
                        $scope.job = response;
                    }
                    else {
                        $scope.ShowMessage(response);
                    }
                });
            }
            else {
                $scope.header = "Post a Job";
                $scope.button_text = "Post a Job";
            }

            $scope.SetBreadCrumb($scope.header);
        }

        $scope.PostJob = function () {
            
            if (angular.isObject($scope.job)) {

                if( angular.isDefined($scope.job.name) ){
                    
                    if($scope.job.name.length < 10){

                        alert("Job name must contain atleast 10 letters");
                        return false;    
                    }
                } else{
                
                    alert("Job name can not be blank");
                    return false;    
                }

                if(!angular.isDefined($scope.job.zipcode)){

                    alert('address can not be blank');
                    return false;
                }
                
                if(!angular.isDefined($scope.job.id))
                {
                    $scope.job.facebookId = SessionService.User.email;
                    $scope.job.isApproved = false;
                }              

                JobService.PostJob($scope.job).then(function (response) {
                    if (angular.isObject(response)) {
                        if (angular.isDefined($scope.job.id))
                            $scope.ShowMessage("Job has been updated successfully");
                        else
                            $location.path("Job/SavedNotification/" + response.id);
                    }
                    else {
                        if(response.indexOf('Invalid date:')>-1){
 
                            $scope.ShowMessage("Please enter date.");
                        } else{
                            
                        $scope.ShowMessage(response);
                        }
                    }
                });
            }
        }

        $scope.GetJobs = function () {
            
            /*first get statuses then do processing*/
            StatusService.GetStatuses().then(function(response){

                StatusService2 = response;

                $scope.SetBreadCrumb("Open Jobs");
                $scope.isJobsLoading = true;
                $scope.jobs = [];
                $scope.isFetchingPhotostream = true;
                $scope.photostream = [];
                $scope.interestedCandidatesForCurrentJob = [];
                $scope.hiredCandidatesForCurrentJob = [];
                $scope.sessionUser =  SessionService.User;
                JobService.GetOpenJobs(SessionService.User.id).then(function (jobs) {
                    $scope.isJobsLoading = false;
                    if(jobs.length){
                        $scope.jobs = jobs;
                        $scope.currentJob = jobs[0];
                    }
                });

                $scope.$watch("currentJob",function(newVal,oldVal){

                    if(angular.isObject($scope.currentJob)){
                        $scope.isCandidatesLoadingForCurrentJob =true;
                        $scope.isFetchingPhotostream = true;
                        CandidateService.GetCandidates($scope.currentJob.id, StatusService2.JobSeekerInterested).then(function (data) {
                                $scope.interestedCandidatesForCurrentJob = data;
                            CandidateService.GetCandidates($scope.currentJob.id, StatusService2.JobSeekerAccepted).then(function (data) {
                                $scope.hiredCandidatesForCurrentJob = data;
                                $scope.isCandidatesLoadingForCurrentJob =false;
                                /*fetch photostream when hired candidates are avialable*/
                                $scope.fetchPhotoStream();
                            });
                        });
                    }
                });

            });
        }
        /*to upload job related photos*/
        $scope.uploadJobPhoto = function(files){

            UploaderService.Uploader(files, function (response) {

                if (angular.isObject(response)) {
                    var file = files[0];

                    var model = {
                        caption: file.name,
                        imageObj: response,
                        imageUrl: response.url,
                        tags: $scope.currentJob.taskId,
                        facebookId: SessionService.User.facebookId,
                    };

                    JobService.UploadPicture(model).then(function (data) {
                        if (angular.isObject(data)) {

                            $scope.ShowMessage("Picture has been uploaded");
                            $scope.fetchPhotoStream();
                        }
                        else {
                            $scope.ShowMessage(data);
                        }
                    });
                }
            }, function (data) {
                var obj = jQuery.parseJSON(data);
                $scope.ShowMessage(obj.error);
            });
        }   

        $scope.fetchPhotoStream = function(){
            /* step 1 to get list of hired candidate emails + user's own */
            var fb_emails_list = [SessionService.User.facebookId];

            angular.forEach($scope.hiredCandidatesForCurrentJob, function(object, index ){

                fb_emails_list.push(object.facebookId);
            });
            
            JobService.GetPhotoStreamByJobId($scope.currentJob.taskId,fb_emails_list).then(function(response){

                UserService.GetUsersByFbId(fb_emails_list).then(function(candidates){
                    
                    angular.forEach(candidates,  function(candidate){
                        
                        angular.forEach(response, function(photo){

                            if(candidate.facebookId == photo.facebookId){

                                photo.ownerName = candidate.name;
                            }
                        });
                    });
                });
                $scope.isFetchingPhotostream = false;
                $scope.photostream = response;
            });
        }

        $scope.resetCurrentJob = function(job){
            $scope.currentJob = job;
        }

        $scope.JobSavedNotification = function () {
            $scope.SetBreadCrumb("Post a Job");
            if (angular.isDefined($routeParams.jobId)) {
                JobService.GetJobFromTask($routeParams.jobId).then(function (job) {
                    if (angular.isObject(job)) {
                        $scope.jobTitle = job.name;
                        $scope.jobId = $routeParams.jobId;
                    }
                });

            }
        }

        $scope.sendPush = function () {

            $scope.jobId            = $routeParams.jobId;
            $scope.response         = '';
            $scope.dataLoading      = true;
            $scope.failResponse     = false;
            $scope.successResponse  = false;

            if (angular.isDefined($routeParams.jobId)) {
                
                JobService.SendPush($routeParams.jobId).then(function (response) {
                    $scope.dataLoading  = false;
                    if(response=="Successfully pushed"){
                        $scope.successResponse  = true;
                    } else{
                        $scope.failResponse     = true;
                        $scope.response = response.message;
                    }
                });
            }
        
        }

    });
});   
    