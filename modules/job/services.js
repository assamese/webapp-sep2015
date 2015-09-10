
angular.module("um_JobService", ['parse', 'db_TaskService', 'db_TaskNewService', 'um_GoogleMapService', 'db_ImageService'])
.factory("JobService", function ($q, ParseService, dbTaskService, dbTaskNewService, GoogleMapService, dbImageService) {

    var postJob = function (model) {

        var deferred = $q.defer();

        var point = '';

        GoogleMapService.GetLatLng(model.zipcode).then(function (response) {
            if(!angular.isObject(response)){

                alert("address not valid");            
                return false;
            }
            if (angular.isObject(response)) {
                point = new Parse.GeoPoint({ latitude: response.lat, longitude: response.lng });
                
                var start_hour   = model.start_time.getHours();
                var start_minute = model.start_time.getMinutes();
                var end_hour     = model.end_time.getHours();
                var end_minute   = model.end_time.getMinutes();

                var obj = {
                    id: model.id,
                    name: model.name,
                    price: parseInt(model.price),
                    expiryTime: new Date(model.year, model.month, model.day, start_hour, start_minute),
                    endTime: new Date(model.year, model.month, model.day, end_hour, end_minute),
                    facebookId: model.facebookId,
                    isApproved: model.isApproved,
                    geoCode: point
                };

                dbTaskService.Save(obj).then(function (response) {
                    deferred.resolve(response);
                });
            }
        });

        return deferred.promise;
    }


    var getOpenJobs = function (userId) {

        var deferred = $q.defer();

        dbTaskNewService.GetAll(userId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    var getJobFromTaskNew = function (id) {

        var deferred = $q.defer();

        dbTaskNewService.Get(id).then(function (model) {

            if (angular.isObject(model)) {

                GoogleMapService.GetZipCode(model.geoCode).then(function (response) {
                    if (angular.isObject(response)) {
                        model.zipcode = response.zipCode;
                    }
                }).then(function () {
                    deferred.resolve(model);
                });
            }
        });

        return deferred.promise;
    }

    var getJobFromTaskNewByTaskId = function (id) {

        var deferred = $q.defer();

        dbTaskNewService.GetByTaskId(id).then(function (model) {

            if (angular.isObject(model)) {

                GoogleMapService.GetZipCode(model.geoCode).then(function (response) {
                    if (angular.isObject(response)) {
                        model.zipcode = response.zipCode;
                    }
                }).then(function () {
                    deferred.resolve(model);
                });
            }
        });

        return deferred.promise;
    }

    var getJobFromTask = function (id) {

        var deferred = $q.defer();

        dbTaskService.Get(id).then(function (model) {

            if (angular.isObject(model)) {
                            
                GoogleMapService.GetZipCode(model.geoCode).then(function (response) {
                    if (angular.isObject(response)) {
                        model.zipcode = response.zipCode;
                    }
                }).then(function () {
                    deferred.resolve(model);
                });
            }
        });

        return deferred.promise;
    }

    var sendPush = function(jobId){

        var deferred = $q.defer();
        Parse.Cloud.run('sendPush',{'jobId':jobId},{
            success:function(result){
                deferred.resolve(result);
            },
            error:function(error){
               deferred.resolve(error);
            }
        });

        return deferred.promise;        
    }

    var getPhotoStreamByJobId = function(taskId, fb_emails_list){

        var deferred = $q.defer();

        dbImageService.GetPhotoStreamByJobId(taskId, fb_emails_list).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    return {
        PostJob: postJob,
        GetOpenJobs: getOpenJobs,
        GetJobFromTaskNew: getJobFromTaskNew,
        GetJobFromTask: getJobFromTask,
        SendPush: sendPush,
        GetJobFromTaskNewByTaskId:getJobFromTaskNewByTaskId,
        GetPhotoStreamByJobId: getPhotoStreamByJobId
    }
});
