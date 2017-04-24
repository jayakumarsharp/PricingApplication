'use strict';
ReportApp.factory('VendorService', function ($http) {
    var VendorServiceURI = BaseURL;
    var VendorServiceFactory = {};

    VendorServiceFactory.GetAllVendor = function () {
        var result = $http.get(VendorServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    VendorServiceFactory.GetAllVendorbyId = function (id) {
        var result = $http.get(VendorServiceURI + 'vendor/GetAllVendor?Id=' + id);
        return result;
    }
    VendorServiceFactory.AddVendor = function (Vendor) {
        return $http.post(VendorServiceURI + 'vendor/AddVendor', Vendor);
    }

    VendorServiceFactory.UpdateVendor = function (Vendor) {
        return $http.post(VendorServiceURI + 'vendor/ModifyVendor', Vendor);
    }

    VendorServiceFactory.DeleteVendor = function (Vendor) {
        return $http.post(VendorServiceURI + 'vendor/DeleteVendor', Vendor);
    }

    return VendorServiceFactory;
});

