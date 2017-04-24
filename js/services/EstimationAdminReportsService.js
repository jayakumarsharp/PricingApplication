ReportApp.factory('EstimationAdminReportsMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationAdminReportsMasterFactory = {};


    EstimationAdminReportsMasterFactory.GetAllEstimationAdminReportsMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAdminReportsMaster/GetAllEstimationAdminReportsMaster');
        return result;
    }


    EstimationAdminReportsMasterFactory.AddEstimationAdminReportsMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationAdminReportsMaster/AddEstimationAdminReportsMaster', currencysheet);
    }


    EstimationAdminReportsMasterFactory.GetAllEstimationAdminReportsbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationAdminReports/GetAllEstimationAdminReportsbyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationAdminReportsMasterFactory.GetEstimationAdminReportsMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationAdminReports/GetEstimationAdminReportsMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationAdminReportsMasterFactory.AddEstimationAdminReports = function (EstimationAdminReports) {
        return $http.post(EstimateServiceURI + 'EstimationAdminReports/AddEstimationAdminReports', EstimationAdminReports);
    }


    EstimationAdminReportsMasterFactory.AddEstimationAdminReportsNewVersion = function (EstimationAdminReports) {
        return $http.post(EstimateServiceURI + 'EstimationAdminReports/AddEstimationAdminReportsNewVersion', EstimationAdminReports);
    }

    EstimationAdminReportsMasterFactory.LocktheSheetByGroupid = function (EstimationAdminReports) {
        return $http.get(EstimateServiceURI + 'EstimationAdminReports/LocktheSheetByGroupid?OppId=' + EstimationAdminReports.OppId + '&GroupId=' + EstimationAdminReports.GroupId + '&username=' + EstimationAdminReports.username + '&LockedInApp=' + EstimationAdminReports.LockedInApp);
    }

    EstimationAdminReportsMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationAdminReports) {
        return $http.get(EstimateServiceURI + 'EstimationAdminReports/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationAdminReports.GroupId + '&username=' + EstimationAdminReports.username + '&LockedInApp=' + EstimationAdminReports.LockedInApp);
    }

    EstimationAdminReportsMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationAdminReports/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationAdminReportsMasterFactory.UpdateEstimationAdminReports = function (EstimationAdminReports) {
        return $http.post(EstimateServiceURI + 'EstimationAdminReports/UpdateEstimationAdminReports', EstimationAdminReports);
    }

    EstimationAdminReportsMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationAdminReportsMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAdminReports/GetAllComponentType');
        return result;
    }

    EstimationAdminReportsMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAdminReports/GetAllPriceType');
        return result;
    }

    EstimationAdminReportsMasterFactory.GetMaximumGroupEstimationAdminReportsId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAdminReports/GetMaximumGroupEstimationAdminReportsId');
        return result;
    }


    EstimationAdminReportsMasterFactory.GetAllLockedEstimationAdminReports = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationAdminReports/GetAllLockedEstimationAdminReports');
        return result;
    }

    return EstimationAdminReportsMasterFactory;
});
