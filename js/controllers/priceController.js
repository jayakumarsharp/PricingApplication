agGrid.initialiseAgGridWithAngular1(angular);

ReportApp.controller("PriceController", function($scope, $rootScope, $routeParams, $window, $http, priceService, currencyService, Opportunityservice, $timeout, toaster, $location, reportFactory, _) {


    $scope.PageVariableInitialization = function() {
        $scope.Isleaving = true;
        $scope.DefautState = false;


        $scope.OpportunityDetail;
        $scope.ChildOpportunity = [];
        $scope.GlobalIdentityOppId = $routeParams.OppId;
        $scope.GlobalGroupId = $routeParams.GroupId;

        $scope.IsfreshSheet = false;
        $scope.data = [];

        $scope.griduseredit = false;
        $scope.hasedit = false;
        $scope.sheetholdedby = '';
        $scope.Totalresult;

        $scope.call1finished = false;
        $scope.call2finished = false;
        $scope.call3finished = false;
        $scope.call4finished = false;
        $scope.call5finished = false;
        $scope.call6finished = false;
        $scope.call7finished = false;
        $scope.call8finished = false;
        $scope.call9finished = false;
        $scope.call10finished = false;
        $scope.call11finished = false;
        $scope.call12finished = false;
        $scope.call13finished = false;
        $scope.call14finished = false;//margin
        $scope.call15finished = false;//discount

        $scope.grideditable = false;
        $scope.MaxSheetGroupID;
        $scope.MaxVersion;

        // $scope.ServionLegalEntityName = '--Select--';
        $scope.MaxSheetGroupIDForSaveAs;
        $scope.ProductList;
        $scope.CurrencyList;
        $scope.IsReadOnly = false;

        //default configuration related to legal entity
        $scope.IsDefaultRecordFoundForLegal = false;
        $scope.DefaultCurrency;
        $scope.DefaultConversionRate;
        $scope.DefaultServionLegalEntity;
        $scope.DefaultServionLegalEntityID;
        //default configuration related to legal entity

        $scope.yearid = 5;

        //Start Expand/Collapse action temporarly removed
        $scope.ExpandState = false;

        //initialize Grid options
        $scope.gridOptions = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            enableFilter: true,
            groupHeaders: true,
            headerHeight: 36,
            rowHeight: 24,
            rowData: $scope.data,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            enableCellExpressions: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            onSelectionChanged: onSelectionChanged,


            icons: {
                menu: '<i class="fa fa-bars"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
            },
            onRowClicked: function(event) {
                //  alert('a')
                //if (!$scope.grideditable)
                //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

                //var selectedRows = $scope.gridOptions.api.getSelectedRows();
                //console.log('a row clicked');
            },
            columnGroupOpened: function(event) {
                // alert('s');
            },
            onGridReady: function(event) {
                //$scope.gridOptions.api.sizeColumnsToFit();
                if ($scope.data.length > 0)
                    onFloatingBottomCount(1);
            },
            onCellValueChanged: cellValueChangedFunction,
            enableSorting: true,
            getRowStyle: function(params) {
                if (params.node.floating) {
                    return { 'font-weight': 'bold', 'background-color': '#fff' }
                }
            },
            floatingBottomRowData: [],
            headerCellRenderer: headerCellRendererFunc
        };

    }

    $scope.PageVariableInitialization();

    $scope.clear = function() {
        toaster.clear();
    };

    $scope.GetMarginbyBU = function(buid, regionid) {
        priceService.GetMarginbyBU(buid, regionid).success(function(data) {
            //have to use margin threshold
            $scope.margin = data;
            $scope.call14finished = true;
            $scope.callifAPIDone();

        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetDiscountbyBU = function(buid, regionid) {
        priceService.GetDiscountbyBU(buid, regionid).success(function(data) {
            //have to use discount threshold
            $scope.discount = data;
            $scope.call15finished = true;
            $scope.callifAPIDone();

        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.IsPageReadOnly = function() {
        var isRead = true;
        $scope.IsReadOnly = true;
        reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function(rights) {
            angular.forEach(rights.data, function(value, key) {
                if (value.RightName == 'Pricing Write') {
                    isRead = false;
                }
            })
            if (!isRead) {
                $scope.IsReadOnly = false;
            }
        });
    }

    $scope.GetPriceSheetVersionsForOpp = function(oppid) {
        console.log('oppid, groupid' + oppid)
        priceService.GetPriceSheetVersionsForOpp(oppid).success(function(data) {
            $scope.Versiondata = data;
            $scope.CurrentVersiondata = {};
            _.each($scope.Versiondata, function(value, key) {
                if (value["PriceSheetId"] == $scope.GlobalGroupId) {
                    $scope.CurrentVersiondata = value;
                }
            });


        }).error(function(error) {
            $scope.Error = error;
        })
    };


    function resetgridcollapsestate() {
        try {
            var coldata = $scope.CurrentVersiondata.ColStatus;

            var splitdata = coldata.split(',');
            for (var i = 0; i < splitdata.length; i++) {
                var innersplit = splitdata[i].split(':')
                $scope.gridOptions.columnApi.setColumnGroupOpened('Group' + innersplit[0], JSON.parse(innersplit[1]));
            }
        }
        catch (ex) {
            console.log('error in collaspe and expand' + ex)
        }
    }

    //first call to get details about the sheet

    $scope.checkIFFreshsheet = function() {
        if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
            $scope.IsfreshSheet = true;
        }
    }

    //GetDefaultLegalEntity SBUId,RegionId
    //GetLegalEntityFromOpp Id -done
    //GetCurrencyFromLegalEntity Id

    //have to show in first
    $scope.GetDefaultLegalEntity = function(sbuid, regionid) {
        priceService.GetDefaultLegalEntity(sbuid, regionid).success(function(data) {
            //have main default values here

            if (data.length > 0) {
                var condition = false;
                if (data.length > 1) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].IsDefault == "Y") {
                            condition = true;
                            $scope.DefaultLegalEntities = data[i];
                            //console.log($scope.DefaultLegalEntities)
                            $scope.IsDefaultRecordFoundForLegal = true;
                            $scope.DefaultCurrency = data[i].Currency;
                            $scope.DefaultCurrencyID = data[i].CurrencyID;

                            $scope.DefaultConversionRate = data[i].ConversionRate;
                            $scope.ServionLegalEntityName = data[i].ServionLegalEntity;
                            $scope.OpportunityDetail.ServionLegalEntity = data[i].ServionLegalEntityID;//default legalentity ID
                            $scope.ServionLegalEntities = checkiflegalentityisthere(data[i].ServionLegalEntityID, data[i].ServionLegalEntity)
                        }
                    }
                    if (!condition) {
                        $scope.DefaultLegalEntities = data;
                        //console.log($scope.DefaultLegalEntities)
                        $scope.IsDefaultRecordFoundForLegal = true;
                        $scope.DefaultCurrency = data[0].Currency;
                        $scope.DefaultCurrencyID = data[0].CurrencyID;

                        $scope.DefaultConversionRate = data[0].ConversionRate;
                        $scope.ServionLegalEntityName = data[0].ServionLegalEntity;
                        $scope.OpportunityDetail.ServionLegalEntity = data[0].ServionLegalEntityID;//default legalentity ID

                        $scope.ServionLegalEntities = checkiflegalentityisthere(data[0].ServionLegalEntityID, data[0].ServionLegalEntity)
                    }

                }
                else {
                    $scope.DefaultLegalEntities = data;
                    //console.log($scope.DefaultLegalEntities)
                    $scope.IsDefaultRecordFoundForLegal = true;
                    $scope.DefaultCurrency = data[0].Currency;
                    $scope.DefaultCurrencyID = data[0].CurrencyID;

                    $scope.DefaultConversionRate = data[0].ConversionRate;
                    $scope.ServionLegalEntityName = data[0].ServionLegalEntity;
                    $scope.OpportunityDetail.ServionLegalEntity = data[0].ServionLegalEntityID;//default legalentity ID

                    $scope.ServionLegalEntities = checkiflegalentityisthere(data[0].ServionLegalEntityID, data[0].ServionLegalEntity)
                }
            }
            else {

                $scope.OpportunityDetail.ServionLegalEntity = 1;
                $scope.ServionLegalEntityName = '--Select--';
                $scope.DefaultCurrency = '';
                $scope.DefaultConversionRate = 'NA';
            }
            //data
            // $scope.GetCurrencyFromLegalEntity(data[0].ServionLegalEntityID);
            $scope.call13finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetLegalEntityFromOpp = function(Oppid) {
        priceService.GetLegalEntityFromOpp(Oppid).success(function(data) {
            $scope.ServionLegalEntities = data;
            //data
            var localcountry = '-1';
            console.log('country id' + $scope.OpportunityDetail.CountryId)

            if ($scope.OpportunityDetail.CountryId != null)
                var localcountry = $scope.OpportunityDetail.CountryId;

            $scope.GetDefaultLegalEntity($scope.OpportunityDetail.SBUId, localcountry);

            //if (data != null) {
            //    $scope.ServionLegalEntityName = getValue($scope.OpportunityDetail.ServionLegalEntity, $scope.ServionLegalEntities);
            //}
            $scope.call8finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };


    //do legal entity first and then remove if it is already there...


    function checkiflegalentityisthere(legalentityid, legalentity) {

        var test = _.reject($scope.ServionLegalEntities, function(obj) {
            if (parseInt(obj.ServionLegalEntityID) == parseInt(legalentityid)) {
                return obj;
            }
        });

        test.splice(0, 0, { ServionLegalEntityID: legalentityid, ServionLegalEntity: legalentity });

        return test;

    }


    //do legal entity first and then remove if it is already there...

    $scope.GetOpportunityList = function(id) {
        Opportunityservice.GetopportunitybyID(id).success(function(data) {
            if (data != null && data.length > 0) {
                $scope.OpportunityDetail = data[0];
                $scope.call11finished = true;
                $scope.GetLegalEntityFromOpp($scope.OpportunityDetail.id);
                $scope.GetAllChildOpportunity($scope.OpportunityDetail.id)
                $scope.GetPriceSheetByversion($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                $scope.GetPriceSheetVersionsForOpp($scope.OpportunityDetail.OppId);
                //getting default legal entity mapping for bu and region
                //getting threshold values
                $scope.GetMarginbyBU($scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId);
                $scope.GetDiscountbyBU($scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId);
            }
            else {

                toaster.pop('error', "Error", 'Invalid Opportunity Details', null);
                //redirect to Home Page

                $window.location.href = "home";
            }

        });
    }



    $scope.GetAllChildOpportunity = function(OppId) {

        priceService.ChildOpportunity(OppId).success(function(data) {
            $scope.ChildOpportunity = data;
            $scope.ChildOpportunity.push({ 'OppId': $scope.OpportunityDetail.OppId });
            $scope.call12finished = true;
            $scope.callifAPIDone();

        }).error(function(error) {
            $scope.Error = error;
        })
    }

    $scope.GetCurrencyConversionForPricing = function(ServionLegalEntityId, SBUId, CountryId, CurrencyId) {
        currencyService.GetCurrencyConversionForPricing(ServionLegalEntityId, SBUId, CountryId, CurrencyId).success(function(data) {
            if (data != null && data.length > 0) {
                //$scope.CurrencyList = data;
                $scope.data[$scope.currentworkingrow].ConversionRate = data[0].ConversionRate;
                //Currency Conversion
                getFinalCurrencyConversionRate($scope.data[$scope.currentworkingrow]);
            }
            else {
                //error in console
                $scope.data[$scope.currentworkingrow].ConversionRate = 'NA';
                getFinalCurrencyConversionRate($scope.data[$scope.currentworkingrow]);
                //apply default value
            }
            $scope.gridOptions.api.refreshView();
        }).error(function(error) {
            $scope.Error = error;
        })
    }

    function getValue(key, array) {
        for (var el in array) {
            if (array[el].ServionLegalEntityID == key) {
                return array[el].ServionLegalEntity;
            }
        }
    }

    //start Service call Declarations
    $scope.GetAllCurrency = function() {
        currencyService.GetAllCurrency().success(function(data) {

            $scope.CurrencyList = data;
            $scope.call10finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetAllLOBList = function() {
        priceService.GetAllLOBList().success(function(data) {
            $scope.LOBList = data;
            $scope.call9finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetOemOptions = function() {

        priceService.GetAllOEM().success(function(data) {
            $scope.setOEMSelectionOptions = data;
            $scope.call1finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetProductList = function() {
        priceService.GetAllProduct().success(function(data) {
            $scope.ProductList = data;
            $scope.call7finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.getAllPriceType = function() {
        priceService.GetAllPriceType().success(function(data) {
            $scope.setPriceTypeSelectionOptions = data;
            $scope.call2finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.getAllComponentType = function() {
        priceService.GetAllComponentType().success(function(data) {
            $scope.setComponentSelectionOptions = data;
            $scope.call3finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })

    };

    $scope.GetMaximumGroupPriceSheetId = function() {

        // priceService.GetMaximumGroupPriceSheetId().success(function (data) {
        //     if (data[0].count == 'null') {
        //         $scope.MaxSheetGroupIDForSaveAs = 1;
        //     }
        //     else {
        //         $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
        //     }

        //     if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
        //         $scope.MaxVersion = 'Ver_0.1'
        //         //jay please had look here 
        //         $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;
        //         $scope.MaxSheetGroupID = $scope.MaxSheetGroupIDForSaveAs;
        //     }

        //     // $scope.call4finished = true;
        //     // $scope.callifAPIDone();
        // }).error(function (error) {
        //     $scope.Error = error;
        // }) After Sid found issue very serious on linking another sheet

        $scope.call4finished = true;
        $scope.callifAPIDone();
    };

    $scope.GetPriceSheetByversion = function(oppid, groupid) {

        if ($scope.IsfreshSheet) {
            // $scope.MaxSheetGroupID = 1;
            $scope.data = [];
            $scope.call5finished = true;
            $scope.callifAPIDone();
            $scope.grideditable = true;
            $scope.hasedit = true;
            $scope.call6finished = true;
        }
        else {
            //debugger;
            priceService.GetAllPriceSheetbyOppGroupID(oppid, groupid).success(function(data) {

                if (data.Error == null) {
                    $scope.data = data;
                    $scope.call4finished = true;
                    $scope.call5finished = true;
                    $scope.callifAPIDone();
                }
                else {
                    toaster.pop('error', "Error", data.Error, null);
                    $window.location.href = "home";
                }
            }).error(function(error) {
                $scope.Error = error;
            })
            $scope.GetPriceSheetMappeddataByversion(oppid, groupid);
        }
    };

    $scope.GetPriceSheetMappeddataByversion = function(oppid, groupid) {

        priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function(data) {
            //jay 
            $scope.MaxVersion = data[0].Version;
            $scope.MaxSheetGroupID = data[0].PriceSheetId;
            $scope.grideditable = data[0].IsEditable;
            $scope.hasedit = data[0].IsEditable;
            $scope.call6finished = true;
            $scope.callifAPIDone();
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.callifAPIDone = function() {
        if ($scope.call1finished && $scope.call2finished && $scope.call3finished && $scope.call4finished && $scope.call5finished && $scope.call6finished && $scope.call7finished && $scope.call8finished && $scope.call9finished && $scope.call10finished && $scope.call11finished && $scope.call12finished && $scope.call14finished && $scope.call15finished) {
            $scope.onLoad();
        }
    };
    //End Service call Declarations


    $scope.toggleCheck = function(val) {

        if (val == '+' && $scope.yearid < 5) {
            $scope.yearid = $scope.yearid + 1;
            var id = $scope.yearid;
            $scope.gridOptions.columnApi.setColumnsVisible(['Cyear' + id, 'Vyear' + id, 'Lyear' + id, 'Oyear' + id, 'Syear' + id, 'DTyear' + id, 'FCUyear' + id, 'FCLyear' + id], true);
        }
        else if (val == '-' && $scope.yearid > 1) {
            var id = $scope.yearid;
            $scope.gridOptions.columnApi.setColumnsVisible(['Cyear' + id, 'Vyear' + id, 'Lyear' + id, 'Oyear' + id, 'Syear' + id, 'DTyear' + id, 'FCUyear' + id, 'FCLyear' + id], false);
            $scope.yearid = $scope.yearid - 1;
        }
        else if ($scope.yearid == 5) {
            toaster.pop('warning', "Warning", 'Maximum five years only allowed', null);
        }
        else if ($scope.yearid == 1) {
            toaster.pop('warning', "Warning", 'Minimum one year should be required', null);
        }

    }

    $scope.expandall = function(expand) {
        // $scope.ExpandState = !expand;

        var columnApi = $scope.gridOptions.columnApi;
        var groupNames = ['GroupA', 'GroupB', 'GroupC', 'GroupD', 'GroupE', 'GroupF', 'GroupG', 'GroupH', 'GroupI', 'GroupJ', 'GroupK', 'GroupL'];

        groupNames.forEach(function(groupId) {
            $scope.gridOptions.columnApi.setColumnGroupOpened(groupId, expand);
        });
    }
    //Start Expand/Collapse action

    //start Loading Column Definitions
    $scope.onLoad = function() {
        var columnDefs = [
            {
                headerName: "", hide: true, field: "PricetypeId", width: 1
            },
            {
                headerName: "", hide: true, field: "OemId", width: 1,
            },
            {
                headerName: "", hide: true, field: 'ComponenttypeId', width: 1,
            },
            {
                headerName: "", hide: true, field: 'LegalEntityId', width: 1
            },
            {
                headerName: "", hide: true, field: 'lob', width: 1
            },
            {
                headerName: "", hide: true, field: 'CurrencyId', width: 1
            },
            {
                headerName: "", hide: true, field: 'ProductId', width: 1
            },
            {
                headerName: "ID", field: "RowId", width: 47, headerTooltip: "ID", pinned: 'left'
            },
            {
                headerName: "Opportunity ID", field: "OppId", width: 120, headerTooltip: "Opportunity ID", cellRenderer: OppEditor
            },
            {
                headerName: "ServionLegal Entity", field: 'ServionLegalEntity', width: 140, cellRenderer: LegalEntityEditor, headerTooltip: "ServionLegal Entity",
            },
            {
                headerName: "Vendor", field: "oem", width: 120, cellRenderer: OEMEditor, headerTooltip: "Vendor",
                pinned: 'left'
            },
            {
                headerName: "Component", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function(params) {
                    return '<span title=' + params.value + '>' + params.value + '</span>';
                }, pinned: 'left'
            },
            {
                headerName: "Component Type", field: 'componenttype', width: 120, cellRenderer: customCompEditor, headerTooltip: "Component Type", pinned: 'left'
            },
            {
                headerName: "Servion/Acqueon Product", field: 'ProductName', width: 120, cellRenderer: ProductEditor, headerTooltip: "Servion/Acqueon Product",
            },
            {
                headerName: "Price Type", field: "pricetype", width: 120, cellRenderer: customPriceEditor, headerTooltip: "Price Type"
            },
            {
                headerName: 'Vendor / Servion - List / Transfer Price (USD)',
                groupId: "GroupA",
                headerTooltip: "List/Transfer Price",
                children: [
                    {
                        headerName: "Total", field: "LTotal", width: 90, headerTooltip: "Total",
                        valueGetter: LYearTotalcalc,
                        cellStyle: { 'background-color': '#CDCDCD' }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", field: "Lyear1", width: 90, columnGroupShow: 'open', editable: $scope.grideditable, headerTooltip: "Year1",
                        onCellValueChanged: function(params) {
                            GetListCalculation(params, 1)
                            $scope.gridOptions.api.refreshView();
                        },
                        cellStyle: { 'background-color': '#CDCDCD' },
                        newValueHandler: function(params) {
                            if (params.newValue == '') {
                                params.data.Lyear1 = 0;
                                params.newValue = 0;
                            }
                            params.data.Lyear1 = parseFloat(params.newValue);
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", field: "Lyear2", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year2",
                        onCellValueChanged: function(params) {
                            GetListCalculation(params, 2)
                            $scope.gridOptions.api.refreshView();
                        },
                        cellStyle: { 'background-color': '#CDCDCD' },
                        newValueHandler: function(params) {
                            if (params.newValue == '') {
                                params.data.Lyear2 = 0;
                                params.newValue = 0;
                            }
                            params.data.Lyear2 = parseFloat(params.newValue);
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }

                    },
                    {
                        headerName: "Year 3", field: "Lyear3", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year3",
                        onCellValueChanged: function(params) {
                            GetListCalculation(params, 3)
                            $scope.gridOptions.api.refreshView();
                        }, cellStyle: { 'background-color': '#CDCDCD' },
                        newValueHandler: function(params) {
                            if (params.newValue == '') {
                                params.data.Lyear3 = 0;
                                params.newValue = 0;
                            }
                            params.data.Lyear3 = parseFloat(params.newValue);
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", field: "Lyear4", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year4",
                        onCellValueChanged: function(params) {
                            GetListCalculation(params, 4)
                            $scope.gridOptions.api.refreshView();
                        },
                        cellStyle: { 'background-color': '#CDCDCD' },
                        newValueHandler: function(params) {
                            if (params.newValue == '') {
                                params.data.Lyear4 = 0;
                                params.newValue = 0;
                            }
                            params.data.Lyear4 = parseFloat(params.newValue);
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", field: "Lyear5", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year5",
                        onCellValueChanged: function(params) {
                            GetListCalculation(params, 5)
                            $scope.gridOptions.api.refreshView();
                        },
                        cellStyle: { 'background-color': '#CDCDCD' },
                        newValueHandler: function(params) {
                            if (params.newValue == '') {
                                params.data.Lyear5 = 0;
                                params.newValue = 0;
                            }
                            params.data.Lyear5 = parseFloat(params.newValue);
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    }

                ]
            },
            {
                headerName: 'Vendor Discount %', field: "forvendordiscount", width: 130, editable: $scope.grideditable, cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else
                        return '<span title=' + params.value + '>' + params.value + ' </span>';

                },
                onCellValueChanged: function(params) {
                    if (params.data.oem != "Servion")
                        GetOEMVendorCalculation(params);
                },
                newValueHandler: function(params) {

                    if (params.newValue == '') {
                        params.newValue = 0;
                    }

                    if (params.data.oem == "Servion")
                        toaster.pop('warning', "Warning", 'For Servion Vendor Discount % not allowed', null);
                    else {

                        if (params.newValue > 100) {
                            toaster.pop('warning', "Warning", 'For OEM/Vendor Discount % cannot be greater than 100%', null);
                        }
                        else
                            params.data.forvendordiscount = params.newValue;
                    }

                }
            },
            {
                headerName: 'Vendor Offer Price(USD)',
                groupId: "GroupB",
                headerTooltip: "Vendor Offer Price(USD)",

                children: [{
                    headerName: "Total", field: "OTotal", width: 90, headerTooltip: "Total",
                    valueGetter: OYearTotalcalc,

                    //cellStyle: { 'background-color': '#00ffff' },
                    newValueHandler: function(params) {
                        params.data.OTotal = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }, {
                    headerName: "Year 1", field: "Oyear1", columnGroupShow: 'open', width: 60,
                    newValueHandler: function(params) {
                        params.data.Oyear1 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", field: "Oyear2", columnGroupShow: 'open', width: 90,
                    newValueHandler: function(params) {
                        params.data.Oyear2 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", field: "Oyear3", columnGroupShow: 'open', width: 90,
                    newValueHandler: function(params) {
                        params.data.Oyear3 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", field: "Oyear4", columnGroupShow: 'open', width: 90,
                    newValueHandler: function(params) {
                        params.data.Oyear4 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", field: "Oyear5", columnGroupShow: 'open', width: 90,
                    newValueHandler: function(params) {
                        params.data.Oyear5 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }
                ]
            },
            {
                headerName: 'Distributor Margin %', field: "distmarginpercent", width: 90, editable: $scope.grideditable, headerTooltip: "Margin %", cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                },
                cellClassRules: {
                    'bg-red': 'x > 100',
                },
                onCellValueChanged: function(params) {

                    if (params.newValue == "") {
                        params.data.distmarginpercent = 0;
                    } else {
                        if (params.data.distmarginpercent != 0 && params.data.distdiscount > 0) {
                            params.data.distmarginpercent = 0;
                            toaster.pop('warning', "Warning", 'For Distributor Discount %  and  Distributor Margin %  both cannot be entered', null);
                        }
                        else {
                            if (params.data.distmarginpercent > 100) {
                                params.data.distmarginpercent = 0;
                                toaster.pop('warning', "Warning", 'For Distributor Margin % cannot be greater than 100%', null);
                            }

                        }

                    }
                    getdistributorandmargindiscount(params);
                }

            },
            {
                headerName: 'Distributor Discount %', field: "distdiscount", width: 90, editable: $scope.grideditable, headerTooltip: "To Customer Discount", cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                },
                cellClassRules: {
                    'bg-red': 'x > 100',
                },
                onCellValueChanged: function(params) {
                    if (params.newValue == '') {
                        params.data.distdiscount = 0;
                    }
                    else {
                        if (params.data.distdiscount != 0 && params.data.distmarginpercent > 0) {
                            params.data.distdiscount = 0;
                            toaster.pop('warning', "Warning", 'For Distributor Discount %  and  Distributor Margin %  both cannot be entered', null);
                        }
                        else {

                            if (params.data.distdiscount > 100) {
                                params.data.distdiscount = 0;
                                toaster.pop('warning', "Warning", 'For Distributor Discount % cannot be greater than 100%', null);
                            }

                        }
                    }
                    getdistributorandmargindiscount(params);
                },

            },
            {
                headerName: 'To Servion Price (USD) [Cost]',
                headerTooltip: "To Servion Price (Cost)",
                groupId: "GroupC",
                children: [
                    {
                        headerName: "Total", field: "STotal", width: 90, headerTooltip: "Total",
                        valueGetter: SYearTotalcalc,
                        cellStyle: { 'background-color': '#ACD0C0' },

                        newValueHandler: function(params) {
                            params.data.STotal = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "Syear1", width: 90,
                        cellStyle: { 'background-color': '#ACD0C0' },
                        newValueHandler: function(params) {
                            params.data.Syear1 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "Syear2", width: 90,
                        cellStyle: { 'background-color': '#ACD0C0' },
                        newValueHandler: function(params) {
                            params.data.Syear2 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "Syear3", width: 90,
                        cellStyle: { 'background-color': '#ACD0C0' },
                        newValueHandler: function(params) {
                            params.data.Syear3 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "Syear4", width: 90,
                        cellStyle: { 'background-color': '#ACD0C0' },
                        newValueHandler: function(params) {
                            params.data.Syear4 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "Syear5", width: 90,
                        cellStyle: { 'background-color': '#ACD0C0' },
                        newValueHandler: function(params) {
                            params.data.Syear5 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    }]
            },
            {
                headerName: 'Margin %', field: "marginpercent", width: 90, editable: $scope.grideditable, headerTooltip: "Margin %", cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else {
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                    }
                },
                onCellValueChanged: function(params) {

                    if (params.newValue == '') {
                        params.data.marginpercent = 0;
                    }
                    else {
                        if (params.data.marginpercent != 0 && params.data.customerdiscount > 0) {
                            toaster.pop('warning', "Warning", 'For Margin % and  Customer Discount % both cannot be entered', null);
                            params.data.marginpercent = 0;
                        }
                        else {

                            if (params.data.marginpercent >= 100) {
                                toaster.pop('warning', "Warning", 'For Margin % should be less than 100%', null);
                                params.data.marginpercent = 0;
                            }
                        }
                        getMarinpercent(params);
                    }
                },
            },
            {
                headerName: 'Customer Discount %', field: "customerdiscount", width: 90, editable: $scope.grideditable, headerTooltip: "To Customer Discount", cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else {
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                    }
                },
                onCellValueChanged: function(params) {
                    if (params.newValue == '') {
                        params.data.customerdiscount = 0;
                    }
                    else {
                        if (params.data.marginpercent > 0 && params.data.customerdiscount != 0) {
                            toaster.pop('warning', "Warning", 'For Margin % and  Distributor Discount % both cannot be entered', null);
                            params.data.customerdiscount = 0;
                        }
                        else {
                            if (params.data.customerdiscount > 100) {
                                toaster.pop('warning', "Warning", 'For Customer Discount % cannot be greater than 100%', null);
                                params.data.customerdiscount = 0;
                            }

                        }
                    }
                    getMarinpercent(params);
                }
            },

            {
                headerName: 'Calculated Margin %', field: "Calmarginpercent", width: 90, headerTooltip: "Calculated Margin %", cellRenderer: function(params) {
                    if (params.node.floating != "bottom") {
                        if (params.data.oem != 'Servion' && params.data.oem != '--Select--') {
                            var STotal = Math.round(parseFloat(params.data.Syear1) + parseFloat(params.data.Syear2) + parseFloat(params.data.Syear3) + parseFloat(params.data.Syear4) + parseFloat(params.data.Syear5));
                            var CTotal = Math.round(parseFloat(params.data.Cyear1) + parseFloat(params.data.Cyear2) + parseFloat(params.data.Cyear3) + parseFloat(params.data.Cyear4) + parseFloat(params.data.Cyear5));
                            debugger;
                            var total = CTotal - STotal;
                            var val = 0;
                            if (total != 0)
                                val = (total / CTotal) * 100;


                            params.value = parseFloat(val).toFixed(2);
                            params.data.Calmarginpercent = val;
                            return '<span title=' + params.value + ' class="' + getlevel(params) + '">' + params.value + ' %</span>';
                        }
                        else {
                            params.data.Calmarginpercent = 0;
                            params.value = 0;
                            return '<span title=' + params.value + '>' + params.value + '%</span>';
                        }
                    }
                    else {
                        params.data.Calmarginpercent = 0;
                        return '<span title=' + params.value + '>' + params.value + '%</span>';
                    }
                },
            },
            {
                headerName: 'Calculated Discount %', field: "Calcustomerdiscount", width: 90, headerTooltip: "Calculated Discount", cellRenderer: function(params) {
                    if (params.node.floating != "bottom") {
                        var CTotal = Math.round(parseFloat(params.data.Cyear1) + parseFloat(params.data.Cyear2) + parseFloat(params.data.Cyear3) + parseFloat(params.data.Cyear4) + parseFloat(params.data.Cyear5));
                        var LTotal = Math.round(parseFloat(params.data.Lyear1) + parseFloat(params.data.Lyear2) + parseFloat(params.data.Lyear3) + parseFloat(params.data.Lyear4) + parseFloat(params.data.Lyear5));

                        if (params.data.oem == 'Servion' && (LTotal > CTotal) && params.data.oem != '--Select--') {
                            var val = ((LTotal - CTotal) / LTotal) * 100;
                            params.value = parseFloat(val).toFixed(2);
                            params.data.Calcustomerdiscount = val;
                            return '<span title=' + params.value + ' class="' + getlevelcustomerdiscount(params) + '">' + params.value + ' %</span>';
                        }
                        else if (params.data.oem != '--Select--' && params.data.oem == 'Servion') {
                            params.data.Calcustomerdiscount = 0;
                            params.value = 0;
                            return '<span title=' + params.value + ' class="' + getlevelcustomerdiscount(params) + '">' + params.value + '%</span>';
                        }
                        else {
                            params.data.Calcustomerdiscount = 0;
                            params.value = 0;
                            return '<span title=' + params.value + '>' + params.value + '%</span>';
                        }
                    }
                    else {
                        params.data.Calcustomerdiscount = 0;
                        return '<span title=' + params.value + '>' + params.value + '%</span>';
                    }
                }

            },


            {
                headerName: 'Customer Price (USD) [Without Duty / Tax]',
                headerTooltip: "Customer Price",
                groupId: "GroupD",
                children: [
                    {
                        headerName: "Total", field: "CTotal", width: 90, headerTooltip: "Total",
                        valueGetter: CYearTotalcalc,

                        cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function(params) {
                            params.data.CTotal = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    }, {
                        headerName: "Year 1", field: "Cyear1", columnGroupShow: 'open', width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function(params) {
                            params.data.Cyear1 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "Cyear2", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function(params) {
                            params.data.Cyear2 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "Cyear3", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function(params) {
                            params.data.Cyear3 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "Cyear4", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function(params) {
                            params.data.Cyear4 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "Cyear5", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function(params) {
                            params.data.Cyear5 = params.newValue;
                        }
                        , cellRenderer: function(params) {
                            return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                        }
                    }]
            },
            {
                headerName: 'VAD / Margin (USD)',
                groupId: "GroupE",
                headerTooltip: "VAD/Margin",
                children: [{
                    headerName: "Total", field: "VTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.Vyear1) + parseInt(data.Vyear2) + parseInt(data.Vyear3) + parseInt(data.Vyear4) + parseInt(data.Vyear5))',

                    cellStyle: { 'background-color': '#D6CA8B' },
                    newValueHandler: function(params) {
                        params.data.VTotal = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "Vyear1", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                    newValueHandler: function(params) {
                        params.data.Vyear1 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "Vyear2", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                    newValueHandler: function(params) {
                        params.data.Vyear2 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "Vyear3", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                    newValueHandler: function(params) {
                        params.data.Vyear3 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "Vyear4", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                    newValueHandler: function(params) {
                        params.data.Vyear4 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "Vyear5", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                    newValueHandler: function(params) {
                        params.data.Vyear5 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]

            },
            {
                headerName: 'LOB', field: "LOBName", width: 100, headerTooltip: "LOB", //cellRenderer: LOBEditor
            },
            {
                headerName: '', width: 30, headerTooltip: "", cellStyle: { 'background-color': '#04202C' } //cellRenderer: LOBEditor
            },
            {
                headerName: 'Duty / TAX 1 %', field: "Dutytax1", width: 100, editable: $scope.grideditable, headerTooltip: "Duty / TAX 1 %", cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                },
                onCellValueChanged: function(params) {
                    getcalculationfordutytax(params);
                    $scope.gridOptions.api.refreshView();
                },
                newValueHandler: function(params) {
                    if (params.newValue == '') {
                        params.newValue = 0;
                    }
                    if (params.newValue > 100) {
                        toaster.pop('warning', "Warning", 'For Duty / TAX 1 % cannot be greater than 100%', null);
                        params.data.Dutytax1 = params.oldValue;
                    }
                    else
                        params.data.Dutytax1 = params.newValue;
                }
            },
            {
                headerName: 'Duty / TAX 2 %', field: "Dutytax2", width: 100, editable: $scope.grideditable, headerTooltip: "Duty / TAX 2 %", cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                },
                onCellValueChanged: function(params) {
                    getcalculationfordutytax(params);
                    $scope.gridOptions.api.refreshView();
                },
                newValueHandler: function(params) {
                    if (params.newValue == '') {
                        params.newValue = 0;
                    }
                    if (params.newValue > 100) {
                        toaster.pop('warning', "Warning", 'For Duty / TAX 2 % cannot be greater than 100%', null);
                        params.data.Dutytax2 = params.oldValue;
                    }
                    else
                        params.data.Dutytax2 = params.newValue;
                }
            },
            {
                headerName: 'Duty / TAX 3 %', field: "Dutytax3", width: 100, editable: $scope.grideditable, headerTooltip: "Duty / TAX 3 %", cellRenderer: function(params) {
                    if (params.node.floating != "bottom")
                        return '<span title=' + params.value + '>' + params.value + ' %</span>';
                    else
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                }
                , onCellValueChanged: function(params) {
                    getcalculationfordutytax(params);
                    $scope.gridOptions.api.refreshView();
                },
                newValueHandler: function(params) {
                    if (params.newValue == '') {
                        params.newValue = 0;
                    }
                    if (params.newValue > 100) {
                        toaster.pop('warning', "Warning", 'For Duty / TAX 3 % cannot be greater than 100%', null);
                        params.data.Dutytax3 = params.oldValue;
                    }
                    else
                        params.data.Dutytax3 = params.newValue;
                }
            },
            {
                headerName: 'Total Duty / TAX Value (USD)',
                groupId: "GroupF",
                headerTooltip: "Total Duty / TAX Value",
                children: [{
                    headerName: "Total", field: "DTTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.DTyear1) + parseInt(data.DTyear2) + parseInt(data.DTyear3) + parseInt(data.DTyear4) + parseInt(data.DTyear5))',

                    newValueHandler: function(params) {
                        params.data.DTTotal = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "DTyear1", width: 90,
                    newValueHandler: function(params) {
                        params.data.DTyear1 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "DTyear2", width: 90,
                    newValueHandler: function(params) {
                        params.data.DTyear2 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "DTyear3", width: 90,
                    newValueHandler: function(params) {
                        params.data.DTyear3 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "DTyear4", width: 90,
                    newValueHandler: function(params) {
                        params.data.DTyear4 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "DTyear5", width: 90,
                    newValueHandler: function(params) {
                        params.data.DTyear5 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]

            },
            {
                headerName: 'Final Customer Price (USD) [Includes Duty / Tax]',
                groupId: "GroupG",
                headerTooltip: "Final Customer Price (USD) [Includes Duty / Tax]",
                children: [{
                    headerName: "Total", field: "FCUTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.FCUyear1) + parseInt(data.FCUyear2) + parseInt(data.FCUyear3) + parseInt(data.FCUyear4) + parseInt(data.FCUyear5))',
                    cellStyle: { 'background-color': '#D4DDE1' },
                    newValueHandler: function(params) {
                        params.data.FCUTotal = parseInt(params.newValue);
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "FCUyear1", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                    newValueHandler: function(params) {
                        params.data.FCUyear1 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "FCUyear2", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                    newValueHandler: function(params) {
                        params.data.FCUyear2 = params.newValue;
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "FCUyear3", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                    newValueHandler: function(params) {
                        params.data.FCUyear3 = parseInt(params.newValue);
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "FCUyear4", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                    newValueHandler: function(params) {
                        params.data.FCUyear4 = parseInt(params.newValue);
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "FCUyear5", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                    newValueHandler: function(params) {
                        params.data.FCUyear5 = parseInt(params.newValue);
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]

            },
            {
                headerName: '', width: 30, headerTooltip: "", cellStyle: { 'background-color': '#04202C' },//cellRenderer: LOBEditor
            },
            {
                headerName: 'Currency', field: "CurrencyDescrition", width: 100, headerTooltip: "Currency", cellRenderer: CurrencyEditor
            },
            {
                headerName: 'Code', field: "Currency", width: 100, headerTooltip: "Code",
            },
            {
                headerName: 'Conversion Rate', field: "ConversionRate", width: 100, editable: $scope.grideditable, headerTooltip: "Conversion Rate", cellRenderer: function(params) {
                    return '<span title=' + params.value + '>' + params.value + '</span>';
                }
                , onCellValueChanged: function(params) {
                    singlecalc(params);
                }
            },

            {
                headerName: 'PO Customer Price (LOCAL CURRENCY) [Includes Duty / Tax]',
                groupId: "GroupH",
                headerTooltip: "PO Customer Price (LOCAL CURRENCY) [Includes Duty / Tax]",
                children: [{
                    headerName: "Total", field: "FCLTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.FCLyear1) + parseInt(data.FCLyear2) + parseInt(data.FCLyear3) + parseInt(data.FCLyear4) + parseInt(data.FCLyear5))',

                    cellStyle: { 'background-color': '#CDB7B5' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "FCLyear1", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "FCLyear2", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "FCLyear3", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "FCLyear4", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "FCLyear5", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]
            },
            {
                headerName: '', width: 30, headerTooltip: "", cellStyle: { 'background-color': '#04202C' },//cellRenderer: LOBEditor
            },

            {
                headerName: 'INFORMATION - Duty / TAX Value (LOCAL CURRENCY)',
                groupId: "GroupI",
                headerTooltip: "INFORMATION - Duty / TAX Value (LOCAL CURRENCY)",
                children: [{
                    headerName: "Total", field: "FDLTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.FDLyear1) + parseInt(data.FDLyear2) + parseInt(data.FDLyear3) + parseInt(data.FDLyear4) + parseInt(data.FDLyear5))',

                    cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "FDLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "FDLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    newValueHandler: function(params) {
                        params.data.FDLyear2 = parseInt(params.newValue);
                    }
                    , cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "FDLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "FDLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "FDLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]
            },

            {
                headerName: 'INFORMATION - Customer Price  (LOCAL CURRENCY) [Without Duty / Tax]',
                groupId: "GroupJ",
                headerTooltip: "INFORMATION - Customer Price  (LOCAL CURRENCY) [Without Duty / Tax]",
                children: [{
                    headerName: "Total", field: "FWDLTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.FWDLyear1) + parseInt(data.FWDLyear2) + parseInt(data.FWDLyear3) + parseInt(data.FWDLyear4) + parseInt(data.FWDLyear5))',

                    cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "FWDLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "FWDLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "FWDLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "FWDLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "FWDLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]
            },

            {
                headerName: 'INFORMATION - To Servion Price (LOCAL CURRENCY) [Cost]',
                groupId: "GroupK",
                headerTooltip: "INFORMATION - To Servion Price (LOCAL CURRENCY) [Cost]",
                children: [{
                    headerName: "Total", field: "FSLTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.FSLyear1) + parseInt(data.FSLyear2) + parseInt(data.FSLyear3) + parseInt(data.FSLyear4) + parseInt(data.FSLyear5))',

                    cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "FSLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "FSLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "FSLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "FSLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "FSLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]
            },

            {
                headerName: 'INFORMATION - VAD / Margin (LOCAL CURRENCY)',
                groupId: "GroupL",
                headerTooltip: "INFORMATION - VAD / Margin (LOCAL CURRENCY)",
                children: [{
                    headerName: "Total", field: "FVLTotal", width: 90, headerTooltip: "Total",
                    valueGetter: 'parseInt(parseInt(data.FVLyear1) + parseInt(data.FVLyear2) + parseInt(data.FVLyear3) + parseInt(data.FVLyear4) + parseInt(data.FVLyear5))',

                    cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 1", columnGroupShow: 'open', field: "FVLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 2", columnGroupShow: 'open', field: "FVLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 3", columnGroupShow: 'open', field: "FVLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 4", columnGroupShow: 'open', field: "FVLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                },
                {
                    headerName: "Year 5", columnGroupShow: 'open', field: "FVLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                    cellRenderer: function(params) {
                        return '<span title=' + params.value + '>' + PutComma(params.value) + '</span>';;
                    }
                }]
            },
        ];

        $scope.gridOptions.api.setColumnDefs(columnDefs);

        //for (var i = 2; i <= 5; i++) {
        //    $scope.gridOptions.columnApi.setColumnsVisible(['Cyear' + i, 'Vyear' + i, 'Lyear' + i, 'Oyear' + i, 'Syear' + i, 'DTyear' + i, 'FCUyear' + i, 'FCLyear' + i], false);
        //}
        for (var i = 2; i <= $scope.yearid; i++) {
            $scope.gridOptions.columnApi.setColumnsVisible(['Cyear' + i, 'Vyear' + i, 'Lyear' + i, 'Oyear' + i, 'Syear' + i, 'DTyear' + i, 'FCUyear' + i, 'FCLyear' + i, 'FVLyear' + i, 'FSLyear' + i, 'FWDLyear' + i, 'FDLyear' + i], true);
        }

        $scope.gridOptions.columnApi.setColumnsVisible(['OemId', 'ComponenttypeId', 'PricetypeId'], false);

        $scope.gridOptions.api.setRowData($scope.data);
        $scope.gridOptions.rowData = $scope.data;
        $scope.expandall(true);
        document.getElementById('overlay').style.display = 'none';
        onFloatingBottomCount(1);
        resetgridcollapsestate();
    }
    //end Loading Column Definitions

    function getlevel(params) {
        if (params.data.oem != "Servion") {
            var returnval = '';
            _.each($scope.margin, function(value, key) {

                if (value["ComponentType"] == params.data.ComponenttypeId && value["Vendor"] == params.data.OemId) {

                    if (params.data.Calmarginpercent <= value["DefaultVal"] && params.data.Calmarginpercent > value["Level1"]) {
                        returnval = "great";
                    }
                    else if (params.data.Calmarginpercent <= value["Level1"] && params.data.Calmarginpercent > value["Level2"]) {
                        returnval = "Level1";
                    }
                    else if (params.data.Calmarginpercent <= value["Level2"] && params.data.Calmarginpercent > value["Level3"]) {
                        returnval = "Level2";
                    }
                    else if (params.data.Calmarginpercent <= value["Level3"] && params.data.Calmarginpercent > 0) {
                        returnval = "Level3";
                    }
                }
                else if (value["ComponentType"] == params.data.ComponenttypeId) {

                    if (params.data.Calmarginpercent <= value["DefaultVal"] && params.data.Calmarginpercent > value["Level1"]) {
                        returnval = "great";
                    }
                    else if (params.data.Calmarginpercent <= value["Level1"] && params.data.Calmarginpercent > value["Level2"]) {
                        returnval = "Level1";
                    }
                    else if (params.data.Calmarginpercent <= value["Level2"] && params.data.Calmarginpercent > value["Level3"]) {
                        returnval = "Level2";
                    }
                    else if (params.data.Calmarginpercent <= value["Level3"] && params.data.Calmarginpercent > 0) {
                        returnval = "Level3";
                    }
                }
            });

            return returnval;
        }
    }

    function getlevelcustomerdiscount(params) {
        if (params.data.oem == "Servion") {
            var returnval = '';
            _.each($scope.discount, function(value, key) {

                if (value["ComponentType"] == params.data.ComponenttypeId && value["Vendor"] == params.data.OemId) {
                    if (params.data.Calcustomerdiscount >= value["DefaultVal"] && params.data.Calcustomerdiscount < value["Level1"] && params.data.Calcustomerdiscount > 0) {
                        returnval = "great";
                    }
                    else if (params.data.Calcustomerdiscount >= value["Level1"] && params.data.Calcustomerdiscount < value["Level2"]) {
                        returnval = "Level1";
                    }
                    else if (params.data.Calcustomerdiscount >= value["Level2"] && params.data.Calcustomerdiscount < value["Level3"]) {
                        returnval = "Level2";
                    }
                    else if (params.data.Calcustomerdiscount >= value["Level3"] && params.data.Calcustomerdiscount > value["Level2"]) {
                        returnval = "Level3";
                    }
                }
                else if (value["ComponentType"] == params.data.ComponenttypeId) {
                    if (params.data.Calcustomerdiscount >= value["DefaultVal"] && params.data.Calcustomerdiscount < value["Level1"] && params.data.Calcustomerdiscount > 0) {
                        returnval = "great";
                    }
                    else if (params.data.Calcustomerdiscount >= value["Level1"] && params.data.Calcustomerdiscount < value["Level2"]) {
                        returnval = "Level1";
                    }
                    else if (params.data.Calcustomerdiscount >= value["Level2"] && params.data.Calcustomerdiscount < value["Level3"]) {
                        returnval = "Level2";
                    }
                    else if (params.data.Calcustomerdiscount >= value["Level3"] && params.data.Calcustomerdiscount > value["Level2"]) {
                        returnval = "Level3";
                    }
                }
            });
            return returnval;
        }
    }
    function LYearTotalcalc(params) {
        var finaltotal = 0;
        finaltotal = Math.round(parseFloat(params.data.Lyear1) + parseFloat(params.data.Lyear2) + parseFloat(params.data.Lyear3) + parseFloat(params.data.Lyear4) + parseFloat(params.data.Lyear5));
        params.data.LTotal = finaltotal;
        return finaltotal;
    }

    function OYearTotalcalc(params) {
        var finaltotal = 0;
        finaltotal = Math.round(parseFloat(params.data.Oyear1) + parseFloat(params.data.Oyear2) + parseFloat(params.data.Oyear3) + parseFloat(params.data.Oyear4) + parseFloat(params.data.Oyear5));
        params.data.OTotal = finaltotal;
        return finaltotal;
    }

    function SYearTotalcalc(params) {
        var finaltotal = 0;
        finaltotal = Math.round(parseFloat(params.data.Syear1) + parseFloat(params.data.Syear2) + parseFloat(params.data.Syear3) + parseFloat(params.data.Syear4) + parseFloat(params.data.Syear5));
        params.data.STotal = finaltotal;
        return finaltotal;
    }

    function CYearTotalcalc(params) {
        var finaltotal = 0;
        finaltotal = Math.round(parseFloat(params.data.Cyear1) + parseFloat(params.data.Cyear2) + parseFloat(params.data.Cyear3) + parseFloat(params.data.Cyear4) + parseFloat(params.data.Cyear5));
        params.data.CTotal = finaltotal;
        return finaltotal;
    }


    function headerCellRendererFunc(params) {
        var eHeader = document.createElement('span');
        //var eTitle = document.createTextNode(params.colDef.headerName);

        str = params.colDef.headerName;

        if (str.length > 8) {
            var html = str.split(" ");
            if (html.length > 1) {
                html = html[0] + " <br /> " + html.slice(1).join(" ");
                str = html;
            }

        }
        // var eTitle = document.innerHTML (str);
        eHeader.innerHTML = str;
        if (params.colDef.headerName == "Vendor Discount %" || params.colDef.headerName == "Distributor Margin %" || params.colDef.headerName == "Distributor Discount %" || params.colDef.headerName == "Margin %" || params.colDef.headerName == "Customer Discount %") {
            eHeader.style.color = 'yellow';
        }
        else if (params.colDef.headerName == "Calculated Margin %" || params.colDef.headerName == "Calculated Discount %") {
            eHeader.style.color = 'blue';
        }
        return eHeader;
    }


    function onSelectionChanged() {
        var selectedRows = $scope.gridOptions.api.getSelectedNodes();
        $scope.currentworkingrow = selectedRows[0].childIndex;
    }


    function onFloatingBottomCount(footerRowsToFloat) {
        var count = Number(footerRowsToFloat);
        var rows = createData(count, 'Bottom');
        $scope.gridOptions.api.setFloatingBottomRowData(rows);
    }

    function createData(count, prefix) {
        var result = [];

        var cyear1 = 0, cyear2 = 0, cyear3 = 0, cyear4 = 0, cyear5 = 0, vyear1 = 0, vyear2 = 0, vyear3 = 0, vyear4 = 0, vyear5 = 0, lyear1 = 0, lyear2 = 0, lyear3 = 0, lyear4 = 0, lyear5 = 0, oyear1 = 0, oyear2 = 0, oyear3 = 0, oyear4 = 0, oyear5 = 0, forvendordiscount = 0, marginpercent = 0, customerdiscount = 0, Syear1 = 0, Syear2 = 0, Syear3 = 0, Syear4 = 0, Syear5 = 0, distmarginpercent = 0, distdiscount = 0, Dutytax1 = 0, Dutytax2 = 0, Dutytax3 = 0, DTyear1 = 0, DTyear2 = 0, DTyear3 = 0, DTyear4 = 0, DTyear5 = 0, DTTotal = 0, FCUyear1 = 0, FCUyear2 = 0, FCUyear3 = 0, FCUyear4 = 0, FCUyear5 = 0, FCUTotal = 0, Currency = 0, FCLyear1 = 0, FCLyear2 = 0, FCLyear3 = 0, FCLyear4 = 0, FCLyear5 = 0, FCLTotal = 0, FDLyear1 = 0, FDLyear2 = 0, FDLyear3 = 0, FDLyear4 = 0, FDLyear5 = 0, FDLTotal = 0, FWDLyear1 = 0, FWDLyear2 = 0, FWDLyear3 = 0, FWDLyear4 = 0, FWDLyear5 = 0, FWDLTotal = 0, FSLyear1 = 0, FSLyear2 = 0, FSLyear3 = 0, FSLyear4 = 0, FSLyear5 = 0, FSLTotal = 0, FVLyear1 = 0, FVLyear2 = 0, FVLyear3 = 0, FVLyear4 = 0, FVLyear5 = 0, FVLTotal = 0;

        for (var i = 0; i < $scope.data.length; i++) {
            cyear1 += parseFloat($scope.data[i].Cyear1);
            cyear2 += parseFloat($scope.data[i].Cyear2);
            cyear3 += parseFloat($scope.data[i].Cyear3);
            cyear4 += parseFloat($scope.data[i].Cyear4);
            cyear5 += parseFloat($scope.data[i].Cyear5);
            lyear1 += parseFloat($scope.data[i].Lyear1);
            lyear2 += parseFloat($scope.data[i].Lyear2);
            lyear3 += parseFloat($scope.data[i].Lyear3);
            lyear4 += parseFloat($scope.data[i].Lyear4);
            lyear5 += parseFloat($scope.data[i].Lyear5);
            oyear1 += parseFloat($scope.data[i].Oyear1);
            oyear2 += parseFloat($scope.data[i].Oyear2);
            oyear3 += parseFloat($scope.data[i].Oyear3);
            oyear4 += parseFloat($scope.data[i].Oyear4);
            oyear5 += parseFloat($scope.data[i].Oyear5);
            vyear1 += parseFloat($scope.data[i].Vyear1);
            vyear2 += parseFloat($scope.data[i].Vyear2);
            vyear3 += parseFloat($scope.data[i].Vyear3);
            vyear4 += parseFloat($scope.data[i].Vyear4);
            vyear5 += parseFloat($scope.data[i].Vyear5);
            customerdiscount += parseFloat($scope.data[i].customerdiscount);
            //forvendordiscount += parseFloat($scope.data[i].forvendordiscount);
            //lob += parseFloat($scope.data[i].lob);
            marginpercent += parseFloat($scope.data[i].marginpercent);

            Syear1 += parseFloat($scope.data[i].Syear1);
            Syear2 += parseFloat($scope.data[i].Syear2);
            Syear3 += parseFloat($scope.data[i].Syear3);
            Syear4 += parseFloat($scope.data[i].Syear4);
            Syear5 += parseFloat($scope.data[i].Syear5);

            DTyear1 += parseFloat($scope.data[i].DTyear1);
            DTyear2 += parseFloat($scope.data[i].DTyear2);
            DTyear3 += parseFloat($scope.data[i].DTyear3);
            DTyear4 += parseFloat($scope.data[i].DTyear4);
            DTyear5 += parseFloat($scope.data[i].DTyear5);
            DTTotal += parseFloat($scope.data[i].DTTotal);
            FCUyear1 += parseFloat($scope.data[i].FCUyear1);
            FCUyear2 += parseFloat($scope.data[i].FCUyear2);
            FCUyear3 += parseFloat($scope.data[i].FCUyear3);
            FCUyear4 += parseFloat($scope.data[i].FCUyear4);
            FCUyear5 += parseFloat($scope.data[i].FCUyear5);
            FCUTotal += parseFloat($scope.data[i].FCUTotal);

            FCLyear1 += parseFloat($scope.data[i].FCLyear1);
            FCLyear2 += parseFloat($scope.data[i].FCLyear2);
            FCLyear3 += parseFloat($scope.data[i].FCLyear3);
            FCLyear4 += parseFloat($scope.data[i].FCLyear4);
            FCLyear5 += parseFloat($scope.data[i].FCLyear5);
            FCLTotal += parseFloat($scope.data[i].FCLTotal);



            FDLyear1 += parseFloat($scope.data[i].FDLyear1);
            FDLyear2 += parseFloat($scope.data[i].FDLyear2);
            FDLyear3 += parseFloat($scope.data[i].FDLyear3);
            FDLyear4 += parseFloat($scope.data[i].FDLyear4);
            FDLyear5 += parseFloat($scope.data[i].FDLyear5);
            FDLTotal += parseFloat($scope.data[i].FDLTotal);



            FWDLyear1 += parseFloat($scope.data[i].FWDLyear1);
            FWDLyear2 += parseFloat($scope.data[i].FWDLyear2);
            FWDLyear3 += parseFloat($scope.data[i].FWDLyear3);
            FWDLyear4 += parseFloat($scope.data[i].FWDLyear4);
            FWDLyear5 += parseFloat($scope.data[i].FWDLyear5);
            FWDLTotal += parseFloat($scope.data[i].FWDLTotal);


            FSLyear1 += parseFloat($scope.data[i].FSLyear1);
            FSLyear2 += parseFloat($scope.data[i].FSLyear2);
            FSLyear3 += parseFloat($scope.data[i].FSLyear3);
            FSLyear4 += parseFloat($scope.data[i].FSLyear4);
            FSLyear5 += parseFloat($scope.data[i].FSLyear5);
            FSLTotal += parseFloat($scope.data[i].FSLTotal);


            FVLyear1 += parseFloat($scope.data[i].FVLyear1);
            FVLyear2 += parseFloat($scope.data[i].FVLyear2);
            FVLyear3 += parseFloat($scope.data[i].FVLyear3);
            FVLyear4 += parseFloat($scope.data[i].FVLyear4);
            FVLyear5 += parseFloat($scope.data[i].FVLyear5);
            FVLTotal += parseFloat($scope.data[i].FVLTotal);

        }

        for (var i = 0; i < count; i++) {
            result.push({
                RowId: 'Total', OppId: '', ServionLegalEntity: '', oem: '', Component: '', LOBName: '', ProductName: '', componenttype: '', pricetype: '', Cyear1: cyear1, Cyear2: cyear2, Cyear3: cyear3, Cyear4: cyear4, Cyear5: cyear5, Vyear1: vyear1, Vyear2: vyear2, Vyear3: vyear3, Vyear4: vyear4, Vyear5: vyear5, Lyear1: Math.ceil(lyear1), Lyear2: Math.ceil(lyear2), Lyear3: Math.ceil(lyear3), Lyear4: Math.ceil(lyear4), Lyear5: Math.ceil(lyear5), Oyear1: oyear1, Oyear2: oyear2, Oyear3: oyear3, Oyear4: oyear4, Oyear5: oyear5, forvendordiscount: '', marginpercent: '', customerdiscount: '', Calcustomerdiscount: '', Calmarginpercent: '',
                Syear1: Syear1, Syear2: Syear2, Syear3: Syear3, Syear4: Syear4, Syear5: Syear5, distmarginpercent: '', distdiscount: '', Dutytax1: '', Dutytax2: '', Dutytax3: '', DTyear1: DTyear1, DTyear2: DTyear2, DTyear3: DTyear3, DTyear4: DTyear4, DTyear5: DTyear5, DTTotal: DTTotal, FCUyear1: FCUyear1, FCUyear2: FCUyear2, FCUyear3: FCUyear3, FCUyear4: FCUyear4, FCUyear5: FCUyear5, FCUTotal: FCUTotal, Currency: '', ConversionRate: '', FCLyear1: FCLyear1, FCLyear2: FCLyear2, FCLyear3: FCLyear3, FCLyear4: FCLyear4, FCLyear5: FCLyear5, FCLTotal: FCLTotal,
                FDLyear1: FDLyear1, FDLyear2: FDLyear2, FDLyear3: FDLyear3, FDLyear4: FDLyear4, FDLyear5: FDLyear5, FDLTotal: FDLTotal
                , FWDLyear1: FWDLyear1, FWDLyear2: FWDLyear2, FWDLyear3: FWDLyear3, FWDLyear4: FWDLyear4, FWDLyear5: FWDLyear5, FWDLTotal: FWDLTotal
                , FSLyear1: FSLyear1, FSLyear2: FSLyear2, FSLyear3: FSLyear3, FSLyear4: FSLyear4, FSLyear5: FSLyear5, FSLTotal: FSLTotal
                , FVLyear1: FVLyear1, FVLyear2: FVLyear2, FVLyear3: FVLyear3, FVLyear4: FVLyear4, FVLyear5: FVLyear5, FVLTotal: FVLTotal
            });
        }

        $scope.Totalresult = result;

        return result;
    }

    function cellValueChangedFunction() {
        onFloatingBottomCount(1);
        console.log('cell value Changes')
    }

    //Start Grid Handler Operations

    function numberNewValueHandler(params) {
        var valueAsNumber = parseInt(params.newValue);
        if (isNaN(valueAsNumber)) {
            toaster.pop('warning', "Warning", "Invalid value " + params.newValue + ", must be a number", null);
        } else {
            params.data.number = valueAsNumber;
        }
    }

    function LegalEntityEditor(params) {
        if (params.node.floating != "bottom") {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);
            if ($scope.grideditable) {
                var eSelect = document.createElement("select");
                $scope.ServionLegalEntities.forEach(function(item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.ServionLegalEntity);
                    eOption.setAttribute("title", item.ServionLegalEntityID);
                    eOption.innerHTML = item.ServionLegalEntity;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function() {
                    if (!editing) {
                        eCell.removeChild(eLabel);
                        eCell.appendChild(eSelect);
                        eSelect.focus();
                        editing = true;
                    }
                });

                eSelect.addEventListener('blur', function() {
                    if (editing) {
                        editing = false;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }

                });

                eSelect.addEventListener('change', function() {
                    if (editing) {
                        var newValue = eSelect.value;
                        var id = eSelect[eSelect.selectedIndex].title;
                        params.data.LegalEntityId = parseInt(id);

                        if (newValue == '--Select--') {
                            toaster.pop('warning', "Warning", 'Please select ServionLegalEntity', null);
                        }
                        else {
                            editing = false;
                            params.data[params.colDef.field] = newValue;
                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);

                            GetDefaultcurencybyLegalEntity(id);
                        }
                    }
                });
            }
            return eCell;
        }
        else {
            return "";
        }
    }

    function GetDefaultcurencybyLegalEntity(id) {
        priceService.GetDefaultcurencybyLegalEntity(id, $scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId).success(function(data) {
            if (data != null && data.length > 0) {
                //$scope.CurrencyList = data;
                $scope.data[$scope.currentworkingrow].ConversionRate = data[0].ConversionRate;
                //Currency Conversion
                getFinalCurrencyConversionRate($scope.data[$scope.currentworkingrow]);
            }
            else {
                //error in console
                $scope.data[$scope.currentworkingrow].ConversionRate = 'NA';
                getFinalCurrencyConversionRate($scope.data[$scope.currentworkingrow]);
                //apply default value
            }
            $scope.gridOptions.api.refreshView();
        }).error(function(error) {
            $scope.Error = error;
        })


    }

    function CurrencyEditor(params) {
        if (params.node.floating != "bottom") {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);
            if ($scope.grideditable) {
                var eSelect = document.createElement("select");

                $scope.CurrencyList.forEach(function(item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.CurrencyDescrition);
                    eOption.setAttribute("title", item.Id);
                    eOption.innerHTML = item.CurrencyDescrition;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function() {
                    if (!editing) {
                        eCell.removeChild(eLabel);
                        eCell.appendChild(eSelect);
                        eSelect.focus();
                        editing = true;
                    }
                });

                eSelect.addEventListener('blur', function() {
                    if (editing) {
                        editing = false;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }

                });

                eSelect.addEventListener('change', function() {
                    if (editing) {
                        var newValue = eSelect.value;
                        var id = eSelect[eSelect.selectedIndex].title;
                        params.data.CurrencyId = parseInt(id);

                        if (newValue == '--Select--') {
                            toaster.pop('warning', "Warning", 'Please select Currency', null);
                        }
                        else {
                            editing = false;
                            params.data[params.colDef.field] = newValue;
                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                            $scope.currentworkingrow = params.rowIndex;

                            var code = '';
                            _.each($scope.CurrencyList, function(value, key) {
                                if (value["CurrencyDescrition"] == newValue) {
                                    code = value["Currency"]
                                }
                            });
                            params.data.Currency = code;

                            if (params.data.LegalEntityId != null) {
                                $scope.GetCurrencyConversionForPricing(params.data.LegalEntityId, $scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId, id);
                            }
                        }
                    }
                });
            }
            return eCell;
        }
        else {
            return "";
        }
    }

    function OppEditor(params) {
        if (params.node.floating != "bottom") {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);
            if ($scope.grideditable) {
                var eSelect = document.createElement("select");
                $scope.ChildOpportunity.forEach(function(item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.OppId);
                    eOption.innerHTML = item.OppId;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function() {
                    if (!editing) {
                        eCell.removeChild(eLabel);
                        eCell.appendChild(eSelect);
                        eSelect.focus();
                        editing = true;
                    }
                });

                eSelect.addEventListener('blur', function() {
                    if (editing) {
                        editing = false;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }

                });

                eSelect.addEventListener('change', function() {
                    if (editing) {
                        var newValue = eSelect.value;

                        if (newValue == '--Select--') {
                            toaster.pop('warning', "Warning", 'Please select Opportunity ID', null);
                        }
                        else {
                            editing = false;
                            params.data[params.colDef.field] = newValue;
                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }
                    }
                });
            }
            return eCell;
        }
        else {
            return "";
        }
    }


    function ProductEditor(params) {
        if (params.node.floating != "bottom") {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);

            if ($scope.grideditable) {

                var eSelect = document.createElement("select");

                $scope.ProductList.forEach(function(item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.ProductName);
                    eOption.setAttribute("title", item.Id);
                    eOption.innerHTML = item.ProductName;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function() {

                    if (getdataforselectionchange(params)) {
                        if (!editing) {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    }

                });

                eSelect.addEventListener('blur', function() {
                    if (editing) {
                        editing = false;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }

                });

                eSelect.addEventListener('change', function() {
                    if (editing) {
                        var newValue = eSelect.value;
                        var id = eSelect[eSelect.selectedIndex].title;
                        params.data.ProductId = parseInt(id);

                        if (newValue == '--Select--') {
                            toaster.pop('warning', "Warning", 'Please select ProductType', null);
                        }
                        else {
                            editing = false;
                            params.data[params.colDef.field] = newValue;
                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }
                    }
                });
            }
            return eCell;
        }
        else {
            return "";
        }
    }

    function getdataforselectionchange(params) {
        if ((params.data.oem == 'Servion' || params.data.oem == 'Acqueon') && (params.data.componenttype == "AMC-SW" || params.data.componenttype == "Software")) {
            return true;
        }
        else {
            return false;
        }
    }

    function customCompEditor(params) {
        if (params.node.floating != "bottom") {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);
            if ($scope.grideditable) {

                var eSelect = document.createElement("select");

                $scope.setComponentSelectionOptions.forEach(function(item) {

                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.ComponentType);
                    eOption.setAttribute("title", item.Id);
                    eOption.innerHTML = item.ComponentType;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function() {
                    if (!editing) {
                        eCell.removeChild(eLabel);
                        eCell.appendChild(eSelect);
                        eSelect.focus();
                        editing = true;
                    }
                });

                eSelect.addEventListener('blur', function() {
                    if (editing) {
                        editing = false;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }

                });

                eSelect.addEventListener('change', function() {
                    if (editing) {
                        var newValue = eSelect.value;
                        var id = eSelect[eSelect.selectedIndex].title;
                        params.data.ComponenttypeId = parseInt(id);

                        if (newValue == '--Select--') {
                            toaster.pop('warning', "Warning", 'Please select ComponentType', null);
                        }
                        else {
                            editing = false;
                            params.data[params.colDef.field] = newValue;
                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }

                        if (!getdataforselectionchange(params)) {
                            params.data.ProductId = 1;
                            params.data.ProductName = 'NA';
                        }
                        getLOBValue(params);

                        $scope.gridOptions.api.refreshView();
                    }
                });
            }
            return eCell;
        }
        else {
            return "";
        }
    }

    function customPriceEditor(params) {
        if (params.node.floating != "bottom") {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;

            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);
            if ($scope.grideditable) {

                var eSelect = document.createElement("select");

                $scope.setPriceTypeSelectionOptions.forEach(function(item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.PriceType);
                    eOption.setAttribute("title", item.Id);
                    eOption.innerHTML = item.PriceType;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function() {

                    if (!editing) {
                        eCell.removeChild(eLabel);
                        eCell.appendChild(eSelect);
                        eSelect.focus();
                        editing = true;
                    }
                });

                eSelect.addEventListener('blur', function() {
                    if (editing) {
                        editing = false;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }

                });

                eSelect.addEventListener('change', function() {
                    if (editing) {
                        var newValue = eSelect.value;
                        if (newValue == '--Select--') {
                            toaster.pop('warning', "Warning", 'Please select PriceType', null);
                        }
                        else {
                            editing = false;
                            var newValue = eSelect.value;
                            var id = eSelect[eSelect.selectedIndex].title;
                            params.data[params.colDef.field] = newValue;
                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                            params.data.PricetypeId = parseInt(id);
                            getcalculationforPriceEditorChange(params);

                            onFloatingBottomCount(1);
                            $scope.gridOptions.api.refreshView();
                        }
                    }
                });
            }
            return eCell;
        }
        else {
            return "";
        }
    }

    function OEMEditor(params) {
        if (params.node.floating != "bottom") {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);
            if ($scope.grideditable) {

                var eSelect = document.createElement("select");

                $scope.setOEMSelectionOptions.forEach(function(item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.VendorName);
                    eOption.setAttribute("title", item.Id);
                    eOption.innerHTML = item.VendorName;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function() {

                    if (!editing) {
                        eCell.removeChild(eLabel);
                        eCell.appendChild(eSelect);
                        eSelect.focus();
                        editing = true;
                    }
                });

                eSelect.addEventListener('blur', function() {


                    if (editing) {
                        editing = false;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }

                });

                eSelect.addEventListener('change', function() {

                    if (editing) {
                        editing = false;
                        var newValue = eSelect.value;
                        var id = eSelect[eSelect.selectedIndex].title;

                        params.data[params.colDef.field] = newValue;
                        eLabel.nodeValue = newValue;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                        params.data.OemId = parseInt(id);
                        getcalculationforOEMEditorChange(params);
                        onFloatingBottomCount(1);

                        if (!getdataforselectionchange(params)) {
                            params.data.ProductId = 1;
                            params.data.ProductName = 'NA';
                        }
                        getLOBValue(params);

                        $scope.gridOptions.api.refreshView();

                    }
                });

            }
            return eCell;
        }
        else {
            return "";
        }
    }

    //End Grid Handler Operations

    $scope.sizeToFit = function() {
        $scope.gridOptions.api.sizeColumnsToFit();
    }

    $scope.autoSizeAll = function() {

        var allColumnIds = [];
        $scope.gridOptions.api.columnController.allColumns.forEach(function(columnDef) {
            allColumnIds.push(columnDef.field);
        });
        $scope.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        $scope.gridOptions.api.refreshView();
        $scope.gridOptions.columnApi.setColumnsVisible(['OemId', 'ComponenttypeId', 'PricetypeId'], false);

    }

    $scope.addnewpricerow = function() {
        angular.element(document.getElementById('btnadd'))[0].disabled = true;
        angular.element(document.querySelector('#loader')).removeClass('hide');

        var selectedRows = $scope.gridOptions.api.getSelectedNodes();

        var curentId = 0;
        if ($scope.gridOptions.rowData.length == 0) {
            curentId = 1;
        }
        else {
            maxindex = $scope.gridOptions.rowData.length - 1;
            var curentId = $scope.gridOptions.rowData[maxindex].RowId + 1;
        }

        //come

        var Currencydescription = '';
        _.each($scope.CurrencyList, function(value, key) {
            if (value["Currency"] == $scope.DefaultCurrency) {
                Currencydescription = value["CurrencyDescrition"]
            }
        });

        if (selectedRows.length > 0) {
            var alterrows = selectedRows[0].childIndex + 1;
            var newid = alterrows + 1;
            $scope.data.splice(alterrows, 0, { RowId: newid, ProductId: 1, OppId: $scope.OpportunityDetail.OppId, LegalEntityId: $scope.OpportunityDetail.ServionLegalEntity, ProductName: '--Select--', ServionLegalEntity: $scope.ServionLegalEntityName, oem: '--Select--', Component: '', componenttype: '--Select--', pricetype: '--Select--', Cyear1: '0', Cyear2: '0', Cyear3: '0', Cyear4: '0', Cyear5: '0', CTotal: '0', Vyear1: '0', Vyear2: '0', Vyear3: '0', Vyear4: '0', Vyear5: '0', VTotal: '0', Lyear1: '0', Lyear2: '0', Lyear3: '0', Lyear4: '0', Lyear5: '0', LTotal: '0', Oyear1: '0', Oyear2: '0', Oyear3: '0', Oyear4: '0', Oyear5: '0', OTotal: '0', Syear1: '0', Syear2: '0', Syear3: '0', Syear4: '0', Syear5: '0', STotal: '0', forvendordiscount: '0', marginpercent: '0', customerdiscount: '0', distmarginpercent: '0', distdiscount: '0', LOBName: 'OTHERS', version: 1, PriceSheetGroupId: $scope.MaxSheetGroupID, IsEditable: $scope.grideditable, Dutytax1: '0', Dutytax2: '0', Dutytax3: '0', DTyear1: '0', DTyear2: '0', DTyear3: '0', DTyear4: '0', DTyear5: '0', DTTotal: '0', FCUyear1: '0', FCUyear2: '0', FCUyear3: '0', FCUyear4: '0', FCUyear5: '0', FCUTotal: '0', Currency: $scope.DefaultCurrency, ConversionRate: $scope.DefaultConversionRate, FCLyear1: '0', FCLyear2: '0', FCLyear3: '0', FCLyear4: '0', FCLyear5: '0', FCLTotal: '0', FDLyear1: '0', FDLyear2: '0', FDLyear3: '0', FDLyear4: '0', FDLyear5: '0', FDLTotal: '0', FWDLyear1: '0', FWDLyear2: '0', FWDLyear3: '0', FWDLyear4: '0', FWDLyear5: '0', FWDLTotal: '0', FSLyear1: '0', FSLyear2: '0', FSLyear3: '0', FSLyear4: '0', FSLyear5: '0', FSLTotal: '0', FVLyear1: '0', FVLyear2: '0', FVLyear3: '0', FVLyear4: '0', FVLyear5: '0', FVLTotal: '0', lobname: '-Select-', CurrencyId: $scope.DefaultCurrencyID, PricetypeId: 1, OemId: 1, ComponenttypeId: 1, lob: 1, CurrencyDescrition: Currencydescription });
            alterrows = newid;

            for (alterrows; alterrows < $scope.gridOptions.rowData.length; alterrows++) {
                console.log(alterrows)
                $scope.data[alterrows].RowId = alterrows + 1;
            }

        }
        else {
            $scope.data.push({
                RowId: curentId, ProductId: 1, OppId: $scope.OpportunityDetail.OppId, LegalEntityId: $scope.OpportunityDetail.ServionLegalEntity, ProductName: '--Select--', ServionLegalEntity: $scope.ServionLegalEntityName, oem: '--Select--', Component: '', componenttype: '--Select--', pricetype: '--Select--', Cyear1: '0', Cyear2: '0', Cyear3: '0', Cyear4: '0', Cyear5: '0', CTotal: '0', Vyear1: '0', Vyear2: '0', Vyear3: '0', Vyear4: '0', Vyear5: '0', VTotal: '0', Lyear1: '0', Lyear2: '0', Lyear3: '0', Lyear4: '0', Lyear5: '0', LTotal: '0', Oyear1: '0', Oyear2: '0', Oyear3: '0', Oyear4: '0', Oyear5: '0', OTotal: '0', Syear1: '0', Syear2: '0', Syear3: '0', Syear4: '0', Syear5: '0', STotal: '0', forvendordiscount: '0', marginpercent: '0', customerdiscount: '0', distmarginpercent: '0', distdiscount: '0', LOBName: 'OTHERS', version: 1, PriceSheetGroupId: $scope.MaxSheetGroupID, IsEditable: $scope.grideditable, Dutytax1: '0', Dutytax2: '0', Dutytax3: '0', DTyear1: '0', DTyear2: '0', DTyear3: '0', DTyear4: '0', DTyear5: '0', DTTotal: '0', FCUyear1: '0', FCUyear2: '0', FCUyear3: '0', FCUyear4: '0', FCUyear5: '0', FCUTotal: '0', Currency: $scope.DefaultCurrency, ConversionRate: $scope.DefaultConversionRate, FCLyear1: '0', FCLyear2: '0', FCLyear3: '0', FCLyear4: '0', FCLyear5: '0', FCLTotal: '0', FDLyear1: '0', FDLyear2: '0', FDLyear3: '0', FDLyear4: '0', FDLyear5: '0', FDLTotal: '0', FWDLyear1: '0', FWDLyear2: '0', FWDLyear3: '0', FWDLyear4: '0', FWDLyear5: '0', FWDLTotal: '0', FSLyear1: '0', FSLyear2: '0', FSLyear3: '0', FSLyear4: '0', FSLyear5: '0', FSLTotal: '0', FVLyear1: '0', FVLyear2: '0', FVLyear3: '0', FVLyear4: '0', FVLyear5: '0', FVLTotal: '0', lobname: '-Select-', CurrencyId: $scope.DefaultCurrencyID, PricetypeId: 1, OemId: 1, ComponenttypeId: 1, lob: 1, CurrencyDescrition: Currencydescription
            });
        }


        $scope.gridOptions.rowData = $scope.data;
        $scope.gridOptions.api.setRowData($scope.data);

        //if ($scope.gridOptions.rowData[maxindex].oem != "--Select--" && $scope.gridOptions.rowData[maxindex].componenttype != "--Select--" && $scope.gridOptions.rowData[maxindex].pricetype != "--Select--") {
        //}
        // else {
        //  toaster.pop('warning', "Warning", 'Please complete the row ' + (maxindex + 1), null);
        // }

        onFloatingBottomCount(1);

        $timeout(function() {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 500);

        angular.element(document.getElementById('btnadd'))[0].disabled = false;

    }

    function LastNode(node, index) {
        if (node.data) {
            console.log(index + ' -> data: ' + node.data.Lyear1 + ', ' + node.data.oem);
        } else {
            console.log(index + ' -> group: ' + node.key);
        }
    }

    $scope.sendmail = function() {
        if (validatedataonSAVE()) {
            calculateThreshold();
        }
    }


    function getexpandedcolstatus() {
        var constructstr = '';
        var GroupA = $scope.gridOptions.columnApi.getColumnGroup('GroupA').originalColumnGroup.expanded;
        constructstr = 'A:' + GroupA + ',';
        var GroupB = $scope.gridOptions.columnApi.getColumnGroup('GroupB').originalColumnGroup.expanded;
        constructstr += 'B:' + GroupB + ',';
        var GroupC = $scope.gridOptions.columnApi.getColumnGroup('GroupC').originalColumnGroup.expanded;
        constructstr += 'C:' + GroupC + ',';
        var GroupD = $scope.gridOptions.columnApi.getColumnGroup('GroupD').originalColumnGroup.expanded;
        constructstr += 'D:' + GroupD + ',';
        var GroupE = $scope.gridOptions.columnApi.getColumnGroup('GroupE').originalColumnGroup.expanded;
        constructstr += 'E:' + GroupE + ',';
        var GroupF = $scope.gridOptions.columnApi.getColumnGroup('GroupF').originalColumnGroup.expanded;
        constructstr += 'F:' + GroupF + ',';
        var GroupG = $scope.gridOptions.columnApi.getColumnGroup('GroupG').originalColumnGroup.expanded;
        constructstr += 'G:' + GroupG + ',';
        var GroupH = $scope.gridOptions.columnApi.getColumnGroup('GroupH').originalColumnGroup.expanded;
        constructstr += 'H:' + GroupH + ',';
        var GroupI = $scope.gridOptions.columnApi.getColumnGroup('GroupI').originalColumnGroup.expanded;
        constructstr += 'I:' + GroupI + ',';
        var GroupJ = $scope.gridOptions.columnApi.getColumnGroup('GroupJ').originalColumnGroup.expanded;
        constructstr += 'J:' + GroupJ + ',';
        var GroupK = $scope.gridOptions.columnApi.getColumnGroup('GroupK').originalColumnGroup.expanded;
        constructstr += 'K:' + GroupK + ',';
        var GroupL = $scope.gridOptions.columnApi.getColumnGroup('GroupL').originalColumnGroup.expanded;
        constructstr += 'L:' + GroupL;
        return constructstr;
    }
    //adding pricing sheet values
    $scope.AddPriceSheet = function(isdiscard) {
        if (validatedataonSAVE()) {
            var constructstr = getexpandedcolstatus();

            calculateThreshold();
            for (var j = 0; j < $scope.data.length; j++) {
                try {
                    delete $scope.data[j].Id

                    $scope.data[j].PriceSheetGroupId = $routeParams.GroupId;
                    $scope.data[j].Cyear1 = String($scope.data[j].Cyear1);
                    $scope.data[j].Cyear2 = String($scope.data[j].Cyear2);
                    $scope.data[j].Cyear3 = String($scope.data[j].Cyear3);
                    $scope.data[j].Cyear4 = String($scope.data[j].Cyear4);
                    $scope.data[j].Cyear5 = String($scope.data[j].Cyear5);
                    $scope.data[j].Vyear1 = String($scope.data[j].Vyear1);
                    $scope.data[j].Vyear2 = String($scope.data[j].Vyear2);
                    $scope.data[j].Vyear3 = String($scope.data[j].Vyear3);
                    $scope.data[j].Vyear4 = String($scope.data[j].Vyear4);
                    $scope.data[j].Vyear5 = String($scope.data[j].Vyear5);
                    $scope.data[j].Lyear1 = String($scope.data[j].Lyear1);
                    $scope.data[j].Lyear2 = String($scope.data[j].Lyear2);
                    $scope.data[j].Lyear3 = String($scope.data[j].Lyear3);
                    $scope.data[j].Lyear4 = String($scope.data[j].Lyear4);
                    $scope.data[j].Lyear5 = String($scope.data[j].Lyear5);
                    $scope.data[j].Oyear1 = String($scope.data[j].Oyear1);
                    $scope.data[j].Oyear2 = String($scope.data[j].Oyear2);
                    $scope.data[j].Oyear3 = String($scope.data[j].Oyear3);
                    $scope.data[j].Oyear4 = String($scope.data[j].Oyear4);
                    $scope.data[j].Oyear5 = String($scope.data[j].Oyear5);
                    $scope.data[j].Syear1 = String($scope.data[j].Syear1);
                    $scope.data[j].Syear2 = String($scope.data[j].Syear2);
                    $scope.data[j].Syear3 = String($scope.data[j].Syear3);
                    $scope.data[j].Syear4 = String($scope.data[j].Syear4);
                    $scope.data[j].Syear5 = String($scope.data[j].Syear5);
                    $scope.data[j].STotal = String($scope.data[j].STotal);
                    $scope.data[j].VTotal = String($scope.data[j].VTotal);
                    $scope.data[j].OTotal = String($scope.data[j].OTotal);
                    $scope.data[j].CTotal = String($scope.data[j].CTotal);
                    $scope.data[j].LTotal = String($scope.data[j].LTotal);
                    $scope.data[j].forvendordiscount = String($scope.data[j].forvendordiscount);
                    $scope.data[j].distmarginpercent = String($scope.data[j].distmarginpercent);
                    $scope.data[j].distdiscount = String($scope.data[j].distdiscount);
                    $scope.data[j].marginpercent = String($scope.data[j].marginpercent);
                    $scope.data[j].customerdiscount = String($scope.data[j].customerdiscount);
                    $scope.data[j].Dutytax1 = String($scope.data[j].Dutytax1);
                    $scope.data[j].Dutytax2 = String($scope.data[j].Dutytax2);
                    $scope.data[j].Dutytax3 = String($scope.data[j].Dutytax3);
                    $scope.data[j].DTyear1 = String($scope.data[j].DTyear1);
                    $scope.data[j].DTyear2 = String($scope.data[j].DTyear2);
                    $scope.data[j].DTyear3 = String($scope.data[j].DTyear3);
                    $scope.data[j].DTyear4 = String($scope.data[j].DTyear4);
                    $scope.data[j].DTyear5 = String($scope.data[j].DTyear5);
                    $scope.data[j].DTTotal = String($scope.data[j].DTTotal);
                    $scope.data[j].FCUyear1 = String($scope.data[j].FCUyear1);
                    $scope.data[j].FCUyear2 = String($scope.data[j].FCUyear2);
                    $scope.data[j].FCUyear3 = String($scope.data[j].FCUyear3);
                    $scope.data[j].FCUyear4 = String($scope.data[j].FCUyear4);
                    $scope.data[j].FCUyear5 = String($scope.data[j].FCUyear5);
                    $scope.data[j].FCUTotal = String($scope.data[j].FCUTotal);
                    $scope.data[j].ConversionRate = String($scope.data[j].ConversionRate);
                    $scope.data[j].FCLyear1 = String($scope.data[j].FCLyear1);
                    $scope.data[j].FCLyear2 = String($scope.data[j].FCLyear2);
                    $scope.data[j].FCLyear3 = String($scope.data[j].FCLyear3);
                    $scope.data[j].FCLyear4 = String($scope.data[j].FCLyear4);
                    $scope.data[j].FCLyear5 = String($scope.data[j].FCLyear5);
                    $scope.data[j].FCLTotal = String($scope.data[j].FCLTotal);
                    $scope.data[j].FDLyear1 = String($scope.data[j].FDLyear1);
                    $scope.data[j].FDLyear2 = String($scope.data[j].FDLyear2);
                    $scope.data[j].FDLyear3 = String($scope.data[j].FDLyear3);
                    $scope.data[j].FDLyear4 = String($scope.data[j].FDLyear4);
                    $scope.data[j].FDLyear5 = String($scope.data[j].FDLyear5);
                    $scope.data[j].FDLTotal = String($scope.data[j].FDLTotal);
                    $scope.data[j].FWDLyear1 = String($scope.data[j].FWDLyear1);
                    $scope.data[j].FWDLyear2 = String($scope.data[j].FWDLyear2);
                    $scope.data[j].FWDLyear3 = String($scope.data[j].FWDLyear3);
                    $scope.data[j].FWDLyear4 = String($scope.data[j].FWDLyear4);
                    $scope.data[j].FWDLyear5 = String($scope.data[j].FWDLyear5);
                    $scope.data[j].FWDLTotal = String($scope.data[j].FWDLTotal);
                    $scope.data[j].FSLyear1 = String($scope.data[j].FSLyear1);
                    $scope.data[j].FSLyear2 = String($scope.data[j].FSLyear2);
                    $scope.data[j].FSLyear3 = String($scope.data[j].FSLyear3);
                    $scope.data[j].FSLyear4 = String($scope.data[j].FSLyear4);
                    $scope.data[j].FSLyear5 = String($scope.data[j].FSLyear5);
                    $scope.data[j].FSLTotal = String($scope.data[j].FSLTotal);
                    $scope.data[j].FVLyear1 = String($scope.data[j].FVLyear1);
                    $scope.data[j].FVLyear2 = String($scope.data[j].FVLyear2);
                    $scope.data[j].FVLyear3 = String($scope.data[j].FVLyear3);
                    $scope.data[j].FVLyear4 = String($scope.data[j].FVLyear4);
                    $scope.data[j].FVLyear5 = String($scope.data[j].FVLyear5);
                    $scope.data[j].FVLTotal = String($scope.data[j].FVLTotal);

                }
                catch (e) {
                    console.log('some error while sending data to server')
                }
            }

            var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, PriceSheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable, ColStatus: constructstr, pricesheet: $scope.data, Authour: $rootScope.UserInfo.user.userId };
            debugger;



            // postal.publish({
            //     channel: "price",
            //     topic: "sheet1",
            //     data: {}
            // });


            // $scope.$onRootScope('someComponent.someCrazyEvent', function () {
            //     console.log('foo');
            // });

            // if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null') {
            //     Jsondata.Version = 'Ver_0.1';
            //     Jsondata.Comment = 'Initial';
            //     $routeParams.GroupId = $scope.MaxSheetGroupID;
            //     priceService.AddPriceSheet(Jsondata).success(function (data) {
            //         if (data.Error == '' || data.Error == undefined || data.Error == null) {
            //             $scope.griduseredit = false;
            //             $scope.hasedit = true;
            //             $scope.grideditable = false;
            //             $scope.onLoad();

            //             if ($scope.Isleaving)
            //                 redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
            //             toaster.pop('success', "SAVE", 'Price Sheet Saved Successfully', 3000);
            //             return true;
            //         }
            //         else {

            //             toaster.pop('error', "Error", data.Error, null);
            //         }

            //     }).error(function (error) {
            //         alert("failure message: " + JSON.stringify(error));
            //     });
            // }
            // else {
            //     priceService.UpdatePriceSheet(Jsondata).success(function (data) {

            //         if (data.Error == '' || data.Error == undefined || data.Error == null) {
            //             $scope.griduseredit = false;
            //             $scope.hasedit = true;
            //             $scope.grideditable = false;
            //             if ($scope.Isleaving)
            //                 redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
            //             $scope.onLoad();
            //             toaster.pop('success', "SAVE", 'Price Sheet Saved Successfully', 3000);
            //             return true;
            //         }
            //         else {
            //             toaster.pop('error', "Error", data.Error, null);
            //         }

            //     }).error(function (error) {
            //         alert("failure message: " + JSON.stringify(error));
            //     });
            // }

        }
        else {
            return false;
        }

        $('#showSavemodel').modal('hide');

    }

    //updating pricesheet to new version
    $scope.UpdatePriceSheetVersion = function() {
        //have to work here

        if (validatedataonSAVE()) {
            priceService.GetMaximumGroupPriceSheetId().success(function(data) {
                if (data[0].count == 'null') {
                    $scope.MaxSheetGroupIDForSaveAs = 1;
                }
                else {
                    $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
                }

                calculateThreshold();
                var constructstr = getexpandedcolstatus();

                var currentversion = $scope.MaxVersion.split('_')[1];
                var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
                var version = 'Ver_' + i;

                $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;

                for (var j = 0; j < $scope.data.length; j++) {
                    try {
                        delete $scope.data[j].Id
                        $scope.data[j].PriceSheetGroupId = $scope.MaxSheetGroupIDForSaveAs;
                        $scope.data[j].PriceSheetGroupId = $routeParams.GroupId;
                        $scope.data[j].Cyear1 = String($scope.data[j].Cyear1);
                        $scope.data[j].Cyear2 = String($scope.data[j].Cyear2);
                        $scope.data[j].Cyear3 = String($scope.data[j].Cyear3);
                        $scope.data[j].Cyear4 = String($scope.data[j].Cyear4);
                        $scope.data[j].Cyear5 = String($scope.data[j].Cyear5);
                        $scope.data[j].Vyear1 = String($scope.data[j].Vyear1);
                        $scope.data[j].Vyear2 = String($scope.data[j].Vyear2);
                        $scope.data[j].Vyear3 = String($scope.data[j].Vyear3);
                        $scope.data[j].Vyear4 = String($scope.data[j].Vyear4);
                        $scope.data[j].Vyear5 = String($scope.data[j].Vyear5);
                        $scope.data[j].Lyear1 = String($scope.data[j].Lyear1);
                        $scope.data[j].Lyear2 = String($scope.data[j].Lyear2);
                        $scope.data[j].Lyear3 = String($scope.data[j].Lyear3);
                        $scope.data[j].Lyear4 = String($scope.data[j].Lyear4);
                        $scope.data[j].Lyear5 = String($scope.data[j].Lyear5);
                        $scope.data[j].Oyear1 = String($scope.data[j].Oyear1);
                        $scope.data[j].Oyear2 = String($scope.data[j].Oyear2);
                        $scope.data[j].Oyear3 = String($scope.data[j].Oyear3);
                        $scope.data[j].Oyear4 = String($scope.data[j].Oyear4);
                        $scope.data[j].Oyear5 = String($scope.data[j].Oyear5);
                        $scope.data[j].Syear1 = String($scope.data[j].Syear1);
                        $scope.data[j].Syear2 = String($scope.data[j].Syear2);
                        $scope.data[j].Syear3 = String($scope.data[j].Syear3);
                        $scope.data[j].Syear4 = String($scope.data[j].Syear4);
                        $scope.data[j].Syear5 = String($scope.data[j].Syear5);
                        $scope.data[j].STotal = String($scope.data[j].STotal);
                        $scope.data[j].VTotal = String($scope.data[j].VTotal);
                        $scope.data[j].OTotal = String($scope.data[j].OTotal);
                        $scope.data[j].CTotal = String($scope.data[j].CTotal);
                        $scope.data[j].LTotal = String($scope.data[j].LTotal);
                        $scope.data[j].forvendordiscount = String($scope.data[j].forvendordiscount);
                        $scope.data[j].distmarginpercent = String($scope.data[j].distmarginpercent);
                        $scope.data[j].distdiscount = String($scope.data[j].distdiscount);
                        $scope.data[j].marginpercent = String($scope.data[j].marginpercent);
                        $scope.data[j].customerdiscount = String($scope.data[j].customerdiscount);
                        $scope.data[j].Dutytax1 = String($scope.data[j].Dutytax1);
                        $scope.data[j].Dutytax2 = String($scope.data[j].Dutytax2);
                        $scope.data[j].Dutytax3 = String($scope.data[j].Dutytax3);
                        $scope.data[j].DTyear1 = String($scope.data[j].DTyear1);
                        $scope.data[j].DTyear2 = String($scope.data[j].DTyear2);
                        $scope.data[j].DTyear3 = String($scope.data[j].DTyear3);
                        $scope.data[j].DTyear4 = String($scope.data[j].DTyear4);
                        $scope.data[j].DTyear5 = String($scope.data[j].DTyear5);
                        $scope.data[j].DTTotal = String($scope.data[j].DTTotal);
                        $scope.data[j].FCUyear1 = String($scope.data[j].FCUyear1);
                        $scope.data[j].FCUyear2 = String($scope.data[j].FCUyear2);
                        $scope.data[j].FCUyear3 = String($scope.data[j].FCUyear3);
                        $scope.data[j].FCUyear4 = String($scope.data[j].FCUyear4);
                        $scope.data[j].FCUyear5 = String($scope.data[j].FCUyear5);
                        $scope.data[j].FCUTotal = String($scope.data[j].FCUTotal);
                        $scope.data[j].ConversionRate = String($scope.data[j].ConversionRate);
                        $scope.data[j].FCLyear1 = String($scope.data[j].FCLyear1);
                        $scope.data[j].FCLyear2 = String($scope.data[j].FCLyear2);
                        $scope.data[j].FCLyear3 = String($scope.data[j].FCLyear3);
                        $scope.data[j].FCLyear4 = String($scope.data[j].FCLyear4);
                        $scope.data[j].FCLyear5 = String($scope.data[j].FCLyear5);
                        $scope.data[j].FCLTotal = String($scope.data[j].FCLTotal);
                        $scope.data[j].FDLyear1 = String($scope.data[j].FDLyear1);
                        $scope.data[j].FDLyear2 = String($scope.data[j].FDLyear2);
                        $scope.data[j].FDLyear3 = String($scope.data[j].FDLyear3);
                        $scope.data[j].FDLyear4 = String($scope.data[j].FDLyear4);
                        $scope.data[j].FDLyear5 = String($scope.data[j].FDLyear5);
                        $scope.data[j].FDLTotal = String($scope.data[j].FDLTotal);
                        $scope.data[j].FWDLyear1 = String($scope.data[j].FWDLyear1);
                        $scope.data[j].FWDLyear2 = String($scope.data[j].FWDLyear2);
                        $scope.data[j].FWDLyear3 = String($scope.data[j].FWDLyear3);
                        $scope.data[j].FWDLyear4 = String($scope.data[j].FWDLyear4);
                        $scope.data[j].FWDLyear5 = String($scope.data[j].FWDLyear5);
                        $scope.data[j].FWDLTotal = String($scope.data[j].FWDLTotal);
                        $scope.data[j].FSLyear1 = String($scope.data[j].FSLyear1);
                        $scope.data[j].FSLyear2 = String($scope.data[j].FSLyear2);
                        $scope.data[j].FSLyear3 = String($scope.data[j].FSLyear3);
                        $scope.data[j].FSLyear4 = String($scope.data[j].FSLyear4);
                        $scope.data[j].FSLyear5 = String($scope.data[j].FSLyear5);
                        $scope.data[j].FSLTotal = String($scope.data[j].FSLTotal);
                        $scope.data[j].FVLyear1 = String($scope.data[j].FVLyear1);
                        $scope.data[j].FVLyear2 = String($scope.data[j].FVLyear2);
                        $scope.data[j].FVLyear3 = String($scope.data[j].FVLyear3);
                        $scope.data[j].FVLyear4 = String($scope.data[j].FVLyear4);
                        $scope.data[j].FVLyear5 = String($scope.data[j].FVLyear5);
                        $scope.data[j].FVLTotal = String($scope.data[j].FVLTotal);

                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }

                var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, PriceSheetId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable, pricesheet: $scope.data, ColStatus: constructstr, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
                Jsondata.Version = version;
                priceService.AddPriceSheet(Jsondata).success(function(data) {
                    if (data.Error == '' || data.Error == undefined || data.Error == null) {
                        $scope.griduseredit = false;
                        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                    }
                    else {
                        toaster.pop('error', "Error", data.Error, 3000);
                    }
                }).error(function(error) {
                    alert("failure message: " + JSON.stringify(error));
                });
            });
            //$scope.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function (data) {
            //    //alert(data)
            //}).error(function (error) {

            //    $scope.Error = error;
            //})
        }

        $('#showsaveAsmodel').modal('hide');
    }


    function validatedataonSAVE() {

        if ($scope.data.length > 0) {
            //return true;
            $scope.validdataonsave = [];
            var isvalid = true;

            for (var i = 0; i < $scope.data.length; i++) {

                if ($scope.data[i].LegalEntityId != null && $scope.data[i].LegalEntityId != '' && $scope.data[i].CurrencyId != '' && $scope.data[i].CurrencyId != null) {

                    if (($scope.data[i].OemId == 1 || $scope.data[i].ComponenttypeId == 1) && $scope.data[i].LTotal > 0) {
                        isvalid = false;
                        var errorrow = i + 1;
                        toaster.pop('error', "Failed", 'Sheet contains invalid data in row number ' + errorrow, null);
                        break;
                    }
                    else if ($scope.data[i].OemId != 1 && $scope.data[i].ComponenttypeId != 1 && $scope.data[i].LTotal > 0) {
                        $scope.validdataonsave.push($scope.data[i]);
                    }
                }
                else {
                    isvalid = false;
                    var errorrow = i + 1;
                    toaster.pop('error', "Failed", 'Country or currency not filled in row number ' + errorrow, null);
                    break;
                }
            }
            return isvalid;
        }

        else {
            toaster.pop('error', "Failed", 'No data to update', null);
            return false;
        }
    }

    $scope.deleteRow = function() {
        angular.element(document.querySelector('#loader')).removeClass('hide');

        var selected = $scope.gridOptions.api.getFocusedCell();
        if (selected == null) {
            toaster.pop('error', "Error", 'Please select row to delete', null);
        }
        else {
            $scope.data.splice(selected.rowIndex, 1);
            toaster.pop('success', "Success", 'Row ' + (parseInt(selected.rowIndex) + 1) + ' deleted successfully', null);
            var alterrows = selected.rowIndex;
            for (alterrows; alterrows < $scope.gridOptions.rowData.length; alterrows++) {
                console.log(alterrows)
                $scope.data[alterrows].RowId = alterrows + 1;
            }

            $scope.gridOptions.api.setRowData($scope.data);
            $scope.gridOptions.rowData = $scope.data;
            onFloatingBottomCount(1);
        }
        $timeout(function() {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 500);

    }

    $scope.onBtExport = function() {
        //var params = {
        //    skipHeader: false,
        //    skipFooters: false,
        //    skipGroups: false,
        //    //allColumns: true,
        //    onlySelected: false,
        //    fileName: 'test1s.csv',
        //    columnSeparator: ''
        //};

        //$scope.gridOptions.api.exportDataAsCsv(params);
        priceService.ExportToExcelSheet($scope.data).success(function(data) {
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

    function redirectRefreshPage(oppId, groupId) {
        $window.location.href = "PriceList/" + oppId + "/" + groupId;
    }

    $scope.IncreaseAdditionalTimeToSheet = function() {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'PriceSheet' };
        priceService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function(data) {
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

            //  $scope.GetPriceSheetByversion($scope.OpportunityDetail.OppId, $routeParams.GroupId);

            //   $scope.onLoad();


        }).error(function(error) {

            $scope.Error = error;
        })
    }

    $scope.ReleaseSheetWhenExpired = function() {
        priceService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function(data) {
            //have to verify
            //alert(data)
        }).error(function(error) {

            $scope.Error = error;
        })
    }

    $scope.EditSheet = function() {

        //var SingleEditdata = JSON.parse(localStorage.getItem('SingleEditdata'));
        var SingleEditdata = { IsEdited: true };

        localStorage.removeItem('SingleEditdata');
        localStorage.setItem('SingleEditdata', JSON.stringify(SingleEditdata));

        $scope.sheetholdedby = '';
        angular.element(document.querySelector('#loader')).removeClass('hide');

        priceService.GetMaximumGroupPriceSheetId().success(function(data) {
            if (data[0].count == 'null') {
                $scope.MaxSheetGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
            }

            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                $scope.MaxVersion = 'Ver_0.1'
                //jay please had look here 
                $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;
                $scope.MaxSheetGroupID = $scope.MaxSheetGroupIDForSaveAs;
            }



            var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'PriceSheet', IsPriceSheetUpdated: true };

            priceService.LocktheSheetByGroupid(LockSheetModel).success(function(data) {

                if (!data.IsLocked) {
                    $scope.hasedit = false;
                    $scope.griduseredit = true;
                    $routeParams.GroupId = data.PriceSheetId;
                    $scope.MaxVersion = data.Version;
                    $scope.grideditable = data.IsEditable;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');
                }
                else {

                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "PriceSheet") {
                        $scope.hasedit = false;
                        $scope.griduseredit = true;
                        $scope.grideditable = true;
                        $routeParams.GroupId = data.PriceSheetId;
                        $scope.MaxVersion = data.Version;
                        $scope.sheetholdedby = '';
                        $scope.$broadcast('timer-reset');
                        $scope.$broadcast('timer-start');
                    }
                    else {
                        $scope.grideditable = false;
                        $scope.hasedit = true;
                        $scope.griduseredit = false;
                        // $scope.sheetholdedby = data.LockedUser;
                        $scope.sheetholdedby = "LockedIn: " + data.LockedIn + " By " + data.LockedUser;
                    }
                }

                if ($scope.MaxSheetGroupID != 'undefined' && $scope.MaxSheetGroupID != 'null' && $scope.MaxSheetGroupID != '') {
                    priceService.GetAllPriceSheetbyOppGroupID($scope.OpportunityDetail.OppId, $scope.MaxSheetGroupID).success(function(data) {
                        if (data.Error == null) {
                            $scope.data = data;
                            $scope.onLoad();
                        }
                        else {
                            // toaster.pop('error', "Error", 'Error in edit API calls', null);
                        }
                    });
                }


                $timeout(function() {
                    angular.element(document.querySelector('#loader')).addClass('hide');
                }, 500);



            }).error(function(error) {

                $scope.Error = error;
            })

        }).error(function(error) {
            $scope.Error = error;
        })

    }

    //start cell value change calculations

    function GetOEMVendorCalculation(params) {
        singlecalc(params);
    }

    function getcalculationforPriceEditorChange(params) {
        singlecalc(params);
    }

    function getcalculationforOEMEditorChange(params) {
        singlecalc(params);
    }

    function GetListCalculation(params, year) {
        singlecalc(params);
    }

    function getdistributorandmargindiscount(params) {
        singlecalc(params);
    }

    function getMarinpercent(params) {
        singlecalc(params);
    }

    function getcalculationforVAD(params) {
        singlecalc(params);
    }

    //used in single calc
    function getcalculationfordutytax(params) {

        for (var id = 1; id <= 5; id++) {
            params.data['DTyear' + id] = Math.round(parseFloat(params.data['Cyear' + id]) * ((parseFloat(params.data.Dutytax1) + parseFloat(params.data.Dutytax2) + parseFloat(params.data.Dutytax3)) / 100));
            params.data['FCUyear' + id] = parseFloat(parseFloat(params.data['DTyear' + id])) + parseFloat(params.data['Cyear' + id]);
        }
        //Currency Conversion
        getFinalCurrencyConversionRate(params.data);
    }

    function getFinalCurrencyConversionRate(params) {

        if (params.ConversionRate == '--' || params.ConversionRate == 'NA') {
            for (var id = 1; id <= 5; id++) {
                params['FCLyear' + id] = params['FCUyear' + id];
                params['FDLyear' + id] = params['DTyear' + id];
                params['FWDLyear' + id] = params['Cyear' + id];
                params['FSLyear' + id] = params['Syear' + id];
                params['FVLyear' + id] = params['Vyear' + id];
            }
        }
        else {
            for (var id = 1; id <= 5; id++) {
                params['FCLyear' + id] = Math.ceil(parseFloat(params['FCUyear' + id]) * parseFloat(params.ConversionRate));
                params['FDLyear' + id] = Math.ceil(parseFloat(params['DTyear' + id]) * parseFloat(params.ConversionRate));
                params['FWDLyear' + id] = Math.ceil(parseFloat(params['Cyear' + id]) * parseFloat(params.ConversionRate));
                params['FSLyear' + id] = Math.ceil(parseFloat(params['Syear' + id]) * parseFloat(params.ConversionRate));
                params['FVLyear' + id] = Math.ceil(parseFloat(params['Vyear' + id]) * parseFloat(params.ConversionRate));
            }
        }
    }

    function singlecalc(params) {

        if (params.data.oem != 'Servion') {
            for (var year = 1; year <= 5; year++) {
                //OEM/vendor Price calc
                params.data['Oyear' + year] = Math.ceil(Math.ceil(params.data['Lyear' + year]) * (1 - (params.data.forvendordiscount / 100)));
                //To Servion Price (Cost)
                if (params.data.distdiscount > 0) {
                    params.data['Syear' + year] = Math.ceil(Math.ceil(params.data['Lyear' + year]) * (1 - (params.data.distdiscount / 100)));
                }
                else {
                    params.data['Syear' + year] = Math.ceil(params.data['Oyear' + year] / (1 - (params.data.distmarginpercent / 100)));
                }
            }
        }
        else {
            //To Servion Price (Cost)
            for (var year = 1; year <= 5; year++) {
                params.data.forvendordiscount = 0;
                params.data['Oyear' + year] = 0;
                params.data['Syear' + year] = Math.ceil(params.data['Oyear' + year] / (1 - (params.data.distmarginpercent / 100)))
            }
        }

        //Customer Price (USD) [Without Duty / Tax]
        if (params.data.pricetype == "VAD" || params.data.pricetype == "COST") {
            for (var id = 1; id <= 5; id++) {
                params.data['Cyear' + id] = 0;
            }
        }
        else {
            if (params.data.customerdiscount > 0) {
                for (var id = 1; id <= 5; id++) {
                    params.data['Cyear' + id] = Math.ceil(Math.ceil(params.data['Lyear' + id]) * (1 - (params.data.customerdiscount / 100)));;
                }
            }
            else {
                if (params.data.oem != 'Servion') {
                    for (var id = 1; id <= 5; id++) {
                        params.data['Cyear' + id] = Math.ceil(params.data['Syear' + id] / (1 - (params.data.marginpercent / 100)));
                    }
                }
                else {
                    for (var id = 1; id <= 5; id++) {
                        params.data['Cyear' + id] = Math.ceil(Math.ceil(params.data['Lyear' + id]) / (1 - (params.data.marginpercent / 100)));
                    }
                }
            }
        }

        if (params.data.componenttype != "T&E") {
            //VAD calc
            if (params.data.pricetype == "VAD") {

                for (var id = 1; id <= 5; id++) {
                    params.data['Vyear' + id] = Math.ceil(params.data['Lyear' + id]);
                    params.data['Syear' + id] = 0;
                }
            }
            else {
                if (params.data.pricetype == "COST") {
                    for (var id = 1; id <= 5; id++) {
                        params.data['Vyear' + id] = 0
                    }
                }
                else if (params.data.oem == 'Servion') {
                    for (var id = 1; id <= 5; id++) {
                        params.data['Vyear' + id] = parseFloat(params.data['Cyear' + id]);
                    }
                }
                else {
                    for (var id = 1; id <= 5; id++) {
                        params.data['Vyear' + id] = parseFloat(params.data['Cyear' + id]) - parseFloat(params.data['Syear' + id]);
                    }
                }
            }
        }
        else {
            for (var id = 1; id <= 5; id++) {
                params.data['Vyear' + id] = 0;
            }
        }

        getcalculationfordutytax(params);

    }
    //end cell value change calculations


    //LOB logic start
    function getLOBValue(params) {

        if (params.data.oem != 'Servion' && params.data.oem != 'Acqueon') {
            //"TRADING"
            var obj = getLOBbyFilter("TRADING");
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Acqueon') {
            //"IP"
            var obj = getLOBbyFilter("IP");
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && params.data.componenttype == "Software") {
            //IP
            var obj = getLOBbyFilter("IP")
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && params.data.componenttype == "AMC-SW") {
            //IP
            var obj = getLOBbyFilter("IP")
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && params.data.componenttype == "ServCare") {
            //MAINTENANCE
            var obj = getLOBbyFilter("MAINTENANCE")
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && params.data.componenttype == "Resourcing") {
            //RESOURCING
            var obj = getLOBbyFilter("RESOURCING")
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && params.data.componenttype == "Consulting") {
            //CONSULTING
            var obj = getLOBbyFilter("CONSULTING")
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && (params.data.componenttype == "PS" || params.data.componenttype == "T&M")) {
            //PS
            var obj = getLOBbyFilter("PS");
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && params.data.componenttype == "Hosted") {
            //CONSULTING
            var obj = getLOBbyFilter("HOSTED");
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
        else if (params.data.oem == 'Servion' && params.data.componenttype == "T&E") {
            //CONSULTING
            var obj = getLOBbyFilter("TRADING");
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }

        else {
            var obj = getLOBbyFilter("OTHER");
            if (obj != null) {
                params.data.lob = obj.Id;
                params.data.LOBName = obj.LOBName;
            }
        }
    }
    //LOB logic end

    $scope.dynamicPopover = {
        templateUrl: 'myPopoverTemplate.html',
    };

    function getLOBbyFilter(lobtype) {
        var obj = getObjects($scope.LOBList, 'LOBName', lobtype);
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

    //pop up data 

    $scope.closepopup = function() {
        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
    }

    $scope.finished = function() {
        $('#showmod').modal('show');
    }

    $scope.AddPriceSheetpop = function() {
        $('#showSavemodel').modal('show');
    }

    $scope.CancelPriceSheet = function() {
        $('#showSavemodel').modal('hide');
    }

    $scope.saveasPriceSheetpop = function() {

        $('#showsaveAsmodel').modal('show');
    }

    $scope.CancelPriceSheetsaveas = function() {
        $('#showsaveAsmodel').modal('hide');
    }

    //pop up data 

    $scope.$on("$locationChangeStart", function(event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.griduseredit) {
            $('#showSaveChangesmodel').modal('show');
            event.preventDefault();
        }
    });


    $scope.saveasPriceSheetdiscard = function() {
        $scope.Isleaving = false;
        if ($scope.AddPriceSheet(true)) {
            // var url = $scope.newnavigateURl.split('#');
            // $location.path(url[1]);
            $window.location.href = $scope.newnavigateURl;

        }

        $('#showSaveChangesmodel').modal('hide');
    }

    $scope.IgnoreChanges = function() {

        $scope.$broadcast('timer-stop');

        priceService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function(data) {
            //alert(data)
            $scope.hasedit = true;
            $scope.griduseredit = false;
            $scope.grideditable = false;

            if ($scope.MaxSheetGroupID != 'undefined' && $scope.MaxSheetGroupID != 'null' && $scope.MaxSheetGroupID != '') {
                priceService.GetAllPriceSheetbyOppGroupID($scope.OpportunityDetail.OppId, $scope.MaxSheetGroupID).success(function(data) {
                    if (data.Error == null) {
                        $scope.data = data;
                        $scope.onLoad();
                    }
                    else {
                        //jay commented here
                        // toaster.pop('error', "Error", 'Error in edit API calls', null);
                    }
                });
            }

        }).error(function(error) {

            $scope.Error = error;
        })
    }

    $scope.CancelPriceSheetdiscard = function() {
        $scope.griduseredit = false;
        $scope.IgnoreChanges();
        $('#showSaveChangesmodel').modal('hide');
        // var url = $scope.newnavigateURl.split('#');
        // $location.path(url[1]);
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.ClosePriceSheetdiscard = function() {

        $('#showSaveChangesmodel').modal('hide');
    }



    function calculateThreshold() {

        var EmailMArginOjectsLevel1 = [];
        var EmailMArginOjectsLevel2 = [];
        var EmailMArginOjectsLevel3 = [];

        var EmailDiscountOjectsLevel1 = [];
        var EmailDiscountOjectsLevel2 = [];
        var EmailDiscountOjectsLevel3 = [];

        _.each($scope.validdataonsave, function(value, key) {
            if (value.oem != 'Servion') {
                _.each($scope.margin, function(value1, key) {
                    if (value1.ComponentType == value.ComponenttypeId && value1.Vendor == value.OemId) {
                        if (value.Calmarginpercent <= value1.Level1 && value.Calmarginpercent > value1.Level2) {
                            EmailMArginOjectsLevel1.push(value)
                        }
                        else if (value.Calmarginpercent <= value1.Level2 && value.Calmarginpercent > value1.Level3) {
                            EmailMArginOjectsLevel2.push(value)
                        }
                        else if (value.Calmarginpercent <= value1.Level3 && value.Calmarginpercent > 0) {
                            EmailMArginOjectsLevel3.push(value)
                        }
                    }
                    else if (value1.ComponentType == value.ComponenttypeId) {

                        if (value.Calmarginpercent <= value1.Level1 && value.Calmarginpercent > value1.Level2) {
                            EmailMArginOjectsLevel1.push(value)
                        }
                        else if (value.Calmarginpercent <= value1.Level2 && value.Calmarginpercent > value1.Level3) {
                            EmailMArginOjectsLevel2.push(value)
                        }
                        else if (value.Calmarginpercent <= value1.Level3 && value.Calmarginpercent > 0) {
                            EmailMArginOjectsLevel3.push(value)
                        }

                    }
                });
            }
            else {
                _.each($scope.discount, function(value2, key) {
                    if (value2.ComponentType == value.ComponenttypeId && value2.Vendor == value.OemId) {
                        if (value.Calcustomerdiscount >= value2.Level1 && value.Calcustomerdiscount < value2.Level2) {
                            EmailDiscountOjectsLevel1.push(value)
                        }
                        else if (value.Calcustomerdiscount >= value2.Level2 && value.Calcustomerdiscount < value2.Level3) {
                            EmailDiscountOjectsLevel2.push(value)
                        }
                        else if (value.Calcustomerdiscount >= value2.Level3 && value.Calcustomerdiscount > value2.Level2) {
                            EmailDiscountOjectsLevel3.push(value)
                        }
                    }
                    else if (value2.ComponentType == value.ComponenttypeId) {
                        if (value.Calcustomerdiscount >= value2.Level1 && value.Calcustomerdiscount < value2.Level2) {
                            EmailDiscountOjectsLevel1.push(value)
                        }
                        else if (value.Calcustomerdiscount >= value2.Level2 && value.Calcustomerdiscount < value2.Level3) {
                            EmailDiscountOjectsLevel2.push(value)
                        }
                        else if (value.Calcustomerdiscount >= value2.Level3 && value.Calcustomerdiscount > value2.Level2) {
                            EmailDiscountOjectsLevel3.push(value)
                        }
                    }
                });
            }

            //if (value.marginpercent != 'All') {
            //    EmailOjects.push(value);
            //}

        });


        var JSONMaildata = { EmailMArginOjectsLevel1: EmailMArginOjectsLevel1, EmailMArginOjectsLevel2: EmailMArginOjectsLevel2, EmailMArginOjectsLevel3: EmailMArginOjectsLevel3, EmailDiscountOjectsLevel1: EmailDiscountOjectsLevel1, EmailDiscountOjectsLevel2: EmailDiscountOjectsLevel2, EmailDiscountOjectsLevel3: EmailDiscountOjectsLevel3 }
        priceService.SendEmail(JSONMaildata).success(function(data) {
            //alert(data);


        }).error(function(error) {

            $scope.Error = error;
        })
    }

    //full screen in browser

    $scope.MakeContainerFullScreen = function(state) {
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


    function PutComma(x) {
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

        $scope.checkIFFreshsheet();
        //start Service Calls
        $scope.GetProductList();
        $scope.GetOemOptions();
        $scope.getAllPriceType();
        $scope.getAllComponentType();
        $scope.GetMaximumGroupPriceSheetId();
        $scope.GetAllLOBList();
        $scope.GetAllCurrency();
        $scope.IsPageReadOnly();
        //end Service Calls
        //first call to pricesheet
        $scope.GetOpportunityList($routeParams.OppId);
        //$rootScope.$broadcast("pageload");

        // postal.publish({
        //     channel: "price",
        //     topic: "PageInitialization",
        //     data: {}
        // });

    }


    $scope.InitApiCalls();

});


