ReportApp.factory('EstimationServionProductsMasterService', function ($http) {
    var EstimateServiceURI = BaseURL;
    var EstimationServionProductsMasterFactory = {};

    EstimationServionProductsMasterFactory.GetAllEstimationServionProductsMaster = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationServionProductsMaster/GetAllEstimationServionProductsMaster');
        return result;
    }

    
    EstimationServionProductsMasterFactory.AddEstimationServionProductsMaster = function (currencysheet) {
        return $http.post(EstimateServiceURI + 'EstimationServionProductsMaster/AddEstimationServionProductsMaster', currencysheet);
    }


    EstimationServionProductsMasterFactory.GetAllEstimationServionProductsbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationServionProducts/GetAllEstimationServionProductsbyOppGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationServionProductsMasterFactory.GetEstimationServionProductsMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(EstimateServiceURI + 'EstimationServionProducts/GetEstimationServionProductsMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    EstimationServionProductsMasterFactory.AddEstimationServionProducts = function (EstimationServionProducts) {
        return $http.post(EstimateServiceURI + 'EstimationServionProducts/AddEstimationServionProducts', EstimationServionProducts);
    }

    
    EstimationServionProductsMasterFactory.AddEstimationServionProductsNewVersion = function (EstimationServionProducts) {
        return $http.post(EstimateServiceURI + 'EstimationServionProducts/AddEstimationServionProductsNewVersion', EstimationServionProducts);
    }

    EstimationServionProductsMasterFactory.LocktheSheetByGroupid = function (EstimationServionProducts) {
        return $http.get(EstimateServiceURI + 'EstimationServionProducts/LocktheSheetByGroupid?OppId=' + EstimationServionProducts.OppId + '&GroupId=' + EstimationServionProducts.GroupId + '&username=' + EstimationServionProducts.username + '&LockedInApp=' + EstimationServionProducts.LockedInApp);
    }

    EstimationServionProductsMasterFactory.IncreaseAdditionalTimeToSheet = function (EstimationServionProducts) {
        return $http.get(EstimateServiceURI + 'EstimationServionProducts/IncreaseAdditionalTimeToSheet?GroupId=' + EstimationServionProducts.GroupId + '&username=' + EstimationServionProducts.username + '&LockedInApp=' + EstimationServionProducts.LockedInApp);
    }

    EstimationServionProductsMasterFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(EstimateServiceURI + 'EstimationServionProducts/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    EstimationServionProductsMasterFactory.UpdateEstimationServionProducts = function (EstimationServionProducts) {
        return $http.post(EstimateServiceURI + 'EstimationServionProducts/UpdateEstimationServionProducts', EstimationServionProducts);
    }

    EstimationServionProductsMasterFactory.GetAllOEM = function () {
        var result = $http.get(EstimateServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    EstimationServionProductsMasterFactory.GetAllComponentType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationServionProducts/GetAllComponentType');
        return result;
    }

    EstimationServionProductsMasterFactory.GetAllPriceType = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationServionProducts/GetAllPriceType');
        return result;
    }

    EstimationServionProductsMasterFactory.GetMaximumGroupEstimationServionProductsId = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationServionProducts/GetMaximumGroupEstimationServionProductsId');
        return result;
    }

    EstimationServionProductsMasterFactory.GetAllLockedEstimationServionProducts = function () {
        var result = $http.get(EstimateServiceURI + 'EstimationServionProducts/GetAllLockedEstimationServionProducts');
        return result;
    }

    return EstimationServionProductsMasterFactory;
});
