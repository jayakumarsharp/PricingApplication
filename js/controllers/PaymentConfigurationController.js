ReportApp.controller('PaymentConfigurationController', function ($scope, $rootScope, paymentConfigFactory, milestoneFactory, OppFactory, UserFactory, toaster, paymentService) {
    $scope.paymentConfig = {}
    $scope.PaymentConfig = [];
    $scope.paymentPeriod = [];
    $scope.paymentCode = [];
    $scope.SBU = [];
    $scope.Region = [];

    $scope.grideditable = true;
    $scope.call1finished = false;
    $scope.call2finished = false;

    //initialize Grid options

    $scope.callifapiFinished = function () {
        if ($scope.call1finished == true && $scope.call2finished == true) {
            $scope.Onload();
        }
    }

    $scope.GetPaymentPeriod = function () {

        paymentService.GetPaymentPeriod().success(function (data) {

            $scope.SelectOptions = data;
            $scope.call2finished = true;
            $scope.callifapiFinished();

        }).error(function (error) {
            $scope.Error = error;
        })
    };
    $scope.GetPaymentPeriod();

    $scope.PaymentConfigGrid = {
        angularCompileRows: true,
        columnDefs: [],
        rowHeight: 24,
        headerHeight: 36,
        enableColResize: true,
        suppressRowClickSelection: true,
        singleClickEdit: true,
        suppressHorizontalScroll: false,
        suppressCellSelection: true,
        rowData: [],
        onGridReady: function (event) {
            $scope.GetAllPaymentCode();
        },
        //  floatingBottomRowData: []
    };

    $scope.Onload = function () {
        var columnDefs = [
            {
                headerName: "Code", field: "Code", width: 300, hide: true
            },
            {
                headerName: "Invoicing Milestones", field: "MilestoneDescription", width: 300, headerTooltip: "Invoicing Milestones"
            },
            {
                headerName: "Payment Code", field: "PaymentCode", width: 300, headerTooltip: "Payment Code", hide: true
            },
            {
                headerName: "Payment Terms(Days)", field: "paymentTerms", width: 120, headerTooltip: "Payment Terms(Days)", editable: $scope.grideditable,
                newValueHandler: function (params) {
                    if (params.newValue == '') {
                        params.newValue = 0;
                    }
                    if (parseInt(params.newValue) > 99) {
                        toaster.pop('warning', "Warning", 'Payment Terms cannot be greater than 99', null);
                    }
                    else
                        params.data.paymentTerms = parseInt(params.newValue);
                }
            },
            {
                headerName: 'OEM',
                groupId: "GroupB",
                children: [
                    {
                        headerName: "HW & SW", field: "OEMHWandSW", width: 90, headerTooltip: "HW & SW", cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Services", field: "OEMServices", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "PS", field: "OEMPS", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Other", field: "OEMOther", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#6EB5C0' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                ]
            },
            {
                headerName: 'Servion',
                groupId: "GroupC",
                children: [
                    {
                        headerName: "Software", field: "SERVSW", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Services", field: "SERVServices", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "PS", field: "SERVPS", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Consulting", field: "SERVConsulting", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "ServCare", field: "SERVCare", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Other", field: "SERVOther", width: 90, cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2E8E4' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                ]
            },
            {
                headerName: 'Servion',
                groupId: "GroupD",
                children: [
                    {
                        headerName: "Resourcing", field: "SERVResource", width: 90, headerTooltip: "Resourcing", cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2C499' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "T&M", field: "SERVTM", width: 90, headerTooltip: "T&M", cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2C499' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    },
                    {
                        headerName: "Hosted", field: "SERVHosted", width: 90, headerTooltip: "Hosted", cellRenderer: getperiodEditor,
                        cellStyle: { 'background-color': '#E2C499' },
                        cellClassRules: {
                            'blockbackground': function (params) {
                                return params.value == '--';
                            },
                        },
                    }]
            }];


        $scope.PaymentConfigGrid.api.setColumnDefs(columnDefs);

    }


    function onFloatingBottomCount(footerRowsToFloat) {
        var count = Number(footerRowsToFloat);
        var rows = createData(count, 'Bottom');
        $scope.gridOptions.api.setFloatingBottomRowData(rows);
    }

    function createData(count, prefix) {
        var JsonModel = {
            BU: '', Region: '', PaymentCode: '', MilestoneDescription: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: '30 days', percentageTotal: '0', OEMHWandSW: '0', OEMServices: '0', OEMPS: '0', OEMOther: '0', SERVSW: '0', SERVServices: '0', SERVPS: '0', SERVConsulting: '0', SERVCare: '0', SERVOther: '0', SERVResource: '0', SERVTM: '0', SERVHosted: '0', PercentageType: ''
        };

        var cyear1 = 0, cyear2 = 0, cyear3 = 0, cyear4 = 0, cyear5 = 0, vyear1 = 0, vyear2 = 0, vyear3 = 0, vyear4 = 0, vyear5 = 0, lyear1 = 0, lyear2 = 0, lyear3 = 0, lyear4 = 0, lyear5 = 0, oyear1 = 0, oyear2 = 0, oyear3 = 0, oyear4 = 0, oyear5 = 0, forvendordiscount = 0, marginpercent = 0, customerdiscount = 0, Syear1 = 0, Syear2 = 0, Syear3 = 0, Syear4 = 0, Syear5 = 0, distmarginpercent = 0, distdiscount = 0, Dutytax1 = 0, Dutytax2 = 0, Dutytax3 = 0, DTyear1 = 0, DTyear2 = 0, DTyear3 = 0, DTyear4 = 0, DTyear5 = 0, DTTotal = 0, FCUyear1 = 0, FCUyear2 = 0, FCUyear3 = 0, FCUyear4 = 0, FCUyear5 = 0, FCUTotal = 0, Currency = 0, FCLyear1 = 0, FCLyear2 = 0, FCLyear3 = 0, FCLyear4 = 0, FCLyear5 = 0, FCLTotal = 0;

        for (var i = 0; i < $scope.data.length; i++) {
            cyear1 += parseInt($scope.data[i].Cyear1);
            cyear2 += parseInt($scope.data[i].Cyear2);
            cyear3 += parseInt($scope.data[i].Cyear3);
            cyear4 += parseInt($scope.data[i].Cyear4);
            cyear5 += parseInt($scope.data[i].Cyear5);
            lyear1 += parseInt($scope.data[i].Lyear1);

        }

        for (var i = 0; i < count; i++) {
            result.push({
                RowId: 'Total', OppId: '', ServionLegalEntity: '', oem: '', Component: '', LOBName: '', ProductName: '', componenttype: '', pricetype: '', Cyear1: cyear1, Cyear2: cyear2, Cyear3: cyear3, Cyear4: cyear4, Cyear5: cyear5, Vyear1: vyear1, Vyear2: vyear2, Vyear3: vyear3, Vyear4: vyear4, Vyear5: vyear5, Lyear1: lyear1, Lyear2: lyear2, Lyear3: lyear3, Lyear4: lyear4, Lyear5: lyear5, Oyear1: oyear1, Oyear2: oyear2, Oyear3: oyear3, Oyear4: oyear4, Oyear5: oyear5, forvendordiscount: '', marginpercent: '', customerdiscount: '',
                Syear1: Syear1, Syear2: Syear2, Syear3: Syear3, Syear4: Syear4, Syear5: Syear5, distmarginpercent: '', distdiscount: '', Dutytax1: '', Dutytax2: '', Dutytax3: '', DTyear1: DTyear1, DTyear2: DTyear2, DTyear3: DTyear3, DTyear4: DTyear4, DTyear5: DTyear5, DTTotal: DTTotal, FCUyear1: FCUyear1, FCUyear2: FCUyear2, FCUyear3: FCUyear3, FCUyear4: FCUyear4, FCUyear5: FCUyear5, FCUTotal: FCUTotal, Currency: '', ConversionRate: '', FCLyear1: FCLyear1, FCLyear2: FCLyear2, FCLyear3: FCLyear3, FCLyear4: FCLyear4, FCLyear5: FCLyear5, FCLTotal: FCLTotal
            });
        }

        $scope.Totalresult = result;

        return result;
    }



    $scope.GetAllMilestone = function () {
        milestoneFactory.GetAllMilestone().success(function (data) {

            $scope.Constructdata = [];

            $scope.Milestone = data;
            if ($scope.Isdefaultdata) {
                for (var i = 0; i < $scope.Milestone.length; i++) {
                    var JsonModel = {
                        BU: '', Region: '', PaymentCode: '', MilestoneDescription: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: '30 days', percentageTotal: '0', OEMHWandSW: '0', OEMServices: '0', OEMPS: '0', OEMOther: '0', SERVSW: '0', SERVServices: '0', SERVPS: '0', SERVConsulting: '0', SERVCare: '0', SERVOther: '0', SERVResource: '0', SERVTM: '0', SERVHosted: '0', PercentageType: ''
                    };
                    JsonModel.PaymentCode = $scope.Milestone[i].PaymentCode;
                    JsonModel.MilestoneDescription = $scope.Milestone[i].MilestoneDescription;
                    JsonModel.PercentageType = $scope.Milestone[i].PercentageType;

                    if ($scope.Milestone[i].PercentageType == 'No') {
                        {
                            if ($scope.Milestone[i].PaymentCode == "S9" || $scope.Milestone[i].PaymentCode == "S10") {
                                JsonModel.OEMHWandSW = '--';
                                JsonModel.OEMServices = '--';
                                JsonModel.OEMPS = '--';
                                JsonModel.OEMOther = '--';
                                JsonModel.SERVSW = '--';
                                JsonModel.SERVServices = '--';
                                JsonModel.SERVPS = '--';
                                JsonModel.SERVConsulting = '--';
                                JsonModel.SERVCare = '--';
                                JsonModel.SERVOther = '--'
                                JsonModel.SERVResource = '--';
                                JsonModel.SERVTM = '--';
                                JsonModel.SERVHosted = '--';
                            }
                            else {

                                JsonModel.OEMHWandSW = '--Select--';
                                JsonModel.OEMServices = '--Select--';
                                JsonModel.OEMPS = '--Select--';
                                JsonModel.OEMOther = '--Select--';
                                JsonModel.SERVSW = '--Select--';
                                JsonModel.SERVServices = '--Select--';
                                JsonModel.SERVPS = '--Select--';
                                JsonModel.SERVConsulting = '--Select--';
                                JsonModel.SERVCare = '--Select--';
                                JsonModel.SERVOther = '--Select--';
                                JsonModel.SERVResource = '--Select--';
                                JsonModel.SERVTM = '--Select--';
                                JsonModel.SERVHosted = '--Select--';

                            }
                        }
                    }

                    $scope.Constructdata.push(JsonModel);
                }

                $scope.PaymentConfigGrid.api.setRowData($scope.Constructdata);
            }
            else {
                for (var i = 0; i < $scope.PaymentConfig.length; i++) {
                    if ($scope.PaymentConfig[i].PercentageType == 'No') {

                        if ($scope.PaymentConfig[i].PaymentCode == "S9" || $scope.PaymentConfig[i].PaymentCode == "S10") {
                            $scope.PaymentConfig[i].OEMHWandSW = '--';
                            $scope.PaymentConfig[i].OEMServices = '--';
                            $scope.PaymentConfig[i].OEMPS = '--';
                            $scope.PaymentConfig[i].OEMOther = '--';
                            $scope.PaymentConfig[i].SERVSW = '--';
                            $scope.PaymentConfig[i].SERVServices = '--';
                            $scope.PaymentConfig[i].SERVPS = '--';
                            $scope.PaymentConfig[i].SERVConsulting = '--';
                            $scope.PaymentConfig[i].SERVCare = '--';
                            $scope.PaymentConfig[i].SERVOther = '--';
                            $scope.PaymentConfig[i].SERVResource = '--';
                            $scope.PaymentConfig[i].SERVTM = '--';
                            $scope.PaymentConfig[i].SERVHosted = '--';
                        }
                        else {
                            if ($scope.PaymentConfig[i].OEMHWandSW != '--Select--' && $scope.PaymentConfig[i].OEMHWandSW != '--' && $scope.PaymentConfig[i].OEMHWandSW != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].OEMHWandSW = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].OEMServices != '--Select--' && $scope.PaymentConfig[i].OEMServices != '--' && $scope.PaymentConfig[i].OEMServices != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].OEMServices = '--Select--';
                            }

                            if ($scope.PaymentConfig[i].OEMPS != '--Select--' && $scope.PaymentConfig[i].OEMPS != '--' && $scope.PaymentConfig[i].OEMPS != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].OEMPS = '--Select--';
                            }

                            if ($scope.PaymentConfig[i].OEMOther != '--Select--' && $scope.PaymentConfig[i].OEMOther != '--' && $scope.PaymentConfig[i].OEMOther != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].OEMOther = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVSW != '--Select--' && $scope.PaymentConfig[i].SERVSW != '--' && $scope.PaymentConfig[i].SERVSW != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVSW = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVServices != '--Select--' && $scope.PaymentConfig[i].SERVServices != '--' && $scope.PaymentConfig[i].SERVServices != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVServices = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVPS != '--Select--' && $scope.PaymentConfig[i].SERVPS != '--' && $scope.PaymentConfig[i].SERVPS != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVPS = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVConsulting != '--Select--' && $scope.PaymentConfig[i].SERVConsulting != '--' && $scope.PaymentConfig[i].SERVConsulting != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVConsulting = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVCare != '--Select--' && $scope.PaymentConfig[i].SERVCare != '--' && $scope.PaymentConfig[i].SERVCare != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVCare = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVOther != '--Select--' && $scope.PaymentConfig[i].SERVOther != '--' && $scope.PaymentConfig[i].SERVOther != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVOther = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVResource != '--Select--' && $scope.PaymentConfig[i].SERVResource != '--' && $scope.PaymentConfig[i].SERVResource != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVResource = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVTM != '--Select--' && $scope.PaymentConfig[i].SERVTM != '--' && $scope.PaymentConfig[i].SERVTM != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVTM = '--Select--';
                            }
                            if ($scope.PaymentConfig[i].SERVHosted != '--Select--' && $scope.PaymentConfig[i].SERVHosted != '--' && $scope.PaymentConfig[i].SERVHosted != '0') {
                            }
                            else {
                                $scope.PaymentConfig[i].SERVHosted = '--Select--';
                            }
                        }
                    }

                }

                $scope.PaymentConfigGrid.api.setRowData($scope.PaymentConfig);
            }
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    function getperiodEditor(params) {

        var editing = false;
        var eCell = document.createElement('span');
        eCell.title = params.value;
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);

        if ($scope.grideditable) {


            var eSelect = document.createElement("select");
            var eInput = document.createElement('input');
            eInput.type = 'text';

            $scope.SelectOptions.forEach(function (item) {
                var eOption = document.createElement("option");
                eOption.setAttribute("value", item.Type);
                eOption.setAttribute("title", item.Id);
                eOption.innerHTML = item.Type;
                eSelect.appendChild(eOption);
            });

            eSelect.value = params.value;

            params.eGridCell.addEventListener('click', function () {
                if ($scope.grideditable) {
                    if (!editing) {
                        eInput.value = eLabel.data;
                        eInput.type = 'number';


                        if (params.data.PercentageType == 'Yes') {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eInput);
                            eInput.focus();
                            editing = true;
                        }
                        else if (params.data.PercentageType == 'No') {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    }
                }
            });


            eInput.addEventListener('keydown', function (event) {
                var key = event.which || event.keyCode;
                if (this.value.length > 10)
                    this.value = this.value.slice(0, 10);
                if (key == "13") {
                    blurListenerfn();
                    eInput.removeEventListener('blur', blurListenerfn);
                }
            });

            var blurListenerfn = function () {
                editing = false;
                var newValue = eInput.value;
                if (newValue == '') {
                    newValue = 0;
                }
                if (newValue >= 0 && newValue <= 100) {
                    eLabel.data = newValue;
                    params.data[params.colDef.field] = newValue;
                }
                else {
                    toaster.pop('warning', "Warning", "Please enter value should be less than or equal to 100", null);
                }
                eCell.removeChild(eInput);
                eCell.appendChild(eLabel);
            };

            eInput.addEventListener("blur", blurListenerfn);

            eSelect.addEventListener('blur', function () {
                if (editing) {
                    editing = false;
                    eCell.removeChild(eSelect);
                    eCell.appendChild(eLabel);
                }

            });

            eSelect.addEventListener('change', function () {

                if (editing) {
                    editing = false;
                    if (checksameTypeinrow(params, eSelect.value, params.colDef.field)) {

                        var newValue = eSelect.value;
                        var id = eSelect[eSelect.selectedIndex].title;

                        eLabel.nodeValue = newValue;
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);
                    }
                    else {
                        eCell.removeChild(eSelect);
                        eCell.appendChild(eLabel);

                    }
                }

            });

        }
        return eCell;
    }

    function checksameTypeinrow(params, checktype, curentcol) {

        if (checktype == '--Select--') {
            return true;
        }
        else {
            var start = false;
            var cnt = 0;
            _.each(params.data, function (v, k) {
                if (k == "OEMHWandSW" || k == "SERVHosted") {
                    start = !start;
                }
                if (start && v != '--Select--' && v != checktype && curentcol != k) {
                    key = k;
                    cnt++;
                }
            });

            if (cnt > 0) {
                toaster.pop('warning', "Warning", "Please select same payment type in a row", null);
                return false;
            }
            else
                return true;
        }
    }
    $scope.GetAllPaymentCode = function () {
        paymentConfigFactory.GetAllPaymentCode().success(function (data) {

            $scope.paymentCode = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetPaymentPeriod = function () {

        paymentConfigFactory.GetPaymentPeriod().success(function (data) {
            $scope.paymentPeriod = data;
            $scope.call1finished = true;
            $scope.callifapiFinished();
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.Isdefaultdata = false;
    $scope.showGrid = false;


    $scope.GetPaymentConfig = function (BU, Region) {
        if (Region != null || Region != undefined) {
            $scope.showGrid = true;
            paymentConfigFactory.GetPaymentConfig(BU, Region).success(function (data) {
                if (data != null && data.length > 0) {
                    $scope.PaymentConfig = data;
                    $scope.Isdefaultdata = false;
                }
                else {
                    $scope.Isdefaultdata = true;
                    $scope.PaymentConfig = data;

                }
                $scope.GetAllMilestone();

            }).error(function (error) {
                $scope.Error = error;
            })
        }
        else {
            $scope.showGrid = false;
        }
    };


    function checkBuandRegionSelected(bu, region) {
        if (bu == null || bu == undefined) {
            toaster.pop('warning', "Warning", "Please select BU", null);
            return false;
        }
        else if (region == null || region == undefined) {
            toaster.pop('warning', "Warning", "Please select Region", null);
            return false;
        }
        else {
            return true;
        }
    }

    $scope.AddPaymentConfig = function (bu, region) {

        if (checkBuandRegionSelected(bu, region)) {
            var finaldata = [];
            if ($scope.Isdefaultdata) {


                for (var j = 0; j < $scope.Constructdata.length; j++) {
                    try {
                        $scope.Constructdata[j].paymentTerms = String($scope.Constructdata[j].paymentTerms);
                        $scope.Constructdata[j].percentageTotal = String($scope.Constructdata[j].percentageTotal);
                        $scope.Constructdata[j].OEMHWandSW = String($scope.Constructdata[j].OEMHWandSW);
                        $scope.Constructdata[j].OEMServices = String($scope.Constructdata[j].OEMServices);
                        $scope.Constructdata[j].OEMPS = String($scope.Constructdata[j].OEMPS);
                        $scope.Constructdata[j].OEMOther = String($scope.Constructdata[j].OEMOther);
                        $scope.Constructdata[j].SERVSW = String($scope.Constructdata[j].SERVSW);
                        $scope.Constructdata[j].SERVServices = String($scope.Constructdata[j].SERVServices);
                        $scope.Constructdata[j].SERVPS = String($scope.Constructdata[j].SERVPS);
                        $scope.Constructdata[j].SERVCare = String($scope.Constructdata[j].SERVCare);
                        $scope.Constructdata[j].SERVOther = String($scope.Constructdata[j].SERVOther);
                        $scope.Constructdata[j].SERVConsulting = String($scope.Constructdata[j].SERVConsulting);
                        $scope.Constructdata[j].SERVResource = String($scope.Constructdata[j].SERVResource);
                        $scope.Constructdata[j].SERVHosted = String($scope.Constructdata[j].SERVHosted);
                        $scope.Constructdata[j].SERVTM = String($scope.Constructdata[j].SERVTM);
                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }
                finaldata = $scope.Constructdata;
            }
            else {
                for (var j = 0; j < $scope.PaymentConfig.length; j++) {
                    try {
                        $scope.PaymentConfig[j].paymentTerms = String($scope.PaymentConfig[j].paymentTerms);
                        $scope.PaymentConfig[j].percentageTotal = String($scope.PaymentConfig[j].percentageTotal);
                        $scope.PaymentConfig[j].OEMHWandSW = String($scope.PaymentConfig[j].OEMHWandSW);
                        $scope.PaymentConfig[j].OEMServices = String($scope.PaymentConfig[j].OEMServices);
                        $scope.PaymentConfig[j].OEMPS = String($scope.PaymentConfig[j].OEMPS);
                        $scope.PaymentConfig[j].OEMOther = String($scope.PaymentConfig[j].OEMOther);
                        $scope.PaymentConfig[j].SERVSW = String($scope.PaymentConfig[j].SERVSW);
                        $scope.PaymentConfig[j].SERVServices = String($scope.PaymentConfig[j].SERVServices);
                        $scope.PaymentConfig[j].SERVPS = String($scope.PaymentConfig[j].SERVPS);
                        $scope.PaymentConfig[j].SERVCare = String($scope.PaymentConfig[j].SERVCare);
                        $scope.PaymentConfig[j].SERVOther = String($scope.PaymentConfig[j].SERVOther);
                        $scope.PaymentConfig[j].SERVConsulting = String($scope.PaymentConfig[j].SERVConsulting);
                        $scope.PaymentConfig[j].SERVResource = String($scope.PaymentConfig[j].SERVResource);
                        $scope.PaymentConfig[j].SERVHosted = String($scope.PaymentConfig[j].SERVHosted);
                        $scope.PaymentConfig[j].SERVTM = String($scope.PaymentConfig[j].SERVTM);
                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }
                finaldata = $scope.PaymentConfig;
            }

            for (var i = 0; i < finaldata.length; i++) {
                finaldata[i].BU = bu;
                finaldata[i].Region = region;

            }


            var JsonModel = { BU: bu, Region: region, Paymentdata: finaldata };

            paymentConfigFactory.AddPaymentConfig(JsonModel).success(function (data) {
                $scope.PaymentConfig = data;
                $scope.Isdefaultdata = false;
                toaster.pop('success', "Success", "Payment config updated successfully", null);
            }).error(function (error) {
                $scope.Error = error;
            })
        }
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
                //     $scope.paymentConfig.CountryId = $scope.Region[0].Id;
                // }
            }).error(function (error) {
                $scope.Error = error;
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

    $scope.GetAllSBU();

    $scope.GetPaymentPeriod();




});
// Payment Config Factory //

'use strict';
ReportApp.factory('paymentConfigFactory', function ($http) {
    var paymentConfigFactoryURI = BaseURL + 'PaymentConfig';
    var paymentConfigFactory = {};

    paymentConfigFactory.GetAllPaymentCode = function () {
        var result = $http.get(paymentConfigFactoryURI + '/GetAllPaymentCode');
        return result;
    }
    paymentConfigFactory.GetPaymentPeriod = function () {
        var result = $http.get(paymentConfigFactoryURI + '/GetPaymentPeriod');
        return result;
    }
    paymentConfigFactory.GetPaymentConfig = function (BU, Region) {
        var result = $http.get(paymentConfigFactoryURI + '/GetPaymentConfig?BU=' + BU + '&Region=' + Region);
        return result;
    }
    paymentConfigFactory.AddPaymentConfig = function (config) {
        return $http.post(paymentConfigFactoryURI + '/AddPaymentConfig', config);
    }
    return paymentConfigFactory;
});

