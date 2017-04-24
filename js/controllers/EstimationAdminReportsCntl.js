ReportApp.controller('EstimationAdminReportsController', function ($scope, $rootScope, _, EstimationAdminReportsMasterService, toaster, $routeParams, $timeout, Opportunityservice, $window, $location, EstimationApplicationMasterService, SelectionService) {

    $scope.MaxSheetGroupID = $routeParams.GroupId;
    $scope.MaxVersion;
    $scope.currentwid = 710;
    $scope.mleft = 18;
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
    $scope.forceupdate = false;
    $scope.grid2enable = true;
    $scope.grid3enable = false;
    $scope.grid4enable = false;
    $scope.grid5enable = false;
    $scope.grid6enable = false;
    $scope.grid7enable = false;
    $scope.grid8enable = false;
    $scope.grid9enable = false;
    $scope.grid10enable = false;
    $scope.grid11enable = false;

    $scope.data = [];
    $scope.data1 = [];
    $scope.data2 = [];
    $scope.data3 = [];
    $scope.data4 = [];
    $scope.data5 = [];
    $scope.data6 = [];
    $scope.data7 = [];
    $scope.data8 = [];
    $scope.data9 = [];
    $scope.data10 = [];
    $scope.data11 = [];
    $scope.data12 = [];
    $scope.data13 = [];

    $scope.grideditable = false;

    $scope.Viewpage = function name() {
        $('#test').modal('show');
    }

    $scope.checkIFFreshsheet = function () {
        if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
            $scope.IsfreshSheet = true;
        }
    }
    $scope.checkIFFreshsheet();

    $scope.GetEstimationApplicationVersionsForOpp = function (oppid) {
        console.log('oppid, groupid' + oppid)
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppid, 'AdminReportsSheet').success(function (data) {
            console.log(data)
            $scope.Versiondata = data;
            $scope.CurrentVersiondata = {};
            _.each($scope.Versiondata, function (value, key) {
                if (value["ApplicationId"] == $scope.GlobalGroupId) {
                    $scope.CurrentVersiondata = value;
                    $scope.CurrentAdditionalGrid = value["NumberOfApplication"];
                    $scope.MaxVersion = value["Version"];
                    $scope.hasedit = value["IsEditable"];
                    addgrid($scope.CurrentAdditionalGrid);
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        })

        if ($scope.IsfreshSheet) {
            $scope.hasedit = true;
        }
    };




    $scope.IsReadOnly = false;



    $scope.GetOpportunityList = function (id) {
        Opportunityservice.GetopportunitybyID(id).success(function (data) {
            if (data != null && data.length > 0) {
                $scope.OpportunityDetail = data[0];

                // $scope.GetPriceSheetByversion($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                // $scope.GetPriceSheetVersionsForOpp($scope.OpportunityDetail.OppId);
                $scope.GetEstimationApplicationVersionsForOpp($scope.OpportunityDetail.OppId);
                getservicedata();
            }
            else {

                toaster.pop('error', "Error", 'Invalid Opportunity Details', null);
                //redirect to Home Page

                $window.location.href = "home";
            }

        });
    }

    //first call
    $scope.GetOpportunityList($routeParams.OppId);

    $scope.EditSheet = function () {
        $scope.sheetholdedby = '';
        angular.element(document.querySelector('#loader')).removeClass('hide');

        EstimationApplicationMasterService.GetMaximumGroupEstimationApplicationId().success(function (data) {
            if (data[0].count == null) {
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

            var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'AdminReportsSheet', IsPriceSheetUpdated: true };

            EstimationAdminReportsMasterService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {

                if (!data.IsLocked) {
                    $scope.hasedit = false;
                    $scope.griduseredit = true;
                    $routeParams.GroupId = data.ApplicationId;
                    $scope.MaxVersion = data.Version;
                    $scope.grideditable = true;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');


                    $scope.CurrentAdditionalGrid = data.NumberOfApplication;
                }
                else {
                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "AdminReportsSheet") {
                        $scope.hasedit = false;
                        $scope.griduseredit = true;
                        $scope.grideditable = true;
                        $routeParams.GroupId = data.ApplicationId;
                        $scope.MaxVersion = data.Version;
                        $scope.sheetholdedby = '';
                        $scope.$broadcast('timer-reset');
                        $scope.$broadcast('timer-start');
                        $scope.CurrentAdditionalGrid = data.NumberOfApplication;

                        $scope.CurrentAdditionalGrid = data.NumberOfApplication;
                    }
                    else {
                        $scope.grideditable = false;
                        $scope.hasedit = true;
                        $scope.griduseredit = false;
                        // $scope.sheetholdedby = data.LockedUser;
                        $scope.sheetholdedby = "LockedIn: " + data.LockedIn + " By " + data.LockedUser;
                    }
                }

                //if ($scope.MaxSheetGroupID != 'undefined' && $scope.MaxSheetGroupID != 'null' && $scope.MaxSheetGroupID != '') {
                getservicedata();
                //}

                $timeout(function () {
                    angular.element(document.querySelector('#loader')).addClass('hide');
                }, 500);

            }).error(function (error) {

                $scope.Error = error;
            })

        }).error(function (error) {
            $scope.Error = error;
        })

    }


    function getservicedata() {
        $scope.data = [];
        $scope.data1 = [];
        $scope.data2 = [];
        $scope.data3 = [];
        $scope.data4 = [];
        $scope.data5 = [];
        $scope.data6 = [];
        $scope.data7 = [];
        $scope.data8 = [];
        $scope.data9 = [];
        $scope.data10 = [];
        $scope.data11 = [];
        $scope.data12 = [];
        $scope.data13 = [];

        if ($routeParams.GroupId != 'undefined') {
            EstimationAdminReportsMasterService.GetAllEstimationAdminReportsbyOppGroupID($scope.OpportunityDetail.OppId, $scope.MaxSheetGroupID).success(function (data) {
                if (data.Error == null) {
                    $scope.addFreshrows(data);
                }
            });
        }
    }

    //EXSISTING


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

        for (var j = 0; j < $scope.collectionlist.length; j++) {
            eval('var ' + $scope.collectionlist[j] + '= document.createElement("select");');
            var rs = _.where($scope.selectionlist, { Key: $scope.collectionlist[j] });
            if (rs.length > 0) {
                var loopdata = (rs[0].Selection).split(',');
                loopdata.forEach(function (item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item);
                    eOption.innerHTML = item;
                    eval($scope.collectionlist[j] + '.appendChild(eOption);');
                });
            }
        }


        var eInput = document.createElement('input');
        eInput.type = 'text';
        for (var j = 0; j < $scope.collectionlist.length; j++) {
            eval($scope.collectionlist[j] + '.value = params.value;')
            eval($scope.collectionlist[j] + '.value = params.value;')


            eval($scope.collectionlist[j] + '.addEventListener("blur", function () { if (editing) { editing = false;      eCell.removeChild(' + $scope.collectionlist[j] + '); eCell.appendChild(eLabel);  } });');
            eval($scope.collectionlist[j] + '.addEventListener("change", function () {    if (editing) { editing = false; var newValue = ' + $scope.collectionlist[j] + '.value; eLabel.nodeValue = newValue;             eCell.removeChild(' + $scope.collectionlist[j] + ');  eCell.appendChild(eLabel);   params.data[params.colDef.field] = newValue.toString();    $scope.onRefreshAll(params); onFloatingBottomCount(); } });')

        }

        params.eGridCell.addEventListener('click', function () {
            if ($scope.griduseredit) {
                var str = params.colDef.field;
                // var n = str.includes("F");
                if (!editing) { //&& !n) {
                    eInput.value = eLabel.data;
                    eInput.type = 'number';
                    if (params.data[(params.colDef.field).slice(2)] == 'Text') {
                        eCell.removeChild(eLabel);
                        eInput.className = 'ag-cell-edit-input';
                        eInput.style.width = (params.eGridCell.clientWidth - 10) + "px";
                        eCell.appendChild(eInput);
                        eInput.focus();
                        editing = true;
                    }
                    else if (params.data[(params.colDef.field).slice(2)] != 'None') {
                        eCell.removeChild(eLabel);
                        eval('eCell.appendChild(' + params.data[(params.colDef.field).slice(2)] + ')');
                        eval(params.data[(params.colDef.field).slice(2)] + '.focus();');
                        editing = true;
                    }

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
                newValue = '0';
            }
            eLabel.data = newValue;
            params.data[params.colDef.field] = newValue.toString();

            eCell.removeChild(eInput);
            eCell.appendChild(eLabel);
            $scope.onRefreshAll(params);
            onFloatingBottomCount();
        };

        eInput.addEventListener("blur", blurListenerfn);


        return eCell;

    }

    function gettype(params) {
        if (params == "Text") {
            return '0';
        }
        else if (params == "None") {
            return '--';
        }

        else {
            return '--Select--';
        }


    }
    function getvalueforresultcol(val) {

        if (val == null || val == 'null' || val == undefined || val == 'undefined' || val == '') {
            return '0';
        }
        else if (isNaN(val))
            return '0';
        else
            return val;
    }

    $scope.Addrow = function (GroupEditor, rowid) {
        var localJson = {};
        localJson = angular.copy(GroupEditor);
        localJson['A1col1'] = gettype(GroupEditor.col1);
        localJson['A1col2'] = gettype(GroupEditor.col2);
        localJson['A1Fcol3'] = getvalueforresultcol(GroupEditor.col3);
        //localJson.vcol4 = gettype(GroupEditor.col4);

        if (GroupEditor.GroupType == 'AdminApplication') {
            $scope.data.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'DeliveryPackages') {
            $scope.data1.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'Reports') {
            $scope.data2.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 0) {
            $scope.data3.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 1) {
            $scope.data4.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 2) {
            $scope.data5.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 3) {
            $scope.data6.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 4) {
            $scope.data7.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 5) {
            $scope.data8.splice(rowid, 0, localJson);
        }

        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 6) {
            $scope.data9.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 7) {
            $scope.data10.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 8) {
            $scope.data11.splice(rowid, 0, localJson);
        }
        else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 9) {
            $scope.data12.splice(rowid, 0, localJson);
        }


        else if (GroupEditor.GroupType == 'Others') {
            $scope.data13.splice(rowid, 0, localJson);
        }

        localJson = {};

    }


    function gettypebsedfill(params) {
        angular.forEach(params, function (val, key) {
            var localJson = {};
            localJson = val;
            localJson['A1col1'] = gettype(val.col1);
            localJson['A1col2'] = gettype(val.col2);
            localJson['A1Fcol3'] = gettype(val.A1Fcol3);

            if (GroupEditor.GroupType == 'AdminApplication') {
                $scope.data.push(localJson);
            }
            else if (GroupEditor.GroupType == 'DeliveryPackages') {
                $scope.data1.push(localJson);
            }
            else if (GroupEditor.GroupType == 'Reports') {
                $scope.data2.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 0) {
                $scope.data3.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 1) {
                $scope.data4.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 2) {
                $scope.data5.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 3) {
                $scope.data6.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 4) {
                $scope.data7.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 5) {
                $scope.data8.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 6) {
                $scope.data9.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 7) {
                $scope.data10.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 8) {
                $scope.data11.push(localJson);
            }
            else if (GroupEditor.GroupType == 'ReportSection' && parseInt(GroupEditor.InternalGroupId) == 9) {
                $scope.data12.push(localJson);
            }

            else if (GroupEditor.GroupType == 'Others') {
                $scope.data13.push(localJson);
            }

            localJson = {};
        });
    }




    var columnDefs1 = [
        {
            headerName: "", hide: true, field: "OppId", width: 1
        },
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
            headerName: "", hide: true, field: 'GroupType', width: 1,
        },
        {
            headerName: "", hide: true, field: "RowId", width: 1
        },
        { headerName: "Admin Application", field: "Name", width: 520 },
        { headerName: "", field: "A1col1", width: 60, cellRenderer: NonPercentTypeEditor },
        { headerName: "", field: "A1col2", width: 60, cellRenderer: NonPercentTypeEditor },
        {
            headerName: "Hours", field: "A1Fcol3", width: 60, cellRenderer: function (params) {
                if (params.value > 0) {
                    return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                }
                else {
                    return params.value;
                }
            },
        },
    ];


    $scope.gridOptionsTop = {
        rowSelection: 'single',

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
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };

    $scope.gridOptionsBottom4 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data4,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };


    $scope.gridOptionsBottom5 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data5,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };



    $scope.gridOptionsBottom6 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data6,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };


    $scope.gridOptionsBottom7 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data7,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };


    $scope.gridOptionsBottom8 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data8,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };

    $scope.gridOptionsBottom9 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data9,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };
    $scope.gridOptionsBottom10 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data10,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };
    $scope.gridOptionsBottom11 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data11,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };
    $scope.gridOptionsBottom12 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data12,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };
    $scope.gridOptionsBottom13 = {
        angularCompileRows: true,
        singleClickEdit: true,
        columnDefs: [],
        groupHeaders: true,
        rowData: $scope.data13,
        enableColResize: true,
        debug: true,
        slaveGrids: [],
        floatingBottomRowData: [],
        onGridReady: function (event) {
            if ($scope.data.length > 0)
                onFloatingBottomCount();
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };



    function onFloatingBottomCount() {
        var count = Number(1);
        var rows = calculateFinalTotal(count, 'Bottom');
        $scope.gridOptionsBottom13.api.setFloatingBottomRowData(rows);
    }


    function calculateFinalTotal() {
        var result = [];

        $scope.AdminApplication = {};
        $scope.DeliveryPackages = {};
        $scope.Reports = {};
        $scope.ReportSection1 = {};
        $scope.ReportSection2 = {};
        $scope.ReportSection3 = {};
        $scope.ReportSection4 = {};
        $scope.ReportSection5 = {};
        $scope.ReportSection6 = {};
        $scope.ReportSection7 = {};
        $scope.ReportSection8 = {};
        $scope.ReportSection9 = {};
        $scope.ReportSection10 = {};
        $scope.ReportSection = {};
        $scope.Others = {};


        $scope.AdminApplication = { Section: 'ADMIN', A1Fcol3: 0 };

        for (var i = 0; i < $scope.data.length; i++) {
            try {
                if ($scope.data[i].A1Fcol3 != '--' && $scope.data[i].A1Fcol3 != '' && !isNaN($scope.data[i].A1Fcol3))
                    $scope.AdminApplication.A1Fcol3 += parseFloat($scope.data[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }

        $scope.DeliveryPackages = { Section: 'PACKAGE', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data1.length; i++) {
            try {
                if ($scope.data1[i].A1Fcol3 != '--' && $scope.data1[i].A1Fcol3 != '' && !isNaN($scope.data1[i].A1Fcol3))
                    $scope.DeliveryPackages.A1Fcol3 += parseFloat($scope.data1[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }

        $scope.Reports = { Section: 'Reports', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data2.length; i++) {
            try {
                if ($scope.data2[i].A1Fcol3 != '--' && $scope.data2[i].A1Fcol3 != '' && !isNaN($scope.data2[i].A1Fcol3) && $scope.data2[i].A1Fcol3 != null)
                    $scope.Reports.A1Fcol3 += parseFloat($scope.data2[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }

        $scope.ReportSection1 = { Section: 'ReportSection1', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data3.length; i++) {
            try {
                if ($scope.data3[i].A1Fcol3 != '--' && $scope.data3[i].A1Fcol3 != '' && !isNaN($scope.data3[i].A1Fcol3) && $scope.data3[i].A1Fcol3 != null)
                    $scope.ReportSection1.A1Fcol3 += parseFloat($scope.data3[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }



        $scope.ReportSection2 = { Section: 'ReportSection2', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data4.length; i++) {
            try {
                if ($scope.data4[i].A1Fcol3 != '--' && $scope.data4[i].A1Fcol3 != '' && !isNaN($scope.data4[i].A1Fcol3) && $scope.data4[i].A1Fcol3 != null)
                    $scope.ReportSection2.A1Fcol3 += parseFloat($scope.data4[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }

        $scope.ReportSection3 = { Section: 'ReportSection3', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data5.length; i++) {
            try {
                if ($scope.data5[i].A1Fcol3 != '--' && $scope.data5[i].A1Fcol3 != '' && !isNaN($scope.data5[i].A1Fcol3) && $scope.data5[i].A1Fcol3 != null)
                    $scope.ReportSection3.A1Fcol3 += parseFloat($scope.data5[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }

        $scope.ReportSection4 = { Section: 'ReportSection4', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data6.length; i++) {
            try {
                if ($scope.data6[i].A1Fcol3 != '--' && $scope.data6[i].A1Fcol3 != '' && !isNaN($scope.data6[i].A1Fcol3) && $scope.data6[i].A1Fcol3 != null)
                    $scope.ReportSection4.A1Fcol3 += parseFloat($scope.data6[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }
        $scope.ReportSection5 = { Section: 'ReportSection5', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data7.length; i++) {
            try {
                if ($scope.data7[i].A1Fcol3 != '--' && $scope.data7[i].A1Fcol3 != '' && !isNaN($scope.data7[i].A1Fcol3) && $scope.data7[i].A1Fcol3 != null)
                    $scope.ReportSection5.A1Fcol3 += parseFloat($scope.data7[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }
        $scope.ReportSection6 = { Section: 'Others', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data8.length; i++) {
            try {
                if ($scope.data8[i].A1Fcol3 != '--' && $scope.data8[i].A1Fcol3 != '' && !isNaN($scope.data8[i].A1Fcol3) && $scope.data8[i].A1Fcol3 != null)
                    $scope.ReportSection6.A1Fcol3 += parseFloat($scope.data8[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }
        $scope.ReportSection7 = { Section: 'ReportSection7', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data9.length; i++) {
            try {
                if ($scope.data9[i].A1Fcol3 != '--' && $scope.data9[i].A1Fcol3 != '' && !isNaN($scope.data9[i].A1Fcol3) && $scope.data9[i].A1Fcol3 != null)
                    $scope.ReportSection7.A1Fcol3 += parseFloat($scope.data9[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }
        $scope.ReportSection8 = { Section: 'Others', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data10.length; i++) {
            try {
                if ($scope.data10[i].A1Fcol3 != '--' && $scope.data10[i].A1Fcol3 != '' && !isNaN($scope.data10[i].A1Fcol3))
                    $scope.ReportSection8.A1Fcol3 += parseFloat($scope.data10[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }
        $scope.ReportSection9 = { Section: 'ReportSection9', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data11.length; i++) {
            try {
                if ($scope.data11[i].A1Fcol3 != '--' && $scope.data11[i].A1Fcol3 != '' && !isNaN($scope.data11[i].A1Fcol3))
                    $scope.ReportSection9.A1Fcol3 += parseFloat($scope.data11[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }
        $scope.ReportSection10 = { Section: 'ReportSection10', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data12.length; i++) {
            try {
                if ($scope.data12[i].A1Fcol3 != '--' && $scope.data12[i].A1Fcol3 != '' && !isNaN($scope.data12[i].A1Fcol3))
                    $scope.ReportSection10.A1Fcol3 += parseFloat($scope.data12[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }

        $scope.ReportSection = { Section: 'ReportSection', A1Fcol3: parseFloat($scope.ReportSection1.A1Fcol3) + parseFloat($scope.ReportSection2.A1Fcol3) + parseFloat($scope.ReportSection3.A1Fcol3) + parseFloat($scope.ReportSection4.A1Fcol3) + parseFloat($scope.ReportSection5.A1Fcol3) + parseFloat($scope.ReportSection6.A1Fcol3) + parseFloat($scope.ReportSection7.A1Fcol3) + parseFloat($scope.ReportSection8.A1Fcol3) + parseFloat($scope.ReportSection9.A1Fcol3) + parseFloat($scope.ReportSection10.A1Fcol3) };

        $scope.Others = { Section: 'Others', A1Fcol3: 0 };
        for (var i = 0; i < $scope.data13.length; i++) {
            try {
                if ($scope.data13[i].A1Fcol3 != '--' && $scope.data13[i].A1Fcol3 != '' && !isNaN($scope.data13[i].A1Fcol3))
                    $scope.Others.A1Fcol3 += parseFloat($scope.data13[i].A1Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }



        var data = $scope.data.concat($scope.data1).concat($scope.data2).concat($scope.data3).concat($scope.data4).concat($scope.data5).concat($scope.data6).concat($scope.data7).concat($scope.data8).concat($scope.data9).concat($scope.data10).concat($scope.data11).concat($scope.data12).concat($scope.data13);

        var caljson = { A1Fcol3: 0 };
        for (var i = 0; i < data.length; i++) {
            try {
                if (data[i].A1Fcol3 != '--' && data[i].A1Fcol3 != '' && !isNaN(data[i].A1Fcol3))
                    caljson.A1Fcol3 += parseFloat(data[i].A1Fcol3);

            }
            catch (e) {
                alert(e);
            }
        }

        $scope.result1 = [];

        $scope.result1.push(
            $scope.AdminApplication,
            $scope.DeliveryPackages,
            $scope.Reports,
            $scope.ReportSection1,
            $scope.ReportSection2,
            $scope.ReportSection3,
            $scope.ReportSection4,
            $scope.ReportSection5,
            $scope.ReportSection6,
            $scope.ReportSection7,
            $scope.ReportSection8,
            $scope.ReportSection9,
            $scope.ReportSection10,
            $scope.Others);


        result.push({
            Section: 'Total', Name: 'Total Estimated Hours', A1col1: '', A1col2: '', A1Fcol3: caljson.A1Fcol3
        });

        $scope.Totalresult = result;

        return result;
    }

    $scope.collectionlist = [];

    $scope.GetAllSelection = function () {
        SelectionService.GetAllSelection().success(function (data) {
            $scope.selectionlist = data;
            for (var i = 0; i < data.length; i++) {
                $scope.collectionlist.push(data[i].Key);
                $scope[data[i].Key] = (data[i].Selection).split(',');
            }


            callbackgrid();

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.onLoad = function () {

        $scope.GetAllSelection();
    }


    function callbackgrid() {
        columnDefs1[6].headerName = 'Admin Application';
        var local0 = angular.copy(columnDefs1);
        $scope.gridOptionsTop.api.setColumnDefs(local0);



        columnDefs1[6].headerName = 'Delivery Packages';
        var local1 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom1.api.setColumnDefs(local1);

        columnDefs1[6].headerName = 'Reports';
        var local2 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom2.api.setColumnDefs(local2);
        columnDefs1[6].headerName = 'Reports - Number of Sections: 1';
        var local3 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom3.api.setColumnDefs(local3);



        columnDefs1[6].headerName = 'Reports - Number of Sections: 2';
        var local4 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom4.api.setColumnDefs(local4);


        columnDefs1[6].headerName = 'Reports - Number of Sections: 3';
        var local4 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom5.api.setColumnDefs(local4);



        columnDefs1[6].headerName = 'Reports - Number of Sections: 4';
        var local5 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom6.api.setColumnDefs(local5);



        columnDefs1[6].headerName = 'Reports - Number of Sections: 5';
        var local6 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom7.api.setColumnDefs(local6);



        columnDefs1[6].headerName = 'Reports - Number of Sections: 6';
        var local7 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom8.api.setColumnDefs(local7);


        columnDefs1[6].headerName = 'Reports - Number of Sections: 7';
        var local8 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom9.api.setColumnDefs(local8);


        columnDefs1[6].headerName = 'Reports - Number of Sections: 8';
        var local9 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom10.api.setColumnDefs(local9);


        columnDefs1[6].headerName = 'Reports - Number of Sections: 9';
        var local10 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom11.api.setColumnDefs(local10);

        columnDefs1[6].headerName = 'Reports - Number of Sections: 10';
        var local11 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom12.api.setColumnDefs(local11);


        columnDefs1[6].headerName = 'Others';
        var local12 = angular.copy(columnDefs1);
        $scope.gridOptionsBottom13.api.setColumnDefs(local12);





        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsTop.slaveGrids.push($scope.gridOptionsBottom13);

        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom1.slaveGrids.push($scope.gridOptionsBottom13);


        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom2.slaveGrids.push($scope.gridOptionsBottom13);






        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom3.slaveGrids.push($scope.gridOptionsBottom13);



        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom4.slaveGrids.push($scope.gridOptionsBottom13);



        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom5.slaveGrids.push($scope.gridOptionsBottom13);



        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom6.slaveGrids.push($scope.gridOptionsBottom13);



        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom7.slaveGrids.push($scope.gridOptionsBottom13);


        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom8.slaveGrids.push($scope.gridOptionsBottom13);


        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom9.slaveGrids.push($scope.gridOptionsBottom13);


        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom10.slaveGrids.push($scope.gridOptionsBottom13);


        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom11.slaveGrids.push($scope.gridOptionsBottom13);



        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsTop);
        $scope.gridOptionsBottom12.slaveGrids.push($scope.gridOptionsBottom13);


        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom1);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom2);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom3);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom4);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom5);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom6);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom7);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom8);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom9);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom10);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom11);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsBottom12);
        $scope.gridOptionsBottom13.slaveGrids.push($scope.gridOptionsTop);






    }

    $scope.onLoad();

    $scope.addFreshrows = function (data) {

        var result1 = _.filter(data, function (obj) {
            return obj.GroupType == "AdminApplication";
        })
        if (result1.length > 0) {
            var i = 0;
            _.each(result1, function (obj) {
                if (obj.A1col1 == null && obj.A1col2 == null && obj.A1Fcol3 == null)
                    $scope.Addrow(obj, i);
                else
                    $scope.data.splice(i, 0, obj);
                i++;
            })
        }

        var result2 = _.filter(data, function (obj) {
            return obj.GroupType == "DeliveryPackages";
        })
        if (result2.length > 0) {
            var i = 0;

            _.each(result2, function (obj) {

                if (obj.A1col1 == null && obj.A1col2 == null && obj.A1Fcol3 == null)
                    $scope.Addrow(obj, i);
                else
                    $scope.data1.splice(i, 0, obj);

                i++;
            })
        }


        var result3 = _.filter(data, function (obj) {
            return obj.GroupType == "Reports";
        })
        if (result3.length > 0) {
            var i = 0;
            _.each(result3, function (obj) {

                if (obj.A1col1 == null && obj.A1col2 == null && obj.A1Fcol3 == null)
                    $scope.Addrow(obj, i);
                else
                    $scope.data2.splice(i, 0, obj);


                i++;
            })
        }



        var result5 = _.filter(data, function (obj) {
            return obj.GroupType == "ReportSection";
        })
        if (result5.length > 0) {
            var i = 0;
            if (result5[0].InternalGroupId == null) {
                for (var j = 0; j < 10; j++) {

                    for (k = 0; k < result5.length; k++) {
                        result5[k].InternalGroupId = j;
                        //if (result5[k].A1col1 == null && result5[k].A1col2 == null && result5[k].A1Fcol3 == null)
                        $scope.Addrow(result5[k], k);
                    }
                }
            }
            else {
                _.each(result5, function (obj) {
                    // if (obj.A1col1 != null && obj.A1col2 != null && obj.A1Fcol3 != null) {
                    if (parseInt(obj.InternalGroupId) == 0)
                        $scope.data3.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 1)
                        $scope.data4.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 2)
                        $scope.data5.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 3)
                        $scope.data6.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 4)
                        $scope.data7.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 5)
                        $scope.data8.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 6)
                        $scope.data9.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 7)
                        $scope.data10.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 8)
                        $scope.data11.splice(i, 0, obj);
                    else if (parseInt(obj.InternalGroupId) == 9)
                        $scope.data12.splice(i, 0, obj);

                    // }
                    i++;
                })
            }
        }



        var result10 = _.filter(data, function (obj) {
            return obj.GroupType == "Others";
        })
        if (result10.length > 0) {
            var i = 0;
            _.each(result10, function (obj) {
                if (obj.A1col1 == null && obj.A1col2 == null && obj.A1Fcol3 == null)
                    $scope.Addrow(obj, i);
                else
                    $scope.data13.splice(i, 0, obj);
                i++;
            })
        }



        setrowdatacall();
        $scope.rerenderwholepage();

        if ($scope.CurrentVersiondata.IsInitial) {

            for (var l = 2; l < $scope.CurrentAdditionalGrid; l++) {
                $scope['grid' + l + 'enable'] = true;
            }


            $scope.forceupdate = true;

            $scope.AddEstimationApplication(true)

        }

    }

    $scope.internalvariable = true;
    $scope.rerenderwholepage = function () {
        $scope.internalvariable = false;

        angular.element(document.querySelector('#loader')).removeClass('hide');
        $scope.gridOptionsTop.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        $scope.gridOptionsBottom1.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });
        $scope.gridOptionsBottom2.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });
        $scope.gridOptionsBottom3.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });
        $scope.gridOptionsBottom4.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });


        $scope.gridOptionsBottom5.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });
        $scope.gridOptionsBottom6.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });
        $scope.gridOptionsBottom7.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        $scope.gridOptionsBottom8.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        $scope.gridOptionsBottom9.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        $scope.gridOptionsBottom10.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        $scope.gridOptionsBottom11.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        $scope.gridOptionsBottom12.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        $scope.gridOptionsBottom13.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });

        hardrefreshgrid();

        $timeout(function () {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 1000);
        $scope.internalvariable = true;
    }








    function setrowdatacall() {
        $scope.gridOptionsTop.api.setRowData($scope.data);
        $scope.gridOptionsBottom1.api.setRowData($scope.data1);
        $scope.gridOptionsBottom2.api.setRowData($scope.data2);
        $scope.gridOptionsBottom3.api.setRowData($scope.data3);
        $scope.gridOptionsBottom4.api.setRowData($scope.data4);
        $scope.gridOptionsBottom5.api.setRowData($scope.data5);
        $scope.gridOptionsBottom6.api.setRowData($scope.data6);
        $scope.gridOptionsBottom7.api.setRowData($scope.data7);
        $scope.gridOptionsBottom8.api.setRowData($scope.data8);
        $scope.gridOptionsBottom9.api.setRowData($scope.data9);
        $scope.gridOptionsBottom10.api.setRowData($scope.data10);
        $scope.gridOptionsBottom11.api.setRowData($scope.data11);
        $scope.gridOptionsBottom12.api.setRowData($scope.data12);
        $scope.gridOptionsBottom13.api.setRowData($scope.data13);
        onFloatingBottomCount();

    }

    $scope.TakeScreenshot = function (discard) {
        // html2canvas(document.getElementsByClassName("gridarea")[0], {
        //     onrendered: function (canvas) {
        //         $scope.content = canvas.toDataURL();
        $scope.content = "";
        callbacksave(discard);
        //     }
        // });
    }
    $scope.onRefreshAll = function (params) {
        try {
            if (params.data.IsHeader != 'Y') {
                if (params.data.GroupType == 'ReportSection') {
                    $scope.currentrow = parseInt(params.data.InternalGroupId);
                }


                if (params.data.Fcol3 != undefined && params.data.Fcol3 != null && params.data.Fcol3 != '') {

                    try {
                        $scope.currentGridnum = 1;
                        var formula = RunthroughFormula(params.data.Fcol3, 1);
                        params.data['A1Fcol3'] = eval(formula);
                        if (!isNaN(params.data['A1Fcol3']))
                            params.data['A1Fcol3'] = (params.data['A1Fcol3']).toString();
                        else {
                            params.data['A' + i + 'Fcol3'] = '0';
                        }
                    }
                    catch (e)
                    { toaster.pop('error', "Error", "Error in Master sheet formula Row No :" + params.data.RowId + " Error :" + e, null); }

                }
                else {
                    params.data['A1Fcol3'] = '0';
                }
                if ($scope.internalvariable) {
                    hardrefreshgrid();
                    $timeout(function () {
                        $scope.rerenderwholepage();
                    }, 100);
                }
            }
        }
        catch (ex) {
            alert(ex);
        }
    }



    function getcelldata(rownum, colname) {
        try {
            var completedata = $scope.data.concat($scope.data1).concat($scope.data2).concat($scope.data3).concat($scope.data4).concat($scope.data5).concat($scope.data6).concat($scope.data7).concat($scope.data8).concat($scope.data9).concat($scope.data10).concat($scope.data11).concat($scope.data12).concat($scope.data13);

            var resultset = _.filter(completedata, function (obj) {
                return obj.RowId == rownum;
            })

            if (resultset.length > 0) {
                if (resultset.length == 1)
                    return parseFloat(resultset[0][colname]);
                else {
                    return parseFloat(resultset[$scope.currentrow][colname]);
                }
            }
            else
                return 0
        }
        catch (ex) {
            alert(ex);
            return 0;
        }
    }
    function hardrefreshgrid() {
        $scope.gridOptionsTop.api.refreshView();
        $scope.gridOptionsBottom1.api.refreshView();
        $scope.gridOptionsBottom2.api.refreshView();
        $scope.gridOptionsBottom3.api.refreshView();
        $scope.gridOptionsBottom4.api.refreshView();
        $scope.gridOptionsBottom5.api.refreshView();
        $scope.gridOptionsBottom6.api.refreshView();
        $scope.gridOptionsBottom7.api.refreshView();
        $scope.gridOptionsBottom8.api.refreshView();
        $scope.gridOptionsBottom9.api.refreshView();

        $scope.gridOptionsBottom10.api.refreshView();
        $scope.gridOptionsBottom11.api.refreshView();
        $scope.gridOptionsBottom12.api.refreshView();
        $scope.gridOptionsBottom13.api.refreshView();

    }

    function RunthroughFormula(params, count) {
        var replacename = 'A' + count;
        var res = params.replace(/col1/g, (replacename + "col1"));
        res = res.replace(/col2/g, (replacename + "col2"));
        res = res.replace(/Fcol3/g, (replacename + "Fcol3"));
        return res;
    }

    $scope.CurrentAdditionalGrid = 2;

    //add additional grid existing
    function addgrid(val) {
        for (var i = 2; i <= val; i++) {
            $scope['grid' + i + 'enable'] = true;
        }
    }

    //add additional grid fresh
    $scope.addadditional = function (type) {
        if ($scope.CurrentAdditionalGrid <= 11) {
            $scope.CurrentAdditionalGrid++;
            $scope['grid' + $scope.CurrentAdditionalGrid + 'enable'] = true;
        }
    }

    $scope.Removeadditional = function () {
        if ($scope.CurrentAdditionalGrid > 2) {

            $scope['grid' + $scope.CurrentAdditionalGrid + 'enable'] = false;
            if ($scope.CurrentAdditionalGrid == 3) {
                _.each($scope.data4, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom4.api.setRowData($scope.data4);

            }
            else if ($scope.CurrentAdditionalGrid == 4) {
                _.each($scope.data5, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom5.api.setRowData($scope.data5);

            }
            else if ($scope.CurrentAdditionalGrid == 5) {
                _.each($scope.data6, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom6.api.setRowData($scope.data6);

            }
            else if ($scope.CurrentAdditionalGrid == 6) {
                _.each($scope.data7, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom7.api.setRowData($scope.data7);

            }
            else if ($scope.CurrentAdditionalGrid == 7) {
                _.each($scope.data8, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom8.api.setRowData($scope.data8);

            }

            else if ($scope.CurrentAdditionalGrid == 8) {
                _.each($scope.data9, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom9.api.setRowData($scope.data9);

            }


            else if ($scope.CurrentAdditionalGrid == 9) {
                _.each($scope.data10, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom10.api.setRowData($scope.data10);

            }

            else if ($scope.CurrentAdditionalGrid == 10) {
                _.each($scope.data11, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom11.api.setRowData($scope.data11);

            }

            else if ($scope.CurrentAdditionalGrid == 11) {
                _.each($scope.data12, function (obj) {
                    obj.A1col1 = '0';
                    obj.A1col2 = '0';
                    obj.A1Fcol3 = '0';
                })
                $scope.gridOptionsBottom12.api.setRowData($scope.data12);
            }

            $scope.CurrentAdditionalGrid--;

        }
    }
    function callbacksave(isdiscard) {
        $scope.rerenderwholepage();
        onFloatingBottomCount();
        var data = $scope.data.concat($scope.data1).concat($scope.data2).concat($scope.data3).concat($scope.data4).concat($scope.data5).concat($scope.data6).concat($scope.data7).concat($scope.data8).concat($scope.data9).concat($scope.data10).concat($scope.data11).concat($scope.data12).concat($scope.data13);

        for (var j = 0; j < data.length; j++) {
            try {
                delete data[j].Id
                data[j].OppId = $scope.OpportunityDetail.OppId;
                data[j].GroupId = $scope.MaxSheetGroupID;
            }
            catch (ex) {
                alert(ex);
            }
        }

        var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, AdminReportsSheet: data, Authour: $rootScope.UserInfo.user.userId, NumberofApp: $scope.CurrentAdditionalGrid, Content: $scope.content };

        if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null') {
            Jsondata.Version = 'Ver_0.1';
            Jsondata.Comment = 'Initial';
            $routeParams.GroupId = $scope.MaxSheetGroupID;
            AddSheetInternalcall(Jsondata);
        }
        else {
            AddSheetInternalcall(Jsondata);
        }


        $('#showSavemodel').modal('hide');
    }


    /* add function*/
    $scope.AddEstimationApplication = function (isdiscard) {
        $scope.TakeScreenshot(isdiscard);


    }

    function AddSheetInternalcall(Jsondata) {
        EstimationAdminReportsMasterService.AddEstimationAdminReports(Jsondata).success(function (data) {
            $scope.CurrentVersiondata.IsInitial = false;
            if (data.Error == '' || data.Error == undefined || data.Error == null) {
                var newdata = $scope.Totalresult.concat($scope.result1);
                var IPdata = { OppId: $scope.OpportunityDetail.OppId, ProductName: 'ADMIN', ApplicationId: $scope.MaxSheetGroupID, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: newdata, RootId: $routeParams.OppId };
                EstimationApplicationMasterService.dointernalpercentagecalculationForAdminReport(IPdata).success(function (data) {
                    $scope.griduseredit = false;
                    $scope.hasedit = true;
                    $scope.grideditable = false;
                    $scope.onLoad();

                    if ($scope.Isleaving)
                        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                    else {

                        $window.location.href = $scope.newnavigateURl;
                    }
                    if (!$scope.forceupdate)
                        toaster.pop('success', "SAVE", 'AdminReports Sheet Saved Successfully', 3000);
                    return true;

                }).error(function (error) {
                    alert("failure message: " + JSON.stringify(error));
                });
            }
            else {

                toaster.pop('error', "Error", data.Error, null);
            }

        }).error(function (error) {
            alert("failure message: " + JSON.stringify(error));
        });
    }


    //updating appsheet to new version
    $scope.UpdatePriceSheetVersion = function () {
        //have to work here
        if ($routeParams.GroupId == 'undefined') {
            toaster.pop('warning', "Warning", "Minimum one version required to Save As", 3000);
        }
        else {
            EstimationApplicationMasterService.GetMaximumGroupEstimationApplicationId().success(function (data) {
                if (data[0].count == null) {
                    $scope.MaxSheetGroupIDForSaveAs = 1;
                }
                else {
                    $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
                }
                var data = $scope.data.concat($scope.data1).concat($scope.data2).concat($scope.data3).concat($scope.data4).concat($scope.data5).concat($scope.data6).concat($scope.data7).concat($scope.data8).concat($scope.data9).concat($scope.data10).concat($scope.data11).concat($scope.data12).concat($scope.data13);

                for (var j = 0; j < data.length; j++) {
                    try {
                        delete data[j].Id
                        data[j].OppId = $scope.OpportunityDetail.OppId;
                        data[j].GroupId = $scope.MaxSheetGroupIDForSaveAs;
                    }
                    catch (ex) {
                        alert(ex);
                    }
                }

                var maxid = _.max($scope.Versiondata, function (maxdata) { return parseFloat(maxdata.ApplicationId); });

                var currentversion = maxid.Version.split('_')[1];
                var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
                var version = 'Ver_' + i;

                $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;

                var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, ApplicationId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable, AdminReportsSheet: data, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
                Jsondata.Version = version;
                Jsondata.NumberofApp = $scope.CurrentAdditionalGrid
                EstimationAdminReportsMasterService.AddEstimationAdminReports(Jsondata).success(function (data) {
                    if (data.Error == '' || data.Error == undefined || data.Error == null) {
                        var newdata = $scope.Totalresult.concat($scope.result1);
                        var IPdata = { OppId: $scope.OpportunityDetail.OppId, ProductName: 'ADMIN', ApplicationId: $scope.MaxSheetGroupIDForSaveAs, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: newdata, RootId: $routeParams.OppId };
                        EstimationApplicationMasterService.dointernalpercentagecalculationForAdminReport(IPdata).success(function (data) {

                            $scope.griduseredit = false;
                            redirectRefreshPage($routeParams.OppId, $routeParams.GroupId);
                        }).error(function (error) {
                            alert("failure message: " + JSON.stringify(error));
                        });
                    }
                    else {
                        toaster.pop('error', "Error", data.Error, 3000);
                    }
                }).error(function (error) {
                    alert("failure message: " + JSON.stringify(error));
                });
            });


            $('#showsaveAsmodel').modal('hide');
        }
    }
    //Popup areas


    //pop up data 

    $scope.closepopup = function () {
        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
    }

    $scope.finished = function () {
        $('#showmod').modal('show');
    }

    $scope.AddPriceSheetpop = function () {
        $('#showSavemodel').modal('show');
    }

    $scope.CancelPriceSheet = function () {
        $('#showSavemodel').modal('hide');
    }

    $scope.saveasPriceSheetpop = function () {
        if ($routeParams.GroupId == 'undefined') {
            toaster.pop('warning', "Warning", "Minimum one version required to Save As", 3000);
        }
        else {
            $('#showsaveAsmodel').modal('show');
        }
    }

    $scope.CancelPriceSheetsaveas = function () {
        $('#showsaveAsmodel').modal('hide');
    }

    //pop up data 

    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.griduseredit) {
            $('#showSaveChangesmodel').modal('show');
            event.preventDefault();
        }
    });

    $scope.Isleaving = true;

    $scope.saveasPriceSheetdiscard = function () {
        $scope.Isleaving = false;
        $scope.AddEstimationApplication(true)
        $('#showSaveChangesmodel').modal('hide');
    }


    $scope.CancelPriceSheetdiscard = function () {
        $scope.griduseredit = false;
        $scope.Isleaving = false;
        $scope.IgnoreChanges();
        $('#showSaveChangesmodel').modal('hide');
        //var url = $scope.newnavigateURl.split('#');
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.ClosePriceSheetdiscard = function () {

        $('#showSaveChangesmodel').modal('hide');
    }


    $scope.dynamicPopover = {
        templateUrl: 'myPopoverTemplate.html',
    };


    function redirectRefreshPage(oppId, groupId) {
        $location.path("adminreports/" + oppId + "/" + groupId);
    }


    $scope.IncreaseAdditionalTimeToSheet = function () {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'AdminReportsSheet' };
        EstimationAdminReportsMasterService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
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

        }).error(function (error) {

            $scope.Error = error;
        })
    }

    //full screen in browser
    $scope.DefautState = false;

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
        // $timeout(function () {
        //     $scope.gridOptionsTop.api.sizeColumnsToFit();
        //     $scope.gridOptionsBottom1.api.sizeColumnsToFit();
        //     $scope.gridOptionsBottom2.api.sizeColumnsToFit();
        //     $scope.gridOptionsBottom3.api.sizeColumnsToFit();
        // }, 500);


    }


    $scope.IgnoreChanges = function () {
        EstimationAdminReportsMasterService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function (data) {
            //alert(data)
            $scope.hasedit = true;
            $scope.griduseredit = false;

            $scope.grideditable = false;
            if ($scope.Isleaving) {
                // redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)

                if ($scope.Versiondata.length == 0 && $scope.MaxVersion == 'Ver_0.1') {
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                }
                else
                    $route.reload();
            }


        }).error(function (error) {

            $scope.Error = error;
        })
    }

});



