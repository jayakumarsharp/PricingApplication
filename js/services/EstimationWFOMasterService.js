ReportApp.factory('EstimationWFOMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationWFOMasterFactory = {};

    EstimationWFOMasterFactory.GetAllEstimationWFOMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationWFOMaster/GetAllEstimationWFOMaster');
        return result;
    }

    
    EstimationWFOMasterFactory.AddEstimationWFOMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationWFOMaster/AddEstimationWFOMaster', currencysheet);
    }


    EstimationWFOMasterFactory.GetAllEstimationWFObyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationWFO/GetAllEstimationWFObyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationWFOMasterFactory.GetEstimationWFOMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationWFO/GetEstimationWFOMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationWFOMasterFactory.AddEstimationWFO = function (EstimationWFO) {
        return $http.post(EstimateServiceURI + 'EstimationWFO/AddEstimationWFO', EstimationWFO);
    }

    
    EstimationWFOMasterFactory.AddEstimationWFONewVersion = function (EstimationWFO) {
        return $http.post(EstimateServiceURI + 'EstimationWFO/AddEstimationWFONewVersion', EstimationWFO);
    }

    EstimationWFOMasterFactory.LocktheSheetByGroupid = function (EstimationWFO) {
        return $http.get(EstimateServiceURI + 'EstimationWFO/LocktheSheetByGroupid?OppId=' + EstimationWFO.OppId + '&GroupId=' + EstimationWFO.GroupId + '&username=' + EstimationWFO.username + '&LockedInApp=' + EstimationWFO.LockedInApp);
    }

    EstimationWFOMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationWFO) {
        return $http.get(EstimateServiceURI + 'EstimationWFO/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationWFO.GroupId + '&username=' + EstimationWFO.username + '&LockedInApp=' + EstimationWFO.LockedInApp);
    }

    EstimationWFOMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationWFO/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationWFOMasterFactory.UpdateEstimationWFO = function (EstimationWFO) {
        return $http.post(EstimateServiceURI + 'EstimationWFO/UpdateEstimationWFO', EstimationWFO);
    }

    EstimationWFOMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationWFOMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationWFO/GetAllComponentType');
        return result;
    }

    EstimationWFOMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationWFO/GetAllPriceType');
        return result;
    }

    EstimationWFOMasterFactory.GetMaximumGroupEstimationWFOId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationWFO/GetMaximumGroupEstimationWFOId');
        return result;
    }


    EstimationWFOMasterFactory.GetAllLockedEstimationWFO = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationWFO/GetAllLockedEstimationWFO');
        return result;
    }

    return EstimationWFOMasterFactory;
});
