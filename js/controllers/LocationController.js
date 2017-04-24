ReportApp.controller('LocationController', function ($scope, $rootScope, LocationService,UserFactory, toaster, $timeout) {
    $scope.LocationList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.GetAllLocation = function () {
        UserFactory.GetAllLocations().success(function (data) {

            for (var j = 0; j < data.length; j++) {
                try {
                    if (data[j].Location == 'NA') {
                        data.splice(j, 1);
                        break;
                    }
                }
                catch (e) {
                    console.log('some error while sending data to server')
                }
            }

            $scope.LocationList = data;
            $scope.LocationGrid.api.setRowData($scope.LocationList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        { headerName: 'Location', field: 'Location', width: 305 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                if (params.data.Location != 'NA')
                    return "</span><a data-ng-click=\"GetLocationById('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                    //return "</span><a data-ng-click=\"GetAllTaskType()\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.TaskTypeId + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                else
                    return '';
            }
        }];

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.LocationGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.LocationGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: $scope.LocationList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllLocation();
            $scope.LocationGrid.api.sizeColumnsToFit();
        },
    };


    $scope.GetLocationById = function (Id) {
        LocationService.GetAllLocationById(Id).success(function (data) {
            $scope.editMode = true;
            $scope.Location = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Location! " + data.ExceptionMessage;
        });
    };

    $scope.add = function (Location) {
        if (Location != null) {
            if (Location.Location.trim()) {
                LocationService.AddLocation(Location).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        $scope.Location = null;
                        $scope.GetAllLocation();
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'Location added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Location! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Location', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Location', null);
        }

    };


    $scope.delete = function () {
        var crc = { Id: $scope.Id };
        LocationService.DeleteLocation(crc).success(function (data) {
            $scope.Location = null;
            $scope.editMode = false;
            $scope.GetAllLocation();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'Location deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };


    $scope.UpdateLocation= function (model) {
        if (model != null) {
            if (model.Location.trim()) {
                LocationService.ModifyLocation(model).success(function (data) {
                    $scope.editMode = false;
                    $scope.Location = null;
                    $scope.GetAllLocation();
                    toaster.pop('success', "Success", 'Location updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Location! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Location', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Location', null);
        }
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.Location = null;
        $scope.editMode = false;
    };

});






