ReportApp.controller('ResourceController', function($scope, $rootScope, $timeout, $filter, $location, $routeParams, toaster, reportFactory, OppFactory,
    Opportunityservice, UserFactory, priceService, ResourceService, EstimationApplicationMasterService) {

    // ---- Variables Definition ------//

    $scope.MaxGroupID = $routeParams.GroupId;
    $scope.OppId = $routeParams.OppId;
    $scope.GroupId = $routeParams.GroupId;
    $scope.LoggedUser = $rootScope.UserInfo.user.userId;

    $scope.Version = '';
    $scope.SheetLockedMessage = '';

    $scope.isResourceEditable = false;
    $scope.isEditClicked = false;
    $scope.DefautState = false;
    $scope.IsLeavingResource = true;

    $scope.ResourcingData = [];
    $scope.Region = [];
    $scope.SBUList = [];
    $scope.LOBList = [];
    $scope.OppDetail = {};
    $scope.Versions = [];
    $scope.RegionCollection = [];


    $scope.VersionInfo = {};

    var OppConfig = {};
    var resourcingValue = {};

    //--------------End-------------------//

    // -----------Resource Grid ----------------//

    var columnDefTimeMat = [
        {
            headerName: " # ", field: "RowNo", width: 40, pinned: true
        },
        {
            headerName: "LOB", field: "LOB", width: 90, pinned: true, cellRenderer: function(params) {
                return '<span><select id="ddLOB" ng-disabled="!isEditClicked" ng-options="item.Id as item.LOBName for item in LOBList"'
                    + ' name="ddlLOB" ng-model="ResourcingData[' + params.rowIndex + '].LOB" title="Select LOB">'
                    + '<option value="">- Select LOB -</option>'
                    + '</select></span>';
            }
        },
        {
            headerName: "SBU", field: "SBU", width: 85, pinned: true, cellRenderer: function(params) {
                return '<span><select id="ddSBU" ng-disabled="!isEditClicked" ng-options="item.id as item.SBU for item in SBUList"'
                    + 'ng-change="RefreshRegion(ResourcingData[' + params.rowIndex + '].SBU,' + params.rowIndex + ')"'
                    + ' name="ddlSBU" ng-model="ResourcingData[' + params.rowIndex + '].SBU" title="Select SBU">'
                    + '<option value="">- Select SBU -</option>'
                    + '</select></span>';
            }
        },
        {
            headerName: "Region", field: "Region", width: 100, pinned: true, cellRenderer: function(params) {
                return '<span><select id="ddRegion" ng-disabled="!isEditClicked" ng-options="item.Id as item.CountryName for item in RegionCollection[' + params.rowIndex + ']"'
                    + 'name="ddlRegion" ng-model="ResourcingData[' + params.rowIndex + '].Region" title="Select Region">'
                    + '<option value="">- Select Region -</option>'
                    + '</select></span>';
            }
        },
        {
            headerName: "Resource Type", width: 200, field: "ResourceType", cellRenderer: function(params) {
                return '<span><input id="resTypeTxt" ng-disabled="!isEditClicked" ng-model="ResourcingData[' + params.rowIndex + '].ResourceType" />';
            }
        },
        {
            headerName: "Years of <br>Experience", width: 100, headerTooltip: 'Years of Experience', field: "Experience", cellRenderer: function(params) {
                return '<span><input id="yearsTxt" ng-disabled="!isEditClicked" '
                    + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].Experience"'
                    + '/></span>';
            }
        },
        {
            headerName: "Unit", field: "Unit", width: 85, cellRenderer: function(params) {
                return '<span><select id="ddUnit" ng-disabled="!isEditClicked"'
                    + ' ng-change="GetYear(' + params.rowIndex
                    + ')"  name="ddlUnit" ng-model="ResourcingData[' + params.rowIndex + '].Unit" title="Select Unit">'
                    + '<option value="">- Select Unit -</option>'
                    + '<option value="Hour">Hour</option>'
                    + '<option value="Month">Month</option>'
                    + '<option value="Year">Year</option>'
                    + '</select></span>';
            }
        },
        {
            headerName: "Unit Rate <br>(Cost)", width: 100, field: "UnitRate", cellRenderer: function(params) {
                return '<span><input id="unitRateTxt" ng-disabled="!isEditClicked"'
                    + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                    + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitRate"'
                    + '/></span>';
            }
        },
        {
            headerName: 'Duration',
            groupId: "GroupDur",
            headerTooltip: "Duration",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "UnitCount1", cellRenderer: function(params) {
                        return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount1"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 2", width: 100, field: "UnitCount2", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount2"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 3", width: 100, field: "UnitCount3", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount3"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 4", width: 100, field: "UnitCount4", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount4"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 5", width: 100, field: "UnitCount5", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount5"'
                            + '/></span>';
                    }
                }]
        },
        {
            headerName: 'Head Count',
            groupId: "GroupHC",
            headerTooltip: "Head Count",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "HeadCount1", cellRenderer: function(params) {
                        return '<span><input id="hc1Txt" ng-disabled="isEditClicked ? (('
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount1"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 2", width: 100, field: "HeadCount2", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="hc2Txt" ng-disabled="isEditClicked ? (('
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount2"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 3", width: 100, field: "HeadCount3", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="hc3Txt" ng-disabled="isEditClicked ? (('
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount3"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 4", width: 100, field: "HeadCount4", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="hc4Txt" ng-disabled="isEditClicked ? (('
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount4"'
                            + '/></span>';
                    }
                },
                {
                    headerName: "Year 5", width: 100, field: "HeadCount5", columnGroupShow: 'closed', cellRenderer: function(params) {
                        return '<span><input id="hc5Txt" ng-disabled="isEditClicked ? (('
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                            + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0)) ? true : false) : true"'
                            + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                            + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount5"'
                            + '/></span>';
                    }
                }]
        },
        {
            headerName: 'COST',
            groupId: "GroupCost",
            headerTooltip: "Cost",
            children: [{
                headerName: "Total", field: "TotalYearCost", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                cellRenderer: function(params) {
                    var number = parseInt(parseInt(params.data.Year1) + parseInt(params.data.Year2) + parseInt(params.data.Year3) + parseInt(params.data.Year4) + parseInt(params.data.Year5));
                    return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                }
            },
            {
                headerName: "Year 1", width: 100, field: "Year1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                cellRenderer: function(params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                },
            },
            {
                headerName: "Year 2", width: 100, field: "Year2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                cellRenderer: function(params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Year 3", width: 100, field: "Year3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                cellRenderer: function(params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Year 4", width: 100, field: "Year4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                cellRenderer: function(params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Year 5", width: 100, field: "Year5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                cellRenderer: function(params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            }]
        },

        {
            headerName: 'Penalty',
            groupId: "GroupPenalty",
            headerTooltip: "Penalty",
            children: [
                {
                    headerName: "Total", field: "TotalYearPenalty", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                    cellRenderer: function(params) {
                        var number = parseInt((isNaN(parseInt(params.data.PenaltyYear1)) ? 0 : parseInt(params.data.PenaltyYear1)) + (isNaN(parseInt(params.data.PenaltyYear2)) ? 0 : parseInt(params.data.PenaltyYear2)) + (isNaN(parseInt(params.data.PenaltyYear3)) ? 0 : parseInt(params.data.PenaltyYear3)) + (isNaN(parseInt(params.data.PenaltyYear4)) ? 0 : parseInt(params.data.PenaltyYear4)) + (isNaN(parseInt(params.data.PenaltyYear5)) ? 0 : parseInt(params.data.PenaltyYear5)));
                        return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                    }
                },
                {
                    headerName: "Year 1", width: 100, field: "PenaltyYear1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    },
                },
                {
                    headerName: "Year 2", width: 100, field: "PenaltyYear2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 3", width: 100, field: "PenaltyYear3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 4", width: 100, field: "PenaltyYear4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 5", width: 100, field: "PenaltyYear5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                }]
        },
        {
            headerName: "Overhead",
            groupId: "GroupOverhead",
            children: [
                {
                    headerName: "Total", field: "TotalYearOverhead", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                    cellRenderer: function(params) {
                        var number = parseInt((isNaN(parseInt(params.data.OverheadYear1)) ? 0 : parseInt(params.data.OverheadYear1)) + (isNaN(parseInt(params.data.OverheadYear2)) ? 0 : parseInt(params.data.OverheadYear2)) + (isNaN(parseInt(params.data.OverheadYear3)) ? 0 : parseInt(params.data.OverheadYear3)) + (isNaN(parseInt(params.data.OverheadYear4)) ? 0 : parseInt(params.data.OverheadYear4)) + (isNaN(parseInt(params.data.OverheadYear5)) ? 0 : parseInt(params.data.OverheadYear5)));
                        return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                    }
                },
                {
                    headerName: "Year 1", width: 100, field: "OverheadYear1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 2", width: 100, field: "OverheadYear2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 3", width: 100, field: "OverheadYear3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 4", width: 100, field: "OverheadYear4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 5", width: 100, field: "OverheadYear5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                }
            ]
        },
        {
            headerName: "Margin", width: 100, field: "Margin", cellRenderer: function(params) {
                return '<span><input id="unitRateTxt" ng-disabled="!isEditClicked"'
                    + ' ng-blur="GetYear(' + params.rowIndex + ')" '
                    + 'type="number" min=0 ng-model="ResourcingData[' + params.rowIndex + '].Margin"'
                    + '/></span>';
            }
        },
        {
            headerName: 'TOTAL',
            groupId: "GroupMargin",
            headerTooltip: "Total",
            children: [
                {
                    headerName: "Total", field: "TotalYearMargin", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                    cellRenderer: function(params) {
                        var number = parseInt((isNaN(parseInt(params.data.MarginYear1)) ? 0 : parseInt(params.data.MarginYear1)) + (isNaN(parseInt(params.data.MarginYear2)) ? 0 : parseInt(params.data.MarginYear2)) + (isNaN(parseInt(params.data.MarginYear3)) ? 0 : parseInt(params.data.MarginYear3)) + (isNaN(parseInt(params.data.MarginYear4)) ? 0 : parseInt(params.data.MarginYear4)) + (isNaN(parseInt(params.data.MarginYear5)) ? 0 : parseInt(params.data.MarginYear5)));
                        return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                    }
                },
                {
                    headerName: "Year 1", width: 100, field: "MarginYear1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    },
                },
                {
                    headerName: "Year 2", width: 100, field: "MarginYear2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 3", width: 100, field: "MarginYear3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 4", width: 100, field: "MarginYear4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 5", width: 100, field: "MarginYear5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function(params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                }]
        }
    ];

    $scope.resourceGrid = {
        angularCompileRows: true,

        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        rowHeight: 24,

        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
        singleClickEdit: true,


        columnDefs: columnDefTimeMat,

        rowData: [],
        enableColResize: true,
        debug: true,
        icons: {
            menu: '<i class="fa fa-bars"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
            groupContracted: '<i class="fa fa-minus-square-o"/>',
            groupExpanded: '<i class="fa fa-plus-square-o"/>',
            columnGroupClosed: '<i class="fa fa-minus-square-o"/>',
            columnGroupOpened: '<i class="fa fa-plus-square-o"/>'
        }
    };

    //--------- End Grid ---------------//

    $scope.GetOpportunityList = function(id) {
        Opportunityservice.GetopportunitybyID(id).success(function(data) {
            if (data != null && data.length > 0) {
                $scope.OppDetail = data[0];
                $scope.OpportunityDetail = data[0];
                console.log('Opp Details:' + JSON.stringify($scope.OppDetail));
                $scope.getservicedata();
                $scope.GetAllVersions();
            }
            else {
                toaster.pop('error', "Error", 'Invalid Opportunity Details', null);
                $window.location.href = "home";
            }
        });
    }

    $scope.GetAllVersions = function() {
        console.log('Getting verisons for oppid ' + $scope.OppDetail.OppId);
        // EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp($scope.OppDetail.OppId, 'ResourceSheet').success(function (data) {
        //     $scope.Versions = data;
        //     $scope.VersionInfo = {};
        //     _.each($scope.Versions, function (value, key) {
        //         if (value["ApplicationId"] == $scope.GroupId) {
        //             $scope.VersionInfo = value;
        //             $scope.Version = value["Version"];
        //         }
        //     });
        // }).error(function (error) {
        //     $scope.Error = error;
        // })

        //jay
        priceService.GetPriceSheetVersionsForOpp($scope.OppDetail.OppId).success(function(data) {
            $scope.Versions = data;
            $scope.VersionInfo = {};
            _.each($scope.Versions, function(value, key) {
                if (value["PriceSheetId"] == $scope.GlobalGroupId) {

                    $scope.VersionInfo = value;
                    $scope.Version = value["Version"];
                }
            });


        }).error(function(error) {
            $scope.Error = error;
        })
    };


    $scope.getservicedata = function() {
        if ($routeParams.GroupId != 'undefined') {
            console.log('Getting service data..');
            ResourceService.GetAllResourcebyOppGroupID($scope.OppDetail.OppId, $scope.MaxGroupID).success(function(data) {
                if (data.Error == null) {
                    $scope.ResourcingData = data;
                    angular.forEach($scope.ResourcingData, function(value, key) {
                        $scope.RefreshRegion(value.SBU, value.RowNo - 1);
                        value.SBU = $scope.OppDetail.SBUId;
                        value.Margin = parseInt(value.Margin);
                        //value.Region = $scope.OppDetail.CountryId;
                    });
                    $scope.resourceGrid.api.setRowData($scope.ResourcingData);
                    $scope.resourceGrid.rowData = $scope.ResourcingData;
                    $timeout(function() {
                        $scope.resourceGrid.api.refreshView();
                    }, 500);
                }
            }).error(function(error) {
                console.log('Error occurred: ' + error);
                $scope.Error = error;
            });
        }
    };

    $scope.GetRightsList = function() {
        reportFactory.GetRightsList($scope.LoggedUser).then(function(rights) {
            angular.forEach(rights.data, function(value, key) {
                if (value.RightName.contains('Resourcing Write')) {
                    $scope.isResourceEditable = true;
                }
            });
        });
    };

    $scope.GetAllSBU = function() {
        UserFactory.GetAllSBU().success(function(data) {
            angular.forEach(data, function(value, key) {
                if (value.SBU != 'All') {
                    $scope.SBUList.push(value);
                }
            });
        }).error(function(error) {
            $scope.Error = error;
        });
    };

    $scope.RefreshRegion = function(sbuid, rowIndex) {
        if (sbuid != '') {
            OppFactory.GetAllCountry().success(function(data) {
                var collection = [];
                angular.forEach(data, function(value, key) {
                    if (value.SBUId == sbuid) {
                        collection.push(value);
                    }
                });
                $scope.RegionCollection.splice(rowIndex, 0, collection);
            }).error(function(error) {
                $scope.Error = error;
            });
        }
    };

    $scope.GetAllLOBList = function() {
        priceService.GetAllLOBList().success(function(data) {
            $scope.LOBList = data;
            $scope.LOBList.splice(0, 1);
            $scope.LOBList.splice(2, 1);
            $scope.LOBList.splice(3, 1);
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityConfiguration = function() {
        Opportunityservice.GetOpportunityConfigurationByID($routeParams.OppId).success(function(data) {
            if (data.length > 0) {
                OppConfig = data[0];
            }
            else {
                OppConfig = {};
            }
        }).error(function(error) {
            $scope.Error = error;
        })
    };

    $scope.MakeContainerFullScreen = function(state) {
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

    $scope.SaveResourcing = function(isDiscard) {
        if (validatedata()) {
            var data = $scope.ResourcingData;
            for (var j = 0; j < data.length; j++) {
                try {
                    delete data[j].Id
                    data[j].OppId = $scope.OppDetail.OppId;
                    data[j].GroupId = $scope.MaxGroupID;
                }
                catch (ex) {
                    console.log(ex);
                }
            }

            var Jsondata = { OppId: $scope.OppDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxGroupID, Comment: '', Version: $scope.Version, ResourceSheet: data, Author: $scope.LoggedUser, NumberofApp: 0 };
            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null') {
                Jsondata.Version = 'Ver_0.1';
                Jsondata.Comment = 'Initial';
                $routeParams.GroupId = $scope.MaxGroupID;
                AddSheetInternalcall(Jsondata);
            }
            else {
                AddSheetInternalcall(Jsondata);
            }
            $('#ShowSave').modal('hide');
        }
    }

    $scope.SaveAsResourcing = function() {
        priceService.GetMaximumGroupPriceSheetId().success(function(data) {
            if (data[0].count == 'null') {
                $scope.MaxGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxGroupIDForSaveAs = data[0].count + 1;
            }
            for (var j = 0; j < $scope.ResourcingData.length; j++) {
                try {
                    delete $scope.ResourcingData[j].Id
                    $scope.ResourcingData[j].OppId = $scope.OppDetail.OppId;
                    $scope.ResourcingData[j].GroupId = $scope.MaxGroupIDForSaveAs;
                }
                catch (ex) {
                    console.log(ex);
                }
            }
            var maxid = _.max($scope.Versions, function(maxdata) { return parseFloat(maxdata.ApplicationId); });
            var currentversion = maxid.Version.split('_')[1];
            var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
            var version = 'Ver_' + i;

            $routeParams.GroupId = $scope.MaxGroupIDForSaveAs;

            var Jsondata = {
                ExisitingPriceGroupId: $scope.MaxGroupID, OppId: $scope.OppDetail.OppId, IsSaveAs: true, ApplicationId: $scope.MaxGroupIDForSaveAs,
                AppId: $scope.MaxGroupIDForSaveAs, IsReadOnly: $scope.isEditClicked, ResourceSheet: $scope.ResourcingData,
                Comment: $scope.SaveComment, Author: $scope.LoggedUser, IsEditable: true
            };
            Jsondata.Version = version;
            //Jsondata.NumberofApp = $scope.CurrentAdditionalGrid
            ResourceService.AddResourceNewVersion(Jsondata).success(function(data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.isEditClicked = false;
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                    toaster.pop('success', "Save", 'New Version of Resource Sheet Saved Successfully', 3000);
                }
                else {
                    toaster.pop('error', "Error", data.Error, 3000);
                }
            }).error(function(error) {
                console.log("failure message: " + JSON.stringify(error));
            });
        });


        $('#showSaveAs').modal('hide');
    }

    $scope.EditResource = function() {
        angular.element(document.querySelector('#loader')).removeClass('hide');
        priceService.GetMaximumGroupPriceSheetId().success(function(data) {
            if (data[0].count == null) {
                $scope.MaxGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxGroupIDForSaveAs = data[0].count + 1;
            }

            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                $scope.Version = 'Ver_0.1'
                $routeParams.GroupId = $scope.MaxGroupIDForSaveAs;
                $scope.MaxGroupID = $scope.MaxGroupIDForSaveAs;
            }

            var LockSheetModel = { OppId: $scope.OppDetail.OppId, GroupId: $scope.MaxGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'ResourceSheet', IsResourceSheetUpdated: true };

            ResourceService.LocktheSheetByGroupid(LockSheetModel).success(function(data) {
                if (!data.IsLocked) {

                    $routeParams.GroupId = data.PriceSheetId;
                    $scope.Version = data.Version;
                    $scope.isEditClicked = true;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');
                    $scope.CurrentAdditionalGrid = data.NumberOfApplication;
                }
                else {
                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "ResourceSheet") {
                        $scope.isEditClicked = true;
                        $routeParams.GroupId = data.PriceSheetId;
                        $scope.Version = data.Version;
                        $scope.SheetLockedMessage = '';
                        $scope.$broadcast('timer-reset');
                        $scope.$broadcast('timer-start');
                    }
                    else {
                        $scope.isEditClicked = false;
                        $scope.SheetLockedMessage = "LockedIn: " + data.LockedIn + " By " + data.LockedUser;
                    }
                }
                $scope.getservicedata();
                $timeout(function() {
                    angular.element(document.querySelector('#loader')).addClass('hide');
                }, 500);

            }).error(function(error) {
                $scope.Error = error;
            })
        }).error(function(error) {
            $scope.Error = error;
        })
    }

    $scope.IncreaseAdditionalTimeToSheet = function() {
        var LockSheetModel = { GroupId: $scope.MaxGroupID, username: $scope.LoggedUser, LockedInApp: 'ResourceSheet' };
        ResourceService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function(data) {
            if (!data.IsLocked) {
                $scope.isEditClicked = true;
                $scope.$broadcast('timer-add-cd-seconds', 840);
                $('#showTimeout').modal('hide');
            }
            else {
                $scope.SheetLockedMessage = data.LockedUser;

                if (data.LockedUser == $scope.LoggedUser) {
                    $scope.isEditClicked = true;
                    $scope.counter = 0;
                    $scope.$broadcast('timer-add-cd-seconds', 840);
                    $('#showTimeout').modal('hide');
                }
                else {
                    $scope.isEditClicked = true;
                    $scope.SheetLockedMessage = 'Error occured..';
                }
            }
        }).error(function(error) {
            $scope.Error = error;
        })
    }

    $scope.IgnoreResourceChanges = function() {
        priceService.ReleaseSheetWhenExpired($scope.MaxGroupID).success(function(data) {
            $scope.isEditClicked = false;
            if ($scope.IsLeavingResource)
                redirectRefreshPage($routeParams.OppId, $scope.MaxGroupID);
        }).error(function(error) {
            $scope.Error = error;
        })
    }

    $scope.GetYear = function(row) {
        try {
            var resourceInfo = $scope.ResourcingData[row];
            if (resourceInfo.Unit != undefined && resourceInfo.UnitRate != 0 &&
                (resourceInfo.UnitCount1 != 0 || resourceInfo.UnitCount2 != 0 || resourceInfo.UnitCount3 != 0 || resourceInfo.UnitCount4 != 0 || resourceInfo.UnitCount5 != 0) &&
                (resourceInfo.HeadCount1 != 0 || resourceInfo.HeadCount2 != 0 || resourceInfo.HeadCount3 != 0 || resourceInfo.HeadCount4 != 0 || resourceInfo.HeadCount5 != 0)) {

                console.log('Calculating year..');
                var uc = 0;
                var hike = OppConfig.SalaryHike;
                var penalty = OppConfig.Penalty;
                var spike = OppConfig.SalarySpike;
                var margin = (resourceInfo.Margin == undefined || resourceInfo.Margin == null || resourceInfo.Margin == '') ? OppConfig.Margin : resourceInfo.Margin;
                var headCount = 0;
                var multiplier = 0;
                var maxDur = 0;
                var withHike = 0;
                var withSpike = 0;
                var withPenalty = 0;
                var withMargin = 0;
                var unitCountArray = [];
                var fromYear = 0;
                var yearCount = 0;

                if (resourceInfo.HeadCount1 != 0) {
                    headCount = resourceInfo.HeadCount1;
                    fromYear = 1;
                    yearCount = 5;
                }
                else if (resourceInfo.HeadCount2 != 0) {
                    headCount = resourceInfo.HeadCount2;
                    fromYear = 2;
                    yearCount = 4;
                }
                else if (resourceInfo.HeadCount3 != 0) {
                    headCount = resourceInfo.HeadCount3;
                    fromYear = 3;
                    yearCount = 3;
                }
                else if (resourceInfo.HeadCount4 != 0) {
                    headCount = resourceInfo.HeadCount4;
                    fromYear = 4;
                    yearCount = 2;
                }
                else if (resourceInfo.HeadCount5 != 0) {
                    headCount = resourceInfo.HeadCount5;
                    fromYear = 5;
                    yearCount = 1;
                }

                switch (resourceInfo.Unit) {
                    case 'Hour':
                        multiplier = 0.125; // 1 hour = 1/8 days
                        maxDur = 2016;
                        break;
                    case 'Month':
                        multiplier = 21; // 1 month = 21 days
                        maxDur = 12;
                        break;
                    case 'Year':
                        multiplier = 252; // 1 year = 252 days
                        maxDur = 1;
                        break;
                    default:
                        break;
                }
                console.log('Filling up unitcount for years..');

                if (multiplier > 0) {

                    var temp = {};
                    temp.Duration1 = resourceInfo.UnitCount1;
                    temp.Duration2 = resourceInfo.UnitCount2;
                    temp.Duration3 = resourceInfo.UnitCount3;
                    temp.Duration4 = resourceInfo.UnitCount4;
                    temp.Duration5 = resourceInfo.UnitCount5;

                    for (var c = 1; c <= 5; c++) {
                        var ucYearCurr = 'Duration' + c;
                        var ucYearNext = 'Duration' + (c + 1);

                        if (c < 5 && temp[ucYearCurr] > maxDur) {
                            temp[ucYearNext] += (temp[ucYearCurr] - maxDur);
                            temp[ucYearCurr] = maxDur;
                        }
                    }

                    var ucLength = 0;
                    for (var c = 1; c <= 5; c++) {
                        var dur = 'Duration' + c;
                        if (temp[dur] > 0)
                            ucLength++;
                    }

                    console.log('Final Calculations..');
                    var j = 0;
                    for (var inx = 0; inx < 5; inx++) {
                        var year = 'Year' + (inx + 1);
                        var prevyear = 'Year' + inx;
                        var penaltyYear = 'PenaltyYear' + (inx + 1);
                        var overhearYear = 'OverheadYear' + (inx + 1);
                        var marginYear = 'MarginYear' + (inx + 1);
                        var durYear = 'Duration' + (inx + 1);

                        if (inx < fromYear - 1) {
                            resourceInfo[year] = 0;
                        }
                        else {
                            if (inx == fromYear - 1 && j == 0) //First year is calculated without Hike
                            {
                                var baseValY1 = (resourceInfo.UnitRate / multiplier) * (temp[durYear] * multiplier) * headCount;
                                withPenalty = 0;
                                withSpike = 0;

                                if (baseValY1 > 0) {
                                    withPenalty = baseValY1 * penalty / 100;
                                    withSpike = baseValY1 * spike / 100;
                                }
                                resourceInfo[year] = baseValY1;
                                resourceInfo[penaltyYear] = withPenalty;
                                resourceInfo[overhearYear] = withSpike;
                                resourceInfo[marginYear] = (resourceInfo[year] / (1 - (margin / 100))) + withPenalty + withSpike;
                                //resourceInfo[durYear] = unitCountArray[j];
                                j++;
                            }
                            else if (j < ucLength) {
                                withHike = 0;
                                withPenalty = 0;
                                withSpike = 0;
                                //var baseval = (resourceInfo[prevyear]/multiplier) * resourceInfo[durYear];
                                var baseval = ((resourceInfo.UnitRate / multiplier) * (temp[durYear] * multiplier) * (1 + (hike / 100))) * headCount;
                                if (baseval > 0) {
                                    //withHike = baseval * hike / 100;
                                    withPenalty = baseval * penalty / 100;
                                    withSpike = baseval * spike / 100;
                                }
                                resourceInfo[year] = baseval;
                                resourceInfo[penaltyYear] = withPenalty;
                                resourceInfo[overhearYear] = withSpike;
                                resourceInfo[marginYear] = (resourceInfo[year] / (1 - (margin / 100))) + withPenalty + withSpike;
                                //resourceInfo[durYear] = unitCountArray[j];
                                j++;
                            }
                        }
                    }
                    $scope.ResourcingData[row] = resourceInfo;
                    $scope.resourceGrid.api.refreshView();
                }
            }
        }
        catch (ex) {
            console.log('Error occurred when calculating Year value: ' + ex);
        }
    }

    $scope.AddResourceRow = function() {

        angular.element(document.getElementById('btnaddResource'))[0].disabled = true;
        angular.element(document.querySelector('#loader')).removeClass('hide');
        var selectedRows = $scope.resourceGrid.api.getSelectedNodes();
        var curentId = 0;
        if ($scope.resourceGrid.rowData.length == 0) {
            curentId = 1;
        }
        else {
            maxindex = $scope.resourceGrid.rowData.length - 1;
            var curentId = $scope.resourceGrid.rowData[maxindex].RowNo + 1;
        }

        if (selectedRows.length > 0) {
            var alterrows = selectedRows[0].childIndex + 1;
            var newid = alterrows + 1;

            $scope.RefreshRegion($scope.OppDetail.SBUId, newid - 1);
            $scope.ResourcingData.splice(alterrows, 0, {
                'RowNo': newid,
                'OppId': $scope.OppDetail.OppId,
                'LOB': $scope.ResourcingData[newid - 2].LOB,
                'SBU': $scope.ResourcingData[newid - 2].SBU,
                'Region': $scope.ResourcingData[newid - 2].Region,
                'ResourceType': '',
                'Experience': 0,
                'Unit': '',
                'UnitRate': 0,
                'UnitCount1': 0,
                'UnitCount2': 0,
                'UnitCount3': 0,
                'UnitCount4': 0,
                'UnitCount5': 0,
                'HeadCount1': 0,
                'HeadCount2': 0,
                'HeadCount3': 0,
                'HeadCount4': 0,
                'HeadCount5': 0,
                'Year1': 0,
                'Year2': 0,
                'Year3': 0,
                'Year4': 0,
                'Year5': 0,
                Margin: OppConfig.Margin
            });

            for (alterrows; alterrows < $scope.resourceGrid.rowData.length; alterrows++) {
                $scope.ResourcingData[alterrows].RowNo = alterrows + 1;
            }

        }
        else {
            $scope.RefreshRegion($scope.OppDetail.SBUId, curentId - 1);
            $scope.ResourcingData.push({
                'RowNo': curentId,
                'OppId': $scope.OppDetail.OppId,
                'LOB': '',
                'SBU': $scope.OppDetail.SBUId,
                'Region': $scope.OppDetail.CountryId,
                'ResourceType': '',
                'Experience': 0,
                'Unit': '',
                'UnitRate': 0,
                'UnitCount1': 0,
                'UnitCount2': 0,
                'UnitCount3': 0,
                'UnitCount4': 0,
                'UnitCount5': 0,
                'HeadCount1': 0,
                'HeadCount2': 0,
                'HeadCount3': 0,
                'HeadCount4': 0,
                'HeadCount5': 0,
                'Year1': 0,
                'Year2': 0,
                'Year3': 0,
                'Year4': 0,
                'Year5': 0,
                Margin: OppConfig.Margin
            });
        }
        $scope.resourceGrid.rowData = $scope.ResourcingData;
        $scope.resourceGrid.api.setRowData($scope.ResourcingData);
        $timeout(function() {
            $scope.resourceGrid.api.refreshView();
        }, 500);


        $timeout(function() {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 500);

        angular.element(document.getElementById('btnaddResource'))[0].disabled = false;
    }

    $scope.DeleteResourceRow = function() {
        angular.element(document.querySelector('#loader')).removeClass('hide');

        var selected = $scope.resourceGrid.api.getFocusedCell();
        if (selected == null) {
            toaster.pop('error', "Error", 'Please select row to delete', null);
        }
        else {
            $scope.ResourcingData.splice(selected.rowIndex, 1);
            toaster.pop('success', "Success", 'Row ' + (parseFloat(selected.rowIndex) + 1) + ' deleted successfully', null);
            var alterrows = selected.rowIndex;
            for (alterrows; alterrows < $scope.resourceGrid.rowData.length; alterrows++) {
                $scope.ResourcingData[alterrows].RowNo = alterrows + 1;
            }
            $scope.resourceGrid.api.setRowData($scope.ResourcingData);
            $scope.resourceGrid.rowData = $scope.ResourcingData;
        }
        $timeout(function() {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 500);
    }

    $scope.dynamicPopover = {
        templateUrl: 'myPopoverTemplate.html',
    };

    // pop up data 

    $scope.closepopup = function() {
        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
    }

    $scope.finished = function() {
        $('#showTimeout').modal('show');
    }

    $scope.SaveResourcingPop = function() {
        $('#ShowSave').modal('show');
    }

    $scope.CancelResourceSheet = function() {
        $('#ShowSave').modal('hide');
    }

    $scope.SaveAsResourcingPop = function() {
        if ($routeParams.GroupId == 'undefined') {
            toaster.pop('warning', "Warning", "Minimum one version is required to create new version", 3000);
        }
        else {
            $('#showSaveAs').modal('show');
        }
    }

    $scope.CancelResourceSheetsaveas = function() {
        $('#showSaveAs').modal('hide');
    }

    $scope.$on("$locationChangeStart", function(event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.isEditClicked) {
            $('#showUnsaved').modal('show');
            event.preventDefault();
        }
    });

    $scope.saveasResourceSheetdiscard = function() {
        $scope.IsLeavingResource = false;
        $scope.SaveResourcing(true)
        $('#showUnsaved').modal('hide');
    }

    $scope.CancelResourceSheetdiscard = function() {
        $scope.isEditClicked = false;
        $scope.IsLeavingResource = false;
        $scope.IgnoreResourceChanges();
        $('#showUnsaved').modal('hide');
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.CloseResourceSheetdiscard = function() {
        $('#showUnsaved').modal('hide');
    }

    //------------Functions-------------------//

    function redirectRefreshPage(oppId, groupId) {
        $location.path("Resource/" + oppId + "/" + groupId);
    }

    function validatedata() {
        for (var j = 0; j < $scope.ResourcingData.length; j++) {
            try {
                if ($scope.ResourcingData[j].LOB == '') {
                    toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' is incomplete!', null);
                    return false;
                }
                if ($scope.ResourcingData[j].SBU == '') {
                    toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' is incomplete!', null);
                    return false;
                }
                if ($scope.ResourcingData[j].Unit == '') {
                    toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' is incomplete!', null);
                    return false;
                }
                else {
                    switch ($scope.ResourcingData[j].Unit) {
                        case 'Hour':
                            if ($scope.ResourcingData[j].UnitCount5 > 2016) { // 1 yr = 252 * 8 = 2016
                                toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' has invalid Duration!', null);
                                return false;
                            }
                            break;
                        case 'Month':
                            if ($scope.ResourcingData[j].UnitCount5 > 12) {
                                toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' has invalid Duration!', null);
                                return false;
                            }
                            break;
                        case 'Year':
                            if ($scope.ResourcingData[j].UnitCount5 > 1) {
                                toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' has invalid Duration!', null);
                                return false;
                            }
                            break;
                    }
                }
            }
            catch (ex) {
                console.log(ex);
            }
        }
        return true;
    }

    function AddSheetInternalcall(Jsondata) {
        ResourceService.AddResource(Jsondata).success(function(data) {
            if (data.Error == '' || data.Error == undefined || data.Error == null) {
                $scope.isEditClicked = false;

                if ($scope.IsLeavingResource)
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                else {
                    $window.location.href = $scope.newnavigateURl;
                }
                toaster.pop('success', "Save", 'Resource Sheet Saved Successfully', 3000);
                return true;
            }
            else {

                toaster.pop('error', "Error", data.Error, null);
            }

        }).error(function(error) {
            console.log("failure message: " + JSON.stringify(error));
        });
    }
    //------------Initialization Calls----------//
    $scope.GetRightsList();
    $scope.GetAllLOBList();
    $scope.GetAllSBU();
    $scope.GetOpportunityConfiguration();
    $scope.GetOpportunityList($routeParams.OppId);

});





