
$(document).ready(function () {
    angular.module('um_InviteController', ['um_InviteService', 'um_UserService', 'um_StatusService', 'um_SettingService', 'um_SessionService','um_GoogleMapService', 'um_CandidateService'])
           .controller("inviteController", function ($scope, $routeParams, InviteService, UserService, StatusService, SettingService, SessionService, GoogleMapService, CandidateService) {

                $scope.radius           = '';
                $scope.zipcode          = '';
                $scope.candidates       = []; /* it will take hold of all the candidates and will refresh on page reload only */
                $scope.filterByLicense  = -1; /* it will be used to take care of the filtration process */

               $scope.PopulateData = function () {

                   $scope.SetBreadCrumb("Invite Candidate");

                   SettingService.GetSeekerAPIURL().then(function (response) {

                       $scope.invite = {
                           subject: "Invitation to apply for a job",
                           content: "You are invited to apply for a job - " + response.SeekerAPIURL + "?taskId="+$routeParams.jobId
                       };
                   });


                   

                   UserService.GetAllUsers(SessionService.User.id).then(function (data) {
                       if (angular.isObject(data)) {
                       
                           $scope.selected           = {};
                           $scope.candidates         = data;
                           $scope.filteredCandidates = data;
                           $scope.IsCandidateFound   = data.length == 0;
                       
                       }
                       else {

                           $scope.ShowMessage(data);
                       }

                   });
               }


               /**
                * function to filter candidates on the basis of License 
                * @param  INT dl driver license e.g.=> 1,0
                * @return RESPONSE updates filtered candidates list
                * @dev: Baljeet
                *
                */
               $scope.filterCandidatesByLicense = function(dl){
                    if(dl == 1 || dl == 0) { /* Search for the candidates with license */
                    UserService.FilterByDriverLicense(SessionService.User.id, dl).then(function (data) {
                       if (angular.isObject(data)) {
                       
                           $scope.selected           = {};
                           $scope.filteredCandidates = data;
                           $scope.IsCandidateFound   = data.length == 0;
                       
                       }
                       else {

                           $scope.ShowMessage(data);
                       }

                    });

                    } else if(dl == -1) { /* Show all the candidates*/

                        $scope.filteredCandidates = $scope.candidates;

                    }

               }


               $scope.SendInvite = function () {
                   if (angular.isDefined($scope.invite.subject) && angular.isDefined($scope.invite.content)) {

                       var selectedCandidates = $.grep($scope.candidates, function (record) {
                           return $scope.selected[record.email];
                       });
                       
                       if (selectedCandidates.length > 0) {

                           InviteService.Save(selectedCandidates, $scope.invite).then(function (response) {
                               $scope.ShowMessage("Invitation has been sent");
                           });
                       }
                       else {
                           $scope.ShowMessage("Please, select the candidate");
                       }
                   }
                   else {
                       $scope.ShowMessage("Please, specify the subject/content");
                   }
               }

                /**
                 * function to handle filtering of zip-code and radius
                 * @param STRING zipcode
                 * @param INT radius in miles
                 * @return Response
                 * @dev: Baljeet
                 *
                 */
                $scope.filterCandidatesByZipcodeAndRadius = function(zipcode, radius) {
                
                    /*GoogleMapService.GetZipCode({'latitude': '40.7060', 'longitude': '-74.0086'}).then(function (response) {
                        console.log(response);
                    });
                    */
/*                    GoogleMapService.GetLatLng('10005').then(function (response) {
                        console.log(response);
                    });
                    return false;
*/
                    $scope.filteredCandidates = [];
                    var zipLatLong = {};
                    GoogleMapService.GetLatLng(zipcode).then(function (response) {
                    
                        zipLatLong = response;

                        /* Compare each candidate's location to check whether he lies in given radius of the given zipcode */
                        angular.forEach($scope.candidates, function(value, key) {
                                                
                            /* Check only those user who has geoCode in DB for this filter*/
                            if( angular.isDefined(value.geoCode) && angular.isObject(value.geoCode) ) {

 
                                GoogleMapService.FindDistanceInTwoGeocodes({'latitude':zipLatLong.lat, 'longitude':zipLatLong.lng}, value.geoCode).then(function(response){
   
                                    if(response.distance!=null){

                                        /* Final distance in miles to compare with the radius */
                                        var distanceInMiles = response.distance;
                                        
                                        if(distanceInMiles <= radius){

                                            $scope.filteredCandidates.push(value);
                                        
                                        }

                                    } 

                                });
                            }

                        });

                    });
                
                }

            /**
             * Function: to filter out candidates who were originally added by current user and who has applied to any of current user's jobs
             * @return OBJECT filtered candidates list
             * @dev: Baljeet
             * 
             */
            $scope.filterByMyCandidates = function() {

                var posterEmail = SessionService.User.email;

                CandidateService.GetAllInterestedCandidates(posterEmail, StatusService.JobSeekerInterested).then(function (data) {

                    $scope.filteredCandidates = data;
                });        
           
            }
           });
});
