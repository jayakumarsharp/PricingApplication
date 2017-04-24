ReportApp.factory('TandEPSService', function ($http) {
    var TandEPSServiceURI = BaseURL;
    var TandEPSFactory = {};

    TandEPSFactory.GetAllTandEPS = function () {
        var result = $http.get(TandEPSServiceURI + 'TandEPS/GetAllTandEPS');
        return result;
    }

    TandEPSFactory.AddTandEPS = function (currencysheet) {
        return $http.post(TandEPSServiceURI + 'TandEPS/AddTandEPS', currencysheet);
    }

    TandEPSFactory.GetAllTandEPSbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(TandEPSServiceURI + 'TandEPS/GetAllTandEPSbyOppGroupID?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    TandEPSFactory.GetTandEPS = function (oppid) {
        var result = $http.get(TandEPSServiceURI + 'TandEPS/GetTandEPS?oppId=' + oppid);
        return result;
    }

    TandEPSFactory.GetTandEPSMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(TandEPSServiceURI + 'TandEPS/GetTandEPSMapbyOppGroup?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    TandEPSFactory.AddTandEPS = function (TandEPS) {
        return $http.post(TandEPSServiceURI + 'TandEPS/AddTandEPS', TandEPS);
    }

    TandEPSFactory.AddTandEPSNewVersion = function (TandEPS) {
        return $http.post(TandEPSServiceURI + 'TandEPS/AddTandEPSNewVersion', TandEPS);
    }

    TandEPSFactory.LocktheSheetByGroupid = function (TandEPS) {
        return $http.get(TandEPSServiceURI + 'TandEPS/LocktheSheetByGroupid?OppId=' + TandEPS.OppId + '&GroupId=' + TandEPS.GroupId + '&username=' + TandEPS.username + '&LockedInApp=' + TandEPS.LockedInApp);
    }

    TandEPSFactory.IncreaseAdditionalTimeToSheet = function (TandEPS) {
        return $http.get(TandEPSServiceURI + 'TandEPS/IncreaseAdditionalTimeToSheet?GroupId=' + TandEPS.GroupId + '&username=' + TandEPS.username + '&LockedInApp=' + TandEPS.LockedInApp);
    }

    TandEPSFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(TandEPSServiceURI + 'TandEPS/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    TandEPSFactory.UpdateTandEPS = function (TandEPS) {
        return $http.post(TandEPSServiceURI + 'TandEPS/UpdateTandEPS', TandEPS);
    }

    TandEPSFactory.GetMaximumGroupTandEPSId = function () {
        var result = $http.get(TandEPSServiceURI + 'TandEPS/GetMaximumGroupTandEPSId');
        return result;
    }

    TandEPSFactory.GetAllLockedTandEPS = function () {
        var result = $http.get(TandEPSServiceURI + 'TandEPS/GetAllLockedTandEPS');
        return result;
    }

    return TandEPSFactory;
});
