
ReportApp.controller("PricesheetmgntController", function ($scope, priceService, toaster,$rootScope, $timeout) {

    $scope.getalllockedsheet = function () {
        $scope.LockedPriceSheet;
        priceService.GetAllLockedPriceSheet().success(function (data) {
            $scope.LockedPriceSheet = data;
            $scope.gridOptions2.api.setRowData($scope.LockedPriceSheet);
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.gridOptions2.api.sizeColumnsToFit();
        }, 1000);
    });


    var columnDefs = [{ headerName: '', field: 'PriceSheetId', width: 1, hide: true },
        { headerName: 'OpportunityName', field: 'OpportunityName', width: 200 },
        { headerName: 'Version', field: 'Version', width: 140 },
        { headerName: 'LockedIn', field: 'LockedIn', width: 140 },
        { headerName: 'IsLocked', field: 'IsLocked', width: 140 },
        { headerName: 'Locked User', field: 'LockedUser', width: 160 },
        { headerName: 'Lock Time', field: 'LockStartTime', width: 160 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                return "<a style=\"margin-left:20%; \" href=\"javascript:;\" data-ng-click=\"ReleaseSheetWhenExpired('" + params.data.PriceSheetId + "')\" >Release</a>";
            }
        },
    ];

    $scope.gridOptions2 = {
        // we are using angular in the templates
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: [],
        onGridReady: function (event) {
            //$scope.gridOptions.api.sizeColumnsToFit();
            //$scope.gridOptions2.columnApi.setColumnsVisible(['PriceSheetId'], false);
            $scope.getalllockedsheet();
            $scope.gridOptions2.api.sizeColumnsToFit();
        },
    };


    $scope.ReleaseSheetWhenExpired = function (sheetid) {
        priceService.ReleaseSheetWhenExpired(sheetid).success(function (data) {
            $scope.getalllockedsheet()
            toaster.pop('success', "Success", "Pricing sheet is released successfully", null);
        }).error(function (error) {
            $scope.Error = error;
        })
    }
});