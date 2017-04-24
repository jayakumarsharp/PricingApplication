ReportApp.controller('GridController', function ($scope, $rootScope, _, EstimationApplicationMasterService, toaster) {

    $scope.Viewpage = function name() {
        $('#test').modal('show');
    }

    $scope.data = [];
    $scope.data1 = [];
    $scope.data2 = [];
    $scope.data3 = [];

    $scope.SelectOptions = [];

    $scope.SelectOptions.push({ Id: 0, Type: '--Select--' }, { Id: 1, Type: 'Inbound' }, { Id: 0, Type: 'Outbound' }, { Id: 0, Type: 'Blended' }, { Id: 0, Type: 'RAP CTI' });
    $scope.SelectOptions1 = [];

    $scope.SelectOptions1.push({ Id: 0, Type: '--Select--' }, { Id: 1, Type: 'Yes' }, { Id: 0, Type: 'No' });

    function NonPercentTypeEditor(params) {

        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);


        var eSelect = document.createElement("select");
        var eSelect1 = document.createElement("select");
        var eInput = document.createElement('input');
        eInput.type = 'text';

        $scope.SelectOptions.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item.Type);
            eOption.setAttribute("title", item.Id);
            eOption.innerHTML = item.Type;
            eSelect.appendChild(eOption);
        });
        $scope.SelectOptions1.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item.Type);
            eOption.setAttribute("title", item.Id);
            eOption.innerHTML = item.Type;
            eSelect1.appendChild(eOption);
        });

        eSelect.value = params.value;
        eSelect1.value = params.value;

        params.eGridCell.addEventListener('click', function () {

            if (!editing) {
                eInput.value = eLabel.data;
                eInput.type = 'number';

                if (params.data[(params.colDef.field).slice(1)] == 'Text') {
                    eCell.removeChild(eLabel);
                    eInput.className = 'ag-cell-edit-input';
                    eInput.style.width = (params.eGridCell.clientWidth - 10) + "px";
                    eCell.appendChild(eInput);
                    eInput.focus();
                    editing = true;
                }
                else if (params.data[(params.colDef.field).slice(1)] == 'Selection2') {
                    eCell.removeChild(eLabel);
                    eCell.appendChild(eSelect);
                    eSelect.focus();
                    editing = true;
                }
                else if (params.data[(params.colDef.field).slice(1)] == 'Selection1') {
                    eCell.removeChild(eLabel);
                    eCell.appendChild(eSelect1);
                    eSelect.focus();
                    editing = true;
                }
                else if (params.data[(params.colDef.field).slice(1)] == 'Formula') {

                    // eInput.value = eval('params.data.vcol1 + params.data.vcol2');
                    // eCell.removeChild(eLabel);
                    // eCell.appendChild(eInput);
                    // eInput.focus();
                    // editing = true;
                }
            }

        });


        eInput.addEventListener('keydown', function (event) {
            var key = event.which || event.keyCode;
            if (this.value.length > 10)
                this.value = this.value.slice(0, 10);
            if (key == "13") {
                blurListenerfn();
                eInput.removeEventListener('blur', blurListenerfn);
            }
        });

        var blurListenerfn = function () {
            editing = false;
            var newValue = eInput.value;
            if (newValue == '') {
                newValue = 0;
            }
            eLabel.data = newValue;
            params.data[params.colDef.field] = newValue;

            eCell.removeChild(eInput);
            eCell.appendChild(eLabel);
            $scope.onRefreshAll(params);
        };

        eInput.addEventListener("blur", blurListenerfn);

        eSelect.addEventListener('blur', function () {
            if (editing) {
                editing = false;
                eCell.removeChild(eSelect);
                eCell.appendChild(eLabel);
            }

        });

        eSelect.addEventListener('change', function () {

            if (editing) {
                editing = false;
                var newValue = eSelect.value;
                var id = eSelect.selectedOptions[0].title;
                eLabel.nodeValue = newValue;
                eCell.removeChild(eSelect);
                eCell.appendChild(eLabel);
                params.data[params.colDef.field] = newValue;
                $scope.onRefreshAll(params);
            }

        });

        eSelect1.addEventListener('blur', function () {
            if (editing) {
                editing = false;
                eCell.removeChild(eSelect1);
                eCell.appendChild(eLabel);
            }

        });

        eSelect1.addEventListener('change', function () {

            if (editing) {
                editing = false;
                var newValue = eSelect1.value;
                var id = eSelect1.selectedOptions[0].title;
                eLabel.nodeValue = newValue;
                eCell.removeChild(eSelect1);
                eCell.appendChild(eLabel);
                params.data[params.colDef.field] = newValue;
                $scope.onRefreshAll(params);
            }

        });
        return eCell;

    }

    $scope.Types = [{ Id: '1', Type: 'Text' }, { Id: '2', Type: 'Selection1' }, { Id: '3', Type: 'Selection2' }, { Id: '3', Type: 'None' }];

    function Editor(params) {
        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);


        var eSelect = document.createElement("select");
        var eInput = document.createElement('input');
        eInput.type = 'text';

        $scope.Types.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item.Type);
            eOption.innerHTML = item.Type;
            eSelect.appendChild(eOption);
        });

        eSelect.value = params.value;

        params.eGridCell.addEventListener('click', function () {
            if (!editing && params.data.IsHeader != 'Y') {
                if (params.colDef.field.charAt(0) == "F") {
                    eInput.value = eLabel.data;
                    eCell.removeChild(eLabel);
                    eInput.className = 'ag-cell-edit-input';
                    eInput.style.width = (params.eGridCell.clientWidth - 10) + "px";
                    eCell.appendChild(eInput);
                    eInput.focus();
                    editing = true;
                }
                else {
                    eCell.removeChild(eLabel);
                    eCell.appendChild(eSelect);
                    eSelect.focus();
                    editing = true;
                }
            }
        });

        eSelect.addEventListener('blur', function () {
            if (editing) {
                editing = false;
                eCell.removeChild(eSelect);
                eCell.appendChild(eLabel);
            }

        });

        eSelect.addEventListener('change', function () {
            if (editing) {
                var newValue = eSelect.value;

                if (newValue == '--Select--') {
                    toaster.pop('warning', "Warning", 'Please select Type', null);
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
            $scope.onRefreshAll(params);
        };

        eInput.addEventListener("blur", blurListenerfn);

        return eCell;

    }

    $scope.GridInputFramework = [];
    $scope.GridInputScreenApplicationDevelopment = [];
    $scope.GridInputHostOperations = [];
    $scope.GridInputOthers = [];

    function gettype(params) {
        if (params == "Text") {
            return '0';
        }
        else if (params == "Selection1" || params == "Selection2") {
            return '--Select--';
        }
        else if (params == "Formula") {
            return 'Formula';
        }
        else {
            return '--';
        }


    }

    $scope.deleteRow = function () {
        var GroupType = $scope.lastselected.Gridname;
        var rowid = $scope.lastselected.Rowid;
        if (GroupType == 'Framework') {
            $scope.data.splice(rowid, 1);
            $scope.GridInputFramework.splice(rowid, 1)
        }
        else if (GroupType == 'ScreenApplicationDevelopment') {
            $scope.data1.splice(rowid, 1);
            $scope.GridInputScreenApplicationDevelopment.splice(rowid, 1)
        }
        else if (GroupType == 'HostOperations') {
            $scope.data2.splice(rowid, 1);
            $scope.GridInputHostOperations.splice(rowid, 1)
        }
        else if (GroupType == 'Others') {
            $scope.data3.splice(rowid, 1);
            $scope.GridInputOthers.splice(rowid, 1);
        }

        if ($scope.lastselected.Gridname == 'Framework') {
            $scope.gridOptionsFixed.api.setRowData($scope.GridInputFramework);
            $scope.gridOptionsTop.api.setRowData($scope.data);
        }
        else if ($scope.lastselected.Gridname == 'ScreenApplicationDevelopment') {
            $scope.gridOptionsFixedBottom1.api.setRowData($scope.GridInputScreenApplicationDevelopment);
            $scope.gridOptionsBottom1.api.setRowData($scope.data1);
        }
        else if ($scope.lastselected.Gridname == 'HostOperations') {
            $scope.gridOptionsFixedBottom2.api.setRowData($scope.GridInputHostOperations);
            $scope.gridOptionsBottom2.api.setRowData($scope.data2);

        }
        else if ($scope.lastselected.Gridname == 'Others') {
            $scope.gridOptionsFixedBottom3.api.setRowData($scope.GridInputOthers);
            $scope.gridOptionsBottom3.api.setRowData($scope.data3);
        }

    }




    $scope.Addrow = function (GroupEditor, rowid) {
        var localJson = {};
        localJson = angular.copy(GroupEditor);
        localJson['1col1'] = gettype(GroupEditor.col1);
        localJson['1col2'] = gettype(GroupEditor.col2);
        localJson['1Fcol3'] = gettype(GroupEditor.col3);
        //localJson.vcol4 = gettype(GroupEditor.col4);

        if (GroupEditor.GroupType == 'Framework') {
            $scope.data.splice(rowid, 0, localJson);
            $scope.GridInputFramework.splice(rowid, 0, GroupEditor)
        }
        else if (GroupEditor.GroupType == 'ScreenApplicationDevelopment') {
            $scope.data1.splice(rowid, 0, localJson);
            $scope.GridInputScreenApplicationDevelopment.splice(rowid, 0, GroupEditor)
        }
        else if (GroupEditor.GroupType == 'HostOperations') {
            $scope.data2.splice(rowid, 0, localJson);
            $scope.GridInputHostOperations.splice(rowid, 0, GroupEditor)
        }
        else if (GroupEditor.GroupType == 'Others') {
            $scope.data3.splice(rowid, 0, localJson);
            $scope.GridInputOthers.splice(rowid, 0, GroupEditor);
        }

        localJson = {};

        $('#test').modal('hide');
    }

    function refreshviews() {
        $scope.data = [];
        $scope.data1 = [];
        $scope.data2 = [];
        $scope.data3 = [];
        gettypebsedfill($scope.GridInputFramework);
        gettypebsedfill($scope.GridInputScreenApplicationDevelopment);
        gettypebsedfill($scope.GridInputHostOperations);
        gettypebsedfill($scope.GridInputOthers);

        $scope.gridOptionsTop.api.setRowData($scope.data);
        $scope.gridOptionsBottom1.api.setRowData($scope.data1);
        $scope.gridOptionsBottom2.api.setRowData($scope.data2);
        $scope.gridOptionsBottom3.api.setRowData($scope.data3);

    }

    function gettypebsedfill(params) {
        angular.forEach(params, function (val, key) {
            var localJson = {};
            localJson = val;
            localJson['1col1'] = gettype(val.col1);
            localJson['1col2'] = gettype(val.col2);
            localJson['1Fcol3'] = gettype(val.col3);
            if (val.GroupType == 'Framework') {
                $scope.data.push(localJson);
            }
            else if (val.GroupType == 'ScreenApplicationDevelopment') {
                $scope.data1.push(localJson);
            }
            else if (val.GroupType == 'HostOperations') {
                $scope.data2.push(localJson);
            }
            else if (val.GroupType == 'Others') {
                $scope.data3.push(localJson);
            }
            localJson = {};
        });
    }

    var columnDefFirst = [
        {
            headerName: "Number of Applications : 1", children: [{ headerName: "Framework", field: "Name", width: 425, editable: true }]
        },
        {
            headerName: 'Application # 1',
            children: [
                { headerName: "", field: "col1", width: 180, cellRenderer: Editor },
                { headerName: "", field: "col2", width: 180, cellRenderer: Editor },
                { headerName: "Hours", field: "Fcol3", width: 300, cellRenderer: Editor },
            ]
        }
    ];

    var columnDefFirst1 = [
        { headerName: "Screen & Application Development", field: "Name", width: 425, editable: true },
        { headerName: "", field: "col1", width: 180, cellRenderer: Editor },
        { headerName: "", field: "col2", width: 180, cellRenderer: Editor },
        { headerName: "Hours", field: "Fcol3", width: 300, cellRenderer: Editor },
    ];


    // this is the grid options for the top grid
    $scope.gridOptionsFixed = {
        rowSelection: 'single',
        enableFilter: true,
        headerHeight: 36,
        rowHeight: 24,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputFramework,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        onSelectionChanged: onSelectionChanged,

    };

    $scope.gridOptionsFixedBottom1 = {
        rowSelection: 'single',
        enableFilter: true,
        headerHeight: 36,
        rowHeight: 24,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputScreenApplicationDevelopment,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        onSelectionChanged: onSelectionChanged,
    };
    // this is the grid options for the bottom grid
    $scope.gridOptionsFixedBottom2 = {
        rowSelection: 'single',
        enableFilter: true,
        headerHeight: 36,
        rowHeight: 24,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputHostOperations,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        onSelectionChanged: onSelectionChanged,
    };

    $scope.gridOptionsFixedBottom3 = {
        rowSelection: 'single',
        enableFilter: true,
        headerHeight: 36,
        rowHeight: 24,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputOthers,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        onSelectionChanged: onSelectionChanged,

    };

    $scope.lastselected = { 'Rowid': 1, 'Gridname': 'Framework' };


    function onSelectionChanged() {

        var selectedRows1 = $scope.gridOptionsFixed.api.getSelectedNodes();
        var selectedRows2 = $scope.gridOptionsFixedBottom1.api.getSelectedNodes();
        var selectedRows3 = $scope.gridOptionsFixedBottom2.api.getSelectedNodes();
        var selectedRows4 = $scope.gridOptionsFixedBottom3.api.getSelectedNodes();
        if (selectedRows1.length > 0) {
            var alterrows = selectedRows1[0].childIndex + 1;
            $scope.lastselected.Rowid = alterrows;// selectedRows1.length - 1;
            $scope.lastselected.Gridname = 'Framework';
            selectedRows1[0].setSelected(false);
            // $scope.gridOptionsFixed.api.forEachNode(function (node) {
            //     node.setSelected(false);
            // });

        }

        if (selectedRows2.length > 0) {
            var alterrows = selectedRows2[0].childIndex + 1;
            $scope.lastselected.Rowid = alterrows;// selectedRows2.length - 1;
            $scope.lastselected.Gridname = 'ScreenApplicationDevelopment';
            selectedRows2[0].setSelected(false);
            // $scope.gridOptionsFixedBottom1.api.forEachNode(function (node) {
            //     node.setSelected(false);
            // });
        }
        if (selectedRows3.length > 0) {
            var alterrows = selectedRows3[0].childIndex + 1;
            $scope.lastselected.Rowid = alterrows;//selectedRows3.length - 1;
            $scope.lastselected.Gridname = 'HostOperations';
            selectedRows3[0].setSelected(false);
            // $scope.gridOptionsFixedBottom2.api.forEachNode(function (node) {
            //     node.setSelected(false);
            // });
        }
        if (selectedRows4.length > 0) {
            var alterrows = selectedRows4[0].childIndex + 1;
            $scope.lastselected.Rowid = alterrows;// selectedRows4.length - 1;
            $scope.lastselected.Gridname = 'Others';
            selectedRows4[0].setSelected(false);
            // $scope.gridOptionsFixedBottom3.api.forEachNode(function (node) {
            //     node.setSelected(false);
            // });
        }


        // selectedRows.forEach(function (selectedRow, index) {
        //     if (index != 0) {
        //         selectedRowsString += ', ';
        //     }
        //     selectedRowsString += selectedRow.athlete;
        // });
        // document.querySelector('#selectedRows').innerHTML = selectedRowsString;
    }


    var columnDefs = [
        {
            headerName: "", hide: true, field: "col1", width: 1
        },
        {
            headerName: "", hide: true, field: "col2", width: 1,
        },
        {
            headerName: "", hide: true, field: 'Fcol3', width: 1,
        },
        {
            headerName: "Number of Applications : 1", children: [{ headerName: "Framework", field: "Name", width: 425 }]
        },
        {
            headerName: 'Application # 1',
            children: [
                { headerName: "", field: "1col1", width: 220, cellRenderer: NonPercentTypeEditor },
                { headerName: "", field: "1col2", width: 220, cellRenderer: NonPercentTypeEditor },
                { headerName: "Hours", field: "1Fcol3", width: 220, cellRenderer: NonPercentTypeEditor },
            ]
        }
    ];


    var columnDefs1 = [
        {
            headerName: "", hide: true, field: "col1", width: 1
        },
        {
            headerName: "", hide: true, field: "col2", width: 1,
        },
        {
            headerName: "", hide: true, field: 'Fcol3', width: 1,
        },
        { headerName: "Screen & Application Development", field: "Name", width: 425 },
        { headerName: "", field: "1col1", width: 220, cellRenderer: NonPercentTypeEditor },
        { headerName: "", field: "1col2", width: 220, cellRenderer: NonPercentTypeEditor },
        { headerName: "Hours", field: "1Fcol3", width: 220, cellRenderer: NonPercentTypeEditor },
    ];


    $scope.gridOptionsTop = {
        rowSelection: 'single',
        enableFilter: true,
        headerHeight: 36,
        rowHeight: 24,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
    };


    $scope.gridOptionsBottom1 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data1,
        enableColResize: true,
        debug: true,
        slaveGrids: [],

    };


    $scope.gridOptionsBottom2 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data2,
        enableColResize: true,
        debug: true,
        slaveGrids: [],

    };

    $scope.gridOptionsBottom3 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data3,
        enableColResize: true,
        debug: true,
        slaveGrids: [],

    };



    $scope.onLoad = function () {
        // columnDefs1.push( {
        //     headerName: "sdfa", field: "34534", width: 145
        // });

        $scope.gridOptionsTop.columnDefs = columnDefs;
        $scope.gridOptionsBottom1.columnDefs = columnDefs1;
        columnDefs1[0].headerName = 'Host Operations';
        $scope.gridOptionsBottom2.columnDefs = columnDefs1;
        columnDefs1[0].headerName = 'Others';
        $scope.gridOptionsBottom3.columnDefs = columnDefs1;

        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom3);


        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom3);

        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom3);


        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsTop);


        $scope.gridOptionsFixed.columnDefs = columnDefFirst;
        $scope.gridOptionsFixedBottom1.columnDefs = columnDefFirst1;
        columnDefFirst1[0].headerName = 'Host Operations';
        $scope.gridOptionsFixedBottom2.columnDefs = columnDefFirst1;
        columnDefFirst1[0].headerName = 'Others';
        $scope.gridOptionsFixedBottom3.columnDefs = columnDefFirst1;

        $scope.gridOptionsFixed.slaveGrids.push($scope.gridOptionsFixedBottom1);
        $scope.gridOptionsFixed.slaveGrids.push($scope.gridOptionsFixedBottom2);
        $scope.gridOptionsFixed.slaveGrids.push($scope.gridOptionsFixedBottom3);


    }

    $scope.onLoad();

    $scope.addFreshrows = function () {
        EstimationApplicationMasterService.GetAllEstimationApplicationMaster().success(function (data) {
            if (data.Error != undefined) {
                toaster.pop('error', "Error", data.Error, null);
            } else {
                //  debugger;
                var result1 = _.filter(data, function (someThing) {
                    return someThing.GroupType == "Framework";
                })
                if (result1.length > 0) {
                    var i = 0;
                    _.each(result1, function (someThing) {
                        $scope.Addrow(someThing, i);
                        i++;
                    })
                }
                else {
                    var freshrow = { 'GroupType': 'Framework', 'Name': 'Type name', 'col1': 'Text', 'col2': 'Text', 'Fcol3': '' };
                    $scope.Addrow(freshrow, 0);
                }
                var result2 = _.filter(data, function (someThing) {
                    return someThing.GroupType == "ScreenApplicationDevelopment";
                })
                if (result2.length > 0) {
                    var i = 0;
                    _.each(result2, function (someThing) {
                        $scope.Addrow(someThing, i);
                        i++;
                    })
                }
                else {
                    var freshrow = { 'GroupType': 'ScreenApplicationDevelopment', 'Name': 'Type name', 'col1': 'Text', 'col2': 'Text', 'Fcol3': '' };
                    $scope.Addrow(freshrow, 0);
                }

                var result3 = _.filter(data, function (someThing) {
                    return someThing.GroupType == "HostOperations";
                })
                if (result3.length > 0) {
                    var i = 0;
                    _.each(result3, function (someThing) {
                        $scope.Addrow(someThing, i);
                        i++;
                    })
                }
                else {
                    var freshrow = { 'GroupType': 'HostOperations', 'Name': 'Type name', 'col1': 'Text', 'col2': 'Text', 'Fcol3': '' };
                    $scope.Addrow(freshrow, 0);
                }

                var result4 = _.filter(data, function (someThing) {
                    return someThing.GroupType == "Others";
                })
                if (result4.length > 0) {
                    var i = 0;
                    _.each(result4, function (someThing) {
                        $scope.Addrow(someThing, i);
                        i++;
                    })
                }
                else {

                    var freshrow = { 'GroupType': 'Others', 'Name': 'Type name', 'col1': 'Text', 'col2': 'Text', 'Fcol3': '' };
                    $scope.Addrow(freshrow, 0);
                }

                $scope.gridOptionsFixed.api.setRowData($scope.GridInputFramework);
                $scope.gridOptionsTop.api.setRowData($scope.data);

                $scope.gridOptionsFixedBottom1.api.setRowData($scope.GridInputScreenApplicationDevelopment);
                $scope.gridOptionsBottom1.api.setRowData($scope.data1);

                $scope.gridOptionsFixedBottom2.api.setRowData($scope.GridInputHostOperations);
                $scope.gridOptionsBottom2.api.setRowData($scope.data2);


                $scope.gridOptionsFixedBottom3.api.setRowData($scope.GridInputOthers);
                $scope.gridOptionsBottom3.api.setRowData($scope.data3);



            }
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
            $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
        });




    }

    $scope.addFreshrows();

    $scope.onRefreshView = function () {
        $scope.data = [];
        $scope.data1 = [];
        $scope.data2 = [];
        $scope.data3 = [];

        angular.forEach($scope.GridInputFramework, function (key, val) {
            var data = refreshsecond(key);
            if (data != '')
                $scope.data.push(JSON.parse(JSON.stringify(data)));
        });

        angular.forEach($scope.GridInputScreenApplicationDevelopment, function (key, val) {
            var data = refreshsecond(key);
            if (data != '')
                $scope.data1.push(JSON.parse(JSON.stringify(data)));
        });
        angular.forEach($scope.GridInputHostOperations, function (key, val) {
            var data = refreshsecond(key);
            if (data != '')
                $scope.data2.push(JSON.parse(JSON.stringify(data)));
        });
        angular.forEach($scope.GridInputOthers, function (key, val) {
            var data = refreshsecond(key);
            if (data != '')
                $scope.data3.push(JSON.parse(JSON.stringify(data)));
        });

        $scope.gridOptionsTop.api.setRowData($scope.data);
        $scope.gridOptionsBottom1.api.setRowData($scope.data1);
        $scope.gridOptionsBottom2.api.setRowData($scope.data2);
        $scope.gridOptionsBottom3.api.setRowData($scope.data3);

    }

    function refreshsecond(GroupEditor) {

        var localJson = {};
        localJson = angular.copy(GroupEditor);
        localJson['1col1'] = gettype(GroupEditor.col1);
        localJson['1col2'] = gettype(GroupEditor.col2);
        localJson['1Fcol3'] = gettype(GroupEditor.col3);

        if (GroupEditor.GroupType == 'Framework') {
            return localJson;
        }
        else if (GroupEditor.GroupType == 'ScreenApplicationDevelopment') {
            return localJson;
        }
        else if (GroupEditor.GroupType == 'HostOperations') {
            return localJson;
        }
        else if (GroupEditor.GroupType == 'Others') {
            return localJson;
        }
        return '';
    }

    $scope.onRefreshAll = function (params) {
        try {
            if (params.data.Fcol3 != undefined && params.data.Fcol3 != null && params.data.Fcol3 != '') {
                for (var i = 1; i < $scope.CurrentAdditionalGrid; i++) {
                    try {
                        var formula = RunthroughFormula(params.data.Fcol3, i);
                        params.data[i + 'Fcol3'] = eval(formula);

                    }
                    catch (e)
                    { alert(e); }
                }
            }

            $scope.gridOptionsTop.api.refreshView();
            $scope.gridOptionsBottom1.api.refreshView();
            $scope.gridOptionsBottom2.api.refreshView();
            $scope.gridOptionsBottom3.api.refreshView();
        }
        catch (ex) {
            alert(ex);
        }
    }

    function RunthroughFormula(params, count) {
        var res = params.replace('1col1', count + "col1");
        res = res.replace('1col2', count + "col2");
        return res;
    }

    $scope.addnewpricerow = function () {

        // var selectedRows1 = $scope.gridOptionsFixed.api.getSelectedNodes();
        // var selectedRows2 = $scope.gridOptionsFixedBottom1.api.getSelectedNodes();
        // var selectedRows3 = $scope.gridOptionsFixedBottom2.api.getSelectedNodes();
        // var selectedRows4 = $scope.gridOptionsFixedBottom3.api.getSelectedNodes();
        var GroupType = '';

        if ($scope.lastselected.Gridname != '') {
            var freshrow = { 'GroupType': $scope.lastselected.Gridname, 'Name': 'Type name', 'col1': 'Text', 'col2': 'Text', 'Fcol3': '' };
            $scope.Addrow(freshrow, $scope.lastselected.Rowid);
        }

        if ($scope.lastselected.Gridname == 'Framework') {
            $scope.gridOptionsFixed.api.setRowData($scope.GridInputFramework);
            $scope.gridOptionsTop.api.setRowData($scope.data);
        }
        else if ($scope.lastselected.Gridname == 'ScreenApplicationDevelopment') {
            $scope.gridOptionsFixedBottom1.api.setRowData($scope.GridInputScreenApplicationDevelopment);
            $scope.gridOptionsBottom1.api.setRowData($scope.data1);
        }
        else if ($scope.lastselected.Gridname == 'HostOperations') {
            $scope.gridOptionsFixedBottom2.api.setRowData($scope.GridInputHostOperations);
            $scope.gridOptionsBottom2.api.setRowData($scope.data2);

        }
        else if ($scope.lastselected.Gridname == 'Others') {
            $scope.gridOptionsFixedBottom3.api.setRowData($scope.GridInputOthers);
            $scope.gridOptionsBottom3.api.setRowData($scope.data3);
        }


    }

    $scope.showmaster = function () {
        $scope.master = !$scope.master;
    }


    $scope.master = false;
    $scope.CurrentAdditionalGrid = 2;

    $scope.addadditional = function () {
        // columnDefs1.push( {
        //     headerName: "sdfa", field: "34534", width: 145
        // });
        columnDefs.push({ headerName: 'Application # ' + $scope.CurrentAdditionalGrid, children: [{ headerName: "", field: $scope.CurrentAdditionalGrid + "col1", width: 220, cellRenderer: NonPercentTypeEditor }, { headerName: "", field: $scope.CurrentAdditionalGrid + "col2", width: 220, cellRenderer: NonPercentTypeEditor }, { headerName: "Hours", field: $scope.CurrentAdditionalGrid + "Fcol3", width: 220, cellRenderer: NonPercentTypeEditor }] });

        columnDefs1.push({ headerName: "", field: $scope.CurrentAdditionalGrid + "col1", width: 220, cellRenderer: NonPercentTypeEditor });
        columnDefs1.push({ headerName: "", field: $scope.CurrentAdditionalGrid + "col2", width: 220, cellRenderer: NonPercentTypeEditor });
        columnDefs1.push({ headerName: "Hours", field: $scope.CurrentAdditionalGrid + "Fcol3", width: 220, cellRenderer: NonPercentTypeEditor });


        $scope.gridOptionsTop.columnDefs = columnDefs;
        $scope.gridOptionsBottom1.columnDefs = columnDefs1;
        columnDefs1[0].headerName = 'Host Operations';
        $scope.gridOptionsBottom2.columnDefs = columnDefs1;
        columnDefs1[0].headerName = 'Others';
        $scope.gridOptionsBottom3.columnDefs = columnDefs1;


        $scope.gridOptionsTop.api.setColumnDefs(columnDefs);
        $scope.gridOptionsBottom1.api.setColumnDefs(columnDefs1);
        $scope.gridOptionsBottom2.api.setColumnDefs(columnDefs1);
        $scope.gridOptionsBottom3.api.setColumnDefs(columnDefs1);
        $scope.gridOptionsTop.api.sizeColumnsToFit();
        $scope.gridOptionsBottom1.api.sizeColumnsToFit();
        $scope.gridOptionsBottom2.api.sizeColumnsToFit();
        $scope.gridOptionsBottom3.api.sizeColumnsToFit();
        $scope.CurrentAdditionalGrid++;
    }

    $scope.savemaster = function () {

        var data = $scope.GridInputFramework.concat($scope.GridInputScreenApplicationDevelopment).concat($scope.GridInputHostOperations).concat($scope.GridInputOthers);
        for (var j = 0; j < data.length; j++) {
            try {
                delete data[j].Id
            }
            catch (ex) {
                alert(ex);
            }
        }

        if (data != null) {
            EstimationApplicationMasterService.AddEstimationApplicationMaster(data).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {

                    toaster.pop('success', "Success", "Estimation Application Master added successfully", null);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
                $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
            });
        }
    }


});



