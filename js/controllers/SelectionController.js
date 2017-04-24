ReportApp.controller('SelectionController', function ($scope, $rootScope, SelectionService, UserFactory, toaster, $timeout) {
    $scope.SelectionList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;


    $scope.GetAllSelection = function () {
        SelectionService.GetAllSelection().success(function (data) {

            // for (var j = 0; j < data.length; j++) {
            //     try {
            //         if (data[j].Selection == 'NA') {
            //             data.splice(j, 1);
            //             break;
            //         }
            //     }
            //     catch (e) {
            //         console.log('some error while sending data to server')
            //     }
            // }

            $scope.SelectionList = data;
            $scope.SelectionGrid.api.setRowData($scope.SelectionList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        { headerName: 'Key', field: 'Key', width: 305 },
        { headerName: 'Selection', field: 'Selection', width: 305 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                if (params.data.Selection != 'NA')
                    return "</span><a data-ng-click=\"GetSelectionById('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;</span>";
                //return "</span><a data-ng-click=\"GetAllTaskType()\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.TaskTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                else
                    return '';
            }
        }];

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.SelectionGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.SelectionGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: $scope.SelectionList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllSelection();
            $scope.SelectionGrid.api.sizeColumnsToFit();
        },
    };

    $scope.add = function (Selection) {
        if (Selection != null) {
            if (validate(Selection)) {
                if (Selection.Selection.trim()) {
                    SelectionService.AddSelection(Selection).success(function (data) {
                        if (data.Error != undefined) {
                            toaster.pop('error', "Error", data.Error, null);
                        } else {

                            $scope.Selection = null;
                            $scope.GetAllSelection();
                            $scope.editMode = false;
                            toaster.pop('success', "Success", 'Selection added successfully', null);
                        }
                    }).error(function (data) {
                        $scope.error = "An Error has occured while Adding Selection! " + data.ExceptionMessage;
                    });
                }
                else {
                    toaster.pop('warning', "Warning", 'Please enter Selection', null);
                }
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Selection', null);
            }
        }

    };

    function validate(Selection) {

        if (Selection.Key == "") {
            toaster.pop('warning', "Warning", 'Please enter Key', null);
            return false;
        }
        else if (Selection.Selection == '') {
            toaster.pop('warning', "Warning", 'Please enter value', null);
            return false
        }
        return true;
    }

    $scope.GetSelectionById = function (Id) {
        SelectionService.GetAllSelectionById(Id).success(function (data) {
            $scope.editMode = true;
            $scope.Selection = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Selection! " + data.ExceptionMessage;
        });
    };

    $scope.delete = function () {
        var crc = { Id: $scope.Id };
        SelectionService.DeleteSelection(crc).success(function (data) {
            $scope.Selection = null;
            $scope.editMode = false;
            $scope.GetAllSelection();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'Selection deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateSelection = function (model) {
        if (model != null) {
            if (model.Selection.trim()) {
                SelectionService.ModifySelection(model).success(function (data) {
                    $scope.editMode = false;
                    $scope.Selection = null;
                    $scope.GetAllSelection();
                    toaster.pop('success', "Success", 'Selection updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Selection! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Selection', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Selection', null);
        }
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.Selection = null;
        $scope.editMode = false;
    };

});