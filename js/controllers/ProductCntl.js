ReportApp.controller('ProductController', function ($scope, $rootScope, ProductService, toaster, $timeout) {
    $scope.ProductList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.GetAllProduct = function () {
        ProductService.GetAllProduct().success(function (data) {

            for (var j = 0; j < data.length; j++) {
                try {
                    if (data[j].ProductName == 'NA') {
                        data.splice(j, 1);
                        break;
                    }
                }
                catch (e) {
                    console.log('some error while sending data to server')
                }
            }

            $scope.ProductList = data;
            $scope.ProductGrid.api.setRowData($scope.ProductList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        { headerName: 'ProductName', field: 'ProductName', width: 305 },
        {
            headerName: 'Action', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                if (params.data.ProductName != 'NA')
                    return "</span><a data-ng-click=\"GetProductForId('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Edit</a>   &nbsp;&nbsp;| &nbsp;&nbsp;</span><a data-ng-click=\"showconfirm('" + params.data.Id + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> Delete</a>";
                else
                    return '';
            }
        }];

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.ProductGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    $scope.ProductGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowData: $scope.ProductList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllProduct();
            $scope.ProductGrid.api.sizeColumnsToFit();
        },
    };

    $scope.add = function (Product) {
        if (Product != null) {
            if (Product.ProductName.trim()) {
                ProductService.AddProduct(Product).success(function (data) {
                    if (data.Error != undefined ) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        $scope.Product = null;
                        $scope.GetAllProduct();
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'Product name added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter product name', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter product name', null);
        }

    };

    $scope.GetProductForId = function (id) {
        ProductService.GetAllProductbyId(id).success(function (data) {
            $scope.editMode = true;
            $scope.Product = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        var crc = { Id: $scope.Id };
        ProductService.DeleteProduct(crc).success(function (data) {
            $scope.Product = null;
            $scope.editMode = false;
            $scope.GetAllProduct();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'Product name deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateProduct = function (model) {
        if (model != null) {
            if (model.ProductName.trim()) {
                ProductService.UpdateProduct(model).success(function (data) {
                    $scope.editMode = false;
                    $scope.Product = null;
                    $scope.GetAllProduct()
                    toaster.pop('success', "Success", 'Product name updatedsuccessfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter product name', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter product name', null);
        }
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.Product = null;
        $scope.editMode = false;
    };

});