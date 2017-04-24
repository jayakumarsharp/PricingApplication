ReportApp.factory('EstimationAcqueonMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationAcqueonMasterFactory = {};

    EstimationAcqueonMasterFactory.GetAllEstimationAcqueonMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAcqueonMaster/GetAllEstimationAcqueonMaster');
        return result;
    }

    
    EstimationAcqueonMasterFactory.AddEstimationAcqueonMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationAcqueonMaster/AddEstimationAcqueonMaster', currencysheet);
    }


    EstimationAcqueonMasterFactory.GetAllEstimationAcqueonbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationAcqueon/GetAllEstimationAcqueonbyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationAcqueonMasterFactory.GetEstimationAcqueonMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationAcqueon/GetEstimationAcqueonMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationAcqueonMasterFactory.AddEstimationAcqueon = function (EstimationAcqueon) {
        return $http.post(EstimateServiceURI + 'EstimationAcqueon/AddEstimationAcqueon', EstimationAcqueon);
    }

    
    EstimationAcqueonMasterFactory.AddEstimationAcqueonNewVersion = function (EstimationAcqueon) {
        return $http.post(EstimateServiceURI + 'EstimationAcqueon/AddEstimationAcqueonNewVersion', EstimationAcqueon);
    }

    EstimationAcqueonMasterFactory.LocktheSheetByGroupid = function (EstimationAcqueon) {
        return $http.get(EstimateServiceURI + 'EstimationAcqueon/LocktheSheetByGroupid?OppId=' + EstimationAcqueon.OppId + '&GroupId=' + EstimationAcqueon.GroupId + '&username=' + EstimationAcqueon.username + '&LockedInApp=' + EstimationAcqueon.LockedInApp);
    }

    EstimationAcqueonMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationAcqueon) {
        return $http.get(EstimateServiceURI + 'EstimationAcqueon/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationAcqueon.GroupId + '&username=' + EstimationAcqueon.username + '&LockedInApp=' + EstimationAcqueon.LockedInApp);
    }

    EstimationAcqueonMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationAcqueon/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationAcqueonMasterFactory.UpdateEstimationAcqueon = function (EstimationAcqueon) {
        return $http.post(EstimateServiceURI + 'EstimationAcqueon/UpdateEstimationAcqueon', EstimationAcqueon);
    }

    EstimationAcqueonMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationAcqueonMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAcqueon/GetAllComponentType');
        return result;
    }

    EstimationAcqueonMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAcqueon/GetAllPriceType');
        return result;
    }

    EstimationAcqueonMasterFactory.GetMaximumGroupEstimationAcqueonId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAcqueon/GetMaximumGroupEstimationAcqueonId');
        return result;
    }
    

    EstimationAcqueonMasterFactory.GetAllLockedEstimationAcqueon = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAcqueon/GetAllLockedEstimationAcqueon');
        return result;
    }

    return EstimationAcqueonMasterFactory;
});
