/*app.js tabs*/


$(function () {

    $('#Date').datepicker({
        orientation: "bottom auto",
        autoclose: true,
        todayHighlight: true
    });
});



ReportApp.controller('OpportunityCtrl', ['$scope', '$routeParams', 'Opportunityservice', 'OppFactory', 'UserFactory', 'reportFactory', '$rootScope', '$filter', '$window', 'toaster', '$location', function ($scope, $routeParams, Opportunityservice, OppFactory, UserFactory, reportFactory, $rootScope, $filter, $window, toaster, $location) {
    $scope.view360imgPath = View360ImagesPath;
    $scope.filters = {};
    $scope.Country = [];
    $scope.Opps = [];
    $scope.Opp = {};
    $scope.OppVersions = [];
    $scope.PriceVersions = [];
    $scope.isPriceSheetExist = false;
    $scope.view360imgPath = View360ImagesPath;
    $scope.ErrorList = [];
    $scope.CSCOwnerID;
    $scope.ParentOpportunityList = [];
    $scope.ChildOpportunityList = [];
    $scope.OpportunityDetail = [];
    $scope.OpportunityConfigurationDetail = {};
    $scope.DefaultConfig;
    $scope.ServionLegalEntity = [];
    $scope.OpportunityServionLegalEntity = [];
    $scope.EstimationProduct = [];
    $scope.OpportunityEstimationProduct = [];

    $scope.OpportunityCustomerTypeList = [];
    $scope.OppConfigDetail;
    $scope.OEMList;
    $scope.CSCStatus;
    $scope.SalesStatus;
    $scope.CSCOpptype;
    $scope.OppCategory;
    $scope.DataCenterLocated;
    $scope.CSCUsers;
    $scope.OtherUsers;
    $scope.RSCUsers;
    $scope.OpportunityUsers = [];
    $scope.OpportunityConfigDefault = [];
    $scope.OpportunityHistorydataList = [];
    $scope.ManDayshours = [{ Type: 'Days' }, { Type: 'Hours' }];
    $scope.CurrentOppSBU = 6;
    $scope.errorList = [];
    $scope.message = '';
    $scope.master_AvailableUser_RSC = [];
    $scope.master_AvailableUser_Others = [];
    $scope.master_AvailableUser_TM = [];
    $scope.master_AvailableUser_Estimation = [];
    $scope.master_CSCOwnerID = '';

    $scope.SelectedCSCUsers;
    $scope.SelectedCSCTeamUsers;
    $scope.SelectedOtherUsers;
    $scope.SelectedRSCUsers;

    $scope.ColumnFit = true;
    $scope.Tab1Isvalid = true;
    $scope.Tab2Isvalid = true;
    $scope.Tab3Isvalid = true;
    $scope.CanSave = true;
    $scope.orginalCSCStatusId = null;
    $scope.showErr = false;

    $scope.ShowTab1 = false;
    $scope.ShowTab2 = false;
    $scope.ShowTab3 = false;
    $scope.ShowTab4 = false;
    $scope.ShowPrice = false;
    $scope.ShowPayment = false;
    $scope.RightToViewOpp = true;
    $scope.IsSCUser = false;
    $scope.tempSLADate = '';
    $scope.tempExpectedDate = '';

    $scope.master;

    $scope.IsUserSCHead = function () {
        UserFactory.GetUser($rootScope.UserInfo.user.userId).success(function (data) {
            if (data.TypeId == '8') {
                $scope.IsSCUser = true;
            }
        }).error(function (err) {
            $scope.IsSCUser = false;
        });
    };

    $scope.ValidateTabRights = function () {
        $scope.currentTab = ''
        angular.forEach($rootScope.RightList, function (value, key) {
            if (value.RightName == 'CSC Details') {
                $scope.ShowTab3 = true;
                $scope.currentTab = 'js/views/Opportunity/CSCDetails.html';
            }
            else if (value.RightName == 'Access Details') {
                $scope.ShowTab2 = true;
                $scope.currentTab = 'js/views/Opportunity/AccessDetails.html';
            }
            else if (value.RightName == 'Configuration Details') {
                $scope.ShowTab1 = true;
                $scope.currentTab = 'js/views/Opportunity/OpportunityDetailTab.html';
            }
        });
        if ($scope.currentTab == '') {
            $scope.RightToViewOpp = false;
        }
    }

    $scope.ShowPricing = function () {
        var showprice = false;
        var showpay = false;

        $scope.ShowPrice = false;
        $scope.ShowPayment = false;

        reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName == 'Pricing Read' || value.RightName == 'Pricing Write') {
                    showprice = true;
                }
                else if (value.RightName == 'Payment Read' || value.RightName == 'Payment Write') {
                    showpay = true;
                }
            })
            if (showprice) {
                $scope.ShowPrice = true;
            }
            if (showpay) {
                $scope.ShowPayment = true;
            }
        });
    };
    //$scope.tabs = [{
    //    title: 'Opportunity/Site/Configuration Details ',
    //    url: 'js/views/Opportunity/OpportunityDetailTab.html'
    //},
    //{
    //    title: 'Access Details',
    //    url: 'js/views/Opportunity/AccessDetails.html'
    //},
    //{
    //    title: 'CSC Details/Opportunity History ',
    //    url: 'js/views/Opportunity/CSCDetails.html'
    //}];

    // $scope.currentTab = 'js/views/Opportunity/OpportunityDetailTab.html';

    $scope.onClickTab = function (url) {
        if ($scope.tempSLADate == '' || $scope.tempSLADate == undefined) {
            $scope.tempSLADate = $("#SLAClosureDate").val();
        }
        if ($scope.tempExpectedDate == '' || $scope.tempExpectedDate == undefined) {
            $scope.tempExpectedDate = $("#ExpectedClosureDate").val();
        }

        $scope.OpportunityDetail.SLAClosureDate = ConvertToGridDate($scope.tempSLADate);
        $scope.OpportunityDetail.ExpectedClosureDate = ConvertToGridDate($scope.tempExpectedDate);

        if ($scope.currentTab.indexOf("OpportunityDetailTab") > -1) {
            $scope.Tab1Isvalid = $scope.opportunityform.$valid;
        }
        else if ($scope.currentTab.indexOf("AccessDetails") > -1) {
            $scope.Tab2Isvalid = ($scope.listB_RSC.length > 0 && $scope.listB_Others.length > 0);
        }
        else if ($scope.currentTab.indexOf("CSCDetails") > -1) {
            $scope.Tab3Isvalid = $scope.opportunityform.$valid;
        }

        $scope.CanSave = $scope.Tab1Isvalid && $scope.Tab2Isvalid && $scope.Tab3Isvalid;
        // alert($scope.Tab1Isvalid + '  ' + $scope.Tab2Isvalid + '  ' + $scope.Tab3Isvalid);
        $scope.currentTab = url;

    }

    $scope.isActiveTab = function (tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    //Start angular grid

    var columnDefs = [{
        headerName: "Cycle",
        field: "Cycle",
        editable: false,
        width: 60,
        headerTooltip: "ActualCloseDate",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }, {
        headerName: "Open Date",
        field: "OpenDate",
        editable: false,
        width: 100,
        headerTooltip: "Open Date Name",
        cellStyle: {
            'text-align': 'left',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            return (params.value);
        }
    }, {
        headerName: "SLA Date",
        field: "SLAClosureDate",
        editable: false,
        width: 100,
        headerTooltip: "SLA Closure Date",
        cellStyle: {
            'text-align': 'left',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            return (params.value);
        }
    }, {
        headerName: "Exp Closure Date",
        field: "ExpectedClosureDate",
        editable: false,
        width: 135,
        headerTooltip: "Expected Closure Date",
        cellStyle: {
            'text-align': 'left',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            return (params.value);
        }
    }, {
        headerName: "Actual Close Date",
        field: "ActualCloseDate",
        editable: false,
        width: 135,
        headerTooltip: "ActualCloseDate",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            return (params.value);
        }
    },

    {
        headerName: "Within SLA",
        field: "WithinSLA",
        editable: false,
        width: 100,
        headerTooltip: "Within SLA",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {

            return (params.value);
        }
    }, {
        headerName: "Days delayed",
        field: "DelayedDaycount",
        editable: false,
        width: 120,
        headerTooltip: "No of days delayed",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            return (params.value);
        }
    }, {
        headerName: "Status",
        field: "StatusName",
        editable: false,
        width: 80,
        headerTooltip: "Status",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }, {
        headerName: "CSC Team Member",
        field: "CSCTeamMember_Users",
        editable: false,
        width: 140,
        headerTooltip: "CSC Team Member",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            if (params.value != null && params.value != '')
                return '<span title=' + params.value.replace(/\,/g, "&#013;") + '>' + params.value + '</span>'
            else {
                return '';
            }
        }
    }, {
        headerName: "RSC",
        field: "RSC_users",
        editable: false,
        width: 120,
        headerTooltip: "RSC users",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            if (params.value != null && params.value != '')
                return '<span title=' + params.value.replace(/\,/g, "&#013;") + '>' + params.value + '</span>'
            else {
                return '';
            }
        }
    }, {
        headerName: "Other users",
        field: "Other_users",
        editable: false,
        width: 120,
        headerTooltip: "Other users",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            if (params.value != null && params.value != '')
                return '<span title=' + params.value.replace(/\,/g, "&#013;") + '>' + params.value + '</span>'
            else {
                return '';
            }
        }
    }, {
        headerName: "CSC Owner",
        field: "CSCOwner_Users",
        editable: false,
        width: 150,
        headerTooltip: "CSC Owner",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            if (params.value != null && params.value != '')
                return '<span title=' + params.value.replace(/\,/g, "&#013;") + '>' + params.value + '</span>'
            else {
                return '';
            }
        }
    }, {
        headerName: "Comment",
        field: "Comment",
        editable: false,
        width: 150,
        headerTooltip: "Comment",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        },
        cellRenderer: function (params) {
            if (params.value != null && params.value != '')
                return '<span title=' + params.value.replace(/\,/g, "&#013;") + '>' + params.value + '</span>'
            else {
                return '';
            }
        }
    }, {
        headerName: "Open User",
        field: "OpenUser",
        editable: false,
        width: 150,
        headerTooltip: "Within SLA",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }, {
        headerName: "Closed user",
        field: "CloseUser",
        editable: false,
        width: 150,
        headerTooltip: "Number of Days Delay",
        cellStyle: {
            'text-align': 'center',
            'display': 'flex',
            'align-items': 'center'
        }
    }
    ];

    function GetDelayedDaycount(inDate) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var firstDate = new Date(2008, 01, 12);
        var q = new Date();
        var m = q.getMonth() + 1;
        var d = q.getDay();
        var y = q.getFullYear();


        var todaysdate = new Date(y, m, d);

        var indate = new Date(inDate);
        var twoDigitMonthIn = ((indate.getMonth().length + 1) === 1) ? (indate.getMonth() + 1) : '0' + (indate.getMonth() + 1);
        var grdDate = twoDigitMonthIn + "-" + indate.getDate() + "-" + indate.getFullYear();


        var mydate = (new Date(indate.getFullYear(), indate.getMonth(), indate.getDate()));
        // alert(mydate.getTime());
        // var mydate = new Date(indate.getFullYear(), twoDigitMonthIn, indate.getDate());

        return Math.floor(((q.getTime() - mydate.getTime()) / (oneDay)));
    }

    // function AddSevenDays(){
    //     var curDate = new Date();      
    //     curDate.setDate(curDate.getDate() + 7);   
    //     var twoDigitMonthIn = ((curDate.getMonth().length + 1) === 1) ? (curDate.getMonth() + 1) : '0' + (curDate.getMonth() + 1);
    //     var grdDate =  twoDigitMonthIn + "-" + curDate.getDate()  + "-" + curDate.getFullYear();
    //     if (grdDate == default_Date || grdDate == null_Date)
    //     {
    //         return '';
    //     }
    //     alert(grdDate);     
    //     return grdDate;
    // }

    function ConvertToGridDate(inDate) {
        try {
            var default_Date = '01/1/1900';
            var null_Date = '01/1/1970';
            if (inDate != null)
                inDate = inDate.substring(0, 10);
            else
                return '';
            console.log('Date received from table: ' + inDate);
            var indate = new Date(inDate);
            console.log('New Date: ' + inDate);
            var twoDigitMonthIn = ((indate.getMonth().length + 1) === 1) ? (indate.getMonth() + 1) : '0' + (indate.getMonth() + 1);
            var grdDate = twoDigitMonthIn + "/" + indate.getDate() + "/" + indate.getFullYear();
            if (grdDate == default_Date || grdDate == null_Date) {
                return '';
            }
            console.log('Converted Date: ' + grdDate);
            return grdDate;
        }
        catch (err) {
            return '';
        }
    }

    function CheckWithinSLA(inDate) {
        var default_Date = '01/1/1900';
        var null_Date = '01/1/1970';
        var indate = new Date(inDate);
        var twoDigitMonthIn = ((indate.getMonth().length + 1) === 1) ? (indate.getMonth() + 1) : '0' + (indate.getMonth() + 1);
        var grdDate = twoDigitMonthIn + "/" + indate.getDate() + "/" + indate.getFullYear();
        if (grdDate == default_Date || grdDate == null_Date) {
            return '';
        }

        var mydate = new Date(indate.getFullYear(), twoDigitMonthIn, indate.getDate());

        var q = new Date();
        var m = q.getMonth() + 1;
        var d = q.getDay();
        var y = q.getFullYear();


        var todaysdate = new Date(y, m, d);
        //alert(mydate + '   ' + todaysdate)
        if (mydate > q) {

            return 'Y'
        }
        else {

            return 'N'
        }
    }

    //$scope.autoSizeAll = function () {
    //    if ($scope.ColumnFit) {
    //        $scope.ColumnFit = false;
    //        var allColumnIds = [];
    //        columnDefs.forEach(function (columnDef) {
    //            if (columnDef.field.indexOf('_users') == -1) {
    //                allColumnIds.push(columnDef.field);
    //            }
    //        });
    //        $scope.gridHistoryOptions.columnApi.autoSizeColumns(allColumnIds);
    //    }
    //    else
    //    {
    //        $scope.ColumnFit = true;
    //        $scope.gridHistoryOptions.api.sizeColumnsToFit();
    //    }
    //}




    $scope.gridHistoryOptions = {
        columnDefs: columnDefs,
        rowData: $scope.OpportunityHistorydataList,
        enableFilter: true,
        rowHeight: 35,
        pinnedColumnCount: 1,
        enableColResize: true,
        headerHeight: 30,
        suppressCellSelection: true,
        //suppressHorizontalScroll: true,
        onGridReady: function (event) {
            //$scope.gridHistoryOptions.api.sizeColumnsToFit();
            $scope.GetOpportunityHistoryList($routeParams.OppId);

        }
    };
    //End angular grid


    $scope.GetOpportunityDataCenterLocated = function () {
        Opportunityservice.GetOpportunityDataCenterLocated().success(function (data) {
            $scope.DataCenterLocated = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOppCategory = function () {
        Opportunityservice.GetOppCategory().success(function (data) {
            $scope.OppCategory = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityType = function () {
        Opportunityservice.GetOpportunityType().success(function (data) {
            $scope.CSCOpptype = data;
            // console.log(data)
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.getAllCSCStatus = function () {
        Opportunityservice.GetAllCSCStatus().success(function (data) {
            $scope.CSCStatus = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.getAllSalestatus = function () {
        Opportunityservice.getAllSalestatus().success(function (data) {
            $scope.SalesStatus = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.getAllOEMList = function () {
        Opportunityservice.GetAllOEM().success(function (data) {
            $scope.OEMList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AllCountryList = function () {
        Opportunityservice.GetAllCountry().success(function (data) {

            $scope.Country = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    //ParentOpportunity

    $scope.getDefaultConfiguration = function () {
        Opportunityservice.GetDefaultConfiguration().success(function (data) {
            var data1 = data[0];
            $scope.DefaultConfig = data1;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetServionLegalEntity = function () {
        Opportunityservice.GetServionLegalEntity().success(function (data) {
            $scope.ServionLegalEntity = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetAllEstimationProduct = function () {
        Opportunityservice.GetAllEstimationProduct().success(function (data) {
            $scope.EstimationProduct = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityCustomerType = function () {
        Opportunityservice.GetOpportunityCustomerType().success(function (data) {
            $scope.OpportunityCustomerTypeList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.getOppConfigDetail = function (id) {
        Opportunityservice.GetOppConfiguration(id).success(function (data) {
            if (data.length > 0) {
                var data2 = data[0];
                $scope.OppConfigDetail = data2;
            }
            else {
                Opportunityservice.GetDefaultConfiguration().success(function (data) {
                    var data1 = data[0];
                    $scope.OppConfigDetail = data1;
                }).error(function (error) {
                    $scope.Error = error;
                })

            }
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.ValidatePartnerName = function () {
        if ($scope.OpportunityDetail.OppCategoryId == 2) {
            $scope.OpportunityDetail.PartnerName = '';
        }

        if ($scope.OpportunityDetail.OppCategoryId == 1 && ($scope.OpportunityDetail.PartnerName == null || $scope.OpportunityDetail.PartnerName.trim() == '')) {
            return true
        }
        return false;
    }

    $scope.GetOpportunityForUser = function () {
        OppFactory.GetOpportunityForUser({ 'userID': $rootScope.UserInfo.user.userId }).success(function (data) {
            angular.forEach(data, function (value, key) {
                if (value.ParentOppId == null || value.ParentOppId == '') {
                    value.IsChild = 'No';
                }
                else {
                    value.IsChild = 'Yes (' + value.ParentOppId + ')';
                }
                if (value.CSCStatus == null) {
                    value.CSCStatus = 'Not Assigned';
                }
            });
            $scope.Opps = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOppFromID = function (oppId) {
        $scope.Opp = [];
        //console.log('Opps content: \n' + JSON.stringify($scope.Opps));
        angular.forEach($scope.Opps, function (value1, key) {
            if (value1.id == oppId) {
                if (value1.ParentOppId != null && value1.ParentOppId != '') {
                    oppId = value1.ParentOppId;
                    angular.forEach($scope.Opps, function (value2, key) {
                        if (value2.OppId == oppId) {
                            console.log('Returning parent opp..' + JSON.stringify(value2));
                            $scope.Opp = value2;
                            $scope.Opp.id = value2.id;
                            return;
                        }
                    })
                }
                else {
                    console.log('Returning opp..' + JSON.stringify(value1));
                    $scope.Opp = value1;
                    return;
                }
            }
        });
    };

    $scope.GetPriceVersions = function (oppId) {
        $scope.PriceVersions = [];
        $scope.isPriceSheetExist = false;
        $scope.Opp.LatestPriceVersion = 0;
        angular.forEach($scope.OppVersions, function (value, key) {
            if (value.id == oppId && value.PriceSheetId != null) {
                if (value.CreatedOn != null) {
                    value.CreatedOn = formatDate(value.CreatedOn);
                }
                $scope.PriceVersions.push(value);
                if ($scope.Opp.LatestPriceVersion < value.PriceSheetId) {
                    $scope.Opp.LatestPriceVersion = value.PriceSheetId;
                    $scope.isPriceSheetExist = true;
                }
            }
        });
    };

    $scope.GetAllOpportunityVersion = function () {
        OppFactory.GetAllOpportunityVersion().success(function (data) {
            $scope.OppVersions = data;
            //   alert(JSON.stringify(data));
        }).error(function (error) {
            //  alert('Error: ' + error);
            $scope.Error = error;
        })
    };

    $scope.View360 = function (id) {
        //$window.location.href = "home/" + id;
        console.log('calling 360 from Opportunity Control for id ' + id);
        $scope.GetOppFromID(id);
        console.log('Received opp  ' + $scope.Opp.id);

        //$scope.GetPriceVersions($scope.Opp.OppId);
        $scope.GetPriceVersions($scope.Opp.id);
        $scope.Opp.CSCStatus = ($scope.Opp.CSCStatus == null || $scope.Opp.CSCStatus == undefined) ? 'Not Assigned' : $scope.Opp.CSCStatus;
        console.log('showing 360 for opp: ' + $scope.Opp.id);
        $('#View360').modal('show');
    };

    $scope.updateConfiguration = function () {
        Opportunityservice.GetOpportunityConfigBySBU($scope.OpportunityDetail.SBU, $scope.OpportunityDetail.CountryId).success(function (OpportunityConfigDefaultdata) {
            $scope.OpportunityConfigDefault = OpportunityConfigDefaultdata[0];
        }).error(function (error) {
            $scope.Error = error;
        });
    }

    $scope.GetOpportunityList = function (id) {
        if (isNaN(id)) {
            //alert('Not a valid opportunity id');
            toaster.pop('warning', "Warning", "Not a valid opportunity id", null);
            var url = "http://" + $window.location.host + HostPath + "/index.html";
            $window.location.href = url;
        }

        Opportunityservice.GetopportunitybyID(id).success(function (data) {
            if (data.length == 0) {
                //alert('Not a valid opportunity id');
                toaster.pop('warning', "Warning", "Not a valid opportunity id", null);
                var url = "http://" + $window.location.host + HostPath + "/index.html";
                $window.location.href = url;
            }
            var SBUID = data[0].SBUId;

            // $scope.Country = [];
            Opportunityservice.GetAllCountry().success(function (countrydata) {
                angular.forEach(countrydata, function (value, key) {
                    if (value.SBUId == SBUID) {
                        $scope.Country.push(value);
                    }
                });
            }).error(function (error) {
                $scope.Error = error;
            });


            $scope.OpportunityDetail = data[0];
            $scope.CurrentOppSBU = data[0].SBUId;
            $scope.OpportunityDetail.CSCOwnerID = '';
            $scope.master = angular.copy(data[0]);
            $scope.orginalCSCStatusId = $scope.OpportunityDetail.CSCStatusId;

            if ($scope.OpportunityDetail.SLAClosureDate == null) {
                $scope.OpportunityDetail.SLAClosureDate = new Date();
            }

            if ($scope.OpportunityDetail.ExpectedClosureDate == null) {
                $scope.OpportunityDetail.ExpectedClosureDate = new Date();
            }

            $scope.OpportunityDetail.ExpectedClosureDate = ConvertToGridDate($scope.OpportunityDetail.ExpectedClosureDate);
            $scope.OpportunityDetail.SLAClosureDate = ConvertToGridDate($scope.OpportunityDetail.SLAClosureDate);

            if ($scope.OpportunityDetail.CSCStatusId == null) {
                $scope.OpportunityDetail.CSCStatusId = 4;
            }
            if ($scope.OpportunityDetail.OppCategoryId == null) {
                $scope.OpportunityDetail.OppCategoryId = 2;
            }

            if ($scope.OpportunityDetail.UseManDayshours == null) {
                $scope.OpportunityDetail.UseManDayshours = 'Days';
            }

            if ($scope.OpportunityDetail.NoOfDataCenterLocs == null) {
                $scope.OpportunityDetail.NoOfDataCenterLocs = '1';
            }

            if ($scope.OpportunityDetail.NoOfAgentCenterLocs == null) {
                $scope.OpportunityDetail.NoOfAgentCenterLocs = '1';
            }
            if ($scope.OpportunityDetail.UseOEMPricingStrategy == null) {
                $scope.OpportunityDetail.UseOEMPricingStrategy = 5;
            }

            if ($scope.OpportunityDetail.IsDataCenterandAgentsColocated == null || $scope.OpportunityDetail.IsDataCenterandAgentsColocated == '') {
                $scope.OpportunityDetail.IsDataCenterandAgentsColocated = 1;
            }

            Opportunityservice.getOpportunityServionLegalEntity(id).success(function (ServionLegalEntitydata) {
                var scrvionLE = [];
                angular.forEach(ServionLegalEntitydata, function (value, key) {
                    scrvionLE.push(value.ServionLegalEntityID);
                });
                $scope.OpportunityDetail.OpportunityServionLegalEntity = scrvionLE;
            })

            Opportunityservice.getOpportunityEstimationProduct(id).success(function (ServionEstimationProductdata) {
                var scrvionEP = [];
                angular.forEach(ServionEstimationProductdata, function (value, key) {
                    scrvionEP.push(value.ServionLegalEntityID);
                    $scope.master_AvailableUser_Estimation.push({ 'productname': value.ProductName });
                    $scope.AvailableUser_Estimation.push({ 'productname': value.ProductName });
                });
                $scope.OpportunityDetail.OpportunityEstimationProduct = scrvionEP;
            })

            Opportunityservice.GetOpportunityConfigBySBU(data[0].SBUId, data[0].CountryId).success(function (OpportunityConfigDefaultdata) {
                $scope.OpportunityConfigDefault = OpportunityConfigDefaultdata[0];
            }).error(function (error) {
                $scope.Error = error;
            });

            //ChildOpportunityList
            Opportunityservice.ParentOpportunity(data[0].SBUId).success(function (ParentOpportunitydata) {
                $scope.ParentOpportunityList = ParentOpportunitydata;
            }).error(function (error) {
                $scope.Error = error;
            });

            Opportunityservice.ChildOpportunity(id).success(function (ParentOpportunitydata) {
                $scope.ChildOpportunityList = ParentOpportunitydata;
            }).error(function (error) {
                $scope.Error = error;
            });

            Opportunityservice.GetOpportunityHistory(id).success(function (OpportunityHistorydata) {
                $scope.OpportunityHistorydataList = OpportunityHistorydata;
                $scope.gridHistoryOptions.api.setRowData(OpportunityHistorydata);
            }).error(function (error) {
                //alert(error);
                $scope.Error = error;
            });
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityHistoryList = function (id) {
        Opportunityservice.GetOpportunityHistory(id).success(function (OpportunityHistorydata) {
            $scope.OpportunityHistorydataList = OpportunityHistorydata;
            $scope.OpportunityHistorydataList = [];
            //ConvertToGridDate(params.value)
            angular.forEach(OpportunityHistorydata, function (value, key) {
                value.OpenDate = ConvertToGridDate(value.OpenDate);
                value.WithinSLA = CheckWithinSLA(value.SLAClosureDate);
                value.SLAClosureDate = ConvertToGridDate(value.SLAClosureDate);
                value.ExpectedClosureDate1 = (value.ExpectedClosureDate);
                value.ExpectedClosureDate = ConvertToGridDate(value.ExpectedClosureDate1);
                value.DelayedDaycount = GetDelayedDaycount(value.ExpectedClosureDate1);

                value.ActualCloseDate = ConvertToGridDate(value.ActualCloseDate);
                $scope.OpportunityHistorydataList.push(value);
            });

            $scope.gridHistoryOptions.api.setRowData(OpportunityHistorydata);
            var isOpen = false;

            Opportunityservice.GetAllCSCStatus().success(function (data) {
                $scope.CSCStatus = data;
                angular.forEach(OpportunityHistorydata, function (value, key) {
                    if (value.StatusName == "Open") {
                        isOpen = true;
                    }
                });
                if (isOpen) {
                    $scope.CSCStatus.splice(3, 1);

                }
            }).error(function (error) {
                $scope.Error = error;
            });

        }).error(function (error) {
            //alert(error);
            $scope.Error = error;

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityConfiguration = function (id) {
        Opportunityservice.GetOpportunityConfigurationByID(id).success(function (data) {
            if (data.length > 0) {
                $scope.OpportunityConfigurationDetail = data[0];
                console.log($scope.OpportunityConfigurationDetail);
            }
            else {
                $scope.OpportunityConfigurationDetail = {};
            }
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetAllCSCPersons = function () {
        Opportunityservice.GetAllCSCPersons().success(function (data) {
            $scope.CSCUsers = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetAllRSCPersons = function () {
        Opportunityservice.GetAllRSCPersons().success(function (data) {
            $scope.RSCUsers = [];
            angular.forEach(data, function (value, key) {

                if (value.SBUID == $scope.CurrentOppSBU) {
                    $scope.RSCUsers.push({ "Userid": value.Userid, "UserName": value.UserName });
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOtherUsers = function () {
        console.log('Current opportunity\'s SBU: ' + $scope.CurrentOppSBU);
        Opportunityservice.GetOtherUsers($scope.CurrentOppSBU).success(function (data) {
            $scope.OtherUsers = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.RedirectNext = function (i) {

        if ($scope.currentTab.indexOf("OpportunityDetailTab") > -1) {
            $scope.Tab1Isvalid = true;
        }
        else if ($scope.currentTab.indexOf("AccessDetails") > -1) {
            $scope.Tab2Isvalid = ($scope.listB_RSC.length > 0 && $scope.listB_Others.length > 0);
        }
        else if ($scope.currentTab.indexOf("CSCDetails") > -1) {
            $scope.Tab3Isvalid = $scope.opportunityform3.$valid;
        }
        $scope.currentTab = $scope.tabs[i].url;
        // $scope.CanSave = $scope.Tab1Isvalid && $scope.Tab2Isvalid && $scope.Tab3Isvalid;
        //alert($scope.Tab1Isvalid + '  ' + $scope.Tab1Isvalid + '  ' + $scope.Tab3Isvalid);

    }

    $scope.RedirectToOpp = function (oppId) {
        $('#View360').modal('hide');
        $location.path("OpportunityDetail/" + oppId);
    };
    $scope.RedirectToPrice = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("DaySheet/" + oppId + "/" + groupId);
    };
    $scope.RedirectToPayment = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("PaymentList/" + oppId + "/" + groupId);
    };
    $scope.RedirectToResource = function (oppId) {
        $('#View360').modal('hide');
        $location.path("Resource/" + oppId);
    };
    // $scope.AllCountryList();
    $scope.GetOpportunityForUser();
    $scope.GetAllOpportunityVersion();
    $scope.ShowPricing();
    $scope.getDefaultConfiguration();
    $scope.GetServionLegalEntity();
    $scope.GetAllEstimationProduct();
    $scope.GetOpportunityCustomerType();
    //$scope.getOppConfigDetail();
    $scope.GetOpportunityList($routeParams.OppId);
    $scope.GetOpportunityConfiguration($routeParams.OppId);
    $scope.getAllOEMList();
    $scope.getAllCSCStatus();
    $scope.getAllSalestatus();
    $scope.GetOpportunityType();
    $scope.GetOpportunityDataCenterLocated();
    $scope.GetOppCategory();
    $scope.GetAllCSCPersons();
    $scope.GetAllRSCPersons();
    $scope.GetOtherUsers();
    //$scope.GetParentOpportunity($scope.OpportunityConfigurationDetail.SBUId);

    $scope.oneAtATime = true;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.status_3 = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    function createStringFromArray(array) {
        var output = '';
        angular.forEach(array, function (value, key) {
            value.Userid = (value.Userid || value.UserID);
            output += value.Userid + ',';
        });
        if (output.length > 1) {
            output = output.substring(0, output.length - 1);
        }
        return output;
    }

    function ValidateInput(inp, ctlname) {
        if (inp === undefined) {
            return ctlname + ' Cannot be blank';
        }
        if (inp == null || inp.toString().trim() === '') {
            return ctlname + ' Cannot be blank';
        }
        if (isNaN(inp)) {
            return ctlname + ' must be a number';
        }
        return '';
    }

    $scope.SaveOpportunityDetail = function (Opportunity, OpportunityConfig) {
        if ($scope.OpportunityDetail.OppCategoryId == 1 && $scope.OpportunityDetail.PartnerName.trim() == "") {
            //alert('Please enter PartnerName in tab Opportunity/Site/Configuration Details ');
            toaster.pop('warning', "Warning", "Please enter PartnerName in tab Opportunity/Site/Configuration Details", null);
            return;
        }
        Opportunityservice.UpdateOppDetail(oppDetail).success(function (data) {
            //alert('Data updated successfully');
            toaster.pop('success', "Success", "Data updated successfully", null);
            var url = "http://" + $window.location.host + HostPath + "/index.html";
            this.location.href = url;
        }).error(function (error) {
            toaster.pop('error', "Error", "Unable to save", null);
            // alert('Unable to save ');
            $scope.Error = error;
        })
    };
    var ValidateClosureDate = function (closureDate) {
        var findDate = new Date(closureDate);
        var twoDigitMonthFind = ((findDate.getMonth().length + 1) === 1) ? (findDate.getMonth() + 1) : '0' + (findDate.getMonth() + 1);
        var FindDate = findDate.getFullYear() + "-" + twoDigitMonthFind + "-" + findDate.getDate();
        var find = new Date(FindDate);

        var currDate = new Date();
        var twoDigitMonthCur = ((currDate.getMonth().length + 1) === 1) ? (currDate.getMonth() + 1) : '0' + (currDate.getMonth() + 1);
        var currentDate = currDate.getFullYear() + "-" + twoDigitMonthCur + "-" + currDate.getDate();
        var current = new Date(currentDate);
        if (find < current) {
            $scope.showErr = true;
            return false;
        }
        else {
            $scope.showErr = false;
            return true;
        }
    };
    $scope.SaveData = function (OpportunityDtl, OpportunityConfig, ControlToSave) {
        //alert('Opp config: ' + JSON.stringify(OpportunityConfig));
        var Opportunity = JSON.parse(JSON.stringify(OpportunityDtl));
        $scope.showErr = false;
        Opportunity.SLAClosureDate = $("#SLAClosureDate").val();
        Opportunity.OpportunityEstimationProduct = [];
        Opportunity.ExpectedClosureDate = $("#ExpectedClosureDate").val();

        $scope.listB_CSCOwner = [];
        angular.forEach($scope.listB_Estimation, function (value, key) {
            Opportunity.OpportunityEstimationProduct.push({ "ProductName": value.productname });
        });

        var userList;
        //var userList = $scope.listB_RSC.concat($scope.listB_Others).concat($scope.listB_CSCOwner).concat($scope.listB_TM);
        if (ControlToSave == 'Configuration') {
            if ($scope.master_CSCOwnerID != null && $scope.master_CSCOwnerID != 'undefined') {
                $scope.listB_CSCOwner.push({ 'UserID': $scope.master_CSCOwnerID, 'userType': 'CSC_Owner' });
            }
            userList = $scope.master_AvailableUser_RSC.concat($scope.master_AvailableUser_Others).concat($scope.listB_CSCOwner).concat($scope.master_AvailableUser_TM);
            Opportunity.RSCUsers = createStringFromArray($scope.master_AvailableUser_RSC); //2
            Opportunity.OthersUsers = createStringFromArray($scope.master_AvailableUser_Others); //2
            Opportunity.CSCOwnerUsers = createStringFromArray($scope.listB_CSCOwner); //3
            Opportunity.TMUsers = createStringFromArray($scope.master_AvailableUser_TM); //3
        }
        else if (ControlToSave == 'Access') {
            if ($scope.master_CSCOwnerID != null && $scope.master_CSCOwnerID != 'undefined') {
                $scope.listB_CSCOwner.push({ 'UserID': $scope.master_CSCOwnerID, 'userType': 'CSC_Owner' });
            }

            userList = $scope.listB_RSC.concat($scope.listB_Others).concat($scope.listB_CSCOwner).concat($scope.master_AvailableUser_TM);
            Opportunity.RSCUsers = createStringFromArray($scope.listB_RSC); //2
            Opportunity.OthersUsers = createStringFromArray($scope.listB_Others); //2
            Opportunity.CSCOwnerUsers = createStringFromArray($scope.listB_CSCOwner); //3
            Opportunity.TMUsers = createStringFromArray($scope.master_AvailableUser_TM); //3
            console.log('Opportunity RSC: ' + Opportunity.RSCUsers + '\nOpportunity Others: ' + Opportunity.OthersUsers);
        }
        else { //ControlToSave == 'CSC'
            if (Opportunity.CSCOwnerID != null && Opportunity.CSCOwnerID != 'undefined') {
                $scope.listB_CSCOwner.push({ 'UserID': Opportunity.CSCOwnerID, 'userType': 'CSC_Owner' });
            }
            userList = $scope.master_AvailableUser_RSC.concat($scope.master_AvailableUser_Others).concat($scope.listB_CSCOwner).concat($scope.listB_TM);
            Opportunity.RSCUsers = createStringFromArray($scope.master_AvailableUser_RSC); //2
            Opportunity.OthersUsers = createStringFromArray($scope.master_AvailableUser_Others); //2
            Opportunity.CSCOwnerUsers = createStringFromArray($scope.listB_CSCOwner); //3
            Opportunity.TMUsers = createStringFromArray($scope.listB_TM); //3
            if (ValidateClosureDate(Opportunity.ExpectedClosureDate) == false) {
                //toaster.pop('warning', "Warning", "Expected Closure Date cannot be lesser than current date!", null);
                return;
            }
        }

        Opportunity.HistorySaveRequired = !(($scope.orginalCSCStatusId == Opportunity.CSCStatusId) && ($scope.master.ActualCloseDate == Opportunity.ActualCloseDate) && (ConvertToGridDate($scope.master.ExpectedClosureDate) == Opportunity.ExpectedClosureDate) && (ConvertToGridDate($scope.master.SLAClosureDate) == Opportunity.SLAClosureDate));

        //Userid

        Opportunity.CloseUser = '';
        Opportunity.OpenUser = '';

        if (Opportunity.CSCStatusId == 1) {
            Opportunity.OpenDate = new Date();
            Opportunity.ActualCloseDate = null;
            Opportunity.OpenUser = $rootScope.UserInfo.user.userId;
        }
        if (Opportunity.CSCStatusId == 4) {
            Opportunity.OpenDate = null;
            Opportunity.ActualCloseDate = null;
        }
        if (Opportunity.CSCStatusId == 2) {
            Opportunity.ActualCloseDate = new Date();
            Opportunity.CloseUser = $rootScope.UserInfo.user.userId;
        }
        if (Opportunity.CSCStatusId == 3) {
            Opportunity.Cycle = Opportunity.Cycle;
            Opportunity.CloseUser = $rootScope.UserInfo.user.userId;
        }
        else if (Opportunity.HistorySaveRequired) {
            if (Opportunity.Cycle == null || Opportunity.Cycle == "") {
                Opportunity.Cycle = 1;
            }
            else {
                Opportunity.Cycle = Opportunity.Cycle + 1;
            }
        }

        //Save Check

        angular.forEach(OpportunityConfig, function (value, key) {
            if (ValidateInput(value, key) != '') {
                $scope.ErrorList.push(ValidateInput(value, key));
            }
        })

        var oppDetail = {
            OpportunityInfo: Opportunity,
            OpportunityConfig: OpportunityConfig,
            userList: userList,
            OrginalOpp: $scope.master,
            CtrlToSave: ControlToSave
        }

        if ($scope.listB_CSCOwner.length > 1) {
            toaster.pop('warning', "Warning", "Please select only one CSC owner in tab CSC Details/Opportunity History", null);
            //alert('Please select only one CSC owner in tab CSC Details/Opportunity History');
            return;
        }
        oppDetail.OpportunityInfo.ExpectedClosureDate = new Date(oppDetail.OpportunityInfo.ExpectedClosureDate);
        oppDetail.OpportunityInfo.SLAClosureDate = new Date(oppDetail.OpportunityInfo.SLAClosureDate);

        var twoDigitMonth = ((oppDetail.OpportunityInfo.ExpectedClosureDate.getMonth().length + 1) === 1) ? (oppDetail.OpportunityInfo.ExpectedClosureDate.getMonth() + 1) : '0' + (oppDetail.OpportunityInfo.ExpectedClosureDate.getMonth() + 1);
        var date = oppDetail.OpportunityInfo.ExpectedClosureDate.getFullYear() + "-" + twoDigitMonth + "-" + oppDetail.OpportunityInfo.ExpectedClosureDate.getDate();
        var expectedClosureDate = new Date(date);
        oppDetail.OpportunityInfo.ExpectedClosureDate = expectedClosureDate;
        console.log('Expected Closure Date: ' + oppDetail.OpportunityInfo.ExpectedClosureDate);

        var twoDigitMonth2 = ((oppDetail.OpportunityInfo.SLAClosureDate.getMonth().length + 1) === 1) ? (oppDetail.OpportunityInfo.SLAClosureDate.getMonth() + 1) : '0' + (oppDetail.OpportunityInfo.SLAClosureDate.getMonth() + 1);
        var date2 = oppDetail.OpportunityInfo.SLAClosureDate.getFullYear() + "-" + twoDigitMonth2 + "-" + oppDetail.OpportunityInfo.SLAClosureDate.getDate();
        var slaClosureDate = new Date(date2);
        oppDetail.OpportunityInfo.SLAClosureDate = slaClosureDate;
        console.log('SLAClosureDate: ' + oppDetail.OpportunityInfo.SLAClosureDate);

        Opportunityservice.UpdateOppDetail(oppDetail).success(function (data) {
            toaster.pop('success', "Success", "Data updated successfully", null);
            if (ControlToSave == 'CSC') {
                $window.location.href = "OpportunityDetail/" + oppDetail.OpportunityInfo.id;
                console.log('redirected!');
            }
        }).error(function (error) {
            toaster.pop('error', "Error", "Unable to Save", null);
            //alert('Unable to save ');
            $scope.Error = error;
        })
    };


    //---Dual list control RSC---//

    // init RSC
    $scope.selectedA_RSC = [];
    $scope.selectedB_RSC = [];

    $scope.listA_RSC = [];
    $scope.listB_RSC = [];

    $scope.checkedA_RSC = false;
    $scope.checkedB_RSC = false;

    $scope.AvailableUser_RSC = [];

    $scope.GetRSCList = function () {
        Opportunityservice.GetAllRSCPersons().success(function (data) {
            $scope.RSCUsers = [];
            angular.forEach(data, function (value, key) {

                if (value.SBUID == $scope.CurrentOppSBU) {
                    $scope.RSCUsers.push({ "Userid": value.Userid, "UserName": value.UserName });
                }
            });
            $scope.listA_RSC = [];
            $scope.listB_RSC = [];
            var temp = JSON.parse(JSON.stringify($scope.RSCUsers));
            for (i = 0; i < $scope.AvailableUser_RSC.length; i++) {
                $scope.listB_RSC.push({ 'Userid': $scope.AvailableUser_RSC[i].UserID, 'userType': 'RSC' });
                var delId = arrayObjectIndexOf(temp, $scope.AvailableUser_RSC[i].UserID);
                temp.splice(delId, 1);
            }
            $scope.listA_RSC = temp;

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    function arrayObjectIndexOf(myArray, searchTerm) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i].Userid == searchTerm) {
                return i;
            }
        }
        return -1;
    }

    function arrayObjectEstimationProductIndexOf(myArray, searchTerm) {
        //debugger;
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i].productname == searchTerm) {
                return i;
            }
        }
        return -1;
    }

    $scope.AlltoA_RSC = function () {
        $scope.selectedB_RSC = [];
        angular.forEach($scope.listB_RSC, function (value, key) {
            $scope.selectedB_RSC.push(value.Userid);
        })
        $scope.bToA_RSC();
    }
    $scope.AlltoB_RSC = function () {
        $scope.selectedA_RSC = [];
        angular.forEach($scope.listA_RSC, function (value, key) {
            $scope.selectedA_RSC.push(value.Userid);
        })
        $scope.aToB_RSC();
    }

    $scope.aToB_RSC = function () {
        var items = JSON.parse(JSON.stringify($scope.RSCUsers));
        console.log('a to b');
        for (var i = 0; i < $scope.selectedA_RSC.length; i++) {
            var moveId = arrayObjectIndexOf($scope.RSCUsers, $scope.selectedA_RSC[i]);

            $scope.listB_RSC.push({ 'Userid': $scope.RSCUsers[moveId].Userid, 'userType': 'RSC' });
            var delId = arrayObjectIndexOf($scope.listA_RSC, $scope.selectedA_RSC[i]);
            $scope.listA_RSC.splice(delId, 1);
            console.log('list A count after: ' + $scope.listA_RSC.length);
            console.log('list B count after: ' + $scope.listB_RSC.length);
        }
        $scope.selectedA_RSC = [];
    };

    $scope.bToA_RSC = function () {
        console.log('b to a');
        for (var i = 0; i < $scope.selectedB_RSC.length; i++) {
            var moveId = arrayObjectIndexOf($scope.RSCUsers, $scope.selectedB_RSC[i]);
            if (moveId != -1) {
                $scope.listA_RSC.push($scope.RSCUsers[moveId]);
            }
            var delId = arrayObjectIndexOf($scope.listB_RSC, $scope.selectedB_RSC[i]);
            $scope.listB_RSC.splice(delId, 1);
            console.log('list B count after: ' + $scope.listB_RSC.length);
            console.log('list A count after: ' + $scope.listA_RSC.length);
        }
        $scope.selectedB_RSC = [];
    };

    $scope.stateBChanged_RSC = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedB_RSC.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedB_RSC, rightID);
            $scope.selectedB_RSC.splice(delId, 1);
        }
    }
    $scope.stateAChanged_RSC = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedA_RSC.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedA_RSC, rightID);
            $scope.selectedA_RSC.splice(delId, 1);
        }
    }

    //---Dual list control RSC---//

    // init Others
    $scope.IsUserSCHead();
    $scope.selectedA_Others = [];
    $scope.selectedB_Others = [];

    $scope.listA_Others = [];
    $scope.listB_Others = [];

    $scope.checkedA_Others = false;
    $scope.checkedB_Others = false;

    $scope.AvailableUser_Others = [];

    $scope.GetOthersList = function () {
        console.log('GetOthersList - SBU: ' + $scope.CurrentOppSBU);
        Opportunityservice.GetOtherUsers($scope.CurrentOppSBU).success(function (data) {
            $scope.OtherUsers = data;
            $scope.listA_Others = [];
            $scope.listB_Others = [];
            var temp = JSON.parse(JSON.stringify($scope.OtherUsers));
            for (i = 0; i < $scope.AvailableUser_Others.length; i++) {
                $scope.listB_Others.push({ 'Userid': $scope.AvailableUser_Others[i].UserID, 'userType': 'CSC_Others' });
                var delId = arrayObjectIndexOf(temp, $scope.AvailableUser_Others[i].UserID);
                temp.splice(delId, 1);
            }
            $scope.listA_Others = temp;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AlltoA_Others = function () {
        $scope.selectedB_Others = [];
        angular.forEach($scope.listB_Others, function (value, key) {
            $scope.selectedB_Others.push(value.Userid);
        })
        $scope.bToA_Others();
    }
    $scope.AlltoB_Others = function () {
        $scope.selectedA_Others = [];
        angular.forEach($scope.listA_Others, function (value, key) {
            $scope.selectedA_Others.push(value.Userid);
        })
        $scope.aToB_Others();
    }

    $scope.aToB_Others = function () {
        var items = JSON.parse(JSON.stringify($scope.OtherUsers));
        console.log('a to b');
        for (var i = 0; i < $scope.selectedA_Others.length; i++) {
            var moveId = arrayObjectIndexOf($scope.OtherUsers, $scope.selectedA_Others[i]);
            $scope.listB_Others.push({ 'Userid': $scope.OtherUsers[moveId].Userid, 'userType': 'CSC_Others' });
            var delId = arrayObjectIndexOf($scope.listA_Others, $scope.selectedA_Others[i]);
            $scope.listA_Others.splice(delId, 1);
            console.log('list A count after: ' + $scope.listA_Others.length);
            console.log('list B count after: ' + $scope.listB_Others.length);
        }
        $scope.selectedA_Others = [];
    };

    $scope.bToA_Others = function () {
        console.log('b to a');
        for (var i = 0; i < $scope.selectedB_Others.length; i++) {
            var moveId = arrayObjectIndexOf($scope.OtherUsers, $scope.selectedB_Others[i]);
            if (moveId != -1) {
                $scope.listA_Others.push($scope.OtherUsers[moveId]);
            }
            var delId = arrayObjectIndexOf($scope.listB_Others, $scope.selectedB_Others[i]);
            $scope.listB_Others.splice(delId, 1);
            console.log('list B count after: ' + $scope.listB_Others.length);
            console.log('list A count after: ' + $scope.listA_Others.length);
        }
        $scope.selectedB_Others = [];
    };

    $scope.stateBChanged_Others = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedB_Others.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedB_Others, rightID);
            $scope.selectedB_Others.splice(delId, 1);
        }
    }
    $scope.stateAChanged_Others = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedA_Others.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedA_Others, rightID);
            $scope.selectedA_Others.splice(delId, 1);
        }
    }

    //CSC Team Member

    $scope.selectedA_TM = [];
    $scope.selectedB_TM = [];

    $scope.listA_TM = [];
    $scope.listB_TM = [];

    $scope.checkedA_TM = false;
    $scope.checkedB_TM = false;

    $scope.AvailableUser_TM = [];

    $scope.GetTMList = function () {
        Opportunityservice.GetAllCSCPersons().success(function (data) {
            $scope.CSCUsers = data;
            $scope.listA_TM = [];
            $scope.listB_TM = [];
            var temp = JSON.parse(JSON.stringify($scope.CSCUsers));
            for (i = 0; i < $scope.AvailableUser_TM.length; i++) {
                $scope.listB_TM.push({ 'Userid': $scope.AvailableUser_TM[i].UserID, 'userType': 'CSC_TM' });
                var delId = arrayObjectIndexOf(temp, $scope.AvailableUser_TM[i].UserID);
                temp.splice(delId, 1);
            }
            $scope.listA_TM = temp;

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AlltoA_TM = function () {
        $scope.selectedB_TM = [];
        angular.forEach($scope.listB_TM, function (value, key) {
            $scope.selectedB_TM.push(value.Userid);
        })
        $scope.bToA_TM();
    }
    $scope.AlltoB_TM = function () {
        $scope.selectedA_TM = [];
        angular.forEach($scope.listA_TM, function (value, key) {
            $scope.selectedA_TM.push(value.Userid);
        })
        $scope.aToB_TM();
    }

    $scope.aToB_TM = function () {
        var items = JSON.parse(JSON.stringify($scope.CSCUsers));
        console.log('a to b');
        for (var i = 0; i < $scope.selectedA_TM.length; i++) {
            var moveId = arrayObjectIndexOf($scope.CSCUsers, $scope.selectedA_TM[i]);
            $scope.listB_TM.push({ 'Userid': $scope.CSCUsers[moveId].Userid, 'userType': 'CSC_TM' });
            var delId = arrayObjectIndexOf($scope.listA_TM, $scope.selectedA_TM[i]);
            $scope.listA_TM.splice(delId, 1);
            console.log('list A count after: ' + $scope.listA_TM.length);
            console.log('list B count after: ' + $scope.listB_TM.length);
        }
        $scope.selectedA_TM = [];
    };

    $scope.bToA_TM = function () {
        console.log('b to a');
        for (var i = 0; i < $scope.selectedB_TM.length; i++) {
            var moveId = arrayObjectIndexOf($scope.CSCUsers, $scope.selectedB_TM[i]);
            if (moveId != -1) {
                $scope.listA_TM.push($scope.CSCUsers[moveId]);
            }
            var delId = arrayObjectIndexOf($scope.listB_TM, $scope.selectedB_TM[i]);
            $scope.listB_TM.splice(delId, 1);
            console.log('list B count after: ' + $scope.listB_TM.length);
            console.log('list A count after: ' + $scope.listA_TM.length);
        }

        $scope.selectedB_TM = [];
    };

    $scope.stateBChanged_TM = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedB_TM.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedB_TM, rightID);
            $scope.selectedB_TM.splice(delId, 1);
        }
    }
    $scope.stateAChanged_TM = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedA_TM.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedA_TM, rightID);
            $scope.selectedA_TM.splice(delId, 1);
        }
    }


    function reset_TM() {

        $scope.toggle = 0;
    }

    //Estimation product

    $scope.selectedA_Estimation = [];
    $scope.selectedB_Estimation = [];

    $scope.listA_Estimation = [];
    $scope.listB_Estimation = [];

    $scope.checkedA_Estimation = false;
    $scope.checkedB_Estimation = false;

    $scope.AvailableUser_Estimation = [];

    $scope.Get_EstimationList = function () {
        Opportunityservice.GetAllEstimationProduct().success(function (data) {
            $scope.EstimationProduct = data;
            $scope.EstimationProduct.push({ productname: 'OTHERS' });
            $scope.listA_Estimation = [];
            $scope.listB_Estimation = [];
            var temp = JSON.parse(JSON.stringify($scope.EstimationProduct));

            for (i = 0; i < $scope.AvailableUser_Estimation.length; i++) {
                $scope.listB_Estimation.push({ 'productname': $scope.AvailableUser_Estimation[i].productname, 'PType': $scope.AvailableUser_Estimation[i].productname });
                var delId = arrayObjectEstimationProductIndexOf(temp, $scope.AvailableUser_Estimation[i].productname);
                temp.splice(delId, 1);
            }
            //alert('ss1s :' + JSON.stringify(temp));
            $scope.listA_Estimation = temp;

        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AlltoA_Estimation = function () {
        $scope.selectedB_Estimation = [];
        angular.forEach($scope.listB_Estimation, function (value, key) {
            $scope.selectedB_Estimation.push(value.productname);
        })
        $scope.bToA_Estimation();
    }
    $scope.AlltoB_Estimation = function () {
        $scope.selectedA_Estimation = [];
        angular.forEach($scope.listA_Estimation, function (value, key) {
            $scope.selectedA_Estimation.push(value.productname);
        })
        $scope.aToB_Estimation();
    }

    $scope.aToB_Estimation = function () {
        var items = JSON.parse(JSON.stringify($scope.EstimationProduct));
        console.log('a to b');
        for (var i = 0; i < $scope.selectedA_Estimation.length; i++) {
            var moveId = arrayObjectEstimationProductIndexOf($scope.EstimationProduct, $scope.selectedA_Estimation[i]);
            $scope.listB_Estimation.push({ 'productname': $scope.EstimationProduct[moveId].productname, 'PType': 'CSC_Estimation' });
            var delId = arrayObjectEstimationProductIndexOf($scope.listA_Estimation, $scope.selectedA_Estimation[i]);
            $scope.listA_Estimation.splice(delId, 1);
            console.log('list A count after: ' + $scope.listA_Estimation.length);
            console.log('list B count after: ' + $scope.listB_Estimation.length);
        }
        $scope.selectedA_Estimation = [];
    };

    $scope.bToA_Estimation = function () {
        console.log('b to a');
        for (var i = 0; i < $scope.selectedB_Estimation.length; i++) {
            var moveId = arrayObjectEstimationProductIndexOf($scope.EstimationProduct, $scope.selectedB_Estimation[i]);
            if (moveId != -1) {
                $scope.listA_Estimation.push($scope.EstimationProduct[moveId]);
            }
            var delId = arrayObjectEstimationProductIndexOf($scope.listB_Estimation, $scope.selectedB_Estimation[i]);
            $scope.listB_Estimation.splice(delId, 1);
            console.log('list B count after: ' + $scope.listB_Estimation.length);
            console.log('list A count after: ' + $scope.listA_Estimation.length);
        }

        $scope.selectedB_Estimation = [];
    };

    $scope.stateBChanged_Estimation = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedB_Estimation.push(rightID);
        }
        else {
            var delId = arrayObjectEstimationProductIndexOf($scope.selectedB_Estimation, rightID);
            $scope.selectedB_Estimation.splice(delId, 1);
        }
    }
    $scope.stateAChanged_Estimation = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedA_Estimation.push(rightID);
        }
        else {
            var delId = arrayObjectEstimationProductIndexOf($scope.selectedA_Estimation, rightID);
            $scope.selectedA_Estimation.splice(delId, 1);
        }
    }

    function reset_Estimation() {
        $scope.toggle = 0;
    }



    Opportunityservice.GetAllOpportunityUsers($routeParams.OppId).success(function (data) {
        $scope.master_AvailableUser_RSC = [];
        $scope.master_AvailableUser_Others = [];
        $scope.master_AvailableUser_TM = [];
        $scope.master_CSCOwnerID = '';

        $scope.OpportunityUsers = data;
        $scope.Tab2Isvalid = false;
        angular.forEach($scope.OpportunityUsers, function (value, key) {
            if (value.OpportunityTypeId == 'RSC') {
                $scope.AvailableUser_RSC.push(value);
                $scope.master_AvailableUser_RSC.push({ 'Userid': value.UserID, 'userType': 'RSC' });
            }
            else if (value.OpportunityTypeId == 'CSC_Others') {
                $scope.AvailableUser_Others.push(value);
                $scope.master_AvailableUser_Others.push({ 'Userid': value.UserID, 'userType': 'CSC_Others' });
            }
            else if (value.OpportunityTypeId == 'CSC_Owner') {
                $scope.OpportunityDetail.CSCOwnerID = value.UserID;
                $scope.master_CSCOwnerID = value.UserID;
            }
            else if (value.OpportunityTypeId == 'CSC_TM') {
                $scope.AvailableUser_TM.push(value);
                $scope.master_AvailableUser_TM.push({ 'Userid': value.UserID, 'userType': 'CSC_TM' });
            }
            $scope.Tab2Isvalid = ($scope.AvailableUser_RSC.length > 0 && $scope.AvailableUser_Others.length > 0);
        })


        $scope.ValidateTabRights();
        $scope.Tab3Isvalid = $scope.opportunityform.$valid;
        $scope.GetRSCList();
        $scope.GetOthersList();
        $scope.GetTMList();
        $scope.Get_EstimationList();

    }).error(function (error) {
        $scope.Error = error;
    })
    //alert($scope.AvailableUser_RSC.length);

    //--- End of Dual List---//
}]);


ReportApp.factory('Opportunityservice', function ($http) {
    var Homeurl = BaseURL;
    //
    var Opportunityservice = {
        GetOpportunityConfigBySBU: function (SBUID, CountryId) {
            var result = $http.get(Homeurl + 'country/GetOpportunityConfigBySBU?SBUID=' + SBUID + '&CountryId=' + CountryId);
            return result;
        },
        AddOppConfig: function (config) {
            var result = $http.post(Homeurl + 'country/AddOppConfigMaster', config);
            return result;
        },
        getOpportunityServionLegalEntity: function (oppid) {
            var result = $http.get(Homeurl + 'country/getOpportunityServionLegalEntity?oppId=' + oppid);
            return result;
        },
        getOpportunityEstimationProduct: function (oppid) {
            var result = $http.get(Homeurl + 'country/getOpportunityEstimationProduct?oppId=' + oppid);
            return result;
        },
        GetOpportunityConfigurationByID: function (oppid) {
            var result = $http.get(Homeurl + 'country/GetOpportunityConfigurationByID?oppId=' + oppid);
            return result;
        },
        GetAllOpportunityUsers: function (oppid) {
            var result = $http.get(Homeurl + 'country/GetAllOpportunityUsers?oppId=' + oppid);
            return result;
        },
        GetAllCSCPersons: function (oppid) {
            var result = $http.get(Homeurl + 'country/GetAllCSCPersons');
            return result;
        },
        GetAllRSCPersons: function (oppid) {
            var result = $http.get(Homeurl + 'country/GetAllRSCPersons');
            return result;
        },
        GetOtherUsers: function (sbuid) {
            var result = $http.get(Homeurl + 'country/GetOtherUsers?SbuId=' + sbuid);
            return result;
        },
        GetopportunitybyID: function (oppid) {
            var result = $http.get(Homeurl + 'country/GetOpportunityByID?oppId=' + oppid);
            return result;
        },
        GetOpportunityDataCenterLocated: function () {
            var result = $http.get(Homeurl + 'country/GetOpportunityDataCenterLocated');
            return result;
        },
        GetOppCategory: function () {
            var result = $http.get(Homeurl + 'country/GetOppCategory');
            return result;
        },
        GetOpportunityType: function () {
            var result = $http.get(Homeurl + 'country/GetOpportunityType');
            return result;
        },
        GetAllCSCStatus: function () {
            var result = $http.get(Homeurl + 'country/getCSCStatus');
            return result;
        },
        getAllSalestatus: function () {
            var result = $http.get(Homeurl + 'country/getAllSalestatus');
            return result;
        },
        getAllPreSalestatus: function () {
            var result = $http.get(Homeurl + 'country/getAllPreSalestatus');
            return result;
        },
        GetAllOEM: function () {
            var result = $http.get(Homeurl + 'OEM');
            return result;
        },
        GetAllCountry: function () {
            var result = $http.get(Homeurl + 'country/');
            return result;
        },
        GetCountryById: function (countryId) {
            var result = $http.get(Homeurl + 'country/GetCountryById/?Id=' + countryId);
            return result;
        },
        ChildOpportunity: function (OppID) {
            var result = $http.get(Homeurl + 'country/GetChildOpportunityID?OppID=' + OppID);
            return result;
        },
        ParentOpportunity: function (SBUID) {
            var result = $http.get(Homeurl + 'country/GetParentOpportunityID?SBUID=' + SBUID);
            return result;
        },
        GetOppConfiguration: function (oppid) {
            var result = $http.get(Homeurl + 'country/GetOppConfiguration?oppId=' + oppid);

            return result;
        },
        GetDefaultConfiguration: function () {
            var result = $http.get(Homeurl + 'country/getConfiguration');
            return result;
        },
        UpdateOppDetail: function (oppInfo) {
            var result = $http.post(Homeurl + 'country/SaveOpportunityDetail', oppInfo);
            return result;
        },
        GetOpportunityHistory: function (oppID) {
            var result = $http.get(Homeurl + 'country/GetOpportunityHistory?oppID=' + oppID);
            return result;
        },
        GetOpportunityCustomerType: function () {
            var result = $http.get(Homeurl + 'country/GetOpportunityCustomerType');
            return result;
        },
        GetServionLegalEntity: function () {
            var result = $http.get(Homeurl + 'country/GetServionLegalEntity');
            return result;
        },
        GetAllEstimationProduct: function () {
            var result = $http.get(Homeurl + 'country/GetAllEstimationProduct');
            return result;
        },
        GetExtendedEfforts: function (d) {
            var result = $http.get(Homeurl + 'country/GetExtendedEfforts');
            return result;
        },
        AddExtendedEfforts: function (currencysheet) {
            return $http.post(Homeurl + 'country/AddExtendedEfforts', currencysheet);
        }

    };
    return Opportunityservice;
});

