ReportApp.controller('TaskTypeController', function ($scope, $rootScope, TaskTypeService, toaster, $timeout) {
    $scope.TaskTypeList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.GetAllTaskType = function () {
        TaskTypeService.GetAllTaskType().success(function (data) {

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

            $scope.TaskTypeList = data;
            $scope.TaskTypeGrid.api.setRowData($scope.TaskTypeList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    var columnDefs = [{ headerName: '', hide: true, field: 'TaskTypeId', width: 1 },
        { headerName: 'TaskName', field: 'TaskName', width: 305 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                if (params.data.TaskName != 'NA')
                    return "</span><a data-ng-click=\"GetTaskTypeById('" + params.data.TaskTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.TaskTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                    //return "</span><a data-ng-click=\"GetAllTaskType()\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.TaskTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                else
                    return '';
            }
        }];

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.TaskTypeGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.TaskTypeGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: $scope.TaskTypeList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllTaskType();
            $scope.TaskTypeGrid.api.sizeColumnsToFit();
        },
    };

    $scope.add = function (TaskType) {
        if (TaskType != null) {
            if (TaskType.TaskName.trim()) {
                TaskTypeService.AddTaskType(TaskType).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        $scope.TaskType = null;
                        $scope.GetAllTaskType();
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'TaskType added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding TaskType! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter TaskType', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter TaskType', null);
        }

    };

    $scope.GetTaskTypeById = function (TaskTypeId) {
        TaskTypeService.GetAllTaskTypeById(TaskTypeId).success(function (data) {
            $scope.editMode = true;
            $scope.TaskType = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding tasktype! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        var crc = { TaskTypeId: $scope.TaskTypeId };
        TaskTypeService.DeleteTaskType(crc).success(function (data) {
            $scope.TaskType = null;
            $scope.editMode = false;
            $scope.GetAllTaskType();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'TaskType deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateTaskType= function (model) {
        if (model != null) {
            if (model.TaskName.trim()) {
                TaskTypeService.ModifyTaskType(model).success(function (data) {
                    $scope.editMode = false;
                    $scope.TaskType = null;
                    $scope.GetAllTaskType();
                    toaster.pop('success', "Success", 'TaskType updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding TaskType! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter TaskType', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter TaskType', null);
        }
    };

    $scope.showconfirm = function (data) {
        $scope.TaskTypeId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.TaskType = null;
        $scope.editMode = false;
    };

});