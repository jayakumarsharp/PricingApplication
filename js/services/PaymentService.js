'use strict';
ReportApp.factory('paymentService', function ($http) {
    var paymentServiceURI = BaseURL;
    var paymentServiceFactory = {};

    paymentServiceFactory.GetPaymentSheetbyOppGroup = function (oppid, groupid) {
        var result = $http.get(paymentServiceURI + 'Payment/GetPaymentSheetbyOppGroup?oppId=' + oppid + '&PaymentGroupId=' + groupid);
        return result;
    }


    paymentServiceFactory.AddPaymentSheet = function (Pricesheet) {
        return $http.post(paymentServiceURI + 'Payment/AddPaymentSheet', Pricesheet);
    }


    paymentServiceFactory.ExportToExcelSheet = function (oppid, groupid) {
        var json = { oppId: oppid, PaymentGroupId: groupid };
        var result = $http.post(paymentServiceURI + 'Payment/ExportToExcelSheet', json);
        return result;
    }

  paymentServiceFactory.GetPaymentPeriod = function () {
        var result = $http.get(paymentServiceURI + 'PaymentConfig/GetPaymentPeriod');
        return result;
    }


    return paymentServiceFactory;
});