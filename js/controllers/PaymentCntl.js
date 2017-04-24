ReportApp.controller("PaymentController", function($scope, $rootScope, $routeParams, $window, $http, priceService, currencyService, Opportunityservice, $timeout, toaster, $location, reportFactory, paymentService, paymentConfigFactory, _) {

    $scope.PageVariableInitializationPayment = function() {

        $scope.GlobalIdentityOppId_payment = $routeParams.OppId;
        $scope.GlobalGroupId_payment = $routeParams.GroupId;

        $scope.call1finished_payment = false;
        $scope.call2finished_payment = false;
        $scope.call3finished_payment = false;
        $scope.call4finished_payment = false;
        $scope.call5finished_payment = true;
        $scope.call6finished_payment = false; // for payment period
        $scope.grideditable_payment = false;
        $scope.hasedit_payment = false;
        $scope.iscellrefresh_payment = false;
        $scope.isPricingSheetUpdated = false;

        $scope.GlobalIdentityOppId_payment = $routeParams.OppId;
        $scope.showmsg_payment = true;
        $scope.SelectOptions_payment = []
        $scope.dynamicPopover_payment = {
            templateUrl: 'popover.html',
        };

        $scope.DefautState_payment = false;

        //variable declaration
        $scope.componentList_payment = [];
        $scope.OEMOptions_payment = [];
        $scope.PSdata_payment = [];
        $scope.hasslice_payment = false;
        $scope.gridPayment = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            //enableFilter: true,
            groupHeaders: true,
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.data,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            //enableCellExpressions: true,
            suppressMovableColumns: true,
            singleClickEdit: true,

            icons: {
                menu: '<i class="fa fa-bars"/>',
                // filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
            },

            pinnedColumnCount: 1,

        };


        $scope.calculatedTotalinPayment = 0;
        $scope.calculatedTotalinPricing = 0;

    }

    $scope.PageVariableInitializationPayment();

    
    //initialize Grid options


  

    $scope.GetOpportunityList_payment = function(id) {
        Opportunityservice.GetopportunitybyID(id).success(function(data) {
            if (data != null && data.length > 0) {
                $scope.OpportunityDetail = data[0];
                $scope.MaxSheetGroupID = $routeParams.GroupId;
                //  $scope.GetPriceSheetByversion($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                $scope.$scope.GetPaymentSheetbyOppGroup_payment($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                $scope.GetPriceSheetVersionsForOpp_payment($scope.OpportunityDetail.OppId)
                //have to decide here
                // $scope.GetPriceSheetVersionsForOpp_payment($scope.OpportunityDetail.OppId);
            }
            else {
                toaster.pop('error', "Error", 'Invalid Opportunity Details', null);
                //redirect to Home Page
                $location.path("home");
            }

        });
    };

    $scope.GetPriceSheetVersionsForOpp_payment = function(oppid) {

        console.log('oppid, groupid' + oppid)

        priceService.GetPriceSheetVersionsForOpp(oppid).success(function(data) {
            $scope.Versiondata = data;
            _.each($scope.Versiondata, function(value, key) {
                if (value["PriceSheetId"] == $scope.GlobalGroupId_payment) {
                    if (value["IsPriceSheetUpdated"]) {
                        $scope.isPricingSheetUpdated = value["IsPriceSheetUpdated"];
                    }

                }
            });

        }).error(function(error) {
            $scope.Error = error;
        })

    };

    $scope.$scope.GetPaymentSheetbyOppGroup_payment = function(oppid, groupid) {
        console.log('oppid, groupid' + oppid)
        paymentService.GetPaymentSheetbyOppGroup(oppid, groupid).success(function(data) {

            if (data != null && data.length > 0) {
                localStorage.removeItem('price');
                localStorage.setItem('price', JSON.stringify(data));
                //$scope.Sourcedata = data;
                $scope.call1finished_payment = true;
                $scope.call2finished_payment = true;
                $scope.callifAPIDone();
            }
            else {
                $scope.call1finished_payment = true;
                $scope.GetPaymentDefaultConfiguration($scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId);
            }
            //by default need to load pricesheet for that payment
            $scope.GetAllPriceSheetbyOppGroupID_payment($scope.OpportunityDetail.OppId, $routeParams.GroupId);
            $scope.GetPriceSheetMappeddataByversion_payment($scope.OpportunityDetail.OppId, $routeParams.GroupId);
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetPriceSheetMappeddataByversion_payment = function(oppid, groupid) {

        priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function(data) {
            //jay 

            $scope.MaxVersion = data[0].Version;
            $scope.MaxSheetGroupID = data[0].PriceSheetId;
            //$scope.grideditable_payment = data[0].IsEditable;
            $scope.hasedit_payment = data[0].IsEditable;
            $scope.call4finished_payment = true;
            $scope.callifAPIDone();


        }).error(function(error) {
            $scope.Error = error;
        })
    };


    $scope.GetMaximumGroupPriceSheetId = function() {

        priceService.GetMaximumGroupPriceSheetId().success(function(data) {
            if (data[0].count == 'null') {
                $scope.MaxSheetGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
            }

            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                //block the application
            }

            $scope.call5finished_payment = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })

    };

    //getting default configuration for payment sheet based on BU and Region
    $scope.GetPaymentDefaultConfiguration = function(BU, Region) {

        paymentConfigFactory.GetPaymentConfig(BU, Region).success(function(data) {
            //paymentService.GetPaymentDefaultConfiguration(BU, Region).success(function (data) {
            if (data != null && data.length > 0) {
                localStorage.removeItem('price');
                localStorage.setItem('price', JSON.stringify(data));
                //$scope.Sourcedata = data;
                console.log(data)
                $scope.call2finished_payment = true;
                $scope.callifAPIDone();
            }
            else {
                //Default data not available then populate with 0 values
                //default configuration mapped for sbu=0 and region=0 -> DB
                paymentConfigFactory.GetPaymentConfig(0, 0).success(function(data) {
                    localStorage.removeItem('price');
                    localStorage.setItem('price', JSON.stringify(data));
                    $scope.call2finished_payment = true;
                    $scope.callifAPIDone();
                }).error(function(error) {
                    $scope.Error = error;
                })
            }
        }).error(function(error) {
            $scope.Error = error;
        })
    };



    $scope.GetPaymentPeriod = function() {

        paymentService.GetPaymentPeriod().success(function(data) {

            $scope.SelectOptions_payment = data;
            $scope.call6finished_payment = true;
            $scope.callifAPIDone();

        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.getAllComponentType_payment = function() {
        priceService.GetAllComponentType().success(function(data) {
            $scope.componentList_payment = data;
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetOemOptions_payment = function() {
        priceService.GetAllOEM().success(function(data) {
            $scope.OEMOptions_payment = data;
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    //getting pricesheet data by groupid
    $scope.GetAllPriceSheetbyOppGroupID_payment = function(oppid, groupid) {
        priceService.GetAllPriceSheetbyOppGroupID(oppid, groupid).success(function(data) {
            var totalcustomerpricefromPricing = 0;
            $scope.PSdata_payment = [];
            angular.forEach(data, function(value, key) {
                if (value.oem != '--Select--' && value.componenttype != '--Select--') {
                    $scope.PSdata_payment.push(value);
                    totalcustomerpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }
            });
            $scope.calculatedTotalinPricing = parseInt(totalcustomerpricefromPricing);
            $scope.call3finished_payment = true;

            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    }

    //end service calls



    //processing master and slave grid content 
    function docalculationforpayment() {
        //debugger;
        $scope.slicearrayCnt = 0;
        $scope.data = [];
        $scope.data = JSON.parse(localStorage.getItem('price'));
        //  addrowforTotalPercentageUtilizeamount();
        for (var slicloop = 0; slicloop < $scope.slicearrayCnt; slicloop++) {
            $scope['Distinctedarray' + slicloop] = [];
            $scope['slicearray' + slicloop] = [];
        }

        if ($scope.data != null) {
            var cnt = $scope.PSdata_payment.length;
            for (var i = 0; i < $scope.data.length; i++) {
                $scope.data[i].Iyear1 = $scope.data[i].Iyear2 = $scope.data[i].Iyear3 = $scope.data[i].Iyear4 = $scope.data[i].Iyear5 = 0;

                if ($scope.data[i].PercentageType == "Yes") {

                    if ($scope.data[i].VendorBreakdown == "Yes") {

                        $scope.hasslice_payment = true;
                        $scope['slicearray' + $scope.slicearrayCnt] = [];
                        $scope['Distinctedarray' + $scope.slicearrayCnt] = [];

                        for (var j = 0; j < cnt; j++) {
                            $scope['slicearray' + $scope.slicearrayCnt].push({ colid: i, MilestoneDescription: $scope.PSdata_payment[j].oem, Code: '', SubPaymentCode: $scope.data[i].PaymentCode, Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: 0, percentageTotal: 0, OEMHWandSW: '--', OEMServices: '--', OEMPS: '--', SERVSW: '--', SERVServices: '--', SERVPS: '--', SERVResource: '--', SERVCare: '--', Others1: '--', Others2: '--', Others3: '--' });
                            paymentpercentcalc(i, j)
                        }
                        $scope.slicearrayCnt++;
                    }
                    else {
                        $scope.hasslice_payment = false;
                        paymentpercentcalc(i, 0)
                    }
                }
                else {
                    if ($scope.data[i].PaymentCode != 'S9' && $scope.data[i].PaymentCode != 'S10') {
                        if ($scope.data[i].OEMHWandSW != '--Select--' && $scope.data[i].OEMHWandSW != '--' && $scope.data[i].OEMHWandSW != '0') {
                            calculatevaluesfromsheetoemdata(i, 'Hardware', 100);
                            calculatevaluesfromsheetoemdata(i, 'Software', 100);
                            calculatevaluesfromsheetoemdata(i, 'HW&SW', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].OEMHWandSW)
                        }
                        else {
                            $scope.data[i].OEMHWandSW = '--Select--';
                        }
                        if ($scope.data[i].OEMServices != '--Select--' && $scope.data[i].OEMServices != '--' && $scope.data[i].OEMServices != '0') {
                            calculatevaluesfromsheetoemdata(i, 'AMC-HW', 100);
                            calculatevaluesfromsheetoemdata(i, 'AMC-SW', 100);
                            calculatevaluesfromsheetoemdata(i, 'AMC-HW&SW', 100);
                            calculatevaluesfromsheetoemdata(i, 'AMC-PS', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].OEMServices)
                        }
                        else {
                            $scope.data[i].OEMServices = '--Select--';
                        }

                        if ($scope.data[i].OEMPS != '--Select--' && $scope.data[i].OEMPS != '--' && $scope.data[i].OEMPS != '0') {
                            calculatevaluesfromsheetoemdata(i, 'PS', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].OEMPS)
                        }
                        else {
                            $scope.data[i].OEMPS = '--Select--';
                        }

                        if ($scope.data[i].OEMOther != '--Select--' && $scope.data[i].OEMOther != '--' && $scope.data[i].OEMOther != '0') {
                            calculatevaluesfromsheetoemdata(i, "ServCare", 100);
                            calculatevaluesfromsheetoemdata(i, "T&M", 100);
                            calculatevaluesfromsheetoemdata(i, "Consulting", 100);
                            calculatevaluesfromsheetoemdata(i, "Resourcing", 100);
                            calculatevaluesfromsheetoemdata(i, "Hosted", 100);
                            calculatevaluesfromsheetoemdata(i, "Rebate", 100);
                            calculatevaluesfromsheetoemdata(i, "OTHER", 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].OEMOther)
                        }
                        else {
                            $scope.data[i].OEMOther = '--Select--';
                        }
                        if ($scope.data[i].SERVSW != '--Select--' && $scope.data[i].SERVSW != '--' && $scope.data[i].SERVSW != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'Software', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVSW)
                        }
                        else {
                            $scope.data[i].SERVSW = '--Select--';
                        }
                        if ($scope.data[i].SERVServices != '--Select--' && $scope.data[i].SERVServices != '--' && $scope.data[i].SERVServices != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'AMC-SW', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVServices)
                        }
                        else {
                            $scope.data[i].SERVServices = '--Select--';
                        }
                        if ($scope.data[i].SERVPS != '--Select--' && $scope.data[i].SERVPS != '--' && $scope.data[i].SERVPS != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'PS', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVPS)
                        }
                        else {
                            $scope.data[i].SERVPS = '--Select--';
                        }
                        if ($scope.data[i].SERVConsulting != '--Select--' && $scope.data[i].SERVConsulting != '--' && $scope.data[i].SERVConsulting != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'Consulting', 100)
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVConsulting)
                        }
                        else {
                            $scope.data[i].SERVConsulting = '--Select--';
                        }
                        if ($scope.data[i].SERVCare != '--Select--' && $scope.data[i].SERVCare != '--' && $scope.data[i].SERVCare != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'ServCare', 100)
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVCare)
                        }
                        else {
                            $scope.data[i].SERVCare = '--Select--';
                        }
                        if ($scope.data[i].SERVOther != '--Select--' && $scope.data[i].SERVOther != '--' && $scope.data[i].SERVOther != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', "Hardware", 100)
                            calculatevaluesfromsheetserviondata(i, 'Servion', "HW&SW", 100)
                            calculatevaluesfromsheetserviondata(i, 'Servion', "AMC-HW", 100)
                            calculatevaluesfromsheetserviondata(i, 'Servion', "AMC-HW&SW", 100)
                            calculatevaluesfromsheetserviondata(i, 'Servion', "AMC-PS", 100)
                            calculatevaluesfromsheetserviondata(i, 'Servion', "Rebate", 100)
                            calculatevaluesfromsheetserviondata(i, 'Servion', "OTHER", 100)
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVOther)
                        }
                        else {
                            $scope.data[i].SERVOther = '--Select--';
                        }
                        if ($scope.data[i].SERVResource != '--Select--' && $scope.data[i].SERVResource != '--' && $scope.data[i].SERVResource != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'Resourcing', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVResource)
                        }
                        else {
                            $scope.data[i].SERVResource = '--Select--';
                        }
                        if ($scope.data[i].SERVTM != '--Select--' && $scope.data[i].SERVTM != '--' && $scope.data[i].SERVTM != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'T&M', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].SERVTM)
                        }
                        else {
                            $scope.data[i].SERVTM = '--Select--';
                        }
                        if ($scope.data[i].SERVHosted != '--Select--' && $scope.data[i].SERVHosted != '--' && $scope.data[i].SERVHosted != '0') {
                            calculatevaluesfromsheetserviondata(i, 'Servion', 'Hosted', 100);
                            $scope.data[i].MilestoneDescription = replacename($scope.data[i].MilestoneDescription, $scope.data[i].Hosted)
                        }
                        else {
                            $scope.data[i].SERVHosted = '--Select--';
                        }



                    }
                    else {
                        $scope.data[i].OEMHWandSW = '--';
                        $scope.data[i].OEMServices = '--';
                        $scope.data[i].OEMPS = '--';
                        $scope.data[i].OEMOther = '--';
                        $scope.data[i].SERVSW = '--';
                        $scope.data[i].SERVServices = '--';
                        $scope.data[i].SERVPS = '--';
                        $scope.data[i].SERVConsulting = '--';
                        $scope.data[i].SERVCare = '--';
                        $scope.data[i].SERVOther = '--';
                        $scope.data[i].SERVResource = '--';
                        $scope.data[i].SERVTM = '--';
                        $scope.data[i].SERVHosted = '--';
                    }
                }

                if ($scope.data[i].PaymentCode == 'S9') {
                    getDutyandtax(i);
                }
                else if ($scope.data[i].PaymentCode == 'S10') {
                    getTravelandexpense(i);
                }
            }
            // localStorage.removeItem('price');

            // localStorage.setItem('price', JSON.stringify($scope.data));

            for (var slicloop = 0; slicloop < $scope.slicearrayCnt; slicloop++) {
                GetDistinctOEMVendordrilldown($scope['slicearray' + slicloop], slicloop)
            }

            $scope.passedvalue = 0;
            $scope.maxrowinserted = 0;
            $scope.lastmaxrow = 0;

            for (var slicloop = 0; slicloop < $scope.slicearrayCnt; slicloop++) {

                var init = 0;
                var curentrowid = findParentappendrowID($scope.passedvalue);
                $scope.passedvalue = curentrowid;

                var len = 0;
                if ($scope.maxrowinserted == 0) {
                    $scope.maxrowinserted = curentrowid;
                    len = curentrowid + ($scope['Distinctedarray' + slicloop].length);
                }
                else {
                    $scope.maxrowinserted += $scope.passedvalue - $scope.lastmaxrow;
                    len = $scope.maxrowinserted + ($scope['Distinctedarray' + slicloop].length);
                }

                for ($scope.maxrowinserted; $scope.maxrowinserted < len; $scope.maxrowinserted++) {
                    $scope.data.splice($scope.maxrowinserted, 0, $scope['Distinctedarray' + slicloop][init++]);
                }
                $scope.lastmaxrow = curentrowid;
                $scope.maxrowinserted = len;
            }
            //total calculation for percentage in sheet
            //$scope.data.splice($scope.data.length, 0, addrowforTotalPercentageUtilize($scope.data));
            addrowforTotalPercentageUtilize($scope.data);
            //addrowforTotalPercentageUtilize($scope.data);
            dopercentageforeachrow()
            //$scope.data.splice($scope.data.length, 0, addrowforTotalPercentageUtilizeamount($scope.data[0]));


        }
        $scope.onLoad_payment();
        $scope.iscellrefresh_payment = false;

    }

    function getDutyandtax(i) {
        angular.forEach($scope.PSdata, function(value, key) {
            $scope.data[i].Iyear1 += parseFloat(value.DTyear1);
            $scope.data[i].Iyear2 += parseFloat(value.DTyear2);
            $scope.data[i].Iyear3 += parseFloat(value.DTyear3);
            $scope.data[i].Iyear4 += parseFloat(value.DTyear4);
            $scope.data[i].Iyear5 += parseFloat(value.DTyear5);

        });
    }


    function getTravelandexpense(i) {
        angular.forEach($scope.PSdata, function(value, key) {
            if (value.componenttype == "T&E" && (value.pricetype == "Transfer" || value.pricetype == "List")) {
                $scope.data[i].Iyear1 += parseFloat(value.Cyear1);
                $scope.data[i].Iyear2 += parseFloat(value.Cyear2);
                $scope.data[i].Iyear3 += parseFloat(value.Cyear3);
                $scope.data[i].Iyear4 += parseFloat(value.Cyear4);
                $scope.data[i].Iyear5 += parseFloat(value.Cyear5);
            }
        });
    }


    function replacename(str, newValue) {

        str = str.replace("--Select--", newValue);
        str = str.replace("Monthly", newValue);
        str = str.replace("Weekly", newValue);
        str = str.replace("Quaterly", newValue);

        return str;
    }


    //percentage from total
    function dopercentageforeachrow() {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].Iyear1 != 0 || $scope.data[i].Iyear2 != 0 || $scope.data[i].Iyear3 != 0 || $scope.data[i].Iyear4 != 0 || $scope.data[i].Iyear5 != 0) {
                if ($scope.data[i].PaymentCode != 'S9' && $scope.data[i].PaymentCode != 'S10') {

                    var sbtot = parseFloat((parseFloat($scope.data[i].Iyear1) + parseFloat($scope.data[i].Iyear2) + parseFloat($scope.data[i].Iyear3) + parseFloat($scope.data[i].Iyear4) + parseFloat($scope.data[i].Iyear5)));
                    $scope.data[i].percentageTotal = parseFloat((sbtot / $scope.calculatedTotalinPricing) * 100).toFixed(5);
                }
                else {
                    $scope.data[i].percentageTotal = 0;
                }
            }
            else {
                $scope.data[i].percentageTotal = 0;
            }
        }

    }

    //have to find where to place drill down row data
    function findParentappendrowID(value) {

        var rowfinder = JSON.parse(localStorage.getItem('price'));
        for (value; value < rowfinder.length; value++) {
            if (rowfinder[value].VendorBreakdown == 'Yes') {
                return value + 1;
            }
        }
    }

    //distinct drilldown based on OEM/Vendor
    function GetDistinctOEMVendordrilldown(drildata, slicloop) {

        $scope['Distinctedarray' + slicloop] = [];

        for (var i = 0; i < $scope.OEMOptions_payment.length; i++) {
            $scope.newarray = [];
            var returnobj = dodistinct(drildata, $scope.OEMOptions_payment[i].VendorName);
            if (returnobj != null) {
                $scope['Distinctedarray' + slicloop].push(returnobj);
            }
        }

    }

    //distinct dril work
    function dodistinct(drildata, OEMName) {
        var json = {
            MilestoneDescription: '', Code: '', SubPaymentCode: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: 0, percentageTotal: 0, OEMHWandSW: '--', OEMServices: '--', OEMPS: '--', OEMOther: '--', SERVSW: '--', SERVServices: '--', SERVPS: '--', SERVConsulting: '--', SERVCare: '--', SERVOther: '--', SERVResource: '--', SERVTM: '--', SERVHosted: '--'
        };
        var ismodified = false;

        angular.forEach(drildata, function(value, key) {

            if (value.MilestoneDescription == OEMName) {
                ismodified = true;
                json.SubPaymentCode = value.SubPaymentCode;
                json.MilestoneDescription = value.MilestoneDescription;
                json.Iyear1 += parseFloat(value.Iyear1);
                json.Iyear2 += parseFloat(value.Iyear2);
                json.Iyear3 += parseFloat(value.Iyear3);
                json.Iyear4 += parseFloat(value.Iyear4);
                json.Iyear5 += parseFloat(value.Iyear5);
            }
        });
        if (ismodified) {
            return json;
        }
        else {
            return null;
        }
    }

    //total calculation for complete data
    function addrowforTotalPercentageUtilize(data) {

        $scope.calculatedTotalinPayment = 0;
        $scope.Finalcalculatedrow = {};
        var Jsondata = { MilestoneDescription: 'Notes', Code: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: '0', percentageTotal: '0', OEMHWandSW: 0, OEMServices: 0, OEMPS: 0, OEMOther: 0, SERVSW: 0, SERVServices: 0, SERVPS: 0, SERVResource: 0, SERVCare: 0, SERVOther: 0, SERVConsulting: 0, SERVHosted: 0, SERVTM: 0 };

        angular.forEach(data, function(value, key) {

            if (value.PaymentCode != '' && value.PercentageType == 'Yes' && value.PaymentCode != 'S9' && value.PaymentCode != 'S10') {
                Jsondata.OEMHWandSW = parseFloat(Jsondata.OEMHWandSW) + parseFloat(value.OEMHWandSW);
                Jsondata.OEMServices = parseFloat(Jsondata.OEMServices) + parseFloat(value.OEMServices);
                Jsondata.OEMPS = parseFloat(Jsondata.OEMPS) + parseFloat(value.OEMPS);
                Jsondata.SERVSW = parseFloat(Jsondata.SERVSW) + parseFloat(value.SERVSW);
                Jsondata.SERVServices = parseFloat(Jsondata.SERVServices) + parseFloat(value.SERVServices);
                Jsondata.SERVPS = parseFloat(Jsondata.SERVPS) + parseFloat(value.SERVPS);
                // Jsondata.SERVResource =+ parseInt(value.SERVResource);
                Jsondata.SERVCare = parseFloat(Jsondata.SERVCare) + parseFloat(value.SERVCare);

                Jsondata.OEMOther = parseFloat(Jsondata.OEMOther) + parseFloat(value.OEMOther);
                Jsondata.SERVConsulting = parseFloat(Jsondata.SERVConsulting) + parseFloat(value.SERVConsulting);
                Jsondata.SERVOther = parseFloat(Jsondata.SERVOther) + parseFloat(value.SERVOther);
                //    Jsondata.SERVHosted =+ parseInt(value.SERVHosted);
                //    Jsondata.SERVTM =+ parseInt(value.SERVTM);
            }
            else if (value.PaymentCode != '' && value.PercentageType == 'No' && value.PaymentCode != 'S9' && value.PaymentCode != 'S10') {

                if (value.OEMHWandSW != '--Select--' && value.OEMHWandSW != '0')
                    Jsondata.OEMHWandSW = parseFloat(Jsondata.OEMHWandSW) + 100;
                if (value.OEMServices != '--Select--' && value.OEMServices != '0')
                    Jsondata.OEMServices = parseFloat(Jsondata.OEMServices) + 100;
                if (value.OEMPS != '--Select--' && value.OEMPS != '0')
                    Jsondata.OEMPS = parseFloat(Jsondata.OEMPS) + 100;
                if (value.SERVSW != '--Select--' && value.SERVSW != '0')
                    Jsondata.SERVSW = parseFloat(Jsondata.SERVSW) + 100;
                if (value.SERVServices != '--Select--' && value.SERVServices != '0')
                    Jsondata.SERVServices = parseFloat(Jsondata.SERVServices) + 100;
                if (value.SERVPS != '--Select--' && value.SERVPS != '0')
                    Jsondata.SERVPS = parseFloat(Jsondata.SERVPS) + 100;

                if (value.SERVCare != '--Select--' && value.SERVCare != '0')
                    Jsondata.SERVCare = parseFloat(Jsondata.SERVCare) + 100;
                if (value.OEMOther != '--Select--' && value.OEMOther != '0')
                    Jsondata.OEMOther = parseFloat(Jsondata.OEMOther) + 100;
                if (value.SERVConsulting != '--Select--' && value.SERVConsulting != '0')
                    Jsondata.SERVConsulting = parseFloat(Jsondata.SERVConsulting) + 100;
                if (value.SERVOther != '--Select--' && value.SERVOther != '0')
                    Jsondata.SERVOther = parseFloat(Jsondata.SERVOther) + 100;

                if (value.SERVResource != '--Select--' && value.SERVResource != '0')
                    Jsondata.SERVResource = parseFloat(Jsondata.SERVResource) + 100;
                if (value.SERVTM != '--Select--' && value.SERVTM != '0')
                    Jsondata.SERVTM = parseFloat(Jsondata.SERVTM) + 100;
                if (value.SERVHosted != '--Select--' && value.SERVHosted != '0')
                    Jsondata.SERVHosted = parseFloat(Jsondata.SERVHosted) + 100;
            }

            if (value.PaymentCode != 'S9') {
                Jsondata.Iyear1 = parseFloat(Jsondata.Iyear1) + parseFloat(value.Iyear1);
                Jsondata.Iyear2 = parseFloat(Jsondata.Iyear2) + parseFloat(value.Iyear2);
                Jsondata.Iyear3 = parseFloat(Jsondata.Iyear3) + parseFloat(value.Iyear3);
                Jsondata.Iyear4 = parseFloat(Jsondata.Iyear4) + parseFloat(value.Iyear4);
                Jsondata.Iyear5 = parseFloat(Jsondata.Iyear5) + parseFloat(value.Iyear5);
            }

        });


        $scope.Finalcalculatedrow = Jsondata;

        var total = Jsondata.Iyear1 + Jsondata.Iyear2 + Jsondata.Iyear3 + Jsondata.Iyear4 + Jsondata.Iyear5;

        $scope.calculatedTotalinPayment = Math.round(total);
        return Jsondata;
    }

    //total calculation for complete data final amount
    function addrowforTotalPercentageUtilizeamount() {
        $scope.hasslice_payment = false;
        $scope.isfinal = true;
        var Jsondata = { MilestoneDescription: 'calculation', Code: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: '0', percentageTotal: '0', OEMHWandSW: 0, OEMServices: 0, OEMPS: 0, OEMOther: 0, SERVSW: 0, SERVServices: 0, SERVPS: 0, SERVCare: 0, SERVOther: 0, SERVConsulting: 0, SERVResource: '0', SERVHosted: '0', SERVTM: '0' };

        Jsondata.OEMHWandSW = calculatevaluesfromsheetoemdata(0, 'Hardware', 100) + calculatevaluesfromsheetoemdata(0, 'Software', 100) + calculatevaluesfromsheetoemdata(0, 'HW&SW', 100);
        Jsondata.OEMServices = calculatevaluesfromsheetoemdata(0, 'AMC-HW', 100) + calculatevaluesfromsheetoemdata(0, 'AMC-SW', 100) + calculatevaluesfromsheetoemdata(0, 'AMC-HW&SW', 100) + calculatevaluesfromsheetoemdata(0, 'AMC-PS', 100);
        Jsondata.OEMPS = calculatevaluesfromsheetoemdata(0, 'PS', 100);
        Jsondata.SERVSW = calculatevaluesfromsheetserviondata(0, 'Servion', 'Software', 100);
        Jsondata.SERVServices = calculatevaluesfromsheetserviondata(0, 'Servion', 'AMC-SW', 100);
        Jsondata.SERVPS = calculatevaluesfromsheetserviondata(0, 'Servion', 'PS', 100);
        Jsondata.SERVResource = calculatevaluesfromsheetserviondata(0, 'Servion', 'Resourcing', 100) + calculatevaluesfromsheetserviondata(0, 'Servion', 'T&M', 100);
        Jsondata.SERVCare = calculatevaluesfromsheetserviondata(0, 'Servion', 'ServCare', 100)
        Jsondata.SERVConsulting = calculatevaluesfromsheetserviondata(0, 'Servion', 'Consulting', 100)
        Jsondata.OEMOther = calculatevaluesfromsheetoemdata(0, "ServCare", 100) + calculatevaluesfromsheetoemdata(0, "T&M", 100) + calculatevaluesfromsheetoemdata(0, "Consulting", 100) + calculatevaluesfromsheetoemdata(0, "Resourcing", 100) + calculatevaluesfromsheetoemdata(0, "Hosted", 100) + calculatevaluesfromsheetoemdata(0, "Rebate", 100) + calculatevaluesfromsheetoemdata(0, "OTHER", 100);
        Jsondata.SERVOther = calculatevaluesfromsheetserviondata(0, 'Servion', "Hardware", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "HW&SW", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "AMC-HW", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "AMC-HW&SW", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "AMC-PS", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "Rebate", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "OTHER", 100);
        Jsondata.SERVTM = 0;
        Jsondata.SERVTM = String(Jsondata.SERVTM);
        Jsondata.SERVResource = String(Jsondata.SERVResource);
        Jsondata.SERVHosted = String(Jsondata.SERVHosted);

        return Jsondata;
    }

    //on percentage change in cell
    function paymentpercentcalc(i, j) {
        $scope.isfinal = false;
        if (!$scope.hasslice_payment)
            j = i;

        if ($scope.data[i].OEMHWandSW != '--' && parseFloat($scope.data[i].OEMHWandSW) != 0) {
            calculatevaluesfromsheetoemdata(j, 'Hardware', parseFloat($scope.data[i].OEMHWandSW));
            calculatevaluesfromsheetoemdata(j, 'Software', parseFloat($scope.data[i].OEMHWandSW));
            calculatevaluesfromsheetoemdata(j, 'HW&SW', parseFloat($scope.data[i].OEMHWandSW));
        }

        if ($scope.data[i].OEMServices != '--' && parseFloat($scope.data[i].OEMServices) != 0) {
            calculatevaluesfromsheetoemdata(j, 'AMC-HW', parseFloat($scope.data[i].OEMServices));
            calculatevaluesfromsheetoemdata(j, 'AMC-SW', parseFloat($scope.data[i].OEMServices));
            calculatevaluesfromsheetoemdata(j, 'AMC-HW&SW', parseFloat($scope.data[i].OEMServices));
            calculatevaluesfromsheetoemdata(j, 'AMC-PS', parseFloat($scope.data[i].OEMServices));
        }

        if ($scope.data[i].OEMPS != '--' && parseFloat($scope.data[i].OEMPS) != 0) {
            calculatevaluesfromsheetoemdata(j, 'PS', parseFloat($scope.data[i].OEMPS));
        }

        if ($scope.data[i].OEMOther != '--' && parseFloat($scope.data[i].OEMOther) != 0) {
            // other than above OEM
            calculatevaluesfromsheetoemdata(j, "ServCare", parseFloat($scope.data[i].OEMOther));
            calculatevaluesfromsheetoemdata(j, "T&M", parseFloat($scope.data[i].OEMOther));
            calculatevaluesfromsheetoemdata(j, "Consulting", parseFloat($scope.data[i].OEMOther));
            calculatevaluesfromsheetoemdata(j, "Resourcing", parseFloat($scope.data[i].OEMOther));
            calculatevaluesfromsheetoemdata(j, "Hosted", parseFloat($scope.data[i].OEMOther));
            calculatevaluesfromsheetoemdata(j, "Rebate", parseFloat($scope.data[i].OEMOther));
            calculatevaluesfromsheetoemdata(j, "OTHER", parseFloat($scope.data[i].OEMOther));

        }

        if ($scope.data[i].SERVSW != '--' && parseFloat($scope.data[i].SERVSW) != 0) {
            calculatevaluesfromsheetserviondata(j, 'Servion', 'Software', parseFloat($scope.data[i].SERVSW));
        }

        if ($scope.data[i].SERVServices != '--' && parseFloat($scope.data[i].SERVServices) != 0) {
            calculatevaluesfromsheetserviondata(j, 'Servion', 'AMC-SW', parseFloat($scope.data[i].SERVServices));
        }

        if ($scope.data[i].SERVPS != '--' && parseFloat($scope.data[i].SERVPS) != 0) {
            calculatevaluesfromsheetserviondata(j, 'Servion', 'PS', parseFloat($scope.data[i].SERVPS));
        }
        if ($scope.data[i].SERVCare != '--' && parseFloat($scope.data[i].SERVCare) != 0) {
            calculatevaluesfromsheetserviondata(j, 'Servion', 'ServCare', parseFloat($scope.data[i].SERVCare))
        }
        if ($scope.data[i].SERVConsulting != '--' && parseFloat($scope.data[i].SERVConsulting) != 0) {
            calculatevaluesfromsheetserviondata(j, 'Servion', 'Consulting', parseFloat($scope.data[i].SERVConsulting))
        }

        if ($scope.data[i].SERVOther != '--' && parseFloat($scope.data[i].SERVOther) != 0) {
            //loop other than above
            calculatevaluesfromsheetserviondata(j, 'Servion', "Hardware", parseFloat($scope.data[i].SERVOther))
            calculatevaluesfromsheetserviondata(j, 'Servion', "HW&SW", parseFloat($scope.data[i].SERVOther))
            calculatevaluesfromsheetserviondata(j, 'Servion', "AMC-HW", parseFloat($scope.data[i].SERVOther))
            calculatevaluesfromsheetserviondata(j, 'Servion', "AMC-HW&SW", parseFloat($scope.data[i].SERVOther))
            calculatevaluesfromsheetserviondata(j, 'Servion', "AMC-PS", parseFloat($scope.data[i].SERVOther))
            calculatevaluesfromsheetserviondata(j, 'Servion', "Rebate", parseFloat($scope.data[i].SERVOther))
            calculatevaluesfromsheetserviondata(j, 'Servion', "OTHER", parseFloat($scope.data[i].SERVOther))
        }
        if ($scope.data[i].SERVResource != '--' && parseFloat($scope.data[i].SERVResource) != 0) {
            calculatevaluesfromsheetserviondata(i, 'Servion', 'Resourcing', parseFloat($scope.data[i].SERVResource));
        }
        if ($scope.data[i].SERVTM != '--' && parseFloat($scope.data[i].SERVTM) != 0) {
            calculatevaluesfromsheetserviondata(i, 'Servion', 'T&M', parseFloat($scope.data[i].SERVTM));
        }
        if ($scope.data[i].SERVHosted != '--' && parseFloat($scope.data[i].SERVHosted) != 0) {
            calculatevaluesfromsheetserviondata(i, 'Servion', 'Hosted', parseFloat($scope.data[i].SERVHosted));
        }
    }

    //calculation for servion
    function calculatevaluesfromsheetserviondata(i, oem, component, percentage) {
        var obj = { year1: 0, year2: 0, year3: 0, year4: 0, year5: 0 };

        if (!$scope.hasslice_payment) {
            angular.forEach($scope.PSdata, function(value, key) {
                if (value.oem == oem && value.componenttype == component) {
                    obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                    obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                    obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                    obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                    obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
                }
            });
        }
        else {
            var value = $scope.PSdata_payment[i];
            if (value.oem == oem && value.componenttype == component) {
                obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
            }
        }


        if (!$scope.isfinal) {
            if (!$scope.hasslice_payment) {

                $scope.data[i].Iyear1 = parseFloat($scope.data[i].Iyear1) + parseFloat(obj.year1);
                $scope.data[i].Iyear2 = parseFloat($scope.data[i].Iyear2) + parseFloat(obj.year2);
                $scope.data[i].Iyear3 = parseFloat($scope.data[i].Iyear3) + parseFloat(obj.year3);
                $scope.data[i].Iyear4 = parseFloat($scope.data[i].Iyear4) + parseFloat(obj.year4);
                $scope.data[i].Iyear5 = parseFloat($scope.data[i].Iyear5) + parseFloat(obj.year5);
            }
            else {
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear1 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear1) + parseFloat(obj.year1);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear2 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear2) + parseFloat(obj.year2);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear3 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear3) + parseFloat(obj.year3);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear4 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear4) + parseFloat(obj.year4);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear5 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear5) + parseFloat(obj.year5);
            }
        }
        else {
            var total = obj.year1 + obj.year2 + obj.year3 + obj.year4 + obj.year5;
            return total;
        }

    }

    //calculation for other OEM /Non servion
    function calculatevaluesfromsheetoemdata(i, component, percentage) {
        var obj = { year1: 0, year2: 0, year3: 0, year4: 0, year5: 0 };
        if (!$scope.hasslice_payment) {
            angular.forEach($scope.PSdata, function(value, key) {
                if (value.oem != "Servion" && value.componenttype == component) {
                    obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                    obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                    obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                    obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                    obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
                }
            });
        }
        else {
            var value = $scope.PSdata_payment[i];
            if (value.oem != "Servion" && value.componenttype == component) {
                obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
            }
        }
        if (!$scope.isfinal) {
            if (!$scope.hasslice_payment) {
                $scope.data[i].Iyear1 = parseFloat($scope.data[i].Iyear1) + parseFloat(obj.year1);
                $scope.data[i].Iyear2 = parseFloat($scope.data[i].Iyear2) + parseFloat(obj.year2);
                $scope.data[i].Iyear3 = parseFloat($scope.data[i].Iyear3) + parseFloat(obj.year3);
                $scope.data[i].Iyear4 = parseFloat($scope.data[i].Iyear4) + parseFloat(obj.year4);
                $scope.data[i].Iyear5 = parseFloat($scope.data[i].Iyear5) + parseFloat(obj.year5);
            }
            else {
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear1 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear1) + parseFloat(obj.year1);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear2 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear2) + parseFloat(obj.year2);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear3 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear3) + parseFloat(obj.year3);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear4 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear4) + parseFloat(obj.year4);
                $scope['slicearray' + $scope.slicearrayCnt][i].Iyear5 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear5) + parseFloat(obj.year5);
            }
        }
        else {
            var total = parseFloat(obj.year1) + parseFloat(obj.year2) + parseFloat(obj.year3) + parseFloat(obj.year4) + parseFloat(obj.year5);
            return total;
        }
    }

    function getOEMbyFilter(comptype) {
        var obj = getObjects($scope.OEMOptions_payment, 'VendorName', comptype);
        return obj;
    }

    function getCompbyFilter(comptype) {
        var obj = getObjects($scope.componentList_payment, 'ComponentType', comptype);
        return obj;
    }

    function getObjects(obj, key, val) {
        var newObj = false;
        $.each(obj, function() {
            var testObject = this;
            $.each(testObject, function(k, v) {
                //alert(k);
                if (val == v && k == key) {
                    newObj = testObject;
                }
            });
        });

        return newObj;
    }

    //checking api calls are done
    $scope.callifAPIDone = function() {
        if ($scope.call1finished_payment && $scope.call2finished_payment && $scope.call3finished_payment && $scope.call4finished_payment && $scope.call5finished_payment && $scope.call6finished_payment) {
            //price sheet call
            docalculationforpayment();

            if ($scope.isPricingSheetUpdated) {
                $scope.showmsg_payment = false;
                $scope.AddPaymentSheet('true');
                $scope.isPricingSheetUpdated = false;
                priceService.PricesheetFeedUpdatebyPayment($scope.GlobalGroupId_payment).success(function(data) {

                }).error(function(error) {
                    $scope.Error = error;
                })
            }
        }
    };

    $scope.onLoad_payment = function() {
        //Declaring column definitions
        var columnDefs = [
            {
                headerName: "Code", field: "Code", hide: true
            },
            {
                headerName: "Invoicing Milestones", field: "MilestoneDescription", width: 300, headerTooltip: "Invoicing Milestones", pinned: 'left',
                cellRenderer: function(params) {
                    if (params.data.PaymentCode == 'C1' || params.data.PaymentCode == 'C2' || params.data.PaymentCode == 'C3' || params.data.PaymentCode == 'C4' || params.data.PaymentCode == 'C5')
                        return "<a style='text-decoration: underline;' title='" + params.data.MilestoneDescription + "' data-ng-click=\"EditModel('" + params.data.PaymentCode + "','" + params.data.MilestoneDescription + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> " + params.data.MilestoneDescription + "</a>";
                    else
                        return "<span title='" + params.value + "'> " + params.data.MilestoneDescription + "</span>";
                },
                cellClassRules: {
                    'nonservion': function(params) {
                        if (params.data.PaymentCode == '' || params.data.PaymentCode == null)
                            return true;
                        else
                            return false
                    },
                }
            },
            {
                headerName: 'Invoice Values',
                groupId: "GroupA",
                children: [
                    {
                        headerName: "Year 1", field: "Iyear1", width: 90, headerTooltip: "Year1", cellRenderer: function(params) {
                            if (params.value > 0) {
                                return '<span title=' + params.value + '>' + $scope.PutComma(params.value) + '</span>';
                            }
                            else {
                                return params.value;
                            }
                        },

                    },
                    {
                        headerName: "Year 2", field: "Iyear2", width: 90, headerTooltip: "Year2", cellRenderer: function(params) {
                            if (params.value > 0) {
                                return '<span title=' + params.value + '>' + $scope.PutComma(params.value) + '</span>';
                            }
                            else {
                                return params.value;
                            }
                        },
                    },
                    {
                        headerName: "Year 3", field: "Iyear3", width: 90, headerTooltip: "Year3", cellRenderer: function(params) {
                            if (params.value > 0) {
                                return '<span title=' + params.value + '>' + $scope.PutComma(params.value) + '</span>';
                            }
                            else {
                                return params.value;
                            }
                        },
                    },
                    {
                        headerName: "Year 4", field: "Iyear4", width: 90, headerTooltip: "Year4", cellRenderer: function(params) {
                            if (params.value > 0) {
                                return '<span title=' + params.value + '>' + $scope.PutComma(params.value) + '</span>';
                            }
                            else {
                                return params.value;
                            }
                        },
                    },
                    {
                        headerName: "Year 5", field: "Iyear5", width: 90, headerTooltip: "Year5", cellRenderer: function(params) {
                            if (params.value > 0) {
                                return '<span title=' + params.value + '>' + $scope.PutComma(params.value) + '</span>';
                            }
                            else {
                                return params.value;
                            }
                        },
                    }]
            },
            {
                headerName: "Payment Terms(Days)", field: "paymentTerms", width: 120, headerTooltip: "Payment Terms(Days)", editable: $scope.grideditable_payment,
                newValueHandler: function(params) {
                    if (params.newValue == '') {
                        params.newValue = 0;
                    }
                    if (parseInt(params.newValue) > 99) {
                        toaster.pop('warning', "Warning", 'Payment Terms cannot be greater than 99', null);
                    }
                    else
                        params.data.paymentTerms = parseInt(params.newValue);
                }
            },
            {
                headerName: "% of Total", field: "percentageTotal", width: 80, headerTooltip: "% of Total",
                cellRenderer: function(params) {
                    if (params.value > 0) {
                        return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                    }
                    else {
                        return params.value;
                    }
                },
            },
            {
                headerName: 'OEM',
                groupId: "GroupB",
                children: [
                    {
                        headerName: "HW & SW", field: "OEMHWandSW", width: 75, headerTooltip: "HW & SW", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.OEMHWandSW > 100 || $scope.Finalcalculatedrow.OEMHWandSW < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Services", field: "OEMServices", width: 60, headerTooltip: "Services", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.OEMServices > 100 || $scope.Finalcalculatedrow.OEMServices < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {

                        headerName: "PS", field: "OEMPS", width: 60, headerTooltip: "PS", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.OEMPS > 100 || $scope.Finalcalculatedrow.OEMPS < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Other", field: "OEMOther", width: 60, headerTooltip: "PS", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.OEMOther > 100 || $scope.Finalcalculatedrow.OEMOther < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    }
                ]
            },
            {
                headerName: 'Servion',
                groupId: "GroupC",
                children: [
                    {
                        headerName: "Software", field: "SERVSW", width: 72, headerTooltip: "Software", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.SERVSW > 100 || $scope.Finalcalculatedrow.SERVSW < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Services", field: "SERVServices", width: 60, headerTooltip: "Services", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.SERVServices > 100 || $scope.Finalcalculatedrow.SERVServices < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "PS", field: "SERVPS", width: 60, headerTooltip: "PS", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.SERVPS > 100 || $scope.Finalcalculatedrow.SERVPS < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Consulting", field: "SERVConsulting", width: 72, headerTooltip: "Consulting", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.SERVConsulting > 100 || $scope.Finalcalculatedrow.SERVConsulting < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "ServCare", field: "SERVCare", width: 70, headerTooltip: "SERVCare", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'redbackground': function(params) {

                                if ($scope.Finalcalculatedrow.SERVCare > 100 || $scope.Finalcalculatedrow.SERVCare < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Other", field: "SERVOther", width: 60, cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'redbackground': function(params) {

                                if ($scope.Finalcalculatedrow.SERVOther > 100 || $scope.Finalcalculatedrow.SERVOther < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                ]
            },
            {
                headerName: 'Servion',
                groupId: "GroupD",
                children: [
                    {
                        headerName: "Resourcing", field: "SERVResource", width: 90, headerTooltip: "Resourcing", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2C499' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.SERVResource > 100 || $scope.Finalcalculatedrow.SERVResource < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "T&M", field: "SERVTM", width: 90, headerTooltip: "T&M", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2C499' },

                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.SERVTM > 100 || $scope.Finalcalculatedrow.SERVTM < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Hosted", field: "SERVHosted", width: 90, headerTooltip: "Hosted", cellRenderer: NonPercentTypeEditor_payment,
                        cellStyle: { 'background-color': '#E2C499' },
                        cellClassRules: {
                            'redbackground': function(params) {
                                if ($scope.Finalcalculatedrow.SERVHosted > 100 || $scope.Finalcalculatedrow.SERVHosted < 100)
                                    return true;
                                else
                                    return false
                            },
                            'blockbackground': function(params) {
                                return params.value == '--';
                            },
                        },
                    }]
            }];


        $scope.gridPayment.api.setColumnDefs(columnDefs);

        $scope.gridPayment.rowData = $scope.data;
        $scope.gridPayment.api.setRowData($scope.data);
        document.getElementById('overlay').style.display = 'none';
        $scope.gridPayment.api.refreshView();

    }

    //cell changed function call
    function docellchangedcalculation(params, column) {
        var data = JSON.parse(localStorage.getItem('price'));

        _.each(data, function(value, key) {
            value["Iyear1"] = value["Iyear2"] = value["Iyear3"] = value["Iyear4"] = value["Iyear5"] = "0";

            if (value["PaymentCode"] == params.data.PaymentCode) {
                value[column] = params.data[column];
            }
        });

        //[params.node.childIndex][column]== params.data[column];

        localStorage.removeItem('price');

        localStorage.setItem('price', JSON.stringify(data));
        $scope.iscellrefresh_payment = false;
        docalculationforpayment();
    }

    function NonPercentTypeEditor_payment(params) {

        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);

        if ($scope.grideditable_payment) {


            var eSelect = document.createElement("select");
            var eInput = document.createElement('input');
            eInput.type = 'text';

            $scope.SelectOptions_payment.forEach(function(item) {
                var eOption = document.createElement("option");
                eOption.setAttribute("value", item.Type);
                eOption.setAttribute("title", item.Id);
                eOption.innerHTML = item.Type;
                eSelect.appendChild(eOption);
            });

            eSelect.value = params.value;

            params.eGridCell.addEventListener('click', function() {
                if ($scope.grideditable_payment) {
                    if (!editing) {
                        eInput.value = eLabel.data;
                        eInput.type = 'number';


                        if (params.data.PercentageType == 'Yes') {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eInput);
                            eInput.focus();
                            editing = true;
                        }
                        else if (params.data.PercentageType == 'No') {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    }
                }
            });


            eInput.addEventListener('keydown', function(event) {
                var key = event.which || event.keyCode;
                if (this.value.length > 10)
                    this.value = this.value.slice(0, 10);
                if (key == "13") {
                    blurListenerfn();
                    eInput.removeEventListener('blur', blurListenerfn);
                }
            });

            var blurListenerfn = function() {
                editing = false;
                var newValue = eInput.value;
                if (newValue == '') {
                    newValue = 0;
                }
                eLabel.data = newValue;
                params.data[params.colDef.field] = newValue;
                docellchangedcalculation(params, params.colDef.field)
                eCell.removeChild(eInput);
                eCell.appendChild(eLabel);
            };

            eInput.addEventListener("blur", blurListenerfn);

            eSelect.addEventListener('blur', function() {
                if (editing) {
                    editing = false;
                    eCell.removeChild(eSelect);
                    eCell.appendChild(eLabel);
                }

            });

            eSelect.addEventListener('change', function() {
                //debugger;
                if (editing) {
                    editing = false;
                    if (checksameTypeinrow(params, eSelect.value, params.colDef.field)) {

                        var newValue = eSelect.value;
                        var id = eSelect[eSelect.selectedIndex].title;

                        eLabel.nodeValue = newValue;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);

                        params.data[params.colDef.field] = newValue;

                        var data = JSON.parse(localStorage.getItem('price'));

                        _.each(data, function(value, key) {
                            if (value["PaymentCode"] == params.data.PaymentCode) {
                                value[params.colDef.field] = params.data[params.colDef.field];
                            }
                        });

                        localStorage.removeItem('price');
                        localStorage.setItem('price', JSON.stringify(data));
                        docalculationforpayment();
                    }
                    else {

                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);

                    }
                }

            });

        }
        return eCell;

    }

    function checksameTypeinrow(params, checktype, curentcol) {
        // if ($scope.Finalcalculatedrow[curentcol] > 100) {
        //     toaster.pop('warning', "Warning", "Please select % Type or Select Options", null);
        //     return false;
        // }

        if (checktype == '--Select--') {
            return true;
        }
        else {
            var start = false;
            var cnt = 0;
            _.each(params.data, function(v, k) {
                if (k == "OEMHWandSW" || k == "SERVHosted") {
                    start = !start;
                }
                if (start && v != '--Select--' && v != checktype && curentcol != k) {
                    key = k;
                    cnt++;
                }
            });

            if (cnt > 0) {
                toaster.pop('warning', "Warning", "Please select same payment type in a row", null);
                return false;
            }
            else
                return true;
        }
    }


    function headerCellRendererFunc(params) {
        alert('header render')
    }

    $scope.EditSheet_payment = function() {
        $scope.sheetholdedby = '';
        var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'PaymentSheet', IsPriceSheetUpdated: false };

        priceService.LocktheSheetByGroupid(LockSheetModel).success(function(data) {

            if (!data.IsLocked) {
                $scope.grideditable_payment = true;
                $scope.$broadcast('timer-reset');
                $scope.$broadcast('timer-start');
                $('#showmod').modal('hide');
            }
            else {
                if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "PaymentSheet") {
                    $scope.grideditable_payment = true;
                    $scope.counter = 0;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');

                    $('#showmod').modal('hide');
                }
                else {
                    $scope.grideditable_payment = false;
                    $scope.sheetholdedby = "LockedIn: " + data.LockedIn + " By " + data.LockedUser;
                }
            }

            docalculationforpayment();

        }).error(function(error) {

            $scope.Error = error;
        })
    }

    //adding Payment sheet values
    $scope.AddPaymentSheet = function(isdiscard) {

        if (validatedataonSAVE()) {

            for (var j = 0; j < $scope.data.length; j++) {
                try {
                    delete $scope.data[j].Id

                    $scope.data[j].PaymentSheetGroupId = $routeParams.GroupId;
                    $scope.data[j].Iyear1 = String($scope.data[j].Iyear1);
                    $scope.data[j].Iyear2 = String($scope.data[j].Iyear2);
                    $scope.data[j].Iyear3 = String($scope.data[j].Iyear3);
                    $scope.data[j].Iyear4 = String($scope.data[j].Iyear4);
                    $scope.data[j].Iyear5 = String($scope.data[j].Iyear5);
                    $scope.data[j].paymentTerms = String($scope.data[j].paymentTerms);
                    $scope.data[j].percentageTotal = String($scope.data[j].percentageTotal);
                    $scope.data[j].OEMHWandSW = String($scope.data[j].OEMHWandSW);
                    $scope.data[j].OEMServices = String($scope.data[j].OEMServices);
                    $scope.data[j].OEMPS = String($scope.data[j].OEMPS);
                    $scope.data[j].OEMOther = String($scope.data[j].OEMOther);
                    $scope.data[j].SERVSW = String($scope.data[j].SERVSW);
                    $scope.data[j].SERVServices = String($scope.data[j].SERVServices);
                    $scope.data[j].SERVPS = String($scope.data[j].SERVPS);
                    $scope.data[j].SERVCare = String($scope.data[j].SERVCare);
                    $scope.data[j].SERVOther = String($scope.data[j].SERVOther);
                    $scope.data[j].SERVConsulting = String($scope.data[j].SERVConsulting);
                    $scope.data[j].SERVResource = String($scope.data[j].SERVResource);
                    $scope.data[j].SERVHosted = String($scope.data[j].SERVHosted);
                    $scope.data[j].SERVTM = String($scope.data[j].SERVTM);
                }
                catch (e) {
                    console.log('some error while sending data to server')
                }
            }

            var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, SheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable_payment, paymentsheet: $scope.data, Authour: $rootScope.UserInfo.user.userId };

            //Jsondata.Version = 'Ver_0.1';
            Jsondata.Comment = 'Initial';
            $routeParams.GroupId = $scope.MaxSheetGroupID;
            paymentService.AddPaymentSheet(Jsondata).success(function(data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.griduseredit = false;
                    $scope.grideditable_payment = false;
                    $scope.iscellrefresh_payment = true;
                    // if(!$scope.isPricingSheetUpdated)
                    $('#showSavemodel').modal('hide');
                    //docalculationforpayment(); need to find it is required or not
                    if ($scope.showmsg_payment) {
                        toaster.pop('success', "SAVE", 'Payment Sheet Saved Successfully', 3000);
                    }
                    $scope.showmsg_payment = true;
                    //if (!isdiscard)
                    //    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                }
                else {
                    if ($scope.showmsg_payment) {
                        toaster.pop('error', "Error", data.Error, null);
                    }
                    $scope.showmsg_payment = true;

                }

            }).error(function(error) {

            });
        }



    }

    //updating pricesheet to new version
    $scope.UpdatepaymentSheetVersion = function() {
        //have to work here

        if (validatedataonSAVE()) {
            priceService.GetMaximumGroupPriceSheetId().success(function(data) {
                if (data[0].count == 'null') {
                    $scope.MaxSheetGroupIDForSaveAs = 1;
                }
                else {
                    $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
                }
                var currentversion = $scope.MaxVersion.split('_')[1];
                var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
                var version = 'Ver_' + i;

                $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;

                for (var j = 0; j < $scope.data.length; j++) {
                    try {
                        delete $scope.data[j].Id
                        $scope.data[j].PaymentSheetGroupId = $scope.MaxSheetGroupIDForSaveAs;
                        $scope.data[j].Iyear1 = String($scope.data[j].Iyear1);
                        $scope.data[j].Iyear2 = String($scope.data[j].Iyear2);
                        $scope.data[j].Iyear3 = String($scope.data[j].Iyear3);
                        $scope.data[j].Iyear4 = String($scope.data[j].Iyear4);
                        $scope.data[j].Iyear5 = String($scope.data[j].Iyear5);
                        $scope.data[j].paymentTerms = String($scope.data[j].paymentTerms);
                        $scope.data[j].percentageTotal = String($scope.data[j].percentageTotal);
                        $scope.data[j].OEMHWandSW = String($scope.data[j].OEMHWandSW);
                        $scope.data[j].OEMServices = String($scope.data[j].OEMServices);
                        $scope.data[j].OEMPS = String($scope.data[j].OEMPS);
                        $scope.data[j].OEMOther = String($scope.data[j].OEMOther);
                        $scope.data[j].SERVSW = String($scope.data[j].SERVSW);
                        $scope.data[j].SERVServices = String($scope.data[j].SERVServices);
                        $scope.data[j].SERVPS = String($scope.data[j].SERVPS);
                        $scope.data[j].SERVCare = String($scope.data[j].SERVCare);
                        $scope.data[j].SERVOther = String($scope.data[j].SERVOther);
                        $scope.data[j].SERVConsulting = String($scope.data[j].SERVConsulting);
                        $scope.data[j].SERVResource = String($scope.data[j].SERVResource);
                        $scope.data[j].SERVHosted = String($scope.data[j].SERVHosted);
                        $scope.data[j].SERVTM = String($scope.data[j].SERVTM);
                        if ($scope.data[j].PercentageType == "No") {
                            $scope.data[j].OEMHWandSW = '0';
                            $scope.data[j].OEMServices = '0';
                            $scope.data[j].OEMPS = '0';
                            $scope.data[j].OEMOther = '0';
                            $scope.data[j].SERVSW = '0';
                            $scope.data[j].SERVServices = '0';
                            $scope.data[j].SERVPS = '0';
                            $scope.data[j].SERVConsulting = '0';
                            $scope.data[j].SERVCare = '0';
                            $scope.data[j].SERVOther = '0';
                        }

                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }

                var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, SheetId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable_payment, paymentsheet: $scope.data, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
                Jsondata.Version = version;
                paymentService.AddPaymentSheet(Jsondata).success(function(data) {
                    if (data.Error == '' || data.Error == undefined || data.Error == null) {
                        $scope.grideditable_payment = false;
                        $('#showsaveAsmodel').modal('hide');
                        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                    }
                    else {
                        toaster.pop('error', "Error", data.Error, 3000);
                    }
                }).error(function(error) {

                });
            });
        }

    }

    function validatedataonSAVE() {

        if ($scope.data.length > 0) {
            //return true;

            var isvalid = true;

            // for (var i = 0; i < $scope.data.length; i++) {
            //     if ($scope.data[i].OemId == 1 && $scope.data[i].ComponenttypeId == 1 && $scope.data[i].LTotal > 0) {
            //         isvalid = false;
            //         var errorrow = i + 1;
            //         toaster.pop('error', "Failed", 'Sheet contains invalid data in row number ' + errorrow, null);
            //         break;
            //     }

            // }
            return isvalid;
        }

        else {
            toaster.pop('error', "Failed", 'No data to update', null);
            return false;
        }
    }


    $scope.IncreaseAdditionalTimeToSheet = function() {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'PaymentSheet' };
        priceService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function(data) {
            if (!data.IsLocked) {
                $scope.grideditable_payment = true;
                $scope.$broadcast('timer-add-cd-seconds', 840);
                $('#showmod').modal('hide');
            }
            else {
                $scope.sheetholdedby = data.LockedUser;

                if (data.LockedUser == $rootScope.UserInfo.user.userId) {
                    $scope.grideditable_payment = true;
                    $scope.counter = 0;
                    $scope.$broadcast('timer-add-cd-seconds', 840);
                    $('#showmod').modal('hide');
                }
                else {
                    $scope.grideditable_payment = false;
                    $scope.hasedit_payment = true;
                    $scope.sheetholdedby = 'Error occured..';
                }
            }
            $scope.onLoad_payment();

        }).error(function(error) {

            $scope.Error = error;
        })
    }

    //pop up data 
    $scope.closepopup = function() {

        $('#showSavemodel').modal('hide');
        $('#showsaveAsmodel').modal('hide');
        $('#showmod').modal('hide');
        // redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
    }

    $scope.finished = function() {
        $('#showmod').modal('show');
    }

    $scope.AddpaymentSheetpop = function() {
        $('#showSavemodel').modal('show');
    }

    $scope.CancelPaymentSheet = function() {
        $('#showSavemodel').modal('hide');
    }

    $scope.saveaspaymentSheetpop = function() {
        $('#showsaveAsmodel').modal('show');
    }

    $scope.CancelpaymentSheetsaveas = function() {
        $('#showsaveAsmodel').modal('hide');
    }

    //pop up data 

    $scope.$on("$locationChangeStart", function(event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.grideditable_payment) {
            $('#showSaveChangesmodel').modal('show');
            event.preventDefault();
        }

    });


    $scope.saveasPaymentSheetdiscard = function() {
        $scope.grideditable_payment = false;
        $scope.AddPaymentSheet(true);
        $('#showSaveChangesmodel').modal('hide');
        $window.location.href = $scope.newnavigateURl;
        // var url = $scope.newnavigateURl.split('#');
        // //$window.location.href = '/#' + url[1];
        // $location.path(url[1]);
    }

    $scope.IgnoreChanges = function() {
        $scope.$broadcast('timer-stop');
        priceService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function(data) {
            $scope.grideditable_payment = false;
            $scope.GetOpportunityList_payment($routeParams.OppId);

        }).error(function(error) {

            $scope.Error = error;
        })
    }

    $scope.CancelPaymentSheetdiscard = function() {
        $scope.grideditable_payment = false;
        $scope.IgnoreChanges();
        $('#showSaveChangesmodel').modal('hide');
        //var url = $scope.newnavigateURl.split('#');
        $window.location.href = $scope.newnavigateURl;
        //$location.path(url[1]);
    }

    $scope.EditModel = function(value, text) {
        if ($scope.grideditable_payment) {
            $scope.dynamickey = value;
            $scope.dynamictext = text;
            $('#AdditionalInvoice').modal('show');
        }
        else {
            toaster.pop('warning', "Warning", 'Please click edit to make changes', null);
        }
    }

    $scope.cancelpopup = function() {
        $('#AdditionalInvoice').modal('hide');
    }

    $scope.updatescope = function() {
        var data = JSON.parse(localStorage.getItem('price'));
        var key1 = $scope.dynamickey;
        _.each(data, function(value, key) {
            if (value["PaymentCode"] == key1) {
                value["MilestoneDescription"] = $scope.Newvalue;
            }
        });

        $scope.Newvalue = "";
        localStorage.removeItem('price');
        localStorage.setItem('price', JSON.stringify(data));


        $('#AdditionalInvoice').modal('hide');
        $scope.iscellrefresh_payment = true;
        docalculationforpayment();
    }


    $scope.MakeContainerFullScreen = function(state) {
        $scope.DefautState_payment = !state;
        if ($scope.DefautState_payment) {
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

    $scope.onBtExport = function() {
        paymentService.ExportToExcelSheet($routeParams.OppId, $routeParams.GroupId).success(function(data) {
            console.log(data);
            var url = BaseURL + 'ExportFiles/' + data.name;

            $scope.downloadurl = url;
            $scope.filename = data.name;
            setTimeout(function() {
                $('#downloadpdf')[0].click();
            }, 1000);

        }).error(function(error) {
            $scope.Error = error;
        })

    }

    //refresh page when data done
    function redirectRefreshPage(oppId, groupId) {
        $location.path("PaymentList/" + oppId + "/" + groupId);
    }

    $scope.ClosePriceSheetdiscard = function() {
        $('#showSaveChangesmodel').modal('hide');
    }


    $scope.PutComma = function(x) {
        x = parseFloat(x).toFixed(2);
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


    $scope.InitApiCalls = function() {
        //first call to pricesheet

        $scope.GetPaymentPeriod();
        $scope.GetOpportunityList_payment($routeParams.OppId);
        $scope.GetMaximumGroupPriceSheetId();
        $scope.IsPageReadOnly();
        $scope.getAllComponentType_payment();
        $scope.GetOemOptions_payment();
        // var SingleEditdata = JSON.parse(localStorage.getItem('SingleEditdata'));

        // if (SingleEditdata.IsEdited == true) {

        //     $timeout(function () {
        //         $scope.EditSheet_payment();
        //     }, 1000);

        // }
        //start service calls
    }

    $scope.InitApiCalls();


    // postal.subscribe({
    //     channel: "price",
    //     topic: "PageInitialization",
    //     callback: function(d, e) {

    //     }
    // });


    // postal.subscribe({
    //     channel: "price",
    //     topic: "sheet1",
    //     callback: function(d, e) {
    //         alert('payment')
    //     }
    // });


});
