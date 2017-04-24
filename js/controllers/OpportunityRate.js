ReportApp.controller('OpportunityRateController', function ($scope, $rootScope, _, OpportunityRateService, toaster) {

    $scope.oneAtATime = true;
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.GrossMargins_GRDDATA = [];
    $scope.ManDayRates_GRDDATA = [];
    $scope.ProjectManagement_GRDDATA = [];
    $scope.Resource_GRDDATA = [];
    $scope.ServCareRates_GRDDATA = [];
    $scope.Stay_Travel_Rates_GRDDATA = [];

    var columnDefs = [{
        headerName: "Type",
        field: "mode_type",
        editable: false,
        width: 175,
        headerTooltip: "Type",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }, {
            headerName: "misc",
            field: "misc",
            cellRenderer: Editor,
            width: 60,
            hide: true,
            headerTooltip: "misc",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "USD",
            field: "USD",
            cellRenderer: Editor,
            width: 50,

            headerTooltip: "USD",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "CAD",
            field: "CAD",
            cellRenderer: Editor,
            width: 50,

            headerTooltip: "CAD",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "SGD",
            field: "SGD",
            cellRenderer: Editor,
            width: 50,

            headerTooltip: "SGD",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "THB",
            field: "THB",
            cellRenderer: Editor,
            width: 50,

            headerTooltip: "THB",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "MYR",
            field: "MYR",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "MYR",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "IDR",
            field: "IDR",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "IDR",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "AUD",
            field: "AUD",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "AUD",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "SAR",
            field: "SAR",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "SAR",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "AED",
            field: "AED",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "AED",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "QAR",
            field: "QAR",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "QAR",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "OMR",
            field: "OMR",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "OMR",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "KES",
            field: "KES",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "KES",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "UGX",
            field: "UGX",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "UGX",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "GBP",
            field: "GBP",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "GBP",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "EUR",
            field: "EUR",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "EUR",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
            headerName: "INR",
            field: "INR",
            cellRenderer: Editor,
            width: 50,
            headerTooltip: "INR",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }
    ];

    $scope.grdDefStay_Travel_Rates = {
        columnDefs: columnDefs,
        rowData: [],
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        angularCompileRows: true,
        singleClickEdit: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefStay_Travel_Rates.api.sizeColumnsToFit();
        }
    };

    $scope.grdDefResource = {
        columnDefs: columnDefs,
        rowData: [],
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        angularCompileRows: true,
        singleClickEdit: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefResource.api.sizeColumnsToFit();
        }
    };

    $scope.grdDefServCareRates = {
        columnDefs: columnDefs,
        rowData: [],
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        angularCompileRows: true,
        singleClickEdit: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefServCareRates.api.sizeColumnsToFit();
        }
    };

    $scope.grdDefManDayRates = {
        columnDefs: columnDefs,
        rowData: [],
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        angularCompileRows: true,
        singleClickEdit: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefManDayRates.api.sizeColumnsToFit();
        }
    };

    $scope.grdDefGrossMargins = {
        columnDefs: columnDefs,
        rowData: [],
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        angularCompileRows: true,
        singleClickEdit: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        onRowSelected: function (event) {
            $scope.chkChanged(event.node);
        },
        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefGrossMargins.api.sizeColumnsToFit();
        }
    };

    $scope.grdDefProjectManagement = {
        columnDefs: columnDefs,
        rowData: [],
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        angularCompileRows: true,
        singleClickEdit: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefProjectManagement.api.sizeColumnsToFit();
        }
    };


    $scope.onLoad = function () {
        $scope.grdDefGrossMargins.api.setRowData($scope.GrossMargins_GRDDATA);
        $scope.grdDefManDayRates.api.setRowData($scope.ManDayRates_GRDDATA);
        $scope.grdDefProjectManagement.api.setRowData($scope.ProjectManagement_GRDDATA);
        $scope.grdDefResource.api.setRowData($scope.Resource_GRDDATA);
        $scope.grdDefServCareRates.api.setRowData($scope.ServCareRates_GRDDATA);
        $scope.grdDefStay_Travel_Rates.api.setRowData($scope.Stay_Travel_Rates_GRDDATA);
    }

    function Editor(params) {
        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);


        var eInput = document.createElement('input');
        eInput.type = 'text';


        params.eGridCell.addEventListener('click', function () {
            if (!editing) {
                eInput.value = eLabel.data;
                eCell.removeChild(eLabel);
                eInput.className = 'ag-cell-edit-input';
                eInput.style.width = (params.eGridCell.clientWidth - 10) + "px";
                eCell.appendChild(eInput);
                eInput.focus();
                editing = true;

            }
        });


        eInput.addEventListener('keydown', function (event) {
            var key = event.which || event.keyCode;

            if (key == "13") {
                blurListenerfn();
                eInput.removeEventListener('blur', blurListenerfn);
            }
        });

        var blurListenerfn = function () {
            editing = false;
            var newValue = eInput.value;
            eLabel.data = newValue;
            if (params.data["Rate_Type"] != "ManDayRates" && params.data["Rate_Type"] != "ProjectManagement" && params.data["Rate_Type"] != "GrossMargins" && params.data["Rate_Type"] != "Stay_Travel_Rates") {
                if (params.colDef.field == 'CAD' || params.colDef.field == 'USD') {
                    params.data["CAD"] = newValue;
                    params.data["USD"] = newValue;
                }
                if (params.data["Rate_Type"] != "ServCareRates") {
                    if (params.colDef.field == 'SGD' || params.colDef.field == 'THB' || params.colDef.field == 'MYR' || params.colDef.field == 'IDR' || params.colDef.field == 'AUD') {
                        params.data["SGD"] = newValue;
                        params.data["THB"] = newValue;
                        params.data["MYR"] = newValue;
                        params.data["IDR"] = newValue;
                        params.data["AUD"] = newValue;
                    }
                }
                else {
                    params.data[params.colDef.field] = newValue;
                }

                if (params.colDef.field == 'SAR' || params.colDef.field == 'AED' || params.colDef.field == 'QAR' || params.colDef.field == 'OMR' || params.colDef.field == 'KES' || params.colDef.field == 'UGX') {
                    params.data["SAR"] = newValue;
                    params.data["AED"] = newValue;
                    params.data["QAR"] = newValue;
                    params.data["OMR"] = newValue;
                    params.data["KES"] = newValue;
                    params.data["UGX"] = newValue;
                }

                if (params.colDef.field == 'GBP' || params.colDef.field == 'EUR') {
                    params.data["GBP"] = newValue;
                    params.data["EUR"] = newValue;
                }
                if (params.colDef.field == 'INR') {
                    params.data["INR"] = newValue;
                }
            }
            else {
                params.data[params.colDef.field] = newValue;
            }
            eCell.removeChild(eInput);
            eCell.appendChild(eLabel);
            $scope.grdDefGrossMargins.api.refreshView();
            $scope.grdDefManDayRates.api.refreshView();
            $scope.grdDefProjectManagement.api.refreshView();
            $scope.grdDefResource.api.refreshView();
            $scope.grdDefServCareRates.api.refreshView();
            $scope.grdDefStay_Travel_Rates.api.refreshView();
        };

        eInput.addEventListener("blur", blurListenerfn);

        return eCell;

    }

    $scope.BindMasterData = function () {
        OpportunityRateService.GetAllOPPORTUNITY_RATE().success(function (data) {
            if (data.Error != undefined) {
                toaster.pop('error', "Error", data.Error, null);
            } else {
                $scope.GrossMargins_GRDDATA = _.filter(data, function (someThing) {
                    return someThing.Rate_Type == "GrossMargins";
                });

                $scope.ManDayRates_GRDDATA = _.filter(data, function (someThing) {
                    return someThing.Rate_Type == "ManDayRates";
                });

                $scope.ProjectManagement_GRDDATA = _.filter(data, function (someThing) {
                    return someThing.Rate_Type == "ProjectManagement";
                });

                $scope.Resource_GRDDATA = _.filter(data, function (someThing) {
                    return someThing.Rate_Type == "Resource";
                });

                $scope.ServCareRates_GRDDATA = _.filter(data, function (someThing) {
                    return someThing.Rate_Type == "ServCareRates";
                });

                $scope.Stay_Travel_Rates_GRDDATA = _.filter(data, function (someThing) {
                    return someThing.Rate_Type == "Stay_Travel_Rates";
                });
                $scope.onLoad();
            }
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Adding opportunity rate Master!", null);
            $scope.error = "An Error has occured while Adding opportunity rate Master! " + data.ExceptionMessage;
        });
    }

    // $scope.addFreshrows();
    $scope.BindMasterData();
    // $scope.onLoad();

    function GetCount(grdData, productName) {
        var countDC_prod = 0;
        var countPOP_prod = 0;
        var countAGT_prod = 0;
        var countDC_Uggrade = 0;
        var countPOP_Uggrade = 0;
        var countAGT_Uggrade = 0;
        for (var j = 0; j < grdData.length; j++) {
            try {
                countDC_Uggrade += parseFloat(grdData[j].DC_Uggrade);
                countPOP_Uggrade += parseFloat(grdData[j].POP_Uggrade);
                countAGT_Uggrade += parseFloat(grdData[j].AGT_Uggrade);
                countDC_prod += parseFloat(grdData[j].DC_prod);
                countPOP_prod += parseFloat(grdData[j].POP_prod);
                countAGT_prod += parseFloat(grdData[j].AGT_prod);
            }
            catch (ex) {
                //alert(ex);
            }
        }
        if (countDC_prod >= 100 || countPOP_prod >= 100 || countAGT_prod >= 100 || countDC_Uggrade >= 100 || countPOP_Uggrade >= 100 || countAGT_Uggrade >= 100) {
            toaster.pop('error', "Error", "Count in " + productName + " is more than 100%", null);
            return false;
        }
        return true;
    }

    $scope.savemaster = function () {

        var data = $scope.GrossMargins_GRDDATA
            .concat($scope.ManDayRates_GRDDATA)
            .concat($scope.ProjectManagement_GRDDATA)
            .concat($scope.Resource_GRDDATA)
            .concat($scope.ServCareRates_GRDDATA)
            .concat($scope.Stay_Travel_Rates_GRDDATA);

        for (var j = 0; j < data.length; j++) {
            try {
                delete data[j].Id;
            }
            catch (ex) {
                alert(ex);
            }
        }

        if (data != null) {
            OpportunityRateService.AddOPPORTUNITY_RATE(data).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {

                    toaster.pop('success', "Success", "Opportunity rate updated successfully", null);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Opportunity rate Master!", null);
                $scope.error = "An Error has occured while Adding Opportunity rate Master! " + data.ExceptionMessage;
            });
        }
    }
});



