angular.module("um_SettingService", ['db_ConfigService']).service("SettingService", function ($q, dbConfigService, $location) {


    this.GetParseKeys = function () {

        var harishCloneDB = {
            ApplicationId: "9NlrG1vB1QRiazYbE9js7V63kdTLlpPw0xo18kJR",
            JavascriptKey: "eZv7izm7VpO6BCdbqHoTerTGosML0RbsJkSpnN7Y",
            RestAPIKey: "cxfdcBAZEpDJBU7KaP3NYm3Ju3RwqeovUWGT8XvZ"
        }

        var esProntoNYC1DB = {
            ApplicationId: "nt8mfBmw7YZv8USl7BtGnQoOr1UJzkTDpx3KEZaT",
            JavascriptKey: "pX23JeWjUqF4IaGMp4bENArv8C3PjDIWUdOasBaw",
               RestAPIKey: "L9zSZtYfjyWCTrpw3HKljjldhAqgzXt9E8bd7lJH"
        }

        var esProntoNycLive = {
            ApplicationId: "oNOm5bYvUxDGR0DKf6JlhnG40x2crBB6N77n4JJy",
            JavascriptKey: "I7G7U1wp08ZQRGbw6qj7K81tmKkwdSnWea2425Jc",
            RestAPIKey: "JYmYBBxskCip7oKUsshA6TbGjItluGDRVmBmMZ2t"
        }

        var clone4baljeet = {
            ApplicationId: "9sFK9yTkl7ru4Bt1bSmDvFUEvTmoJq0DYXr6y6Dn",
            JavascriptKey: "QPXZnQHAo9QFqJrlL6amyqwgCXrvnzRhjy7H4iKj",
            RestAPIKey: "3xVgmb6CfROH4d3VTzYErAU4CG6WcY0VdpWNvUqH"
        }
        return esProntoNYC1DB;
        //return clone4baljeet;
       // return esProntoNycLive;
    };

    this.GetSeekerAPIURL = function () {
        var deferred = $q.defer();
        dbConfigService.Get().then(function (response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }

    this.GetPollJoy=function () {
        
        var polljoyURL='';

        if(window.location.hostname=="")
        {
            polljoyURL="espronto.globaltechnocrat.in";
        }
        else
        {
            polljoyURL= window.location.hostname;
        }
        
        polljoyURL = "http://" + polljoyURL;

        return {

          endPoint: polljoyURL + '/polljoy/connect.php',
          processingURL: polljoyURL + '/polljoy/index.html?',

        } 
    }
});





 
