ReportApp.controller('DynamiceSectionConfigController', function ($scope, $rootScope, EstimationPageSectionService, toaster, $timeout) {
    $scope.VendorList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.showAdd = function () {
        $scope.editMode = false;
        $scope.Vendor = {};
        $('#AddModel').modal('show');
    };

    $scope.GetAllVendor = function () {
        EstimationPageSectionService.GetAllPageSections().success(function (data) {
            if (data.length > 0)
                $scope.VendorGrid.api.setRowData(data);
        }).error(function (error) {
            $scope.Error = error;
        })
        EstimationPageSectionService.GetPageList().success(function (data) {
            if (data.length > 0)
                $scope.Pages = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.VendorGrid.api.sizeColumnsToFit();
        }, 1000);
    });


    var columnDefs = [{ headerName: '', hide: true, field: 'Id', width: 1 },
    { headerName: 'Page Name', field: 'PageName', width: 305 },
    { headerName: 'Section Name', field: 'SectionName', width: 305 },
    { headerName: 'Display Name', field: 'DisplayName', width: 305 },
    { headerName: 'Order Sequence', field: 'OrderSequence', width: 100 },
    {
        headerName: 'Action', width: 120, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, cellRenderer: function (params) {
            return "</span><a data-ng-click=\"showEdit('" + params.data.Id + "','" + params.data.PageName + "','" + params.data.SectionName + "','" + params.data.DisplayName + "','" + params.data.OrderSequence + "')\" href=\"javascript:;\"> Edit</a></span>";
        }
    }
    ];

    $scope.showEdit = function (id, pagename, section, display, order) {

        $scope.Vendor = { Id: id, SectionName: section, DisplayName: display, OrderSequence: order, PageName: pagename };
        $scope.editMode = true;

        $('#AddModel').modal('show');

    };

    $scope.UpdateMargin = function (Vendor) {
        EstimationPageSectionService.UpdatePageSection(Vendor).success(function (data) {
            $scope.editMode = false;
            toaster.pop('success', "Success", "Dynamic Section updated successfully", null);
            $('#AddModel').modal('hide');
            $scope.GetAllVendor();
        }).error(function (data) {
            toaster.pop('error', "Error", "An Error has occured while Updating Margin!", null);
            $scope.error = "An Error has occured while Updating Margin! " + data.ExceptionMessage;
        });
    };


    $scope.VendorGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        enableFilter: true,
        rowData: $scope.VendorList,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        onGridReady: function (event) {
            $scope.GetAllVendor();
            $scope.VendorGrid.api.sizeColumnsToFit();
        },
    };

    $scope.add = function (Vendor) {
        if (Vendor != null) {
            if (Vendor.SectionName.trim()) {
                EstimationPageSectionService.AddPageSection(Vendor).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.Vendor = null;
                        $scope.GetAllVendor();
                        $scope.editMode = false;
                        $('#AddModel').modal('hide');
                        toaster.pop('success', "Success", 'Dynamic Section added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter vendor name', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter product name', null);
        }
    };

    $scope.GetVendorForId = function (id) {
        EstimationPageSectionService.GetAllVendorbyId(id).success(function (data) {
            $scope.editMode = true;
            $scope.Vendor = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };


    $scope.cancel = function () {
        $scope.Vendor = null;
        $scope.editMode = false;
        $('#AddModel').modal('hide');
    };

});

