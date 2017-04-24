ReportApp.factory('TandEResourceService', function ($http) {
    var TandEResourceServiceURI = BaseURL;
    var TandEResourceFactory = {};

    TandEResourceFactory.GetAllTandEResource = function () {
        var result = $http.get(TandEResourceServiceURI + 'TandEResource/GetAllTandEResource');
        return result;
    }

    TandEResourceFactory.AddTandEResource = function (currencysheet) {
        return $http.post(TandEResourceServiceURI + 'TandEResource/AddTandEResource', currencysheet);
    }

    TandEResourceFactory.GetAllTandEResourcebyOppGroupID = function (oppid, groupid) {
        var result = $http.get(TandEResourceServiceURI + 'TandEResource/GetAllTandEResourcebyOppGroupID?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    TandEResourceFactory.GetTandEResource = function (oppid) {
        var result = $http.get(TandEResourceServiceURI + 'TandEResource/GetTandEResource?oppId=' + oppid);
        return result;
    }

    TandEResourceFactory.GetTandEResourceMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(TandEResourceServiceURI + 'TandEResource/GetTandEResourceMapbyOppGroup?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    TandEResourceFactory.AddTandEResource = function (TandEResource) {
        return $http.post(TandEResourceServiceURI + 'TandEResource/AddTandEResource', TandEResource);
    }

    TandEResourceFactory.AddTandEResourceNewVersion = function (TandEResource) {
        return $http.post(TandEResourceServiceURI + 'TandEResource/AddTandEResourceNewVersion', TandEResource);
    }

    TandEResourceFactory.LocktheSheetByGroupid = function (TandEResource) {
        return $http.get(TandEResourceServiceURI + 'TandEResource/LocktheSheetByGroupid?OppId=' + TandEResource.OppId + '&GroupId=' + TandEResource.GroupId + '&username=' + TandEResource.username + '&LockedInApp=' + TandEResource.LockedInApp);
    }

    TandEResourceFactory.IncreaseAdditionalTimeToSheet = function (TandEResource) {
        return $http.get(TandEResourceServiceURI + 'TandEResource/IncreaseAdditionalTimeToSheet?GroupId=' + TandEResource.GroupId + '&username=' + TandEResource.username + '&LockedInApp=' + TandEResource.LockedInApp);
    }

    TandEResourceFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(TandEResourceServiceURI + 'TandEResource/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    TandEResourceFactory.UpdateTandEResource = function (TandEResource) {
        return $http.post(TandEResourceServiceURI + 'TandEResource/UpdateTandEResource', TandEResource);
    }

    TandEResourceFactory.GetMaximumGroupTandEResourceId = function () {
        var result = $http.get(TandEResourceServiceURI + 'TandEResource/GetMaximumGroupTandEResourceId');
        return result;
    }

    TandEResourceFactory.GetAllLockedTandEResource = function () {
        var result = $http.get(TandEResourceServiceURI + 'TandEResource/GetAllLockedTandEResource');
        return result;
    }

    return TandEResourceFactory;
});
