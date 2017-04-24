ReportApp.controller('EstimationApplicationController', function ($scope, $rootScope, _, EstimationApplicationMasterService, toaster, $routeParams, $timeout, Opportunityservice, $window, $location, SelectionService, EstimationPageSectionService) {
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
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppid, 'ApplicationSheet').success(function (data) {
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

                $window.location.href = "#home";
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

            var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'ApplicationSheet', IsPriceSheetUpdated: true };

            EstimationApplicationMasterService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {

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
                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "ApplicationSheet") {
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
            EstimationApplicationMasterService.GetAllEstimationApplicationbyOppGroupID($scope.OpportunityDetail.OppId, $scope.MaxSheetGroupID).success(function (data) {
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
        if (GroupEditor.IsHeader != 'Y') {
            localJson['A1col1'] = gettype(GroupEditor.col1);
            localJson['A1col2'] = gettype(GroupEditor.col2);
            localJson['A1Fcol3'] = getvalueforresultcol(GroupEditor.col3);
            //localJson.vcol4 = gettype(GroupEditor.col4);
        }
        else {
            localJson['A1col1'] = GroupEditor.col1;
            localJson['A1col2'] = GroupEditor.col2;
            localJson['A1Fcol3'] = GroupEditor.col3;
        }
        $scope.data.splice(rowid, 0, localJson);


        localJson = {};

    }


    function gettypebsedfill(params) {
        angular.forEach(params, function (val, key) {
            var localJson = {};
            localJson = val;
            localJson['A1col1'] = gettype(val.col1);
            localJson['A1col2'] = gettype(val.col2);
            localJson['A1Fcol3'] = gettype(val.A1Fcol3);
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
            headerName: "", hide: true, field: 'Fcol3', width: 1,
        },
        {
            headerName: "", hide: true, field: 'GroupType', width: 1,
        },
        {
            headerName: "", hide: true, field: "RowId", width: 1
        },
        {
            headerName: "Number of Applications : 1", children: [{ headerName: "", field: "Name", width: 500 }]
        },
        {
            headerName: 'Application # 1',
            children: [
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
            ]
        }
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
        angular.forEach($scope.GridSections, function (value, key) {
            $scope[value.SectionName] = { Section: value.SectionName, A1Fcol3: 0, A2Fcol3: 0, A3Fcol3: 0, A4Fcol3: 0, A5Fcol3: 0, A6Fcol3: 0, A7Fcol3: 0, A8Fcol3: 0, A9Fcol3: 0, A10Fcol3: 0 };

            var result1 = _.filter($scope.data, function (obj) {
                return obj.GroupType == value.SectionName;
            })
            if (result1.length > 0) {
                _.each(result1, function (obj) {
                    try {
                        if (obj.IsHeader != "Y") {
                            if (obj.A1Fcol3 != '--' && obj.A1Fcol3 != '' && !isNaN(obj.A1Fcol3))
                                $scope[value.SectionName].A1Fcol3 += parseFloat(obj.A1Fcol3);
                            if (obj.A2Fcol3 != '--' && obj.A2Fcol3 != '' && !isNaN(obj.A2Fcol3) && obj.A2Fcol3 != null)
                                $scope[value.SectionName].A2Fcol3 += parseFloat(obj.A2Fcol3);
                            if (obj.A3Fcol3 != '--' && obj.A3Fcol3 != '' && !isNaN(obj.A3Fcol3) && obj.A3Fcol3 != null)
                                $scope[value.SectionName].A3Fcol3 += parseFloat(obj.A3Fcol3);
                            if (obj.A4Fcol3 != '--' && obj.A4Fcol3 != '' && !isNaN(obj.A4Fcol3) && obj.A4Fcol3 != null)
                                $scope[value.SectionName].A4Fcol3 += parseFloat(obj.A4Fcol3);
                            if (obj.A5Fcol3 != '--' && obj.A5Fcol3 != '' && !isNaN(obj.A5Fcol3) && obj.A5Fcol3 != null)
                                $scope[value.SectionName].A5Fcol3 += parseFloat(obj.A5Fcol3);
                            if (obj.A6Fcol3 != '--' && obj.A6Fcol3 != '' && !isNaN(obj.A6Fcol3) && obj.A6Fcol3 != null)
                                $scope[value.SectionName].A6Fcol3 += parseFloat(obj.A6Fcol3);
                            if (obj.A7Fcol3 != '--' && obj.A7Fcol3 != '' && !isNaN(obj.A7Fcol3) && obj.A7Fcol3 != null)
                                $scope[value.SectionName].A7Fcol3 += parseFloat(obj.A7Fcol3);

                            if (obj.A8Fcol3 != '--' && obj.A8Fcol3 != '' && !isNaN(obj.A8Fcol3) && obj.A8Fcol3 != null)
                                $scope[value.SectionName].A8Fcol3 += parseFloat(obj.A8Fcol3);
                            if (obj.A9Fcol3 != '--' && obj.A9Fcol3 != '' && !isNaN(obj.A9Fcol3) && obj.A9Fcol3 != null)
                                $scope[value.SectionName].A9Fcol3 += parseFloat(obj.A9Fcol3);
                            if (obj.A10Fcol3 != '--' && obj.A10Fcol3 != '' && !isNaN(obj.A10Fcol3) && obj.A10Fcol3 != null)
                                $scope[value.SectionName].A10Fcol3 += parseFloat(obj.A10Fcol3);
                        }
                    }
                    catch (e) {
                        alert(e);
                    }
                })
            }
        });

        $scope.result1 = [];

        $scope.result1.push($scope.GridInputFramework, $scope.GridInputScreenApplicationDevelopment, $scope.GridInputHostOperations, $scope.GridInputOthers);

        var data = $scope.data;

        var caljson = { A1Fcol3: 0, A2Fcol3: 0, A3Fcol3: 0, A4Fcol3: 0, A5Fcol3: 0, A6Fcol3: 0, A7Fcol3: 0, A8Fcol3: 0, A9Fcol3: 0, A10Fcol3: 0 };
        for (var i = 0; i < data.length; i++) {
            try {
                if (data[i].A1Fcol3 != '--' && data[i].A1Fcol3 != '' && !isNaN(data[i].A1Fcol3))
                    caljson.A1Fcol3 += parseFloat(data[i].A1Fcol3);
                if (data[i].A2Fcol3 != '--' && data[i].A2Fcol3 != '' && !isNaN(data[i].A2Fcol3))
                    caljson.A2Fcol3 += parseFloat(data[i].A2Fcol3);
                if (data[i].A3Fcol3 != '--' && data[i].A3Fcol3 != '' && !isNaN(data[i].A3Fcol3))
                    caljson.A3Fcol3 += parseFloat(data[i].A3Fcol3);
                if (data[i].A4Fcol3 != '--' && data[i].A4Fcol3 != '' && !isNaN(data[i].A4Fcol3))
                    caljson.A4Fcol3 += parseFloat(data[i].A4Fcol3);
                if (data[i].A5Fcol3 != '--' && data[i].A5Fcol3 != '' && !isNaN(data[i].A5Fcol3))
                    caljson.A5Fcol3 += parseFloat(data[i].A5Fcol3);
                if (data[i].A6Fcol3 != '--' && data[i].A6Fcol3 != '' && !isNaN(data[i].A6Fcol3))
                    caljson.A6Fcol3 += parseFloat(data[i].A6Fcol3);
                if (data[i].A7Fcol3 != '--' && data[i].A7Fcol3 != '' && !isNaN(data[i].A7Fcol3))
                    caljson.A7Fcol3 += parseFloat(data[i].A7Fcol3);
                if (data[i].A8Fcol3 != '--' && data[i].A8Fcol3 != '' && !isNaN(data[i].A8Fcol3))
                    caljson.A8Fcol3 += parseFloat(data[i].A8Fcol3);
                if (data[i].A9Fcol3 != '--' && data[i].A9Fcol3 != '' && !isNaN(data[i].A9Fcol3))
                    caljson.A9Fcol3 += parseFloat(data[i].A9Fcol3);
                if (data[i].A10Fcol3 != '--' && data[i].A10Fcol3 != '' && !isNaN(data[i].A10Fcol3))
                    caljson.A10Fcol3 += parseFloat(data[i].A10Fcol3);
            }
            catch (e) {
                alert(e);
            }
        }


        result.push({
            Section: 'Total', Name: 'Total Estimated Hours', A1col1: '', A1col2: '', A1Fcol3: caljson.A1Fcol3, A2col1: '', A2col2: '', A2Fcol3: caljson.A2Fcol3, A3col1: '', A3col2: '', A3Fcol3: caljson.A3Fcol3, A4col1: '', A4col2: '', A4Fcol3: caljson.A4Fcol3, A5col1: '', A5col2: '', A5Fcol3: caljson.A5Fcol3, A6col1: '', A6col2: '', A6Fcol3: caljson.A6Fcol3, A7col1: ''
            , A7col2: '', A7Fcol3: caljson.A7Fcol3, A8col1: '', A8col2: '', A8Fcol3: caljson.A8Fcol3
            , A9col1: '', A9col2: '', A9Fcol3: caljson.A9Fcol3, A10col1: '', A10col2: '', A10Fcol3: caljson.A10Fcol3
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

        $scope.gridOptionsTop.api.setColumnDefs(columnDefs);

    }

    $scope.onLoad();

    $scope.addFreshrows = function (data) {


        EstimationPageSectionService.GetAllPageSections().success(function (datasection) {
            $scope.GridSections = datasection;
            var filteredsections = _.filter($scope.GridSections, function (obj) {
                return obj.PageName == "Applications";
            })
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
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Adding Estimation Application Master!", null);
            $scope.error = "An Error has occured while Adding Estimation Application Master! " + data.ExceptionMessage;
        });

        setrowdatacall();

        if ($scope.CurrentVersiondata.IsInitial) {

            $scope.rerenderwholepage();
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
    $scope.onRefreshAll = function (params) {
        try {
            if (params.data.IsHeader != 'Y') {
                if (params.data.Fcol3 != undefined && params.data.Fcol3 != null && params.data.Fcol3 != '') {
                    for (var i = 1; i < $scope.CurrentAdditionalGrid; i++) {
                        try {
                            $scope.currentGridnum = i;
                            var formula = RunthroughFormula(params.data.Fcol3, i);
                            params.data['A' + i + 'Fcol3'] = eval(formula);
                            if (!isNaN(params.data['A' + i + 'Fcol3']) && params.data['A' + i + 'Fcol3'] != '')
                                params.data['A' + i + 'Fcol3'] = (params.data['A' + i + 'Fcol3']).toString();
                            else {
                                params.data['A' + i + 'Fcol3'] = '0';
                            }
                        }
                        catch (e)
                        { toaster.pop('error', "Error", "Error in Master sheet formula " + e, null); }
                    }
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

    function hardrefreshgrid() {
        $scope.gridOptionsTop.api.refreshView();
    }

    function RunthroughFormula(params, count) {
        var replacename = 'A' + count;
        var res = params.replace(/col1/g, (replacename + "col1"));
        res = res.replace(/col2/g, (replacename + "col2"));
        //res = res.replace(/col3/g, (replacename + "col3"));
        //res = res.replace(/Fcol1/g, (replacename + "Fcol1"));
        //res = res.replace(/Fcol2/g, (replacename + "Fcol2"));
        res = res.replace(/Fcol3/g, (replacename + "Fcol3"));
        return res;
    }

    function getcelldata(rownum, colname) {
        try {

            var resultset = _.filter($scope.data, function (obj) {
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

    $scope.CurrentAdditionalGrid = 2;

    //add additional grid existing
    function addgrid(val) {

        for (var i = 2; i < val; i++) {
            if (i == 2) {
                $scope.currentwid += 300;
                $scope.mleft -= 12;

            }
            var appendname = 'A' + i;
            columnDefs.push({
                headerName: 'Application # ' + i, children: [{ headerName: "", field: appendname + "col1", width: 60, cellRenderer: NonPercentTypeEditor }, { headerName: "", field: appendname + "col2", width: 60, cellRenderer: NonPercentTypeEditor }, {
                    headerName: "Hours", field: appendname + "Fcol3", width: 60, cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },
                }]
            });

            $scope.gridOptionsTop.api.setColumnDefs(columnDefs);

        }
        i++;
    }
    //add additional grid fresh
    $scope.addadditional = function (type) {
        if ($scope.CurrentAdditionalGrid <= 10) {
            if ($scope.CurrentAdditionalGrid == 2) {
                $scope.currentwid += 300;
                $scope.mleft -= 12;

            }
            var appendname = 'A' + $scope.CurrentAdditionalGrid;
            columnDefs.push({
                headerName: 'Application # ' + $scope.CurrentAdditionalGrid, children: [{ headerName: "", field: appendname + "col1", width: 60, cellRenderer: NonPercentTypeEditor }, { headerName: "", field: appendname + "col2", width: 60, cellRenderer: NonPercentTypeEditor }, {
                    headerName: "Hours", field: appendname + "Fcol3", width: 60, cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },
                }]
            });


            $scope.gridOptionsTop.api.setColumnDefs(columnDefs);


            loopRightdata();
            setrowdatacall();
            $scope.CurrentAdditionalGrid++;
        }
    }

    function loopRightdata() {

        _.each($scope.data, function (obj) {
            obj['A' + $scope.CurrentAdditionalGrid + 'col1'] = gettype(obj['col1']);
            obj['A' + $scope.CurrentAdditionalGrid + 'col2'] = gettype(obj['col2'])
            obj['A' + $scope.CurrentAdditionalGrid + 'Fcol3'] = '0';
        })


    }



    $scope.Removeadditional = function (type) {
        if ($scope.CurrentAdditionalGrid > 2) {
            if ($scope.CurrentAdditionalGrid == 3) {
                $scope.currentwid -= 300;
                $scope.mleft += 12;
            }
            columnDefs.splice(-1, 1)


            $scope.gridOptionsTop.api.setColumnDefs(columnDefs);

            $scope.CurrentAdditionalGrid--;
            loopRightdataforsetzero();
            setrowdatacall();

        }
    }

    function loopRightdataforsetzero() {

        _.each($scope.data, function (obj) {
            obj['A' + $scope.CurrentAdditionalGrid + 'col1'] = '0';
            obj['A' + $scope.CurrentAdditionalGrid + 'col2'] = '0';
            obj['A' + $scope.CurrentAdditionalGrid + 'Fcol3'] = '0';
        })

    }


    function callbacksave(isdiscard) {
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

        var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, applicationsheet: filtered, Authour: $rootScope.UserInfo.user.userId, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: $scope.Totalresult, RootId: $routeParams.OppId, Content: $scope.content };

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
        EstimationApplicationMasterService.AddEstimationApplication(Jsondata).success(function (data) {

            $scope.CurrentVersiondata.IsInitial = false;
            if (data.Error == '' || data.Error == undefined || data.Error == null) {
                var newdata = $scope.Totalresult.concat($scope.result1);
                var IPdata = { OppId: $scope.OpportunityDetail.OppId, ProductName: 'APPLICATIONS', ApplicationId: $scope.MaxSheetGroupID, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: newdata, RootId: $routeParams.OppId };
                EstimationApplicationMasterService.dointernalpercentagecalculation(IPdata).success(function (data) {
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
                        toaster.pop('success', "SAVE", 'Application Sheet Saved Successfully', 3000);
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

            var maxid = _.max($scope.Versiondata, function (maxdata) { return parseFloat(maxdata.ApplicationId); });

            var currentversion = maxid.Version.split('_')[1];
            var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
            var version = 'Ver_' + i;

            $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;

            var filtered = _.filter(data, function (item) {
                return item.IsHeader !== 'Y';
            });

            var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, ApplicationId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable, applicationsheet: filtered, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
            Jsondata.Version = version;
            Jsondata.NumberofApp = $scope.CurrentAdditionalGrid
            EstimationApplicationMasterService.AddEstimationApplication(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {

                    var newdata = $scope.Totalresult.concat($scope.result1);
                    var IPdata = { OppId: $scope.OpportunityDetail.OppId, ProductName: 'APPLICATIONS', ApplicationId: $scope.MaxSheetGroupIDForSaveAs, NumberofApp: $scope.CurrentAdditionalGrid, TotalRow: newdata, RootId: $routeParams.OppId };
                    EstimationApplicationMasterService.dointernalpercentagecalculation(IPdata).success(function (data) {

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
        $location.path("application/" + oppId + "/" + groupId);
    }


    $scope.IncreaseAdditionalTimeToSheet = function () {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'ApplicationSheet' };
        EstimationApplicationMasterService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
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
        EstimationApplicationMasterService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function (data) {
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



