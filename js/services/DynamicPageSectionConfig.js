'use strict';
ReportApp.factory('EstimationPageSectionService', function ($http) {
    var EstimationPageSectionServiceURI = BaseURL;
    var EstimationPageSectionServiceFactory = {};

    EstimationPageSectionServiceFactory.GetPageList = function () {
        var result = $http.get(EstimationPageSectionServiceURI + 'EstimationPageSection/GetPageList');
        return result;
    }

    EstimationPageSectionServiceFactory.GetAllPageSections = function () {
        var result = $http.get(EstimationPageSectionServiceURI + 'EstimationPageSection/GetAllPageSections');
        return result;
    }

    EstimationPageSectionServiceFactory.AddPageSection = function (EstimationPageSection) {
        return $http.post(EstimationPageSectionServiceURI + 'EstimationPageSection/AddPageSection', EstimationPageSection);
    }
    
    EstimationPageSectionServiceFactory.UpdatePageSection = function (EstimationPageSection) {
        return $http.post(EstimationPageSectionServiceURI + 'EstimationPageSection/UpdatePageSection', EstimationPageSection);
    }


    return EstimationPageSectionServiceFactory;
});
