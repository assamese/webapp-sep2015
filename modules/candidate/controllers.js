$(document).ready(function () {

    angular.module('um_CandidateController', ['um_CandidateService', 'um_JobService', 'um_StatusService', 'um_SessionService', 'um_UserService', 'um_RegisterService', 'um_EngagementService', 'um_GoogleMapService', 'um_SettingService', 'um_InviteService', 'um_UploaderService', 'um_UtilService'])
    .controller("candidateController", function ($scope, $route, $timeout, $interval, $routeParams, CandidateService, JobService, StatusService, SessionService, UserService, RegisterService, EngagementService, GoogleMapService, SettingService, InviteService, UploaderService, UtilService, $modal, $http, $q) {


        $scope.PopulateData = function () {
            $scope.SetBreadCrumbForUploadViaSpreadsheet("Upload Via Spreadsheet");
        }

        $scope.ImportUserData = function (files) {

            UploaderService.Uploader(files, function (response) {

                if (angular.isObject(response)) {
                    var file = files[0];
                    $http.get(response.url).then(function (response) {

                        $scope.logs = [];

                        UtilService.CSVToArray(response.data).then(function (data) {

                            if (data.length > 0) {

                                $scope.isShowSummaryPanel = true;
                                ArrayToJson(data).then(function (jsonData) {
                                    for (var index = 0; index <= jsonData.length - 1; index++) {
                                        RegisterService.SignUpViaSpreadsheet(jsonData[index]).then(function (response) {
                                            if (!angular.isObject(response)) {
                                                $scope.logs.push({ "message": response });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                $scope.logs.push({ "message": "file is empty" });
                            }
                        });
                    });
                }
            });
        };

        var ArrayToJson = function (data) {
            var deferred = $q.defer();
            var retVal = [];
            for (var i = 1; i <= data.length - 1; i++) {

                if (data[i][0].length > 0) {
                    retVal.push({
                        "password": "espronto",
                        "currentRegMode": "S",
                        "facebookId": data[i][0],   ///data[row][col]
                        "username": data[i][0],
                        "email": data[i][0],
                        "name": data[i][1],
                        "sex": data[i][2],
                        "height": data[i][3],
                        "phoneNumber": data[i][4],
                        "address": data[i][5],
                        "ownVehicle": data[i][6],
                        "vehicleType": data[i][7],
                        "driversLicense": data[i][8],
                        "languagesKnown": data[i][9],
                        "skills": data[i][10],
                        "tshirtSize": data[i][11],
                        "garageOrStorageSpaceForPackages": data[i][12],
                        "preferredShippingAddress": data[i][13],
                        "ownDigitalCamera": data[i][14],
                        "addedBy": SessionService.User.email
                    });
                }
            }

            deferred.resolve(retVal);

            return deferred.promise;
        }











        $scope.GetInterestedCandidates = function () {

            $scope.SetBreadCrumb("Candidate Review");

            $scope.jobId = $routeParams.jobId;

            JobService.GetJobFromTaskNew($scope.jobId).then(function (job) {
                if (angular.isObject(job)) {
                    $scope.jobTitle = job.name;
                }
            }).then(function () {

                $scope.IsCandidateFound = false;

                CandidateService.GetCandidates($scope.jobId, StatusService.JobSeekerInterested).then(function (data) {
                    if (angular.isObject(data)) {
                        $scope.candidates = data;
                        $scope.IsCandidateFound = data.length == 0;
                    }
                    else {
                        $scope.ShowMessage(data);
                    }
                });
            });
        }

        /* All candidates page functions starting here */
        /** 
        * Function to render all candidates who has applied to any of my jobs
        * @render ARRAY candidates
        * @dev: Baljeet
        *
        */
        $scope.GetAllCandidates = function () {

            $scope.SetBreadCrumb("My Workforce");
            var posterEmail = SessionService.User.email;
            $scope.isCandidatesLoading = true;
            $scope.isZipcodeFilterActive = false;
            $scope.isDriversLicenseFilterActive = false;
            $scope.candidateFilterOptions = '-1';
            $scope.candidateFilterOptionsZipcode = "";
            $scope.candidateFilterOptionsZipcodeRadius = "";
            $scope.candidateFilterOptionsDriversLicense = "1";
            $scope.markedCandidates = [];
            $scope.preSelectedHireInvite = "2";
            $scope.jobIdFromRouteParams = $scope.jobId = $routeParams.jobId;
            if ($route.current.originalPath == "/Candidate/All/Mark-Hired/:jobId/") {

                $scope.preSelectedHireInvite = "1";
            }
            CandidateService.GetAllInterestedCandidates(posterEmail, StatusService.JobSeekerInterested).then(function (data) {

                $scope.isCandidatesLoading = false;

                $scope.candidates = data;
                $scope.filteredCandidates = data;
            });
            /**/
            JobService.GetOpenJobs(SessionService.User.id).then(function (jobs) {
                $scope.jobs = jobs;
                $scope.items = jobs;
            });

            $scope.open = function (size) {

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {

                        items: function () {
                            return $scope.items;
                        },
                        hireOrInvite: function () {
                            return $scope.preSelectedHireInvite;
                        },
                        jobIdFromRouteParams: function () {
                            if (angular.isDefined($scope.jobIdFromRouteParams)) {

                                return $scope.jobIdFromRouteParams;
                            } else {

                                return "-1";
                            }
                        }
                    }
                });

                /*this is when modal gets confirmed*/
                modalInstance.result.then(function (selectedItem) {

                    $scope.reqProcessed = false;
                    $scope.jobSelectedFromModal = selectedItem;

                    var markedCandidatesObjects = [];

                    angular.forEach($scope.markedCandidates, function (markedCandidate) {

                        angular.forEach($scope.candidates, function (candidate) {

                            if (markedCandidate == candidate.id) {

                                markedCandidatesObjects.push(candidate);
                            }
                        });
                    });

                    if ($scope.preSelectedHireInvite == "2") { //have to send invites.

                        SettingService.GetSeekerAPIURL().then(function (response) {
                            var msg = "You are invited to apply for a job - " + response.SeekerAPIURL
                        + "?taskId=" + $scope.jobSelectedFromModal
                        + " You will need to use the esPronto App to apply to the job. "
                        + "You can download the esPronto App from Google Play Store or Apple App Store.";
                            /* var msg = 'You are invited to apply for a job.'
                            +'<br>Click <a href='+response.SeekerAPIURL + '?taskId='+$scope.jobSelectedFromModal+'>here</a> to see the job details.'
                            +'<br>You will need to use the esPronto App to apply to the job. You can download the App from here -'
                            +'<br>'
                            +'<br><a href="https://play.google.com/store/apps/details?id=com.espronto&hl=en"> <img src="http://www.espronto.com/images/esPronto-download-android.png" width="170" height="58"></a>'
                            +'<br><a href="https://itunes.apple.com/us/app/espronto-app/id919732643?mt=8"><img src="http://www.espronto.com/images/esPronto-download-apple.png" width="203" height="60"></a>';*/

                            $scope.candidateInvite = {
                                subject: "Invitation to apply for a job",
                                //content: "You are invited to apply for a job - " + response.SeekerAPIURL + "?taskId="+$scope.jobSelectedFromModal
                                content: msg
                            };

                            /* start sending invites*/
                            if (angular.isDefined($scope.candidateInvite.subject) && angular.isDefined($scope.candidateInvite.content)) {

                                if (markedCandidatesObjects.length > 0) {

                                    InviteService.Save(markedCandidatesObjects, $scope.candidateInvite).then(function (response) {

                                        $scope.reqProcessed = true;
                                    });
                                } else {

                                    $scope.reqProcessed = false;
                                }
                            }
                        });


                    } else if ($scope.preSelectedHireInvite == "1") { //have to mark hired.

                        angular.forEach(markedCandidatesObjects, function (markedCandidateSingleObj) {

                            var model = {
                                posterId: SessionService.User.email,
                                seekerId: markedCandidateSingleObj.email,
                                taskId: $scope.jobSelectedFromModal,
                                status: StatusService.JobSeekerAccepted
                            };

                            EngagementService.Insert(model).then(function (response) { });
                        });
                        $scope.reqProcessed = true;

                    } else { //what could be done?

                    }
                    $timeout(function () {

                        $scope.reqProcessed = false;
                    }, 5000);
                }, function () {

                    //$log.info('Modal dismissed at: ' + new Date());
                });
            };

            /**/
        }

        /**
        * sub function used in all candidates page for mark candidates
        * @dev: Baljeet
        * 
        */
        $scope.toggleMarkAllCandidates = function () {

            if ($scope.markAllCheckbox) {

                angular.forEach($scope.filteredCandidates, function (candidate) {
                    $scope.markedCandidates.push(candidate.id);
                });
            } else {

                $scope.markedCandidates = [];
            }
            /*if($scope.markedCandidates.length){
                
            $scope.markedCandidates=[];
            } else{

            }*/
        }
        /**
        * sub function used in all candidates page for mark candidates
        * @dev: Baljeet
        * 
        */
        $scope.toggleMarkCandidate = function (candidate) {

            var foundInArray = false;

            if ($scope.markedCandidates.length) {

                angular.forEach($scope.markedCandidates, function (singlecandidate) {

                    if (angular.equals(candidate.id, singlecandidate)) {
                        foundInArray = true;
                        $scope.markedCandidates.splice($scope.markedCandidates.indexOf(singlecandidate), 1);
                    }
                });

                if (!foundInArray) {

                    $scope.markedCandidates.push(candidate.id);
                }
            } else {

                $scope.markedCandidates.push(candidate.id);
            }
        }

        /**
        * sub function used in all candidates page for showing filters(license/zipcode)
        * @dev: Baljeet
        *
        */
        $scope.activateCandidateFilter = function () {
            if ($scope.candidateFilterOptions == '1') {

                $scope.isZipcodeFilterActive = false;
                $scope.isDriversLicenseFilterActive = true;

            } else if ($scope.candidateFilterOptions == '2') {

                $scope.isDriversLicenseFilterActive = false;
                $scope.isZipcodeFilterActive = true;

            } else {
                $scope.isZipcodeFilterActive = false;
                $scope.isDriversLicenseFilterActive = false;
            }
        }
        /** 
        * sub function of all candidates pages to filter out candidates
        * @dev: Baljeet
        *
        */
        $scope.filterAllCandidates = function () {
            $scope.isCandidatesLoading = true;
            /*check which filter is active*/
            if ($scope.candidateFilterOptions == '1') { //drivers license

                var dl = $scope.candidateFilterOptionsDriversLicense;

                if (dl == 1 || dl == 0) { /* Search for the candidates with license */

                    filterCandidatesByDriverLicense($scope.candidateFilterOptionsDriversLicense);

                    /* it was filtering all candidates from db instead of my-candidates so obsolete
                    as the header says my work-force
                    UserService.FilterByDriverLicense(SessionService.User.id, dl).then(function (data) {
                    $scope.isCandidatesLoading = false;
                    
                    if (angular.isObject(data)) {
                       
                    $scope.filteredCandidates = data;
                    }
                    });*/
                } else { //any option is selected from the list

                    $scope.filteredCandidates = $scope.candidates;
                    $scope.isCandidatesLoading = false;
                }
            } else if ($scope.candidateFilterOptions == '2') { //zipcode

                if ($scope.candidateFilterOptionsZipcodeRadius != '' && $scope.candidateFilterOptionsZipcode != '') {

                    filterCandidatesByZipcodeAndRadius($scope.candidateFilterOptionsZipcode, $scope.candidateFilterOptionsZipcodeRadius);
                }
            } else { //what else?

            }
            $scope.isCandidatesLoading = false;
        }

        /**
        * this is a sub function under filterAllCandidates to handle filtering of drivers-license
        * @return Response
        * @dev: Baljeet
        *
        */
        function filterCandidatesByDriverLicense(dlYesOrNo) {

            $scope.filteredCandidates = [];
            angular.forEach($scope.candidates, function (candidate) {

                if (candidate.driversLicense == dlYesOrNo) {

                    $scope.filteredCandidates.push(candidate);
                }
            });
        }
        /**
        * this is a sub function under filterAllCandidates to handle filtering of zip-code and radius
        * @param STRING zipcode
        * @param INT radius in miles
        * @return Response
        * @dev: Baljeet
        *
        */
        function filterCandidatesByZipcodeAndRadius(zipcode, radius) {

            $scope.filteredCandidates = [];
            var zipLatLong = {};

            GoogleMapService.GetLatLng(zipcode).then(function (response) {

                zipLatLong = response;

                /* Compare each candidate's location to check whether he lies in given radius of the given zipcode */
                angular.forEach($scope.candidates, function (value, key) {

                    /* Check only those user who has geoCode in DB for this filter*/
                    if (angular.isDefined(value.geoCode) && angular.isObject(value.geoCode)) {

                        GoogleMapService.FindDistanceInTwoGeocodes({ 'latitude': zipLatLong.lat, 'longitude': zipLatLong.lng }, value.geoCode).then(function (response) {

                            if (response.distance != null) {

                                /* Final distance in miles to compare with the radius */
                                var distanceInMiles = response.distance;

                                if (distanceInMiles <= radius) {

                                    $scope.filteredCandidates.push(value);
                                }
                            }
                        });
                    }
                });
            });
        }
        /* All candidates page functions ends here */

        $scope.GetHiredCandidates = function () {

            $scope.SetBreadCrumb("Hired Candidates");
            $scope.IsCandidateFound = false;
            $scope.jobId = $routeParams.jobId;

            CandidateService.GetCandidates($routeParams.jobId, StatusService.JobSeekerHired).then(function (data) {

                if (angular.isObject(data)) {
                    $scope.candidates = data;
                    $scope.IsCandidateFound = data.length == 0;
                }
                else {
                    $scope.ShowMessage(data);
                }
            });
        }

        $scope.PopulateCandidateInfo = function () {


            $scope.yesNoOptions = [
                { value: 'Yes', text: 'Yes' },
                { value: 'No', text: 'No' }
            ];

            $scope.SetBreadCrumb("Profile");

            ActivateTab(true, false);

            if (angular.isDefined($routeParams.id)) {

                CandidateService.GetCandidateProfile($routeParams.id).then(function (data) {
                    if (angular.isObject(data)) {

                        $scope.candidate = data;
                        $scope.jobId = $routeParams.jobId;

                        if (angular.isDefined(data.driversLicense)) {

                            if (data.driversLicense == 1) {

                                $scope.candidate.driversLicense = 'Yes';
                            } else {

                                $scope.candidate.driversLicense = 'No';
                            }
                        }
                    }
                }).then(function () {
                    CandidateService.GetCandidateGallery($scope.candidate.facebookId).then(function (data) {
                        $scope.images = data;
                    });
                });
            }

        }

        $scope.ShowPhotoScreen = function () {
            ActivateTab(false, true);
        }

        $scope.ShowAboutScreen = function () {
            ActivateTab(true, false);
        }


        var ActivateTab = function (isShowAboutScreen, isShowPhotoscreen) {
            $scope.isShowPhotoscreen = isShowPhotoscreen;
            $scope.isShowAboutScreen = isShowAboutScreen;
        }

        $scope.updateUser = function (columnName, value, userEmail) {

            UserService.UpdateUserByColumnName(columnName, value, userEmail).then(function (response) {
                /*Column updated success*/
            });

        }

        /** 
        * Function to render form for adding new candidate from back-end
        * @param OBJECT newcandidate
        * @return OBJECT status
        * @dev: Baljeet
        *
        */
        $scope.AddNewCandidateInit = function () {

            $scope.SetBreadCrumb("Add New Candidate");
            $scope.newcandidate = {};
            $scope.newcandidate.name = '';
            $scope.newcandidate.email = '';
            $scope.newcandidate.password = 'espronto';
        }

        /** 
        * Function to render form for adding new candidate from back-end
        * @param OBJECT newcandidate
        * @return OBJECT status
        * @dev: Baljeet
        *
        */
        $scope.AddNewCandidate = function () {
            $scope.message = '';
            $scope.errormessage = '';
            $scope.IsButtonClick = true;

            if (angular.isDefined($scope.newcandidate) && $scope.newcandidate.name != '' && $scope.newcandidate.email != '' && $scope.newcandidate.password != '') {

                $scope.newcandidate.email = angular.lowercase($scope.newcandidate.email);
                var parent = SessionService.User.email;
                RegisterService.AddNewCandidate($scope.newcandidate, parent).then(function (response) {

                    $scope.IsButtonClick = false;

                    if (angular.isObject(response)) {

                        if (angular.isDefined(response.status) && response.status == 1) {

                            $scope.message = "User Added Successfully. A verification email has been sent to User's email address.";
                            $scope.newcandidate = {};
                            $scope.newcandidate.name = '';
                            $scope.newcandidate.email = '';
                            $scope.newcandidate.password = 'espronto';

                        } else {

                            if (angular.isDefined(response.message)) {

                                $scope.errormessage = response.message;

                            } else {

                                $scope.errormessage = "Something gone wrong please contact support";
                            }
                        }

                    }
                    else {

                        $scope.message = response;

                    }

                });

            }
            else {
                $scope.errormessage = "All fields are mandatory";
                $scope.IsButtonClick = false;
            }

        }

        /**
        * function: initialze tracking process
        * @return response
        * @dev Baljeet
        *
        */
        var tracker; //needs to initialise global to access outside the function to stop tracking when route changes
        $scope.InitTrackCandidate = function () {

            $scope.SetBreadCrumb("Track Candidate");
            $scope.jobId = $routeParams.jobId;
            $scope.candidateId = $routeParams.candidateId;
            $scope.candidateBeingTracked = {};
            CandidateService.GetCandidateProfile($scope.candidateId).then(function (result) {

                $scope.candidateBeingTracked = result;
            });

            $scope.InsertIntoEngagement();

            $scope.TrackCandidate();
            tracker = $interval(function () {

                $scope.TrackCandidate();
            }, 60000);

        }
        /*to stop tracker when route changed*/
        $scope.$on('$routeChangeStart', function (next, current) {

            $interval.cancel(tracker);
        });
        /**
        * function used bt InitTrackCandidate as a part of track process.
        * return response
        * @dev Bajeet
        *
        */
        $scope.InsertIntoEngagement = function () {

            /* Step 1: to add  a new row  in engagement table that will ask seeker's permission tp get his position on map */
            CandidateService.GetCandidateProfile($scope.candidateId).then(function (data) {

                if (angular.isDefined(data.email)) {

                    var tmpObj = {};
                    tmpObj.taskId = $routeParams.jobId;
                    tmpObj.posterId = SessionService.User.email;
                    tmpObj.seekerId = data.email;
                    tmpObj.status = StatusService.JobPosterWantsToTrackJobSeeker;

                    EngagementService.Insert(tmpObj).then(function (response) { });

                } else {

                    console.log('Error geting seeker info');
                }

            });

        }
        /**
        * Function: used to track hired candidate's geolocation 
        * @param STRING candidateId from route parameter 
        * @return response and render map
        * @dev Baljeet
        *
        */
        $scope.TrackCandidate = function () {

            $scope.markers = [];
            $scope.map_zoom = 5;

            $scope.isMarkerDataLoading = true;
            $scope.isMarkerDataAvailable = true;


            /* Step 2: to fetch the geo-points from location history and render them in a map */
            CandidateService.GetLocationHistory($scope.candidateId, '30').then(function (result) {

                $scope.isMarkerDataLoading = false;

                if (result.length) {

                    $scope.map_zoom = 12;

                    angular.forEach(result, function (value, key) {

                        if (angular.isDefined(value.get('location'))) {

                            var temp = {};
                            temp.lat = value.get('location').latitude;
                            temp.long = value.get('location').longitude;

                            if (temp.lat != 0 && temp.lat != '' && temp.long != 0 && temp.long != '') {
                                $scope.markers.push(temp);

                            }
                        }
                    });

                    if (!$scope.markers.length) {

                        $scope.isMarkerDataAvailable = false;

                    }
                    $scope.circle = {

                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: 'red',
                        fillOpacity: .8,
                        scale: 4.5,
                        strokeColor: 'black',
                        strokeWeight: .7

                    };

                } else {

                    $scope.isMarkerDataAvailable = false;

                }

            });
        }
        /**
        * Function: used to initialise mark hired screen
        * @param STRING candidateId from routeparams
        * @return Response in view
        * @dev Baljeet
        *
        */
        $scope.MarkHiredInit = function () {

            $scope.SetBreadCrumb("Mark Candidate As Hired");
            $scope.areJobsLoading = true;
            $scope.loadingMsg = "Please wait a moment while we get the jobs.."
            $scope.candidateId = $routeParams.candidateId;
            $scope.taskId = "-1";
            $scope.noJobSelected = false;
            $scope.IsJobSavedSuccess = false;
            $scope.jobsError = false;


            JobService.GetOpenJobs(SessionService.User.id).then(function (jobs) {

                $scope.areJobsLoading = false;
                if (jobs.length) {

                    $scope.jobs = jobs;
                } else {

                    $scope.jobsError = true;
                    $scope.jobsErrorMsg = "No jobs Found, Please add some jobs and try again.";
                }
            });
        }
        /**
        * Function: basically serves the purpose to make an DB Entry 
        * followed by the function MarkHiredInit
        *
        */
        $scope.markCandidateAsHired = function () {

            if ($scope.taskId == "-1") {

                $scope.noJobSelected = true;

            } else {

                $scope.areJobsLoading = true;
                $scope.loadingMsg = "Please wait a moment while we save details.."
                $scope.noJobSelected = false;

                CandidateService.GetCandidateProfile($scope.candidateId).then(function (data) {

                    if (angular.isDefined(data.email)) {

                        var tmpObj = {};
                        tmpObj.taskId = $scope.taskId;
                        tmpObj.posterId = SessionService.User.email;
                        tmpObj.seekerId = data.email;
                        tmpObj.status = StatusService.JobSeekerHired;

                        EngagementService.Insert(tmpObj).then(function (response) {
                            $scope.areJobsLoading = false;
                            if (response) {

                                $scope.IsJobSavedSuccess = true;
                            } else {
                                $scope.jobsError = true;
                                $scope.jobsErrorMsg = "Internal Error Please Try Again By Refreshing The Page";

                                console.log('Internal Error Try Again Later');
                            }
                        });

                    } else {
                        $scope.jobsError = true;
                        $scope.jobsErrorMsg = "Internal Error Please Try Again By Refreshing The Page";

                        console.log('Error geting seeker info');
                    }

                });

            }
        }
        /*End of all functions*/
    });
});   
