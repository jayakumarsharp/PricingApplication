ReportApp.factory('ResourceService', function ($http) {
    var ResourceServiceURI = BaseURL;
    var ResourceFactory = {};

    ResourceFactory.GetAllResource = function () {
        var result = $http.get(ResourceServiceURI + 'Resource/GetAllResource');
        return result;
    }


    ResourceFactory.AddResource = function (currencysheet) {
        return $http.post(ResourceServiceURI + 'Resource/AddResource', currencysheet);
    }

    ResourceFactory.GetAllResourcebyOppGroupID = function (oppid, groupid) {
        var result = $http.get(ResourceServiceURI + 'Resource/GetAllResourcebyOppGroupID?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    ResourceFactory.GetResource = function (oppid) {
        var result = $http.get(ResourceServiceURI + 'Resource/GetResource?oppId=' + oppid);
        return result;
    }
    ResourceFactory.GetResourceMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(ResourceServiceURI + 'Resource/GetResourceMapbyOppGroup?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    ResourceFactory.AddResource = function (Resource) {
        return $http.post(ResourceServiceURI + 'Resource/AddResource', Resource);
    }


    ResourceFactory.AddResourceNewVersion = function (Resource) {
        return $http.post(ResourceServiceURI + 'Resource/AddResourceNewVersion', Resource);
    }

    ResourceFactory.LocktheSheetByGroupid = function (Resource) {
        return $http.get(ResourceServiceURI + 'Resource/LocktheSheetByGroupid?OppId=' + Resource.OppId + '&GroupId=' + Resource.GroupId + '&username=' + Resource.username + '&LockedInApp=' + Resource.LockedInApp);
    }

    ResourceFactory.IncreaseAdditionalTimeToSheet = function (Resource) {
        return $http.get(ResourceServiceURI + 'Resource/IncreaseAdditionalTimeToSheet?GroupId=' + Resource.GroupId + '&username=' + Resource.username + '&LockedInApp=' + Resource.LockedInApp);
    }

    ResourceFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(ResourceServiceURI + 'Resource/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    ResourceFactory.UpdateResource = function (Resource) {
        return $http.post(ResourceServiceURI + 'Resource/UpdateResource', Resource);
    }

    ResourceFactory.GetMaximumGroupResourceId = function () {
        var result = $http.get(ResourceServiceURI + 'Resource/GetMaximumGroupResourceId');
        return result;
    }

    ResourceFactory.GetAllLockedResource = function () {
        var result = $http.get(ResourceServiceURI + 'Resource/GetAllLockedResource');
        return result;
    }

    return ResourceFactory;
});
