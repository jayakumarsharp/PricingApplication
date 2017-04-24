'use strict';
ReportApp.factory('priceService', function ($http) {
    var PriceServiceURI = BaseURL;
    var priceServiceFactory = {};

    priceServiceFactory.GetAllLOBList = function () {
        var result = $http.get(PriceServiceURI + 'price/GetAllLOBList');
        return result;
    }

    // this call already in currency service
    priceServiceFactory.GetAllServionLegalEntity = function () {
        var result = $http.get(PriceServiceURI + 'ServionLegalEntity/GetAllServionLegalEntity');
        return result;
    }

    //GetDefaultLegalEntity SBUId,RegionId
    //GetLegalEntityFromOpp Id
    //GetCurrencyFromLegalEntity Id

    priceServiceFactory.GetDefaultLegalEntity = function (SBUId, RegionId) {
        var result = $http.get(PriceServiceURI + 'ServionLegalEntity/GetDefaultLegalEntity?SBUId=' + SBUId + '&RegionId=' + RegionId);
        return result;
    }


    priceServiceFactory.GetLegalEntityFromOpp = function (Id) {
        var result = $http.get(PriceServiceURI + 'ServionLegalEntity/GetLegalEntityFromOpp?Id=' + Id);
        return result;
    }

    priceServiceFactory.GetCurrencyFromLegalEntity = function (Id) {
        var result = $http.get(PriceServiceURI + 'ServionLegalEntity/GetCurrencyFromLegalEntity?Id=' + Id);
        return result;
    }

    priceServiceFactory.GetAllPriceSheetbyOppGroupID = function (oppid, groupid) {
        var result = $http.get(PriceServiceURI + 'price/GetPriceSheetbyOpportunityPCGroupID?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    priceServiceFactory.GetPriceSheetMapbyOppGroup = function (oppid, groupid) {
        var result = $http.get(PriceServiceURI + 'price/GetPriceSheetMapbyOppGroup?oppId=' + oppid + '&PriceGroupId=' + groupid);
        return result;
    }

    priceServiceFactory.AddPriceSheet = function (Pricesheet) {
        return $http.post(PriceServiceURI + 'price/AddPriceSheet', Pricesheet);
    }

    priceServiceFactory.LocktheSheetByGroupid = function (Pricesheet) {
        return $http.get(PriceServiceURI + 'price/LocktheSheetByGroupid?OppId=' + Pricesheet.OppId + '&GroupId=' + Pricesheet.GroupId + '&username=' + Pricesheet.username + '&LockedInApp=' + Pricesheet.LockedInApp+'&IsPriceSheetUpdated='+Pricesheet.IsPriceSheetUpdated);
    }

    priceServiceFactory.IncreaseAdditionalTimeToSheet = function (Pricesheet) {
        return $http.get(PriceServiceURI + 'price/IncreaseAdditionalTimeToSheet?GroupId=' + Pricesheet.GroupId + '&username=' + Pricesheet.username + '&LockedInApp=' + Pricesheet.LockedInApp);
    }

    priceServiceFactory.ReleaseSheetWhenExpired = function (groupid) {
        return $http.get(PriceServiceURI + 'price/ReleaseSheetWhenExpired?GroupId=' + groupid);
    }

    priceServiceFactory.UpdatePriceSheet = function (Pricesheet) {
        return $http.post(PriceServiceURI + 'price/UpdatePriceSheet', Pricesheet);
    }

    priceServiceFactory.GetAllOEM = function () {
        var result = $http.get(PriceServiceURI + 'vendor/GetAllVendor');
        return result;
    }

    priceServiceFactory.GetAllComponentType = function () {
        var result = $http.get(PriceServiceURI + 'price/GetAllComponentType');
        return result;
    }

    priceServiceFactory.GetAllPriceType = function () {
        var result = $http.get(PriceServiceURI + 'price/GetAllPriceType');
        return result;
    }

    priceServiceFactory.GetMaximumGroupPriceSheetId = function () {
        var result = $http.get(PriceServiceURI + 'price/GetMaximumGroupPriceSheetId');
        return result;
    }

    priceServiceFactory.GetPriceSheetVersionsForOpp = function (oppid) {
        var result = $http.get(PriceServiceURI + 'price/GetAllVersionOpportunity?oppId=' + oppid);
        return result;
    }

    priceServiceFactory.GetAllLockedPriceSheet = function () {
        var result = $http.get(PriceServiceURI + 'price/GetAllLockedPriceSheet');
        return result;
    }

    priceServiceFactory.GetAllProduct = function () {
        var result = $http.get(PriceServiceURI + 'product/GetAllProduct');
        return result;
    }

    priceServiceFactory.ChildOpportunity = function (OppID) {
        var result = $http.get(PriceServiceURI + 'country/GetChildOpportunityID?OppID=' + OppID);
        return result;
    }

    priceServiceFactory.ExportToExcelSheet = function (data) {
        var result = $http.post(PriceServiceURI + 'price/ExportToExcelSheet', data);
        return result;
    }


    priceServiceFactory.ExportToExcelSheetTest = function () {
        var result = $http.get(PriceServiceURI + 'price/download');
        return result;
    }

    priceServiceFactory.GetMarginbyBU = function (BUId, RegionId) {
        var result = $http.get(PriceServiceURI + 'Margin/GetMarginbyBU?BU=' + BUId + '&Region=' + RegionId);
        return result;
    }
    priceServiceFactory.GetDiscountbyBU = function (BUId, RegionId) {
        var result = $http.get(PriceServiceURI + 'Discount/GetDiscountbyBU?BU=' + BUId + '&Region=' + RegionId);
        return result;
    }

    priceServiceFactory.GetDefaultcurencybyLegalEntity = function (BUId, RegionId, LegalEntity) {
        var result = $http.get(PriceServiceURI + 'ServionLegalEntity/GetDefaultcurencybyLegalEntity?SBUId=' + BUId + '&RegionId=' + RegionId + '&Legalentity=' + LegalEntity);
        return result;
    },

    priceServiceFactory.SendEmail = function (jsondata) {
        return $http.post(PriceServiceURI + 'Mail/sendmail', jsondata);
    }
    
    priceServiceFactory.PMSendEmail = function (jsondata) {
        return $http.post(PriceServiceURI + 'Mail/PMsendmail', jsondata);
    }


    priceServiceFactory.PricesheetFeedUpdatebyPayment = function (Sheetid) {
        var result = $http.get(PriceServiceURI + 'price/PricesheetFeedUpdatebyPayment?SheetId=' + Sheetid);
        return result;
    }

    return priceServiceFactory;
});


//common model
//priceServiceFactory.getPriceList = [
//    { OppId: '1', oem: 'Servion', Component: 'component1', componenttype: 'Software', pricetype: 'VAD', Cyear1: '100', Cyear2: '0', Cyear3: '0', Cyear4: '0', Cyear5: '0', CTotal: '0', Vyear1: '100', Vyear2: '0', Vyear3: '0', Vyear4: '0', Vyear5: '0', VTotal: '0', Lyear1: '100', Lyear2: '0', Lyear3: '0', Lyear4: '0', Lyear5: '0', LTotal: '0', Oyear1: '100', Oyear2: '0', Oyear3: '0', Oyear4: '0', Oyear5: '0', OTotal: '0', Syear1: '0', Syear2: '0', Syear3: '0', Syear4: '0', Syear5: '0', STotal: '0', forvendordiscount: '50', marginpercent: '5', customerdiscount: '3', distmarginpercent: '0', distdiscount: '49', lob: '50', version: 1 },
//    { OppId: '2', oem: 'Servion', Component: 'component2', componenttype: 'Software', pricetype: 'VAD', Cyear1: '100', Cyear2: '0', Cyear3: '0', Cyear4: '0', Cyear5: '0', CTotal: '0', Vyear1: '100', Vyear2: '0', Vyear3: '0', Vyear4: '0', Vyear5: '0', VTotal: '0', Lyear1: '100', Lyear2: '0', Lyear3: '0', Lyear4: '0', Lyear5: '0', LTotal: '0', Oyear1: '100', Oyear2: '0', Oyear3: '0', Oyear4: '0', Oyear5: '0', OTotal: '0', Syear1: '0', Syear2: '0', Syear3: '0', Syear4: '0', Syear5: '0', STotal: '0', forvendordiscount: '30', marginpercent: '5', customerdiscount: '3', distmarginpercent: '10', distdiscount: '100', lob: '50', version: 1 },
//    { OppId: '3', oem: 'Servion', Component: 'component3', componenttype: 'Software', pricetype: 'VAD', Cyear1: '100', Cyear2: '0', Cyear3: '0', Cyear4: '0', Cyear5: '0', CTotal: '0', Vyear1: '100', Vyear2: '0', Vyear3: '0', Vyear4: '0', Vyear5: '0', VTotal: '0', Lyear1: '100', Lyear2: '0', Lyear3: '0', Lyear4: '0', Lyear5: '0', LTotal: '0', Oyear1: '100', Oyear2: '0', Oyear3: '0', Oyear4: '0', Oyear5: '0', OTotal: '0', Syear1: '0', Syear2: '0', Syear3: '0', Syear4: '0', Syear5: '0', STotal: '0', forvendordiscount: '20', marginpercent: '5', customerdiscount: '3', distmarginpercent: '10', distdiscount: '100', lob: '50', version: 1 },
//];//_getPriceList;
