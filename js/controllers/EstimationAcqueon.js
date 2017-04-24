ReportApp.controller('EstimationAcqueonController', function ($scope, $rootScope, _, EstimationAcqueonMasterService, toaster, $routeParams, $timeout, Opportunityservice, $window, $location, EstimationApplicationMasterService, SelectionService, EstimationPageSectionService) {
    $scope.IsScondHeaderHide = true;
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

    $scope.checkIFFreshsheet = function () {
        if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
            $scope.IsfreshSheet = true;
        }
    }
    $scope.checkIFFreshsheet();


    $scope.grideditable = false;

    $scope.Viewpage = function name() {
        $('#test').modal('show');
    }

    $scope.GetEstimationApplicationVersionsForOpp = function (oppid) {
        console.log('oppid, groupid' + oppid)
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppid, 'AcqueonSheet').success(function (data) {
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


    $scope.data = [];

    $scope.IsReadOnly = false;

    $scope.GetOpportunityList = function (id) {
        debugger;
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

            var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'AcqueonSheet', IsPriceSheetUpdated: true };

            EstimationAcqueonMasterService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {

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
                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "AcqueonSheet") {
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
        if ($routeParams.GroupId != 'undefined') {
            EstimationAcqueonMasterService.GetAllEstimationAcqueonbyOppGroupID($scope.OpportunityDetail.OppId, $scope.MaxSheetGroupID).success(function (data) {
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
            if ($scope.griduseredit && params.data.IsHeader != 'Y') {
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

    $scope.Addrow = function (GroupEditor, rowid) {
        var localJson = {};
        localJson = angular.copy(GroupEditor);
        if (GroupEditor.IsHeader != 'Y') {
            localJson['A1col1'] = gettype(GroupEditor.col1);
            localJson['A1col2'] = gettype(GroupEditor.col2);
            localJson['A1col3'] = gettype(GroupEditor.col3);
            localJson['A1Fcol1'] = getvalueforresultcol(GroupEditor.Fcol1);
            localJson['A1Fcol2'] = getvalueforresultcol(GroupEditor.Fcol2);
            localJson['A1Fcol3'] = getvalueforresultcol(GroupEditor.Fcol3);
            localJson['A1Fcol4'] = getvalueforresultcol(GroupEditor.Fcol4);
            localJson['A1Fcol5'] = getvalueforresultcol(GroupEditor.Fcol5);
            localJson['A1Fcol6'] = getvalueforresultcol(GroupEditor.Fcol6);
            //localJson.vcol4 = gettype(GroupEditor.col4);
        }
        else {
            localJson['A1col1'] = GroupEditor.col1;
            localJson['A1col2'] = GroupEditor.col2;
            localJson['A1col3'] = GroupEditor.col3;
            localJson['A1Fcol1'] = GroupEditor.Fcol1;
            localJson['A1Fcol2'] = GroupEditor.Fcol2;
            localJson['A1Fcol3'] = GroupEditor.Fcol3;
        }

        $scope.data.splice(rowid, 0, localJson);

        localJson = {};

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

    function gettypebsedfill(params) {
        angular.forEach(params, function (val, key) {
            var localJson = {};
            localJson = val;
            localJson['A1col1'] = gettype(val.col1);
            localJson['A1col2'] = gettype(val.col2);
            localJson['A1col3'] = gettype(val.col3);
            localJson['A1Fcol1'] = getvalueforresultcol(val.A1Fcol1);
            localJson['A1Fcol2'] = getvalueforresultcol(val.A1Fcol2);
            localJson['A1Fcol3'] = getvalueforresultcol(val.A1Fcol3);

            $scope.data.push(localJson);


            localJson = {};
        });
    }




    var columnDefs = [
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
            headerName: "", hide: true, field: "col3", width: 1,
        },
        {
            headerName: "", hide: true, field: 'Fcol1', width: 1,
        },
        {
            headerName: "", hide: true, field: 'Fcol2', width: 1,
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
        {
            headerName: "",
            children: [{ headerName: "LCM / U-Nexsys", field: "Name", width: 425 }]
        },
        {
            headerName: 'PROD',
            children: [
                { headerName: "# of Units", field: "A1col1", width: 70, cellRenderer: NonPercentTypeEditor },
            ]
        },
        {
            headerName: 'UAT',
            children: [
                { headerName: "# of Units", field: "A1col2", width: 70, cellRenderer: NonPercentTypeEditor },
            ]
        },
        {
            headerName: 'UPG',
            children: [
                { headerName: "# of Units", field: "A1col3", width: 70, cellRenderer: NonPercentTypeEditor }
            ]
        },

        {
            headerName: "",
            children: [{ headerName: "", field: "Name1", width: 250 }]
        },
        {
            headerName: 'PROD',
            children: [
                {
                    headerName: "Hours", field: "A1Fcol1", width: 70, cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },
                }
            ]
        },
        {
            headerName: 'UAT',
            children: [
                {
                    headerName: "Hours", field: "A1Fcol2", width: 70, cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },
                }
            ]
        },
        {
            headerName: 'UPG',
            children: [
                {
                    headerName: "Hours", field: "A1Fcol3", width: 70, cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },
                }
            ]
        },
        {
            headerName: "", hide: true, field: 'Fcol4', width: 1,
        },
        {
            headerName: "", hide: true, field: 'Fcol5', width: 1,
        },
        {
            headerName: "", hide: true, field: 'Fcol6', width: 1,
        },
        {
            headerName: "", hide: true, field: 'A1Fcol4', width: 1,
        },
        {
            headerName: "", hide: true, field: 'A1Fcol5', width: 1,
        },
        {
            headerName: "", hide: true, field: 'A1Fcol6', width: 1,
        },

    ];



    $scope.gridOptionsTop = {
        rowSelection: 'single',
        headerHeight: 16,
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
        onGridReady: function (event) {
            onFloatingBottomCount();
        },
        getRowStyle: getRowStyleScheduled
    };

    function getRowStyleScheduled(params) {
        if (params.data.IsHeader == "Y") {
            return {
                'background-color': '#5b9bd5',
                'color': 'white'
            }
        }
        else if (params.node.floating) {
            return { 'font-weight': 'bold', 'background-color': '#f97127' }
        }
        return null;
    }



    function onFloatingBottomCount() {
        var count = Number(1);
        var rows = calculateFinalTotal(count, 'Bottom');
        $scope.gridOptionsTop.api.setFloatingBottomRowData(rows);
    }


    function calculateFinalTotal() {
        var result = [];
        $scope.Servers = {};
        angular.forEach($scope.GridSections, function (value, key) {
            $scope[value.SectionName] = { Section: value.SectionName, A1Fcol1: 0, A1Fcol2: 0, A1Fcol3: 0, A1Fcol4: 0, A1Fcol5: 0, A1Fcol6: 0 };

            var result1 = _.filter($scope.data, function (obj) {
                return obj.GroupType == value.SectionName;
            })
            if (result1.length > 0) {
                _.each(result1, function (obj) {
                    try {
                        if (obj.IsHeader != "Y") {
                            if (obj.A1Fcol1 != '--' && obj.A1Fcol1 != '' && !isNaN(obj.A1Fcol1))
                                $scope[value.SectionName].A1Fcol1 += parseFloat(obj.A1Fcol1);
                            if (obj.A1Fcol2 != '--' && obj.A1Fcol2 != '' && !isNaN(obj.A1Fcol2))
                                $scope[value.SectionName].A1Fcol2 += parseFloat(obj.A1Fcol2);
                            if (obj.A1Fcol3 != '--' && obj.A1Fcol3 != '' && !isNaN(obj.A1Fcol3))
                                $scope[value.SectionName].A1Fcol3 += parseFloat(obj.A1Fcol3);
                            if (obj.A1Fcol4 != '--' && obj.A1Fcol4 != '' && !isNaN(obj.A1Fcol4))
                                $scope[value.SectionName].A1Fcol4 += parseFloat(obj.A1Fcol4);
                            if (obj.A1Fcol5 != '--' && obj.A1Fcol5 != '' && !isNaN(obj.A1Fcol5))
                                $scope[value.SectionName].A1Fcol5 += parseFloat(obj.A1Fcol5);
                            if (obj.A1Fcol6 != '--' && obj.A1Fcol6 != '' && !isNaN(obj.A1Fcol6))
                                $scope[value.SectionName].A1Fcol6 += parseFloat(obj.A1Fcol6);
                        }
                    }
                    catch (e) {
                        alert(e);
                    }
                })
            }
        });
        $scope.result1 = [];
        $scope.result1.push($scope.LCM);

        var data = $scope.data;

        var caljson = { A1Fcol1: 0, A1Fcol2: 0, A1Fcol3: 0, A1Fcol4: 0, A1Fcol5: 0, A1Fcol6: 0 };
        for (var i = 0; i < data.length; i++) {
            try {

                if (data[i].A1Fcol1 != '--' && data[i].A1Fcol1 != '' && !isNaN(data[i].A1Fcol1))
                    caljson.A1Fcol1 += parseFloat(data[i].A1Fcol1);
                if (data[i].A1Fcol2 != '--' && data[i].A1Fcol2 != '' && !isNaN(data[i].A1Fcol2))
                    caljson.A1Fcol2 += parseFloat(data[i].A1Fcol2);
                if (data[i].A1Fcol3 != '--' && data[i].A1Fcol3 != '' && !isNaN(data[i].A1Fcol3))
                    caljson.A1Fcol3 += parseFloat(data[i].A1Fcol3);
                if (data[i].A1Fcol4 != '--' && data[i].A1Fcol4 != '' && !isNaN(data[i].A1Fcol4))
                    caljson.A1Fcol4 += parseFloat(data[i].A1Fcol4);
                if (data[i].A1Fcol5 != '--' && data[i].A1Fcol5 != '' && !isNaN(data[i].A1Fcol5))
                    caljson.A1Fcol5 += parseFloat(data[i].A1Fcol5);
                if (data[i].A1Fcol6 != '--' && data[i].A1Fcol6 != '' && !isNaN(data[i].A1Fcol6))
                    caljson.A1Fcol6 += parseFloat(data[i].A1Fcol6);
            }
            catch (e) {
                alert(e);
            }
        }


        result.push({
            Section: 'Total', Name: 'Total Estimated Hours', A1col1: '', A1col2: '', A1col3: '', A1Fcol1: caljson.A1Fcol1, A1Fcol2: caljson.A1Fcol2, A1Fcol3: caljson.A1Fcol3, A1Fcol4: caljson.A1Fcol4, A1Fcol5: caljson.A1Fcol5, A1Fcol6: caljson.A1Fcol6
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

    $scope.onLoad();

    function callbackgrid() {

        $scope.gridOptionsTop.api.setColumnDefs(columnDefs);

    }


    $scope.addFreshrows = function (data) {

        EstimationPageSectionService.GetAllPageSections().success(function (datasection) {
            $scope.GridSections = datasection;
            debugger;
            var filteredsections = _.filter($scope.GridSections, function (obj) {
                return obj.PageName == "Acqueon";
            })
            console.log($scope.GridSections);
            var sortedresult = _.sortBy(filteredsections, function (item) {
                return -parseInt(item.OrderSequence);
            });


            $scope.GridSections = filteredsections;

            angular.forEach(sortedresult, function (value, key) {

                var result1 = _.filter(data, function (obj) {
                    return obj.GroupType == value.SectionName;
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

                    var freshrow = { 'GroupType': value.SectionName, 'Name': value.DisplayName, 'Name1': '', 'col1': '# of Units', 'col2': '# of Units', 'col3': '# of Units', 'Fcol1': 'Hours', 'Fcol2': 'Hours', 'Fcol3': 'Hours', 'Fcol4': 'Hours', 'Fcol5': 'Hours', 'Fcol6': 'Hours', 'RowId': '', IsHeader: 'Y', IsOriginal: true };
                    $scope.Addrow(freshrow, '');
                }
                // else {
                //     var freshrow = { 'GroupType': value.SectionName, 'Name': 'Type name', 'Name1': '', 'col1': 'Text', 'col2': 'Text', 'col3': 'Text', 'Fcol1': '', 'Fcol2': '', 'Fcol3': '', 'RowId': 1 };
                //     $scope.Addrow(freshrow, 0);
                // }
            });

            setrowdatacall();
            $scope.rerenderwholepage();
            if ($scope.CurrentVersiondata.IsInitial) {
                $scope.forceupdate = true;
                $scope.AddEstimationApplication(true);

            }

        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
            $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
        });


    }

    $scope.internalvariable = true;
    $scope.rerenderwholepage = function () {
        $scope.internalvariable = false;

        angular.element(document.querySelector('#loader')).removeClass('hide');
        $scope.gridOptionsTop.api.forEachNode(function (node) {
            $scope.onRefreshAll(node);
        });



        hardrefreshgrid();

        $timeout(function () {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 1000);

        $scope.internalvariable = true;

    }
    $scope.forceupdate = false;

    function setrowdatacall() {
        $scope.gridOptionsTop.api.setRowData($scope.data);


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

    function callbacksave(discard) {

        $scope.rerenderwholepage();
        onFloatingBottomCount();

        var data = $scope.data;
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

        var filtered = _.filter(data, function (item) {
            return item.IsHeader !== 'Y';
        });


        var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, AcqueonSheet: filtered, Authour: $rootScope.UserInfo.user.userId, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: $scope.Totalresult, RootId: $routeParams.OppId, Content: $scope.content };

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

    $scope.onRefreshAll = function (params) {
        try {
            if (params.data.IsHeader != 'Y') {
                for (var i = 1; i < $scope.CurrentAdditionalGrid; i++) {
                    try {

                        if (params.data.Fcol1 != undefined && params.data.Fcol1 != null && params.data.Fcol1 != '') {

                            var formula = RunthroughFormula(params.data.Fcol1, i);
                            params.data['A' + i + 'Fcol1'] = eval(formula);
                            if (!isNaN(params.data['A' + i + 'Fcol1']))
                                params.data['A' + i + 'Fcol1'] = (params.data['A' + i + 'Fcol1']).toString();
                            else {
                                params.data['A' + i + 'Fcol1'] = '0';
                            }
                        }
                        else {
                            params.data['A' + i + 'Fcol1'] = '0';
                        }

                        if (params.data.Fcol2 != undefined && params.data.Fcol2 != null && params.data.Fcol2 != '') {
                            var formula1 = RunthroughFormula(params.data.Fcol2, i);
                            params.data['A' + i + 'Fcol2'] = eval(formula1);
                            if (!isNaN(params.data['A' + i + 'Fcol2']))
                                params.data['A' + i + 'Fcol2'] = (params.data['A' + i + 'Fcol2']).toString();
                            else {
                                params.data['A' + i + 'Fcol2'] = '0';
                            }
                        }
                        if (params.data.Fcol3 != undefined && params.data.Fcol3 != null && params.data.Fcol3 != '') {
                            var formula2 = RunthroughFormula(params.data.Fcol3, i);
                            params.data['A' + i + 'Fcol3'] = eval(formula2);
                            if (!isNaN(params.data['A' + i + 'Fcol3']))
                                params.data['A' + i + 'Fcol3'] = (params.data['A' + i + 'Fcol3']).toString();
                            else {
                                params.data['A' + i + 'Fcol3'] = '0';
                            }
                        }
                        else {
                            params.data['A' + i + 'Fcol3'] = '0';
                        }


                        if (params.data.Fcol4 != undefined && params.data.Fcol4 != null && params.data.Fcol4 != '') {
                            var formula2 = RunthroughFormula(params.data.Fcol4, i);
                            params.data['A' + i + 'Fcol4'] = eval(formula2);
                            if (!isNaN(params.data['A' + i + 'Fcol4']))
                                params.data['A' + i + 'Fcol4'] = (params.data['A' + i + 'Fcol4']).toString();
                            else {
                                params.data['A' + i + 'Fcol4'] = '0';
                            }
                        }
                        else {
                            if (params.data.Fcol1 != undefined && params.data.Fcol1 != null && params.data.Fcol1 != '') {
                                var formula = RunthroughFormula(params.data.Fcol1, i);
                                params.data['A' + i + 'Fcol4'] = eval(formula);
                                if (!isNaN(params.data['A' + i + 'Fcol4']))
                                    params.data['A' + i + 'Fcol4'] = (params.data['A' + i + 'Fcol4']).toString();
                                else {
                                    params.data['A' + i + 'Fcol4'] = '0';
                                }
                            }
                            else {
                                params.data['A' + i + 'Fcol4'] = '0';
                            }

                        }



                        if (params.data.Fcol5 != undefined && params.data.Fcol5 != null && params.data.Fcol5 != '') {
                            var formula2 = RunthroughFormula(params.data.Fcol5, i);
                            params.data['A' + i + 'Fcol5'] = eval(formula2);
                            if (!isNaN(params.data['A' + i + 'Fcol5']))
                                params.data['A' + i + 'Fcol5'] = (params.data['A' + i + 'Fcol5']).toString();
                            else {
                                params.data['A' + i + 'Fcol5'] = '0';
                            }
                        }
                        else {
                            if (params.data.Fcol2 != undefined && params.data.Fcol2 != null && params.data.Fcol2 != '') {
                                var formula = RunthroughFormula(params.data.Fcol2, i);
                                params.data['A' + i + 'Fcol5'] = eval(formula);
                                if (!isNaN(params.data['A' + i + 'Fcol5']))
                                    params.data['A' + i + 'Fcol5'] = (params.data['A' + i + 'Fcol5']).toString();
                                else {
                                    params.data['A' + i + 'Fcol5'] = '0';
                                }

                            }
                            else {
                                params.data['A' + i + 'Fcol5'] = '0';
                            }
                        }


                        if (params.data.Fcol6 != undefined && params.data.Fcol6 != null && params.data.Fcol6 != '') {
                            var formula2 = RunthroughFormula(params.data.Fcol6, i);
                            params.data['A' + i + 'Fcol6'] = eval(formula2);
                            if (!isNaN(params.data['A' + i + 'Fcol6']))
                                params.data['A' + i + 'Fcol6'] = (params.data['A' + i + 'Fcol6']).toString();
                            else {
                                params.data['A' + i + 'Fcol6'] = '0';
                            }
                        }
                        else {
                            if (params.data.Fcol3 != undefined && params.data.Fcol3 != null && params.data.Fcol3 != '') {
                                var formula = RunthroughFormula(params.data.Fcol3, i);
                                params.data['A' + i + 'Fcol6'] = eval(formula);
                                if (!isNaN(params.data['A' + i + 'Fcol6']))
                                    params.data['A' + i + 'Fcol6'] = (params.data['A' + i + 'Fcol6']).toString();
                                else {
                                    params.data['A' + i + 'Fcol6'] = '0';
                                }
                            }
                            else {
                                params.data['A' + i + 'Fcol6'] = '0';
                            }
                        }

                        if (params.data.Name1 != undefined && params.data.Name1 != null && params.data.Name1 != '') {
                            var formula2 = RunthroughFormula(params.data.Name1, i);
                            params.data['Name1'] = eval("formula2");
                        }
                    }
                    catch (e) {
                        toaster.pop('error', "Error", "Error in Master sheet formula " + e, null);
                    }
                }

                if ($scope.internalvariable) {
                    hardrefreshgrid();
                }
            }
        }
        catch (ex) {
            alert(ex);
        }
    }


    function getcelldata(rownum, colname) {
        try {
            var completedata = $scope.data;

            var resultset = _.filter(completedata, function (obj) {
                return obj.RowId == rownum;
            })

            if (resultset.length > 0) {
                return parseFloat(resultset[0][colname]);
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

    }

    function RunthroughFormula(params, count) {
        var replacename = 'A' + count;
        var res = params.replace(/col1/g, (replacename + "col1"));
        res = res.replace(/col2/g, (replacename + "col2"));
        res = res.replace(/col3/g, (replacename + "col3"));
        if (count == 1) {
            res = res.replace(/FA1col1/g, (replacename + "Fcol1"));
            res = res.replace(/FA1col2/g, (replacename + "Fcol2"));
            res = res.replace(/FA1col3/g, (replacename + "Fcol3"));
        }
        else if (count == 2) {
            res = res.replace(/FA2col1/g, (replacename + "Fcol1"));
            res = res.replace(/FA2col2/g, (replacename + "Fcol2"));
            res = res.replace(/FA2col3/g, (replacename + "Fcol3"));
        }
        else if (count == 3) {
            res = res.replace(/FA3col1/g, (replacename + "Fcol1"));
            res = res.replace(/FA3col2/g, (replacename + "Fcol2"));
            res = res.replace(/FA3col3/g, (replacename + "Fcol3"));
        }
        res = res.replace(/Fcol4/g, (replacename + "Fcol4"));
        res = res.replace(/Fcol5/g, (replacename + "Fcol5"));
        res = res.replace(/Fcol6/g, (replacename + "Fcol6"));
        return res;
    }

    $scope.CurrentAdditionalGrid = 2;

    //add additional grid existing
    function addgrid(val) {

        for (var i = 2; i < val; i++) {
            if (i == 2) {
                $scope.currentwid += 300;
                $scope.mleft -= 12;

            }
            var appendname = 'A' + i;
            columnDefs.push({ headerName: 'Application # ' + i, children: [{ headerName: "", field: appendname + "col1", width: 100, cellRenderer: NonPercentTypeEditor }, { headerName: "", field: appendname + "col2", width: 100, cellRenderer: NonPercentTypeEditor }, { headerName: "Hours", field: appendname + "Fcol3", width: 100, cellRenderer: NonPercentTypeEditor }] });

            columnDefs1.push({ headerName: "", field: appendname + "col1", width: 100, cellRenderer: NonPercentTypeEditor });
            columnDefs1.push({ headerName: "", field: appendname + "col2", width: 100, cellRenderer: NonPercentTypeEditor });
            columnDefs1.push({ headerName: "Hours", field: appendname + "Fcol3", width: 100, cellRenderer: NonPercentTypeEditor });


            $scope.gridOptionsTop.api.setColumnDefs(columnDefs);

        }
        i++;
    }
    //add additional grid fresh
    $scope.addadditional = function (type) {

    }

    function loopRightdata() {



    }

    /* add function*/
    $scope.AddEstimationApplication = function (isdiscard) {
        $scope.TakeScreenshot(isdiscard);


    }

    function AddSheetInternalcall(Jsondata) {
        EstimationAcqueonMasterService.AddEstimationAcqueon(Jsondata).success(function (data) {
            $scope.CurrentVersiondata.IsInitial = false;

            if (data.Error == '' || data.Error == undefined || data.Error == null) {
                var newdata = $scope.Totalresult.concat($scope.result1);
                var IPdata = { OppId: $scope.OpportunityDetail.OppId, ProductName: 'ACQUEON', ApplicationId: $scope.MaxSheetGroupID, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: newdata, RootId: $routeParams.OppId };
                EstimationApplicationMasterService.dointernalpercentagecalculationForCiscoGroup(IPdata).success(function (data) {
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
                        toaster.pop('success', "SAVE", 'Acqueon Sheet Saved Successfully', 3000);
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

        EstimationApplicationMasterService.GetMaximumGroupEstimationApplicationId().success(function (data) {
            if (data[0].count == null) {
                $scope.MaxSheetGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
            }

            var data = $scope.data;
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

            var filtered = _.filter(data, function (item) {
                return item.IsHeader !== 'Y';
            });



            var maxid = _.max($scope.Versiondata, function (maxdata) { return parseFloat(maxdata.ApplicationId); });

            var currentversion = maxid.Version.split('_')[1];
            var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
            var version = 'Ver_' + i;

            $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;

            var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, ApplicationId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable, AcqueonSheet: filtered, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
            Jsondata.Version = version;
            Jsondata.NumberofApp = $scope.CurrentAdditionalGrid
            //AddEstimationAcqueonNewVersion


            EstimationAcqueonMasterService.AddEstimationAcqueon(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    var newdata = $scope.Totalresult.concat($scope.result1);
                    var IPdata = { OppId: $scope.OpportunityDetail.OppId, ProductName: 'ACQUEON', ApplicationId: $scope.MaxSheetGroupIDForSaveAs, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: newdata, RootId: $routeParams.OppId };
                    EstimationApplicationMasterService.dointernalpercentagecalculationForCiscoGroup(IPdata).success(function (data) {
                        $scope.griduseredit = false;
                        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
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
        $location.path("acqueon/" + oppId + "/" + groupId);
    }


    $scope.IncreaseAdditionalTimeToSheet = function () {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'AcqueonSheet' };
        EstimationAcqueonMasterService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
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

        // }, 500);


    }


    $scope.IgnoreChanges = function () {
        EstimationAcqueonMasterService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function (data) {
            //alert(data)
            $scope.hasedit = true;
            $scope.griduseredit = false;

            $scope.grideditable = false;
            if ($scope.Isleaving)
                redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)


        }).error(function (error) {

            $scope.Error = error;
        })
    }

});



