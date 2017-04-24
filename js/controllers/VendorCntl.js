ReportApp.controller('VendorController', function ($scope, $rootScope, VendorService, toaster, $timeout) {
    $scope.VendorList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.GetAllVendor = function () {
        VendorService.GetAllVendor().success(function (data) {
            for (var j = 0; j < data.length; j++) {
                try {
                    if (data[j].VendorName == '--Select--') {
                        data.splice(j, 1);
                        break;
                    }
                }
                catch (e) {
                    console.log('some error while sending data to server')
                }
            }

            $scope.VendorList = data;
            $scope.VendorGrid.api.setRowData($scope.VendorList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.VendorGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        { headerName: 'VendorName', field: 'VendorName', width: 305 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                return "</span><a data-ng-click=\"GetVendorForId('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
            }
        }];


    $scope.VendorGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: $scope.VendorList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllVendor();
            $scope.VendorGrid.api.sizeColumnsToFit();
        },
    };

    $scope.add = function (Vendor) {
        if (Vendor != null) {
            if (Vendor.VendorName.trim()) {
                VendorService.AddVendor(Vendor).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.Vendor = null;
                        $scope.GetAllVendor();
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'Vendor name added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter vendor name', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter product name', null);
        }
    };

    $scope.GetVendorForId = function (id) {
        VendorService.GetAllVendorbyId(id).success(function (data) {
            $scope.editMode = true;
            $scope.Vendor = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.delete = function () {
        var crc = { Id: $scope.Id };
        VendorService.DeleteVendor(crc).success(function (data) {
            $scope.Vendor = null;
            $scope.editMode = false;
            $scope.GetAllVendor();
            toaster.pop('success', "Success", 'Vendor name deleted successfully', null);
            $('#confirmModal').modal('hide');
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateVendor = function (model) {
        if (model != null) {
            if (model.VendorName.trim()) {
                VendorService.UpdateVendor(model).success(function (data) {
                    $scope.editMode = false;
                    $scope.Vendor = null;
                    $scope.GetAllVendor()
                    toaster.pop('success', "Success", 'Vendor name updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter vendor name', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter product name', null);
        }
    };


    $scope.cancel = function () {
        $scope.Vendor = null;
        $scope.editMode = false;
    };

});

