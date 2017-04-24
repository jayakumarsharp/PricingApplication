'use strict';
ReportApp.factory('LocationService', function ($http) {
    var LocationServiceURI = BaseURL;
    var LocationServiceFactory = {};

    LocationServiceFactory.GetAllLocation = function () {
        var result = $http.get(LocationServiceURI + 'Location/GetLocationList');
        return result;
    }

    LocationServiceFactory.GetAllLocationById = function (Id) {
        var result = $http.get(LocationServiceURI + 'Location/GetLocationList?Id=' + Id);
        return result;
    }
    LocationServiceFactory.AddLocation = function (Location) {
        return $http.post(LocationServiceURI + 'Location/AddLocation', Location);
    }

    LocationServiceFactory.ModifyLocation = function (Location) {
        return $http.post(LocationServiceURI + 'Location/ModifyLocation', Location);
    }

    LocationServiceFactory.DeleteLocation = function (Location) {
        return $http.post(LocationServiceURI + 'Location/DeleteLocation', Location);
    }

    return LocationServiceFactory;
});
