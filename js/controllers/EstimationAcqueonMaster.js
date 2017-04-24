ReportApp.controller('EstimationAcqueonMasterController', function ($scope, $rootScope, _, EstimationAcqueonMasterService, toaster, SelectionService, $timeout, EstimationPageSectionService) {

    $scope.SelectOptions = [];

    $scope.SelectOptions.push({ Id: 0, Type: '--Select--' }, { Id: 1, Type: 'Inbound' }, { Id: 0, Type: 'Outbound' }, { Id: 0, Type: 'Blended' }, { Id: 0, Type: 'RAP CTI' });
    $scope.SelectOptions1 = [];

    $scope.SelectOptions1.push({ Id: 0, Type: '--Select--' }, { Id: 1, Type: 'Yes' }, { Id: 0, Type: 'No' });


    $scope.Types = [{ Id: '1', Type: 'Text' }, { Id: '2', Type: 'Selection1' }, { Id: '3', Type: 'Selection2' }, { Id: '3', Type: 'None' }];


    function TextEditor(params) {
        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);


        var eInput = document.createElement('input');
        eInput.type = 'text';

        params.eGridCell.addEventListener('click', function () {
            if (!editing && params.data.IsHeader != 'Y') {
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
            eOption.setAttribute("value", item.Key);
            eOption.innerHTML = item.Key;
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

        };

        eInput.addEventListener("blur", blurListenerfn);

        return eCell;

    }

    $scope.LCM = [];



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
        var rowid = $scope.lastselected.Rowid - 1;
        if ($scope.LCM.length > 1 && $scope.LCM[rowid].IsHeader != 'Y') {
            $scope.LCM.splice(rowid, 1)
            $scope.Grid.api.setRowData($scope.LCM);
        }
        else {
            toaster.pop('warning', "Warning", "Not allowed to delete", null);
        }
    }

    $scope.Addrow = function (GroupEditor, rowid) {
        $scope.LCM.splice(rowid, 0, GroupEditor)
    }



    var columnDefFirst = [
        { headerName: "RowId", field: "RowId", width: 50 },
        {
            headerName: "", field: "Name", width: 313, cellRenderer: TextEditor
        },
        {
            headerName: 'PROD', field: "col1", width: 60, cellRenderer: Editor
        },
        {
            headerName: 'UAT', field: "col2", width: 60, cellRenderer: Editor
        },
        {
            headerName: 'UPG', field: "col3", width: 60, cellRenderer: Editor
        },
        {
            headerName: "", field: "Name1", width: 200, cellRenderer: TextEditor
        },
        {
            headerName: 'PROD', field: "Fcol1", width: 120, cellRenderer: TextEditor
        },
        {
            headerName: 'UAT', field: "Fcol2", width: 120, cellRenderer: TextEditor
        },
        {
            headerName: 'UPG', field: "Fcol3", width: 120, cellRenderer: TextEditor
        },
        {
            headerName: 'Stage Hours PROD', field: "Fcol4", width: 120, cellRenderer: TextEditor
        },
        {
            headerName: 'Stage Hours UAT', field: "Fcol5", width: 120, cellRenderer: TextEditor
        },
        {
            headerName: 'Stage Hours UPG', field: "Fcol6", width: 120, cellRenderer: TextEditor
        },
    ];



    // this is the grid options for the top grid
    $scope.Grid = {
        rowSelection: 'single',
        headerHeight: 36,
        rowHeight: 24,
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.LCM,
        enableColResize: true,
        debug: true,
        onSelectionChanged: onSelectionChanged,
        getRowStyle: getRowStyleScheduled

    };

    function getRowStyleScheduled(params) {
        if (params.data.IsHeader == "Y") {
            return {
                'background-color': '#5b9bd5',
                'color': 'white'
            }
        }
        return null;
    }


    $scope.lastselected = { 'Rowid': 1, 'Gridname': 'LCM' };


    function onSelectionChanged() {
        var selectedRows = $scope.Grid.api.getSelectedNodes();
        if (selectedRows.length > 0) {
            var alterrows = selectedRows[0].childIndex + 1;
            $scope.lastselected.Rowid = alterrows;// selectedRows1.length - 1;
            $scope.lastselected.Gridname = selectedRows[0].data.GroupType;
        }

        callupdatefortimeout();
    }
    function callupdatefortimeout() {
        $timeout(function () {
            $scope.lastselected.Rowid = $scope.lastselected.Rowid;
            $scope.lastselected.Gridname = $scope.lastselected.Gridname;
        }, 1000);
    }

    $scope.onLoad = function () {
        $scope.GetAllSelection();
    }

    $scope.GetAllSelection = function () {
        SelectionService.GetAllSelection().success(function (data) {
            $scope.Types = data;
            callbackgrid();

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.onLoad();

    function callbackgrid() {
        //$scope.Grid.columnDefs = columnDefFirst;
        $scope.Grid.api.setColumnDefs(columnDefFirst);
        calgridresize();
    }

    function calgridresize() {
        $scope.Grid.api.sizeColumnsToFit();

    }


    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            calgridresize();
        }, 1000);
    });

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

        $timeout(function () {
            calgridresize();
        }, 1000);
    }

    $scope.addFreshrows = function () {


        EstimationPageSectionService.GetAllPageSections().success(function (data) {
            $scope.GridSections = data;

            EstimationAcqueonMasterService.GetAllEstimationAcqueonMaster().success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {

                    var filteredsections = _.filter($scope.GridSections, function (obj) {
                        return obj.PageName == "Acqueon";
                    })

                    var sortedresult = _.sortBy(filteredsections, function (item) {
                        return -parseInt(item.OrderSequence);
                    });

                    angular.forEach(sortedresult, function (value, key) {
                        var result1 = _.filter(data, function (obj) {
                            return obj.GroupType == value.SectionName;
                        })
                        if (result1.length > 0) {
                            var i = 0;

                            _.each(result1, function (obj) {
                                $scope.Addrow(obj, i);
                                i++;
                            })
                            var freshrow = { 'GroupType': value.SectionName, 'Name': value.DisplayName, 'Name1': '', 'col1': '# of Units', 'col2': '# of Units', 'col3': '# of Units', 'Fcol1': 'Hours', 'Fcol2': 'Hours', 'Fcol3': 'Hours', 'Fcol4': 'Hours', 'Fcol5': 'Hours', 'Fcol6': 'Hours', 'RowId': '', IsHeader: 'Y', IsOriginal: true };
                            $scope.Addrow(freshrow, '');
                        }
                        else {
                            var freshrow = { 'GroupType': value.SectionName, 'Name': value.SectionName, 'Name1': '', 'col1': '# of Units', 'col2': '# of Units', 'col3': '# of Units', 'Fcol1': 'Hours', 'Fcol2': 'Hours', 'Fcol3': 'Hours', 'RowId': '', IsHeader: 'Y', IsOriginal: true };
                            $scope.Addrow(freshrow, '');
                        }
                    });

                    $scope.Grid.api.setRowData($scope.LCM);

                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
                $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
            });

        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
            $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
        });


    }

    $scope.addFreshrows();


    function RunthroughFormula(params, count) {
        var res = params.replace('1col1', count + "col1");
        res = res.replace('1col2', count + "col2");
        return res;
    }

    $scope.currentmax = 0;

    $scope.addnewpricerow = function () {

        var GroupType = '';
        var data = $scope.LCM;
        if ($scope.currentmax == 0) {
            var maxid = _.max(data, function (maxdata) { return parseInt(maxdata.RowId); });
            $scope.currentmax = parseInt(maxid.RowId) + 1;
        }
        else {
            $scope.currentmax = parseInt($scope.currentmax) + 1;
        }


        if ($scope.lastselected.Gridname != '') {
            var freshrow = { 'GroupType': $scope.lastselected.Gridname, 'Name': 'Type name', 'col1': 'Text', 'col2': 'Text', 'col3': 'Text', 'Fcol1': '', 'Fcol2': '', 'Fcol3': '', 'RowId': $scope.currentmax };
            $scope.Addrow(freshrow, $scope.lastselected.Rowid);
        }

        $scope.Grid.api.setRowData($scope.LCM);
    }


    $scope.savemaster = function () {

        var data = $scope.LCM;
        if (validatedata(data)) {

            for (var j = 0; j < data.length; j++) {
                try {
                    delete data[j].Id;
                    //  data[j].RowId = j + 1;
                }
                catch (ex) {
                    alert(ex);
                }
            }

            var filtered = _.filter(data, function (item) {
                return item.IsHeader !== 'Y';
            });

            if (filtered != null) {

                EstimationAcqueonMasterService.AddEstimationAcqueonMaster(filtered).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        toaster.pop('success', "Success", "Estimation Acqueon Master added successfully", null);
                    }
                }).error(function (data) {
                    toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
                    $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
                });
            }
        }

    }

    function validatedata(data) {
        var val = true;
        for (var j = 0; j < data.length; j++) {
            try {
                if (data[j].Name == '') {
                    toaster.pop('warning', "Warning", "Please check the sheet data contains error", null);
                    val = false;
                }
            }
            catch (ex) {
                alert(ex);
            }
        }
        return val;

    }

});



