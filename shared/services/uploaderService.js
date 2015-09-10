angular.module("um_UploaderService", ['um_SettingService']).service("UploaderService", function (SettingService) {

    var parseKeys = SettingService.GetParseKeys();

    this.Uploader = function (files, success_callback, error_callback) {

        // Disable the update button
        var file = files[0];

        var serverUrl = 'https://api.parse.com/1/files/' + file.name;
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                request.setRequestHeader("X-Parse-Application-Id", parseKeys.ApplicationId);
                request.setRequestHeader("X-Parse-REST-API-Key", parseKeys.RestAPIKey);
                request.setRequestHeader("Content-Type", file.type);
            },
            url: serverUrl,
            data: file,
            processData: false,
            contentType: false,
            success: success_callback,
            error: error_callback
        });
    };
});





 