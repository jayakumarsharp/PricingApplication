'use strict';
ReportApp.factory('ProductService', function ($http) {
    var ProductServiceURI = BaseURL;
    var ProductServiceFactory = {};

    ProductServiceFactory.GetAllProduct = function () {
        var result = $http.get(ProductServiceURI + 'Product/GetAllProduct');
        return result;
    }

    ProductServiceFactory.GetAllProductbyId = function (id) {
        var result = $http.get(ProductServiceURI + 'Product/GetAllProduct?Id=' + id);
        return result;
    }
    ProductServiceFactory.AddProduct = function (Product) {
        return $http.post(ProductServiceURI + 'Product/AddProduct', Product);
    }

    ProductServiceFactory.UpdateProduct = function (Product) {
        return $http.post(ProductServiceURI + 'Product/ModifyProduct', Product);
    }

    ProductServiceFactory.DeleteProduct = function (Product) {
        return $http.post(ProductServiceURI + 'Product/DeleteProduct', Product);
    }

    return ProductServiceFactory;
});

