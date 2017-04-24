'use strict';
ReportApp.factory('DayService', function ($http) {
    var DayServiceURI = BaseURL;
    var DayServiceFactory = {};

    DayServiceFactory.GetDaySheetbyOppGroup = function (oppid, groupid) {
        var result = $http.get(DayServiceURI + 'Day/GetDaySheetbyOppGroup?oppId=' + oppid + '&DayGroupId=' + groupid);
        return result;
    }

    DayServiceFactory.GetDaysheetFTEHoursbyOppGroup = function (oppid, groupid) {
        var result = $http.get(DayServiceURI + 'Day/GetDaysheetFTEHoursbyOppGroup?oppId=' + oppid + '&DayGroupId=' + groupid);
        return result;
    }


    DayServiceFactory.GetDaysheetExtendedEffortbyOppGroup = function (oppid, groupid) {
        var result = $http.get(DayServiceURI + 'Day/GetDaysheetExtendedEffortbyOppGroup?oppId=' + oppid + '&DayGroupId=' + groupid);
        return result;
    }

    DayServiceFactory.GetDaysheetResourceDistributionbyOppGroup = function (oppid, groupid) {
        var result = $http.get(DayServiceURI + 'Day/GetDaysheetResourceDistributionbyOppGroup?oppId=' + oppid + '&DayGroupId=' + groupid);
        return result;
    }

    DayServiceFactory.GetDaysheetPriceCostbyOppGroup = function (oppid, groupid) {
        var result = $http.get(DayServiceURI + 'Day/GetDaysheetPriceCostbyOppGroup?oppId=' + oppid + '&DayGroupId=' + groupid);
        return result;
    }

    DayServiceFactory.AddDaySheet = function (Pricesheet) {
        return $http.post(DayServiceURI + 'Day/AddDaySheet', Pricesheet);
    }


    DayServiceFactory.LocktheSheetByGroupid = function (Pricesheet) {
        return $http.get(DayServiceURI + 'Day/LocktheSheetByGroupid?OppId=' + Pricesheet.OppId + '&GroupId=' + Pricesheet.GroupId + '&username=' + Pricesheet.username + '&LockedInApp=' + Pricesheet.LockedInApp);
    }

    return DayServiceFactory;
});