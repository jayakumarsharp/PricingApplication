ReportApp.controller('BaseSkillController', function ($scope, $rootScope, BaseSkillService, UserFactory, toaster, $timeout) {
    $scope.BaseSkillList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.GetAllBaseSkill = function () {
        BaseSkillService.GetAllBaseSkill().success(function (data) {

            for (var j = 0; j < data.length; j++) {
                try {
                    if (data[j].BaseSkill == 'NA') {
                        data.splice(j, 1);
                        break;
                    }
                }
                catch (e) {
                    console.log('some error while sending data to server')
                }
            }

            $scope.BaseSkillList = data;
            $scope.BaseSkillGrid.api.setRowData($scope.BaseSkillList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        { headerName: 'BaseSkill', field: 'BaseSkill', width: 305 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                if (params.data.BaseSkill != 'NA')
                    return "</span><a data-ng-click=\"GetBaseSkillById('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                    //return "</span><a data-ng-click=\"GetAllTaskType()\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.TaskTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                else
                    return '';
            }
        }];

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.BaseSkillGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.BaseSkillGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: $scope.BaseSkillList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllBaseSkill();
            $scope.BaseSkillGrid.api.sizeColumnsToFit();
        },
    };

    $scope.add = function (BaseSkill) {
        if (BaseSkill != null) {
            if (BaseSkill.BaseSkill.trim()) {
                BaseSkillService.AddBaseSkill(BaseSkill).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        $scope.BaseSkill = null;
                        $scope.GetAllBaseSkill();
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'BaseSkill added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BaseSkill! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter BaseSkill', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter BaseSkill', null);
        }

    };

    $scope.GetBaseSkillById = function (Id) {
        BaseSkillService.GetAllBaseSkillById(Id).success(function (data) {
            $scope.editMode = true;
            $scope.BaseSkill = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding BaseSkill! " + data.ExceptionMessage;
        });
    };

    $scope.delete = function () {
        var crc = { Id: $scope.Id };
        BaseSkillService.DeleteBaseSkill(crc).success(function (data) {
            $scope.BaseSkill = null;
            $scope.editMode = false;
            $scope.GetAllBaseSkill();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'BaseSkill deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateBaseSkill = function (model) {
        if (model != null) {
            if (model.BaseSkill.trim()) {
                BaseSkillService.ModifyBaseSkill(model).success(function (data) {
                    $scope.editMode = false;
                    $scope.BaseSkill = null;
                    $scope.GetAllBaseSkill();
                    toaster.pop('success', "Success", 'BaseSkill updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BaseSkill! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter BaseSkill', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter BaseSkill', null);
        }
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.BaseSkill = null;
        $scope.editMode = false;
    };

});