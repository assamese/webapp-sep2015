$(document).ready(function () {

    var esProntoApp = angular.module("esProntoApp");

    esProntoApp.filter('range', function () {
        return function (input, total) {
            total = parseInt(total);
            for (var i = 1; i <= total; i++)
                input.push(i);
            return input;
        };
    });

});   
    