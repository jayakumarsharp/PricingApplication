ReportApp.controller('ManualEstimationController', function ($scope, $rootScope, _, ManualEstimationMasterService, toaster, $routeParams, $timeout, Opportunityservice, $window, $location, EstimationApplicationMasterService, ManualEstimationTypeService) {
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


    $scope.SelectOptions = [];

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
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppid, 'ManualEstimationSheet').success(function (data) {
            console.log(data)
            $scope.Versiondata = data;
            $scope.CurrentVersiondata = {};
            _.each($scope.Versiondata, function (value, key) {
                if (value["ApplicationId"] == $scope.GlobalGroupId) {
                    $scope.CurrentVersiondata = value;
                    $scope.CurrentAdditionalGrid = value["NumberOfApplication"];
                    $scope.MaxVersion = value["Version"];
                    $scope.hasedit = value["IsEditable"];
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



    $scope.hasedit = true;
    $scope.IsReadOnly = false;



    $scope.GetOpportunityList = function (id) {
        Opportunityservice.GetopportunitybyID(id).success(function (data) {
            if (data != null && data.length > 0) {
                $scope.OpportunityDetail = data[0];
                // $scope.GetPriceSheetByversion($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                // $scope.GetPriceSheetVersionsForOpp($scope.OpportunityDetail.OppId);
                $scope.GetEstimationApplicationVersionsForOpp($scope.OpportunityDetail.OppId);
                $scope.GetAllSelection();
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

            var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'ManualEstimationSheet', IsPriceSheetUpdated: true };

            ManualEstimationMasterService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {

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
                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "ManualEstimationSheet") {
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

        if ($routeParams.GroupId != 'undefined') {
            ManualEstimationMasterService.GetAllManualEstimationbyOppGroupID($scope.OpportunityDetail.OppId, $scope.MaxSheetGroupID).success(function (data) {
                if (data.Error == null) {
                    $scope.data = data;
                    $scope.gridOptionsBottom1.rowData = $scope.data;
                    $scope.gridOptionsBottom1.api.setRowData($scope.data);
                }
            });
        }
    }

    //EXSISTING





    function NonPercentTypeEditor1(params) {

        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);



        var eSelect = document.createElement("select");

        $scope.SelectOptions.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item.TaskName);
            eOption.setAttribute("title", item.ManualEstimationTypeId);
            eOption.innerHTML = item.TaskName;
            eSelect.appendChild(eOption);
        });

        eSelect.value = params.value;

        params.eGridCell.addEventListener('click', function () {
            if ($scope.grideditable) {
                if (!editing) {
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
                editing = false;
                var newValue = eSelect.value;
                var id = eSelect[eSelect.selectedIndex].title;


                eLabel.nodeValue = newValue;
                eCell.removeChild(eSelect);
                eCell.appendChild(eLabel);

                params.data[params.colDef.field] = newValue;
                params.data['TypeId'] = id;

                if (newValue == 'Others') {
                    params.data['REQ'] = '0';
                    params.data['Design'] = '0';
                    params.data['DevTest'] = '0';
                    params.data['SysTest'] = '0';
                    params.data['IMPL'] = '0';
                    params.data['UAT'] = '0';
                    params.data['PROD'] = '0';
                    params.data['TRAIN'] = '0';
                    params.data['MANUAL'] = '0';
                    params.data['OH'] = '0';
                    params.data['SQA'] = '0';
                }
                else if (newValue == 'Custom PS' || newValue == 'Self Service') {
                    params.data['REQ'] = '--';
                    params.data['Design'] = '0';
                    params.data['DevTest'] = '0';
                    params.data['SysTest'] = '--';
                    params.data['IMPL'] = '--';
                    params.data['UAT'] = '--';
                    params.data['PROD'] = '--';
                    params.data['TRAIN'] = '--';
                    params.data['MANUAL'] = '--';
                    params.data['OH'] = '--';
                    params.data['SQA'] = '--';
                }
                else {
                    params.data['REQ'] = '--';
                    params.data['Design'] = '--';
                    params.data['DevTest'] = '--';
                    params.data['SysTest'] = '--';
                    params.data['IMPL'] = '0';
                    params.data['UAT'] = '--';
                    params.data['PROD'] = '--';
                    params.data['TRAIN'] = '--';
                    params.data['MANUAL'] = '--';
                    params.data['OH'] = '--';
                    params.data['SQA'] = '--';
                }
                $scope.gridOptionsBottom1.rowData = $scope.data;
                $scope.gridOptionsBottom1.api.setRowData($scope.data);


            }

        });


        return eCell;

    }


    function NonPercentTypeEditor(params) {

        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);

        var eInput = document.createElement('input');
        eInput.type = 'text';



        params.eGridCell.addEventListener('click', function () {

            if (!editing && eLabel.data != '--') {
                eInput.value = eLabel.data;
                eInput.type = 'number';

                eCell.removeChild(eLabel);
                eCell.appendChild(eInput);
                eInput.focus();
                editing = true;
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
            params.data[params.colDef.field] = newValue;
            if (!validaterowdata(params.data, params.colDef.field)) {
                eLabel.data = '0';
                params.data[params.colDef.field] = '0';
            }
            eCell.removeChild(eInput);
            eCell.appendChild(eLabel);
        };

        eInput.addEventListener("blur", blurListenerfn);

        return eCell;

    }

    function validaterowdata(data, colname) {

        if (data.Type != 'Others') {
            if (colname == "DevTest" && parseInt(data.DevTest) > 0 && parseInt(data.Design) > 0) {
                toaster.pop('warning', "Warning", 'Design and DevTest cannot be entered at same time', null);
                return false;
            }

            if (colname == "Design" && parseInt(data.Design) > 0 && parseInt(data.DevTest) > 0) {
                toaster.pop('warning', "Warning", 'Design and DevTest cannot be entered at same time', null);
                return false;
            }

            return true;

        }
        else
            return true;
    }



    $scope.addnewpricerow = function (GroupEditor, rowid) {
        angular.element(document.getElementById('btnadd'))[0].disabled = true;
        angular.element(document.querySelector('#loader')).removeClass('hide');
        var selectedRows = $scope.gridOptionsBottom1.api.getSelectedNodes();

        var curentId = 0;
        if ($scope.gridOptionsBottom1.rowData.length == 0) {
            curentId = 1;
        }
        else {
            maxindex = $scope.gridOptionsBottom1.rowData.length - 1;
            var curentId = $scope.gridOptionsBottom1.rowData[maxindex].RowNo + 1;
        }

        if (selectedRows.length > 0) {
            var alterrows = selectedRows[0].childIndex + 1;
            var newid = alterrows + 1;
            $scope.data.splice(alterrows, 0, {
                RowNo: newid,
                OppId: $scope.OpportunityDetail.OppId,
                Description: 'Description',
                TypeId: '',
                Type: '--Select--',
                REQ: '',
                Design: '',
                DevTest: '',
                SysTest: '',
                IMPL: '',
                UAT: '',
                PROD: '',
                TRAIN: '',
                MANUAL: '',
                OH: '',
                SQA: ''

            });

            for (alterrows; alterrows < $scope.gridOptionsBottom1.rowData.length; alterrows++) {
                $scope.data[alterrows].RowNo = alterrows + 1;
            }

        }
        else {
            $scope.data.push({
                RowNo: curentId, OppId: $scope.OpportunityDetail.OppId,
                Description: 'Description',
                TypeId: '',
                Type: '--Select--',
                REQ: '',
                Design: '',
                DevTest: '',
                SysTest: '',
                IMPL: '',
                UAT: '',
                PROD: '',
                TRAIN: '',
                MANUAL: '',
                OH: '',
                SQA: ''

            });
        }
        $scope.gridOptionsBottom1.rowData = $scope.data;
        $scope.gridOptionsBottom1.api.setRowData($scope.data);


        $timeout(function () {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 500);

        angular.element(document.getElementById('btnadd'))[0].disabled = false;

    }



    $scope.deleteRow = function () {
        angular.element(document.querySelector('#loader')).removeClass('hide');

        var selected = $scope.gridOptionsBottom1.api.getFocusedCell();
        if (selected == null) {
            toaster.pop('error', "Error", 'Please select row to delete', null);
        }
        else {
            $scope.data.splice(selected.rowIndex, 1);
            toaster.pop('success', "Success", 'Row ' + (parseFloat(selected.rowIndex) + 1) + ' deleted successfully', null);
            var alterrows = selected.rowIndex;
            for (alterrows; alterrows < $scope.gridOptionsBottom1.rowData.length; alterrows++) {
                console.log(alterrows)
                $scope.data[alterrows].RowId = alterrows + 1;
            }

            $scope.gridOptionsBottom1.api.setRowData($scope.data);
            $scope.gridOptionsBottom1.rowData = $scope.data;

        }
        $timeout(function () {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 500);

    }


    var columnDefs1 = [

        {
            headerName: "", field: "TypeId", hide: true
        },
        {
            headerName: " # ", field: "RowNo", width: 40
        },
        {
            headerName: "Description", field: "Description", width: 180, headerTooltip: "Description", editable: true
        },
        {
            headerName: "Type", field: "Type", width: 100, headerTooltip: "Type", cellRenderer: NonPercentTypeEditor1
        },
        {
            headerName: "REQ", field: "REQ", width: 75, headerTooltip: "REQ", cellRenderer: NonPercentTypeEditor,
            newValueHandler: function (params) {
                if (params.newValue == '') {
                    params.newValue = '0';
                }
                if (parseFloat(params.newValue) > 99) {
                    toaster.pop('warning', "Warning", 'Payment Terms cannot be greater than 99', null);
                }
                else
                    params.data.paymentTerms = parseFloat(params.newValue);
            }
        },

        {
            headerName: "Design", field: "Design", width: 70, headerTooltip: "Design", cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "DevTest", field: "DevTest", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "SysTest", field: "SysTest", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "IMPL", field: "IMPL", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },

        {
            headerName: "UAT", field: "UAT", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "PROD", field: "PROD", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "TRAIN", field: "TRAIN", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "MANUAL", field: "MANUAL", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "OH", field: "OH", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        },
        {
            headerName: "SQA", field: "SQA", width: 70, cellRenderer: NonPercentTypeEditor,

            cellClassRules: {
                'blockbackground': function (params) {
                    return params.value == '--';
                },
            },
        }];



    $scope.gridOptionsBottom1 = {
        angularCompileRows: true,
        columnDefs: [],
        rowSelection: 'single',

        groupHeaders: true,
        headerHeight: 36,
        rowHeight: 24,
        rowData: $scope.data,
        enableColResize: true,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
        singleClickEdit: true,
        onGridReady: function (event) {
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#f97127' }
            }
        },
    };



    $scope.GetAllSelection = function () {
        ManualEstimationTypeService.GetAllManualEstimationType().success(function (data) {
            $scope.SelectOptions = data;

            $scope.gridOptionsBottom1.api.setColumnDefs(columnDefs1);
            $scope.gridOptionsBottom1.api.sizeColumnsToFit();

            getservicedata();
        }).error(function (error) {
            $scope.Error = error;
        })
    };




    function RunthroughFormula(params, count) {
        var replacename = 'A' + count;
        var res = params.replace(/col1/g, (replacename + "col1"));
        res = res.replace(/col2/g, (replacename + "col2"));
        res = res.replace(/col3/g, (replacename + "col3"));
        return res;
    }

    $scope.CurrentAdditionalGrid = 2;

    //add additional grid existing

    $scope.addadditional = function (type) {

    }


    /* add function*/
    $scope.AddEstimationApplication = function (isdiscard) {
        if (validatedata()) {
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

            var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, ManualEstimationSheet: data, Authour: $rootScope.UserInfo.user.userId, NumberofApp: $scope.CurrentAdditionalGrid };

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
    }

    function validatedata() {
        for (var j = 0; j < $scope.data.length; j++) {
            try {
                if ($scope.data[j].Type == '--Select--') {
                    toaster.pop('warning', "Warning", 'Please complete Row ' + $scope.data[j].RowNo, null);
                    return false;
                }

            }
            catch (ex) {
                alert(ex);
            }
        }
        return true;
    }

    function AddSheetInternalcall(Jsondata) {
        ManualEstimationMasterService.AddManualEstimation(Jsondata).success(function (data) {

            if (data.Error == '' || data.Error == undefined || data.Error == null) {
                $scope.griduseredit = false;
                $scope.hasedit = true;
                $scope.grideditable = false;


                if ($scope.Isleaving)
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                else {

                    $window.location.href = $scope.newnavigateURl;
                }
                toaster.pop('success', "SAVE", 'ManualEstimation Sheet Saved Successfully', 3000);
                return true;
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

            var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, ApplicationId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable, ManualEstimationSheet: data, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
            Jsondata.Version = version;
            Jsondata.NumberofApp = $scope.CurrentAdditionalGrid
            ManualEstimationMasterService.AddManualEstimation(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.griduseredit = false;
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
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
        $location.path("manualestimation/" + oppId + "/" + groupId);
    }


    $scope.IncreaseAdditionalTimeToSheet = function () {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'ManualEstimationSheet' };
        ManualEstimationMasterService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
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


    }


    $scope.IgnoreChanges = function () {
        ManualEstimationMasterService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function (data) {
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



