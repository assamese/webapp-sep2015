
angular.module("db_ImageService", ['parse']).factory("dbImageService", function ($q, ParseService) {

    var getAll = function (facebookId) {

        var deferred = $q.defer();

        var param = [{ key: "facebookId", value: facebookId, constraint: "equalTo"}];

        var images = [];

        ParseService.GetAll("Images", param).then(function (data) {

            if (data.length > 0) {

                var obj;
                var isTakenNow;
                var imageObj;
                var geoCodeObj;

                for (var index = 0; index <= data.length - 1; index++) {

                    obj = data[index];

                    isTakenNow = obj.get("isTakenNow");

                    imageObj = obj.get("image");
                    geoCodeObj = obj.get("location");

                    images.push({
                        id: obj.id,
                        caption: obj.get("caption"),
                        imageUrl: angular.isObject(imageObj) ? imageObj.url : "",
                        photoTakenType: isTakenNow ? "Camera" : "Gallery",
                        geoCode: geoCodeObj,
                        isLocation: isTakenNow ? angular.isObject(geoCodeObj) : "",
                        createdAt: obj.createdAt
                    });
                }
            }


        }, function (error) {
            deferred.resolve(error.message);
        }).then(function () {

            deferred.resolve(images);
        });

        return deferred.promise;
    }

    var save = function (model) {

        var deferred = $q.defer();

        ParseService.Insert("Images", model).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error.message);
        });

        return deferred.promise;
    }

    var getPhotoStreamByJobId = function(taskId, fb_emails_list){
        var deferred = $q.defer();

        var param = [
            { key: "facebookId", value: fb_emails_list, constraint: "containedIn"},
            { key: "tags", value: taskId, constraint: "equalTo"}
        ];

        var photos = [];
        var geoCodeObj;

        ParseService.GetAll("Images", param).then(function (data) {

            if (data.length > 0) {
               
                var obj;
                for (var index = 0; index <= data.length - 1; index++) {
                    obj = data[index];
                    geoCodeObj = obj.get("location");

                    photos.push({

                        image       : obj.get("image"),
                        caption     : obj.get("caption")?obj.get("caption"):'untitled',
                        geoCode     : geoCodeObj,
                        createdAt   : obj.createdAt,
                        facebookId  : obj.get("facebookId")
                    });
                }
            }
        }, function (error) {
            
            deferred.resolve(error.message);
        }).then(function () {

            deferred.resolve(photos);
        });

        return deferred.promise;
    }

    return {
        GetAll: getAll,
        Save: save,
        GetPhotoStreamByJobId : getPhotoStreamByJobId
    }
});
