
angular.module("um_GoogleMapService", []).factory("GoogleMapService", function ($q) {


    var getLatLng = function (address) {
        var deferred = $q.defer();
        if (angular.isDefined(address) && address.length > 0) {
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    deferred.resolve({
                        lat: lat,
                        lng: lng
                    });

                }
                else {
                    // Geocode was not successful for the following reason: 
                    deferred.resolve(status);
                }
            });
        }
        else {
            deferred.resolve({
                lat: 40.7356,
                lng: -73.9906
            });
        }

        return deferred.promise;
    }


    var getZipCode = function (geoCode) {

        var deferred = $q.defer();

        if (angular.isObject(geoCode)) {

            var address = geoCode.latitude + "," + geoCode.longitude;

            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    var zipCode = '';
                    for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {

                        var addresses = results[resultIndex].address_components;

                        for (var addressIndex = 0; addressIndex < addresses.length; addressIndex++) {

                            var types = addresses[addressIndex].types;

                            for (var typeIndex = 0; typeIndex < types.length; typeIndex++) {
                                if (types[typeIndex] == 'postal_code') {
                                    zipCode = addresses[addressIndex].long_name;
                                };
                            };
                        };
                    }

                    deferred.resolve({ zipCode: zipCode });

                }
                else {
                    // Geocode was not successful for the following reason: 
                    deferred.resolve(status);
                }
            });
        }

        return deferred.promise;
    }

    var findDistanceInTwoGeocodes = function(origin, destination) {
/*console.log('origin');
console.log(origin);*/
        var deferred        = $q.defer();
        var origin          = new google.maps.LatLng(origin.latitude, origin.longitude);
        var destination     = new google.maps.LatLng(destination.latitude, destination.longitude);
        var service         = new google.maps.DistanceMatrixService();

            service.getDistanceMatrix(
                {

                    origins       : [origin],
                    destinations  : [destination],
                    travelMode    : google.maps.TravelMode.DRIVING,
                    unitSystem    : google.maps.UnitSystem.IMPERIAL,
                    
                }, function(response, status){
                    /*console.log(response);*/
                        if (status == google.maps.DistanceMatrixStatus.OK) {

                                /*if distance calculated successfully*/
                                if(response.rows[0].elements[0].status=='OK'){

                                    deferred.resolve({ distance: Math.ceil( ( (response.rows[0].elements[0].distance.value) / 1000) /  1.609344 )  });
                                
                                } else {

                                    deferred.resolve({ distance: null });
                                }

                        } else {

                            deferred.resolve({ distance: null });
                        }
                }
            );
        
        return deferred.promise;

    }

    return {
        GetLatLng: getLatLng,
        GetZipCode: getZipCode,
        FindDistanceInTwoGeocodes:findDistanceInTwoGeocodes
    }
});
