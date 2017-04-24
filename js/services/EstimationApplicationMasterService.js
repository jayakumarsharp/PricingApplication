ReportApp.factory('EstimationApplicationMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationApplicationMasterFactory = {};



    EstimationApplicationMasterFactory.GetAllEstimationApplicationMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationApplicationMaster/GetAllEstimationApplicationMaster');
        return result;
    }


    EstimationApplicationMasterFactory.AddEstimationApplicationMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationApplicationMaster/AddEstimationApplicationMaster', currencysheet);
    }


    EstimationApplicationMasterFactory.GetAllEstimationApplicationbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationApplication/GetAllEstimationApplicationbyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationApplicationMasterFactory.GetEstimationApplicationMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationApplication/GetEstimationApplicationMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationApplicationMasterFactory.AddEstimationApplication = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/AddEstimationApplication', EstimationApplication);
    }


    EstimationApplicationMasterFactory.AddEstimationApplicationNewVersion = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/AddEstimationApplicationNewVersion', EstimationApplication);
    }

    EstimationApplicationMasterFactory.LocktheSheetByGroupid = function (EstimationApplication) {
        return $http.get(EstimateServiceURI + 'EstimationApplication/LocktheSheetByGroupid?OppId=' + EstimationApplication.OppId + '&GroupId=' + EstimationApplication.GroupId + '&username=' + EstimationApplication.username + '&LockedInApp=' + EstimationApplication.LockedInApp);
    }

    EstimationApplicationMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationApplication) {
        return $http.get(EstimateServiceURI + 'EstimationApplication/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationApplication.GroupId + '&username=' + EstimationApplication.username + '&LockedInApp=' + EstimationApplication.LockedInApp);
    }

    EstimationApplicationMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationApplication/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationApplicationMasterFactory.UpdateEstimationApplication = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/UpdateEstimationApplication', EstimationApplication);
    }

    EstimationApplicationMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationApplicationMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationApplication/GetAllComponentType');
        return result;
    }

    EstimationApplicationMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationApplication/GetAllPriceType');
        return result;
    }

    EstimationApplicationMasterFactory.GetMaximumGroupEstimationApplicationId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationApplication/GetMaximumGroupEstimationApplicationId');
        return result;
    }

    EstimationApplicationMasterFactory.GetEstimationApplicationVersionsForOpp = function (oppid, sheet) {
        var result = $http.get(EstimateServiceURI + 'EstimationApplication/GetAllVersionOpportunity?oppId=' + oppid + '&sheet=' + sheet);
        return result;
    }


    EstimationApplicationMasterFactory.GetAllLockedEstimationApplication = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationApplication/GetAllLockedEstimationApplication');
        return result;
    }

    EstimationApplicationMasterFactory.dointernalpercentagecalculation = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/dointernalpercentagecalculation', EstimationApplication);
    }

    EstimationApplicationMasterFactory.GetAllInternalCalculation = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/GetAllInternalCalculation', EstimationApplication);
    }

    EstimationApplicationMasterFactory.dointernalpercentagecalculationForCiscoGroup = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/dointernalpercentagecalculationForCiscoGroup', EstimationApplication);
    }

    EstimationApplicationMasterFactory.dointernalpercentagecalculationForEgainGroup = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/dointernalpercentagecalculationForEgainGroup', EstimationApplication);
    }


    EstimationApplicationMasterFactory.dointernalpercentagecalculationForAdminReport = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/dointernalpercentagecalculationForAdminReport', EstimationApplication);
    }


    EstimationApplicationMasterFactory.dointernalpercentagecalculationForOther = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/dointernalpercentagecalculationForOther', EstimationApplication);
    }
    EstimationApplicationMasterFactory.GetAllInternalCalculationTotalSingle = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/GetAllInternalCalculationTotalSingle', EstimationApplication);
    }

    EstimationApplicationMasterFactory.GetAllInternalCalculationTotalMulti = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/GetAllInternalCalculationTotalMulti', EstimationApplication);
    }

    EstimationApplicationMasterFactory.getsdlcpercentage = function (EstimationApplication) {
        return $http.post(EstimateServiceURI + 'EstimationApplication/getsdlcpercentage', EstimationApplication);
    }


    return EstimationApplicationMasterFactory;
});
