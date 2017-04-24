ReportApp.controller('ProjectMarginAdminController', function ($scope, $rootScope, ProjectMarginAdminFactory, UserFactory, OppFactory, VendorService, priceService, toaster, $timeout) {
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
    { headerName: 'LOB Type', field: 'LOBName', width: 200 },
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
            $scope.ProjectMarginAdminGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.ProjectMarginAdminGrid = {
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
            $scope.ProjectMarginAdminGrid.api.sizeColumnsToFit();
        },
    };
    $scope.TempDiscount = [];

    $scope.GetDiscount = function (SBUID, CountryId) {
        ProjectMarginAdminFactory.GetAllProjectMarginAdmin().success(function (data) {
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
                    $scope.ProjectMarginAdminGrid.api.setRowData($scope.TempDiscount);
                    $timeout(function () {
                        $scope.ProjectMarginAdminGrid.api.refreshView();
                    }, 50);
                }
                else {
                    $scope.showGrid = true;
                    $scope.IsDataAvailable = false;
                    $scope.ProjectMarginAdminGrid.api.setRowData($scope.TempDiscount);
                    $timeout(function () {
                        $scope.ProjectMarginAdminGrid.api.refreshView();
                    }, 50);
                }
            }
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAllDiscount = function () {
        ProjectMarginAdminFactory.GetAllProjectMarginAdmin().success(function (data) {
            $scope.Discount = data;
            $scope.ProjectMarginAdminGrid.api.setRowData($scope.Discount);
            $timeout(function () {
                $scope.ProjectMarginAdminGrid.api.refreshView();
            }, 50);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AddDiscount = function (discount) {
        if (discount != null) {
            ProjectMarginAdminFactory.AddProjectMarginAdmin(discount).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {
                    $scope.discount = {};
                    $('#discountModel').modal('hide');
                    toaster.pop('success', "Success", "Project Margin added successfully", null);
                    $scope.GetDiscount($scope.discount.SBUID, $scope.discount.CountryId);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding Project Margin!", null);
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
        ProjectMarginAdminFactory.DeleteProjectMarginAdmin(disc).success(function (data) {
            $scope.editMode = false;
            //$scope.GetAllDiscount();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", "Project Margin deleted successfully", null);
            $scope.GetDiscount($scope.discount.SBUID, $scope.discount.CountryId);
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Deleting Project Margin!", null);
            $scope.error = "An Error has occured while Deleting Discount! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateDiscount = function (disc) {
        ProjectMarginAdminFactory.UpdateProjectMarginAdmin(disc).success(function (data) {
            $scope.editMode = false;
            toaster.pop('success', "Success", "Project Margin updated successfully", null);
            $('#discountModel').modal('hide');
            $scope.GetDiscount($scope.discount.SBUID, $scope.discount.CountryId);
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Updating Project Margin!", null);
            $scope.error = "An Error has occured while Updating Project Margin! " + data.ExceptionMessage;
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
            if (data.length > 0) {
                $scope.Vendor = _.where(data, { VendorName: "Servion" })
            }

            //$scope.Vendor.splice(0, 1);
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAllLOBList = function () {
        priceService.GetAllLOBList().success(function (data) {
            $scope.Component = data;
            $scope.Component.splice(0, 1);
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    // $scope.GetAllLOBType = function () {
    //     priceService.GetAllLOBType().success(function (data) {
    //         $scope.Component = data;
    //         $scope.Component.splice(0, 1);
    //     }).error(function (error) {
    //         $scope.Error = error;
    //     });
    // };

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
        ProjectMarginAdminFactory.GetProjectMarginAdmin(id).success(function (data) {
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
    $scope.GetAllLOBList();
});

'use strict';
ReportApp.factory('ProjectMarginAdminFactory', function ($http) {
    var ProjectMarginAdminFactoryURI = BaseURL + 'ProjectMarginAdmin/';
    var ProjectMarginAdminFactory = {};

    ProjectMarginAdminFactory.GetAllProjectMarginAdmin = function () {
        var result = $http.get(ProjectMarginAdminFactoryURI + '/');
        return result;
    }
    ProjectMarginAdminFactory.GetProjectMarginAdmin = function (id) {
        var result = $http.get(ProjectMarginAdminFactoryURI + '/?Id=' + id);
        return result;
    }
    ProjectMarginAdminFactory.AddProjectMarginAdmin = function (disc) {
        return $http.post(ProjectMarginAdminFactoryURI + 'AddProjectMarginAdmin', disc);
    }
    ProjectMarginAdminFactory.UpdateProjectMarginAdmin = function (disc) {
        return $http.post(ProjectMarginAdminFactoryURI + 'ModifyProjectMarginAdmin', disc);
    }
    ProjectMarginAdminFactory.DeleteProjectMarginAdmin = function (disc) {
        return $http.post(ProjectMarginAdminFactoryURI + 'DeleteProjectMarginAdmin', disc);
    }
    return ProjectMarginAdminFactory;
});