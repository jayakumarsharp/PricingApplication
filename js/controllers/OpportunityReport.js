
ReportApp.controller('OpportunityReportController', function ($scope, $rootScope, OppFactory, UserFactory, toaster, reportFactory, $timeout, OpportunityReportFactory, Opportunityservice, OpportunityReportFactory) {
    $scope.SBUs = [];
    $scope.OppReport = {};
    $scope.SalesStatusIds = [];
    $scope.SBUIds = [];
    $scope.preSalesStatusIds = [];
    $scope.ReportGriddata = [];

    $scope.getAllSalestatus = function () {
        Opportunityservice.getAllSalestatus().success(function (data) {
            $scope.SalesStatus = data;
            angular.forEach(data, function (value, key) {
                $scope.SalesStatusIds.push(value.Id);
            });

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    var columnDefs = [
        {
            headerName: "SBU", field: "SBU", editable: false, width: 70, headerTooltip: "SBU", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Region", field: "CountryName", editable: false, width: 70, headerTooltip: "Region", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Opportunity ID", field: "OppId", editable: false, width: 80, headerTooltip: "Opportunity ID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Opportunity Name", field: "OpportunityName", editable: false, width: 150, headerTooltip: "Opportunity Name", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },

        {
            headerName: "Account Name", field: "AccountName", editable: false, width: 150, headerTooltip: "Account Name", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Sales Name", field: "AccountSalesManager", width: 120, headerTooltip: "Sales Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
        },

        {
            headerName: "RSC Team", field: "RSCUser", editable: false, width: 120, headerTooltip: "RSC Team", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "CSC Team", field: "CSCUser", editable: false, width: 120, headerTooltip: "CSC Team", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Sales Status", field: "SalesStatus", editable: false, width: 120, headerTooltip: "Sales Status", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Opportunity Type", field: "opportunitytype", editable: false, width: 120, headerTooltip: "Opportunity Type", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Customer Type", field: "CustomerType", editable: false, width: 120, headerTooltip: "Customer Type", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Pre Bid Estimated TCV", field: "OpportunityValue", editable: false, width: 80, headerTooltip: "Pre Bid Estimated TCV", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },

        {
            headerName: "TCV - VAD", field: "TotalVAD", editable: false, width: 100, headerTooltip: "TCV - VAD", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "ACV - VAD", field: "VAD1Year", editable: false, width: 100, headerTooltip: "ACV - VAD", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "TCV - Topline", field: "TotalCusPrice", editable: false, width: 100, headerTooltip: "TCV - Topline", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "CSC Cycle Count", field: "Cycle", editable: false, width: 60, headerTooltip: "CSC Cycle Count", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },

        {
            headerName: "Pre Sales Man Hours", field: "INHours", editable: false, width: 60, headerTooltip: "Pre Sales Man Hours", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Action", field: "Action", editable: true, width: 200, headerTooltip: "Action", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Pre Sales Expected Closure Date", field: "ExpectedClosureDate", editable: false, width: 80, headerTooltip: "Pre Sales Expected Closure Date", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },

        {
            headerName: "Pre Sales Actual Closure Date", field: "ActualCloseDate", editable: false, width: 80, headerTooltip: "Pre Sales Actual Closure Date", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Partner / Direct", field: "OpportunityCategory", editable: false, width: 60, headerTooltip: "Partner / Direct", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },

        {
            headerName: "Principal", field: "OEMName", editable: false, width: 70, headerTooltip: "Principal", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Vertical", field: "Vertical", editable: false, width: 70, headerTooltip: "Vertical", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },

        {
            headerName: "Opportunity Creation Date", field: "CreatedOn", editable: false, width: 80, headerTooltip: "Opportunity Creation Date", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },

    ];


    $scope.AllOpps = [];

    $scope.OppReportGrid = {
        columnDefs: columnDefs,
        rowData: $scope.ReportGriddata,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        angularCompileRows: true,
        enableColResize: true,

        onGridReady: function (event) {
            // $scope.OppReportGrid.api.sizeColumnsToFit();
        },
        onCellValueChanged: cellValueChangedFunction5,
    };
    function cellValueChangedFunction5(params) {
        var OppReport = params.data;

        OpportunityReportFactory.UpdateAction(OppReport).success(function (data) {
            console.log(data)
        }).error(function (error) {
            $scope.Error = error;
        });
    }
    $scope.getAllPreSalestatus = function () {
        Opportunityservice.getAllPreSalestatus().success(function (data) {
            $scope.ListPreSalesStatus = data;

            angular.forEach(data, function (value, key) {
                $scope.preSalesStatusIds.push(value.Id);
            });


        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetAllSBU = function () {
        UserFactory.GetAllSBU().success(function (data) {
            $scope.SBUs = [];
            angular.forEach(data, function (value, key) {
                if (value.id != '6') {
                    $scope.SBUs.push(value);
                    $scope.SBUIds.push(value.id);
                }

            });

        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.MakeContainerFullScreen = function (state) {
        $scope.DefautState = !state;
        if ($scope.DefautState) {
            document.getElementsByClassName('main-sidebar')[0].style.display = "none";
            document.getElementsByClassName('main-header')[0].style.display = "none";
            document.getElementsByClassName('main-footer')[0].style.display = "none";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = "0px";
        }
        else {
            document.getElementsByClassName('main-sidebar')[0].style.display = "block";
            document.getElementsByClassName('main-header')[0].style.display = "block";
            document.getElementsByClassName('main-footer')[0].style.display = "block";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = null;
        }
    }

    $scope.GetAllSBU();
    $scope.getAllSalestatus();
    $scope.getAllPreSalestatus();
    $scope.showUtilsGrid = false;
    $scope.GenerateReport = function (OppReport) {

        if ($scope.ValidateFromToDates(OppReport.fromDate, OppReport.toDate) && $scope.validatetwovalues(OppReport.TCVFrom, OppReport.TCVTo) && $scope.validatetwovalues(OppReport.TCV1From, OppReport.TCV1To) ) {
            if (OppReport.SBUId == undefined || OppReport.SBUId == '') {
                OppReport.SBUId = $scope.SBUIds;
            }
            if (OppReport.SalesStatusId == undefined || OppReport.SalesStatusId == '') {
                OppReport.SalesStatusId = $scope.SalesStatusIds;
            }
            if (OppReport.PreSalesStatusId == undefined || OppReport.PreSalesStatusId == '') {
                OppReport.PreSalesStatusId = $scope.preSalesStatusIds;
            }
            if (OppReport.TCVFrom == undefined) {
                OppReport.TCVFrom = '';
                OppReport.TCVTo = '';
            }
            if (OppReport.TCV1To == undefined) {
                OppReport.TCV1From = '';
                OppReport.TCV1To = '';
            }
            if (OppReport.fromDate == undefined || OppReport.toDate == undefined) {
                OppReport.fromDate = '';
                OppReport.toDate = '';
            }

            OpportunityReportFactory.GetOpportunityReport(OppReport).success(function (data) {
                $scope.ReportGriddata = [];
                var data = _.each(data[0], function (someThing) {
                    if (someThing.ExpectedClosureDate != undefined && someThing.ExpectedClosureDate != '')
                        someThing.ExpectedClosureDate = moment(someThing.ExpectedClosureDate).format('MM/DD/YYYY');
                    if (someThing.ActualCloseDate != undefined && someThing.ActualCloseDate != '')
                        someThing.ActualCloseDate = moment(someThing.ActualCloseDate).format('MM/DD/YYYY');
                    if (someThing.CreatedOn != undefined && someThing.CreatedOn != '')
                        someThing.CreatedOn = moment(someThing.CreatedOn).format('MM/DD/YYYY');

                })
                for (var i = 0; i < data.length; i++) {
                    var tempArray = JSON.parse(JSON.stringify(data[i]));
                    $scope.ReportGriddata.push(tempArray);
                }

                $scope.showUtilsGrid = true;
                $scope.OppReportGrid.api.setRowData($scope.ReportGriddata);
            }).error(function (error) {
                $scope.Error = error;
            })

        }

    }


    $scope.Export = function () {
        OpportunityReportFactory.ExportToExcelSheet($scope.ReportGriddata).success(function (data) {
            //console.log(data);
            var url = BaseURL + 'ExportFiles/' + data.name;

            $scope.downloadurl = url;
            $scope.filename = data.name;
            setTimeout(function () {
                $('#downloadpdf')[0].click();
            }, 1000);

            toaster.pop('success', "Success", "Opportunity wise Report exported successfully", null);
        }).error(function (error) {
            $scope.Error = error;
        });

    };

    $scope.validatetwovalues = function (start, end) {
        if (start != '' && end != '') {
            if (start > end) {
                toaster.pop('warning', "Warning", 'Starting value cannot be greater than end value', null);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    };
    $scope.ValidateFromToDates = function (fromDate, toDate) {

        console.log('fromDate - ' + fromDate);
        console.log('toDate - ' + toDate);

        if (fromDate != '' && toDate != '') {
            var currDate = new Date();
            fromDate = new Date(fromDate);
            toDate = new Date(toDate);
            var twoDigitMonthFrom = ((fromDate.getMonth().length + 1) === 1) ? (fromDate.getMonth() + 1) : '0' + (fromDate.getMonth() + 1);
            var twoDigitMonthTo = ((toDate.getMonth().length + 1) === 1) ? (toDate.getMonth() + 1) : '0' + (toDate.getMonth() + 1);
            var twoDigitMonthCur = ((currDate.getMonth().length + 1) === 1) ? (currDate.getMonth() + 1) : '0' + (currDate.getMonth() + 1);

            var FromDate = fromDate.getFullYear() + "-" + twoDigitMonthFrom + "-" + fromDate.getDate();
            var ToDate = toDate.getFullYear() + "-" + twoDigitMonthTo + "-" + toDate.getDate();
            var currentDate = currDate.getFullYear() + "-" + twoDigitMonthCur + "-" + currDate.getDate();

            var from = new Date(FromDate);
            var to = new Date(ToDate);
            var current = new Date(currentDate);

            console.log('Formatted fromDate: ' + from);
            console.log('Formatted toDate: ' + to);

            if (from > current) {
                console.log('From date cannot be greater than current date');
                toaster.pop('warning', "Warning", 'From date cannot be greater than current date', null);
                return false;
            }
            else if (to > current) {
                toaster.pop('warning', "Warning", 'To date cannot be greater than current date', null);
                console.log('To date cannot be greater than current date');
                return false;
            }
            else if (from > to) {
                console.log('From date cannot be greater than To date');
                toaster.pop('warning', "Warning", 'From date cannot be greater than To date', null);
                return false;
            }
            else {
                console.log('Date is valid');
                return true;
            }

        }
        else {
            return true;
        }
    };


});

'use strict';
ReportApp.factory('OpportunityReportFactory', function ($http) {
    var OppReportURL = BaseURL + 'Report';
    var OppReportFactory = {};

    OppReportFactory.GetOpportunityReport = function (OppReport) {
        var result = $http.post(OppReportURL + '/GetOpportunityReport', OppReport);
        return result;
    }

    OppReportFactory.ExportToExcelSheet = function (OppReport) {
        var result = $http.post(OppReportURL + '/ExportToExcelSheetOpp', OppReport);
        return result;
    }
    OppReportFactory.UpdateAction = function (OppReport) {
        var result = $http.post(OppReportURL + '/UpdateAction', OppReport);
        return result;
    }


    return OppReportFactory;
});

