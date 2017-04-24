'use strict';
ReportApp.factory('BillingConfigService', function ($http) {
    var BillingConfigServiceURI = BaseURL;
    var BillingConfigServiceFactory = {};

    BillingConfigServiceFactory.GetBillingConfig = function (year) {
        var result = $http.get(BillingConfigServiceURI + 'BillingConfig/GetBillingConfig?Year=' + year);
        return result;
    }
    BillingConfigServiceFactory.AddBillingConfig = function (BillingConfig) {
        return $http.post(BillingConfigServiceURI + 'BillingConfig/AddBillingConfig', BillingConfig);
    }

    return BillingConfigServiceFactory;
});

