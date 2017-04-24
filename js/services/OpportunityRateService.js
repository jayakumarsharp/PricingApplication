ReportApp.factory('OpportunityRateService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var OpportunityRateFactory = {};

    OpportunityRateFactory.GetAllOPPORTUNITY_RATE = function () {
        var result = $http.get(EstimateServiceURI + 'OPPORTUNITY_RATE/GetAllOPPORTUNITY_RATE');
        return result;
    }
    
    OpportunityRateFactory.AddOPPORTUNITY_RATE = function (resultData) {
        return $http.post(EstimateServiceURI + 'OPPORTUNITY_RATE/AddOPPORTUNITY_RATE', resultData);
    }

    return OpportunityRateFactory;
});
