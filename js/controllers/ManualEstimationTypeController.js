ReportApp.controller('ManualEstimationTypeController', function ($scope, $rootScope, ManualEstimationTypeService, toaster, $timeout) {
    $scope.ManualEstimationTypeList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.GetAllManualEstimationType = function () {
        ManualEstimationTypeService.GetAllManualEstimationType().success(function (data) {

            for (var j = 0; j < data.length; j++) {
                try {
                    if (data[j].TaskName == 'NA') {
                        data.splice(j, 1);
                        break;
                    }
                }
                catch (e) {
                    console.log('some error while sending data to server')
                }
            }

            $scope.ManualEstimationTypeList = data;
            $scope.ManualEstimationTypeGrid.api.setRowData($scope.ManualEstimationTypeList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    var columnDefs = [{ headerName: '', hide: true, field: 'ManualEstimationTypeId', width: 1 },
        { headerName: 'TaskName', field: 'TaskName', width: 305 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                if (params.data.TaskName != 'NA')
                    return "</span><a data-ng-click=\"GetManualEstimationTypeById('" + params.data.ManualEstimationTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.ManualEstimationTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                    //return "</span><a data-ng-click=\"GetAllManualEstimationType()\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.ManualEstimationTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                else
                    return '';
            }
        }];

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.ManualEstimationTypeGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.ManualEstimationTypeGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: $scope.ManualEstimationTypeList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllManualEstimationType();
            $scope.ManualEstimationTypeGrid.api.sizeColumnsToFit();
        },
    };

    $scope.add = function (ManualEstimationType) {
        if (ManualEstimationType != null) {
            if (ManualEstimationType.TaskName.trim()) {
                ManualEstimationTypeService.AddManualEstimationType(ManualEstimationType).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        $scope.ManualEstimationType = null;
                        $scope.GetAllManualEstimationType();
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'ManualEstimationType added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ManualEstimationType! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter ManualEstimationType', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter ManualEstimationType', null);
        }

    };

    $scope.GetManualEstimationTypeById = function (ManualEstimationTypeId) {
        ManualEstimationTypeService.GetAllManualEstimationTypeById(ManualEstimationTypeId).success(function (data) {
            $scope.editMode = true;
            $scope.ManualEstimationType = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding ManualEstimationType! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        var crc = { ManualEstimationTypeId: $scope.ManualEstimationTypeId };
        ManualEstimationTypeService.DeleteManualEstimationType(crc).success(function (data) {
            $scope.ManualEstimationType = null;
            $scope.editMode = false;
            $scope.GetAllManualEstimationType();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'ManualEstimationType deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateManualEstimationType= function (model) {
        if (model != null) {
            if (model.TaskName.trim()) {
                ManualEstimationTypeService.ModifyManualEstimationType(model).success(function (data) {
                    $scope.editMode = false;
                    $scope.ManualEstimationType = null;
                    $scope.GetAllManualEstimationType();
                    toaster.pop('success', "Success", 'ManualEstimationType updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ManualEstimationType! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter ManualEstimationType', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter ManualEstimationType', null);
        }
    };

    $scope.showconfirm = function (data) {
        $scope.ManualEstimationTypeId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.ManualEstimationType = null;
        $scope.editMode = false;
    };

});