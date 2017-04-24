ReportApp.controller('MarginController', function ($scope, $rootScope, marginFactory, UserFactory, OppFactory, VendorService, priceService, toaster, $timeout) {
    $scope.editMode = false;
    $scope.margin = {};
    $scope.Margin = [];
    $scope.TempMargin = [];
    $scope.SBU = [];
    $scope.Region = [];
    $scope.Component = [];
    $scope.Vendor = [];
    $scope.showGrid = false;
    $scope.IsDataAvailable = false;

    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        // { headerName: 'BU', field: 'BU', width: 100 },
        // { headerName: 'Region', field: 'Region', width: 120 },
        { headerName: 'Vendor', field: 'Vendor', width: 120 },
        { headerName: 'Component Type', field: 'ComponentType', width: 200 },
        { headerName: 'Default (%)', field: 'DefaultVal', width: 110 },
        { headerName: 'Level1 (%)', field: 'Level1', width: 110 },
        { headerName: 'Level2 (%)', field: 'Level2', width: 110 },
        { headerName: 'Level3 (%)', field: 'Level3', width: 100 },
        {
            headerName: 'Action', width: 120, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                return "</span><a data-ng-click=\"showEdit('" + params.data.Id + "')\" href=\"javascript:;\"> Edit</a>|</span><a data-ng-click=\"showconfirm('" + params.data.Id + "')\" href=\"javascript:;\"> Delete</a>";
            }
        }];


    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.MarginGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.MarginGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowHeight: 25,
        headerHeight: 37,
        enableColResize: true,
        suppressRowClickSelection: true,
        suppressHorizontalScroll: true,
        suppressCellSelection: true,
        rowData: $scope.Margin,
        onGridReady: function (event) {
            //$scope.GetAllMargin();
            $scope.MarginGrid.api.sizeColumnsToFit();
        },
    };

    $scope.GetMargin = function (SBUID, CountryId) {
        marginFactory.GetAllMargin().success(function (data) {
            $scope.Margin = data;
            $scope.TempMargin = [];
            $scope.showGrid = false;
            $scope.IsDataAvailable = false;

            if (SBUID != null && SBUID != undefined && CountryId != null && CountryId != undefined) {

                for (var i = 0; i < $scope.Margin.length; i++) {
                    if (parseInt($scope.Margin[i].SBUID) == SBUID && parseInt($scope.Margin[i].RegionId) == CountryId) {
                        $scope.TempMargin.push($scope.Margin[i]);
                    }
                }
                if ($scope.TempMargin.length > 0) {
                    $scope.showGrid = true;
                    $scope.IsDataAvailable = true;
                    $scope.MarginGrid.api.setRowData($scope.TempMargin);
                    $timeout(function () {
                        $scope.MarginGrid.api.refreshView();
                    }, 50);
                }
                else {
                    $scope.showGrid = true;
                    $scope.IsDataAvailable = false;
                    $scope.MarginGrid.api.setRowData($scope.TempMargin);
                    $timeout(function () {
                        $scope.MarginGrid.api.refreshView();
                    }, 50);
                }
            }
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAllMargin = function () {
        marginFactory.GetAllMargin().success(function (data) {
            $scope.Margin = data;
            $scope.MarginGrid.api.setRowData($scope.Margin);
            $timeout(function () {
                $scope.MarginGrid.api.refreshView();
            }, 50);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AddMargin = function (margin) {
        if (margin != null) {
            marginFactory.AddMargin(margin).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {
                    $scope.margin = {};
                    $('#marginModel').modal('hide');
                    toaster.pop('success', "Success", "Margin added successfully", null);
                }
                $scope.GetMargin($scope.margin.SBUID, $scope.margin.CountryId);
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Margin!", null);
                $scope.error = "An Error has occured while Adding Margin! " + data.ExceptionMessage;
            });
        }
    };

    $scope.GetAllSBU = function () {
        UserFactory.GetAllSBU().success(function (data) {
            angular.forEach(data, function (value, key) {
                if (value.SBU != 'All') {
                    $scope.SBU.push(value);
                }
            });

        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.delete = function () {
        var disc = { Id: $scope.Id };
        marginFactory.DeleteMargin(disc).success(function (data) {
            $scope.editMode = false;
            //$scope.GetAllMargin();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", "Margin deleted successfully", null);
            $scope.GetMargin($scope.margin.SBUID, $scope.margin.CountryId);
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Deleting Margin!", null);
            $scope.error = "An Error has occured while Deleting Margin! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateMargin = function (disc) {
        marginFactory.UpdateMargin(disc).success(function (data) {
            $scope.editMode = false;
            toaster.pop('success', "Success", "Margin updated successfully", null);
            $('#marginModel').modal('hide');
            $scope.GetMargin($scope.margin.SBUID, $scope.margin.CountryId);
            //$scope.GetAllMargin();
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Updating Margin!", null);
            $scope.error = "An Error has occured while Updating Margin! " + data.ExceptionMessage;
        });
    };

    $scope.RefreshRegion = function (sbuid) {
        if (sbuid != '') {
            OppFactory.GetAllCountry().success(function (data) {
                $scope.Region = [];
                angular.forEach(data, function (value, key) {
                    if (value.SBUId == sbuid) {
                        $scope.Region.push(value);
                    }
                });
                // if ($scope.Region.length > 0) {
                //     $scope.margin.CountryId = $scope.Region[0].Id;
                // }
            }).error(function (error) {
                $scope.Error = error;
            });
        }
    };
    $scope.GetAllVendor = function () {
        VendorService.GetAllVendor().success(function (data) {
            $scope.Vendor = data;
            $scope.Vendor.splice(0, 1);
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAllComponentType = function () {
        priceService.GetAllComponentType().success(function (data) {
            $scope.Component = data;
            $scope.Component.splice(0, 1);
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.margin = {};
        $('#marginModel').modal('hide');
    };
    $scope.showAdd = function () {
        $scope.editMode = false;
        $scope.margin = {};
        $('#marginModel').modal('show');
    };

    $scope.showEdit = function (id) {
        marginFactory.GetMargin(id).success(function (data) {
            if (data.length == 1) {
                $scope.margin = data[0];
                $scope.editMode = true;

                $('#marginModel').modal('show');
            }
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.GetAllMargin();
    $scope.GetAllSBU();
    $scope.GetAllVendor();
    $scope.GetAllComponentType();
});

// Margin Factory //

'use strict';
ReportApp.factory('marginFactory', function ($http) {
    var marginFactoryURI = BaseURL + 'Margin/';
    var marginFactory = {};

    marginFactory.GetAllMargin = function () {
        var result = $http.get(marginFactoryURI + '/');
        return result;
    }
    marginFactory.GetMargin = function (id) {
        var result = $http.get(marginFactoryURI + '/?Id=' + id);
        return result;
    }
    marginFactory.AddMargin = function (disc) {
        return $http.post(marginFactoryURI + 'AddMargin', disc);
    }
    marginFactory.UpdateMargin = function (disc) {
        return $http.post(marginFactoryURI + 'ModifyMargin', disc);
    }
    marginFactory.DeleteMargin = function (disc) {
        return $http.post(marginFactoryURI + 'DeleteMargin', disc);
    }
    return marginFactory;
});

