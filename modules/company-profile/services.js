
angular.module("um_ProfileService", ['parse', 'db_ImageService']).factory("ProfileService", function ($q, ParseService, dbUserService, dbImageService) {

    var update = function (model, profilePicture) {

        var deferred = $q.defer();
        dbUserService.Update(model, profilePicture).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    var getCompanyInfo = function (id) {

        var deferred = $q.defer();
        dbUserService.Get(id).then(function (company) {
            deferred.resolve(company);
        });

        return deferred.promise;

    }

    var getUploadedPictures = function (facebookId) {

        var deferred = $q.defer();

        dbImageService.GetAll(facebookId).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    var uploadPicture = function (model) {

        var deferred = $q.defer();

        model.isTakenNow = false;

        if (angular.isObject(model.imageObj)) {
            model.image = { "name": model.imageObj.name, "url": model.imageObj.url, "__type": "File" };
        }

        model.location = new Parse.GeoPoint({ latitude: 0, longitude: 0 });

        dbImageService.Save(model).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }


    return {
        Update: update,
        GetCompanyInfo: getCompanyInfo,
        GetUploadedPictures: getUploadedPictures,
        UploadPicture: uploadPicture
    }
});
