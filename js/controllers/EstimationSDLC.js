ReportApp.controller('EstimationSDLCController', function ($scope, $rootScope, _, EstimationSDLCService, toaster) {

    $scope.oneAtATime = true;
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.ACQUEON_GRDDATA = [];
    $scope.ADMIN_GRDDATA = [];
    $scope.APPLICATIONS_GRDDATA = [];
    $scope.Avaya_GRDDATA = [];
    $scope.CISCO_GRDDATA = [];
    $scope.eGain_GRDDATA = [];
    $scope.PACKAGE_GRDDATA = [];
    $scope.WFO_GRDDATA = [];
    $scope.SERVION_PRODUCTS_GRDDATA = [];
    $scope.SELF_SERVICE_GRDDATA = [];
    $scope.PED_GRDDATA = [];
    $scope.REPORT_GRDDATA = [];
    $scope.SERVION_GRDDATA = [];

    var columnDefs = [{
        headerName: "SDLC_Type",
        field: "SDLC_Type",
        editable: false,
        width: 174,
        headerTooltip: "SDLC_Type",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }, {
            headerName: "DC Prod %",
            field: "DC_prod",
            cellRenderer: Editor,
            width: 100,

            headerTooltip: "DC",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "POP Prod %",
            field: "POP_prod",
            cellRenderer: Editor,
            width: 100,

            headerTooltip: "POP",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "AGT Prod %",
            field: "AGT_prod",
            cellRenderer: Editor,
            width: 100,

            headerTooltip: "AGT",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "DC Upgrade %",
            field: "DC_Upgrade",
            cellRenderer: Editor,
            width: 110,

            headerTooltip: "DC",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "POP Upgrade %",
            field: "POP_Upgrade",
            cellRenderer: Editor,
            width: 120,

            headerTooltip: "POP",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "AGT Upgrade %",
            field: "AGT_Upgrade",
            cellRenderer: Editor,
            width: 120,

            headerTooltip: "AGT",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }
    ];


    $scope.grdDefACQUEON = {
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
            $scope.grdDefACQUEON.api.sizeColumnsToFit();

        }
    };
    

    $scope.grdDefADMIN = {
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
            $scope.grdDefADMIN.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefAPPLICATIONS = {
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
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefAPPLICATIONS.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefAvaya = {
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
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefAvaya.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefCISCO = {
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
        },       //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefCISCO.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefeGain = {
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
        },     //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefeGain.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefPACKAGE = {
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
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefPACKAGE.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefPED = {
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
        suppressRowClickSelection: true,
        
        rowSelection: 'multiple',
        onRowSelected: function (event) {
            $scope.chkChanged(event.node);
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefPED.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefREPORT = {
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
        suppressRowClickSelection: true,
        
        rowSelection: 'multiple',
        onRowSelected: function (event) {
            $scope.chkChanged(event.node);
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefREPORT.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefSELF_SERVICE = {
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
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefSELF_SERVICE.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefSERVION_PRODUCTS = {
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
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefSERVION_PRODUCTS.api.sizeColumnsToFit();

        }
    };

    $scope.grdDefWFO = {
        columnDefs: columnDefs,
        rowData: [],
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        suppressRowClickSelection: true,
        angularCompileRows: true,
        singleClickEdit: true,
        rowSelection: 'multiple',
        onRowSelected: function (event) {
            $scope.chkChanged(event.node);
        },        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            // $scope.GetOpportunityHistoryList($routeParams.OppId);
            $scope.grdDefWFO.api.sizeColumnsToFit();

        }
    };

    $scope.onLoad = function () {
        $scope.grdDefACQUEON.api.setRowData($scope.ACQUEON_GRDDATA);
        $scope.grdDefADMIN.api.setRowData($scope.ADMIN_GRDDATA);
        $scope.grdDefAPPLICATIONS.api.setRowData($scope.APPLICATIONS_GRDDATA);
        $scope.grdDefAvaya.api.setRowData($scope.Avaya_GRDDATA);
        $scope.grdDefCISCO.api.setRowData($scope.CISCO_GRDDATA);
        $scope.grdDefeGain.api.setRowData($scope.eGain_GRDDATA);
        $scope.grdDefPACKAGE.api.setRowData($scope.PACKAGE_GRDDATA);
        $scope.grdDefPED.api.setRowData($scope.PED_GRDDATA);
        $scope.grdDefREPORT.api.setRowData($scope.REPORT_GRDDATA);
        $scope.grdDefSELF_SERVICE.api.setRowData($scope.SELF_SERVICE_GRDDATA);
        $scope.grdDefSERVION_PRODUCTS.api.setRowData($scope.SERVION_PRODUCTS_GRDDATA);
        $scope.grdDefWFO.api.setRowData($scope.WFO_GRDDATA);
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
            // if (newValue == '') {
            //     newValue = 0;
            // }
            eLabel.data = newValue;
            params.data[params.colDef.field] = newValue;
            eCell.removeChild(eInput);
            eCell.appendChild(eLabel);

        };

        eInput.addEventListener("blur", blurListenerfn);

        return eCell;

    }
    $scope.BindMasterData = function () {
        EstimationSDLCService.GetAllEstimationSDLC().success(function (data) {
           // alert(JSON.stringify(data));
            if (data.Error != undefined) {
                toaster.pop('error', "Error", data.Error, null);
            } else {
                $scope.ACQUEON_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "ACQUEON";
                });

                $scope.ADMIN_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "ADMIN";
                });

                $scope.APPLICATIONS_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "APPLICATIONS";
                });

                $scope.Avaya_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "Avaya";
                });

                $scope.CISCO_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "CISCO";
                });

                $scope.eGain_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "eGain";
                });

                $scope.PACKAGE_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "PACKAGE";
                });

                $scope.PED_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "PED";
                });

                $scope.REPORT_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "REPORT";
                });



                $scope.SELF_SERVICE_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "SELF_SERVICE";
                });

                $scope.SERVION_PRODUCTS_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "SERVION_PRODUCTS";
                });

                $scope.WFO_GRDDATA = _.filter(data, function (obj) {
                    return obj.ProductName == "WFO";
                });
                $scope.onLoad();
            }
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
            $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
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

        //No validation required on values SID said
        
        // if (!GetCount($scope.ACQUEON_GRDDATA,"ACQUEON")) {
        //     return false;
        // }
        // if (!GetCount($scope.ADMIN_GRDDATA,"ADMIN")) {
        //     return false;
        // }
        // if (!GetCount($scope.APPLICATIONS_GRDDATA,"APPLICATIONS")) {
        //     return false;
        // }
        // if (!GetCount($scope.Avaya_GRDDATA,"Avaya")) {
        //     return false;
        // }
        // if (!GetCount($scope.CISCO_GRDDATA,"Cisco")) {
        //     return false;
        // }
        // if (!GetCount($scope.eGain_GRDDATA,"gGain")) {
        //     return false;
        // }
        // if (!GetCount($scope.PACKAGE_GRDDATA,"Package")) {
        //     return false;
        // }
        // if (!GetCount($scope.WFO_GRDDATA,"WFO")) {
        //     return false;
        // }
        // if (!GetCount($scope.SERVION_PRODUCTS_GRDDATA,"Servion products")) {
        //     return false;
        // }
        // if (!GetCount($scope.SELF_SERVICE_GRDDATA,"Self Service")) {
        //     return false;
        // }
        // if (!GetCount($scope.PED_GRDDATA,"PED")) {
        //     return false;
        // }
        // if (!GetCount($scope.REPORT_GRDDATA,"Report")) {
        //     return false;
        // }
        // if (!GetCount($scope.SERVION_GRDDATA,"SERVION")) {
        //     return false;
        // }
        var data = $scope.ACQUEON_GRDDATA
            .concat($scope.ADMIN_GRDDATA)
            .concat($scope.APPLICATIONS_GRDDATA)
            .concat($scope.Avaya_GRDDATA)
            .concat($scope.CISCO_GRDDATA)
            .concat($scope.eGain_GRDDATA)
            .concat($scope.PACKAGE_GRDDATA)
            .concat($scope.WFO_GRDDATA)
            .concat($scope.SERVION_PRODUCTS_GRDDATA)
            .concat($scope.SELF_SERVICE_GRDDATA)
            .concat($scope.PED_GRDDATA)
            .concat($scope.REPORT_GRDDATA)
            .concat($scope.SERVION_GRDDATA);



        for (var j = 0; j < data.length; j++) {
            try {
                delete data[j].Id;
            }
            catch (ex) {
                //alert(ex);
                console.log('Error occurred in EstimationSDLC: \n' + ex);
            }
        }
        
       // alert(JSON.stringify(data));

        if (data != null) {
            EstimationSDLCService.AddEstimationSDLC(data).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {

                    toaster.pop('success', "Success", "Estimation Self Service Master added successfully", null);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
                $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
            });
        }
    }
});



