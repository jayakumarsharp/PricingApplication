ReportApp.factory('ManualEstimationMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var ManualEstimationFactory = {};

    ManualEstimationFactory.GetAllManualEstimation = function () {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetAllManualEstimation');
        return result;
    }


    ManualEstimationFactory.AddManualEstimation = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'ManualEstimation/AddManualEstimation', currencysheet);
    }


    ManualEstimationFactory.GetAllManualEstimationbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetAllManualEstimationbyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    ManualEstimationFactory.GetManualEstimation = function (oppid) {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetManualEstimation?oppId=' + oppid);
        return result;
    }
    ManualEstimationFactory.GetManualEstimationMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetManualEstimationMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    ManualEstimationFactory.AddManualEstimation = function (ManualEstimation) {
        return $http.post(EstimateServiceURI + 'ManualEstimation/AddManualEstimation', ManualEstimation);
    }


    ManualEstimationFactory.AddManualEstimationNewVersion = function (ManualEstimation) {
        return $http.post(EstimateServiceURI + 'ManualEstimation/AddManualEstimationNewVersion', ManualEstimation);
    }

    ManualEstimationFactory.LocktheSheetByGroupid = function (ManualEstimation) {
        return $http.get(EstimateServiceURI + 'ManualEstimation/LocktheSheetByGroupid?OppId=' + ManualEstimation.OppId + '&GroupId=' + ManualEstimation.GroupId + '&username=' + ManualEstimation.username + '&LockedInApp=' + ManualEstimation.LockedInApp);
    }

    ManualEstimationFactory.IncreaseAdditionalTimeToSheet = function (ManualEstimation) {
        return $http.get(EstimateServiceURI + 'ManualEstimation/IncreaseAdditionalTimeToSheet?GroupId=' + ManualEstimation.GroupId + '&username=' + ManualEstimation.username + '&LockedInApp=' + ManualEstimation.LockedInApp);
    }

    ManualEstimationFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'ManualEstimation/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    ManualEstimationFactory.UpdateManualEstimation = function (ManualEstimation) {
        return $http.post(EstimateServiceURI + 'ManualEstimation/UpdateManualEstimation', ManualEstimation);
    }

    ManualEstimationFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    ManualEstimationFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetAllComponentType');
        return result;
    }

    ManualEstimationFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetAllPriceType');
        return result;
    }

    ManualEstimationFactory.GetMaximumGroupManualEstimationId = function () {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetMaximumGroupManualEstimationId');
        return result;
    }


    ManualEstimationFactory.GetAllLockedManualEstimation = function () {
        var result = $http.get(EstimateServiceURI + 'ManualEstimation/GetAllLockedManualEstimation');
        return result;
    }

    return ManualEstimationFactory;
});
