'use strict';
ReportApp.factory('currencyService', function ($http) {
    var currencyServiceURI = BaseURL;
    var currencyServiceFactory = {};

    currencyServiceFactory.GetAllServionLegalEntity = function () {
        var result = $http.get(currencyServiceURI + 'ServionLegalEntity/GetAllServionLegalEntity');
        return result;
    }


    currencyServiceFactory.GetAllCurrencyConversion = function () {
        var result = $http.get(currencyServiceURI + 'currency/GetAllCurrencyConversion');
        return result;
    }

    currencyServiceFactory.GetCurrencyConversionbyId = function (id) {
        var result = $http.get(currencyServiceURI + 'currency/GetAllCurrencyConversion?Id=' + id);
        return result;
    }
    currencyServiceFactory.AddCurrencyConversion = function (currencysheet) {
        return $http.post(currencyServiceURI + 'currency/AddCurrencyConversion', currencysheet);
    }

    currencyServiceFactory.UpdatecurrencyConversion = function (currencysheet) {
        return $http.post(currencyServiceURI + 'currency/ModifyCurrencyConversion', currencysheet);
    }

    currencyServiceFactory.DeletecurrencyConversion = function (crc) {
        return $http.post(currencyServiceURI + 'currency/DeleteCurrencyConversion', crc);
    }

    currencyServiceFactory.GetAllCurrency = function () {
        var result = $http.get(currencyServiceURI + 'currency/GetAllCurrency');
        return result;
    }

    currencyServiceFactory.GetRegionbyCountry = function (Id) {
        var result = $http.get(currencyServiceURI + 'currency/GetRegionbyCountry?Id=' + Id);
        return result;
    }

    currencyServiceFactory.GetCountrybySBU = function (Id) {
        var result = $http.get(currencyServiceURI + 'currency/GetCountrybySBU?Id=' + Id);
        return result;
    }

    currencyServiceFactory.GetCurrencyConversionForPricing = function (ServionLegalEntityId, SBUId, CountryId, CurrencyId) {
        var result = $http.get(currencyServiceURI + 'currency/GetCurrencyConversionForPricing?ServionLegalEntityId=' + ServionLegalEntityId + '&SBUId=' + SBUId + '&CountryId=' + CountryId + '&CurrencyId=' + CurrencyId);
        return result;
    }


   
    return currencyServiceFactory;
});

