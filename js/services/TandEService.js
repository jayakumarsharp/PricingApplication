ReportApp.factory('TandEService', function ($http) {
    var TandEServiceURI = BaseURL;
    var TandEFactory = {};

    TandEFactory.GetAllTandE = function () {
        var result = $http.get(TandEServiceURI + 'TandE/GetAllTandE');
        return result;
    }

    TandEFactory.AddTandE = function (currencysheet) {
        return $http.post(TandEServiceURI + 'TandE/AddTandE', currencysheet);
    }

    TandEFactory.GetAllTandEbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(TandEServiceURI + 'TandE/GetAllTandEbyOppGroupID?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    TandEFactory.GetTandE = function (oppid) {
        var result = $http.get(TandEServiceURI + 'TandE/GetTandE?oppId=' + oppid);
        return result;
    }

    TandEFactory.GetTandEMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(TandEServiceURI + 'TandE/GetTandEMapbyOppGroup?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    TandEFactory.AddTandE = function (TandE) {
        return $http.post(TandEServiceURI + 'TandE/AddTandE', TandE);
    }

    TandEFactory.AddTandENewVersion = function (TandE) {
        return $http.post(TandEServiceURI + 'TandE/AddTandENewVersion', TandE);
    }

    TandEFactory.LocktheSheetByGroupid = function (TandE) {
        return $http.get(TandEServiceURI + 'TandE/LocktheSheetByGroupid?OppId=' + TandE.OppId + '&GroupId=' + TandE.GroupId + '&username=' + TandE.username + '&LockedInApp=' + TandE.LockedInApp);
    }

    TandEFactory.IncreaseAdditionalTimeToSheet = function (TandE) {
        return $http.get(TandEServiceURI + 'TandE/IncreaseAdditionalTimeToSheet?GroupId=' + TandE.GroupId + '&username=' + TandE.username + '&LockedInApp=' + TandE.LockedInApp);
    }

    TandEFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(TandEServiceURI + 'TandE/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    TandEFactory.UpdateTandE = function (TandE) {
        return $http.post(TandEServiceURI + 'TandE/UpdateTandE', TandE);
    }

    TandEFactory.GetMaximumGroupTandEId = function () {
        var result = $http.get(TandEServiceURI + 'TandE/GetMaximumGroupTandEId');
        return result;
    }

    TandEFactory.GetAllLockedTandE = function () {
        var result = $http.get(TandEServiceURI + 'TandE/GetAllLockedTandE');
        return result;
    }

    return TandEFactory;
});
