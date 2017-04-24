ReportApp.controller("GrossMarginController", function ($rootScope, $scope, $routeParams, $window, $http, priceService, paymentService, currencyService, Opportunityservice, $timeout, toaster, $location, reportFactory, GrossMarginService, paymentConfigFactory, GrossMarginService) {

    $scope.PageVariableInitialization = function () {
        $scope.GlobalIdentityOppId = $routeParams.OppId;
        $scope.GlobalGroupId = $routeParams.GroupId;
        $scope.grideditable = false;
        $scope.hasedit = false;
        $scope.GlobalIdentityOppId = $routeParams.OppId;
        $scope.dynamicPopover = {
            templateUrl: 'popover.html',
        };
        $scope.margin = {};
        $scope.margin.PS = 0;
        $scope.margin.RESOURCING = 0;
        $scope.margin.MAINTANACE = 0;
        $scope.margin.IP = 0;
        $scope.margin.HOSTED = 0;
        $scope.margin.TRADING = 0;
        $scope.margin.CONSULTING = 0;

        $scope.pageLoad = false;


        $scope.DefautState = false;

    }
    $scope.PageVariableInitialization();

    $scope.GetOpportunityList = function (id) {
        Opportunityservice.GetopportunitybyID(id).success(function (data) {

            $scope.OpportunityDetail = data[0];
            $scope.MaxSheetGroupID = $routeParams.GroupId;

            $scope.GetGrossmarginbyOppGroup($scope.OpportunityDetail.OppId, $routeParams.GroupId);
            $scope.GetPriceSheetVersionsForOpp($scope.OpportunityDetail.OppId)
            $scope.GetPriceSheetMappeddataByversion($scope.OpportunityDetail.OppId, $routeParams.GroupId);
        });
    };



    $scope.GetAllPriceSheetbyOppGroupID = function (oppid, groupid) {
        $scope.totalPSpricefromPricing = 0;
        $scope.totalPSpricefromPricingMinus = 0;
        $scope.totalMaintenancefromPricing = 0;
        $scope.totalIPpricefromPricing = 0;
        $scope.totalHostedpricefromPricing = 0;
        $scope.totalResourcingpricefromPricing = 0;
        $scope.totalTradingpricefromPricing = 0;
        $scope.totalConsultingpricefromPricing = 0;
        $scope.totalTradingpricefromPricingMinus = 0;
        $scope.totalTradingpricefromPricingPlus = 0;

        priceService.GetAllPriceSheetbyOppGroupID(oppid, groupid).success(function (data) {
            //  debugger

            angular.forEach(data, function (value, key) {
                if (value.oem == 'Servion' && value.componenttype == 'PS') {
                    $scope.totalPSpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }
                if (value.oem == 'Servion' && value.PriceType == 'COST') {
                    $scope.totalPSpricefromPricingMinus += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem == 'Servion' && value.LOBName == 'MAINTENANCE') {
                    $scope.totalMaintenancefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }
                if ((value.oem == 'Servion' || "Acqueon") && value.LOBName == 'IP') {

                    $scope.totalIPpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem == 'Servion' && value.LOBName == 'HOSTED') {

                    $scope.totalHostedpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem == 'Servion' && value.LOBName == 'RESOURCING') {

                    $scope.totalResourcingpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem != 'Servion' && value.LOBName == 'TRADING') {

                    $scope.totalTradingpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem != 'Servion' && value.LOBName == 'TRADING' && value.componenttype == "Rebate") {
                    $scope.totalTradingpricefromPricingPlus += parseFloat(value.Vyear1) + parseFloat(value.Vyear2) + parseFloat(value.Vyear3) + parseFloat(value.Vyear4) + parseFloat(value.Vyear5);
                }
                if (value.oem != 'Servion' && value.LOBName == 'TRADING') {
                    $scope.totalTradingpricefromPricingMinus += parseFloat(value.Syear1) + parseFloat(value.Syear2) + parseFloat(value.Syear3) + parseFloat(value.Syear4) + parseFloat(value.Syear5);
                }
                if (value.oem == 'Servion' && value.LOBName == 'CONSULTING') {

                    $scope.totalConsultingpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

            });


            $scope.totalPSpricefromPricing = parseFloat($scope.totalPSpricefromPricing);
            $scope.totalPSpricefromPricingMinus = parseFloat($scope.totalPSpricefromPricingMinus);
            $scope.totalMaintenancefromPricing = parseFloat($scope.totalMaintenancefromPricing);
            $scope.totalIPpricefromPricing = parseFloat($scope.totalIPpricefromPricing);
            $scope.totalHostedpricefromPricing = parseFloat($scope.totalHostedpricefromPricing);
            $scope.totalResourcingpricefromPricing = parseFloat($scope.totalResourcingpricefromPricing);
            $scope.totalTradingpricefromPricing = parseFloat($scope.totalTradingpricefromPricing);
            $scope.totalConsultingpricefromPricing = parseFloat($scope.totalConsultingpricefromPricing);
            $scope.totalTradingpricefromPricingMinus = parseFloat($scope.totalTradingpricefromPricingMinus);
            $scope.totalTradingpricefromPricingPlus = parseFloat($scope.totalTradingpricefromPricingPlus);


            $scope.TRADINGvalue = $scope.totalTradingpricefromPricingMinus;

            if ($scope.totalTradingpricefromPricing != 0)
                $scope.margin.TRADING = ((($scope.totalTradingpricefromPricing + $scope.totalTradingpricefromPricingPlus - $scope.totalTradingpricefromPricingMinus) / ($scope.totalTradingpricefromPricing)) * 100).toFixed(2);
            else
                $scope.margin.TRADING = 0;

            if ($scope.totalMaintenancefromPricing != 0)
                $scope.margin.MAINTANACE = ((($scope.totalMaintenancefromPricing - parseFloat($scope.MAINTANACEvalue)) / $scope.totalMaintenancefromPricing) * 100).toFixed(2);
            else
                $scope.margin.MAINTANACE = 0;

            if ($scope.totalIPpricefromPricing != 0)
                $scope.margin.IP = ((($scope.totalIPpricefromPricing - parseFloat($scope.IPvalue)) / $scope.totalIPpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.IP = 0;

            if ($scope.totalHostedpricefromPricing != 0)
                $scope.margin.HOSTED = ((($scope.totalHostedpricefromPricing - parseFloat($scope.HOSTEDvalue)) / $scope.totalHostedpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.HOSTED = 0;

            if ($scope.totalPSpricefromPricing != 0)
                $scope.margin.PS = ((($scope.totalPSpricefromPricing - $scope.totalPSpricefromPricingMinus - parseFloat($scope.PSvalue)) / $scope.totalPSpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.PS = 0;

            if ($scope.totalResourcingpricefromPricing != 0)
                $scope.margin.RESOURCING = ((($scope.totalResourcingpricefromPricing - parseFloat($scope.RESOURCINGvalue)) / $scope.totalResourcingpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.RESOURCING = 0;

            if ($scope.totalConsultingpricefromPricing != 0)
                $scope.margin.CONSULTING = ((($scope.totalConsultingpricefromPricing - parseFloat($scope.CONSULTINGvalue)) / $scope.totalConsultingpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.CONSULTING = 0;

            $scope.pageLoad = true;
            $scope.AddGrossMargin(true)

        }).error(function (error) {
            $scope.Error = error;
        })
    }

    $scope.GetPriceSheetVersionsForOpp = function (oppid) {
        console.log('oppid, groupid' + oppid)
        priceService.GetPriceSheetVersionsForOpp(oppid).success(function (data) {
            $scope.Versiondata = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.calculatevalue = function (calValue, input) {

        if (input == 1) {
            if ($scope.totalMaintenancefromPricing != 0) {
                if (calValue == '')
                    $scope.MAINTANACEvalue = 0;
                $scope.margin.MAINTANACE = ((($scope.totalMaintenancefromPricing - $scope.MAINTANACEvalue) / $scope.totalMaintenancefromPricing) * 100).toFixed(2);
            }
            else
                $scope.margin.MAINTANACE = 0;
        }
        else if (input == 2) {
            if ($scope.totalIPpricefromPricing != 0) {
                if (calValue == '')
                    $scope.IPvalue = 0;
                $scope.margin.IP = ((($scope.totalIPpricefromPricing - $scope.IPvalue) / $scope.totalIPpricefromPricing) * 100).toFixed(2);
            }
            else
                $scope.margin.IP = 0;
        }
        else if (input == 3) {
            if ($scope.totalHostedpricefromPricing != 0) {
                if (calValue == '')
                    $scope.HOSTEDvalue = 0;
                $scope.margin.HOSTED = ((($scope.totalHostedpricefromPricing - $scope.HOSTEDvalue) / $scope.totalHostedpricefromPricing) * 100).toFixed(2);
            }
            else
                $scope.margin.HOSTED = 0;
        }
        else if (input == 4) {
            if ($scope.totalPSpricefromPricing != 0) {
                if (calValue == '')
                    $scope.PSvalue = 0;
                $scope.margin.PS = ((($scope.totalPSpricefromPricing - $scope.totalPSpricefromPricingMinus - $scope.PSvalue) / $scope.totalPSpricefromPricing) * 100).toFixed(2);
            }
            else {
                $scope.margin.PS = 0;
            }
        }
        else if (input == 5) {
            if ($scope.totalResourcingpricefromPricing != 0) {
                if (calValue == '')
                    $scope.RESOURCINGvalue = 0;
                $scope.margin.RESOURCING = ((($scope.totalResourcingpricefromPricing - $scope.RESOURCINGvalue) / $scope.totalResourcingpricefromPricing) * 100).toFixed(2);
            }
            else
                $scope.margin.RESOURCING = 0;
        }
        else if (input == 6) {

            if ($scope.totalConsultingpricefromPricing != 0) {
                if (calValue == '')
                    $scope.CONSULTINGvalue = 0;
                $scope.margin.CONSULTING = ((($scope.totalConsultingpricefromPricing - $scope.CONSULTINGvalue) / $scope.totalConsultingpricefromPricing) * 100).toFixed(2);
            }
            else
                $scope.margin.CONSULTING = 0;
        }

    }

    $scope.GetGrossmarginbyOppGroup = function (oppid, groupid) {
        console.log('oppid, groupid' + oppid)
        GrossMarginService.GetGrossmarginbyOppGroup(oppid, groupid).success(function (data) {

            if (data != null && data.length > 0) {
                $scope.margin = {};

                // $scope.margin.PS = data[0].PS;
                // $scope.margin.RESOURCING = data[0].RESOURCING;
                // $scope.margin.MAINTANACE = data[0].MAINTANACE;
                // $scope.margin.IP = data[0].IP;
                // $scope.margin.HOSTED = data[0].HOSTED;
                // $scope.margin.TRADING = data[0].TRADING;
                // $scope.margin.CONSULTING = data[0].CONSULTING;
                if (data[0].MAINTANACEvalue == null)
                    $scope.MAINTANACEvalue = 0;
                else
                    $scope.MAINTANACEvalue = parseFloat(data[0].MAINTANACEvalue);

                if (data[0].IPvalue == null)
                    $scope.IPvalue = 0;
                else
                    $scope.IPvalue = parseFloat(data[0].IPvalue);

                if (data[0].HOSTEDvalue == null)
                    $scope.HOSTEDvalue = 0;
                else
                    $scope.HOSTEDvalue = parseFloat(data[0].HOSTEDvalue);

                if (data[0].PSvalue == null)
                    $scope.PSvalue = 0;
                else
                    $scope.PSvalue = parseFloat(data[0].PSvalue);

                if (data[0].RESOURCINGvalue == null)
                    $scope.RESOURCINGvalue = 0;
                else
                    $scope.RESOURCINGvalue = parseFloat(data[0].RESOURCINGvalue)

                if (data[0].TRADINGvalue == null)
                    $scope.TRADINGvalue = 0;
                else
                    $scope.TRADINGvalue = parseFloat(data[0].TRADINGvalue);

                if (data[0].CONSULTINGvalue == null)
                    $scope.CONSULTINGvalue = 0;
                else
                    $scope.CONSULTINGvalue = parseFloat(data[0].CONSULTINGvalue);

                $scope.call1finished = true;
                $scope.call2finished = true;
            }
            else {
                $scope.margin.PS = 0;
                $scope.margin.RESOURCING = 0;
                $scope.margin.MAINTANACE = 0;
                $scope.margin.IP = 0;
                $scope.margin.HOSTED = 0;
                $scope.margin.TRADING = 0;
                $scope.margin.CONSULTING = 0;
                $scope.MAINTANACEvalue = 0;
                $scope.IPvalue = 0;
                $scope.HOSTEDvalue = 0;
                $scope.PSvalue = 0;
                $scope.RESOURCINGvalue = 0;
                $scope.TRADINGvalue = 0;
                $scope.CONSULTINGvalue = 0;
                $scope.call1finished = true;

            }
            //by default need to load pricesheet for that payment

            $scope.GetAllPriceSheetbyOppGroupID($scope.OpportunityDetail.OppId, $routeParams.GroupId);

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetPriceSheetMappeddataByversion = function (oppid, groupid) {

        priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function (data) {
            //jay 
            $scope.MaxVersion = data[0].Version;
            $scope.MaxSheetGroupID = data[0].PriceSheetId;
            //$scope.grideditable = data[0].IsEditable;
            $scope.hasedit = data[0].IsEditable;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetMaximumGroupPriceSheetId = function () {

        priceService.GetMaximumGroupPriceSheetId().success(function (data) {
            if (data[0].count == 'null') {
                $scope.MaxSheetGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
            }

            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                //block the application
            }

        }).error(function (error) {
            $scope.Error = error;
        })

    };



    $scope.EditSheet = function () {
        //$scope.GetOpportunityList($routeParams.OppId);
        var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'GrossMargin', IsPriceSheetUpdated: false };

        priceService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {

            if (!data.IsLocked) {
                $scope.grideditable = true;
                $scope.$broadcast('timer-reset');
                $scope.$broadcast('timer-start');
                $('#showmod').modal('hide');
            }
            else {
                if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "GrossMargin") {
                    $scope.grideditable = true;
                    $scope.counter = 0;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');
                    $('#showmod').modal('hide');
                }
                else {
                    $scope.grideditable = false;
                    $scope.sheetholdedby = "LockedIn: " + data.LockedIn + " By " + data.LockedUser;
                }
            }

        }).error(function (error) {

            $scope.Error = error;
        })
    }

    //adding Paymenet sheet values
    $scope.AddGrossMargin = function (isdiscard) {
        // debugger;
        $scope.data = {};
        $scope.data.MAINTANACE = $scope.margin.MAINTANACE;
        $scope.data.IP = $scope.margin.IP;
        $scope.data.HOSTED = $scope.margin.HOSTED;
        $scope.data.PS = $scope.margin.PS;
        $scope.data.RESOURCING = $scope.margin.RESOURCING;
        $scope.data.TRADING = $scope.margin.TRADING;
        $scope.data.CONSULTING = $scope.margin.CONSULTING;
        $scope.data.MAINTANACEvalue = $scope.MAINTANACEvalue;
        $scope.data.IPvalue = $scope.IPvalue;
        $scope.data.HOSTEDvalue = $scope.HOSTEDvalue;
        $scope.data.PSvalue = $scope.PSvalue;
        $scope.data.RESOURCINGvalue = $scope.RESOURCINGvalue;
        $scope.data.TRADINGvalue = $scope.TRADINGvalue;
        $scope.data.CONSULTINGvalue = $scope.CONSULTINGvalue;
        $scope.data.MarginGroupId = $scope.MaxSheetGroupID;

        var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, SheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable, paymentsheet: $scope.data, Authour: $rootScope.UserInfo.user.userId };

        // if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null') {
        //Jsondata.Version = 'Ver_0.1';
        //Jsondata.Comment = 'Initial';
        //$routeParams.GroupId = $scope.MaxSheetGroupID;
        GrossMarginService.AddGrossMargin(Jsondata).success(function (data) {
            if (!$scope.pageLoad) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.grideditable = false;
                    // if (!isdiscard)
                    //     redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)

                    toaster.pop('success', "SAVE", 'GrossMargin Sheet Saved Successfully', 3000);

                }
                else {
                    toaster.pop('error', "Error", data.Error, null);
                }
            }
            else {
                $scope.pageLoad = false;
            }

        }).error(function (error) {

        });



        $('#showSavemodel').modal('hide');

    }

    //updating pricesheet to new version
    $scope.UpdateGrossMarginSheetVersion = function () {
        //have to work here
        priceService.GetMaximumGroupPriceSheetId().success(function (data) {
            if (data[0].count == 'null') {
                $scope.MaxSheetGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
            }
            $scope.data = {};
            $scope.data.PS = $scope.margin.PS;
            $scope.data.RESOURCING = $scope.margin.RESOURCING;
            $scope.data.MAINTANACE = $scope.margin.MAINTANACE;
            $scope.data.IP = $scope.margin.IP;
            $scope.data.HOSTED = $scope.margin.HOSTED;
            $scope.data.TRADING = $scope.margin.TRADING;
            $scope.data.CONSULTING = $scope.margin.CONSULTING;
            $scope.data.MAINTANACEvalue = $scope.MAINTANACEvalue;
            $scope.data.IPvalue = $scope.IPvalue;
            $scope.data.HOSTEDvalue = $scope.HOSTEDvalue;
            $scope.data.PSvalue = $scope.PSvalue;
            $scope.data.RESOURCINGvalue = $scope.RESOURCINGvalue;
            $scope.data.TRADINGvalue = $scope.TRADINGvalue;
            $scope.data.CONSULTINGvalue = $scope.CONSULTINGvalue;


            $scope.data.MarginGroupId = $scope.MaxSheetGroupIDForSaveAs;
            var currentversion = $scope.MaxVersion.split('_')[1];
            var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
            var version = 'Ver_' + i;

            $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;

            var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, SheetId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable, paymentsheet: $scope.data, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
            Jsondata.Version = version;
            GrossMarginService.AddGrossMargin(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.grideditable = false;
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                }
                else {
                    toaster.pop('error', "Error", data.Error, 3000);
                }
            }).error(function (error) {

            });

            $('#showsaveAsmodel').modal('hide');
        });
    }

    $scope.GetPriceSheetVersionsForOpp = function (oppid) {
        console.log('version template' + oppid)
        priceService.GetPriceSheetVersionsForOpp(oppid).success(function (data) {
            // debugger
            $scope.Versiondata = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.IncreaseAdditionalTimeToSheet = function () {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'GrossMargin' };
        priceService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
            if (!data.IsLocked) {
                $scope.hasedit = false;
                $scope.griduseredit = true;
                $scope.$broadcast('timer-add-cd-seconds', 840);
                $('#showmod').modal('hide');
            }
            else {
                $scope.sheetholdedby = data.LockedUser;

                if (data.LockedUser == $rootScope.UserInfo.user.userId) {
                    $scope.hasedit = false;
                    $scope.griduseredit = true;
                    $scope.grideditable = true;
                    $scope.counter = 0;
                    $scope.$broadcast('timer-add-cd-seconds', 840);
                    $('#showmod').modal('hide');
                }
                else {
                    $scope.grideditable = false;
                    $scope.hasedit = true;
                    $scope.griduseredit = false;
                    $scope.sheetholdedby = 'Error occured..';
                }
            }
            $scope.onLoad();

        }).error(function (error) {

            $scope.Error = error;
        })
    }

    //pop up data 
    $scope.closepopup = function () {
        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
    }

    $scope.finished = function () {
        $('#showmod').modal('show');
    }

    $scope.AddGrossMarginpop = function () {
        $('#showSavemodel').modal('show');
    }

    $scope.CancelGrossMargin = function () {
        $('#showSavemodel').modal('hide');
    }

    $scope.saveasGrossMarginpop = function () {
        $('#showsaveAsmodel').modal('show');
    }

    $scope.CancelGrossMarginsaveas = function () {
        $('#showsaveAsmodel').modal('hide');
    }

    $scope.onBtExport = function () {


        paymentService.ExportToExcelSheet($routeParams.OppId, $routeParams.GroupId).success(function (data) {
            console.log(data);
            var url = BaseURL + 'ExportFiles/' + data.name;

            $scope.downloadurl = url;
            $scope.filename = data.name;
            setTimeout(function () {
                $('#downloadpdf')[0].click();
            }, 1000);

        }).error(function (error) {
            $scope.Error = error;
        })

    }

    //pop up data 

    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        //if ($scope.grideditable) {
        //    $('#showSaveChangesmodel').modal('show');
        //    event.preventDefault();
        //}
    });


    $scope.saveasGrossMargindiscard = function () {
        $scope.grideditable = false;
        $scope.AddGrossMargin(true);
        $('#showSaveChangesmodel').modal('hide');
        // var url = $scope.newnavigateURl.split('#');
        // $location.path(url[1]);
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.CancelGrossMargindiscard = function () {
        $scope.grideditable = false;
        $scope.IgnoreChanges();
        $('#showSaveChangesmodel').modal('hide');
        // var url = $scope.newnavigateURl.split('#');
        // $location.path(url[1]);
        $window.location.href = $scope.newnavigateURl;
    }


    $scope.MakeContainerFullScreen = function (state) {
        $scope.DefautState = !state;
        if ($scope.DefautState) {
            document.getElementsByClassName('main-sidebar')[0].style.display = "none";
            document.getElementsByClassName('main-header')[0].style.display = "none";
            document.getElementsByClassName('main-footer')[0].style.display = "none";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = "0px";
            //style.marginLeft = "0px!important";
        }
        else {
            document.getElementsByClassName('main-sidebar')[0].style.display = "block";
            document.getElementsByClassName('main-header')[0].style.display = "block";
            document.getElementsByClassName('main-footer')[0].style.display = "block";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = null;
        }
    }

    //refresh page when data done
    function redirectRefreshPage(oppId, groupId) {
        $location.path("GrossMargin/" + oppId + "/" + groupId);
    }



    $scope.MakeContainerFullScreen = function (state) {
        $scope.DefautState = !state;
        if ($scope.DefautState) {
            document.getElementsByClassName('main-sidebar')[0].style.display = "none";
            document.getElementsByClassName('main-header')[0].style.display = "none";
            document.getElementsByClassName('main-footer')[0].style.display = "none";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = "0px";
        }
        else {
            document.getElementsByClassName('main-sidebar')[0].style.display = "block";
            document.getElementsByClassName('main-header')[0].style.display = "block";
            document.getElementsByClassName('main-footer')[0].style.display = "block";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = null;
        }

    }


    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.grideditable) {
            $('#showSaveChangesmodel').modal('show');
            event.preventDefault();
        }
    });


    $scope.IgnoreChanges = function () {
        $scope.$broadcast('timer-stop');
        priceService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function (data) {
            //alert(data)
            $scope.grideditable = false;
            $scope.GetOpportunityList($routeParams.OppId);
        }).error(function (error) {

            $scope.Error = error;
        })
    }


    $scope.ClosePriceSheetdiscard = function () {
        $('#showSaveChangesmodel').modal('hide');
    }

    $scope.IsPageReadOnly = function () {
        var isRead = true;
        $scope.IsReadOnly = true;
        reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName == 'GrossMargin Write') {
                    isRead = false;
                }
            })
            if (!isRead) {
                $scope.IsReadOnly = false;
            }
        });
    }


    $scope.PutComma = function (x) {
        x = x.toString();
        var afterPoint = '';
        if (x.indexOf('.') > 0)
            afterPoint = x.substring(x.indexOf('.'), x.length);
        x = Math.floor(x);
        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree + afterPoint;

        return res;
    }

    $scope.InitApiCalls = function () {
        //first call to pricesheet
        $scope.IsPageReadOnly();
        $scope.GetOpportunityList($routeParams.OppId);
        $scope.GetMaximumGroupPriceSheetId();
    }

    $scope.InitApiCalls()

});


