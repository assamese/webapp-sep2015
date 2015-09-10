$(document).ready(function () {

    angular.module('um_ProfileController', ['um_ProfileService', 'um_UploaderService']).controller("profileController", function ($scope, ProfileService, UploaderService) {

        var profilePictureObj = null;

        $scope.PopulateCompanyInfo = function () {

            $scope.SetBreadCrumb("Company Profile");

            var id = Parse.User.current().id;

            if (angular.isDefined(id)) {

                var facebookId = null;

                ProfileService.GetCompanyInfo(id).then(function (data) {
                    $scope.company = data;
                    facebookId = data.facebookId;
                }).then(function () {
                    ProfileService.GetUploadedPictures(facebookId).then(function (data) {
                        $scope.pictures = data;
                    });
                });
            }
        }

        $scope.uploadCompanyLogo = function (files) {

            UploaderService.Uploader(files,

            function (response) {  //Success
                if (angular.isObject(response)) {
                    $scope.company.avtar = response.url;
                    profilePictureObj = response;
                }
            },
            function (data) {  // Error
                var obj = jQuery.parseJSON(data);
                $scope.ShowMessage(obj.error);
            });
        };

        $scope.uploadImageFile = function (files) {

            UploaderService.Uploader(files, function (response) {

                if (angular.isObject(response)) {
                    var file = files[0];
                    var image_caption = $("#txtCaption").val();

                    var model = {
                        caption: image_caption.length > 0 ? image_caption : file.name,
                        imageObj: response,
                        imageUrl: response.url,
                        facebookId: $("#hiddenFacebookId").val()
                    };

                    ProfileService.UploadPicture(model).then(function (data) {
                        if (angular.isObject(data)) {
                            $scope.pictures.push(model);
                            $("#txtCaption").val("");
                            $scope.ShowMessage("Picture has been uploaded");
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
        };

        $scope.UpdateProfile = function () {
            if (angular.isDefined($scope.company) || angular.isDefined(profilePictureObj)) {

                ProfileService.Update($scope.company, profilePictureObj).then(function (data) {
                    if (angular.isObject(data)) {
                        $scope.ShowMessage("Profile has been updated");
                    }
                    else {
                        $scope.ShowMessage(data);
                    }
                });
            }
            else {
                $scope.ShowMessage("All fields are mandatory");
            }
        }
    });
});   
    