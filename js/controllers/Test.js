
ReportApp.controller('GridController', function ($scope, $rootScope, _) {

    $scope.Viewpage = function name() {
        $('#test').modal('show');
    }

    $scope.data = [];
    $scope.data1 = [];
    $scope.data2 = [];
    $scope.data3 = [];


    var columnDefs = [
        {
            headerName: "", hide: true, field: "col1", width: 1
        },
        {
            headerName: "", hide: true, field: "col2", width: 1,
        },
        {
            headerName: "", hide: true, field: 'col3', width: 1,
        },
        {
            headerName: "", hide: true, field: 'col4', width: 1,
        },
        {
            headerName: "Number of Applications : 1", children: [{ headerName: "Framework", field: "Name", width: 350 }]
        },
        {
            headerName: 'Application # 1',
            children: [
                { headerName: "", field: "vcol1", width: 150, cellRenderer: NonPercentTypeEditor },
                { headerName: "", field     : "vcol2", width: 150, cellRenderer: NonPercentTypeEditor },
                { headerName: "Hours", field: "vcol3", width: 150, cellRenderer: NonPercentTypeEditor },
                { headerName: "Formula", field: "vcol4", width: 150, cellRenderer: NonPercentTypeEditor }
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
            headerName: "", hide: true, field: 'col3', width: 1,
        },
        {
            headerName: "", hide: true, field: 'col4', width: 1,
        },
        { headerName: "Screen & Application Development", field: "Name", width: 350 },
        { headerName: "", field: "vcol1", width: 150, cellRenderer: NonPercentTypeEditor },
        { headerName: "", field: "vcol2", width: 150, cellRenderer: NonPercentTypeEditor },
        { headerName: "Hours", field: "vcol3", width: 150, cellRenderer: NonPercentTypeEditor },
        { headerName: "Formula", field: "vcol4", width: 150, cellRenderer: NonPercentTypeEditor }
    ];

    // this is the grid options for the top grid
    $scope.gridOptionsTop = {
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
        $scope.gridOptionsBottom2.columnDefs = columnDefs1;
        $scope.gridOptionsBottom3.columnDefs = columnDefs1;

        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom3);


        $scope.gridOptionsFixed.columnDefs = _columnDefs;
        $scope.gridOptionsFixedBottom1.columnDefs = _columnDefs1;
        $scope.gridOptionsFixedBottom2.columnDefs = _columnDefs1;
        $scope.gridOptionsFixedBottom3.columnDefs = _columnDefs1;
        $scope.gridOptionsFixed.slaveGrids.push($scope.gridOptionsFixedBottom1);
        $scope.gridOptionsFixed.slaveGrids.push($scope.gridOptionsFixedBottom2);
        $scope.gridOptionsFixed.slaveGrids.push($scope.gridOptionsFixedBottom3);

    }
    $scope.SelectOptions = [];

    $scope.SelectOptions.push({ Id: 0, Type: '--Select--' });

    function NonPercentTypeEditor(params) {

        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);


        var eSelect = document.createElement("select");
        var eInput = document.createElement('input');
        eInput.type = 'text';

        $scope.SelectOptions.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item.Type);
            eOption.setAttribute("title", item.Id);
            eOption.innerHTML = item.Type;
            eSelect.appendChild(eOption);
        });

        eSelect.value = params.value;

        params.eGridCell.addEventListener('click', function () {

            if (!editing) {
                eInput.value = eLabel.data;
                eInput.type = 'number';

                if (params.data[(params.colDef.field).slice(1)] == 'Text') {
                    eCell.removeChild(eLabel);
                    eCell.appendChild(eInput);
                    eInput.focus();
                    editing = true;
                }
                else if (params.data[(params.colDef.field).slice(1)] == 'Combo') {
                    eCell.removeChild(eLabel);
                    eCell.appendChild(eSelect);
                    eSelect.focus();
                    editing = true;
                }
                else if (params.data[(params.colDef.field).slice(1)] == 'Formula') {

                    eInput.value = eval('params.data.vcol1 + params.data.vcol2');
                    eCell.removeChild(eLabel);
                    eCell.appendChild(eInput);
                    eInput.focus();
                    editing = true;
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
            }

        });

        return eCell;

    }

    $scope.Types = [{ Id: '1', Type: 'Text' }, { Id: '2', Type: 'Combo' }, { Id: '3', Type: 'None' }, { Id: '3', Type: 'Formula' }];

    function Editor(params) {
        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);

        var eSelect = document.createElement("select");
        $scope.Types.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item.Type);
            eOption.innerHTML = item.Type;
            eSelect.appendChild(eOption);
        });

        eSelect.value = params.value;

        params.eGridCell.addEventListener('click', function () {
            if (!editing) {
                eCell.removeChild(eLabel);
                eCell.appendChild(eSelect);
                eSelect.focus();
                editing = true;
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
        else if (params == "Combo") {
            return '--Select--';
        }
        else if (params == "Formula") {
            return 'Formula';
        }
        else {
            return '--';
        }


    }

    $scope.Addrow = function (GroupEditor) {
        var localJson = {};
        localJson = angular.copy(GroupEditor);
        localJson.vcol1 = gettype(GroupEditor.col1);
        localJson.vcol2 = gettype(GroupEditor.col2);
        localJson.vcol3 = gettype(GroupEditor.col3);
        localJson.vcol4 = gettype(GroupEditor.col4);
        if (GroupEditor.GroupType == 'Framework') {
            $scope.data.push(localJson);
            $scope.GridInputFramework.push(GroupEditor)
            $scope.gridOptionsFixed.api.setRowData($scope.GridInputFramework);
            $scope.gridOptionsTop.api.setRowData($scope.data);
        }
        else if (GroupEditor.GroupType == 'ScreenApplicationDevelopment') {
            $scope.data1.push(localJson);
            $scope.GridInputScreenApplicationDevelopment.push(GroupEditor)
            $scope.gridOptionsFixedBottom1.api.setRowData($scope.GridInputScreenApplicationDevelopment);
            $scope.gridOptionsBottom1.api.setRowData($scope.data1);
        }
        else if (GroupEditor.GroupType == 'HostOperations') {
            $scope.data2.push(localJson);
            $scope.GridInputHostOperations.push(GroupEditor)
            $scope.gridOptionsFixedBottom2.api.setRowData($scope.GridInputHostOperations);
            $scope.gridOptionsBottom2.api.setRowData($scope.data2);
        }
        else if (GroupEditor.GroupType == 'Others') {
            $scope.data3.push(localJson);
            $scope.GridInputOthers.push(GroupEditor)
            $scope.gridOptionsFixedBottom3.api.setRowData($scope.GridInputOthers);
            $scope.gridOptionsBottom3.api.setRowData($scope.data3);
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
            localJson.vcol1 = gettype(val.col1);
            localJson.vcol2 = gettype(val.col2);
            localJson.vcol3 = gettype(val.col3);
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

    var _columnDefs = [
        {
            headerName: "Number of Applications : 1", children: [{ headerName: "Framework", field: "Name", width: 350, editable: true }]
        },
        {
            headerName: 'Application # 1',
            children: [
                { headerName: "", field: "col1", width: 150, cellRenderer: Editor },
                { headerName: "", field: "col2", width: 150, cellRenderer: Editor },
                { headerName: "Hours", field: "col3", width: 150, cellRenderer: Editor },
                { headerName: "FormulaResult", field: "col4", width: 150, cellRenderer: Editor }
            ]
        }
    ];

    var _columnDefs1 = [
        { headerName: "Screen & Application Development", field: "Name", width: 350, editable: true },
        { headerName: "", field: "col1", width: 150, cellRenderer: Editor },
        { headerName: "", field: "col2", width: 150, cellRenderer: Editor },
        { headerName: "Hours", field: "col3", width: 150, cellRenderer: Editor },
        { headerName: "FormulaResult", field: "col4", width: 150, cellRenderer: Editor }
    ];


    // this is the grid options for the top grid
    $scope.gridOptionsFixed = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputFramework,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
       
    };

    $scope.gridOptionsFixedBottom1 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputScreenApplicationDevelopment,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        
    };
    // this is the grid options for the bottom grid
    $scope.gridOptionsFixedBottom2 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputHostOperations,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
    
    };

    $scope.gridOptionsFixedBottom3 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.GridInputOthers,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
      

    };



    $scope.onLoad();
});



