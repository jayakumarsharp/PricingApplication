ReportApp.controller('BillingConfigController', function ($scope, $rootScope, BillingConfigService, _, UserFactory, toaster, $timeout) {
    $scope.BillingConfig = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.SBUs = [];
    $scope.billConfig = {};
    $scope.billConfig.ShowGrid = false;

    var scBillingColumnDefs = [
        {
            headerName: "SBU", width: 100, field: "SBU", pinned: 'left', editable: false, headerTooltip: "SBU", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                var sbuName = _.findWhere($scope.SBUs, { id: params.value });
                if (sbuName != undefined) {
                    return sbuName.SBU;
                }
                else {
                    return 'Invalid SBU';
                }
            }
        },
        {
            headerName: "APRIL", field: "APR", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "MAY", field: "MAY", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "JUNE", field: "JUN", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "JULY", field: "JUL", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "AUGUST", field: "AUG", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "SEPTEMBER", field: "SEP", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "OCTOBER", field: "OCT", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "NOVEMBER", field: "NOV", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "DECEMBER", field: "DEC", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "JANUARY", field: "JAN", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "FEBRUARY", field: "FEB", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "MARCH", field: "MAR", width: 100, editable: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        }
    ];

    $scope.BillingConfigGrid = {
        columnDefs: scBillingColumnDefs,
        rowData: $scope.BillingConfig,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 34,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: false,
        suppressCellSelection: true,
        angularCompileRows: true,
        enableColResize: true,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
    };

    $scope.GetAllSBU = function () {
        UserFactory.GetAllSBU().success(function (data) {
            $scope.SBUs = [];
            angular.forEach(data, function (value, key) {
                if (value.id != '6') {
                    $scope.SBUs.push(value);
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetBillingConfig = function (year) {
        $scope.BillingConfig = [];
        if (year != "") {
            BillingConfigService.GetBillingConfig(year).success(function (billData) {
                if (billData.length == 0) {
                    angular.forEach($scope.SBUs, function (value, key) {
                        billData.push({ 'SBU': value.id, 'APR': "0", 'MAY': "0", 'JUN': "0", 'JUL': "0", 'AUG': "0", 'SEP': "0", 'OCT': "0", 'NOV': "0", 'DEC': "0", 'JAN': "0", 'FEB': "0", 'MAR': "0", Year: year });
                    });
                }
                $scope.billConfig.ShowGrid = true;
                $scope.BillingConfig = billData;
                $scope.BillingConfigGrid.api.setRowData($scope.BillingConfig);
                $timeout(function () {
                    $scope.BillingConfigGrid.api.refreshView();
                }, 100);
            }).error(function (err) {
                console.log("An Error has occured while getting BillingConfig! " + err);
            });
        }
        else
            $scope.billConfig.ShowGrid = false;
    };

    $scope.UpdateBillingConfig = function () {
        if ($scope.BillingConfig.length > 0) {
            console.log('____________________________BILL CONFIG____________________________');
            console.log(JSON.stringify($scope.BillingConfig));
            var BillData = {};
            BillData.BillConfig = $scope.BillingConfig;
            BillingConfigService.AddBillingConfig(BillData).success(function (data) {
                $scope.editMode = false;
                $scope.BillingConfig = [];
                $scope.billConfig.BillingPeriod = "";
                $scope.billConfig.ShowGrid = false;
                toaster.pop('success', "Success", 'Billing Config updated successfully', null);
            }).error(function (data) {
                $scope.error = "An Error has occured while Adding BillingConfig! " + data.ExceptionMessage;
            });
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter BillingConfig', null);
        }
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.BillingConfig = null;
        $scope.editMode = false;
    };

    $scope.GetAllSBU();

});
