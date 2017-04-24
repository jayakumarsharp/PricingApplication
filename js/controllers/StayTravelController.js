ReportApp.controller('StayTravelController', function ($scope, $rootScope, $timeout, $filter, $location, $window, $routeParams, toaster, reportFactory, OppFactory,
    Opportunityservice, UserFactory, StayTravelService, EstimationApplicationMasterService, priceService) {

    // ---- Variables Definition ------//

    $scope.MaxGroupID = $routeParams.GroupId;
    $scope.OppId = $routeParams.OppId;
    $scope.GroupId = $routeParams.GroupId;
    $scope.LoggedUser = $rootScope.UserInfo.user.userId;

    $scope.Version = '';
    $scope.SheetLockedMessage = '';

    $scope.isStayTravelEditable = false;
    $scope.isEditClicked = false;
    $scope.DefautState = false;
    $scope.IsLeavingStayTravel = true;

    $scope.StayTravelData = [];
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

    // -----------StayTravel Grid ----------------//

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
                            return '<span><input id="resTypeTxt" ng-disabled="false" ng-model="StayTravelData[' + params.rowIndex + '].Description" />';
                        else
                            return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="StayTravelData[' + params.rowIndex + '].Description" />';
                    }
                    else
                        return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="StayTravelData[' + params.rowIndex + '].Description" />';
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
            headerName: "Man Days", width: 100, headerTooltip: 'ManDays', field: "ManDays", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].ManDays"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Man Days</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Resource Count", width: 100, headerTooltip: 'ResourceCount', field: "ResourceCount", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].ResourceCount"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Resource Count</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Change Resource Count To", width: 100, headerTooltip: 'ChangeResourceCountTo', field: "ChangeResourceCountTo", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                        + 'ng-change="GetValues(' + params.rowIndex + ')" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].ChangeResourceCountTo"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Change Resource<br>Count To</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Onsite %", width: 100, headerTooltip: 'OnsitePercent', field: "OnsitePercent", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true"'
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].OnsitePercent"'
                        + '/>%</span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Onsite %</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Average number of Travels per Resource", width: 100, headerTooltip: 'AvgTravel', field: "AvgTravel", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                        + 'ng-change="GetValues(' + params.rowIndex + ')"'
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].AvgTravel"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Average number<br> of Travels<br> per Resource</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Resource stays Onsite (No Travel)", field: "StaysOnsite", width: 85, cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><select style="background-color:#F0F8FF" id="ddUnit" ng-disabled="!isEditClicked"'
                        + ' ng-change="GetValues(' + params.rowIndex + ')"'
                        + ' name="ddlUnit" ng-model="StayTravelData[' + params.rowIndex + '].StaysOnsite" title="Select Y/N">'
                        + '<option value="">- Select Y/N -</option>'
                        + '<option value="Y">Y</option>'
                        + '<option value="N">N</option>'
                        + '</select></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Resource stays<br> Onsite<br> (No Travel)</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Onsite Business Days", width: 100, headerTooltip: 'OnsiteBusinessDays', field: "OnsiteBusinessDays", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].OnsiteBusinessDays"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Onsite<br> Business Days</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Effective Business Days", width: 100, headerTooltip: 'EffectiveBusinessDays', field: "EffectiveBusinessDays", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].EffectiveBusinessDays"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Effective<br> Business Days</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Travel Man Days", width: 100, headerTooltip: 'TravelManDays', field: "TravelManDays", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].TravelManDays"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Travel<br> Man Days</b></div>';
            },
            cellClassRules: {
                'bg-light': function (params) {
                    if (params.data.Description == 'TOTAL')
                        return true;
                }
            }
        },
        {
            headerName: "Visa", width: 100, headerTooltip: 'Visa', field: "Visa", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].Visa"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Visa</b></div>';
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
            headerName: "Air Fare (2 Way)", width: 100, headerTooltip: 'AirFare', field: "AirFare", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].AirFare"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Air Fare<br> (2 Way)</b></div>';
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
            headerName: "Accomodation", width: 100, headerTooltip: 'Accomodation', field: "Accomodation", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].Accomodation"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Accomodation</b></div>';
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
            headerName: "Per-Diem & Laundry", width: 100, headerTooltip: 'Per-Diem & Laundry', field: "PerDiem", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].PerDiem"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Per-Diem<br> & Laundry</b></div>';
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
            headerName: "Local Conveyance", width: 100, headerTooltip: 'LocalConveyance', field: "LocalConveyance", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].LocalConveyance"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Local<br> Conveyance</b></div>';
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
            headerName: "Misc", width: 100, headerTooltip: 'Misc', field: "Misc", cellRenderer: function (params) {
                if (params.data.Description != 'TOTAL') {
                    return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                        + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].Misc"'
                        + '/></span>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Misc</b></div>';
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
            headerName: "Total", width: 100, headerTooltip: 'Total', field: "Total", cellRenderer: function (params) {
                // if (params.data.Description != 'TOTAL') {
                //     return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                //         + 'type="number" min=0 ng-model="StayTravelData[' + params.rowIndex + '].Total"'
                //         + '/></span>';
                // }
                // else
                return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Total</b></div>';
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
        }
    ];

    $scope.stayTravelGrid = {
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
        debug: true
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
            $scope.StayTravelData = [];
            StayTravelService.GetAllStayTravelbyOppGroupID($scope.OppDetail.OppId, $scope.MaxGroupID).success(function (data) {
                if (data.Error == null) {
                    $scope.StayTravelData = data;
                    if (data.length == 0) {
                        $scope.StayTravelData.push({ RowNo: 1, Description: 'Requirements Gathering', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 2, Description: 'Design', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 3, Description: 'Development & Test', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 4, Description: 'System Testing', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 5, Description: 'Implementation', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 6, Description: 'UAT', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 7, Description: 'Production Support / Cutover', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 8, Description: 'Training', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 9, Description: 'Manuals', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 10, Description: 'Orientation & Handover', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 11, Description: 'SQA', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 12, Description: 'Project Management', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 13, Description: 'Calculated Efforts', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 14, Description: 'From Cost Sheet - Resourcing Model', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                        $scope.StayTravelData.push({ RowNo: 15, Description: 'Other 1', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                        $scope.StayTravelData.push({ RowNo: 16, Description: 'Other 2', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                        $scope.StayTravelData.push({ RowNo: 17, Description: 'Other 3', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                        $scope.StayTravelData.push({ RowNo: 18, Description: 'Other 4', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                        $scope.StayTravelData.push({ RowNo: 19, Description: 'Other 5', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });

                        totalrow = [{ RowNo: '', Description: 'TOTAL', ManDays: '', ResourceCount: '', ChangeResourceCountTo: '', OnsitePercent: '', AvgTravel: '', StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false }];
                    }
                    else {
                        totalrow = []
                        totalrow.push($scope.StayTravelData[19]);
                        $scope.StayTravelData.splice(19, 1);
                    }
                }

                $scope.stayTravelGrid.api.setRowData($scope.StayTravelData);
                $scope.stayTravelGrid.api.setFloatingBottomRowData(totalrow);
                $scope.stayTravelGrid.rowData = $scope.StayTravelData;
                $timeout(function () {
                    $scope.stayTravelGrid.api.refreshView();
                }, 500);
            }).error(function (error) {
                console.log('Error occurred: ' + error);
                $scope.Error = error;
            });
        }
    };

    $scope.GetRightsList = function () {
        reportFactory.GetRightsList($scope.LoggedUser).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName.contains('StayTravel Write')) {
                    $scope.isStayTravelEditable = true;
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

    $scope.SaveStayTravel = function (isDiscard) {
        if (validatedata()) {
            var data = $scope.StayTravelData;
            $scope.StayTravelData.push(totalrow[0]);
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

            var Jsondata = { OppId: $scope.OppDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxGroupID, Comment: '', Version: $scope.Version, StayTravelSheet: data, Author: $scope.LoggedUser, NumberofApp: 0 };
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

    $scope.SaveAsStayTravel = function () {

        priceService.GetMaximumGroupPriceSheetId().success(function (data) {
            if (data[0].count == 'null') {
                $scope.MaxGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxGroupIDForSaveAs = data[0].count + 1;
            }

            $scope.StayTravelData.push(totalrow[0]);
            for (var j = 0; j < $scope.StayTravelData.length; j++) {
                try {
                    delete $scope.StayTravelData[j].Id;
                    $scope.StayTravelData[j].OppId = $scope.OppDetail.OppId;
                    $scope.StayTravelData[j].GroupId = $scope.MaxGroupIDForSaveAs;
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
                AppId: $scope.MaxGroupIDForSaveAs, IsReadOnly: $scope.isEditClicked, StayTravelSheet: $scope.StayTravelData,
                Comment: $scope.SaveComment, Author: $scope.LoggedUser, IsEditable: true
            };
            Jsondata.Version = version;
            //Jsondata.NumberofApp = $scope.CurrentAdditionalGrid
            StayTravelService.AddStayTravelNewVersion(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.isEditClicked = false;
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                    toaster.pop('success', "Save", 'New Version of StayTravel Sheet Saved Successfully', 3000);
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

    $scope.EditStayTravel = function () {
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

            var LockSheetModel = { OppId: $scope.OppDetail.OppId, GroupId: $scope.MaxGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'StayTravelSheet', IsStayTravelSheetUpdated: true };

            StayTravelService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {
                if (!data.IsLocked) {
                    $routeParams.GroupId = data.ApplicationId;
                    $scope.Version = data.Version;
                    $scope.isEditClicked = true;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');
                    $scope.CurrentAdditionalGrid = data.NumberOfApplication;
                }
                else {
                    if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "StayTravelSheet") {
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
        var LockSheetModel = { GroupId: $scope.MaxGroupID, username: $scope.LoggedUser, LockedInApp: 'StayTravelSheet' };
        StayTravelService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
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

    $scope.IgnoreStayTravelChanges = function () {
        priceService.ReleaseSheetWhenExpired($scope.MaxGroupID).success(function (data) {
            $scope.isEditClicked = false;
            if ($scope.IsLeavingStayTravel)
                redirectRefreshPage($routeParams.OppId, $scope.MaxGroupID);
        }).error(function (error) {
            $scope.Error = error;
        })
    }

    $scope.GetValues = function (row) {
        try {
            var stinfo = $scope.StayTravelData[row];

            if (stinfo.ChangeResourceCountTo != undefined && stinfo.ChangeResourceCountTo >= 0 &&
                stinfo.AvgTravel != undefined && stinfo.AvgTravel != '' &&
                stinfo.StaysOnsite != undefined && stinfo.StaysOnsite != '') {

                console.log('Calculating stay & travel..');

                stinfo.ManDays = 108 // TODO
                stinfo.ResourceCount = 2 // TODO
                stinfo.OnsitePercent = 30 // TODO

                stinfo.OnsiteBusinessDays = Math.ceil((stinfo.ResourceCount == 0 ? 0 : (stinfo.ManDays / stinfo.ResourceCount) * (stinfo.OnsitePercent / 100)));
                stinfo.EffectiveBusinessDays = (stinfo.OnsiteBusinessDays > 5 ? Math.ceil(Math.ceil(stinfo.OnsiteBusinessDays / 5) * 2 + stinfo.OnsiteBusinessDays) : stinfo.OnsiteBusinessDays);
                stinfo.TravelManDays = ((stinfo.OnsitePercent > 0 && stinfo.ManDays > 0 && stinfo.StaysOnsite == "N") ? (stinfo.AvgTravel * 2 * stinfo.ResourceCount) : 0);
                stinfo.Visa = stinfo.OnsitePercent > 0 ? (stinfo.StaysOnsite == "N" ? (stinfo.AvgTravel * (OppConfig.Visa != undefined ? OppConfig.Visa : 0) * ((stinfo.ChangeResourceCountTo > 0) ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount)) : 0) : 0;
                stinfo.AirFare = stinfo.OnsitePercent > 0 ? (stinfo.StaysOnsite == "N" ? (stinfo.AvgTravel * (OppConfig.AirFare != undefined ? OppConfig.AirFare : 0) * ((stinfo.ChangeResourceCountTo > 0) ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount)) : 0) : 0;
                stinfo.Accomodation = stinfo.EffectiveBusinessDays * (OppConfig.Accommodation != undefined ? OppConfig.Accommodation : 0) * ((stinfo.ChangeResourceCountTo > 0) ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                stinfo.PerDiem = stinfo.EffectiveBusinessDays * (OppConfig.PerDiemLaundry != undefined ? OppConfig.PerDiemLaundry : 0) * ((stinfo.ChangeResourceCountTo > 0) ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                stinfo.LocalConveyance = stinfo.EffectiveBusinessDays * (OppConfig.LocalConveyance != undefined ? OppConfig.LocalConveyance : 0) * ((stinfo.ChangeResourceCountTo > 0) ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                stinfo.Misc = stinfo.EffectiveBusinessDays * (OppConfig.Miscellaneous != undefined ? OppConfig.Miscellaneous : 0) * ((stinfo.ChangeResourceCountTo > 0) ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                stinfo.Total = stinfo.Visa + stinfo.AirFare + stinfo.Accomodation + stinfo.PerDiem + stinfo.LocalConveyance + stinfo.Misc;

                totalrow[0].OnsiteBusinessDays = 0;
                totalrow[0].EffectiveBusinessDays = 0;
                totalrow[0].TravelManDays = 0;
                totalrow[0].Visa = 0;
                totalrow[0].AirFare = 0;
                totalrow[0].Accomodation = 0;
                totalrow[0].PerDiem = 0;
                totalrow[0].LocalConveyance = 0;
                totalrow[0].Misc = 0;
                totalrow[0].Total = 0;

                for (var i = 0; i < $scope.StayTravelData.length; i++) {
                    var sti = $scope.StayTravelData[i];
                    totalrow[0].OnsiteBusinessDays += sti.OnsiteBusinessDays;
                    totalrow[0].EffectiveBusinessDays += sti.EffectiveBusinessDays;
                    totalrow[0].TravelManDays += sti.TravelManDays;
                    totalrow[0].Visa += sti.Visa;
                    totalrow[0].AirFare += sti.AirFare;
                    totalrow[0].Accomodation += sti.Accomodation;
                    totalrow[0].PerDiem += sti.PerDiem;
                    totalrow[0].LocalConveyance += sti.LocalConveyance;
                    totalrow[0].Misc += sti.Misc;
                    totalrow[0].Total += sti.Total;
                }

                $scope.StayTravelData[row] = stinfo;
                $scope.stayTravelGrid.api.refreshView();
            }
        }
        catch (ex) {
            console.log('Error occurred when calculating Year value: ' + ex);
        }
    }



    $scope.DeleteStayTravelRow = function () {
        angular.element(document.querySelector('#loader')).removeClass('hide');

        var selected = $scope.stayTravelGrid.api.getFocusedCell();
        if (selected == null) {
            toaster.pop('error', "Error", 'Please select row to delete', null);
        }
        else {
            $scope.StayTravelData.splice(selected.rowIndex, 1);
            toaster.pop('success', "Success", 'Row ' + (parseFloat(selected.rowIndex) + 1) + ' deleted successfully', null);
            var alterrows = selected.rowIndex;
            for (alterrows; alterrows < $scope.stayTravelGrid.rowData.length; alterrows++) {
                $scope.StayTravelData[alterrows].RowNo = alterrows + 1;
            }
            $scope.stayTravelGrid.api.setRowData($scope.StayTravelData);
            $scope.stayTravelGrid.rowData = $scope.StayTravelData;
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

    $scope.SaveStayTravelPop = function () {
        $('#ShowSave').modal('show');
    }

    $scope.CancelStayTravelSheet = function () {
        $('#ShowSave').modal('hide');
    }

    $scope.SaveAsStayTravelPop = function () {
        if ($routeParams.GroupId == 'undefined') {
            toaster.pop('warning', "Warning", "Minimum one version is required to create new version", 3000);
        }
        else {
            $('#showSaveAs').modal('show');
        }
    }

    $scope.CancelStayTravelSheetsaveas = function () {
        $('#showSaveAs').modal('hide');
    }

    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.isEditClicked) {
            $('#showUnsaved').modal('show');
            event.preventDefault();
        }
    });

    $scope.saveasStayTravelSheetdiscard = function () {
        $scope.IsLeavingStayTravel = false;
        $scope.SaveStayTravel(true)
        $('#showUnsaved').modal('hide');
    }

    $scope.CancelStayTravelSheetdiscard = function () {
        $scope.isEditClicked = false;
        $scope.IsLeavingStayTravel = false;
        $scope.IgnoreStayTravelChanges();
        $('#showUnsaved').modal('hide');
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.CloseStayTravelSheetdiscard = function () {
        $('#showUnsaved').modal('hide');
    }

    //------------Functions-------------------//

    function redirectRefreshPage(oppId, groupId) {
        $location.path("StayTravel/" + oppId + "/" + groupId);
    }

    function validatedata() {
        for (var j = 0; j < $scope.StayTravelData.length; j++) {
            try {
                if ($scope.StayTravelData[j].ManDays > 0 && $scope.StayTravelData[j].ResourceCount > 0) {
                    if ($scope.StayTravelData[j].ChangeResourceCountTo == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.StayTravelData[j].RowNo + ' is incomplete!', null);
                        return false;
                    }
                    if ($scope.StayTravelData[j].AvgTravel == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.StayTravelData[j].RowNo + ' is incomplete!', null);
                        return false;
                    }
                    if ($scope.StayTravelData[j].StaysOnsite == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.StayTravelData[j].RowNo + ' is incomplete!', null);
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
        StayTravelService.AddStayTravel(Jsondata).success(function (data) {
            if (data.Error == '' || data.Error == undefined || data.Error == null) {
                $scope.isEditClicked = false;

                if ($scope.IsLeavingStayTravel)
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                else {
                    $window.location.href = $scope.newnavigateURl;
                }
                toaster.pop('success', "Save", 'StayTravel Sheet Saved Successfully', 3000);
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





