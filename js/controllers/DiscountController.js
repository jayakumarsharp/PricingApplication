ReportApp.controller('DiscountController', function ($scope, $rootScope, discountFactory, UserFactory, OppFactory, VendorService, priceService, toaster, $timeout) {
    $scope.editMode = false;
    $scope.discount = {};
    $scope.Discount = [];
    $scope.SBU = [];
    $scope.Region = [];
    $scope.Component = [];
    $scope.Vendor = [];
    $scope.TempDiscount = [];
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
            $scope.DiscountGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.DiscountGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowHeight: 25,
        headerHeight: 37,
        enableColResize: true,
        suppressRowClickSelection: true,
        suppressHorizontalScroll: true,
        suppressCellSelection: true,
        rowData: $scope.Discount,
        onGridReady: function (event) {
            $scope.GetAllDiscount();
            $scope.DiscountGrid.api.sizeColumnsToFit();
        },
    };
    $scope.TempDiscount = [];

    $scope.GetDiscount = function (SBUID, CountryId) {
        discountFactory.GetAllDiscount().success(function (data) {
            $scope.Discount = data;
            $scope.TempDiscount = [];
            $scope.showGrid = false;
            $scope.IsDataAvailable = false;

            if (SBUID != null && SBUID != undefined && CountryId != null && CountryId != undefined) {

                for (var i = 0; i < $scope.Discount.length; i++) {

                    if (parseInt($scope.Discount[i].SBUID) == SBUID && parseInt($scope.Discount[i].RegionId) == CountryId) {
                        $scope.TempDiscount.push($scope.Discount[i]);
                    }
                }
                console.log($scope.TempDiscount);
                if ($scope.TempDiscount.length > 0) {
                    $scope.showGrid = true;
                    $scope.IsDataAvailable = true;
                    $scope.DiscountGrid.api.setRowData($scope.TempDiscount);
                    $timeout(function () {
                            $scope.DiscountGrid.api.refreshView();
                        }, 50);
                }
                else {
                    $scope.showGrid = true;
                    $scope.IsDataAvailable = false;
                    $scope.DiscountGrid.api.setRowData($scope.TempDiscount);
                     $timeout(function () {
                            $scope.DiscountGrid.api.refreshView();
                        }, 50);
                }
            }
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAllDiscount = function () {
        discountFactory.GetAllDiscount().success(function (data) {
            $scope.Discount = data;
            $scope.DiscountGrid.api.setRowData($scope.Discount);
            $timeout(function () {
                            $scope.DiscountGrid.api.refreshView();
                        }, 50);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AddDiscount = function (discount) {
        if (discount != null) {
            discountFactory.AddDiscount(discount).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {
                    $scope.discount = {};
                    $('#discountModel').modal('hide');
                    toaster.pop('success', "Success", "Discount added successfully", null);
                    $scope.GetDiscount($scope.discount.SBUID, $scope.discount.CountryId);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Discount!", null);
                $scope.error = "An Error has occured while Adding Discount! " + data.ExceptionMessage;
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
        discountFactory.DeleteDiscount(disc).success(function (data) {
            $scope.editMode = false;
            //$scope.GetAllDiscount();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", "Discount deleted successfully", null);
            $scope.GetDiscount($scope.discount.SBUID, $scope.discount.CountryId);
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Deleting Discount!", null);
            $scope.error = "An Error has occured while Deleting Discount! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateDiscount = function (disc) {
        discountFactory.UpdateDiscount(disc).success(function (data) {
            $scope.editMode = false;
            toaster.pop('success', "Success", "Discount updated successfully", null);
            $('#discountModel').modal('hide');
            $scope.GetDiscount($scope.discount.SBUID, $scope.discount.CountryId);
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Updating Discount!", null);
            $scope.error = "An Error has occured while Updating Discount! " + data.ExceptionMessage;
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
                //     $scope.discount.CountryId = $scope.Region[0].Id;
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
        $scope.discount = {};
        $('#discountModel').modal('hide');
    };
    $scope.showAdd = function () {
        $scope.editMode = false;
        $scope.discount = {};
        $('#discountModel').modal('show');
    };

    $scope.showEdit = function (id) {
        discountFactory.GetDiscount(id).success(function (data) {
            if (data.length == 1) {
                $scope.discount = data[0];
                $scope.editMode = true;

                $('#discountModel').modal('show');
            }
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.GetAllDiscount();
    $scope.GetAllSBU();
    $scope.GetAllVendor();
    $scope.GetAllComponentType();
});

// Discount Factory //

'use strict';
ReportApp.factory('discountFactory', function ($http) {
    var discountFactoryURI = BaseURL + 'Discount/';
    var discountFactory = {};

    discountFactory.GetAllDiscount = function () {
        var result = $http.get(discountFactoryURI + '/');
        return result;
    }
    discountFactory.GetDiscount = function (id) {
        var result = $http.get(discountFactoryURI + '/?Id=' + id);
        return result;
    }
    discountFactory.AddDiscount = function (disc) {
        return $http.post(discountFactoryURI + 'AddDiscount', disc);
    }
    discountFactory.UpdateDiscount = function (disc) {
        return $http.post(discountFactoryURI + 'ModifyDiscount', disc);
    }
    discountFactory.DeleteDiscount = function (disc) {
        return $http.post(discountFactoryURI + 'DeleteDiscount', disc);
    }
    return discountFactory;
});



