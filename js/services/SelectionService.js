'use strict';
ReportApp.factory('SelectionService', function ($http) {
    var SelectionServiceURI = BaseURL;
    var SelectionServiceFactory = {};

    SelectionServiceFactory.GetAllSelection = function () {
        var result = $http.get(SelectionServiceURI + 'Selection/GetAllSelection');
        return result;
    }

    SelectionServiceFactory.GetAllSelectionById = function (Id) {
        var result = $http.get(SelectionServiceURI + 'Selection/GetAllSelection?Id=' + Id);
        return result;
    }
    SelectionServiceFactory.AddSelection = function (Selection) {
        return $http.post(SelectionServiceURI + 'Selection/AddSelection', Selection);
    }

    SelectionServiceFactory.ModifySelection = function (Selection) {
        return $http.post(SelectionServiceURI + 'Selection/ModifySelection', Selection);
    }

    SelectionServiceFactory.DeleteSelection = function (Selection) {
        return $http.post(SelectionServiceURI + 'Selection/DeleteSelection', Selection);
    }

    return SelectionServiceFactory;
});

