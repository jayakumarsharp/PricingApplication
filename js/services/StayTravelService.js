ReportApp.factory('StayTravelService', function ($http) {
    var StayTravelServiceURI = BaseURL;
    var StayTravelFactory = {};

    StayTravelFactory.GetAllStayTravel = function () {
        var result = $http.get(StayTravelServiceURI + 'StayTravel/GetAllStayTravel');
        return result;
    }

    StayTravelFactory.AddStayTravel = function (currencysheet) {
        return $http.post(StayTravelServiceURI + 'StayTravel/AddStayTravel', currencysheet);
    }

    StayTravelFactory.GetAllStayTravelbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(StayTravelServiceURI + 'StayTravel/GetAllStayTravelbyOppGroupID?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    StayTravelFactory.GetStayTravel = function (oppid) {
        var result = $http.get(StayTravelServiceURI + 'StayTravel/GetStayTravel?oppId=' + oppid);
        return result;
    }

    StayTravelFactory.GetStayTravelMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(StayTravelServiceURI + 'StayTravel/GetStayTravelMapbyOppGroup?oppId=' + oppid + '&groupId=' + groupid);
        return result;
    }

    StayTravelFactory.AddStayTravel = function (StayTravel) {
        return $http.post(StayTravelServiceURI + 'StayTravel/AddStayTravel', StayTravel);
    }

    StayTravelFactory.AddStayTravelNewVersion = function (StayTravel) {
        return $http.post(StayTravelServiceURI + 'StayTravel/AddStayTravelNewVersion', StayTravel);
    }

    StayTravelFactory.LocktheSheetByGroupid = function (StayTravel) {
        return $http.get(StayTravelServiceURI + 'StayTravel/LocktheSheetByGroupid?OppId=' + StayTravel.OppId + '&GroupId=' + StayTravel.GroupId + '&username=' + StayTravel.username + '&LockedInApp=' + StayTravel.LockedInApp);
    }

    StayTravelFactory.IncreaseAdditionalTimeToSheet = function (StayTravel) {
        return $http.get(StayTravelServiceURI + 'StayTravel/IncreaseAdditionalTimeToSheet?GroupId=' + StayTravel.GroupId + '&username=' + StayTravel.username + '&LockedInApp=' + StayTravel.LockedInApp);
    }

    StayTravelFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(StayTravelServiceURI + 'StayTravel/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    StayTravelFactory.UpdateStayTravel = function (StayTravel) {
        return $http.post(StayTravelServiceURI + 'StayTravel/UpdateStayTravel', StayTravel);
    }

    StayTravelFactory.GetMaximumGroupStayTravelId = function () {
        var result = $http.get(StayTravelServiceURI + 'StayTravel/GetMaximumGroupStayTravelId');
        return result;
    }

    StayTravelFactory.GetAllLockedStayTravel = function () {
        var result = $http.get(StayTravelServiceURI + 'StayTravel/GetAllLockedStayTravel');
        return result;
    }

    return StayTravelFactory;
});
