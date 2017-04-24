ReportApp.controller('EstimationSDLCResourceController', function ($scope, $rootScope, _, EstimationSDLCResourceService, toaster) {


    $scope.SDLCResource_GRDDATA = [];


    var columnDefs = [
        {
            headerName: "description",
            field: "description",
            editable: false,
            pinned:true,
            width: 270,

            headerTooltip: "description",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
        headerName: "SBU",
        field: "SBUName",
        editable: false,
        width: 70,
        headerTooltip: "SBUName",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }, {
            headerName: "Country",
            field: "CountryName",
            editable: false,
            width: 80,

            headerTooltip: "CountryName",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "OEM",
            field: "OEMName",
            editable: false,
            width: 80,

            headerTooltip: "OEMName",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },
        {
        headerName: "SBU",
        field: "SBU",
        editable: false,
        hide:true,
        width: 80,
        headerTooltip: "SBU",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }, {
            headerName: "Region",
            field: "Region",
            hide:true,
            editable: false,
            width: 100,

            headerTooltip: "Region",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "OEM",
            field: "OEM",
            hide:true,
            editable: false,
            width: 100,

            headerTooltip: "OEM",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "Infra",
            field: "Infra",
            editable: false,
            width: 80,

            headerTooltip: "Infra",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "Apps",
            field: "Apps",
            editable: false,
            width: 60,

            headerTooltip: "Apps",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "Upgrade",
            field: "Upgrade",
            editable: false,
            width: 65,

            headerTooltip: "Upgrade",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "Complexity",
            field: "Complexity",
            editable: false,
            width: 90,

            headerTooltip: "Complexity",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "REQ",
            field: "REQ",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "REQ",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "Design",
            field: "Design",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "Design",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "DevTest",
            field: "DevTest",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "DevTest",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "SysTest",
            field: "SysTest",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "SysTest",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "IMPL",
            field: "IMPL",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "IMPL",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "UAT",
            field: "UAT",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "UAT",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "PROD",
            field: "PROD",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "PROD",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "Train",
            field: "Train",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "Train",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "Manual",
            field: "Manual",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "Manual",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "OH",
            field: "OH",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "OH",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "SQA",
            field: "SQA",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "SQA",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "PM",
            field: "PM",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "PM",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "CE",
            field: "CE",
            cellRenderer: Editor,
            width: 160,

            headerTooltip: "CE",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }
    ];


    $scope.grdSDLCResource = {
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
           // $scope.grdSDLCResource.api.sizeColumnsToFit();

        }
    };
    


    $scope.onLoad = function () {
        //  alert(JSON.stringify($scope.SDLCResource_GRDDATA));
        $scope.grdSDLCResource.api.setRowData($scope.SDLCResource_GRDDATA);
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
        EstimationSDLCResourceService.GetAllEstimationSDLCResource().success(function (data) {
           // alert(JSON.stringify(data));
            if (data.Error != undefined) {
                toaster.pop('error', "Error", data.Error, null);
            } else {
                $scope.SDLCResource_GRDDATA = data[0];
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

    $scope.savemaster = function () {
       
        var data = $scope.SDLCResource_GRDDATA

        for (var j = 0; j < data.length; j++) {
            try {
                    delete data[j].SBUName;
                    delete data[j].CountryName;
                    delete data[j].OEMName;
            }
            catch (ex) {
                console.log('Error occurred in EstimationSDLC: \n' + ex);
            }
        }
        
       alert(JSON.stringify(data));


        if (data != null) {
            EstimationSDLCResourceService.AddEstimationSDLCResource(data).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {

                    toaster.pop('success', "Success", "SDLC Resource Master added successfully", null);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding SDLC Resource Master!", null);
                $scope.error = "An Error has occured while Adding SDLC Resource Master! " + data.ExceptionMessage;
            });
        }
    }
});



