$(document).ready(function () {

    var eventControllers=  angular.module('um_SurveyController', ['um_SurveyService','um_SessionService', 'um_SettingService','um_CandidateService', 'um_StatusService', 'um_JobService'])
    .controller("surveyController", function ($scope, $routeParams, SurveyService, SessionService, SettingService, CandidateService, StatusService, JobService) {

       
        $scope.PopulateData = function (headingPrefix) {
            
            $scope.SetBreadCrumb(headingPrefix + " Survey");
            
            $scope.activeTab           = 0;
            $scope.surveyTypes         = ['a','c','r','s'];
            $scope.selectedSurveyType  = $scope.surveyTypes[1];
            $scope.availableSurveys    = [];
            $scope.preSelectedSurvey  = '';
            $scope.interestedCandidatesForCurrentJob = [];
            $scope.hiredCandidatesForCurrentJob = [];
            $scope.isCandidatesLoadingForCurrentJob =true;
            /*$scope.scheduleOrNot = "0";*/

            $scope.survey = { 
                facebookId : SessionService.User.facebookId,
                jobId: $routeParams.jobId,
                sendToWho: 'h'
            };

            /*first get statuses then do processing*/
            StatusService.GetStatuses().then(function(response){

                StatusService2 = response;

                JobService.GetJobFromTaskNewByTaskId($routeParams.jobId).then(function(response){
                    CandidateService.GetCandidates(response.id, StatusService2.JobSeekerInterested).then(function (data) {
                     
                        $scope.interestedCandidatesForCurrentJob = data;
                        CandidateService.GetCandidates(response.id, StatusService2.JobSeekerAccepted).then(function (data) {
                            $scope.hiredCandidatesForCurrentJob = data;
                            $scope.isCandidatesLoadingForCurrentJob =false;
                        });
                    });
                });
            });
            
            /*date picker options*/
            $scope.minDate = $scope.survey.date = new Date();
            $scope.open = function($event) {
                $scope.isDatePickerOpened = true;
            };
            $scope.format = 'MM/dd/yyyy';
            $scope.isDatePickerOpened = false;
            /*date picker options ends*/

            /*time picker options*/
            $scope.survey.time = new Date();
            $scope.hstep = 1;
            $scope.mstep = 5;
            $scope.ismeridian = true;
            /*time picker options ends*/
        }
        $scope.$watch("selectedSurveyType",function(){
            if($scope.selectedSurveyType){

                SurveyService.GetAvailableSurvey(SessionService.User.facebookId, $scope.selectedSurveyType).then(function (data) {
            
                    $scope.availableSurveys = data;
            
                    if(angular.isObject(data[0])){
            
                        $scope.survey.NameOfSurvey = data[0].NameOfSurvey;
                        $scope.survey.filename = data[0].Filename+'//*--*//0';
                    }
                });
            }
        });
        $scope.updateNameofSurveyOnReviewTab = function(name){

            $scope.survey.NameOfSurvey = name;
        }
        /*$scope.$watch("scheduleOrNot",function(newVal, oldVal){
        
            if(newVal==0){
        
               $scope.survey.time = $scope.survey.date = new Date();
            }
        });*/
        $scope.changeRecipients = function(val){
        
            $scope.survey.sendToWho = val;
        }
        $scope.nextTab = function(){
        
            $scope.activeTab= $scope.activeTab+1;
        }
        $scope.prevTab = function(){
        
            $scope.activeTab = $scope.activeTab-1;
        }
        $scope.selectSurveyType = function(index){
        
            $scope.selectedSurveyType = $scope.surveyTypes[index];
        }
        $scope.SendSurvey = function (isSendNow) {
        
            $scope.survey.filename   = $scope.survey.filename.split('//*--*//')[0];
            $scope.survey.surveyType = $scope.selectedSurveyType;
            var startDate= new Date($scope.survey.date.toDateString()+' '+$scope.survey.time.toTimeString());  
            
            if ( angular.isObject($scope.survey) && angular.isDate(startDate) ) {
                
                /*if( $scope.selectedSurveyType=='c'  || $scope.selectedSurveyType=='a' ){
                    startDate='';
                }
                console.info(startDate);*/
                if(angular.isDefined($scope.survey.filename))
                {

                    SurveyService.Save($scope.survey, startDate).then(function (response) {

                        if (angular.isObject(response)) {
                    
                            $scope.ShowMessage("Your request has been submitted");    
                        }
                        else {
                            $scope.ShowMessage(response);
                        }
                    });
                  }
                  else
                  {
                    $scope.ShowMessage("Please, select the survey");
                  }
            }
            else {
                $scope.ShowMessage("Please, specify the start date/time");
            }
        }
    });
});
