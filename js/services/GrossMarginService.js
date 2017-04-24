'use strict';
ReportApp.factory('GrossMarginService', function ($http) {
    var GrossMarginServiceURI = BaseURL;
    var GrossMarginServiceFactory = {};

    GrossMarginServiceFactory.GetGrossmarginbyOppGroup = function (oppid, groupid) {
        var result = $http.get(GrossMarginServiceURI + 'GrossMargin/GetGrossmargintbyOppGroup?oppId=' + oppid + '&PaymentGroupId=' + groupid);
        return result;
    }


    GrossMarginServiceFactory.AddGrossMargin = function (GrossMargin) {
        return $http.post(GrossMarginServiceURI + 'GrossMargin/AddGrossmargin', GrossMargin);
    }

    GrossMarginServiceFactory.ExportToExcelSheet = function (data) {
        var result = $http.post(GrossMarginServiceURI + 'GrossMargin/ExportToExcelSheet', data);
        return result;
    }

    GrossMarginServiceFactory.GetOppConfigbyOppGroup = function (oppid, groupid) {
        var result = $http.get(GrossMarginServiceURI + 'OpportunityConfigurationPriceVersion/GetOppConfigtbyOppGroup?oppId=' + oppid + '&PaymentGroupId=' + groupid);
        return result;
    }


    GrossMarginServiceFactory.AddOppConfig = function (GrossMargin) {
        return $http.post(GrossMarginServiceURI + 'OpportunityConfigurationPriceVersion/AddOppConfig', GrossMargin);
    }


    return GrossMarginServiceFactory;
});