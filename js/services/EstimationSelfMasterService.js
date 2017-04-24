ReportApp.factory('EstimationSelfServiceMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationSelfServiceMasterFactory = {};

    EstimationSelfServiceMasterFactory.GetAllEstimationSelfServiceMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationSelfServiceMaster/GetAllEstimationSelfServiceMaster');
        return result;
    }

    
    EstimationSelfServiceMasterFactory.AddEstimationSelfServiceMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationSelfServiceMaster/AddEstimationSelfServiceMaster', currencysheet);
    }


    EstimationSelfServiceMasterFactory.GetAllEstimationSelfServicebyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationSelfService/GetAllEstimationSelfServicebyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationSelfServiceMasterFactory.GetEstimationSelfServiceMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationSelfService/GetEstimationSelfServiceMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationSelfServiceMasterFactory.AddEstimationSelfService = function (EstimationSelfService) {
        return $http.post(EstimateServiceURI + 'EstimationSelfService/AddEstimationSelfService', EstimationSelfService);
    }

    
    EstimationSelfServiceMasterFactory.AddEstimationSelfServiceNewVersion = function (EstimationSelfService) {
        return $http.post(EstimateServiceURI + 'EstimationSelfService/AddEstimationSelfServiceNewVersion', EstimationSelfService);
    }

    EstimationSelfServiceMasterFactory.LocktheSheetByGroupid = function (EstimationSelfService) {
        return $http.get(EstimateServiceURI + 'EstimationSelfService/LocktheSheetByGroupid?OppId=' + EstimationSelfService.OppId + '&GroupId=' + EstimationSelfService.GroupId + '&username=' + EstimationSelfService.username + '&LockedInApp=' + EstimationSelfService.LockedInApp);
    }

    EstimationSelfServiceMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationSelfService) {
        return $http.get(EstimateServiceURI + 'EstimationSelfService/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationSelfService.GroupId + '&username=' + EstimationSelfService.username + '&LockedInApp=' + EstimationSelfService.LockedInApp);
    }

    EstimationSelfServiceMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationSelfService/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationSelfServiceMasterFactory.UpdateEstimationSelfService = function (EstimationSelfService) {
        return $http.post(EstimateServiceURI + 'EstimationSelfService/UpdateEstimationSelfService', EstimationSelfService);
    }

    EstimationSelfServiceMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationSelfServiceMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationSelfService/GetAllComponentType');
        return result;
    }

    EstimationSelfServiceMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationSelfService/GetAllPriceType');
        return result;
    }

    EstimationSelfServiceMasterFactory.GetMaximumGroupEstimationSelfServiceId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationSelfService/GetMaximumGroupEstimationSelfServiceId');
        return result;
    }
    EstimationSelfServiceMasterFactory.GetAllLockedEstimationSelfService = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationSelfService/GetAllLockedEstimationSelfService');
        return result;
    }

    return EstimationSelfServiceMasterFactory;
});
