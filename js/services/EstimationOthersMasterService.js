ReportApp.factory('EstimationOthersMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationOthersMasterFactory = {};

    
    EstimationOthersMasterFactory.GetAllEstimationOthersMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationOthersMaster/GetAllEstimationOthersMaster');
        return result;
    }

    
    EstimationOthersMasterFactory.AddEstimationOthersMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationOthersMaster/AddEstimationOthersMaster', currencysheet);
    }


    EstimationOthersMasterFactory.GetAllEstimationOthersbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationOthers/GetAllEstimationOthersbyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationOthersMasterFactory.GetEstimationOthersMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationOthers/GetEstimationOthersMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationOthersMasterFactory.AddEstimationOthers = function (EstimationOthers) {
        return $http.post(EstimateServiceURI + 'EstimationOthers/AddEstimationOthers', EstimationOthers);
    }

    
    EstimationOthersMasterFactory.AddEstimationOthersNewVersion = function (EstimationOthers) {
        return $http.post(EstimateServiceURI + 'EstimationOthers/AddEstimationOthersNewVersion', EstimationOthers);
    }

    EstimationOthersMasterFactory.LocktheSheetByGroupid = function (EstimationOthers) {
        return $http.get(EstimateServiceURI + 'EstimationOthers/LocktheSheetByGroupid?OppId=' + EstimationOthers.OppId + '&GroupId=' + EstimationOthers.GroupId + '&username=' + EstimationOthers.username + '&LockedInApp=' + EstimationOthers.LockedInApp);
    }

    EstimationOthersMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationOthers) {
        return $http.get(EstimateServiceURI + 'EstimationOthers/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationOthers.GroupId + '&username=' + EstimationOthers.username + '&LockedInApp=' + EstimationOthers.LockedInApp);
    }

    EstimationOthersMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationOthers/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationOthersMasterFactory.UpdateEstimationOthers = function (EstimationOthers) {
        return $http.post(EstimateServiceURI + 'EstimationOthers/UpdateEstimationOthers', EstimationOthers);
    }

    EstimationOthersMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationOthersMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationOthers/GetAllComponentType');
        return result;
    }

    EstimationOthersMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationOthers/GetAllPriceType');
        return result;
    }

    EstimationOthersMasterFactory.GetMaximumGroupEstimationOthersId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationOthers/GetMaximumGroupEstimationOthersId');
        return result;
    }


    EstimationOthersMasterFactory.GetAllLockedEstimationOthers = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationOthers/GetAllLockedEstimationOthers');
        return result;
    }

    return EstimationOthersMasterFactory;
});
