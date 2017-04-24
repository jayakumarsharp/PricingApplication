ReportApp.controller('CurrencyController', function ($scope, $rootScope, currencyService, reportFactory, UserFactory, toaster, $timeout) {
    $scope.CurrencyList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = true;
    $scope.SBU = [];
    $scope.Region = [];
    $scope.Currency = [];
    $scope.LegalEntity = [];
    $scope.ecurrency = {};

    $scope.GetRightsList = function () {
        angular.forEach($rootScope.RightList, function (value, key) {
            if (value.RightName.contains('Currency Rate Write')) {
                $scope.IsReadOnly = false;
            }
        });
    };

    $scope.getallcurrencyconversions = function () {
        $scope.LockedPriceSheet;
        currencyService.GetAllCurrencyConversion().success(function (data) {
            $scope.LockedPriceSheet = data;
            angular.forEach($scope.LockedPriceSheet, function(value, key){
                value.UpdatedOn = formatDate(value.UpdatedOn);
            })
            $scope.CurrencyGrid.api.setRowData($scope.LockedPriceSheet);
            $scope.CurrencyGrid.columnApi.setColumnVisible('abc', !$scope.IsReadOnly);
            $scope.CurrencyGrid.api.sizeColumnsToFit();
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.CurrencyGrid.api.sizeColumnsToFit();
        }, 1000);
    });

    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
        { headerName: 'Currency Description', field: 'CurrencyDescrition'},
        { headerName: 'Currency', field: 'Currency' },
        { headerName: 'Conversion Rate', field: 'ConversionRate'},
        { headerName: 'Updated By', field: 'UpdatedBy' },
        { headerName: 'Updated On', field: 'UpdatedOn'},
        {
            headerName: 'Action', field: 'abc', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
                return "</span><a data-ng-click=\"GetCurrencyConversionForId('" + params.data.Id + "')\" href=\"javascript:;\"> Edit</a>|</span><a data-ng-click=\"showconfirm('" + params.data.Id + "')\" href=\"javascript:;\"> Delete</a>";
            }
        }];


    $scope.CurrencyGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        suppressHorizontalScroll: true,
        suppressCellSelection: true,
        rowData: [],
        onGridReady: function (event) {
            $scope.getallcurrencyconversions()
            $scope.CurrencyGrid.api.sizeColumnsToFit();
        },
    };

    $scope.showadd = function () {
        $scope.editMode = false;
        $scope.currency = {};
        $scope.ecurrency.CurrencyDescrition = '';
        $('#currencyModel').modal('show');

    };

    $scope.GetAllCurrency = function () {
        currencyService.GetAllCurrency().success(function (data) {
            $scope.Currency = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAllCurrency();

    $scope.add = function (currency) {
        if (currency != null) {
            currency.UpdatedBy = $rootScope.UserInfo.user.userId;
            currencyService.AddCurrencyConversion(currency).success(function (data) {
                if (data.original != null && data.original.number == 2627) {
                    toaster.pop('error', "Error", "Currency is already available", null);
                }
                else {
                    $scope.currency = {};
                    $('#currencyModel').modal('hide');
                    toaster.pop('success', "Success", "Currency rate added successfully", null);
                    $scope.getallcurrencyconversions();
                }
            }).error(function (data) {
                debugger;
                $scope.error = "An Error has occured while Adding currency! " + data.ExceptionMessage;
            });
        }
    };

    $scope.GetCurrencyConversionForId = function (id) {
        currencyService.GetCurrencyConversionbyId(id).success(function (data) {
            $scope.editMode = true;
            $scope.ecurrency = data[0];
            $('#currencyModel').modal('show');

        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        var crc = { Id: $scope.Id };
        currencyService.DeletecurrencyConversion(crc).success(function (data) {
            $scope.editMode = false;
            $scope.getallcurrencyconversions();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", "Currency rate deleted successfully", null);
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };



    $scope.UpdatecurrencyConversion = function (model) {
        model.UpdatedBy = $rootScope.UserInfo.user.userId;
        currencyService.UpdatecurrencyConversion(model).success(function (data) {
            $scope.editMode = false;
            toaster.pop('success', "Success", "Currency rate updated successfully", null);
            $('#currencyModel').modal('hide');
            $scope.getallcurrencyconversions()
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    var formatDate = function (indate) {
        if (indate != null) {
            indateTime = indate.split('T');
            var date = new Date(indateTime[0]);
            var time = indateTime[1].substring(0, 8);
            return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time;
        }
        else {
            return '';
        }
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.currency = {};
        $scope.ecurrency = {};
        $('#currencyModel').modal('hide');
    };

    $scope.updatecancel = function (data) {
        currencyService.GetCurrencyConversionbyId(id).success(function (data) {
            $scope.editMode = true;
            $scope.ecurrency = data[0];
            $('#currencyModel').modal('show');

        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });

    };

    $scope.SetCurrencyDescription = function (currencyId) {
        if (currencyId != null && currencyId != '' && currencyId != undefined) {
            var currDesc = '';
            angular.forEach($scope.Currency, function (value, key) {
                if (value.Id == currencyId) {
                    currDesc = value.CurrencyDescrition;
                }
            })
            $scope.ecurrency.CurrencyDescrition = currDesc;
        }
        else {
            $scope.ecurrency.CurrencyDescrition = '';
        }
    };

    $scope.GetRightsList();

});