ReportApp.factory('EstimationEGainMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationEGainMasterFactory = {};

    EstimationEGainMasterFactory.GetAllEstimationEGainMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationEGainMaster/GetAllEstimationEGainMaster');
        return result;
    }

    
    EstimationEGainMasterFactory.AddEstimationEGainMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationEGainMaster/AddEstimationEGainMaster', currencysheet);
    }


    EstimationEGainMasterFactory.GetAllEstimationEGainbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationEGain/GetAllEstimationEGainbyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationEGainMasterFactory.GetEstimationEGainMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationEGain/GetEstimationEGainMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationEGainMasterFactory.AddEstimationEGain = function (EstimationEGain) {
        return $http.post(EstimateServiceURI + 'EstimationEGain/AddEstimationEGain', EstimationEGain);
    }

    
    EstimationEGainMasterFactory.AddEstimationEGainNewVersion = function (EstimationEGain) {
        return $http.post(EstimateServiceURI + 'EstimationEGain/AddEstimationEGainNewVersion', EstimationEGain);
    }

    EstimationEGainMasterFactory.LocktheSheetByGroupid = function (EstimationEGain) {
        return $http.get(EstimateServiceURI + 'EstimationEGain/LocktheSheetByGroupid?OppId=' + EstimationEGain.OppId + '&GroupId=' + EstimationEGain.GroupId + '&username=' + EstimationEGain.username + '&LockedInApp=' + EstimationEGain.LockedInApp);
    }

    EstimationEGainMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationEGain) {
        return $http.get(EstimateServiceURI + 'EstimationEGain/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationEGain.GroupId + '&username=' + EstimationEGain.username + '&LockedInApp=' + EstimationEGain.LockedInApp);
    }

    EstimationEGainMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationEGain/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationEGainMasterFactory.UpdateEstimationEGain = function (EstimationEGain) {
        return $http.post(EstimateServiceURI + 'EstimationEGain/UpdateEstimationEGain', EstimationEGain);
    }

    EstimationEGainMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationEGainMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationEGain/GetAllComponentType');
        return result;
    }

    EstimationEGainMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationEGain/GetAllPriceType');
        return result;
    }

    EstimationEGainMasterFactory.GetMaximumGroupEstimationEGainId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationEGain/GetMaximumGroupEstimationEGainId');
        return result;
    }


    EstimationEGainMasterFactory.GetAllLockedEstimationEGain = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationEGain/GetAllLockedEstimationEGain');
        return result;
    }

    return EstimationEGainMasterFactory;
});
