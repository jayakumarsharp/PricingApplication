ReportApp.controller('MilestoneController', function ($scope, $rootScope, milestoneFactory, toaster, $timeout) {
    $scope.milestone = {};
    $scope.Milestone = [];

    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        { headerName: 'Milestone Description', field: 'MilestoneDescription', width: 300 },
        { headerName: 'Payment Code', field: 'PaymentCode', width: 120 },
        { headerName: 'Vendor Breakdown', field: 'VendorBreakdown', width: 120 },
        { headerName: 'Percentage Type', field: 'PercentageType', width: 110 },
        {
            headerName: 'Action', width: 120, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                return "</span><a data-ng-click=\"showEdit('" + params.data.Id + "')\" href=\"javascript:;\"> Edit</a>";
            }
        }];

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.MilestoneGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.MilestoneGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowHeight: 25,
        headerHeight: 37,
        enableColResize: true,
        suppressRowClickSelection: true,
        suppressHorizontalScroll: true,
        suppressCellSelection: true,
        rowData: [],
        onGridReady: function (event) {
            $scope.GetAllMilestone();
            $scope.MilestoneGrid.api.sizeColumnsToFit();
        },
    };

    $scope.GetAllMilestone = function () {
        milestoneFactory.GetAllMilestone().success(function (data) {
            $scope.Milestone = data;
            $scope.MilestoneGrid.api.setRowData($scope.Milestone);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.UpdateMilestone = function (miles) {
        milestoneFactory.UpdateMilestone(miles).success(function (data) {
            toaster.pop('success', "Success", "Milestone updated successfully", null);
            $('#milestoneModel').modal('hide');
            $scope.GetAllMilestone();
        }).error(function (data) {
            $scope.error = "An Error has occured while Updating Milestone! " + data.ExceptionMessage;
        });
    };

    $scope.cancel = function () {
        $scope.milestone = {};
        $('#milestoneModel').modal('hide');
    };

    $scope.showEdit = function (id) {
        milestoneFactory.GetMilestone(id).success(function (data) {
            $scope.milestone = data;
            $('#milestoneModel').modal('show');
        }).error(function (data) {
            $scope.error = "An Error has occured while getting milestone! " + data.ExceptionMessage;
        });
    };

    // $scope.GetAllMilestone();   
});

// Milestone Factory //

'use strict';
ReportApp.factory('milestoneFactory', function ($http) {
    var milestoneFactoryURI = BaseURL + 'Payment';
    var milestoneFactory = {};

    milestoneFactory.GetAllMilestone = function () {
        var result = $http.get(milestoneFactoryURI + '/GetMilestone');
        return result;
    }
    milestoneFactory.GetMilestone = function (id) {
        var result = $http.get(milestoneFactoryURI + '/GetMilestone?Id=' + id);
        return result;
    }
    milestoneFactory.UpdateMilestone = function (miles) {
        return $http.post(milestoneFactoryURI + '/ModifyPaymentMilestone', miles);
    }
    return milestoneFactory;
});

