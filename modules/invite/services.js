
angular.module("um_InviteService", ['db_Emails2sendService']).factory("InviteService", function ($q, dbEmails2sendService) {

    var save = function (candidates, model) {

        var content = model.content;
        var deferred = $q.defer();

        for (var index = 0; index <= candidates.length - 1; index++) {

            var model = {
                subject: model.subject,
                contentToSend: content,
                receiverEmailAddress: candidates[index].email
            }

            dbEmails2sendService.Save(model).then(function (response) {
                deferred.resolve(response);
            });

        }

        return deferred.promise;
    }

    return {
        Save: save
    }
});
