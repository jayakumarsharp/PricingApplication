'use strict';
ReportApp.factory('ManualEstimationTypeService', function ($http) {
    var ManualEstimationTypeServiceURI = BaseURL;
    var ManualEstimationTypeServiceFactory = {};

    ManualEstimationTypeServiceFactory.GetAllManualEstimationType = function () {
        var result = $http.get(ManualEstimationTypeServiceURI + 'ManualEstimationType/GetAllManualEstimationType');
        return result;
    }

    ManualEstimationTypeServiceFactory.GetAllManualEstimationTypeById = function (ManualEstimationTypeId) {
        var result = $http.get(ManualEstimationTypeServiceURI + 'ManualEstimationType/GetAllManualEstimationType?ManualEstimationTypeId=' + ManualEstimationTypeId);
        return result;
    }
    ManualEstimationTypeServiceFactory.AddManualEstimationType = function (ManualEstimationType) {
        return $http.post(ManualEstimationTypeServiceURI + 'ManualEstimationType/AddManualEstimationType', ManualEstimationType);
    }

    ManualEstimationTypeServiceFactory.ModifyManualEstimationType = function (ManualEstimationType) {
        return $http.post(ManualEstimationTypeServiceURI + 'ManualEstimationType/ModifyManualEstimationType', ManualEstimationType);
    }

    ManualEstimationTypeServiceFactory.DeleteManualEstimationType = function (ManualEstimationType) {
        return $http.post(ManualEstimationTypeServiceURI + 'ManualEstimationType/DeleteManualEstimationType', ManualEstimationType);
    }

    return ManualEstimationTypeServiceFactory;
});

