ReportApp.controller('OpportunityEstimationSDLCController', function ($scope, $rootScope, $routeParams, _, EstimationSDLCService, toaster) {

 $scope.GRDDATA = [];

    var columnDefs = [{
        headerName: "Product Name",
        field: "ProductName",
        editable: false,
        width: 174,
        hide:true,
        headerTooltip: "ProductName",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    },
    {
        headerName: "Product Name",
        field: "myProductName",
        editable: false,
        width: 174,
        headerTooltip: "ProductName",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    },
     {
            headerName: "SDLC Type",
            field: "SDLC_Type",
            width: 180,

            headerTooltip: "SDLC Type",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        },{
            headerName: "DC",
            field: "NoOfDataCenterLocs",
            width: 70,
            cellRenderer: Editor,
            headerTooltip: "No Of DataCenter Locs",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            },
             cellClassRules: {                 
                'rag-amber': function (params) { return params.data.IsDCOppValue == true },
            }
        }, {
            headerName: "Agent",
            field: "NoOfAgentCenterLocs",
            width: 70,
            cellRenderer: Editor,
            headerTooltip: "No Of AgentCenter Locs",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            },
             cellClassRules: {                 
                'rag-amber': function (params) { return params.data.IsAgentOppValue == true },
            }
        },  {
            headerName: "% DC Prod",
            field: "DC_prod",
            width: 90,
            headerTooltip: "% DC",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "%AGT Prod",
            field: "AGT_prod",
            width: 90,
            cellRenderer: Editor,
            headerTooltip: "AGT _prod",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "%DC Upg",
            field: "DC_Upgrade",
            width: 90,
            cellRenderer: Editor,
            headerTooltip: "DC_Upgrade",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "%AGT Upg",
            field: "AGT_Upgrade",
            width: 90,
            cellRenderer: Editor,
            headerTooltip: "%AGT Upg",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }
        , {
            headerName: "Prod %",
            field: "prod_percentage",
            width: 70,

            headerTooltip: "Prod %",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }, {
            headerName: "UPG %",
            field: "uat_percentage",
            width: 70,

            headerTooltip: "UPG %",
            cellStyle: {
                'text-align': 'left',
                'display': 'flex',
                'align-items': 'center'
            }
        }
    ];

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
            
             if (params.colDef.field == 'NoOfAgentCenterLocs') {
            //     params.data["prod_percentage"] =Math.round( (parseInt(newValue) * (parseInt(params.data["AGT_prod"])/100)) + (parseInt(params.data["NoOfDataCenterLocs"]) * (parseInt(params.data["DC_prod"])/100)));
            //     params.data["uat_percentage"] =Math.round( (parseInt(newValue) * (parseInt(params.data["AGT_Upgrade"])/100)) + (parseInt(params.data["NoOfDataCenterLocs"]) * (parseInt(params.data["DC_Upgrade"])/100)));
                params.data["prod_percentage"] =Math.round( (parseInt(newValue) * (parseInt(params.data["AGT_prod"]))) + (parseInt(params.data["NoOfDataCenterLocs"]) * (parseInt(params.data["DC_prod"]))));
                params.data["uat_percentage"] =Math.round( (parseInt(newValue) * (parseInt(params.data["AGT_Upgrade"]))) + (parseInt(params.data["NoOfDataCenterLocs"]) * (parseInt(params.data["DC_Upgrade"]))));
            }


            if (params.colDef.field == 'NoOfDataCenterLocs') {
                // params.data["prod_percentage"] =Math.round( (parseInt(params.data["NoOfAgentCenterLocs"]) * (parseInt(params.data["AGT_prod"])/100)) + (parseInt(newValue) * (parseInt(params.data["DC_prod"])/100)));
                // params.data["uat_percentage"] = Math.round( (parseInt(params.data["NoOfAgentCenterLocs"]) * (parseInt(params.data["AGT_Upgrade"])/100)) + (parseInt(newValue) * (parseInt(params.data["DC_Upgrade"])/100)));
                params.data["prod_percentage"] =Math.round( (parseInt(params.data["NoOfAgentCenterLocs"]) * (parseInt(params.data["AGT_prod"]))) + (parseInt(newValue) * (parseInt(params.data["DC_prod"]))));
                params.data["uat_percentage"] = Math.round( (parseInt(params.data["NoOfAgentCenterLocs"]) * (parseInt(params.data["AGT_Upgrade"]))) + (parseInt(newValue) * (parseInt(params.data["DC_Upgrade"]))));
            }
            eLabel.data = newValue;
            params.data[params.colDef.field] = newValue;
            eCell.removeChild(eInput);
            eCell.appendChild(eLabel);
            $scope.grdSDLC.api.refreshView();
        };

        eInput.addEventListener("blur", blurListenerfn);

        return eCell;

    }

    $scope.grdSDLC = {
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
         onGridReady: function (event) {
            $scope.grdSDLC.api.sizeColumnsToFit();
        }
    };

    $scope.savemaster1 = function () {
        angular.forEach($scope.GRDDATA, function (value, key) {
             value.DCCount=parseInt(value.NoOfDataCenterLocs);
             value.prod_percentage=String(value.prod_percentage);
             value.uat_percentage=String(value.uat_percentage);
             value.AgentCount=parseInt(value.NoOfAgentCenterLocs);

        });

        for (var i = 0; i < $scope.GRDDATA.length; i++) {

            delete $scope.GRDDATA[i]['NoOfAgentCenterLocs'];
            delete $scope.GRDDATA[i]['NoOfDataCenterLocs'];
            delete $scope.GRDDATA[i]['myProductName'];
            delete $scope.GRDDATA[i]['AGT_prod'];
            delete $scope.GRDDATA[i]['DC_prod'];
            delete $scope.GRDDATA[i]['DC_Upgrade'];
            delete $scope.GRDDATA[i]['AGT_Upgrade'];
        }

       // alert(JSON.stringify($scope.GRDDATA));

        if ($scope.GRDDATA != null) {
         //   alert('');
            EstimationSDLCService.AddOppEstimationSDLCPercentage($scope.GRDDATA).success(function (data) {
                $scope.BindMasterData();
                 if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {

                    toaster.pop('success', "Success", "Estimation SDLC percentage added successfully", null);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Opp Estimation SDLC percentage!", null);
                $scope.error = "An Error has occured while Adding Estimation SDLC percentage! " + data.ExceptionMessage;
            });
        }

    };


    $scope.BindMasterData = function () {
        EstimationSDLCService.GetAllOpportunityEstimationSDLCPercentage($routeParams.OppId).success(function (data) {
            var product_name = '';
            if (data.Error != undefined) {
                toaster.pop('error', "Error", data.Error, null);
            } else {

                angular.forEach(data, function (value, key) {
                    value.myProductName=value.ProductName;
                    if(product_name==value.myProductName)
                    {
                        value.myProductName='';
                    }
                    else
                    {
                    product_name=value.myProductName;
                    }

                });
                $scope.GRDDATA=data;
                $scope.grdSDLC.api.setRowData($scope.GRDDATA);
            }
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while loading Estimation product!", null);
            $scope.error = "An Error has occured while loading Estimation product! " + data.ExceptionMessage;
        });
    }

    $scope.BindMasterData();
});



