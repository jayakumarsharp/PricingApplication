ReportApp.controller('TandEController', function ($scope, $rootScope, $timeout, $filter, $location, $window, $routeParams, toaster, reportFactory, OppFactory,
    Opportunityservice, UserFactory, TandEService, ResourceService, EstimationApplicationMasterService, priceService) {

    // ---- Variables Definition ------//

    $scope.MaxGroupID = $routeParams.GroupId;
    $scope.OppId = $routeParams.OppId;
    $scope.GroupId = $routeParams.GroupId;
    $scope.LoggedUser = $rootScope.UserInfo.user.userId;

    $scope.Version = '';
    $scope.SheetLockedMessage = '';

    $scope.isTandEEditable = false;
    $scope.isEditClicked = false;
    $scope.DefautState = false;
    $scope.IsLeavingTandE = true;

    $scope.TandEData = [];
    $scope.ResourceData = [];
    $scope.Region = [];
    $scope.SBUList = [];
    $scope.LOBList = [];
    $scope.OppDetail = {};
    $scope.Versions = [];
    $scope.RegionCollection = [];

    $scope.VersionInfo = {};

    var OppConfig = {};
    var resourcingValue = {};
    var totalrow = [];

    //--------------End-------------------//

    // -----------TandE Grid ----------------//

    var columnDefTimeMat = [
        {
            headerName: " # ", field: "RowNo", width: 40, pinned: true, cellRenderer: function (params) {
                if (params.value == 0) {
                    return '';
                }
                else
                    return params.value;
            }
        },
        {
            headerName: "Description", field: "Description", width: 200, pinned: true, cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    if ($scope.isEditClicked) {
                        if (params.data.EditableDesc)
                            return '<span><input id="resTypeTxt" ng-disabled="false" ng-model="TandEData[' + params.rowIndex + '].Description" />';
                        else
                            return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="TandEData[' + params.rowIndex + '].Description" />';
                    }
                    else
                        return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="TandEData[' + params.rowIndex + '].Description" />';
                }
                else
                    return '<b>' + params.value + '</b>';

            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Description</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: 'Duration',
            groupId: "GroupHC",
            headerTooltip: "Duration",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "UnitCount1",
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "UnitCount2", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "UnitCount3", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "UnitCount4", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "UnitCount5", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                }]
        },
        {
            headerName: 'Resource Count',
            groupId: "GroupRC",
            headerTooltip: "Resource Count",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "ResourceCount1",
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "ResourceCount2", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "ResourceCount3", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "ResourceCount4", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "ResourceCount5", columnGroupShow: 'closed',
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }, cellRenderer: function (params) {
                        if (params.data.Description == 'TOTAL') {
                            return '';
                        }
                        else
                            return params.value;
                    }
                }]
        },
        {
            headerName: 'Change Resource Count To',
            groupId: "GroupChangeRC",
            headerTooltip: "Change Resource Count To",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "ChangeResourceCountTo1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input type="number" id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + ' min=0 ng-model="TandEData[' + params.rowIndex + '].ChangeResourceCountTo1"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "ChangeResourceCountTo2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input type="number" id="yearsTxt2" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + ' min=0 ng-model="TandEData[' + params.rowIndex + '].ChangeResourceCountTo2"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "ChangeResourceCountTo3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input type="number" id="yearsTxt3" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + ' min=0 ng-model="TandEData[' + params.rowIndex + '].ChangeResourceCountTo3"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "ChangeResourceCountTo4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input type="number" id="yearsTxt4" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + ' min=0 ng-model="TandEData[' + params.rowIndex + '].ChangeResourceCountTo4"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "ChangeResourceCountTo5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input type="number" id="yearsTxt5" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + ' min=0 ng-model="TandEData[' + params.rowIndex + '].ChangeResourceCountTo5"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                }]
        },
        {
            headerName: 'Onsite %',
            groupId: "GroupOnsitePer",
            headerTooltip: "Onsite %",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "OnsitePercent1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsitePercent1"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "OnsitePercent2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsitePercent2"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "OnsitePercent3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsitePercent3"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "OnsitePercent4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsitePercent4"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "OnsitePercent5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsitePercent5"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                }]
        },
        {
            headerName: 'Average Travels per Resource',
            groupId: "GroupAvg",
            headerTooltip: "Average Travels per Resource",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "AvgTravel1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AvgTravel1"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "AvgTravel2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AvgTravel2"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "AvgTravel3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AvgTravel3"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "AvgTravel4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AvgTravel4"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "AvgTravel5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AvgTravel5"'
                                + ' ng-blur="GetValues(' + params.rowIndex + ')" '
                                + '/></span>';
                        }
                        else
                            return '';
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    }
                }]
        },
        {
            headerName: 'Onsite Business Days',
            groupId: "GroupOnsiteBusiness",
            headerTooltip: "Onsite Business Days",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "OnsiteBusinessDays1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsiteBusinessDays1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "OnsiteBusinessDays2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsiteBusinessDays2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "OnsiteBusinessDays3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsiteBusinessDays3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "OnsiteBusinessDays4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsiteBusinessDays4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "OnsiteBusinessDays5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].OnsiteBusinessDays5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                }]
        },
        {
            headerName: 'Effective Business Days',
            groupId: "GroupEffectiveBusiness",
            headerTooltip: "Effective Business Days",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "EffectiveBusinessDays1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].EffectiveBusinessDays1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "EffectiveBusinessDays2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].EffectiveBusinessDays2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "EffectiveBusinessDays3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].EffectiveBusinessDays3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "EffectiveBusinessDays4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].EffectiveBusinessDays4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "EffectiveBusinessDays5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].EffectiveBusinessDays5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                }]
        },
        {
            headerName: 'Travel Man Days',
            groupId: "GroupTravelManDays",
            headerTooltip: "Travel Man Days",
            children: [
                {
                    headerName: "Year 1", width: 60, field: "TravelManDays1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].TravelManDays1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 2", width: 60, field: "TravelManDays2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].TravelManDays2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 3", width: 60, field: "TravelManDays3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].TravelManDays3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 4", width: 60, field: "TravelManDays4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].TravelManDays4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 5", width: 60, field: "TravelManDays5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].TravelManDays5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 0);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                }]
        },
        {
            headerName: 'Visa',
            groupId: "GroupVisa",
            headerTooltip: "Visa",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "Visa1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Visa1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 2", width: 100, field: "Visa2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Visa2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 3", width: 100, field: "Visa3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Visa3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 4", width: 100, field: "Visa4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Visa4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 5", width: 100, field: "Visa5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Visa5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
            headerName: 'Air Fare (2 Way)',
            groupId: "GroupAirFare",
            headerTooltip: "Air Fare (2 Way)",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "AirFare1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AirFare1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 2", width: 100, field: "AirFare2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AirFare2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 3", width: 100, field: "AirFare3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AirFare3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 4", width: 100, field: "AirFare4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AirFare4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 5", width: 100, field: "AirFare5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].AirFare5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
            headerName: 'Accomodation',
            groupId: "GroupAccomodation",
            headerTooltip: "Accomodation",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "Accomodation1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Accomodation1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 2", width: 100, field: "Accomodation2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Accomodation2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 3", width: 100, field: "Accomodation3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Accomodation3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 4", width: 100, field: "Accomodation4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Accomodation4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 5", width: 100, field: "Accomodation5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Accomodation5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
            headerName: 'Per-Diem & Laundry',
            groupId: "GroupPerDiem",
            headerTooltip: "Per-Diem & Laundry",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "PerDiem1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].PerDiem1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 2", width: 100, field: "PerDiem2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].PerDiem2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 3", width: 100, field: "PerDiem3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].PerDiem3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 4", width: 100, field: "PerDiem4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].PerDiem4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 5", width: 100, field: "PerDiem5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].PerDiem5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
            headerName: 'Local Conveyance',
            groupId: "GroupLocalConveyance",
            headerTooltip: "Local Conveyance",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "LocalConveyance1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].LocalConveyance1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 2", width: 100, field: "LocalConveyance2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].LocalConveyance2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 3", width: 100, field: "LocalConveyance3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].LocalConveyance3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 4", width: 100, field: "LocalConveyance4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].LocalConveyance4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 5", width: 100, field: "LocalConveyance5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].LocalConveyance5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
            headerName: 'Misc',
            groupId: "GroupMisc",
            headerTooltip: "Misc",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "Misc1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Misc1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 2", width: 100, field: "Misc2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Misc2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 3", width: 100, field: "Misc3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Misc3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 4", width: 100, field: "Misc4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Misc4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 5", width: 100, field: "Misc5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Misc5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            if (params.data.Description == 'TOTAL')
                                return true;
                        }
                    },
                    cellRenderer: function (params) {
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
            headerName: 'Total',
            groupId: "GroupTotal",
            headerTooltip: "Total",
            children: [
                {
                    headerName: "Year 1", width: 100, field: "Total1", cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Total1"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 2", width: 100, field: "Total2", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Total2"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 3", width: 100, field: "Total3", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Total3"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 4", width: 100, field: "Total4", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Total4"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        }
                    },
                    cellRenderer: function (params) {
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
                    headerName: "Year 5", width: 100, field: "Total5", columnGroupShow: 'closed', cellRenderer: function (params) {
                        if (params.data.Description != 'TOTAL') {
                            return '<span><input id="yearsTxt" ng-disabled="true" '
                                + 'type="number" min=0 ng-model="TandEData[' + params.rowIndex + '].Total5"'
                                + '/></span>';
                        }
                        else
                            return params.value;
                    },
                    cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        }
                    },
                    cellRenderer: function (params) {
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

    $scope.tandEGrid = {
        rowSelection: 'single',
        headerHeight: 36,
        rowHeight: 24,
        angularCompileRows: true,
        singleClickEdit: true,
        suppressRowClickSelection: false,
        columnDefs: columnDefTimeMat,
        groupHeaders: true,
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

    $scope.GetOpportunityList = function (id) {
        Opportunityservice.GetopportunitybyID(id).success(function (data) {
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

    $scope.GetAllVersions = function () {
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
        priceService.GetPriceSheetVersionsForOpp($scope.OppDetail.OppId).success(function (data) {
            $scope.Versions = data;
            $scope.VersionInfo = {};
            _.each($scope.Versions, function (value, key) {
                if (value["PriceSheetId"] == $scope.GlobalGroupId) {

                    $scope.VersionInfo = value;
                    $scope.Version = value["Version"];
                }
            });


        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.getservicedata = function () {
        if ($routeParams.GroupId != 'undefined') {
            console.log('Getting service data..');
            $scope.TandEData = [];
            $scope.ResourceData = [];
            totalrow = []
            ResourceService.GetAllResourcebyOppGroupID($scope.OppDetail.OppId, $scope.MaxGroupID).success(function (resource) {
                if (resource.length > 0) {
                    $scope.ResourceData = resource;
                    TandEService.GetAllTandEbyOppGroupID($scope.OppDetail.OppId, $scope.MaxGroupID).success(function (data) {
                        if (data.Error == null) {
                            $scope.TandEData = data;
                            if (data.length == 0) {
                                var i = 1;
                                angular.forEach($scope.ResourceData, function (value, key) {
                                    $scope.TandEData.push({
                                        RowNo: i, Description: value.ResourceType, Unit: value.Unit,
                                        UnitCount1: value.UnitCount1,
                                        UnitCount2: value.UnitCount2,
                                        UnitCount3: value.UnitCount3,
                                        UnitCount4: value.UnitCount4,
                                        UnitCount5: value.UnitCount5,
                                        ResourceCount1: value.HeadCount1,
                                        ResourceCount2: value.HeadCount2,
                                        ResourceCount3: value.HeadCount3,
                                        ResourceCount4: value.HeadCount4,
                                        ResourceCount5: value.HeadCount5,
                                        // ChangeResourceCountTo1: '',
                                        // ChangeResourceCountTo2: '',
                                        // ChangeResourceCountTo3: '',
                                        // ChangeResourceCountTo4: '',
                                        // ChangeResourceCountTo5: '',        
                                        OnsitePercent1: 0,
                                        OnsitePercent2: 0,
                                        OnsitePercent3: 0,
                                        OnsitePercent4: 0,
                                        OnsitePercent5: 0,
                                        AvgTravel1: 0,
                                        AvgTravel2: 0,
                                        AvgTravel3: 0,
                                        AvgTravel4: 0,
                                        AvgTravel5: 0,
                                        OnsiteBusinessDays1: 0,
                                        OnsiteBusinessDays2: 0,
                                        OnsiteBusinessDays3: 0,
                                        OnsiteBusinessDays4: 0,
                                        OnsiteBusinessDays5: 0,
                                        EffectiveBusinessDays1: 0,
                                        EffectiveBusinessDays2: 0,
                                        EffectiveBusinessDays3: 0,
                                        EffectiveBusinessDays4: 0,
                                        EffectiveBusinessDays5: 0,
                                        TravelManDays1: 0,
                                        TravelManDays2: 0,
                                        TravelManDays3: 0,
                                        TravelManDays4: 0,
                                        TravelManDays5: 0,
                                        Visa1: 0,
                                        Visa2: 0,
                                        Visa3: 0,
                                        Visa4: 0,
                                        Visa5: 0,
                                        AirFare1: 0,
                                        AirFare2: 0,
                                        AirFare3: 0,
                                        AirFare4: 0,
                                        AirFare5: 0,
                                        Accomodation1: 0,
                                        Accomodation2: 0,
                                        Accomodation3: 0,
                                        Accomodation4: 0,
                                        Accomodation5: 0,
                                        PerDiem1: 0,
                                        PerDiem2: 0,
                                        PerDiem3: 0,
                                        PerDiem4: 0,
                                        PerDiem5: 0,
                                        LocalConveyance1: 0,
                                        LocalConveyance2: 0,
                                        LocalConveyance3: 0,
                                        LocalConveyance4: 0,
                                        LocalConveyance5: 0,
                                        Misc1: 0,
                                        Misc2: 0,
                                        Misc3: 0,
                                        Misc4: 0,
                                        Misc5: 0,
                                        Total1: 0,
                                        Total2: 0,
                                        Total3: 0,
                                        Total4: 0,
                                        Total5: 0
                                    });

                                    i++;
                                });

                                totalrow.push({
                                    RowNo: '', Description: 'TOTAL',
                                    UnitCount1: '',
                                    UnitCount2: '',
                                    UnitCount3: '',
                                    UnitCount4: '',
                                    UnitCount5: '',
                                    ResourceCount1: '',
                                    ResourceCount2: '',
                                    ResourceCount3: '',
                                    ResourceCount4: '',
                                    ResourceCount5: '',
                                    ChangeResourceCountTo1: '',
                                    ChangeResourceCountTo2: '',
                                    ChangeResourceCountTo3: '',
                                    ChangeResourceCountTo4: '',
                                    ChangeResourceCountTo5: '',
                                    OnsitePercent1: '',
                                    OnsitePercent2: '',
                                    OnsitePercent3: '',
                                    OnsitePercent4: '',
                                    OnsitePercent5: '',
                                    AvgTravel1: '',
                                    AvgTravel2: '',
                                    AvgTravel3: '',
                                    AvgTravel4: '',
                                    AvgTravel5: '',
                                    OnsiteBusinessDays1: 0,
                                    OnsiteBusinessDays2: 0,
                                    OnsiteBusinessDays3: 0,
                                    OnsiteBusinessDays4: 0,
                                    OnsiteBusinessDays5: 0,
                                    EffectiveBusinessDays1: 0,
                                    EffectiveBusinessDays2: 0,
                                    EffectiveBusinessDays3: 0,
                                    EffectiveBusinessDays4: 0,
                                    EffectiveBusinessDays5: 0,
                                    TravelManDays1: 0,
                                    TravelManDays2: 0,
                                    TravelManDays3: 0,
                                    TravelManDays4: 0,
                                    TravelManDays5: 0,
                                    Visa1: 0,
                                    Visa2: 0,
                                    Visa3: 0,
                                    Visa4: 0,
                                    Visa5: 0,
                                    AirFare1: 0,
                                    AirFare2: 0,
                                    AirFare3: 0,
                                    AirFare4: 0,
                                    AirFare5: 0,
                                    Accomodation1: 0,
                                    Accomodation2: 0,
                                    Accomodation3: 0,
                                    Accomodation4: 0,
                                    Accomodation5: 0,
                                    PerDiem1: 0,
                                    PerDiem2: 0,
                                    PerDiem3: 0,
                                    PerDiem4: 0,
                                    PerDiem5: 0,
                                    LocalConveyance1: 0,
                                    LocalConveyance2: 0,
                                    LocalConveyance3: 0,
                                    LocalConveyance4: 0,
                                    LocalConveyance5: 0,
                                    Misc1: 0,
                                    Misc2: 0,
                                    Misc3: 0,
                                    Misc4: 0,
                                    Misc5: 0,
                                    Total1: 0,
                                    Total2: 0,
                                    Total3: 0,
                                    Total4: 0,
                                    Total5: 0
                                });
                            }
                            else {
                                angular.forEach($scope.ResourceData, function (res, key) {
                                    angular.forEach($scope.TandEData, function (te, key) {
                                        if (res.Description == te.ResourceType)
                                            te.Unit = res.Unit;
                                    });
                                });
                                totalrow.push(data[data.length - 1]);
                                $scope.TandEData.splice(data.length - 1, 1);
                            }
                        }

                        $scope.tandEGrid.api.setRowData($scope.TandEData);
                        $scope.tandEGrid.api.setFloatingBottomRowData(totalrow);
                        $scope.tandEGrid.rowData = $scope.TandEData;
                        $timeout(function () {
                            $scope.tandEGrid.api.refreshView();
                        }, 500);
                    }).error(function (error) {
                        console.log('Error occurred: ' + error);
                        $scope.Error = error;
                    });
                }
            }).error(function (error) {
                console.log('Error occurred: ' + error);
                $scope.Error = error;
            });
        }
    };

    $scope.GetRightsList = function () {
        reportFactory.GetRightsList($scope.LoggedUser).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName.contains('TandE Write')) {
                    $scope.isTandEEditable = true;
                }
            });
        });
    };

    $scope.GetOpportunityConfiguration = function () {
        Opportunityservice.GetOpportunityConfigurationByID($routeParams.OppId).success(function (data) {
            if (data.length > 0) {
                OppConfig = data[0];
            }
            else {
                OppConfig = {};
            }
        }).error(function (error) {
            $scope.Error = error;
        })
    };

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

    $scope.SaveTandE = function (isDiscard) {
        if (validatedata()) {
            var data = $scope.TandEData;
            $scope.TandEData.push(totalrow[0]);
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

            var Jsondata = { OppId: $scope.OppDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxGroupID, Comment: '', Version: $scope.Version, TandESheet: data, Author: $scope.LoggedUser, NumberofApp: 0 };
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

    $scope.SaveAsTandE = function () {
        priceService.GetMaximumGroupPriceSheetId().success(function (data) {
            if (data[0].count == 'null') {
                $scope.MaxGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxGroupIDForSaveAs = data[0].count + 1;
            }

            $scope.TandEData.push(totalrow[0]);
            for (var j = 0; j < $scope.TandEData.length; j++) {
                try {
                    delete $scope.TandEData[j].Id;
                    $scope.TandEData[j].OppId = $scope.OppDetail.OppId;
                    $scope.TandEData[j].GroupId = $scope.MaxGroupIDForSaveAs;
                }
                catch (ex) {
                    console.log(ex);
                }
            }
            var maxid = _.max($scope.Versions, function (maxdata) { return parseFloat(maxdata.ApplicationId); });
            var currentversion = maxid.Version.split('_')[1];
            var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
            var version = 'Ver_' + i;

            $routeParams.GroupId = $scope.MaxGroupIDForSaveAs;

            var Jsondata = {
                ExisitingPriceGroupId: $scope.MaxGroupID, OppId: $scope.OppDetail.OppId, IsSaveAs: true, ApplicationId: $scope.MaxGroupIDForSaveAs,
                AppId: $scope.MaxGroupIDForSaveAs, IsReadOnly: $scope.isEditClicked, TandESheet: $scope.TandEData,
                Comment: $scope.SaveComment, Author: $scope.LoggedUser, IsEditable: true
            };
            Jsondata.Version = version;
            //Jsondata.NumberofApp = $scope.CurrentAdditionalGrid
            TandEService.AddTandENewVersion(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.isEditClicked = false;
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                    toaster.pop('success', "Save", 'New Version of TandE Sheet Saved Successfully', 3000);
                }
                else {
                    toaster.pop('error', "Error", data.Error, 3000);
                }
            }).error(function (error) {
                console.log("failure message: " + JSON.stringify(error));
            });
        });
        $('#showSaveAs').modal('hide');
    }

    $scope.EditTandE = function () {
        angular.element(document.querySelector('#loader')).removeClass('hide');

        priceService.GetMaximumGroupPriceSheetId().success(function (data) {

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

            var LockSheetModel = { OppId: $scope.OppDetail.OppId, GroupId: $scope.MaxGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'TandESheet', IsTandESheetUpdated: true };

            TandEService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {
                if (!data.IsLocked) {
                    $routeParams.GroupId = data.ApplicationId;
                    $scope.Version = data.Version;
                    $scope.isEditClicked = true;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');
                    $scope.CurrentAdditionalGrid = data.NumberOfApplication;
                }
                else {
                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "TandESheet") {
                        $scope.isEditClicked = true;
                        $routeParams.GroupId = data.ApplicationId;
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

    $scope.IncreaseAdditionalTimeToSheet = function () {
        var LockSheetModel = { GroupId: $scope.MaxGroupID, username: $scope.LoggedUser, LockedInApp: 'TandESheet' };
        TandEService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
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
        }).error(function (error) {
            $scope.Error = error;
        })
    }

    $scope.IgnoreTandEChanges = function () {
        priceService.ReleaseSheetWhenExpired($scope.MaxGroupID).success(function (data) {
            $scope.isEditClicked = false;
            if ($scope.IsLeavingTandE)
                redirectRefreshPage($routeParams.OppId, $scope.MaxGroupID);
        }).error(function (error) {
            $scope.Error = error;
        })
    }

    $scope.GetValues = function (row) {
        try {
            var stinfo = $scope.TandEData[row];
            totalrow = [{}];

            // if (stinfo.AvgTravel1 != undefined && stinfo.AvgTravel1 != '' &&
            //     stinfo.AvgTravel2 != undefined && stinfo.AvgTravel2 != '' &&
            //     stinfo.AvgTravel3 != undefined && stinfo.AvgTravel3 != '' &&
            //     stinfo.AvgTravel4 != undefined && stinfo.AvgTravel4 != '' &&
            //     stinfo.AvgTravel5 != undefined && stinfo.AvgTravel5 != '' &&
            //     ) {
            console.log('Calculating t & e..');

            for (var i = 1; i <= 5; i++) {

                var multiplier = 0;
                switch (stinfo.Unit) {
                    case 'Hour':
                        multiplier = 2920; // 365 x 8 
                        break;
                    case 'Month':
                        multiplier = 12;
                        break;
                    case 'Year':
                        multiplier = 1;
                        break;
                    default:
                        break;
                }

                var mandays = 'ManDays' + i;
                var avgTravel = 'AvgTravel' + i;
                var onsiteBusinessDays = 'OnsiteBusinessDays' + i;
                var effectiveBusinessDays = 'EffectiveBusinessDays' + i;
                var travelManDays = 'TravelManDays' + i;
                var visa = 'Visa' + i;
                var airFare = 'AirFare' + i;
                var accomodation = 'Accomodation' + i;
                var perDiem = 'PerDiem' + i;
                var localConveyance = 'LocalConveyance' + i;
                var misc = 'Misc' + i;
                var total = 'Total' + i;
                var resourceCount = 'ResourceCount' + i;
                var unitCount = 'UnitCount' + i;
                var onsitePercent = 'OnsitePercent' + i;
                var changeResourceCountTo = 'ChangeResourceCountTo' + i;
                var unitCount = 'UnitCount' + i;

                stinfo[mandays] = multiplier * stinfo[unitCount] * stinfo[resourceCount]; //TODO: check !!

                stinfo[onsiteBusinessDays] = Math.ceil((stinfo[resourceCount] == 0 ? 0 : (stinfo[mandays] / stinfo[resourceCount]) * (stinfo[onsitePercent] / 100)));
                stinfo[effectiveBusinessDays] = (stinfo[onsiteBusinessDays] > 5 ? Math.ceil(Math.ceil(stinfo[onsiteBusinessDays] / 5) * 2 + stinfo[onsiteBusinessDays]) : stinfo[onsiteBusinessDays]);
                stinfo[travelManDays] = ((stinfo[onsitePercent] > 0 && stinfo[mandays] > 0) ? (stinfo[avgTravel] * 2 * stinfo[resourceCount]) : 0);
                stinfo[visa] = stinfo[onsitePercent] > 0 ? stinfo[avgTravel] * (OppConfig.Visa != undefined ? OppConfig.Visa : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : stinfo[resourceCount]) : 0;
                stinfo[airFare] = stinfo[onsitePercent] > 0 ? stinfo[avgTravel] * (OppConfig.AirFare != undefined ? OppConfig.AirFare : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : stinfo[resourceCount]) : 0;
                stinfo[accomodation] = stinfo[effectiveBusinessDays] * (OppConfig.Accommodation != undefined ? OppConfig.Accommodation : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : stinfo[resourceCount]);
                stinfo[perDiem] = stinfo[effectiveBusinessDays] * (OppConfig.PerDiemLaundry != undefined ? OppConfig.PerDiemLaundry : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : stinfo[resourceCount]);
                stinfo[localConveyance] = stinfo[effectiveBusinessDays] * (OppConfig.LocalConveyance != undefined ? OppConfig.LocalConveyance : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : stinfo[resourceCount]);
                stinfo[misc] = stinfo[effectiveBusinessDays] * (OppConfig.Miscellaneous != undefined ? OppConfig.Miscellaneous : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : stinfo[resourceCount]);
                stinfo[total] = stinfo[visa] + stinfo[airFare] + stinfo[accomodation] + stinfo[perDiem] + stinfo[localConveyance] + stinfo[misc];

                totalrow[0].RowNo = '';
                totalrow[0].Description = 'TOTAL';
                totalrow[0][unitCount] = '';
                totalrow[0][resourceCount] = '';
                totalrow[0][changeResourceCountTo] = '';
                totalrow[0][onsitePercent] = '';
                totalrow[0][avgTravel] = '';
                totalrow[0][onsiteBusinessDays] = 0;
                totalrow[0][effectiveBusinessDays] = 0;
                totalrow[0][travelManDays] = 0;
                totalrow[0][visa] = 0;
                totalrow[0][airFare] = 0;
                totalrow[0][accomodation] = 0;
                totalrow[0][perDiem] = 0;
                totalrow[0][localConveyance] = 0;
                totalrow[0][misc] = 0;
                totalrow[0][total] = 0;

                for (var j = 0; j < $scope.TandEData.length; j++) {
                    var sti = $scope.TandEData[j];

                    totalrow[0][onsiteBusinessDays] += sti[onsiteBusinessDays];
                    totalrow[0][effectiveBusinessDays] += sti[effectiveBusinessDays];
                    totalrow[0][travelManDays] += sti[travelManDays];
                    totalrow[0][visa] += sti[visa];
                    totalrow[0][airFare] += sti[airFare];
                    totalrow[0][accomodation] += sti[accomodation];
                    totalrow[0][perDiem] += sti[perDiem];
                    totalrow[0][localConveyance] += sti[localConveyance];
                    totalrow[0][misc] += sti[misc];
                    totalrow[0][total] += sti[total];
                }
            }

            $scope.TandEData[row] = stinfo;
            $scope.tandEGrid.api.setFloatingBottomRowData(totalrow);
            $scope.tandEGrid.api.refreshView();
            //}
        }
        catch (ex) {
            console.log('Error occurred when calculating Year value: ' + ex);
        }
    }



    $scope.DeleteTandERow = function () {
        angular.element(document.querySelector('#loader')).removeClass('hide');

        var selected = $scope.tandEGrid.api.getFocusedCell();
        if (selected == null) {
            toaster.pop('error', "Error", 'Please select row to delete', null);
        }
        else {
            $scope.TandEData.splice(selected.rowIndex, 1);
            toaster.pop('success', "Success", 'Row ' + (parseFloat(selected.rowIndex) + 1) + ' deleted successfully', null);
            var alterrows = selected.rowIndex;
            for (alterrows; alterrows < $scope.tandEGrid.rowData.length; alterrows++) {
                $scope.TandEData[alterrows].RowNo = alterrows + 1;
            }
            $scope.tandEGrid.api.setRowData($scope.TandEData);
            $scope.tandEGrid.rowData = $scope.TandEData;
        }
        $timeout(function () {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 500);
    }

    $scope.dynamicPopover = {
        templateUrl: 'myPopoverTemplate.html',
    };

    // pop up data 

    $scope.closepopup = function () {
        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
    }

    $scope.finished = function () {
        $('#showTimeout').modal('show');
    }

    $scope.SaveTandEPop = function () {
        $('#ShowSave').modal('show');
    }

    $scope.CancelTandESheet = function () {
        $('#ShowSave').modal('hide');
    }

    $scope.SaveAsTandEPop = function () {
        if ($routeParams.GroupId == 'undefined') {
            toaster.pop('warning', "Warning", "Minimum one version is required to create new version", 3000);
        }
        else {
            $('#showSaveAs').modal('show');
        }
    }

    $scope.CancelTandESheetsaveas = function () {
        $('#showSaveAs').modal('hide');
    }

    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.isEditClicked) {
            $('#showUnsaved').modal('show');
            event.preventDefault();
        }
    });

    $scope.saveasTandESheetdiscard = function () {
        $scope.IsLeavingTandE = false;
        $scope.SaveTandE(true)
        $('#showUnsaved').modal('hide');
    }

    $scope.CancelTandESheetdiscard = function () {
        $scope.isEditClicked = false;
        $scope.IsLeavingTandE = false;
        $scope.IgnoreTandEChanges();
        $('#showUnsaved').modal('hide');
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.CloseTandESheetdiscard = function () {
        $('#showUnsaved').modal('hide');
    }

    //------------Functions-------------------//

    function redirectRefreshPage(oppId, groupId) {
        $location.path("TandE/" + oppId + "/" + groupId);
    }

    function validatedata() {
        for (var j = 0; j < $scope.TandEData.length; j++) {
            try {
                if ($scope.TandEData[j].ManDays > 0 && $scope.TandEData[j].ResourceCount > 0) {
                    if ($scope.TandEData[j].ChangeResourceCountTo == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEData[j].RowNo + ' is incomplete!', null);
                        return false;
                    }
                    if ($scope.TandEData[j].AvgTravel == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEData[j].RowNo + ' is incomplete!', null);
                        return false;
                    }
                    if ($scope.TandEData[j].StaysOnsite == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEData[j].RowNo + ' is incomplete!', null);
                        return false;
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
        TandEService.AddTandE(Jsondata).success(function (data) {
            if (data.Error == '' || data.Error == undefined || data.Error == null) {
                $scope.isEditClicked = false;

                if ($scope.IsLeavingTandE)
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                else {
                    $window.location.href = $scope.newnavigateURl;
                }
                toaster.pop('success', "Save", 'TandE Sheet Saved Successfully', 3000);
                return true;
            }
            else {

                toaster.pop('error', "Error", data.Error, null);
            }

        }).error(function (error) {
            console.log("failure message: " + JSON.stringify(error));
        });
    }
    //------------Initialization Calls----------//
    $scope.GetRightsList();
    $scope.GetOpportunityConfiguration();
    $scope.GetOpportunityList($routeParams.OppId);

});





