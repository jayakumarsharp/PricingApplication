ReportApp.factory('EstimationSDLCService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationSelfSDLCFactory = {};

    EstimationSelfSDLCFactory.GetAllEstimationSDLC = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationSDLC/GetAllEstimationSDLC');
        return result;
    }
    
    EstimationSelfSDLCFactory.AddEstimationSDLC = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationSDLC/AddEstimationSDLC', currencysheet);
    }

    EstimationSelfSDLCFactory.GetAllOpportunityEstimationSDLCPercentage = function (oppid) {
        return $http.get(EstimateServiceURI + 'EstimationSDLC/GetAllOpportunityEstimationSDLCPercentage?OppID='+oppid);
    }
    
    EstimationSelfSDLCFactory.AddOppEstimationSDLCPercentage = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationSDLC/AddOppEstimationSDLCPercentage', currencysheet);
    }

    return EstimationSelfSDLCFactory;
});
