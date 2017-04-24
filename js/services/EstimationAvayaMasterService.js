ReportApp.factory('EstimationAvayaMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationAvayaMasterFactory = {};

    EstimationAvayaMasterFactory.GetAllEstimationAvayaMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAvayaMaster/GetAllEstimationAvayaMaster');
        return result;
    }

    
    EstimationAvayaMasterFactory.AddEstimationAvayaMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationAvayaMaster/AddEstimationAvayaMaster', currencysheet);
    }


    EstimationAvayaMasterFactory.GetAllEstimationAvayabyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationAvaya/GetAllEstimationAvayabyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationAvayaMasterFactory.GetEstimationAvayaMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationAvaya/GetEstimationAvayaMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationAvayaMasterFactory.AddEstimationAvaya = function (EstimationAvaya) {
        return $http.post(EstimateServiceURI + 'EstimationAvaya/AddEstimationAvaya', EstimationAvaya);
    }

    
    EstimationAvayaMasterFactory.AddEstimationAvayaNewVersion = function (EstimationAvaya) {
        return $http.post(EstimateServiceURI + 'EstimationAvaya/AddEstimationAvayaNewVersion', EstimationAvaya);
    }

    EstimationAvayaMasterFactory.LocktheSheetByGroupid = function (EstimationAvaya) {
        return $http.get(EstimateServiceURI + 'EstimationAvaya/LocktheSheetByGroupid?OppId=' + EstimationAvaya.OppId + '&GroupId=' + EstimationAvaya.GroupId + '&username=' + EstimationAvaya.username + '&LockedInApp=' + EstimationAvaya.LockedInApp);
    }

    EstimationAvayaMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationAvaya) {
        return $http.get(EstimateServiceURI + 'EstimationAvaya/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationAvaya.GroupId + '&username=' + EstimationAvaya.username + '&LockedInApp=' + EstimationAvaya.LockedInApp);
    }

    EstimationAvayaMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationAvaya/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationAvayaMasterFactory.UpdateEstimationAvaya = function (EstimationAvaya) {
        return $http.post(EstimateServiceURI + 'EstimationAvaya/UpdateEstimationAvaya', EstimationAvaya);
    }

    EstimationAvayaMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationAvayaMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAvaya/GetAllComponentType');
        return result;
    }

    EstimationAvayaMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAvaya/GetAllPriceType');
        return result;
    }

    EstimationAvayaMasterFactory.GetMaximumGroupEstimationAvayaId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAvaya/GetMaximumGroupEstimationAvayaId');
        return result;
    }

    EstimationAvayaMasterFactory.GetAllLockedEstimationAvaya = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAvaya/GetAllLockedEstimationAvaya');
        return result;
    }

    return EstimationAvayaMasterFactory;
});
