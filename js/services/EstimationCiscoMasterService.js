ReportApp.factory('EstimationCiscoMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationCiscoMasterFactory = {};

    EstimationCiscoMasterFactory.GetAllEstimationCiscoMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationCiscoMaster/GetAllEstimationCiscoMaster');
        return result;
    }

    
    EstimationCiscoMasterFactory.AddEstimationCiscoMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationCiscoMaster/AddEstimationCiscoMaster', currencysheet);
    }


    EstimationCiscoMasterFactory.GetAllEstimationCiscobyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationCisco/GetAllEstimationCiscobyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationCiscoMasterFactory.GetEstimationCiscoMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationCisco/GetEstimationCiscoMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationCiscoMasterFactory.AddEstimationCisco = function (EstimationCisco) {
        return $http.post(EstimateServiceURI + 'EstimationCisco/AddEstimationCisco', EstimationCisco);
    }

    
    EstimationCiscoMasterFactory.AddEstimationCiscoNewVersion = function (EstimationCisco) {
        return $http.post(EstimateServiceURI + 'EstimationCisco/AddEstimationCiscoNewVersion', EstimationCisco);
    }

    EstimationCiscoMasterFactory.LocktheSheetByGroupid = function (EstimationCisco) {
        return $http.get(EstimateServiceURI + 'EstimationCisco/LocktheSheetByGroupid?OppId=' + EstimationCisco.OppId + '&GroupId=' + EstimationCisco.GroupId + '&username=' + EstimationCisco.username + '&LockedInApp=' + EstimationCisco.LockedInApp);
    }

    EstimationCiscoMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationCisco) {
        return $http.get(EstimateServiceURI + 'EstimationCisco/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationCisco.GroupId + '&username=' + EstimationCisco.username + '&LockedInApp=' + EstimationCisco.LockedInApp);
    }

    EstimationCiscoMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationCisco/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationCiscoMasterFactory.UpdateEstimationCisco = function (EstimationCisco) {
        return $http.post(EstimateServiceURI + 'EstimationCisco/UpdateEstimationCisco', EstimationCisco);
    }

    EstimationCiscoMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationCiscoMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationCisco/GetAllComponentType');
        return result;
    }

    EstimationCiscoMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationCisco/GetAllPriceType');
        return result;
    }

    EstimationCiscoMasterFactory.GetMaximumGroupEstimationCiscoId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationCisco/GetMaximumGroupEstimationCiscoId');
        return result;
    }


    EstimationCiscoMasterFactory.GetAllLockedEstimationCisco = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationCisco/GetAllLockedEstimationCisco');
        return result;
    }

    return EstimationCiscoMasterFactory;
});
