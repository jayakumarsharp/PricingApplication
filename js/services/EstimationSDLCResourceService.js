ReportApp.factory('EstimationSDLCResourceService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationSelfSDLCFactoryResource = {};

    EstimationSelfSDLCFactoryResource.GetAllEstimationSDLCResource = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationSDLCResource/GetAllEstimationSDLCResource');
        return result;
    }

    EstimationSelfSDLCFactoryResource.GetAllEstimationSDLCResourcebyFilter = function (sbu, region, oem, infra, upgrade, app, complexity) {
        var result = $http.get(EstimateServiceURI + 'EstimationSDLCResource/GetAllEstimationSDLCResourcebyFilter?sbu=' + sbu + '&region=' + region + '&oem=' + oem + '&infra=' + infra + '&upgrade=' + upgrade + '&app=' + app + '&complexity=' + complexity);
        return result;
    }

    EstimationSelfSDLCFactoryResource.AddEstimationSDLCResource = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationSDLCResource/AddEstimationSDLCResource', currencysheet);
    }
    return EstimationSelfSDLCFactoryResource;
});
