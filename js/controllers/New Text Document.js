ReportApp.controller("DaySheetController", ['$rootScope', '$scope', '$routeParams', '$window', '$http', 'priceService', 'currencyService', 'Opportunityservice', '$timeout', 'toaster', '$location', 'reportFactory', 'DayService', 'paymentConfigFactory', '_', 'EstimationApplicationMasterService', 'ManualEstimationMasterService', 'ManualEstimationTypeService', 'UserFactory', 'EstimationSDLCResourceService', 'OpportunityRateService', 'TandEPSService', '$filter', 'paymentService', 'GrossMarginService',
    'TandEResourceService', 'ResourceService', 'OppFactory', 'ProjectMarginAdminFactory', function ($rootScope, $scope, $routeParams, $window, $http, priceService, currencyService, Opportunityservice, $timeout, toaster, $location, reportFactory, DayService, paymentConfigFactory, _, EstimationApplicationMasterService, ManualEstimationMasterService, ManualEstimationTypeService, UserFactory, EstimationSDLCResourceService, OpportunityRateService, TandEPSService, $filter, paymentService, GrossMarginService,
        TandEResourceService, ResourceService, OppFactory, ProjectMarginAdminFactory) {

        $scope.grideditable_PriceList = false;

        $scope.PageVariableInitialization_Daysheet = function () {
            $scope.status = {
                isFirstOpen: false,
                isFirstDisabled: false
            };


            $scope.GlobalIdentityOppId = $routeParams.OppId;
            $scope.GlobalGroupId = $routeParams.GroupId;

            $scope.call1finished = false;
            $scope.call2finished = false;
            $scope.call3finished = false;
            $scope.call4finished = false;
            $scope.call5finished = true;
            $scope.call6finished = false; // for payment period
            $scope.griduseredit = false;
            $scope.hasedit = false;

            $scope.iscellrefresh = false;
            $scope.isPricingSheetUpdated = false;

            $scope.Opp = [];
            var totalrowFTE = [];
            var totalrowPriceCost = [];

            $scope.call1Api = false;
            $scope.call2Api = false;
            $scope.call3Api = false;
            $scope.call4Api = false;
            $scope.call5Api = false;
            $scope.call6Api = false;
            $scope.call7Api = false;
            $scope.call8Api = false;
            $scope.call9Api = false;
            $scope.call10Api = false;
            $scope.call11Api = false;
            $scope.call12Api = false;
            $scope.call13Api = false;
            $scope.call14Api = false;
            $scope.call15Api = false;
            $scope.call16Api = false;

            $scope.Manualoptions = [];
            $scope.options = ['SELF_SERVICE', 'APPLICATIONS', 'ADMIN', 'PACKAGE', 'REPORT', 'CISCO', 'ACQUEON', 'SERVION_PRODUCTS', 'Avaya', 'eGain', 'WFO', 'Others'];
            $scope.ExtendedEffortCycle = { REQ: 1, Design: 1, DevTest: 1, SysTest: 1, IMPL: 1, UAT: 1, PROD: 1, Train: 1, Manual: 1, OH: 1, SQA: 1, PM: 1, DaySheetGroupId: $scope.GlobalGroupId };

            $scope.ISLOB = false;
            $scope.GlobalVersionsave = [];
            $scope.localversionConfirm = [];

            $scope.SelectOptions = [];
            $scope.hasslice = false;
            $scope.showmsg = true;



            var sortableEle;

            $scope.TEtabs = [
                {
                    title: 'PS',
                    active: true,
                    GridName: 'tandEPSGrd'
                },
                {
                    title: 'T & E Resources',
                    active: false,
                    GridName: 'tandEResourceGrid'
                }
            ];


            $scope.tabs = [
                {
                    title: 'Estimation Sheet Version Selection',
                    active: true,
                    GridName: '--'
                },
                {
                    title: 'Day Sheet',
                    active: false,
                    GridName: 'gridDay1'
                },
                {
                    title: 'Detailed view',
                    active: false,
                    GridName: 'gridLOB'
                },
                {
                    title: 'FTE Hours/Days and Business Days',
                    active: false,
                    GridName: 'gridFTEDays'
                },
            ];

            $scope.tabs1 = [
                {
                    title: 'Opportunity Configuration',
                    active: true,
                    GridName: '--'
                },
                {
                    title: 'Resourcing',
                    active: false,
                    GridName: 'resourceGrid'
                },
                {
                    title: 'T & E',
                    active: false,
                    GridName: 'tandEPSGrd'
                },
                {
                    title: 'Estimation - PS',
                    active: false,
                    GridName: 'Estimation'
                },
                {
                    title: 'Pricing Sheet',
                    active: false,
                    GridName: 'gridOptions_PriceList'
                },
                {
                    title: 'Payment Sheet',
                    active: false,
                    GridName: 'gridPayment'
                },
                {
                    title: 'Project Margin',
                    active: false,
                    GridName: '--'
                }
            ];
            //start

            $scope.select = function (tab, type) {
                angular.element(document.querySelector('#loader')).removeClass('hide');
                if (type == 1) {  //Estimation Sub tabs
                    angular.forEach($scope.tabs, function (value, key) {
                        value.active = false;
                    });
                    tab.active = true;

                    $timeout(function () {
                        if (tab.GridName == "gridDay1") {
                            $scope.gridDay1.api.sizeColumnsToFit();
                            $scope.gridDay2.api.sizeColumnsToFit();
                            $scope.gridDay3.api.sizeColumnsToFit();
                            $scope.gridDay1.api.refreshView();
                            $scope.gridDay2.api.refreshView();
                            $scope.gridDay3.api.refreshView();
                        }
                        else if (tab.GridName == "gridLOB") {
                            $scope.gridLOB.api.refreshView();
                        }
                        else if (tab.GridName == "gridFTEDays") {
                            $scope.gridFTEDays.api.sizeColumnsToFit();
                            $scope.gridDistribution.api.sizeColumnsToFit();
                            $scope.gridPriceCost.api.sizeColumnsToFit();
                            $scope.gridFTEDays.api.refreshView();
                            $scope.gridDistribution.api.refreshView();
                            $scope.gridPriceCost.api.refreshView();
                        }

                        angular.element(document.querySelector('#loader')).addClass('hide');

                    }, 1000);
                }
                else if (type == 2) {
                    angular.forEach($scope.tabs1, function (value, key) {
                        value.active = false;
                    });
                    tab.active = true;


                    $timeout(function () {
                        if (tab.GridName == "resourceGrid") {
                            $scope.resourceGrid.api.refreshView();
                        }
                        if (tab.GridName == "Estimation") {
                            angular.forEach($scope.tabs, function (value, key) {
                                value.active = false;
                            });
                            $scope.tabs[0].active = true;
                        }

                        else if (tab.GridName == "tandEPSGrd") {
                            angular.forEach($scope.TEtabs, function (value, key) {
                                value.active = false;
                            });
                            tab.active = true;

                            $scope.TEtabs[0].active = true;
                            $scope.tandEPSGrd.api.refreshView();
                        }
                        else if (tab.GridName == "gridOptions_PriceList") {

                            $scope.gridOptions_PriceList.api.refreshView();
                        }
                        else if (tab.GridName == "gridPayment") {

                            $scope.gridPayment.api.refreshView();
                        }
                        angular.element(document.querySelector('#loader')).addClass('hide');

                    }, 1000);
                }
                else {

                    angular.forEach($scope.TEtabs, function (value, key) {
                        value.active = false;
                    });
                    tab.active = true;

                    $timeout(function () {

                        if (tab.GridName == "tandEResourceGrid") {
                            $scope.tandEResourceGrid.api.refreshView();
                        }
                        else if (tab.GridName == "tandEPSGrd") {
                            $scope.tandEPSGrd.api.refreshView();
                        }
                        angular.element(document.querySelector('#loader')).addClass('hide');

                    }, 1000);

                }

            };

            $scope.ViewData = {};
            $scope.isEditClicked = false;
            $scope.DefautState = false;
        }


        $scope.PageVariableInitialization_Daysheet();
        //-------------------------------------------------
        //Grid Declaration
        //-------------------------------------------------


        $scope.gridLOB = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            headerHeight: 38,
            rowHeight: 25,
            rowData: [],
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            onCellValueChanged: cellValueChangedFunction5,

        };

        $scope.data = [];
        $scope.data1 = [];
        $scope.data2 = [];
        $scope.data3 = [];
        $scope.dataLOB = [];

        $scope.gridDay1 = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.data,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            onCellValueChanged: cellValueChangedFunction1,
        };


        $scope.gridDay2 = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.data1,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            onCellValueChanged: cellValueChangedFunction2,
        };

        $scope.gridDay3 = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.data2,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            //onSelectionChanged: cellValueChangedFunction3,
        };


        $scope.gridDay4 = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.data3,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            onCellValueChanged: cellValueChangedFunction4,
        };



        $scope.FixedFTEDaysJson = [
            { SDLCStage: 'Requirements Gathering', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Design', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Development & Test', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'System Testing', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Implementation', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'UAT', Tool: '', Manual: '', Extend: '', Total: '', CalculatedEfforts: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Production Support / Cutover', Tool: '', Manual: '', CalculatedEfforts: '', Extend: '', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Training', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: 'select', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Manuals', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: '', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Orientation & Handover', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: '', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'SQA', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: '', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            { SDLCStage: 'Project Management', Tool: '0', Manual: '0', Extend: '0', CalculatedEfforts: '0', Total: '', Change: '', EffortAuthourize: 'select', FTEHours: '', Resources: '1', Days: '', Daychange: '', DaysAuthourize: '', BusinessDays: '', OnsitePercentage: '', PrevvalueFTE: '', PrevvalueBD: '', FTEChangeStatus: '', BDChangeStatus: '' },
            //{ SDLCStage: 'Calculated Efforts', Tool: '', Manual: '', Extend: '', Total: '', Change: '', EffortAuthourize: '', FTEHours: '', Resources: '', Days: '', Daychange: '', DaysAuthourize: '', BusinessDays: '', OnsitePercentage: '' }

        ]



        $scope.FixedDistributionJson =
            [{ SDLCStage: 'Requirements Gathering', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'Design', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', Total: 0, CDORemoteL1: '', CDORemoteL2: '' },
            { SDLCStage: 'Development & Test', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'System Testing', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'Implementation', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'UAT', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'Production Support / Cutover', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'Training', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'Manuals', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'Orientation & Handover', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'SQA', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 },
            { SDLCStage: 'Project Management', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', CDORemoteL1: '', CDORemoteL2: '', Total: 0 }]
        // { SDLCStage: 'Calculated Efforts', BUOnsiteL1: '', BUOnsiteL2: '', BURemoteL1: '', BURemoteL2: '', CDOOnsiteL1: '', CDOOnsiteL2: '', Total: 0 },


        $scope.FixedPriceCostJson = [
            { SDLCStage: 'Requirements Gathering', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Design', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Development & Test', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'System Testing', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Implementation', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'UAT', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Production Support / Cutover', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Training', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Manuals', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Orientation & Handover', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'SQA', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            { SDLCStage: 'Project Management', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '', Total: 0 },
            //  { SDLCStage: 'Calculated Efforts', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '' }

        ]


        // fouth tab
        $scope.gridFTEDays = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.FixedFTEDaysJson,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            onCellValueChanged: FTEGridchange,
            getRowStyle: function (params) {
                if (params.node.floating) {
                    return { 'font-weight': 'bold', 'background-color': '#ffd966' }
                }
            },
        };

        $scope.gridDistribution = {
            angularCompileRows: true,
            columnDefs: [],
            rowSelection: 'single',
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.FixedDistributionJson,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            onCellValueChanged: DistributionGridchange,

        };

        $scope.gridPriceCost = {
            angularCompileRows: true,
            columnDefs: [],
            headerHeight: 38,
            rowHeight: 25,
            rowData: $scope.FixedPriceCostJson,
            enableColResize: true,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            //  onCellValueChanged: cellValueChangedFunction5,
            getRowStyle: function (params) {
                if (params.node.floating) {
                    return { 'font-weight': 'bold', 'background-color': '#99ff99' }
                }
            },
        };

        //-------------------------------------------------
        //Grid Declaration
        //-------------------------------------------------

        $scope.dynamicPopover = {
            templateUrl: 'popover.html',
        };


        $scope.checkIFFreshsheet = function () {
            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                $scope.IsfreshSheet = true;
            }
        }

        //fouth tab end
        function DistributionGridchange() {
            $scope.gridDistribution.api.refreshView();

            GetOnsitePercentChange(true);
        }

        function FTEGridchange() {
            $scope.gridFTEDays.api.refreshView();
            setcalculatedeffortsonly(); //not required
            Fouthtabaction();
        }

        $scope.resetselection = function () {
            $scope.DaySheetData = {};
            $scope.DaySheetData.SelfserviceId = [];
            $scope.DaySheetData.ApplicationsId = []
            $scope.DaySheetData.AdminId = []
            $scope.DaySheetData.CiscoId = []
            $scope.DaySheetData.ServProductsId = []
            $scope.DaySheetData.AvayaId = []
            $scope.DaySheetData.EgainId = []
            $scope.DaySheetData.WFOId = []
            $scope.DaySheetData.OthersId = []
            $scope.DaySheetData.AcqueonId = []

            $scope.CSVersions = [];
            $scope.AVVersions = [];
            $scope.EGVersions = [];
            $scope.AppVersions = [];
            $scope.OtherVersions = [];
            $scope.ManualVersions = [];
            $scope.SelfVersions = [];
            $scope.ACQVersions = [];
            $scope.WFVersions = [];
            $scope.ServPoductVersions = [];
            $scope.AdminVersions = [];
        }

        $scope.GetAllManualEstimationType = function () {
            ManualEstimationTypeService.GetAllManualEstimationType().success(function (data) {

                for (var j = 0; j < data.length; j++) {
                    $scope.Manualoptions.push(data[j].TaskName);
                }

            }).error(function (error) {
                $scope.Error = error;
            })
        };




        $scope.GetPriceSheetMappeddataByversion = function (oppid, groupid) {

            priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function (data) {
                //jay
                $scope.MaxVersion = data[0].Version;
                $scope.MaxSheetGroupID = data[0].PriceSheetId;
                //$scope.grideditable_PriceList = data[0].IsEditable;
                $scope.hasedit = data[0].IsEditable;
                $scope.call6finished = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };



        //#region Version Creations


        function dynamicversioncreation(id, data, version, appversion, api, Totalversion, issheetexist, Latestversion) {

            //  $scope[version] = data;

            angular.forEach(data, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope[Totalversion] = $scope[Totalversion] + 1;
                    value.oppautoid = id;
                    $scope[appversion].push(value);
                    if ($scope.Opp[Latestversion] < value.ApplicationId) {
                        $scope.Opp[Latestversion] = value.ApplicationId;
                        $scope[issheetexist] = true;
                    }
                }
            });
            $scope[api] = true;
            ReverseCalc();
        }


        $scope.GetAppVersions = function (id, oppId) {
            $scope.isApplicatonSheetExist = false;
            $scope.Opp.LatestAppVersion = 0;
            $scope.TotalAppVersion = 0;

            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ApplicationSheet').success(function (data) {
                dynamicversioncreation(id, data, 'ApplicatonVersions', 'AppVersions', 'call1Api', 'TotalAppVersion', 'isApplicatonSheetExist', 'LatestAppVersion')
            }).error(function (error) {
                $scope.Error = error;
            });


        };

        $scope.GetOthersVersions = function (id, oppId) {
            $scope.isOthersSheetExist = false;
            $scope.Opp.LatestOthersVersion = 0;
            $scope.TotalOthersVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'OthersSheet').success(function (data) {
                dynamicversioncreation(id, data, 'OthersVersions', 'OtherVersions', 'call3Api', 'TotalOthersVersion', 'isOthersSheetExist', 'LatestOthersVersion')
            }).error(function (error) {
                $scope.Error = error;
            });

        };

        $scope.GetManualVersions = function (id, oppId) {
            $scope.isManualSheetExist = false;
            $scope.Opp.LatestManualVersion = 0;
            $scope.TotalManualVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ManualEstimationSheet').success(function (data) {
                dynamicversioncreation(id, data, 'ManualsVersions', 'ManualVersions', 'call15Api', 'TotalManualVersion', 'isManualSheetExist', 'LatestManualVersion')
            }).error(function (error) {
                $scope.Error = error;
            });

        };

        $scope.GetSelfServiceVersions = function (id, oppId) {
            $scope.isSelfServiceSheetExist = false;
            $scope.Opp.LatestSelfServiceVersion = 0;
            $scope.TotalSelfServiceVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'SelfServiceSheet').success(function (data) {
                dynamicversioncreation(id, data, 'SelfServiceVersions', 'SelfVersions', 'call2Api', 'TotalSelfServiceVersion', 'isSelfServiceSheetExist', 'LatestSelfServiceVersion')
            }).error(function (error) {
                $scope.Error = error;
            });
        };


        $scope.GetEGainVersions = function (id, oppId) {
            $scope.isEGainSheetExist = false;
            $scope.Opp.LatestEGainVersion = 0;
            $scope.TotalEGainVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'EGainSheet').success(function (data) {
                dynamicversioncreation(id, data, 'EGainVersions', 'EGVersions', 'call4Api', 'TotalEGainVersion', 'isEGainSheetExist', 'LatestEGainVersion')
            }).error(function (error) {
                $scope.Error = error;
            });
        };

        $scope.GetAvayaVersions = function (id, oppId) {

            $scope.isAvayaSheetExist = false;
            $scope.Opp.LatestAvayaVersion = 0;
            $scope.TotalAvayaVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AvayaSheet').success(function (data) {
                dynamicversioncreation(id, data, 'AvayaVersions', 'AVVersions', 'call6Api', 'TotalAvayaVersion', 'isAvayaSheetExist', 'LatestAvayaVersion')
            }).error(function (error) {
                $scope.Error = error;
            });
        };


        $scope.GetCiscoVersions = function (id, oppId) {

            $scope.isCiscoSheetExist = false;
            $scope.Opp.LatestCiscoVersion = 0;
            $scope.TotalCiscoVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'CiscoSheet').success(function (data) {
                dynamicversioncreation(id, data, 'CiscoVersions', 'CSVersions', 'call7Api', 'TotalCiscoVersion', 'isCiscoSheetExist', 'LatestCiscoVersion')
            }).error(function (error) {
                $scope.Error = error;
            });
        };


        $scope.GetAcqueonVersions = function (id, oppId) {

            $scope.isAcqueonSheetExist = false;
            $scope.Opp.LatestAcqueonVersion = 0;
            $scope.TotalAcqueonVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AcqueonSheet').success(function (data) {
                dynamicversioncreation(id, data, 'AcqueonVersions', 'ACQVersions', 'call10Api', 'TotalAcqueonVersion', 'isAcqueonSheetExist', 'LatestAcqueonVersion')
            }).error(function (error) {
                $scope.Error = error;
            });
        };

        $scope.GetWFOVersions = function (id, oppId) {

            $scope.isWFOSheetExist = false;
            $scope.Opp.LatestWFOVersion = 0;
            $scope.TotalWFOVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'WFOSheet').success(function (data) {
                dynamicversioncreation(id, data, 'WFOVersions', 'WFVersions', 'call8Api', 'TotalWFOVersion', 'isWFOSheetExist', 'LatestWFOVersion')
            }).error(function (error) {
                $scope.Error = error;
            });
        };

        $scope.GetServProductsVersions = function (id, oppId) {
            $scope.isServionProductsSheetExist = false;
            $scope.Opp.LatestServionProductsVersion = 0;
            $scope.TotalServionProductsVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ServionProductsSheet').success(function (data) {
                dynamicversioncreation(id, data, 'ServionProductsVersions', 'ServPoductVersions', 'call9Api', 'TotalServionProductsVersion ', 'isServionProductsSheetExist', 'LatestServionProductsVersion')
            }).error(function (error) {
                $scope.Error = error;
            });
        };

        $scope.GetAdminVersions = function (id, oppId) {
            $scope.isAdminReportsSheetExist = false;
            $scope.Opp.LatestAdminReportsVersion = 0;
            $scope.TotalAdminReportsVersion = 0;
            EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AdminReportsSheet').success(function (data) {

                dynamicversioncreation(id, data, 'AdminReportsVersions', 'AdminVersions', 'call5Api', 'LatestAdminReportsVersion', 'isAdminReportsSheetExist ', 'LatestAdminReportsVersion ')
            }).error(function (error) {
                $scope.Error = error;
            });

        };


        //#endregion  Version Creations

        $scope.onchangedatacenter = function () {

            var test = {
                OppId: $scope.OpportunityDetail.id, RootId: $scope.GlobalGroupId,
                NoOfDataCenterLocs: $scope.OpportunityDetail.NoOfDataCenterLocs,
                NoOfAgentCenterLocs: $scope.OpportunityDetail.NoOfAgentCenterLocs
            };

            EstimationApplicationMasterService.getsdlcpercentage(test).success(function (data) {
                $scope.SDLCPercentage = data;
                $scope.call14Api = true;
                ReverseCalc();
            }).error(function (error) {
                $scope.Error = error;
            });
        }

        // have to change logic based on version
        $scope.GetAllInternalCalculation = function (opp) {
            $scope.call11Api = true;

            $scope.call13Api = true;
            //  $scope.onchangedatacenter();
            //jay stopped here to get initial load

            var opp = { OppId: $scope.OpportunityDetail.OppId }

            EstimationApplicationMasterService.GetAllInternalCalculationTotalSingle(opp).success(function (data) {
                $scope.CompleteResultsetSingle = data;
            }).error(function (error) {
                $scope.Error = error;
            });


            EstimationApplicationMasterService.GetAllInternalCalculationTotalMulti(opp).success(function (data) {
                $scope.CompleteResultsetMulti = data;

            }).error(function (error) {
                $scope.Error = error;
            });

        }


        $scope.getdata = function () {
            angular.element(document.querySelector('#loader')).removeClass('hide');
            $scope.onLoad();
            FillrightdataforLOB();

            $timeout(function () {

                $scope.gridDay1.api.sizeColumnsToFit();
                $scope.gridDay2.api.sizeColumnsToFit();
                $scope.gridDay3.api.sizeColumnsToFit();
                $scope.gridDay4.api.sizeColumnsToFit();

                $scope.gridDay1.api.refreshView();
                $scope.gridDay2.api.refreshView();
                $scope.gridDay3.api.refreshView();
                $scope.gridDay4.api.refreshView();
                angular.element(document.querySelector('#loader')).addClass('hide');
            }, 3000);

        }


        $scope.GetOpportunityList = function (id) {
            Opportunityservice.GetopportunitybyID(id).success(function (data) {
                if (data != null && data.length > 0) {

                    $scope.OpportunityDetail = data[0];
                    console.log($scope.OpportunityDetail);


                    $scope.OpportunityDetail_PriceList = data[0];
                    $scope.call11finished_PriceList = true;
                    $scope.GetLegalEntityFromOpp_PriceList($scope.OpportunityDetail_PriceList.id);
                    $scope.GetAllChildOpportunity_PriceList($scope.OpportunityDetail_PriceList.id)
                    $scope.GetPriceSheetByversion($scope.OpportunityDetail_PriceList.OppId, $routeParams.GroupId);
                    $scope.GetPriceSheetVersionsForOpp_PriceList($scope.OpportunityDetail_PriceList.OppId);
                    //getting default legal entity mapping for bu and region
                    //getting threshold values
                    $scope.GetMarginbyBU_PriceList($scope.OpportunityDetail_PriceList.SBUId, $scope.OpportunityDetail_PriceList.CountryId);
                    $scope.GetDiscountbyBU_PriceList($scope.OpportunityDetail_PriceList.SBUId, $scope.OpportunityDetail_PriceList.CountryId);


                    //merge2
                    $scope.MaxSheetGroupID = $routeParams.GroupId;
                    $scope.GetGrossmarginbyOppGroup_GM($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                    // $scope.GetPriceSheetVersionsForOpp_GM($scope.OpportunityDetail.OppId)
                    //$scope.GetPriceSheetMappeddataByversion_GM($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                    //merge2


                    //merge3
                    $scope.OppDetail = data[0];

                    $scope.GetResourceGridData();
                    $scope.GetTandEPSGridData();
                    $scope.GetTandEResourceGridData();
                    //$scope.GetAllVersions();
                    //merge3

                    $scope.GetExtendedEfforts();

                    $scope.GetAllInternalCalculation($scope.OpportunityDetail);
                    $scope.MaxSheetGroupID = $routeParams.GroupId;


                    $scope.GetDaySheetbyOppGroup($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                    $scope.GetPriceSheetVersionsForOpp($scope.OpportunityDetail.OppId)
                    //have to decide here
                    $scope.GetAppVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetSelfServiceVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetOthersVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetEGainVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetAdminVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetAvayaVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetCiscoVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetWFOVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetServProductsVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetAcqueonVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);
                    $scope.GetManualVersions($scope.OpportunityDetail.id, $scope.OpportunityDetail.OppId);

                    //Oppconfig version control
                    $scope.GetOpportunityListOppConfig($scope.OpportunityDetail.OppId, $routeParams.GroupId);

                }
                else {
                    toaster.pop('error', "Error", 'Invalid Opportunity Details', null);
                    //redirect to Home Page
                    $location.path("home");
                }

            });
        };


        function setgrid() {

            var columnDefs = [
                {
                    headerName: "", field: "TypeId", hide: true
                },
                {
                    headerName: "", field: "GridName", hide: true
                },
                {
                    headerName: "Description", field: "Description", width: 250, headerTooltip: "Description"
                },
                {
                    headerName: "REQ", field: "REQ", width: 70, headerTooltip: "REQ",
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },

                {
                    headerName: "Design", field: "Design", width: 70, headerTooltip: "Design",
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "DevTest", field: "DevTest", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "SysTest", field: "SysTest", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "IMPL", field: "IMPL", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },

                {
                    headerName: "UAT", field: "UAT", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "PROD", field: "PROD", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "TRAIN", field: "TRAIN", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "MANUAL", field: "MANUAL", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "OH", field: "OH", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },

                },
                {
                    headerName: "SQA", field: "SQA", width: 70,
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },
                },
                {
                    headerName: "PM", field: "PM", width: 70, editable: true, hide: true
                },
                {
                    headerName: "Total", field: "Total", width: 80, cellRenderer: function (params) {


                        params.value = (isNaN(parseFloat(params.data.REQ)) ? 0 : parseFloat(params.data.REQ)) +
                            (isNaN(parseFloat(params.data.Design)) ? 0 : parseFloat(params.data.Design)) +
                            (isNaN(parseFloat(params.data.DevTest)) ? 0 : parseFloat(params.data.DevTest)) +
                            (isNaN(parseFloat(params.data.SysTest)) ? 0 : parseFloat(params.data.SysTest)) +
                            (isNaN(parseFloat(params.data.IMPL)) ? 0 : parseFloat(params.data.IMPL)) +
                            (isNaN(parseFloat(params.data.UAT)) ? 0 : parseFloat(params.data.UAT)) +
                            (isNaN(parseFloat(params.data.PROD)) ? 0 : parseFloat(params.data.PROD)) +
                            (isNaN(parseFloat(params.data.TRAIN)) ? 0 : parseFloat(params.data.TRAIN)) +
                            (isNaN(parseFloat(params.data.MANUAL)) ? 0 : parseFloat(params.data.MANUAL)) +
                            (isNaN(parseFloat(params.data.OH)) ? 0 : parseFloat(params.data.OH)) +
                            (isNaN(parseFloat(params.data.SQA)) ? 0 : parseFloat(params.data.SQA)) +
                            (isNaN(parseFloat(params.data.PM)) ? 0 : parseFloat(params.data.PM));

                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(1) + '</span>';

                        }
                        else {
                            return params.value;
                        }
                    },

                }

            ];

            var columnDefs1 = [

                {
                    headerName: "", field: "TypeId", hide: true
                },
                {
                    headerName: "", field: "GridName", hide: true
                },
                {
                    headerName: "Description", field: "Description", width: 170, headerTooltip: "Description",
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" max-length="50" ng-model="data2[' + params.rowIndex + '].Description"'
                                + '/></span>';
                        }
                        else
                            return $scope.data2[params.rowIndex].Description;
                    },
                },
                {
                    headerName: "REQ", field: "REQ", width: 70, headerTooltip: "REQ",
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].REQ" ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].REQ, 1);
                    },

                },

                {
                    headerName: "Design", field: "Design", width: 70, headerTooltip: "Design",
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + ' type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].Design" ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].Design, 1);
                    },

                },
                {
                    headerName: "DevTest", field: "DevTest", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[ ' + params.rowIndex + '].DevTest"  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].DevTest, 1);
                    },

                },
                {
                    headerName: "SysTest", field: "SysTest", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].SysTest"  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].SysTest, 1);
                    },

                },
                {
                    headerName: "IMPL", field: "IMPL", width: 70,

                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].IMPL "  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].IMPL, 1);
                    },

                },

                {
                    headerName: "UAT", field: "UAT", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].UAT "  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].UAT, 1);
                    },

                },
                {
                    headerName: "PROD", field: "PROD", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].PROD "  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].PROD, 1);
                    },


                },
                {
                    headerName: "TRAIN", field: "TRAIN", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].TRAIN "  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].TRAIN, 1);
                    },

                },
                {
                    headerName: "MANUAL", field: "MANUAL", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].MANUAL "  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].MANUAL, 1);
                    },

                },
                {
                    headerName: "OH", field: "OH", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].OH "  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].OH, 1);
                    },

                },
                {
                    headerName: "SQA", field: "SQA", width: 70,
                    cellRenderer: function (params) {
                        if (params.data.Description != "Additional Phases") {
                            return '<span><input  ng-disabled="!isEditClicked"'
                                + 'type="text" numberonly min=0 ng-model="data2[' + params.rowIndex + '].SQA"  ng-blur="cellValueChangedFunction3()"'
                                + '/></span>';
                        }
                        else
                            return $filter('number')($scope.data2[params.rowIndex].SQA, 1);
                    },

                },
                {

                    headerName: "PM", field: "PM", width: 70, editable: true, hide: true, cellRenderer: function (params) {

                    },
                },
                {
                    headerName: "Total", field: "Total", width: 80,

                    cellRenderer: function (params) {

                        params.value = (isNaN(parseFloat(params.data.REQ)) ? 0 : parseFloat(params.data.REQ)) +
                            (isNaN(parseFloat(params.data.Design)) ? 0 : parseFloat(params.data.Design)) +
                            (isNaN(parseFloat(params.data.DevTest)) ? 0 : parseFloat(params.data.DevTest)) +
                            (isNaN(parseFloat(params.data.SysTest)) ? 0 : parseFloat(params.data.SysTest)) +
                            (isNaN(parseFloat(params.data.IMPL)) ? 0 : parseFloat(params.data.IMPL)) +
                            (isNaN(parseFloat(params.data.UAT)) ? 0 : parseFloat(params.data.UAT)) +
                            (isNaN(parseFloat(params.data.PROD)) ? 0 : parseFloat(params.data.PROD)) +
                            (isNaN(parseFloat(params.data.TRAIN)) ? 0 : parseFloat(params.data.TRAIN)) +
                            (isNaN(parseFloat(params.data.MANUAL)) ? 0 : parseFloat(params.data.MANUAL)) +
                            (isNaN(parseFloat(params.data.OH)) ? 0 : parseFloat(params.data.OH)) +
                            (isNaN(parseFloat(params.data.SQA)) ? 0 : parseFloat(params.data.SQA)) +
                            (isNaN(parseFloat(params.data.PM)) ? 0 : parseFloat(params.data.PM));

                        if (params.value > 0) {

                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';

                        }
                        else {
                            return params.value;
                        }
                    },

                }

            ];


            var columnDefsFTE = [
                {
                    headerName: "SDLC Stage", field: "SDLCStage", width: 150
                },
                {
                    headerName: 'FTE ',// + $scope.OpportunityDetail.UseManDayshours,
                    children: [
                        {

                            headerName: "Tool", field: "Tool", width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            }
                        },
                        {
                            headerName: "Manual", field: "Manual", editable: $scope.grideditable_PriceList, width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            }
                        },
                        {
                            headerName: "Extend", field: "Extend", width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    if (params.node.floating != "bottom")
                                        return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                    else
                                        return '<span title=' + params.value + '>' + Math.round(params.value) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            }
                        },
                        {
                            headerName: "CalculatedEfforts", field: "CalculatedEfforts", width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                        },
                        {
                            headerName: "Total", field: "Total", width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                            cellStyle: { 'background-color': '#CDCDCD' },
                        },
                        { headerName: "Change", field: "Change", editable: $scope.grideditable_PriceList, width: 80 },
                        {
                            headerName: "Authourize", field: "EffortAuthourize", width: 80,
                            cellRenderer: function (params) {
                                return "<a style='text-decoration: underline;' title='" + params.data.EffortAuthourize + "' data-ng-click=\"EditGridModel('FTE','" + params.data.SDLCStage + "','" + params.data.EffortAuthourize + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\">" + params.data.EffortAuthourize + "</a>";
                            }
                        },
                        {
                            headerName: "FTE ",// + $scope.OpportunityDetail.UseManDayshours, 
                            field: "FTEHours", width: 80, cellStyle: { 'background-color': '#ACD0C0' }, cellRenderer: function (params) {
                                if (params.value > 0) {

                                    if (params.node.floating != "bottom")
                                        return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                    else
                                        return '<span title=' + params.value + '>' + Math.round(params.value) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },

                        }

                    ]
                },
                {
                    headerName: 'Business Days',
                    children: [
                        { headerName: "Resources", field: "Resources", editable: $scope.grideditable_PriceList, width: 80 },
                        {
                            headerName: "Days", field: "Days", width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },

                        },
                        { headerName: "Change", field: "Daychange", editable: $scope.grideditable_PriceList, width: 80 },
                        {
                            headerName: "Authourize", field: "DaysAuthourize", width: 80,
                            cellRenderer: function (params) {
                                return "<a style='text-decoration: underline;' title='" + params.data.DaysAuthourize + "' data-ng-click=\"EditGridModel('BD','" + params.data.SDLCStage + "','" + params.data.DaysAuthourize + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> " + params.data.DaysAuthourize + "</a>";
                            }
                        },
                        {
                            headerName: "Business Days", field: "BusinessDays", width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                            cellStyle: { 'background-color': '#D6CA8B' },
                        },

                        {
                            headerName: "% Onsite", field: "OnsitePercentage", width: 80, cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 1) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            }
                        }
                    ]
                },
                {
                    headerName: "", field: "PrevvalueFTE", hide: true
                },
                {
                    headerName: "", field: "PrevvalueBD", hide: true
                },
                {
                    headerName: "", field: "FTEChangeStatus", hide: true, cellRenderer: function (params) {
                        if (params.data.PrevvalueFTE == params.data.Change) {
                            return "Y";
                        }
                        else {
                            return "N";
                        }
                    }
                },
                {
                    headerName: "", field: "BDChangeStatus", hide: true, cellRenderer: function (params) {
                        if (params.data.PrevvalueBD == params.data.Daychange) {
                            return "Y";
                        }
                        else {
                            return "N";
                        }
                    }
                },


            ]

            var columnDefsTest2 = [
                {
                    headerName: "Distribution By Resource Type", field: "SDLCStage", width: 150
                },
                {
                    headerName: 'BU % Onsite',
                    children: [
                        { headerName: "L1", field: "BUOnsiteL1", editable: $scope.grideditable_PriceList, width: 80 },
                        { headerName: "L2", field: "BUOnsiteL2", width: 80, editable: $scope.grideditable_PriceList },
                    ]
                },
                {
                    headerName: 'BU % Remote',
                    children: [
                        { headerName: "L1", field: "BURemoteL1", width: 80, editable: $scope.grideditable_PriceList },
                        { headerName: "L2", field: "BURemoteL2", width: 80, editable: $scope.grideditable_PriceList },
                    ]
                },
                {
                    headerName: 'CDO % Onsite',
                    children: [
                        { headerName: "L1", field: "CDOOnsiteL1", width: 80, editable: $scope.grideditable_PriceList },
                        { headerName: "L2", field: "CDOOnsiteL2", width: 80, editable: $scope.grideditable_PriceList },
                    ]
                },
                {
                    headerName: 'CDO % Remote',
                    children: [
                        { headerName: "L1", field: "CDORemoteL1", width: 80, editable: $scope.grideditable_PriceList },
                        { headerName: "L2", field: "CDORemoteL2", width: 80, editable: $scope.grideditable_PriceList },
                    ]
                },
                {
                    headerName: "Total", field: "Total", width: 150

                    , cellRenderer: function (params) {
                        params.value =
                            (isNaN(parseFloat(params.data.BUOnsiteL1)) ? 0 : parseFloat(params.data.BUOnsiteL1)) +
                            (isNaN(parseFloat(params.data.BUOnsiteL2)) ? 0 : parseFloat(params.data.BUOnsiteL2)) +
                            (isNaN(parseFloat(params.data.BURemoteL1)) ? 0 : parseFloat(params.data.BURemoteL1)) +
                            (isNaN(parseFloat(params.data.BURemoteL2)) ? 0 : parseFloat(params.data.BURemoteL2)) +
                            (isNaN(parseFloat(params.data.CDOOnsiteL1)) ? 0 : parseFloat(params.data.CDOOnsiteL1)) +
                            (isNaN(parseFloat(params.data.CDOOnsiteL2)) ? 0 : parseFloat(params.data.CDOOnsiteL2)) +
                            (isNaN(parseFloat(params.data.CDORemoteL1)) ? 0 : parseFloat(params.data.CDORemoteL1)) +
                            (isNaN(parseFloat(params.data.CDORemoteL2)) ? 0 : parseFloat(params.data.CDORemoteL2));

                        return params.value;

                    },
                    cellClassRules: {
                        'bg-red': function (params) {
                            var value =
                                (isNaN(parseFloat(params.data.BUOnsiteL1)) ? 0 : parseFloat(params.data.BUOnsiteL1)) +
                                (isNaN(parseFloat(params.data.BUOnsiteL2)) ? 0 : parseFloat(params.data.BUOnsiteL2)) +
                                (isNaN(parseFloat(params.data.BURemoteL1)) ? 0 : parseFloat(params.data.BURemoteL1)) +
                                (isNaN(parseFloat(params.data.BURemoteL2)) ? 0 : parseFloat(params.data.BURemoteL2)) +
                                (isNaN(parseFloat(params.data.CDOOnsiteL1)) ? 0 : parseFloat(params.data.CDOOnsiteL1)) +
                                (isNaN(parseFloat(params.data.CDOOnsiteL2)) ? 0 : parseFloat(params.data.CDOOnsiteL2)) +
                                (isNaN(parseFloat(params.data.CDORemoteL1)) ? 0 : parseFloat(params.data.CDORemoteL1)) +
                                (isNaN(parseFloat(params.data.CDORemoteL2)) ? 0 : parseFloat(params.data.CDORemoteL2));
                            return 100 != value;
                        }
                    },
                },
            ]


            var columnDefsTest3 = [
                {
                    headerName: "Price & Cost", field: "SDLCStage", width: 150
                },
                {
                    headerName: 'Price',
                    children: [
                        {
                            headerName: "BU", field: "PriceBU", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.PriceBU);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }
                        },
                        {
                            headerName: "CDO", field: "PriceCDO", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.PriceCDO);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }
                        },
                    ]
                },
                {
                    headerName: 'FTE ',// + $scope.OpportunityDetail.UseManDayshours,
                    children: [
                        {
                            headerName: "BU L1", field: "FTEBUL1", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.FTEBUL1);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            },
                            cellStyle: { 'background-color': '#CDCDCD' },
                        },
                        {
                            headerName: "BU L2", field: "FTEBUL2", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.FTEBUL2);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }, cellStyle: { 'background-color': '#CDCDCD' },
                        },
                        {
                            headerName: "CDO L1", field: "FTECDOL1", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.FTECDOL1);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }, cellStyle: { 'background-color': '#CDCDCD' },
                        },
                        {
                            headerName: "CDO L2", field: "FTECDOL2", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.FTECDOL2);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }, cellStyle: { 'background-color': '#CDCDCD' },
                        },
                    ]
                },
                {
                    headerName: 'Cost',
                    children: [
                        {
                            headerName: "BU-L1", field: "CostBUL1", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.CostBUL1);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }
                        },
                        {
                            headerName: "BU-L2", field: "CostBUL2", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.CostBUL2);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }
                        },
                        {
                            headerName: "CDO-L1", field: "CostCDOL1", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.CostCDOL1);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }
                        },
                        {
                            headerName: "CDO-L2", field: "CostCDOL2", width: 80, cellRenderer: function (params) {
                                var number = parseFloat(params.data.CostCDOL2);
                                return '<span title=' + number + '>' + $filter('number')(number, 1) + '</span>';
                            }
                        },
                    ]
                }
            ]

            $scope.gridLOB.api.setColumnDefs(columnDefs);
            $scope.gridDay1.api.setColumnDefs(columnDefs);
            $scope.gridDay2.api.setColumnDefs(columnDefs);
            $scope.gridDay3.api.setColumnDefs(columnDefs1);
            $scope.gridDay4.api.setColumnDefs(columnDefs);

            columnDefsFTE[1].headerName = 'FTE ' + $scope.OpportunityDetail.UseManDayshours;
            columnDefsFTE[1].children[7].headerName = 'FTE ' + $scope.OpportunityDetail.UseManDayshours;
            columnDefsTest3[2].headerName = 'FTE ' + $scope.OpportunityDetail.UseManDayshours;
            $scope.gridFTEDays.api.setColumnDefs(columnDefsFTE);
            $scope.gridDistribution.api.setColumnDefs(columnDefsTest2);
            $scope.gridPriceCost.api.setColumnDefs(columnDefsTest3);
        }

        $scope.GetPriceSheetVersionsForOpp = function (oppid) {
            console.log('oppid, groupid' + oppid)
            priceService.GetPriceSheetVersionsForOpp(oppid).success(function (data) {
                $scope.Versiondata = data;
                _.each($scope.Versiondata, function (value, key) {
                    if (value["PriceSheetId"] == $scope.GlobalGroupId) {
                        if (value["DaySheetVersionJSON"] != '' && value["DaySheetVersionJSON"] != null && value["DaySheetVersionJSON"] != undefined && value["DaySheetVersionJSON"] != 'null')
                            $scope.GlobalVersionsave = JSON.parse(value["DaySheetVersionJSON"]);
                    }
                });
            }).error(function (error) {
                $scope.Error = error;
            })

        };

        function ReverseCalc() {
            $scope.DaySheetData = {};
            if ($scope.call1Api && $scope.call2Api && $scope.call3Api && $scope.call4Api && $scope.call5Api && $scope.call6Api && $scope.call7Api && $scope.call8Api && $scope.call9Api && $scope.call10Api && $scope.call11Api && $scope.call12Api && $scope.call13Api && $scope.call14Api && $scope.call15Api && $scope.call16Api)

                if ($scope.GlobalVersionsave.length > 0) {

                    //jay have to work
                    _.each($scope.options, function (value, key) {
                        if (value == "SELF_SERVICE") {
                            $scope.DaySheetData.SelfserviceId = dodeepdivepluck(value);
                        }
                        else if (value == "APPLICATIONS") {
                            $scope.DaySheetData.ApplicationsId = dodeepdivepluck(value);
                        }
                        else if (value == "ADMIN") {
                            $scope.DaySheetData.AdminId = dodeepdivepluck(value);
                        }
                        else if (value == "CISCO") {
                            $scope.DaySheetData.CiscoId = dodeepdivepluck(value);
                        }
                        else if (value == "ACQUEON") {
                            $scope.DaySheetData.AcqueonId = dodeepdivepluck(value);
                        }
                        else if (value == "SERVION_PRODUCTS") {
                            $scope.DaySheetData.ServProductsId = dodeepdivepluck(value);
                        }
                        else if (value == "Avaya") {
                            $scope.DaySheetData.AvayaId = dodeepdivepluck(value);
                        }
                        else if (value == "eGain") {
                            $scope.DaySheetData.EgainId = dodeepdivepluck(value);
                        }
                        else if (value == "WFO") {
                            $scope.DaySheetData.WFOId = dodeepdivepluck(value);
                        }
                        else if (value == "Others") {
                            $scope.DaySheetData.OthersId = dodeepdivepluck(value);
                        }
                    });
                    var data = dodeepdivepluck("MANUAL");
                    $scope.DaySheetData.ManualId = data;
                    // $scope.getdata();
                }
        }

        function dodeepdivepluck(value) {
            var res = _.pluck($scope.GlobalVersionsave, value);
            res = _.flatten(_.compact(res.some(function (d) { return d }) ?
                res.map(function (item) { return item || null; }) :
                null));
            return res;
        }

        $scope.GetDaySheetbyOppGroup = function (oppid, groupid) {


            DayService.GetDaySheetbyOppGroup(oppid, groupid).success(function (data) {
                $scope.DaysheetPMData = data;
                setgrid();
                //jay midd
                $scope.data = _.filter($scope.DaysheetPMData, function (someThing) {
                    return someThing.GridName == "EffortFromTool";
                });

                $scope.data1 = _.filter($scope.DaysheetPMData, function (someThing) {
                    return someThing.GridName == "EffortFromManual";
                });
                $scope.data2 = _.filter($scope.DaysheetPMData, function (someThing) {
                    return someThing.GridName == "ExtendedEffort";
                });
                $scope.data3 = _.filter($scope.DaysheetPMData, function (someThing) {
                    return someThing.GridName == "CalculatedEffort";
                });
                $scope.dataLOB = _.filter($scope.DaysheetPMData, function (someThing) {
                    return someThing.GridName == "EffortFromToolLOB";
                });

                $scope.gridLOB.api.setRowData($scope.dataLOB);
                $scope.gridDay1.api.setRowData($scope.data);
                $scope.gridDay2.api.setRowData($scope.data1);
                $scope.gridDay3.api.setRowData($scope.data2);
                $scope.gridDay4.api.setRowData($scope.data3);


                $scope.call12Api = true;
                ReverseCalc();

            }).error(function (error) {
                $scope.Error = error;
            })


            DayService.GetDaysheetFTEHoursbyOppGroup($scope.OppId, $scope.MaxGroupID).success(function (inputs) {
                if (inputs.length > 0) {
                    $scope.FixedFTEDaysJson = inputs;
                    $scope.gridFTEDays.api.setRowData($scope.FixedFTEDaysJson);
                }
            }).error(function (error) {
                $scope.Error = error;
            })

            DayService.GetDaysheetExtendedEffortbyOppGroup($scope.OppId, $scope.MaxGroupID).success(function (inputs) {
                if (inputs.length > 0) {
                    $scope.ExtendedEffortCycle = inputs[0];
                }
            }).error(function (error) {
                $scope.Error = error;
            })


            DayService.GetDaysheetResourceDistributionbyOppGroup($scope.OppId, $scope.MaxGroupID).success(function (inputs) {
                if (inputs.length > 0) {
                    $scope.FixedDistributionJson = inputs;
                    $scope.gridDistribution.api.setRowData($scope.FixedDistributionJson);
                }
            }).error(function (error) {
                $scope.Error = error;
            })


            DayService.GetDaysheetPriceCostbyOppGroup($scope.OppId, $scope.MaxGroupID).success(function (inputs) {
                if (inputs.length > 0) {
                    $scope.FixedPriceCostJson = inputs;
                    $scope.gridPriceCost.api.setRowData($scope.FixedPriceCostJson);
                }

            }).error(function (error) {
                $scope.Error = error;
            })


        };

        $scope.GetPriceSheetMappeddataByversion = function (oppid, groupid) {
            priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function (data) {
                //jay
                $scope.MaxVersion = data[0].Version;
                $scope.MaxSheetGroupID = data[0].PriceSheetId;
                //$scope.grideditable_PriceList = data[0].IsEditable;
                $scope.hasedit = data[0].IsEditable;
                $scope.call4finished = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetMaximumGroupPriceSheetId = function () {
            priceService.GetMaximumGroupPriceSheetId().success(function (data) {
                if (data[0].count == 'null') {
                    $scope.MaxSheetGroupIDForSaveAs = 1;
                }
                else {
                    $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
                }
                if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                    //block the application
                }
            }).error(function (error) {
                $scope.Error = error;
            })

        };

        function Editor(params) {
            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);

            var eInput = document.createElement('input');
            eInput.type = 'text';

            params.eGridCell.addEventListener('click', function () {
                eInput.value = eLabel.data;
                eCell.removeChild(eLabel);
                eInput.className = 'ag-cell-edit-input';
                eInput.style.width = (params.eGridCell.clientWidth - 10) + "px";
                eCell.appendChild(eInput);
                eInput.focus();
                editing = true;
            });


            eInput.addEventListener('keydown', function (event) {
                var key = event.which || event.keyCode;

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
                eLabel.data = newValue;
                params.data[params.colDef.field] = newValue;
                eCell.removeChild(eInput);
                eCell.appendChild(eLabel);

            };

            eInput.addEventListener("blur", blurListenerfn);

            return eCell;

        }

        $scope.onLoad = function () {
            setgrid();
            document.getElementById('overlay').style.display = 'none';
            //GetManualEstimationdata();
            DoAdditionalEstimationdata();
            Fillrightdata();
            if ($scope.TandEPSData.length > 0)
                getcalculatedEffortgriddata()
            FindProjectComplexity();
        }

        //-------------------------------------------------
        //Finding Project Complexity
        //-------------------------------------------------

        function FindProjectComplexity() {
            //debugger;
            DDTtotal = 0;
            IMPLPStotal = 0;
            ManualDDTtotal = 0;
            ManualIMPLPStotal = 0;

            ManualOtherStotal = 0;

            _.each($scope.data, function (value, key) {

                if (value['Description'] == 'SELF_SERVICE' || value['Description'] == 'APPLICATIONS' || value['Description'] == 'ADMIN' || value['Description'] == 'PACKAGE' || value['Description'] == 'REPORT')
                    DDTtotal += parseFloat(value['Total'] != '--' ? value['Total'] : 0);

                else if (value['Description'] == 'CISCO' || value['Description'] == 'SERVION_PRODUCTS' || value['Description'] == 'ACQUEON' || value['Description'] == 'Avaya' || value['Description'] == 'eGain' || value['Description'] == 'WFO') {
                    IMPLPStotal += parseFloat(value['Total'] != '--' ? value['Total'] : 0);
                }

            });

            _.each($scope.data1, function (value, key) {

                if (value['Description'] == 'SELF_SERVICE' || value['Description'] == 'APPLICATIONS' || value['Description'] == 'ADMIN' || value['Description'] == 'PACKAGE' || value['Description'] == 'REPORT')
                    ManualDDTtotal += parseFloat(value['Total'] != '--' ? value['Total'] : 0);
                else if (value['Description'] == 'CISCO' || value['Description'] == 'SERVION_PRODUCTS' || value['Description'] == 'ACQUEON' || value['Description'] == 'Avaya' || value['Description'] == 'eGain' || value['Description'] == 'WFO')
                    ManualIMPLPStotal += parseFloat(value['Total'] != '--' ? value['Total'] : 0);
                else if (value['Description'] == 'Others')
                    ManualOtherStotal += parseFloat(value['Total'] != '--' ? value['Total'] : 0);

            });
            if (DDTtotal == 0)
                $scope.DDTLEVEL = 'NONE';
            else if (DDTtotal <= 50)
                $scope.DDTLEVEL = '1';
            else if (DDTtotal > 50 && DDTtotal <= 250)
                $scope.DDTLEVEL = '2';
            else if (DDTtotal > 250)
                $scope.DDTLEVEL = '3';

            $scope.DDTLEVELval = (DDTtotal);

            if (IMPLPStotal == 0)
                $scope.IMPLLEVEL = 'NONE';
            else if (IMPLPStotal <= 50)
                $scope.IMPLLEVEL = '1';
            else if (IMPLPStotal > 50 && IMPLPStotal <= 250)
                $scope.IMPLLEVEL = '2';
            else if (IMPLPStotal > 250)
                $scope.IMPLLEVEL = '3';

            $scope.IMPLLEVELval = (IMPLPStotal);

            if (ManualDDTtotal == 0)
                $scope.MDDTLEVEL = 'NONE';
            else if (ManualDDTtotal <= 50)
                $scope.MDDTLEVEL = '1';
            else if (ManualDDTtotal > 50 && ManualDDTtotal <= 250)
                $scope.MDDTLEVEL = '2';
            else if (ManualDDTtotal > 250)
                $scope.MDDTLEVEL = '3';

            $scope.MDDTLEVELval = (ManualDDTtotal);

            if (ManualIMPLPStotal == 0)
                $scope.MIMPLLEVEL = 'NONE';
            else if (ManualIMPLPStotal <= 50)
                $scope.MIMPLLEVEL = '1';
            else if (ManualIMPLPStotal > 50 && ManualIMPLPStotal <= 250)
                $scope.MIMPLLEVEL = '2';
            else if (ManualIMPLPStotal > 250)
                $scope.MIMPLLEVEL = '3';
            $scope.MIMPLLEVELval = (ManualIMPLPStotal);

            if (ManualOtherStotal > 0)
                $scope.MOtherLEVEL = 'Yes';
            else
                $scope.MOtherLEVEL = 'No';
            $scope.MOtherLEVELval = (ManualOtherStotal);

            var Reduction = sum(_.pluck($scope.FixedFTEDaysJson, "Daychange"));
            if (Reduction < 0)
                $scope.ReductionMsg = 'Yes';
            else
                $scope.ReductionMsg = 'No';


            var avg = 0;
            var summ = 0;
            if (!isNaN($scope.MIMPLLEVEL)) {
                avg++;
                summ += parseFloat($scope.MIMPLLEVEL, 10);
            }
            if (!isNaN($scope.MDDTLEVEL)) {
                avg++;
                summ += parseFloat($scope.MDDTLEVEL, 10);
            }
            if (!isNaN($scope.IMPLLEVEL)) {
                avg++;
                summ += parseFloat($scope.IMPLLEVEL, 10);
            }
            if (!isNaN($scope.DDTLEVEL)) {
                avg++;
                summ += parseFloat($scope.DDTLEVEL, 10);
            }


            var sumavg = summ / avg;


            if ($scope.ReductionMsg == "YES")
                $scope.ComplexType = "Complex";
            else if ($scope.MOtherLEVEL == "Yes" && $scope.MIMPLLEVEL == "NONE" && $scope.MDDTLEVEL == "NONE" && $scope.IMPLLEVEL == "NONE" && $scope.DDTLEVEL == "NONE")
                $scope.ComplexType = "Complex";
            else if ($scope.MOtherLEVEL == "Yes" && sumavg < 2)
                $scope.ComplexType = "Medium";
            else if ($scope.MOtherLEVEL == "Yes" && sumavg >= 2)
                $scope.ComplexType = "Complex";
            else if ($scope.MOtherLEVEL == "No" && sumavg >= 1.25)
                $scope.ComplexType = "Simple";
            else if ($scope.MOtherLEVEL == "No" && sumavg < 1.25)
                $scope.ComplexType = "Simple";
            else if ($scope.MOtherLEVEL == "No" && sumavg >= 1.25 && sumavg < 2.25)
                $scope.ComplexType = "Medium";
            else if ($scope.MOtherLEVEL == "No" && sumavg >= 2.25)
                $scope.ComplexType = "Complex";
            else if ($scope.MOtherLEVEL == "No" && $scope.MIMPLLEVEL == "NONE" && $scope.MDDTLEVEL == "NONE" && $scope.IMPLLEVEL == "NONE" && $scope.DDTLEVEL == "NONE")
                $scope.ComplexType = "NONE"
            else
                $scope.ComplexType = "ERROR"



            //deciding OEM strategy



            //  debugger
            var OEMStrategy = '';
            var OEMCiscoTotalvalue = 0;
            var OEMAvayaTotalvalue = 0;
            var OEMOtherTotalvalue = 0;
            var OEMOAppsvalue = 0;

            var Ciscoupg = 0;
            var Avayaupg = 0;
            var Servproductupg = 0;
            var Egainupg = 0;
            var Wfoupg = 0;
            var Acqupg = 0;



            if ($scope.ManualEstimationdata != null && $scope.ManualEstimationdata.length > 0) {

                var byDescription = _.chain($scope.ManualEstimationdata)
                    .map(function (item) {
                        return { Description: item.Description, Total: item.Total };
                    })
                    .groupBy('Description')
                    .map(function (value, key) {
                        var reduceVal = _.reduce(value, function (acc, val) {
                            return acc + val.Total;
                        }, 0);
                        return { 'Description': key, 'Total': reduceVal };
                    })
                    .value();


                var resultciscoManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "Cisco";
                });

                if (resultciscoManual.length > 0) {
                    OEMCiscoTotalvalue += resultciscoManual[0].Total;
                }

                var resultcisco = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "CISCO";
                });



                if (resultcisco.length > 0) {
                    _.each(resultcisco[0].TotalRow, function (value, key) {
                        OEMCiscoTotalvalue += parseFloat(value.A1Fcol1) + parseFloat(value.A1Fcol2) + parseFloat(value.A1Fcol3);
                        Ciscoupg = + parseFloat(value.A1Fcol3);

                    });
                }

                var resultAvaya = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "Avaya";
                });

                if (resultAvaya.length > 0) {
                    _.each(resultAvaya[0].TotalRow, function (value, key) {
                        OEMAvayaTotalvalue += parseFloat(value.A1Fcol1) + parseFloat(value.A1Fcol2) + parseFloat(value.A1Fcol3);
                        Avayaupg = + parseFloat(value.A1Fcol3);
                    });
                }

                var resultavayaManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "Avaya";
                });

                if (resultavayaManual.length > 0) {
                    OEMAvayaTotalvalue += resultavayaManual[0].Total;
                }

                var resultServProduct = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "SERVION_PRODUCTS";
                });


                if (resultServProduct.length > 0) {
                    _.each(resultServProduct[0].TotalRow, function (value, key) {
                        OEMOtherTotalvalue += parseFloat(value.A1Fcol1) + parseFloat(value.A1Fcol2) + parseFloat(value.A1Fcol3);
                        Servproductupg = + parseFloat(value.A1Fcol3);
                    });
                }

                var resultServProductManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "Servion Products";
                });

                if (resultServProductManual.length > 0) {
                    OEMOtherTotalvalue += resultServProductManual[0].Total;
                }


                var resultAcq = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "ACQUEON";
                });

                if (resultAcq.length > 0) {
                    _.each(resultAcq[0].TotalRow, function (value, key) {
                        OEMOtherTotalvalue += parseFloat(value.A1Fcol1) + parseFloat(value.A1Fcol2) + parseFloat(value.A1Fcol3);
                        Acqupg = + parseFloat(value.A1Fcol3);
                    });
                }

                var resultAcqManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "Acqueon";
                });

                if (resultAcqManual.length > 0) {
                    OEMOtherTotalvalue += resultAcqManual[0].Total;
                }



                var resultEgain = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "eGain";
                });

                if (resultEgain.length > 0) {
                    _.each(resultEgain[0].TotalRow, function (value, key) {
                        OEMOtherTotalvalue += parseFloat(value.A1Fcol1) + parseFloat(value.A1Fcol2) + parseFloat(value.A1Fcol3);
                        Egainupg = + parseFloat(value.A1Fcol3);
                    });
                }

                var resultEgainManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "Egain";
                });

                if (resultEgainManual.length > 0) {
                    OEMOtherTotalvalue += resultEgainManual[0].Total;
                }

                var resultWFO = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "WFO";
                });

                if (resultWFO.length > 0) {
                    _.each(resultWFO[0].TotalRow, function (value, key) {
                        OEMOtherTotalvalue += parseFloat(value.A1Fcol1) + parseFloat(value.A1Fcol2) + parseFloat(value.A1Fcol3);
                        Wfoupg = + parseFloat(value.A1Fcol3);
                    });
                }


                var resultWFOManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "WFO";
                });

                if (resultWFOManual.length > 0) {
                    OEMOtherTotalvalue += resultWFOManual[0].Total;
                }


                var resultOther = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "Others";
                });

                if (resultOther.length > 0) {
                    _.each(resultOther[0].TotalRow, function (value, key) {
                        OEMOtherTotalvalue += parseFloat(value.A1Fcol3);
                    });
                }
                var resultOthersManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "OthersWFO";
                });

                if (resultOthersManual.length > 0) {
                    OEMOAppsvalue += resultOthersManual[0].Total;
                }


                var resultself = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "SELF_SERVICE";
                });

                if (resultself.length > 0) {
                    _.each(resultself[0].TotalRow, function (value, key) {
                        OEMOAppsvalue += parseFloat(value.A1Fcol3);
                    });
                }

                var resultApp = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "APPLICATIONS";
                });

                if (resultApp.length > 0) {
                    _.each(resultApp[0].TotalRow, function (value, key) {
                        OEMOAppsvalue += parseFloat(value.A1Fcol3);
                    });
                }

                var resultPack = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "PACKAGE";
                });

                if (resultPack.length > 0) {
                    _.each(resultPack[0].TotalRow, function (value, key) {
                        OEMOAppsvalue += parseFloat(value.A1Fcol3);
                    });
                }

                var resultAdmin = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "ADMIN";
                });

                if (resultAdmin.length > 0) {
                    _.each(resultAdmin[0].TotalRow, function (value, key) {
                        OEMOAppsvalue += parseFloat(value.A1Fcol3);
                    });
                }

                var resultReport = _.filter($scope.TotalSection, function (someThing) {
                    return someThing.ProductName == "REPORT";
                });

                if (resultReport.length > 0) {
                    _.each(resultReport[0].TotalRow, function (value, key) {
                        OEMOAppsvalue += parseFloat(value.A1Fcol3);
                    });
                }


                var resultSSManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "Self Service";
                });

                if (resultSSManual.length > 0) {
                    OEMOAppsvalue += resultSSManual[0].Total;
                }

                var resultCustomManual = _.filter(byDescription, function (someThing) {
                    return someThing.Description == "Custom PS";
                });

                if (resultCustomManual.length > 0) {
                    OEMOAppsvalue += resultCustomManual[0].Total;
                }

            }

            if (OEMCiscoTotalvalue > 0)
                OEMStrategy = 'Cisco'
            else if (OEMAvayaTotalvalue > 0)
                OEMStrategy = 'Avaya'
            else if (OEMOtherTotalvalue > 0)
                OEMStrategy = 'Other'
            else
                OEMStrategy = 'None'

            var Apps = 'N';
            if (OEMOAppsvalue > 0)
                Apps = 'Y'

            var OnlyUpgrade = 'N';
            if (Ciscoupg > 0 && (OEMCiscoTotalvalue - Ciscoupg) == 0 && Avayaupg > 0 && (OEMAvayaTotalvalue - Avayaupg) == 0)
                OnlyUpgrade = 'Y';
            else if (OEMCiscoTotalvalue == 0 && OEMAvayaTotalvalue == 0 && (Avayaupg + Ciscoupg + Servproductupg + Acqupg + Wfoupg + Egainupg) > 0)
                OnlyUpgrade = 'Y';

            $scope.ComplexType = " sbu  " + $scope.OpportunityDetail.SBUId + ' Region ' + $scope.OpportunityDetail.CountryId + ' use OEM pricing Strategy ' + $scope.OpportunityDetail.UseOEMPricingStrategy + ' ' + OEMStrategy + ' ' + Apps + ' ' + OnlyUpgrade + ' ' + $scope.ComplexType
            //$scope.ManualEstimationdata
            console.log($scope.OpportunityDetail.SBUId + ' ' + $scope.OpportunityDetail.CountryId + ' ' + $scope.OpportunityDetail.UseOEMPricingStrategy + ' ' + OEMStrategy + ' ' + Apps + ' ' + OnlyUpgrade + ' ' + $scope.ComplexType)
            $scope.GetResourceAllocation($scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId, $scope.OpportunityDetail.UseOEMPricingStrategy, OEMStrategy, Apps, OnlyUpgrade, $scope.ComplexType);

        }

        //-------------------------------------------------
        //Finding Project Complexity
        //-------------------------------------------------

        $scope.GetResourceAllocation = function (SBU, Region, OEM, Infra, App, Upgrade, complexity) {

            EstimationSDLCResourceService.GetAllEstimationSDLCResourcebyFilter(SBU, Region, OEM, Infra, App, Upgrade, complexity).success(function (data) {

                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {

                    if (data.length > 0) {
                        var ReqData = data[0].REQ.split(',')
                        $scope.FixedDistributionJson[0] = {
                            SDLCStage: 'Requirements Gathering', BUOnsiteL1: ReqData[0], BUOnsiteL2: ReqData[1], BURemoteL1: ReqData[2], BURemoteL2: ReqData[3], CDOOnsiteL1: ReqData[4], CDOOnsiteL2: ReqData[5], CDORemoteL1: ReqData[6], CDORemoteL2: ReqData[7]
                            //, Total: parseFloat(ReqData[0]) + parseFloat(ReqData[1]) + parseFloat(ReqData[2]) + parseFloat(ReqData[3]) + parseFloat(ReqData[4]) + parseFloat(ReqData[5]) + parseFloat(ReqData[6]) + parseFloat(ReqData[7])
                        };
                        var designData = data[0].Design.split(',');
                        $scope.FixedDistributionJson[1] = {
                            SDLCStage: 'Design', BUOnsiteL1: designData[0], BUOnsiteL2: designData[1], BURemoteL1: designData[2], BURemoteL2: designData[3], CDOOnsiteL1: designData[4], CDOOnsiteL2: designData[5], CDORemoteL1: designData[6], CDORemoteL2: designData[7]
                            //, Total: parseFloat(designData[0]) + parseFloat(designData[1]) + parseFloat(designData[2]) + parseFloat(designData[3]) + parseFloat(designData[4]) + parseFloat(designData[5]) + parseFloat(designData[6]) + parseFloat(designData[7])
                        };
                        var devtest = data[0].DevTest.split(',');
                        $scope.FixedDistributionJson[2] = {
                            SDLCStage: 'Development & Test', BUOnsiteL1: devtest[0], BUOnsiteL2: devtest[1], BURemoteL1: devtest[2], BURemoteL2: devtest[3], CDOOnsiteL1: devtest[4], CDOOnsiteL2: devtest[5], CDORemoteL1: devtest[6], CDORemoteL2: devtest[7]
                            //, Total: parseFloat(devtest[0]) + parseFloat(devtest[1]) + parseFloat(devtest[2]) + parseFloat(devtest[3]) + parseFloat(devtest[4]) + parseFloat(devtest[5]) + parseFloat(devtest[6]) + parseFloat(devtest[7])
                        };
                        var systest = data[0].SysTest.split(',');
                        $scope.FixedDistributionJson[3] = {
                            SDLCStage: 'System Testing', BUOnsiteL1: systest[0], BUOnsiteL2: systest[1], BURemoteL1: systest[2], BURemoteL2: systest[3], CDOOnsiteL1: systest[4], CDOOnsiteL2: systest[5], CDORemoteL1: systest[6], CDORemoteL2: systest[7]
                            // , Total: parseFloat(systest[0]) + parseFloat(systest[1]) + parseFloat(systest[2]) + parseFloat(systest[3]) + parseFloat(systest[4]) + parseFloat(systest[5]) + parseFloat(systest[6]) + parseFloat(systest[7])
                        };
                        var impl = data[0].IMPL.split(',');
                        $scope.FixedDistributionJson[4] = {
                            SDLCStage: 'Implementation', BUOnsiteL1: impl[0], BUOnsiteL2: impl[1], BURemoteL1: impl[2], BURemoteL2: impl[3], CDOOnsiteL1: impl[4], CDOOnsiteL2: impl[5], CDORemoteL1: impl[6], CDORemoteL2: impl[7]
                            //, Total: parseFloat(impl[0]) + parseFloat(impl[1]) + parseFloat(impl[2]) + parseFloat(impl[3]) + parseFloat(impl[4]) + parseFloat(impl[5]) + parseFloat(impl[6]) + parseFloat(impl[7])
                        };
                        var uat = data[0].UAT.split(',');
                        $scope.FixedDistributionJson[5] = {
                            SDLCStage: 'UAT', BUOnsiteL1: uat[0], BUOnsiteL2: uat[1], BURemoteL1: uat[2], BURemoteL2: uat[3], CDOOnsiteL1: uat[4], CDOOnsiteL2: uat[5], CDORemoteL1: uat[6], CDORemoteL2: uat[7]
                            //, Total: parseFloat(uat[0]) + parseFloat(uat[1]) + parseFloat(uat[2]) + parseFloat(uat[3]) + parseFloat(uat[4]) + parseFloat(uat[5]) + parseFloat(uat[6]) + parseFloat(uat[7])
                        };
                        var prod = data[0].PROD.split(',');
                        $scope.FixedDistributionJson[6] = {
                            SDLCStage: 'Production Support / Cutover', BUOnsiteL1: prod[0], BUOnsiteL2: prod[1], BURemoteL1: prod[2], BURemoteL2: prod[3], CDOOnsiteL1: prod[4], CDOOnsiteL2: prod[5], CDORemoteL1: prod[6], CDORemoteL2: prod[7]
                            //, Total: parseFloat(prod[0]) + parseFloat(prod[1]) + parseFloat(prod[2]) + parseFloat(prod[3]) + parseFloat(prod[4]) + parseFloat(prod[5]) + parseFloat(prod[6]) + parseFloat(prod[7])
                        };
                        var train = data[0].Train.split(',');
                        $scope.FixedDistributionJson[7] = {
                            SDLCStage: 'Training', BUOnsiteL1: train[0], BUOnsiteL2: train[1], BURemoteL1: train[2], BURemoteL2: train[3], CDOOnsiteL1: train[4], CDOOnsiteL2: train[5], CDORemoteL1: train[6], CDORemoteL2: train[7]
                            //, Total: parseFloat(train[0]) + parseFloat(train[1]) + parseFloat(train[2]) + parseFloat(train[3]) + parseFloat(train[4]) + parseFloat(train[5]) + parseFloat(train[6]) + parseFloat(train[7])
                        };
                        var manual = data[0].Manual.split(',');
                        $scope.FixedDistributionJson[8] = {
                            SDLCStage: 'Manuals', BUOnsiteL1: manual[0], BUOnsiteL2: manual[1], BURemoteL1: manual[2], BURemoteL2: manual[3], CDOOnsiteL1: manual[4], CDOOnsiteL2: manual[5], CDORemoteL1: manual[6], CDORemoteL2: manual[7]
                            //, Total: parseFloat(manual[0]) + parseFloat(manual[1]) + parseFloat(manual[2]) + parseFloat(manual[3]) + parseFloat(manual[4]) + parseFloat(manual[5]) + parseFloat(manual[6]) + parseFloat(manual[7])
                        };
                        var oh = data[0].OH.split(',');
                        $scope.FixedDistributionJson[9] = {
                            SDLCStage: 'Orientation & Handover', BUOnsiteL1: oh[0], BUOnsiteL2: oh[1], BURemoteL1: oh[2], BURemoteL2: oh[3], CDOOnsiteL1: oh[4], CDOOnsiteL2: oh[5], CDORemoteL1: oh[6], CDORemoteL2: oh[7]
                            //, Total: '0' //, Total: parseFloat(oh[0]) + parseFloat(oh[1]) + parseFloat(oh[2]) + parseFloat(oh[3]) + parseFloat(oh[4]) + parseFloat(oh[5]) + parseFloat(oh[6]) + parseFloat(oh[7])
                        };
                        var sqa = data[0].SQA.split(',');
                        $scope.FixedDistributionJson[10] = {
                            SDLCStage: 'SQA', BUOnsiteL1: sqa[0], BUOnsiteL2: sqa[1], BURemoteL1: sqa[2], BURemoteL2: sqa[3], CDOOnsiteL1: sqa[4], CDOOnsiteL2: sqa[5], CDORemoteL1: sqa[6], CDORemoteL2: sqa[7]
                            //, Total: parseFloat(sqa[0]) + parseFloat(sqa[1]) + parseFloat(sqa[2]) + parseFloat(sqa[3]) + parseFloat(sqa[4]) + parseFloat(sqa[5]) + parseFloat(sqa[6]) + parseFloat(sqa[7])
                        };
                        var pm = data[0].PM.split(',');
                        $scope.FixedDistributionJson[11] = {
                            SDLCStage: 'Project Management', BUOnsiteL1: pm[0], BUOnsiteL2: pm[1], BURemoteL1: pm[2], BURemoteL2: pm[3], CDOOnsiteL1: pm[4], CDOOnsiteL2: pm[5], CDORemoteL1: pm[6], CDORemoteL2: pm[7]
                            //, Total: parseFloat(pm[0]) + parseFloat(pm[1]) + parseFloat(pm[2]) + parseFloat(pm[3]) + parseFloat(pm[4]) + parseFloat(pm[5]) + parseFloat(pm[6]) + parseFloat(pm[7])
                        };
                        // var ce = data[0].CE.split(','); NOT Required
                        // $scope.FixedDistributionJson[12] = {
                        //     SDLCStage: 'Calculated Efforts', BUOnsiteL1: ce[0], BUOnsiteL2: ce[1], BURemoteL1: ce[2], BURemoteL2: ce[3], CDOOnsiteL1: ce[4], CDOOnsiteL2: ce[5], CDORemoteL1: ce[6], CDORemoteL2: ce[7]
                        //     //, Total: parseFloat(ce[0]) + parseFloat(ce[1]) + parseFloat(ce[2]) + parseFloat(ce[3]) + parseFloat(ce[4]) + parseFloat(ce[5]) + parseFloat(ce[6]) + parseFloat(ce[7])
                        // };

                        $scope.gridDistribution.api.setRowData($scope.FixedDistributionJson);
                    }

                    setcalculatedeffortsonly();
                    Fouthtabaction();

                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured!", null);
            });
        }


        function getselectedversionsSinglecolvalues(groupId) {

            var result1 = _.filter($scope.CompleteResultsetSingle, function (someThing) {
                return someThing.GroupId == groupId && someThing.Section != "Total";
            });

            return result1;
        }

        function getselectedversionsMulticolvalues(groupId) {

            var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                return someThing.GroupId == groupId && someThing.Section != "Total";
            });

            return result1;
        }

        function getselectedversionsSinglecolvaluesTotalSectionForAdminReportDifferentPackage(groupId, area) {

            var result1 = _.filter($scope.CompleteResultsetSingle, function (someThing) {
                return someThing.GroupId == groupId && someThing.Section != "Total" && someThing.Section == area;
            });

            return result1;
        }

        function getselectedversionsSinglecolvaluesTotalSectionForAdminReportDifferent(groupId, area) {

            var result1 = _.filter($scope.CompleteResultsetSingle, function (someThing) {
                return someThing.GroupId == groupId && someThing.Section != "Total" && someThing.Section != "ADMIN" && someThing.Section != "PACKAGE";
            });

            return result1;
        }

        function getselectedversionsSinglecolvaluesTotalSection(groupId) {

            var result1 = _.filter($scope.CompleteResultsetSingle, function (someThing) {
                return someThing.GroupId == groupId && someThing.Section == "Total";
            });

            return result1;
        }

        function getselectedversionsMulticolvaluesTotalSection(groupId) {

            var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                return someThing.GroupId == groupId && someThing.Section == "Total";
            });

            return result1;
        }

        function FillrightdataforLOB() {
            //debugger;
            $scope.TotalRows = [];
            $scope.ISLOB = true;
            var singleresultrow = [];

            $scope.CompleteResultset = [];
            //debugger;

            if ($scope.DaySheetData.SelfserviceId != null && parseInt($scope.DaySheetData.SelfserviceId.length) > 0) {
                // var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.SelfserviceId.length; i++) {
                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.SelfserviceId[i]);

                    var resultapp = _.filter($scope.SelfVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.SelfserviceId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'SELF_SERVICE' }

                    var currentdata = dointernalpercentagecalculation(model);
                    // var result1 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });
                    var SelfServiceRow = doeachcalcultaion(currentdata, 'SELF_SERVICE');
                    SelfServiceRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(SelfServiceRow);
                }


            }
            if ($scope.DaySheetData.ApplicationsId != null && parseInt($scope.DaySheetData.ApplicationsId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.ApplicationsId.length; i++) {

                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.ApplicationsId[i]);
                    var resultapp = _.filter($scope.AppVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.ApplicationsId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'APPLICATIONS' }
                    var currentdata = dointernalpercentagecalculation(model);
                    // var result2 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    var ApplicationRow = doeachcalcultaion(currentdata, 'APPLICATIONS');
                    ApplicationRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(ApplicationRow)
                }



            }

            if ($scope.DaySheetData.AdminId != null && parseInt($scope.DaySheetData.AdminId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.AdminId.length; i++) {

                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.AdminId[i]);
                    var resultapp = _.filter($scope.AdminVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.AdminId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'REPORT' }
                    var currentdata = dointernalpercentagecalculationForAdminReport(model);

                    var result3 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'ADMIN';
                    });

                    var AdminRow = doeachcalcultaion(result3, 'ADMIN');
                    AdminRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(AdminRow);
                    var result4 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'PACKAGE';
                    });
                    var AdminRow1 = doeachcalcultaion(result4, 'PACKAGE');
                    AdminRow1.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(AdminRow1);

                    var result5 = _.filter(currentdata, function (someThing) {
                        return someThing.Section != 'ADMIN' && someThing.Section != 'PACKAGE' && someThing.Section != 'Total';
                    });

                    var AdminRow2 = doeachcalcultaion(result5, 'REPORT');
                    AdminRow2.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(AdminRow2);
                }

            }


            if ($scope.DaySheetData.CiscoId != null && parseInt($scope.DaySheetData.CiscoId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.CiscoId.length; i++) {

                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.CiscoId[i]);
                    var resultapp = _.filter($scope.CSVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.CiscoId[i];
                    });

                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'CISCO' }
                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    var result4 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'Total';
                    });


                    var CiscoRow = doeachcalcultaion(result4, 'CISCO');
                    CiscoRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(CiscoRow);


                    var result4 = _.filter(currentdata, function (someThing) {
                        return someThing.Section != "Total";
                    })

                    var reducedArray = _.chain(result4).map(function (item) { return item.Section }).uniq().value();

                    for (var j = 0; j < reducedArray.length; j++) {

                        var result3 = _.filter(result4, function (someThing) {
                            return someThing.Section == reducedArray[j];
                        })


                        var CiscoRow = doeachcalcultaionForLOB(result3, 'CISCO', reducedArray[j]);
                        CiscoRow.Description += " - " + resultapp[0].Version;
                        singleresultrow.push(CiscoRow);

                    }
                }

            }

            if ($scope.DaySheetData.ServProductsId != null && parseInt($scope.DaySheetData.ServProductsId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.ServProductsId.length; i++) {
                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.ServProductsId[i]);

                    var resultapp = _.filter($scope.ServPoductVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.ServProductsId[i];
                    });


                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'SERVION_PRODUCTS' }
                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    var result5 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'Total';
                    });

                    var ServionProductsRow = doeachcalcultaion(result5, 'SERVION_PRODUCTS');
                    ServionProductsRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(ServionProductsRow);

                    var result5 = _.filter(currentdata, function (someThing) {
                        return someThing.Section != 'Total';
                    })

                    var reducedArray = _.chain(result5).map(function (item) { return item.Section }).uniq().value();

                    for (var j = 0; j < reducedArray.length; j++) {

                        var result3 = _.filter(result5, function (someThing) {
                            return someThing.Section == reducedArray[j];
                        })

                        var ServionProductsRow = doeachcalcultaionForLOB(result3, 'SERVION_PRODUCTS', reducedArray[j]);
                        ServionProductsRow.Description += " - " + resultapp[0].Version;
                        singleresultrow.push(ServionProductsRow);
                    }
                }
            }

            if ($scope.DaySheetData.AvayaId != null && parseInt($scope.DaySheetData.AvayaId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.AvayaId.length; i++) {

                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.AvayaId[i]);
                    var resultapp = _.filter($scope.AVVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.AvayaId[i];
                    });


                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'Avaya' }
                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    var result6 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'Total';
                    });

                    var AvayaRow = doeachcalcultaion(result6, 'Avaya');
                    AvayaRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(AvayaRow);

                    var result6 = _.filter(currentdata, function (someThing) {
                        return someThing.Section != 'Total';
                    })

                    var reducedArray = _.chain(result6).map(function (item) { return item.Section }).uniq().value();

                    for (var j = 0; j < reducedArray.length; j++) {

                        var result3 = _.filter(result6, function (someThing) {
                            return someThing.Section == reducedArray[j];
                        })


                        var AvayaRow = doeachcalcultaionForLOB(result3, 'Avaya', reducedArray[j]);
                        AvayaRow.Description += " - " + resultapp[0].Version;
                        singleresultrow.push(AvayaRow);
                    }
                }

            }
            if ($scope.DaySheetData.EgainId != null && parseInt($scope.DaySheetData.EgainId.length) > 0) {
                var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.EgainId.length; i++) {

                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.EgainId[i]);

                    var resultapp = _.filter($scope.EGVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.EgainId[i];
                    });

                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'eGain' }
                    var currentdata = dointernalpercentagecalculationForEgainGroup(model);
                    var result7 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'Total';
                    });

                    var EgainRow = doeachcalcultaion(result7, 'eGain');
                    EgainRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(EgainRow);


                    var result7 = _.filter(currentdata, function (someThing) {
                        return someThing.Section != 'Total';
                    })
                    var reducedArray = _.chain(result7).map(function (item) { return item.Section }).uniq().value();

                    for (var j = 0; j < reducedArray.length; j++) {

                        var result3 = _.filter(result7, function (someThing) {
                            return someThing.Section == reducedArray[j];
                        })

                        var EgainRow = doeachcalcultaionForLOB(result3, 'eGain', reducedArray[j]);
                        EgainRow.Description += " - " + resultapp[0].Version;
                        singleresultrow.push(EgainRow);
                    }

                }
            }

            if ($scope.DaySheetData.WFOId != null && parseInt($scope.DaySheetData.WFOId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.WFOId.length; i++) {
                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.WFOId[i]);

                    var resultapp = _.filter($scope.WFVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.WFOId[i];
                    });

                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'WFO' }
                    var currentdata = dointernalpercentagecalculationForEgainGroup(model);
                    var result8 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'Total';
                    });

                    var WFORow = doeachcalcultaion(result8, 'WFO');
                    WFORow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(WFORow);


                    var result8 = _.filter(currentdata, function (someThing) {
                        return someThing.Section != 'Total';
                    })
                    var reducedArray = _.chain(result8).map(function (item) { return item.Section }).uniq().value();

                    for (var j = 0; j < reducedArray.length; j++) {

                        var result3 = _.filter(result8, function (someThing) {
                            return someThing.Section == reducedArray[j];
                        })
                        var WFORow = doeachcalcultaionForLOB(result3, 'WFO', reducedArray[j]);
                        WFORow.Description += " - " + resultapp[0].Version;
                        singleresultrow.push(WFORow);
                    }
                }

            }

            if ($scope.DaySheetData.OthersId != null && parseInt($scope.DaySheetData.OthersId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.OthersId.length; i++) {

                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.OthersId[i]);
                    var resultapp = _.filter($scope.OtherVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.OthersId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'Others' }
                    var currentdata = dointernalpercentagecalculationForOther(model);
                    // var result9 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    var OthersRow = doeachcalcultaion(currentdata, 'Others');
                    OthersRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(OthersRow);
                }
            }

            if ($scope.DaySheetData.AcqueonId != null && parseInt($scope.DaySheetData.AcqueonId.length) > 0) {

                for (var i = 0; i < $scope.DaySheetData.AcqueonId.length; i++) {
                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.AcqueonId[i]);
                    var resultapp = _.filter($scope.ACQVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.AcqueonId[i];
                    });

                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'ACQUEON' }

                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    var result10 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'Total';
                    });
                    var AcqueonRow = doeachcalcultaion(result10, 'ACQUEON');
                    AcqueonRow.Description += " - " + resultapp[0].Version;
                    singleresultrow.push(AcqueonRow);

                    var result10 = _.filter(currentdata, function (someThing) {
                        return someThing.Section != 'Total';
                    })

                    var reducedArray = _.chain(result10).map(function (item) { return item.Section }).uniq().value();

                    for (var j = 0; j < reducedArray.length; j++) {

                        var result3 = _.filter(result10, function (someThing) {
                            return someThing.Section == reducedArray[j];
                        })

                        var AcqueonRow = doeachcalcultaionForLOB(result3, 'ACQUEON', reducedArray[j]);
                        AcqueonRow.Description += " - " + resultapp[0].Version;
                        singleresultrow.push(AcqueonRow);
                    }

                }
            }

            $scope.dataLOB = singleresultrow;
            for (var i = 0; i < $scope.dataLOB.length; i++) {
                $scope.dataLOB[i].GridName = 'EffortFromToolLOB';
            }


            $scope.gridLOB.api.setRowData($scope.dataLOB);
        }

        function doeachcalcultaionForLOB(result, area, Section) {

            var internalcalc = {
                Description: Section, REQ: 0, Design: 0, DevTest: 0, SysTest: 0, IMPL: 0, UAT: 0, PROD: 0,
                TRAIN: 0, MANUAL: 0, OH: 0, SQA: 0, PM: 0, Product: area, Total: 0
            }

            internalcalc.DevTest = 0;
            internalcalc.MANUAL = 0;



            _.each(result, function (value, key) {

                if (value.SDLC_Type == 'Requirements_Gathering' || value.SDLC_Type == 'Requirements')
                    internalcalc.REQ += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Design' || value.SDLC_Type == 'Design_Document')
                    internalcalc.Design += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Develop_Test')
                    internalcalc.DevTest += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'System_Testing' || value.SDLC_Type == 'Test_Cases' || value.SDLC_Type == 'Test_Plan')
                    internalcalc.SysTest += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Implementation_Testing')
                    internalcalc.IMPL += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'UAT')
                    internalcalc.UAT += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Production_Support')
                    internalcalc.PROD += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Training')
                    internalcalc.TRAIN += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Manuals')
                    internalcalc.MANUAL += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Orientation_Handover')
                    internalcalc.OH += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'QA_CM')
                    internalcalc.SQA += parseFloat(value.ResultProdPercentage);


                if (area == "CISCO") {

                    if (value.SDLC_Type == 'CRD' || value.SDLC_Type == 'SRD' || value.SDLC_Type == 'RD_SRD') {
                        internalcalc.REQ += parseFloat(value.ResultProdPercentage);
                        internalcalc.REQ += parseFloat(value.ResultUatPercentage);
                    }

                    else if (value.SDLC_Type == 'NRFU') {
                        internalcalc.SysTest += parseFloat(value.ResultProdPercentage);
                        internalcalc.SysTest += parseFloat(value.ResultUatPercentage);
                    }
                    else if (value.SDLC_Type == 'NRFU') {
                        internalcalc.IMPL += parseFloat(value.ResultProdPercentage);
                        internalcalc.IMPL += parseFloat(value.ResultUatPercentage);
                    }
                    else if (value.SDLC_Type == 'UAT') {
                        internalcalc.UAT += parseFloat(value.ResultProdPercentage);
                        internalcalc.UAT += parseFloat(value.ResultUatPercentage);
                    }
                }
            })


            if (area == "ACQUEON") {


                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == Section && someThing.ProductName == 'ACQUEON';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }
            else if (area == "SERVION_PRODUCTS") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == Section && someThing.ProductName == 'SERVION_PRODUCTS';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            else if (area == "Avaya") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == Section && someThing.ProductName == 'Avaya';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            if (area == "eGain") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == Section && someThing.ProductName == 'eGain';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            else if (area == "WFO") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == Section && someThing.ProductName == 'WFO';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            else if (area == "CISCO") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == Section && someThing.ProductName == 'CISCO';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }


            return internalcalc;
        }


        function GetManualEstimationdata() {

            var data = $scope.ManualEstimationdata;

            for (var i = 0; i < data.length; i++) {
                // if (data[i].PM == null || data[i].PM == undefined || data[i].PM == '')
                //     data[i].PM = 0;

                data[i].Total = (isNaN(parseFloat(data[i].REQ)) ? 0 : parseFloat(data[i].REQ)) +
                    (isNaN(parseFloat(data[i].Design)) ? 0 : parseFloat(data[i].Design)) +
                    (isNaN(parseFloat(data[i].DevTest)) ? 0 : parseFloat(data[i].DevTest)) +
                    (isNaN(parseFloat(data[i].SysTest)) ? 0 : parseFloat(data[i].SysTest)) + (isNaN(parseFloat(data[i].IMPL)) ? 0 : parseFloat(data[i].IMPL)) + (isNaN(parseFloat(data[i].UAT)) ? 0 : parseFloat(data[i].UAT)) +
                    (isNaN(parseFloat(data[i].PROD)) ? 0 : parseFloat(data[i].PROD)) + (isNaN(parseFloat(data[i].TRAIN)) ? 0 : parseFloat(data[i].TRAIN)) + (isNaN(parseFloat(data[i].MANUAL)) ? 0 : parseFloat(data[i].MANUAL)) +
                    (isNaN(parseFloat(data[i].OH)) ? 0 : parseFloat(data[i].OH) + isNaN(parseFloat(data[i].SQA)) ? 0 : parseFloat(data[i].SQA))
            }

            var contructjson = [];

            for (var i = 0; i < $scope.Manualoptions.length; i++) {
                var Finaljson = {
                    Description: 0, Design: 0, DevTest: 0, GroupId: "", IMPL: 0, MANUAL: 0, OH: 0, OppId: "", PROD: 0, REQ: 0, RowNo: 1, SQA: 0, SysTest: 0, TRAIN: 0, TypeId: 0, UAT: 0, Total: 0, PM: 0, GridName: 'EffortFromManual'
                }

                var result3 = _.filter(data, function (someThing) {
                    return someThing.Description == $scope.Manualoptions[i];
                })

                if (result3.length > 0) {

                    for (var j = 0; j < result3.length; j++) {

                        Finaljson.Description = result3[j].Description;
                        Finaljson.GroupId = result3[j].GroupId;
                        Finaljson.OppId = result3[j].OppId;
                        Finaljson.RowNo = result3[j].RowNo;
                        Finaljson.TypeId = result3[j].TypeId;

                        if (!isNaN(parseFloat(result3[j].Design)))
                            Finaljson.Design += parseFloat(result3[j].Design);
                        else
                            Finaljson.Design = "--";

                        if (!isNaN(parseFloat(result3[j].DevTest)))
                            Finaljson.DevTest += parseFloat(result3[j].DevTest);
                        else
                            Finaljson.DevTest = "--";

                        if (!isNaN(parseFloat(result3[j].IMPL)))
                            Finaljson.IMPL += parseFloat(result3[j].IMPL);
                        else
                            Finaljson.IMPL = "--";

                        if (!isNaN(parseFloat(result3[j].MANUAL)))
                            Finaljson.MANUAL += parseFloat(result3[j].MANUAL);
                        else
                            Finaljson.MANUAL = "--";

                        if (!isNaN(parseFloat(result3[j].OH)))
                            Finaljson.OH += parseFloat(result3[j].OH);
                        else
                            Finaljson.OH = "--";


                        if (!isNaN(parseFloat(result3[j].PROD)))
                            Finaljson.PROD += parseFloat(result3[j].PROD);
                        else
                            Finaljson.PROD = "--";

                        if (!isNaN(parseFloat(result3[j].REQ)))
                            Finaljson.REQ += parseFloat(result3[j].REQ);
                        else
                            Finaljson.REQ = "--";


                        if (!isNaN(parseFloat(result3[j].SQA)))
                            Finaljson.SQA += parseFloat(result3[j].SQA);
                        else
                            Finaljson.SQA = "--";


                        if (!isNaN(parseFloat(result3[j].SysTest)))
                            Finaljson.SysTest += parseFloat(result3[j].SysTest);
                        else
                            Finaljson.SysTest = "--";


                        if (!isNaN(parseFloat(result3[j].TRAIN)))
                            Finaljson.TRAIN += parseFloat(result3[j].TRAIN);
                        else
                            Finaljson.TRAIN = "--";


                        if (!isNaN(parseFloat(result3[j].UAT)))
                            Finaljson.UAT += parseFloat(result3[j].UAT);
                        else
                            Finaljson.UAT = "--";


                        Finaljson.Total += parseFloat(result3[j].Total);

                    }


                }
                else {
                    var Finaljson = {
                        Description: $scope.Manualoptions[i], Design: "--", DevTest: "--", GroupId: "", IMPL: "--", MANUAL: "--", OH: "--", OppId: $scope.OpportunityDetail.OppId, PROD: "--", REQ: "--", SQA: "--", SysTest: "--", TRAIN: "--", TypeId: '', UAT: "--", PM: "--", Total: "--", GridName: 'EffortFromManual'
                    }
                }

                contructjson.push(Finaljson);
            }
            //  if (data.length > 0) {
            var calculation = [];
            for (var i = 0; i < contructjson.length; i++) {
                var internalcalc = {
                    REQ: 0, Design: 0, DevTest: 0, SysTest: 0, IMPL: 0, UAT: 0, PROD: 0,
                    TRAIN: 0, MANUAL: 0, OH: 0, SQA: 0, PM: 0, Total: 0, GridName: 'EffortFromManual'
                };
                internalcalc.Description = contructjson[i].Description;

                if (contructjson[i].Description == "Self Service" || contructjson[i].Description == "Custom PS") {
                    var EstSDLCDetail = [];
                    if (contructjson[i].Description == "Self Service") {
                        EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                            return someThing.ProductName == "SELF_SERVICE";
                        });
                    }
                    else if (contructjson[i].Description == "Custom PS") {
                        EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                            return someThing.ProductName == "APPLICATIONS";
                        });
                    }
                    _.each(EstSDLCDetail, function (value, key) {

                        if (value.SDLC_Type == 'Requirements_Gathering' || value.SDLC_Type == 'Requirements')
                            internalcalc.REQ = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Design' || value.SDLC_Type == 'Design_Document')
                            internalcalc.Design = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Develop_Test')
                            internalcalc.DevTest = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'System_Testing' || value.SDLC_Type == 'Test_Cases' || value.SDLC_Type == 'Test_Plan')
                            internalcalc.SysTest = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Implementation_Testing')
                            internalcalc.IMPL = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'UAT')
                            internalcalc.UAT = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Production_Support')
                            internalcalc.PROD = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Training')
                            internalcalc.TRAIN = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Manuals')
                            internalcalc.MANUAL = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Orientation_Handover')
                            internalcalc.OH = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'QA_CM')
                            internalcalc.SQA = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[i].prod_percentage) / 100)) : '--';

                    });


                    calculation.push(internalcalc);
                }
                else if (contructjson[i].Description != "Others") {

                    var EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                        return someThing.ProductName.toLowerCase() == contructjson[i].Description.toLowerCase();
                    });

                    if (contructjson[i].Description == "Servion Products") {
                        EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                            return someThing.ProductName == "SERVION_PRODUCTS";
                        });
                    }
                    _.each(EstSDLCDetail, function (value, key) {

                        if (value.SDLC_Type == 'Requirements_Gathering' || value.SDLC_Type == 'Requirements')
                            internalcalc.REQ = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Design' || value.SDLC_Type == 'Design_Document')
                            internalcalc.Design = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Develop_Test')
                            internalcalc.DevTest = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'System_Testing' || value.SDLC_Type == 'Test_Cases' || value.SDLC_Type == 'Test_Plan')
                            internalcalc.SysTest = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Implementation_Testing')
                            internalcalc.IMPL = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'UAT')
                            internalcalc.UAT = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Production_Support')
                            internalcalc.PROD = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Training')
                            internalcalc.TRAIN = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Manuals')
                            internalcalc.MANUAL = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'Orientation_Handover')
                            internalcalc.OH = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                        if (value.SDLC_Type == 'QA_CM')
                            internalcalc.SQA = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';


                        if (value.ProductName == "CISCO" || value.ProductName == "Avaya") {

                            if (value.SDLC_Type == 'CRD' || value.SDLC_Type == 'SRD' || value.SDLC_Type == 'RD_SRD') {
                                internalcalc.REQ = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                            }

                            else if (value.SDLC_Type == 'NRFU') {
                                internalcalc.SysTest = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                            }
                            else if (value.SDLC_Type == 'NRFU') {
                                internalcalc.IMPL = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                            }
                            else if (value.SDLC_Type == 'UAT') {
                                internalcalc.UAT = contructjson[i].Total != '--' ? (parseFloat(contructjson[i].Total) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100)) : '--';
                            }
                            internalcalc.IMPL = contructjson[i].Total != '--' ? parseFloat(contructjson[i].Total) : '--';
                        }
                    });

                    calculation.push(internalcalc);

                }
                else {
                    calculation.push(contructjson[i]);
                }

            }

            $scope.data1 = calculation;
            $scope.gridDay2.rowData = calculation;
            $scope.gridDay2.api.setRowData(calculation);


        }

        function DoAdditionalEstimationdata() {
            var DefaultFourrows = [{
                Description: "Additional Phases", REQ: 0, Design: 0, DevTest: 0, SysTest: 0, IMPL: 0, UAT: 0, PROD: 0, TRAIN: 0, MANUAL: 0, OH: 0,
                SQA: 0, PM: 0, Product: "Fixed", Total: 0, GridName: 'ExtendedEffort'
            },
            {
                Description: "Reason 1",
                REQ: 0, Design: 0, DevTest: 0, SysTest: 0, IMPL: 0, UAT: 0, PROD: 0, TRAIN: 0, MANUAL: 0, OH: 0, SQA: 0, PM: 0, Product: "Additional",
                Total: 0, GridName: 'ExtendedEffort'
            },
            {
                Description: "Reason 2", REQ: 0, Design: 0, DevTest: 0, SysTest: 0, IMPL: 0, UAT: 0, PROD: 0, TRAIN: 0, MANUAL: 0, OH: 0, SQA: 0,
                PM: 0, Product: "Additional", Total: 0, GridName: 'ExtendedEffort'
            },
            {
                Description: "Reason 3", REQ: 0, Design: 0, DevTest: 0, SysTest: 0, IMPL: 0, UAT: 0, PROD: 0,
                TRAIN: 0, MANUAL: 0, OH: 0, SQA: 0, PM: 0, Product: "Additional", Total: 0, GridName: 'ExtendedEffort'
            }]

            $scope.data2 = DefaultFourrows;
            $scope.gridDay3.rowData = DefaultFourrows;
            $scope.gridDay3.api.setRowData(DefaultFourrows);

        }

        function Fillrightdata() {
            $scope.TotalSection = [];
            $scope.localversionConfirm = [];
            var singleresultrow = [];
            $scope.CompleteResultset = [];

            if ($scope.DaySheetData.SelfserviceId != null && parseInt($scope.DaySheetData.SelfserviceId.length) > 0) {
                var consrow = [];

                for (var i = 0; i < $scope.DaySheetData.SelfserviceId.length; i++) {
                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.SelfserviceId[i]);

                    var resultapp = _.filter($scope.SelfVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.SelfserviceId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'SELF_SERVICE' }
                    var currentdata = dointernalpercentagecalculation(model);

                    var totalresult = getselectedversionsSinglecolvaluesTotalSection($scope.DaySheetData.SelfserviceId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'SELF_SERVICE' });

                    // var result1 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });
                    consrow = consrow.concat(currentdata);
                }

                var SelfServiceRow = doeachcalcultaion(consrow, 'SELF_SERVICE');
                singleresultrow.push(SelfServiceRow);

                $scope.localversionConfirm.push({ 'SELF_SERVICE': $scope.DaySheetData.SelfserviceId })
            }
            if ($scope.DaySheetData.ApplicationsId != null && parseInt($scope.DaySheetData.ApplicationsId.length) > 0) {
                var consrow = [];

                for (var i = 0; i < $scope.DaySheetData.ApplicationsId.length; i++) {

                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.ApplicationsId[i]);
                    var resultapp = _.filter($scope.AppVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.ApplicationsId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'APPLICATIONS' }
                    var totalresult = getselectedversionsSinglecolvaluesTotalSection($scope.DaySheetData.ApplicationsId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'APPLICATIONS' });

                    var currentdata = dointernalpercentagecalculation(model);
                    // var result2 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    consrow = consrow.concat(currentdata);
                }

                var ApplicationRow = doeachcalcultaion(consrow, 'APPLICATIONS');

                singleresultrow.push(ApplicationRow);

                $scope.localversionConfirm.push({ 'APPLICATIONS': $scope.DaySheetData.ApplicationsId })
            }

            if ($scope.DaySheetData.AdminId != null && parseInt($scope.DaySheetData.AdminId.length) > 0) {
                var consrow = [];
                var consrow1 = [];
                var consrow2 = [];
                for (var i = 0; i < $scope.DaySheetData.AdminId.length; i++) {

                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.AdminId[i]);
                    var resultapp = _.filter($scope.AdminVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.AdminId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'REPORT' }

                    var totalresult = getselectedversionsSinglecolvaluesTotalSectionForAdminReportDifferentPackage($scope.DaySheetData.AdminId[i], 'ADMIN');
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'ADMIN' });

                    var currentdata = dointernalpercentagecalculationForAdminReport(model);
                    var resultfilter1 = _.filter(currentdata, function (someThing) {
                        return someThing.Section == 'ADMIN';
                    });

                    consrow = consrow.concat(resultfilter1);

                    var model2 = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'REPORT' }

                    var totalresult1 = getselectedversionsSinglecolvaluesTotalSectionForAdminReportDifferentPackage($scope.DaySheetData.AdminId[i], 'PACKAGE');
                    $scope.TotalSection.push({ TotalRow: totalresult1, ProductName: 'PACKAGE' });
                    var currentdata2 = dointernalpercentagecalculationForAdminReport(model2);
                    var resultfilter2 = _.filter(currentdata2, function (someThing) {
                        return someThing.Section == 'PACKAGE';
                    });

                    consrow1 = consrow1.concat(resultfilter2);


                    var model3 = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'REPORT' }
                    var totalresult2 = getselectedversionsSinglecolvaluesTotalSectionForAdminReportDifferent($scope.DaySheetData.AdminId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult2, ProductName: 'REPORT' });

                    var currentdata3 = dointernalpercentagecalculationForAdminReport(model3);
                    var resultfilter3 = _.filter(currentdata3, function (someThing) {
                        return someThing.Section != 'ADMIN' && someThing.Section != 'PACKAGE' && someThing.Section != 'Total';
                    });

                    consrow2 = consrow2.concat(resultfilter3);

                }

                var AdminRow = doeachcalcultaion(consrow, 'ADMIN');
                singleresultrow.push(AdminRow);

                var AdminRow1 = doeachcalcultaion(consrow1, 'PACKAGE');
                singleresultrow.push(AdminRow1);


                var AdminRow2 = doeachcalcultaion(consrow2, 'REPORT');
                singleresultrow.push(AdminRow2);
                $scope.localversionConfirm.push({ 'ADMIN': $scope.DaySheetData.AdminId })
            }


            if ($scope.DaySheetData.CiscoId != null && parseInt($scope.DaySheetData.CiscoId.length) > 0) {
                var consrow = [];

                for (var i = 0; i < $scope.DaySheetData.CiscoId.length; i++) {

                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.CiscoId[i]);
                    var resultapp = _.filter($scope.CSVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.CiscoId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'CISCO' }

                    var totalresult = getselectedversionsMulticolvaluesTotalSection($scope.DaySheetData.CiscoId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'CISCO' });
                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    // var result4 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });


                    consrow = consrow.concat(currentdata);
                }

                var CiscoRow = doeachcalcultaion(consrow, 'CISCO');
                singleresultrow.push(CiscoRow);
                $scope.localversionConfirm.push({ 'CISCO': $scope.DaySheetData.CiscoId })
            }

            if ($scope.DaySheetData.ServProductsId != null && parseInt($scope.DaySheetData.ServProductsId.length) > 0) {
                var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.ServProductsId.length; i++) {

                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.ServProductsId[i]);
                    var resultapp = _.filter($scope.ServPoductVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.ServProductsId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'SERVION_PRODUCTS' }

                    var totalresult = getselectedversionsMulticolvaluesTotalSection($scope.DaySheetData.ServProductsId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'SERVION_PRODUCTS' });

                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    // var result5 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    consrow = consrow.concat(currentdata);
                }

                var ServionProductsRow = doeachcalcultaion(consrow, 'SERVION_PRODUCTS');
                singleresultrow.push(ServionProductsRow);
                $scope.localversionConfirm.push({ 'SERVION_PRODUCTS': $scope.DaySheetData.ServProductsId })
            }

            if ($scope.DaySheetData.AvayaId != null && parseInt($scope.DaySheetData.AvayaId.length) > 0) {
                var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.AvayaId.length; i++) {
                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.AvayaId[i]);
                    var resultapp = _.filter($scope.AVVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.AvayaId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'Avaya' }
                    var totalresult = getselectedversionsMulticolvaluesTotalSection($scope.DaySheetData.ServProductsId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'Avaya' });


                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    // var result6 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    consrow = consrow.concat(currentdata);
                }

                var AvayaRow = doeachcalcultaion(consrow, 'Avaya');
                singleresultrow.push(AvayaRow);
                $scope.localversionConfirm.push({ 'Avaya': $scope.DaySheetData.AvayaId })
            }

            if ($scope.DaySheetData.EgainId != null && parseInt($scope.DaySheetData.EgainId.length) > 0) {
                var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.EgainId.length; i++) {

                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.EgainId[i]);

                    var resultapp = _.filter($scope.EGVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.EgainId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'eGain' }
                    var totalresult = getselectedversionsMulticolvaluesTotalSection($scope.DaySheetData.EgainId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'eGain' });

                    var currentdata = dointernalpercentagecalculationForEgainGroup(model);
                    // var result7 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    consrow = consrow.concat(currentdata);
                }

                var EgainRow = doeachcalcultaion(consrow, 'eGain');
                singleresultrow.push(EgainRow);

                $scope.localversionConfirm.push({ 'eGain': $scope.DaySheetData.EgainId })
            }

            if ($scope.DaySheetData.WFOId != null && parseInt($scope.DaySheetData.WFOId.length) > 0) {
                var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.WFOId.length; i++) {
                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.WFOId[i]);
                    var resultapp = _.filter($scope.WFVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.WFOId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'WFO' }
                    var totalresult = getselectedversionsMulticolvaluesTotalSection($scope.DaySheetData.WFOId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'WFO' });
                    var currentdata = dointernalpercentagecalculationForEgainGroup(model);
                    // var result8 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });


                    consrow = consrow.concat(currentdata);
                }

                var WFORow = doeachcalcultaion(consrow, 'WFO');
                singleresultrow.push(WFORow);

                $scope.localversionConfirm.push({ 'WFO': $scope.DaySheetData.WFOId })
            }

            if ($scope.DaySheetData.OthersId != null && parseInt($scope.DaySheetData.OthersId.length) > 0) {
                var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.OthersId.length; i++) {

                    var result = getselectedversionsSinglecolvalues($scope.DaySheetData.OthersId[i]);

                    var resultapp = _.filter($scope.OtherVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.OthersId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication.NumberOfApplication, TotalRow: result, ProductName: 'Others' }

                    var totalresult = getselectedversionsSinglecolvaluesTotalSection($scope.DaySheetData.OthersId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'Others' });

                    var currentdata = dointernalpercentagecalculationForOther(model);
                    // var result9 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    consrow = consrow.concat(currentdata);
                }

                var OthersRow = doeachcalcultaion(consrow, 'Others');
                singleresultrow.push(OthersRow);
                $scope.localversionConfirm.push({ 'Others': $scope.DaySheetData.OthersId })
            }

            if ($scope.DaySheetData.AcqueonId != null && parseInt($scope.DaySheetData.AcqueonId.length) > 0) {
                var consrow = [];
                for (var i = 0; i < $scope.DaySheetData.AcqueonId.length; i++) {

                    var result = getselectedversionsMulticolvalues($scope.DaySheetData.AcqueonId[i]);
                    var resultapp = _.filter($scope.ACQVersions, function (someThing) {
                        return someThing.ApplicationId == $scope.DaySheetData.AcqueonId[i];
                    });
                    var model = { NumberofApp: resultapp[0].NumberOfApplication, TotalRow: result, ProductName: 'ACQUEON' }

                    var totalresult = getselectedversionsMulticolvaluesTotalSection($scope.DaySheetData.AcqueonId[i]);
                    $scope.TotalSection.push({ TotalRow: totalresult, ProductName: 'ACQUEON' });

                    var currentdata = dointernalpercentagecalculationForCiscoGroup(model);
                    // var result10 = _.filter(currentdata, function (someThing) {
                    //     return someThing.Section == 'Total';
                    // });

                    consrow = consrow.concat(currentdata);
                }

                var AcqueonRow = doeachcalcultaion(consrow, 'ACQUEON');
                singleresultrow.push(AcqueonRow);
                $scope.localversionConfirm.push({ 'ACQUEON': $scope.DaySheetData.AcqueonId })

            }

            $scope.data = [];

            for (var i = 0; i < $scope.options.length; i++) {

                var resultset = _.filter(singleresultrow, function (someThing) {
                    return someThing.Product == $scope.options[i];
                })

                if (resultset.length > 0) {
                    $scope.data.push({
                        OppId: $scope.OpportunityDetail.OppId, Description: $scope.options[i], REQ: resultset[0].REQ, Design: resultset[0].Design, DevTest: resultset[0].DevTest, SysTest: resultset[0].SysTest, IMPL: resultset[0].IMPL, UAT: resultset[0].UAT, PROD: resultset[0].PROD, TRAIN: resultset[0].TRAIN, MANUAL: resultset[0].MANUAL, OH: resultset[0].OH, SQA: resultset[0].SQA, PM: resultset[0].PM, Total: (resultset[0].REQ + resultset[0].Design + resultset[0].DevTest + resultset[0].SysTest + resultset[0].IMPL + resultset[0].UAT + resultset[0].PROD + resultset[0].TRAIN + resultset[0].MANUAL + resultset[0].OH + resultset[0].SQA), GridName: 'EffortFromTool'
                    });
                }
                else {
                    $scope.data.push({
                        OppId: $scope.OpportunityDetail.OppId, Description: $scope.options[i], REQ: '--', Design: '--', DevTest: '--', SysTest: '--', IMPL: '--', UAT: '--',
                        PROD: '--', TRAIN: '--', MANUAL: '--', OH: '--', SQA: '--', PM: '--', Total: '0', GridName: 'EffortFromTool'
                    });
                }
            }


            $scope.gridDay1.api.setRowData($scope.data);


            if ($scope.DaySheetData.ManualId.length > 0) {
                $scope.localversionConfirm.push({ 'MANUAL': $scope.DaySheetData.ManualId })
                ManualEstimationMasterService.GetManualEstimation($scope.DaySheetData.ManualId).success(function (data) {
                    $scope.ManualEstimationdata = data;
                    GetManualEstimationdata();
                }).error(function (error) {
                    $scope.Error = error;
                });
            }
            else {
                $scope.ManualEstimationdata = [];
                GetManualEstimationdata();
            }

        }

        function doeachcalcultaion(result, area) {

            var internalcalc = {
                Description: area, REQ: 0, Design: 0, DevTest: 0, SysTest: 0,
                IMPL: 0, UAT: 0, PROD: 0, TRAIN: 0, MANUAL: 0, OH: 0, SQA: 0, PM: 0, Product: area, Total: 0
            }

            _.each(result, function (value, key) {

                if (value.SDLC_Type == 'Requirements_Gathering' || value.SDLC_Type == 'Requirements')
                    internalcalc.REQ += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Design' || value.SDLC_Type == 'Design_Document')
                    internalcalc.Design += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Develop_Test')
                    internalcalc.DevTest += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'System_Testing' || value.SDLC_Type == 'Test_Cases' || value.SDLC_Type == 'Test_Plan')
                    internalcalc.SysTest += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Implementation_Testing')
                    internalcalc.IMPL += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'UAT')
                    internalcalc.UAT += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Production_Support')
                    internalcalc.PROD += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Training')
                    internalcalc.TRAIN += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Manuals')
                    internalcalc.MANUAL += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'Orientation_Handover')
                    internalcalc.OH += parseFloat(value.ResultProdPercentage);
                if (value.SDLC_Type == 'QA_CM')
                    internalcalc.SQA += parseFloat(value.ResultProdPercentage);



                if (area == "CISCO" || area == "Avaya") {

                    if (value.SDLC_Type == 'CRD' || value.SDLC_Type == 'SRD' || value.SDLC_Type == 'RD_SRD') {
                        internalcalc.REQ += parseFloat(value.ResultProdPercentage);
                        internalcalc.REQ += parseFloat(value.ResultUatPercentage);
                    }

                    else if (value.SDLC_Type == 'NRFU') {
                        internalcalc.SysTest += parseFloat(value.ResultProdPercentage);
                        internalcalc.SysTest += parseFloat(value.ResultUatPercentage);
                    }
                    else if (value.SDLC_Type == 'NRFU') {
                        internalcalc.IMPL += parseFloat(value.ResultProdPercentage);
                        internalcalc.IMPL += parseFloat(value.ResultUatPercentage);
                    }
                    else if (value.SDLC_Type == 'UAT') {
                        internalcalc.UAT += parseFloat(value.ResultProdPercentage);
                        internalcalc.UAT += parseFloat(value.ResultUatPercentage);
                    }

                }

            })

            // if (area == "SELF_SERVICE") {            // else if (area == "APPLICATIONS") {            // else if (area == "ADMIN") {
            // else if (area == "PACKAGE") {            // else if (area == "REPORT") {

            if (area == "ACQUEON") {


                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == "Total" && someThing.ProductName == 'ACQUEON';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }
            else if (area == "SERVION_PRODUCTS") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == "Total" && someThing.ProductName == 'SERVION_PRODUCTS';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            else if (area == "Avaya") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == "Total" && someThing.ProductName == 'Avaya';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            if (area == "eGain") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == "Total" && someThing.ProductName == 'eGain';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            else if (area == "WFO") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == "Total" && someThing.ProductName == 'WFO';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }

            else if (area == "CISCO") {

                var result1 = _.filter($scope.CompleteResultsetMulti, function (someThing) {
                    return someThing.Section == "Total" && someThing.ProductName == 'CISCO';
                });
                if (result1.length > 0) {
                    var SelfServiceRow = parseFloat(result1[0].A1Fcol1) + parseFloat(result1[0].A1Fcol2) + parseFloat(result1[0].A1Fcol3);

                    internalcalc.IMPL = SelfServiceRow;
                }
            }


            return internalcalc;
        }

        $scope.call = function (id, area) {
            if (parseInt(id.length) > 0) {
                $('#showDatamodel').modal('show');
                $scope.imgurl = BaseURL + 'Snapshot/' + id[0].Content;
            }
            else
                toaster.pop('warning', "Warning", 'Please select version to view data', null);
        }

        function setdata(data) {
            $scope.ViewData = {};
            $scope.ViewData.REQ = 0;
            $scope.ViewData.Design = 0;
            $scope.ViewData.DevTest = 0;
            $scope.ViewData.SysTest = 0;
            $scope.ViewData.IMPL = 0;
            $scope.ViewData.UAT = 0;
            $scope.ViewData.PROD = 0;
            $scope.ViewData.TRAIN = 0;
            $scope.ViewData.MANUAL = 0;
            $scope.ViewData.OH = 0;
            $scope.ViewData.SQA = 0;

            $scope.ViewData.REQ = data.REQ;
            $scope.ViewData.Design = data.Design;
            $scope.ViewData.DevTest = data.DevTest;
            $scope.ViewData.SysTest = data.SysTest;
            $scope.ViewData.IMPL = data.IMPL;
            $scope.ViewData.UAT = data.UAT;
            $scope.ViewData.PROD = data.PROD;
            $scope.ViewData.TRAIN = data.TRAIN;
            $scope.ViewData.MANUAL = data.MANUAL;
            $scope.ViewData.OH = data.OH;
            $scope.ViewData.SQA = data.SQA;

        }

        function cellValueChangedFunction5() {
            $scope.gridLOB.api.refreshView();
        }

        function cellValueChangedFunction1() {
            $scope.gridDay1.api.refreshView();
        }
        function cellValueChangedFunction2() {
            $scope.gridDay2.api.refreshView();
        }
        $scope.cellValueChangedFunction3 = function () {
            $scope.gridDay3.api.refreshView();
            FindProjectComplexity();
        }
        function cellValueChangedFunction4() {
            $scope.gridDay4.api.refreshView();
        }


        function validatedataonSAVE() {

            if ($scope.data.length > 0) {
                //return true;

                var isvalid = true;

                // for (var i = 0; i < $scope.data.length; i++) {
                //     if ($scope.data[i].OemId == 1 && $scope.data[i].ComponenttypeId == 1 && $scope.data[i].LTotal > 0) {
                //         isvalid = false;
                //         var errorrow = i + 1;
                //         toaster.pop('error', "Failed", 'Sheet contains invalid data in row number ' + errorrow, null);
                //         break;
                //     }

                // }
                return isvalid;
            }

            else {
                toaster.pop('error', "Failed", 'No data to update', null);
                return false;
            }
        }

        //pop up data
        $scope.closepopup = function () {

            $('#showSavemodel').modal('hide');
            $('#showsaveAsmodel').modal('hide');
            $('#showmod').modal('hide');
            // redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
        }

        $scope.finished = function () {
            $('#showmod').modal('show');
        }

        $scope.AddpaymentSheetpop = function () {
            $('#showSavemodel').modal('show');
        }

        $scope.CancelPaymentSheet = function () {
            $('#showSavemodel').modal('hide');
        }

        $scope.saveaspaymentSheetpop = function () {
            $('#showsaveAsmodel').modal('show');
        }

        $scope.CancelpaymentSheetsaveas = function () {
            $('#showsaveAsmodel').modal('hide');
        }

        //pop up data

        $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
            $scope.newnavigateURl = newUrl;
            if ($scope.grideditable_PriceList) {
                $('#showSaveChangesmodel').modal('show');
                event.preventDefault();
            }
        });


        $scope.saveasPaymentSheetdiscard = function () {
            $scope.grideditable_PriceList = false;
            $scope.AddPriceSheet(true);
            $('#showSaveChangesmodel').modal('hide');
            $window.location.href = $scope.newnavigateURl;
            // var url = $scope.newnavigateURl.split('#');
            // //$window.location.href = '/#' + url[1];
            // $location.path(url[1]);
        }


        $scope.CancelPaymentSheetdiscard = function () {
            $scope.grideditable_PriceList = false;
            $scope.IgnoreChanges();
            $('#showSaveChangesmodel').modal('hide');
            //var url = $scope.newnavigateURl.split('#');
            $window.location.href = $scope.newnavigateURl;
            //$location.path(url[1]);
        }

        $scope.EditModel = function (value, text) {
            if ($scope.grideditable_PriceList) {
                $scope.dynamickey = value;
                $scope.dynamictext = text;
                $('#AdditionalInvoice').modal('show');
            }
            else {
                toaster.pop('warning', "Warning", 'Please click edit to make changes', null);
            }
        }

        $scope.cancelpopup = function () {
            $('#AdditionalInvoice').modal('hide');
        }

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

        $scope.onBtExport = function () {
            DayService.ExportToExcelSheet($routeParams.OppId, $routeParams.GroupId).success(function (data) {
                console.log(data);
                var url = BaseURL + 'ExportFiles/' + data.name;

                $scope.downloadurl = url;
                $scope.filename = data.name;
                setTimeout(function () {
                    $('#downloadpdf')[0].click();
                }, 100);

            }).error(function (error) {
                $scope.Error = error;
            })

        }

        //refresh page when data done
        function redirectRefreshPage(oppId, groupId) {
            $location.path("PaymentList/" + oppId + "/" + groupId);
        }

        $scope.ClosePriceSheetdiscard = function () {
            $('#showSaveChangesmodel').modal('hide');
        }

        $scope.Closedata = function () {
            $('#showDatamodel').modal('hide');
        }




        function dointernalpercentagecalculation(ApplicationModel) {
            try {

                var EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                    return someThing.ProductName == ApplicationModel.ProductName;
                });

                var curentdata = [];
                if (EstSDLCDetail.length > 0) {
                    if (ApplicationModel.NumberofApp > 2) {

                        if (EstSDLCDetail.length > 0) {
                            for (var k = 0; k < ApplicationModel.TotalRow.length; k++) {
                                for (var i = 1; i < ApplicationModel.NumberofApp; i++) {

                                    var calculatedata = ApplicationModel.TotalRow[k]['A' + i + 'Fcol3']
                                    for (var j = 0; j < EstSDLCDetail.length; j++) {
                                        var calculation = {};
                                        calculation.ProductName = EstSDLCDetail[j].ProductName;
                                        //  calculation.oppId = ApplicationModel.OppId;
                                        //  calculation.GroupId = ApplicationModel.ApplicationId;
                                        calculation.AppliedProdPercentage = EstSDLCDetail[j].prod_percentage;
                                        calculation.Section = ApplicationModel.TotalRow[k].Section;

                                        var res = parseFloat(calculatedata) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100);
                                        calculation.ResultProdPercentage = res.toFixed(1);
                                        calculation.CurrentApplication = i;
                                        calculation.SDLC_Type = EstSDLCDetail[j].SDLC_Type
                                        curentdata.push(calculation);
                                    }
                                }

                            }
                        }
                    } else {
                        for (var k = 0; k < ApplicationModel.TotalRow.length; k++) {

                            var calculatedata = ApplicationModel.TotalRow[k]['A1Fcol3']
                            for (var j = 0; j < EstSDLCDetail.length; j++) {
                                var calculation = {};
                                calculation.ProductName = EstSDLCDetail[j].ProductName;
                                calculation.oppId = ApplicationModel.OppId;
                                calculation.GroupId = ApplicationModel.ApplicationId;
                                calculation.AppliedProdPercentage = EstSDLCDetail[j].prod_percentage;
                                calculation.Section = ApplicationModel.TotalRow[k].Section;

                                var res = parseFloat(calculatedata) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100);
                                calculation.ResultProdPercentage = res.toFixed(1);
                                calculation.CurrentApplication = 1;
                                calculation.SDLC_Type = EstSDLCDetail[j].SDLC_Type
                                curentdata.push(calculation);
                            }
                        }
                    }
                }
                return curentdata;
            }
            catch (Ex) {

            }
        }


        function dointernalpercentagecalculationForAdminReport(ApplicationModel) {

            try {
                var EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                    return someThing.ProductName == ApplicationModel.ProductName;
                });

                var internalcalc = [];
                if (EstSDLCDetail.length > 0) {

                    for (var k = 0; k < ApplicationModel.TotalRow.length; k++) {

                        var calculatedata = ApplicationModel.TotalRow[k]['A1Fcol3']
                        for (var j = 0; j < EstSDLCDetail.length; j++) {
                            var calculation = {};
                            calculation.ProductName = EstSDLCDetail[j].ProductName;
                            calculation.oppId = ApplicationModel.OppId;
                            calculation.GroupId = ApplicationModel.ApplicationId;
                            calculation.AppliedProdPercentage = EstSDLCDetail[j].prod_percentage;
                            calculation.Section = ApplicationModel.TotalRow[k].Section;

                            var res = parseFloat(calculatedata) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100);
                            calculation.ResultProdPercentage = res.toFixed(1);
                            calculation.CurrentApplication = 1;
                            calculation.SDLC_Type = EstSDLCDetail[j].SDLC_Type
                            internalcalc.push(calculation);
                        }


                    }
                }

                return internalcalc;
            }
            catch (Ex) {

            }

        }


        function dointernalpercentagecalculationForOther(ApplicationModel) {
            try {
                var internalcalc = [];
                for (var k = 0; k < ApplicationModel.TotalRow.length; k++) {

                    var calculatedata = ApplicationModel.TotalRow[k]['A1Fcol3']
                    var calculation = {};
                    calculation.ProductName = 'OTHERS';
                    calculation.oppId = ApplicationModel.OppId;
                    calculation.GroupId = ApplicationModel.ApplicationId;
                    calculation.AppliedProdPercentage = 100;
                    calculation.Section = ApplicationModel.TotalRow[k].Section;

                    var res = parseFloat(calculatedata);
                    calculation.ResultProdPercentage = res.toFixed(1);
                    calculation.CurrentApplication = 1;
                    calculation.SDLC_Type = 'Implementation_Testing'
                    internalcalc.push(calculation);

                }

                return internalcalc;
            }
            catch (Ex) {

            }

        }


        function dointernalpercentagecalculationForCiscoGroup(ApplicationModel) {

            try {
                var EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                    return someThing.ProductName == ApplicationModel.ProductName;
                });
                var curentdata = [];
                if (EstSDLCDetail.length > 0) {
                    for (var k = 0; k < ApplicationModel.TotalRow.length; k++) {
                        var calculatedata = ApplicationModel.TotalRow[k]['A1Fcol4']
                        var calculatedata1 = ApplicationModel.TotalRow[k]['A1Fcol5']
                        for (var j = 0; j < EstSDLCDetail.length; j++) {
                            var calculation = {};
                            calculation.ProductName = EstSDLCDetail[j].ProductName;
                            calculation.oppId = ApplicationModel.OppId;
                            calculation.GroupId = ApplicationModel.ApplicationId;
                            calculation.AppliedProdPercentage = EstSDLCDetail[j].prod_percentage;
                            calculation.AppliedUatPercentage = EstSDLCDetail[j].uat_percentage;
                            calculation.Section = ApplicationModel.TotalRow[k].Section;

                            var res = (parseFloat(calculatedata) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100));
                            var res1 = (parseFloat(calculatedata1) * (parseFloat(EstSDLCDetail[j].uat_percentage) / 100));
                            calculation.ResultProdPercentage = res.toFixed(1);
                            calculation.ResultUatPercentage = res1.toFixed(1);

                            calculation.CurrentApplication = 1;
                            calculation.SDLC_Type = EstSDLCDetail[j].SDLC_Type
                            curentdata.push(calculation);

                        }
                    }
                }
                return curentdata;
            }
            catch (Ex) {
                logger.info('ex' + Ex);
                deferred.reject(Ex)
            }
            return deferred.promise;
        }

        function dointernalpercentagecalculationForEgainGroup(ApplicationModel) {

            try {
                var EstSDLCDetail = _.filter($scope.SDLCPercentage, function (someThing) {
                    return someThing.ProductName == ApplicationModel.ProductName;
                });
                var curentdata = [];
                for (var k = 0; k < ApplicationModel.TotalRow.length; k++) {
                    if (EstSDLCDetail.length > 0) {

                        var calculatedata = ApplicationModel.TotalRow[k]['A1Fcol1']
                        var calculatedata1 = ApplicationModel.TotalRow[k]['A1Fcol2']
                        for (var j = 0; j < EstSDLCDetail.length; j++) {
                            var calculation = {};
                            calculation.ProductName = EstSDLCDetail[j].ProductName;
                            calculation.oppId = ApplicationModel.OppId;
                            calculation.GroupId = ApplicationModel.ApplicationId;
                            calculation.AppliedProdPercentage = EstSDLCDetail[j].prod_percentage;
                            calculation.AppliedUatPercentage = EstSDLCDetail[j].uat_percentage;
                            calculation.Section = ApplicationModel.TotalRow[k].Section;

                            var res = (parseFloat(calculatedata) * (parseFloat(EstSDLCDetail[j].prod_percentage) / 100))
                            var res1 = (parseFloat(calculatedata1) * (parseFloat(EstSDLCDetail[j].uat_percentage) / 100));

                            calculation.ResultProdPercentage = res.toFixed(1);
                            calculation.ResultUatPercentage = res1.toFixed(1);

                            calculation.CurrentApplication = 1;
                            calculation.SDLC_Type = EstSDLCDetail[j].SDLC_Type
                            curentdata.push(calculation);

                        }
                    }
                }
                return curentdata;

            } catch (e) {

            }

        }

        //getting extended efforts
        $scope.GetExtendedEfforts = function () {
            //debugger;

            OpportunityRateService.GetAllOPPORTUNITY_RATE().success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {
                    $scope.GrossMargins_GRDDATA = _.filter(data, function (someThing) {
                        return someThing.Rate_Type == "GrossMargins";
                    });
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while Adding opportunity rate Master!", null);
                $scope.error = "An Error has occured while Adding opportunity rate Master! " + data.ExceptionMessage;
            });


            Opportunityservice.GetOpportunityConfigurationByID($scope.OpportunityDetail.id).success(function (data) {
                if (data.length > 0) {

                    console.log(data[0]);
                    $scope.OpportunityConfigurationDetail = data[0];
                }
                else {
                    $scope.OpportunityConfigurationDetail = {};
                }
            }).error(function (error) {
                $scope.Error = error;
            })

            Opportunityservice.GetExtendedEfforts().success(function (data) {
                if (data[0] != undefined) {
                    $scope.ExtendedEffortPercentage = data[0];
                }
                else {
                    $scope.ExtendedEffortPercentage = {};

                }
            }).error(function (error) {
                $scope.Error = error;
            });



            //hard coded for jay
            $scope.TandEPSData = [];
            TandEPSService.GetAllTandEPSbyOppGroupID($scope.OpportunityDetail.OppId, $routeParams.GroupId).success(function (data) {
                if (data.Error == null) {
                    $scope.TandEPSData = data;
                    $scope.call16Api = true;
                    ReverseCalc();
                }
            }).error(function (error) {
                console.log('Error occurred: ' + error);
                $scope.Error = error;
            });




        }

        // This call is triggered when T& E get changes

        function setcalculatedeffortsonly() {
            $scope.FixedFTEDaysJson[0].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "REQ"))) : 0;
            $scope.FixedFTEDaysJson[1].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "Design"))) : 0;
            $scope.FixedFTEDaysJson[2].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "DevTest"))) : 0;
            $scope.FixedFTEDaysJson[3].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "SysTest"))) : 0;
            $scope.FixedFTEDaysJson[4].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "IMPL"))) : 0;
            $scope.FixedFTEDaysJson[5].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "UAT"))) : 0;
            $scope.FixedFTEDaysJson[6].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "PROD"))) : 0;
            $scope.FixedFTEDaysJson[7].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "TRAIN"))) : 0;
            $scope.FixedFTEDaysJson[8].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "MANUAL"))) : 0;
            $scope.FixedFTEDaysJson[9].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "OH"))) : 0;
            $scope.FixedFTEDaysJson[10].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "SQA"))) : 0;
            $scope.FixedFTEDaysJson[11].CalculatedEfforts = $scope.data3.length > 0 ? (sum(_.pluck($scope.data3, "PM"))) : 0;
            $scope.gridFTEDays.api.refreshView()
            // $scope.gridFTEDays.api.setRowData($scope.FixedFTEDaysJson);

        }

        function Fouthtabaction() {
            //set column def here immediately

            $scope.FixedFTEDaysJson[0].Tool = (sum(_.pluck($scope.data, "REQ")));
            $scope.FixedFTEDaysJson[0].Manual = (sum(_.pluck($scope.data1, "REQ")));
            $scope.FixedFTEDaysJson[0].Extend = (sum(_.pluck($scope.data2, "REQ")));
            $scope.FixedFTEDaysJson[0].Total = $scope.FixedFTEDaysJson[0].Tool + $scope.FixedFTEDaysJson[0].Manual + $scope.FixedFTEDaysJson[0].Extend + $scope.FixedFTEDaysJson[0].CalculatedEfforts;
            $scope.FixedFTEDaysJson[0].FTEHours = ($scope.FixedFTEDaysJson[0].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[0].Total) - parseFloat($scope.FixedFTEDaysJson[0].Change) : $scope.FixedFTEDaysJson[0].Total)
            if ($scope.FixedFTEDaysJson[0].Resources > 0) {
                $scope.FixedFTEDaysJson[0].Days = (parseFloat($scope.FixedFTEDaysJson[0].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[0].Resources);
            }
            else
                $scope.FixedFTEDaysJson[0].Days = $scope.FixedFTEDaysJson[0].FTEHours;
            $scope.FixedFTEDaysJson[0].BusinessDays = ($scope.FixedFTEDaysJson[0].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[0].Days) - parseFloat($scope.FixedFTEDaysJson[0].Daychange) : $scope.FixedFTEDaysJson[0].Days);


            $scope.FixedFTEDaysJson[1].Tool = (sum(_.pluck($scope.data, "Design")));
            $scope.FixedFTEDaysJson[1].Manual = (sum(_.pluck($scope.data1, "Design")));
            $scope.FixedFTEDaysJson[1].Extend = (sum(_.pluck($scope.data2, "Design")));

            $scope.FixedFTEDaysJson[1].Total = $scope.FixedFTEDaysJson[1].Tool + $scope.FixedFTEDaysJson[1].Manual + $scope.FixedFTEDaysJson[1].Extend + $scope.FixedFTEDaysJson[1].CalculatedEfforts;
            $scope.FixedFTEDaysJson[1].FTEHours = ($scope.FixedFTEDaysJson[1].Change.length > 0 ? $scope.FixedFTEDaysJson[1].Change : $scope.FixedFTEDaysJson[1].Total)
            if ($scope.FixedFTEDaysJson[1].Resources > 0) {
                $scope.FixedFTEDaysJson[1].Days = (parseFloat($scope.FixedFTEDaysJson[1].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[1].Resources);
            }
            else
                $scope.FixedFTEDaysJson[1].Days = $scope.FixedFTEDaysJson[1].FTEHours;
            $scope.FixedFTEDaysJson[1].BusinessDays = ($scope.FixedFTEDaysJson[1].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[1].Days) - parseFloat($scope.FixedFTEDaysJson[1].Daychange) : $scope.FixedFTEDaysJson[1].Days);


            $scope.FixedFTEDaysJson[2].Tool = (sum(_.pluck($scope.data, "DevTest")));
            $scope.FixedFTEDaysJson[2].Manual = (sum(_.pluck($scope.data1, "DevTest")));
            $scope.FixedFTEDaysJson[2].Extend = (sum(_.pluck($scope.data2, "DevTest")));

            $scope.FixedFTEDaysJson[2].Total = $scope.FixedFTEDaysJson[2].Tool + $scope.FixedFTEDaysJson[2].Manual + $scope.FixedFTEDaysJson[2].Extend + $scope.FixedFTEDaysJson[2].CalculatedEfforts;
            $scope.FixedFTEDaysJson[2].FTEHours = ($scope.FixedFTEDaysJson[2].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[2].Total) - parseFloat($scope.FixedFTEDaysJson[2].Change) : $scope.FixedFTEDaysJson[2].Total)
            if ($scope.FixedFTEDaysJson[2].Resources > 0) {
                $scope.FixedFTEDaysJson[2].Days = (parseFloat($scope.FixedFTEDaysJson[2].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[2].Resources);
            }
            else
                $scope.FixedFTEDaysJson[2].Days = $scope.FixedFTEDaysJson[2].FTEHours;
            $scope.FixedFTEDaysJson[2].BusinessDays = ($scope.FixedFTEDaysJson[2].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[2].Days) - parseFloat($scope.FixedFTEDaysJson[2].Daychange) : $scope.FixedFTEDaysJson[2].Days);



            $scope.FixedFTEDaysJson[3].Tool = (sum(_.pluck($scope.data, "SysTest")));
            $scope.FixedFTEDaysJson[3].Manual = (sum(_.pluck($scope.data1, "SysTest")));
            $scope.FixedFTEDaysJson[3].Extend = (sum(_.pluck($scope.data2, "SysTest")));

            $scope.FixedFTEDaysJson[3].Total = $scope.FixedFTEDaysJson[3].Tool + $scope.FixedFTEDaysJson[3].Manual + $scope.FixedFTEDaysJson[3].Extend + $scope.FixedFTEDaysJson[3].CalculatedEfforts;
            $scope.FixedFTEDaysJson[3].FTEHours = ($scope.FixedFTEDaysJson[3].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[3].Total) - parseFloat($scope.FixedFTEDaysJson[3].Change) : $scope.FixedFTEDaysJson[3].Total)
            if ($scope.FixedFTEDaysJson[3].Resources > 0) {
                $scope.FixedFTEDaysJson[3].Days = (parseFloat($scope.FixedFTEDaysJson[3].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[3].Resources);
            }
            else
                $scope.FixedFTEDaysJson[3].Days = $scope.FixedFTEDaysJson[3].FTEHours;
            $scope.FixedFTEDaysJson[3].BusinessDays = ($scope.FixedFTEDaysJson[3].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[3].Days) - parseFloat($scope.FixedFTEDaysJson[3].Daychange) : $scope.FixedFTEDaysJson[3].Days);



            $scope.FixedFTEDaysJson[4].Tool = (sum(_.pluck($scope.data, "IMPL")));
            $scope.FixedFTEDaysJson[4].Manual = (sum(_.pluck($scope.data1, "IMPL")));
            $scope.FixedFTEDaysJson[4].Extend = (sum(_.pluck($scope.data2, "IMPL")));

            $scope.FixedFTEDaysJson[4].Total = $scope.FixedFTEDaysJson[4].Tool + $scope.FixedFTEDaysJson[4].Manual + $scope.FixedFTEDaysJson[4].Extend + $scope.FixedFTEDaysJson[4].CalculatedEfforts;
            $scope.FixedFTEDaysJson[4].FTEHours = ($scope.FixedFTEDaysJson[4].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[4].Total) - parseFloat($scope.FixedFTEDaysJson[4].Change) : $scope.FixedFTEDaysJson[4].Total)
            if ($scope.FixedFTEDaysJson[4].Resources > 0) {
                $scope.FixedFTEDaysJson[4].Days = (parseFloat($scope.FixedFTEDaysJson[4].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[4].Resources);
            }
            else
                $scope.FixedFTEDaysJson[4].Days = $scope.FixedFTEDaysJson[4].FTEHours;
            $scope.FixedFTEDaysJson[4].BusinessDays = ($scope.FixedFTEDaysJson[4].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[4].Days) - parseFloat($scope.FixedFTEDaysJson[4].Daychange) : $scope.FixedFTEDaysJson[4].Days);

            $scope.FixedFTEDaysJson[5].Tool = (sum(_.pluck($scope.data, "UAT")));
            $scope.FixedFTEDaysJson[5].Manual = (sum(_.pluck($scope.data1, "UAT")));
            $scope.FixedFTEDaysJson[5].Extend = (sum(_.pluck($scope.data2, "UAT")));

            $scope.FixedFTEDaysJson[5].Total = $scope.FixedFTEDaysJson[5].Tool + $scope.FixedFTEDaysJson[5].Manual + $scope.FixedFTEDaysJson[5].Extend + $scope.FixedFTEDaysJson[5].CalculatedEfforts;
            $scope.FixedFTEDaysJson[5].FTEHours = ($scope.FixedFTEDaysJson[5].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[5].Total) - parseFloat($scope.FixedFTEDaysJson[5].Change) : $scope.FixedFTEDaysJson[5].Total)
            if ($scope.FixedFTEDaysJson[5].Resources > 0) {
                $scope.FixedFTEDaysJson[5].Days = (parseFloat($scope.FixedFTEDaysJson[5].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[5].Resources);
            }
            else
                $scope.FixedFTEDaysJson[5].Days = $scope.FixedFTEDaysJson[5].FTEHours;
            $scope.FixedFTEDaysJson[5].BusinessDays = ($scope.FixedFTEDaysJson[5].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[5].Days) - parseFloat($scope.FixedFTEDaysJson[5].Daychange) : $scope.FixedFTEDaysJson[5].Days);


            $scope.FixedFTEDaysJson[6].Tool = (sum(_.pluck($scope.data, "PROD")));
            $scope.FixedFTEDaysJson[6].Manual = (sum(_.pluck($scope.data1, "PROD")));
            $scope.FixedFTEDaysJson[6].Extend = (sum(_.pluck($scope.data2, "PROD")));

            $scope.FixedFTEDaysJson[6].Total = $scope.FixedFTEDaysJson[6].Tool + $scope.FixedFTEDaysJson[6].Manual + $scope.FixedFTEDaysJson[6].Extend + $scope.FixedFTEDaysJson[6].CalculatedEfforts;
            $scope.FixedFTEDaysJson[6].FTEHours = ($scope.FixedFTEDaysJson[6].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[6].Total) - parseFloat($scope.FixedFTEDaysJson[6].Change) : $scope.FixedFTEDaysJson[6].Total)
            if ($scope.FixedFTEDaysJson[6].Resources > 0) {
                $scope.FixedFTEDaysJson[6].Days = (parseFloat($scope.FixedFTEDaysJson[6].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[6].Resources);
            }
            else
                $scope.FixedFTEDaysJson[6].Days = $scope.FixedFTEDaysJson[6].FTEHours;
            $scope.FixedFTEDaysJson[6].BusinessDays = ($scope.FixedFTEDaysJson[6].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[6].Days) - parseFloat($scope.FixedFTEDaysJson[6].Daychange) : $scope.FixedFTEDaysJson[6].Days);



            $scope.FixedFTEDaysJson[7].Tool = (sum(_.pluck($scope.data, "TRAIN")));
            $scope.FixedFTEDaysJson[7].Manual = (sum(_.pluck($scope.data1, "TRAIN")));
            $scope.FixedFTEDaysJson[7].Extend = (sum(_.pluck($scope.data2, "TRAIN")));

            $scope.FixedFTEDaysJson[7].Total = $scope.FixedFTEDaysJson[7].Tool + $scope.FixedFTEDaysJson[7].Manual + $scope.FixedFTEDaysJson[7].Extend + $scope.FixedFTEDaysJson[7].CalculatedEfforts;
            $scope.FixedFTEDaysJson[7].FTEHours = ($scope.FixedFTEDaysJson[7].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[7].Total) - parseFloat($scope.FixedFTEDaysJson[7].Change) : $scope.FixedFTEDaysJson[7].Total)
            if ($scope.FixedFTEDaysJson[7].Resources > 0) {
                $scope.FixedFTEDaysJson[7].Days = (parseFloat($scope.FixedFTEDaysJson[7].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[7].Resources);
            }
            else
                $scope.FixedFTEDaysJson[7].Days = $scope.FixedFTEDaysJson[7].FTEHours;
            $scope.FixedFTEDaysJson[7].BusinessDays = ($scope.FixedFTEDaysJson[7].Daychange.length > 0 ? parseFloat($scope.FixedFTEDaysJson[7].Days) - parseFloat($scope.FixedFTEDaysJson[7].Daychange) : $scope.FixedFTEDaysJson[7].Days);


            $scope.FixedFTEDaysJson[8].Tool = (sum(_.pluck($scope.data, "MANUAL")));
            $scope.FixedFTEDaysJson[8].Manual = (sum(_.pluck($scope.data1, "MANUAL")));
            $scope.FixedFTEDaysJson[8].Extend = (sum(_.pluck($scope.data2, "MANUAL")));

            $scope.FixedFTEDaysJson[8].Total = $scope.FixedFTEDaysJson[8].Tool + $scope.FixedFTEDaysJson[8].Manual + $scope.FixedFTEDaysJson[8].Extend + $scope.FixedFTEDaysJson[8].CalculatedEfforts;
            $scope.FixedFTEDaysJson[8].FTEHours = ($scope.FixedFTEDaysJson[8].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[8].Total) - parseFloat($scope.FixedFTEDaysJson[8].Change) : $scope.FixedFTEDaysJson[8].Total)
            if ($scope.FixedFTEDaysJson[8].Resources > 0) {
                $scope.FixedFTEDaysJson[8].Days = (parseFloat($scope.FixedFTEDaysJson[8].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[8].Resources);
            }
            else
                $scope.FixedFTEDaysJson[8].Days = $scope.FixedFTEDaysJson[8].FTEHours;
            $scope.FixedFTEDaysJson[8].BusinessDays = '';//($scope.FixedFTEDaysJson[8].Daychange.length > 0 ? $scope.FixedFTEDaysJson[8].Daychange : $scope.FixedFTEDaysJson[8].Days);


            $scope.FixedFTEDaysJson[9].Tool = (sum(_.pluck($scope.data, "OH")));
            $scope.FixedFTEDaysJson[9].Manual = (sum(_.pluck($scope.data1, "OH")));
            $scope.FixedFTEDaysJson[9].Extend = (sum(_.pluck($scope.data2, "OH")));

            $scope.FixedFTEDaysJson[9].Total = $scope.FixedFTEDaysJson[9].Tool + $scope.FixedFTEDaysJson[9].Manual + $scope.FixedFTEDaysJson[9].Extend + $scope.FixedFTEDaysJson[9].CalculatedEfforts;
            $scope.FixedFTEDaysJson[9].FTEHours = ($scope.FixedFTEDaysJson[9].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[9].Total) - parseFloat($scope.FixedFTEDaysJson[9].Change) : $scope.FixedFTEDaysJson[9].Total)
            if ($scope.FixedFTEDaysJson[9].Resources > 0) {
                $scope.FixedFTEDaysJson[9].Days = (parseFloat($scope.FixedFTEDaysJson[9].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[9].Resources);
            }
            else
                $scope.FixedFTEDaysJson[9].Days = $scope.FixedFTEDaysJson[9].FTEHours;
            $scope.FixedFTEDaysJson[9].BusinessDays = '';//($scope.FixedFTEDaysJson[9].Daychange.length > 0 ? $scope.FixedFTEDaysJson[9].Daychange : $scope.FixedFTEDaysJson[9].Days);



            $scope.FixedFTEDaysJson[10].Tool = (sum(_.pluck($scope.data, "SQA")));
            $scope.FixedFTEDaysJson[10].Manual = (sum(_.pluck($scope.data1, "SQA")));
            $scope.FixedFTEDaysJson[10].Extend = (sum(_.pluck($scope.data2, "SQA")));

            $scope.FixedFTEDaysJson[10].Total = $scope.FixedFTEDaysJson[10].Tool + $scope.FixedFTEDaysJson[10].Manual + $scope.FixedFTEDaysJson[10].Extend + $scope.FixedFTEDaysJson[10].CalculatedEfforts;
            // $scope.FixedFTEDaysJson[10].Change = '';
            // $scope.FixedFTEDaysJson[10].EffortAuthourize = 'select';
            $scope.FixedFTEDaysJson[10].FTEHours = ($scope.FixedFTEDaysJson[10].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[10].Total) - parseFloat($scope.FixedFTEDaysJson[10].Change) : $scope.FixedFTEDaysJson[10].Total)
            //$scope.FixedFTEDaysJson[10].Resources = '1';
            if ($scope.FixedFTEDaysJson[10].Resources > 0) {
                $scope.FixedFTEDaysJson[10].Days = (parseFloat($scope.FixedFTEDaysJson[10].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[10].Resources);
            }
            else
                $scope.FixedFTEDaysJson[10].Days = $scope.FixedFTEDaysJson[10].FTEHours;

            // $scope.FixedFTEDaysJson[10].Daychange = '';
            // $scope.FixedFTEDaysJson[10].DaysAuthourize = '';
            $scope.FixedFTEDaysJson[10].BusinessDays = '';// ($scope.FixedFTEDaysJson[10].Daychange.length > 0 ? $scope.FixedFTEDaysJson[10].Daychange : $scope.FixedFTEDaysJson[10].Days);


            //PM calc
            $scope.FixedFTEDaysJson[11].Tool = (parseFloat($scope.FixedFTEDaysJson[0].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[1].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[2].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[3].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[4].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[5].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[6].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[7].BusinessDays)) * ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1) * ($scope.OpportunityConfigurationDetail.ProjectManagement / 100);//(sum(_.pluck($scope.data, "SQA"))) its not available on daysheets
            //$scope.FixedFTEDaysJson[11].Manual = $scope.FixedFTEDaysJson[10].Manual;
            $scope.FixedFTEDaysJson[11].Extend = '';
            $scope.FixedFTEDaysJson[11].Total = $scope.FixedFTEDaysJson[11].Manual.length > 0 ? parseFloat($scope.FixedFTEDaysJson[11].Manual) : parseFloat($scope.FixedFTEDaysJson[11].Tool);
            //$scope.FixedFTEDaysJson[11].Total = parseFloat($scope.FixedFTEDaysJson[11].Tool) + parseFloat($scope.FixedFTEDaysJson[11].Manual) + $scope.FixedFTEDaysJson[11].CalculatedEfforts;
            //$scope.FixedFTEDaysJson[11].EffortAuthourize = 'select';
            $scope.FixedFTEDaysJson[11].FTEHours = ($scope.FixedFTEDaysJson[11].Change.length > 0 ? parseFloat($scope.FixedFTEDaysJson[11].Total) - parseFloat($scope.FixedFTEDaysJson[11].Change) : $scope.FixedFTEDaysJson[11].Total)
            // $scope.FixedFTEDaysJson[11].Resources = '1';
            if ($scope.FixedFTEDaysJson[11].Resources > 0) {
                $scope.FixedFTEDaysJson[11].Days = (parseFloat($scope.FixedFTEDaysJson[11].FTEHours) / ($scope.OpportunityDetail.UseManDayshours == 'Hours' ? parseFloat($scope.OpportunityConfigurationDetail.WorkingHoursperDay) : 1)) / parseFloat($scope.FixedFTEDaysJson[11].Resources);
            }
            else
                $scope.FixedFTEDaysJson[11].Days = $scope.FixedFTEDaysJson[11].FTEHours;

            $scope.FixedFTEDaysJson[11].Daychange = '';
            $scope.FixedFTEDaysJson[11].DaysAuthourize = '';
            $scope.FixedFTEDaysJson[11].BusinessDays = '';//($scope.FixedFTEDaysJson[11].Daychange.length > 0 ? $scope.FixedFTEDaysJson[11].Daychange : $scope.FixedFTEDaysJson[11].Days);

            var onsitepercentsum = 0;
            if ($scope.FixedDistributionJson.length > 0) {
                GetOnsitePercentChange(false);
                var onsitepercentsum = (($scope.FixedFTEDaysJson[0].FTEHours + $scope.FixedFTEDaysJson[1].FTEHours * $scope.FixedFTEDaysJson[0].OnsitePercentage) + ($scope.FixedFTEDaysJson[1].FTEHours * $scope.FixedFTEDaysJson[1].OnsitePercentage) + ($scope.FixedFTEDaysJson[2].FTEHours * $scope.FixedFTEDaysJson[2].OnsitePercentage) + ($scope.FixedFTEDaysJson[3].FTEHours * $scope.FixedFTEDaysJson[3].OnsitePercentage) + ($scope.FixedFTEDaysJson[4].FTEHours * $scope.FixedFTEDaysJson[4].OnsitePercentage) + ($scope.FixedFTEDaysJson[5].FTEHours * $scope.FixedFTEDaysJson[5].OnsitePercentage) + ($scope.FixedFTEDaysJson[6].FTEHours * $scope.FixedFTEDaysJson[6].OnsitePercentage) + ($scope.FixedFTEDaysJson[7].FTEHours * $scope.FixedFTEDaysJson[7].OnsitePercentage) + ($scope.FixedFTEDaysJson[8].FTEHours * $scope.FixedFTEDaysJson[8].OnsitePercentage) + ($scope.FixedFTEDaysJson[9].FTEHours * $scope.FixedFTEDaysJson[9].OnsitePercentage) + ($scope.FixedFTEDaysJson[10].FTEHours * $scope.FixedFTEDaysJson[10].OnsitePercentage) + ($scope.FixedFTEDaysJson[11].FTEHours * $scope.FixedFTEDaysJson[11].OnsitePercentage)) / ($scope.FixedFTEDaysJson[0].FTEHours + $scope.FixedFTEDaysJson[1].FTEHours + $scope.FixedFTEDaysJson[2].FTEHours + $scope.FixedFTEDaysJson[3].FTEHours + $scope.FixedFTEDaysJson[4].FTEHours + $scope.FixedFTEDaysJson[5].FTEHours + $scope.FixedFTEDaysJson[6].FTEHours + $scope.FixedFTEDaysJson[7].FTEHours + $scope.FixedFTEDaysJson[8].FTEHours + $scope.FixedFTEDaysJson[9].FTEHours + $scope.FixedFTEDaysJson[10].FTEHours + $scope.FixedFTEDaysJson[11].FTEHours);
            }
            else {
                $scope.FixedFTEDaysJson[0].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[1].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[2].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[3].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[4].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[5].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[6].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[7].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[8].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[9].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[10].OnsitePercentage = '';
                $scope.FixedFTEDaysJson[11].OnsitePercentage = '';
            }

            $scope.gridFTEDays.api.refreshView()
            //$scope.gridFTEDays.api.setRowData($scope.FixedFTEDaysJson);


            totalrowFTE = [{
                SDLCStage: '', Tool: '', Manual: '', Extend: '', CalculatedEfforts: '',
                Total: ($scope.FixedFTEDaysJson[0].Total + $scope.FixedFTEDaysJson[1].Total + $scope.FixedFTEDaysJson[2].Total + $scope.FixedFTEDaysJson[3].Total + $scope.FixedFTEDaysJson[4].Total + $scope.FixedFTEDaysJson[5].Total + $scope.FixedFTEDaysJson[6].Total + $scope.FixedFTEDaysJson[7].Total + $scope.FixedFTEDaysJson[8].Total + $scope.FixedFTEDaysJson[9].Total + $scope.FixedFTEDaysJson[10].Total + $scope.FixedFTEDaysJson[11].Total),
                Change: '', EffortAuthourize: '',
                FTEHours: (parseFloat($scope.FixedFTEDaysJson[0].FTEHours) + parseFloat($scope.FixedFTEDaysJson[1].FTEHours) + parseFloat($scope.FixedFTEDaysJson[2].FTEHours) + parseFloat($scope.FixedFTEDaysJson[3].FTEHours) + parseFloat($scope.FixedFTEDaysJson[4].FTEHours) + parseFloat($scope.FixedFTEDaysJson[5].FTEHours) + parseFloat($scope.FixedFTEDaysJson[6].FTEHours) + parseFloat($scope.FixedFTEDaysJson[7].FTEHours) + parseFloat($scope.FixedFTEDaysJson[8].FTEHours) + parseFloat($scope.FixedFTEDaysJson[9].FTEHours) + parseFloat($scope.FixedFTEDaysJson[10].FTEHours) + parseFloat($scope.FixedFTEDaysJson[11].FTEHours)), Resources: '', Days: ($scope.FixedFTEDaysJson[0].Days + $scope.FixedFTEDaysJson[1].Days + $scope.FixedFTEDaysJson[2].Days + $scope.FixedFTEDaysJson[3].Days + $scope.FixedFTEDaysJson[4].Days + $scope.FixedFTEDaysJson[5].Days + $scope.FixedFTEDaysJson[6].Days + $scope.FixedFTEDaysJson[7].Days + $scope.FixedFTEDaysJson[8].Days + $scope.FixedFTEDaysJson[9].Days + $scope.FixedFTEDaysJson[10].Days + $scope.FixedFTEDaysJson[11].Days), Daychange: '', DaysAuthourize: '', BusinessDays: (parseFloat($scope.FixedFTEDaysJson[0].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[1].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[2].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[3].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[4].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[5].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[6].BusinessDays) + parseFloat($scope.FixedFTEDaysJson[7].BusinessDays)), OnsitePercentage: onsitepercentsum
            }];
            $scope.gridFTEDays.api.setFloatingBottomRowData(totalrowFTE);
            //$scope.gridDistribution.api.setRowData($scope.FixedDistributionJson);
            //$scope.gridPriceCost.api.setRowData($scope.FixedPriceCostJson);

            //TandE api calls
            callTandEGridchange();
            getPricostGriddata();
        }

        function callTandEGridchange() {
            for (var i = 0; i < $scope.FixedFTEDaysJson.length; i++) {
                $scope.PSDataChanged(i, $scope.FixedFTEDaysJson[i]);
            }
        }

        function getcalculatedEffortgriddata() {
            var Defaultonerow = [{
                Description: "Additional Phases", REQ: 0, Design: 0, DevTest: 0, SysTest: 0,
                IMPL: 0, UAT: 0, PROD: 0, TRAIN: 0, MANUAL: 0, OH: 0, SQA: 0, PM: 0, Product: "Fixed", Total: 0,
                GridName: 'CalculatedEffort'
            }];

            Defaultonerow[0].REQ = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Requirements Gathering"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].Design = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Design"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].DevTest = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Development & Test"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].SysTest = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "System Testing"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].IMPL = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Implementation"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].UAT = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "UAT"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].PROD = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Production Support / Cutover"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].TRAIN = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Training"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].MANUAL = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Manuals"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].OH = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Orientation & Handover"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].SQA = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "SQA"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            Defaultonerow[0].PM = _.chain($scope.TandEPSData).filter(function (item) { return item.Description == "Project Management"; }).map(function (item) { return item.TravelManDays; }).value()[0];
            $scope.data3 = Defaultonerow;
            $scope.gridDay4.api.setRowData($scope.data3);

        }

        function getPricostGriddata() {

            if ($scope.FixedDistributionJson.length > 0) {
                //{ SDLCStage: 'Requirements Gathering', PriceBU: '', PriceCDO: '', FTEBUL1: '', FTEBUL2: '', FTECDOL1: '', FTECDOL2: '', CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: '' },


                if ($scope.OpportunityDetail.OEMName.toLowerCase() == "others")
                    $scope.OpportunityDetail.OEMName = "Other";
                console.log("Technical-" + $scope.OpportunityDetail.OEMName + '-BU-L1');
                var BUL1Cost = parseFloat(getcostpriceingridbyfilter("Technical-" + $scope.OpportunityDetail.OEMName + '-BU-L1'));
                var BUL2Cost = parseFloat(getcostpriceingridbyfilter("Technical-" + $scope.OpportunityDetail.OEMName + '-BU-L2'));
                var CDOL1cost = parseFloat(getcostpriceingridbyfilter("Technical-" + $scope.OpportunityDetail.OEMName + '-CDO-L1'));
                var CDOL2cost = parseFloat(getcostpriceingridbyfilter("Technical-" + $scope.OpportunityDetail.OEMName + '-CDO-L2'));

                $scope.FixedPriceCostJson[0].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) *
                    parseFloat($scope.FixedFTEDaysJson[0].FTEHours) *
                    ((parseFloat($scope.FixedDistributionJson[0].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[0].BUOnsiteL2)) * (1 / 100))) +
                    ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[0].BURemoteL1) +
                        parseFloat($scope.FixedDistributionJson[0].BURemoteL2)) * (1 / 100)));

                $scope.FixedPriceCostJson[0].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) *
                    parseFloat($scope.FixedFTEDaysJson[0].FTEHours) * ((parseFloat($scope.FixedDistributionJson[0].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[0].CDOOnsiteL2)) * (1 / 100))) +
                    ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[0].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[0].CDORemoteL2)) * (1 / 100)));


                $scope.FixedPriceCostJson[0].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[0].FTEHours) *
                    ((parseFloat($scope.FixedDistributionJson[0].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[0].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[0].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[0].FTEHours) * ((parseFloat($scope.FixedDistributionJson[0].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[0].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[0].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[0].FTEHours) * ((parseFloat($scope.FixedDistributionJson[0].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[0].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[0].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[0].FTEHours) * ((parseFloat($scope.FixedDistributionJson[0].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[0].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[0].CostBUL1 = $scope.FixedPriceCostJson[0].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[0].CostBUL2 = $scope.FixedPriceCostJson[0].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[0].CostCDOL1 = $scope.FixedPriceCostJson[0].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[0].CostCDOL2 = $scope.FixedPriceCostJson[0].FTECDOL2 * CDOL2cost;

                $scope.FixedPriceCostJson[1].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) *
                    parseFloat($scope.FixedFTEDaysJson[1].FTEHours) * ((parseFloat($scope.FixedDistributionJson[1].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[1].BUOnsiteL2)) * (1 / 100))) +
                    ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[1].BURemoteL1) + parseFloat($scope.FixedDistributionJson[1].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[1].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[1].FTEHours) * (parseFloat($scope.FixedDistributionJson[1].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[1].CDOOnsiteL2))) +
                    ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[1].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[1].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[1].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[1].FTEHours) * ((parseFloat($scope.FixedDistributionJson[1].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[1].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[1].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[1].FTEHours) * ((parseFloat($scope.FixedDistributionJson[1].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[1].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[1].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[1].FTEHours) * ((parseFloat($scope.FixedDistributionJson[1].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[1].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[1].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[1].FTEHours) * ((parseFloat($scope.FixedDistributionJson[1].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[1].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[1].CostBUL1 = $scope.FixedPriceCostJson[1].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[1].CostBUL2 = $scope.FixedPriceCostJson[1].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[1].CostCDOL1 = $scope.FixedPriceCostJson[1].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[1].CostCDOL2 = $scope.FixedPriceCostJson[1].FTECDOL2 * CDOL2cost;


                $scope.FixedPriceCostJson[2].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * (parseFloat($scope.FixedFTEDaysJson[2].FTEHours) * (parseFloat($scope.FixedDistributionJson[2].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[2].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[2].BURemoteL1) + parseFloat($scope.FixedDistributionJson[2].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[2].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[2].FTEHours) * ((parseFloat($scope.FixedDistributionJson[2].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[2].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[2].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[2].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[2].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[2].FTEHours) * ((parseFloat($scope.FixedDistributionJson[2].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[2].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[2].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[2].FTEHours) * ((parseFloat($scope.FixedDistributionJson[2].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[2].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[2].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[2].FTEHours) * ((parseFloat($scope.FixedDistributionJson[2].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[2].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[2].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[2].FTEHours) * ((parseFloat($scope.FixedDistributionJson[2].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[2].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[2].CostBUL1 = $scope.FixedPriceCostJson[2].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[2].CostBUL2 = $scope.FixedPriceCostJson[2].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[2].CostCDOL1 = $scope.FixedPriceCostJson[2].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[2].CostCDOL2 = $scope.FixedPriceCostJson[2].FTECDOL2 * CDOL2cost;


                $scope.FixedPriceCostJson[3].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[3].FTEHours) * ((parseFloat($scope.FixedDistributionJson[3].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[3].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[3].BURemoteL1) + parseFloat($scope.FixedDistributionJson[3].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[3].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * (parseFloat($scope.FixedFTEDaysJson[3].FTEHours) * (parseFloat($scope.FixedDistributionJson[3].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[3].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[3].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[3].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[3].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[3].FTEHours) * ((parseFloat($scope.FixedDistributionJson[3].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[3].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[3].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[3].FTEHours) * ((parseFloat($scope.FixedDistributionJson[3].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[3].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[3].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[3].FTEHours) * ((parseFloat($scope.FixedDistributionJson[3].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[3].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[3].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[3].FTEHours) * ((parseFloat($scope.FixedDistributionJson[3].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[3].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[3].CostBUL1 = $scope.FixedPriceCostJson[3].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[3].CostBUL2 = $scope.FixedPriceCostJson[3].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[3].CostCDOL1 = $scope.FixedPriceCostJson[3].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[3].CostCDOL2 = $scope.FixedPriceCostJson[3].FTECDOL2 * CDOL2cost;



                $scope.FixedPriceCostJson[4].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[4].FTEHours) * ((parseFloat($scope.FixedDistributionJson[4].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[4].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[4].BURemoteL1) + parseFloat($scope.FixedDistributionJson[4].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[4].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[4].FTEHours) * ((parseFloat($scope.FixedDistributionJson[4].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[4].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[4].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[4].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[4].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[4].FTEHours) * ((parseFloat($scope.FixedDistributionJson[4].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[4].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[4].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[4].FTEHours) * ((parseFloat($scope.FixedDistributionJson[4].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[4].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[4].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[4].FTEHours) * ((parseFloat($scope.FixedDistributionJson[4].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[4].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[4].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[4].FTEHours) * ((parseFloat($scope.FixedDistributionJson[4].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[4].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[4].CostBUL1 = $scope.FixedPriceCostJson[4].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[4].CostBUL2 = $scope.FixedPriceCostJson[4].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[4].CostCDOL1 = $scope.FixedPriceCostJson[4].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[4].CostCDOL2 = $scope.FixedPriceCostJson[4].FTECDOL2 * CDOL2cost;



                $scope.FixedPriceCostJson[5].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[5].FTEHours) * ((parseFloat($scope.FixedDistributionJson[5].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[5].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[5].BURemoteL1) + parseFloat($scope.FixedDistributionJson[5].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[5].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[5].FTEHours) * ((parseFloat($scope.FixedDistributionJson[5].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[5].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[5].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[5].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[5].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[5].FTEHours) * ((parseFloat($scope.FixedDistributionJson[5].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[5].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[5].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[5].FTEHours) * ((parseFloat($scope.FixedDistributionJson[5].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[5].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[5].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[5].FTEHours) * ((parseFloat($scope.FixedDistributionJson[5].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[5].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[5].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[5].FTEHours) * ((parseFloat($scope.FixedDistributionJson[5].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[5].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[5].CostBUL1 = $scope.FixedPriceCostJson[5].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[5].CostBUL2 = $scope.FixedPriceCostJson[5].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[5].CostCDOL1 = $scope.FixedPriceCostJson[5].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[5].CostCDOL2 = $scope.FixedPriceCostJson[5].FTECDOL2 * CDOL2cost;



                $scope.FixedPriceCostJson[6].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[6].FTEHours) * ((parseFloat($scope.FixedDistributionJson[6].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[6].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[6].BURemoteL1) + parseFloat($scope.FixedDistributionJson[6].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[6].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[6].FTEHours) * ((parseFloat($scope.FixedDistributionJson[6].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[6].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[6].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[6].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[6].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[6].FTEHours) * ((parseFloat($scope.FixedDistributionJson[6].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[6].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[6].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[6].FTEHours) * ((parseFloat($scope.FixedDistributionJson[6].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[6].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[6].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[6].FTEHours) * ((parseFloat($scope.FixedDistributionJson[6].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[6].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[6].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[6].FTEHours) * ((parseFloat($scope.FixedDistributionJson[6].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[6].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[6].CostBUL1 = $scope.FixedPriceCostJson[6].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[6].CostBUL2 = $scope.FixedPriceCostJson[6].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[6].CostCDOL1 = $scope.FixedPriceCostJson[6].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[6].CostCDOL2 = $scope.FixedPriceCostJson[6].FTECDOL2 * CDOL2cost;



                $scope.FixedPriceCostJson[7].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[7].FTEHours) * ((parseFloat($scope.FixedDistributionJson[7].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[7].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[7].BURemoteL1) + parseFloat($scope.FixedDistributionJson[7].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[7].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[7].FTEHours) * ((parseFloat($scope.FixedDistributionJson[7].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[7].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[7].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[7].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[7].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[7].FTEHours) * ((parseFloat($scope.FixedDistributionJson[7].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[7].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[7].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[7].FTEHours) * ((parseFloat($scope.FixedDistributionJson[7].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[7].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[7].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[7].FTEHours) * ((parseFloat($scope.FixedDistributionJson[7].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[7].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[7].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[7].FTEHours) * ((parseFloat($scope.FixedDistributionJson[7].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[7].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[7].CostBUL1 = $scope.FixedPriceCostJson[7].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[7].CostBUL2 = $scope.FixedPriceCostJson[7].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[7].CostCDOL1 = $scope.FixedPriceCostJson[7].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[7].CostCDOL2 = $scope.FixedPriceCostJson[7].FTECDOL2 * CDOL2cost;

                $scope.FixedPriceCostJson[8].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[8].FTEHours) * (parseFloat($scope.FixedDistributionJson[8].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[8].BUOnsiteL2))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * (parseFloat($scope.FixedDistributionJson[8].BURemoteL1) + parseFloat($scope.FixedDistributionJson[8].BURemoteL2)));
                $scope.FixedPriceCostJson[8].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[8].FTEHours) * (parseFloat($scope.FixedDistributionJson[8].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[8].CDOOnsiteL2))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * (parseFloat($scope.FixedDistributionJson[8].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[8].CDORemoteL2)));
                $scope.FixedPriceCostJson[8].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[8].FTEHours) * ((parseFloat($scope.FixedDistributionJson[8].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[8].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[8].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[8].FTEHours) * ((parseFloat($scope.FixedDistributionJson[8].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[8].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[8].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[8].FTEHours) * ((parseFloat($scope.FixedDistributionJson[8].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[8].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[8].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[8].FTEHours) * ((parseFloat($scope.FixedDistributionJson[8].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[8].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[8].CostBUL1 = $scope.FixedPriceCostJson[8].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[8].CostBUL2 = $scope.FixedPriceCostJson[8].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[8].CostCDOL1 = $scope.FixedPriceCostJson[8].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[8].CostCDOL2 = $scope.FixedPriceCostJson[8].FTECDOL2 * CDOL2cost;



                $scope.FixedPriceCostJson[9].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[9].FTEHours) * ((parseFloat($scope.FixedDistributionJson[9].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[9].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[9].BURemoteL1) + parseFloat($scope.FixedDistributionJson[9].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[9].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[9].FTEHours) * ((parseFloat($scope.FixedDistributionJson[9].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[9].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[9].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[9].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[9].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[9].FTEHours) * ((parseFloat($scope.FixedDistributionJson[9].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[9].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[9].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[9].FTEHours) * ((parseFloat($scope.FixedDistributionJson[9].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[9].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[9].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[9].FTEHours) * ((parseFloat($scope.FixedDistributionJson[9].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[9].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[9].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[9].FTEHours) * ((parseFloat($scope.FixedDistributionJson[9].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[9].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[9].CostBUL1 = $scope.FixedPriceCostJson[9].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[9].CostBUL2 = $scope.FixedPriceCostJson[9].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[9].CostCDOL1 = $scope.FixedPriceCostJson[9].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[9].CostCDOL2 = $scope.FixedPriceCostJson[9].FTECDOL2 * CDOL2cost;


                $scope.FixedPriceCostJson[10].PriceBU = (parseFloat($scope.OpportunityConfigurationDetail.BUOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[10].FTEHours) * ((parseFloat($scope.FixedDistributionJson[10].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[10].BUOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.BURemoteManDaysRate * ((parseFloat($scope.FixedDistributionJson[10].BURemoteL1) + parseFloat($scope.FixedDistributionJson[10].BURemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[10].PriceCDO = (parseFloat($scope.OpportunityConfigurationDetail.CDOOnsiteManDaysRate) * parseFloat($scope.FixedFTEDaysJson[10].FTEHours) * ((parseFloat($scope.FixedDistributionJson[10].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[10].CDOOnsiteL2)) * (1 / 100))) + ($scope.OpportunityConfigurationDetail.CDOOffsiteManDaysRate * ((parseFloat($scope.FixedDistributionJson[10].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[10].CDORemoteL2)) * (1 / 100)));
                $scope.FixedPriceCostJson[10].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[10].FTEHours) * ((parseFloat($scope.FixedDistributionJson[10].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[10].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[10].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[10].FTEHours) * ((parseFloat($scope.FixedDistributionJson[10].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[10].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[10].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[10].FTEHours) * ((parseFloat($scope.FixedDistributionJson[10].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[10].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[10].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[10].FTEHours) * ((parseFloat($scope.FixedDistributionJson[10].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[10].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[10].CostBUL1 = $scope.FixedPriceCostJson[10].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[10].CostBUL2 = $scope.FixedPriceCostJson[10].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[10].CostCDOL1 = $scope.FixedPriceCostJson[10].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[10].CostCDOL2 = $scope.FixedPriceCostJson[10].FTECDOL2 * CDOL2cost;

                $scope.FixedPriceCostJson[11].PriceBU = parseFloat($scope.OpportunityConfigurationDetail.BUPMManDaysRate) * (parseFloat($scope.FixedFTEDaysJson[11].FTEHours) * (parseFloat($scope.FixedDistributionJson[11].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[11].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[11].BURemoteL1) + parseFloat($scope.FixedDistributionJson[11].BURemoteL2)) * (1 / 100));
                $scope.FixedPriceCostJson[11].PriceCDO = parseFloat($scope.OpportunityConfigurationDetail.CDOPMManDaysRate) * (parseFloat($scope.FixedFTEDaysJson[11].FTEHours) * (parseFloat($scope.FixedDistributionJson[11].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[11].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[11].CDORemoteL1) + parseFloat($scope.FixedDistributionJson[11].CDORemoteL2)) * (1 / 100));
                $scope.FixedPriceCostJson[11].FTEBUL1 = parseFloat($scope.FixedFTEDaysJson[11].FTEHours) * ((parseFloat($scope.FixedDistributionJson[11].BUOnsiteL1) + parseFloat($scope.FixedDistributionJson[11].BURemoteL1)) / 100);
                $scope.FixedPriceCostJson[11].FTEBUL2 = parseFloat($scope.FixedFTEDaysJson[11].FTEHours) * ((parseFloat($scope.FixedDistributionJson[11].BUOnsiteL2) + parseFloat($scope.FixedDistributionJson[11].BURemoteL2)) / 100);
                $scope.FixedPriceCostJson[11].FTECDOL1 = parseFloat($scope.FixedFTEDaysJson[11].FTEHours) * ((parseFloat($scope.FixedDistributionJson[11].CDOOnsiteL1) + parseFloat($scope.FixedDistributionJson[11].CDORemoteL1)) / 100);
                $scope.FixedPriceCostJson[11].FTECDOL2 = parseFloat($scope.FixedFTEDaysJson[11].FTEHours) * ((parseFloat($scope.FixedDistributionJson[11].CDOOnsiteL2) + parseFloat($scope.FixedDistributionJson[11].CDORemoteL2)) / 100);
                $scope.FixedPriceCostJson[11].CostBUL1 = $scope.FixedPriceCostJson[11].FTEBUL1 * BUL1Cost;
                $scope.FixedPriceCostJson[11].CostBUL2 = $scope.FixedPriceCostJson[11].FTEBUL2 * BUL2Cost;
                $scope.FixedPriceCostJson[11].CostCDOL1 = $scope.FixedPriceCostJson[11].FTECDOL1 * CDOL1cost;
                $scope.FixedPriceCostJson[11].CostCDOL2 = $scope.FixedPriceCostJson[11].FTECDOL2 * CDOL2cost;

                $scope.gridDistribution.api.setRowData($scope.FixedDistributionJson);
                $scope.gridPriceCost.api.setRowData($scope.FixedPriceCostJson);


                totalrowPriceCost = [{
                    SDLCStage: 'TOTAL', PriceBU: ($scope.FixedPriceCostJson[0].PriceBU + $scope.FixedPriceCostJson[1].PriceBU + $scope.FixedPriceCostJson[2].PriceBU + $scope.FixedPriceCostJson[3].PriceBU + $scope.FixedPriceCostJson[4].PriceBU + $scope.FixedPriceCostJson[5].PriceBU + $scope.FixedPriceCostJson[6].PriceBU + $scope.FixedPriceCostJson[7].PriceBU + $scope.FixedPriceCostJson[8].PriceBU + $scope.FixedPriceCostJson[9].PriceBU + $scope.FixedPriceCostJson[10].PriceBU + $scope.FixedPriceCostJson[11].PriceBU), PriceCDO:
                    ($scope.FixedPriceCostJson[0].PriceCDO + $scope.FixedPriceCostJson[1].PriceCDO + $scope.FixedPriceCostJson[2].PriceCDO + $scope.FixedPriceCostJson[3].PriceCDO + $scope.FixedPriceCostJson[4].PriceCDO + $scope.FixedPriceCostJson[5].PriceCDO + $scope.FixedPriceCostJson[6].PriceCDO + $scope.FixedPriceCostJson[7].PriceCDO + $scope.FixedPriceCostJson[8].PriceCDO + $scope.FixedPriceCostJson[9].PriceCDO + $scope.FixedPriceCostJson[10].PriceCDO + $scope.FixedPriceCostJson[11].PriceCDO)

                    , FTEBUL1:
                    ($scope.FixedPriceCostJson[0].FTEBUL1 + $scope.FixedPriceCostJson[1].FTEBUL1 + $scope.FixedPriceCostJson[2].FTEBUL1 + $scope.FixedPriceCostJson[3].FTEBUL1 + $scope.FixedPriceCostJson[4].FTEBUL1 + $scope.FixedPriceCostJson[5].FTEBUL1 + $scope.FixedPriceCostJson[6].FTEBUL1 + $scope.FixedPriceCostJson[7].FTEBUL1 + $scope.FixedPriceCostJson[8].FTEBUL1 + $scope.FixedPriceCostJson[9].FTEBUL1 + $scope.FixedPriceCostJson[10].FTEBUL1 + $scope.FixedPriceCostJson[11].FTEBUL1)
                    , FTEBUL2:
                    ($scope.FixedPriceCostJson[0].FTEBUL2 + $scope.FixedPriceCostJson[1].FTEBUL2 + $scope.FixedPriceCostJson[2].FTEBUL2 + $scope.FixedPriceCostJson[3].FTEBUL2 + $scope.FixedPriceCostJson[4].FTEBUL2 + $scope.FixedPriceCostJson[5].FTEBUL2 + $scope.FixedPriceCostJson[6].FTEBUL2 + $scope.FixedPriceCostJson[7].FTEBUL2 + $scope.FixedPriceCostJson[8].FTEBUL2 + $scope.FixedPriceCostJson[9].FTEBUL2 + $scope.FixedPriceCostJson[10].FTEBUL2 + $scope.FixedPriceCostJson[11].FTEBUL2)
                    , FTECDOL1:

                    ($scope.FixedPriceCostJson[0].FTECDOL1 + $scope.FixedPriceCostJson[1].FTECDOL1 + $scope.FixedPriceCostJson[2].FTECDOL1 + $scope.FixedPriceCostJson[3].FTECDOL1 + $scope.FixedPriceCostJson[4].FTECDOL1 + $scope.FixedPriceCostJson[5].FTECDOL1 + $scope.FixedPriceCostJson[6].FTECDOL1 + $scope.FixedPriceCostJson[7].FTECDOL1 + $scope.FixedPriceCostJson[8].FTECDOL1 + $scope.FixedPriceCostJson[9].FTECDOL1 + $scope.FixedPriceCostJson[10].FTECDOL1 + $scope.FixedPriceCostJson[11].FTECDOL1)
                    , FTECDOL2:
                    ($scope.FixedPriceCostJson[0].FTECDOL2 + $scope.FixedPriceCostJson[1].FTECDOL2 + $scope.FixedPriceCostJson[2].FTECDOL2 + $scope.FixedPriceCostJson[3].FTECDOL2 + $scope.FixedPriceCostJson[4].FTECDOL2 + $scope.FixedPriceCostJson[5].FTECDOL2 + $scope.FixedPriceCostJson[6].FTECDOL2 + $scope.FixedPriceCostJson[7].FTECDOL2 + $scope.FixedPriceCostJson[8].FTECDOL2 + $scope.FixedPriceCostJson[9].FTECDOL2 + $scope.FixedPriceCostJson[10].FTECDOL2 + $scope.FixedPriceCostJson[11].FTECDOL2)
                    , CostBUL1:
                    ($scope.FixedPriceCostJson[0].CostBUL1 + $scope.FixedPriceCostJson[1].CostBUL1 + $scope.FixedPriceCostJson[2].CostBUL1 + $scope.FixedPriceCostJson[3].CostBUL1 + $scope.FixedPriceCostJson[4].CostBUL1 + $scope.FixedPriceCostJson[5].CostBUL1 + $scope.FixedPriceCostJson[6].CostBUL1 + $scope.FixedPriceCostJson[7].CostBUL1 + $scope.FixedPriceCostJson[8].CostBUL1 + $scope.FixedPriceCostJson[9].CostBUL1 + $scope.FixedPriceCostJson[10].CostBUL1 + $scope.FixedPriceCostJson[11].CostBUL1)
                    , CostBUL2:
                    ($scope.FixedPriceCostJson[0].CostBUL2 + $scope.FixedPriceCostJson[1].CostBUL2 + $scope.FixedPriceCostJson[2].CostBUL2 + $scope.FixedPriceCostJson[3].CostBUL2 + $scope.FixedPriceCostJson[4].CostBUL2 + $scope.FixedPriceCostJson[5].CostBUL2 + $scope.FixedPriceCostJson[6].CostBUL2 + $scope.FixedPriceCostJson[7].CostBUL2 + $scope.FixedPriceCostJson[8].CostBUL2 + $scope.FixedPriceCostJson[9].CostBUL2 + $scope.FixedPriceCostJson[10].CostBUL2 + $scope.FixedPriceCostJson[11].CostBUL2)

                    , CostCDOL1: ($scope.FixedPriceCostJson[0].CostCDOL1 + $scope.FixedPriceCostJson[1].CostCDOL1 + $scope.FixedPriceCostJson[2].CostCDOL1 + $scope.FixedPriceCostJson[3].CostCDOL1 + $scope.FixedPriceCostJson[4].CostCDOL1 + $scope.FixedPriceCostJson[5].CostCDOL1 + $scope.FixedPriceCostJson[6].CostCDOL1 + $scope.FixedPriceCostJson[7].CostCDOL1 + $scope.FixedPriceCostJson[8].CostCDOL1 + $scope.FixedPriceCostJson[9].CostCDOL1 + $scope.FixedPriceCostJson[10].CostCDOL1 + $scope.FixedPriceCostJson[11].CostCDOL1),
                    CostCDOL2: ($scope.FixedPriceCostJson[0].CostCDOL2 + $scope.FixedPriceCostJson[1].CostCDOL2 + $scope.FixedPriceCostJson[2].CostCDOL2 + $scope.FixedPriceCostJson[3].CostCDOL2 + $scope.FixedPriceCostJson[4].CostCDOL2 + $scope.FixedPriceCostJson[5].CostCDOL2 + $scope.FixedPriceCostJson[6].CostCDOL2 + $scope.FixedPriceCostJson[7].CostCDOL2 + $scope.FixedPriceCostJson[8].CostCDOL2 + $scope.FixedPriceCostJson[9].CostCDOL2 + $scope.FixedPriceCostJson[10].CostCDOL2 + $scope.FixedPriceCostJson[11].CostCDOL2)
                }];

                var basetotal = (totalrowPriceCost[0].FTEBUL1 + totalrowPriceCost[0].FTEBUL2 + totalrowPriceCost[0].FTECDOL1 + totalrowPriceCost[0].FTECDOL2)
                totalrowPriceCost.push({ SDLCStage: '', PriceBU: '', PriceCDO: (totalrowPriceCost[0].PriceBU + totalrowPriceCost[0].PriceCDO), FTEBUL1: (totalrowPriceCost[0].FTEBUL1 / basetotal) * 100, FTEBUL2: (totalrowPriceCost[0].FTEBUL2 / basetotal) * 100, FTECDOL1: (totalrowPriceCost[0].FTECDOL1 / basetotal) * 100, FTECDOL2: (totalrowPriceCost[0].FTECDOL2 / basetotal) * 100, CostBUL1: '', CostBUL2: '', CostCDOL1: '', CostCDOL2: (totalrowPriceCost[0].CostBUL1 + totalrowPriceCost[0].CostBUL2 + totalrowPriceCost[0].CostCDOL1 + totalrowPriceCost[0].CostCDOL2) })

                $scope.gridPriceCost.api.setFloatingBottomRowData(totalrowPriceCost);
            }
        }

        function GetOnsitePercentChange(status) {

            if ($scope.FixedDistributionJson.length > 0) {
                $scope.FixedFTEDaysJson[0].OnsitePercentage = parseInt($scope.FixedDistributionJson[0].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[0].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[0].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[0].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[1].OnsitePercentage = parseInt($scope.FixedDistributionJson[1].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[1].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[1].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[1].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[2].OnsitePercentage = parseInt($scope.FixedDistributionJson[2].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[2].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[2].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[2].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[3].OnsitePercentage = parseInt($scope.FixedDistributionJson[3].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[3].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[3].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[3].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[4].OnsitePercentage = parseInt($scope.FixedDistributionJson[4].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[4].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[4].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[4].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[5].OnsitePercentage = parseInt($scope.FixedDistributionJson[5].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[5].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[5].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[5].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[6].OnsitePercentage = parseInt($scope.FixedDistributionJson[6].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[6].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[6].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[6].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[7].OnsitePercentage = parseInt($scope.FixedDistributionJson[7].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[7].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[7].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[7].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[8].OnsitePercentage = parseInt($scope.FixedDistributionJson[8].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[8].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[8].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[8].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[9].OnsitePercentage = parseInt($scope.FixedDistributionJson[9].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[9].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[9].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[9].CDOOnsiteL2);
                $scope.FixedFTEDaysJson[10].OnsitePercentage = parseInt($scope.FixedDistributionJson[10].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[10].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[10].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[10].CDOOnsiteL2);
                //PM calc
                $scope.FixedFTEDaysJson[11].OnsitePercentage = parseInt($scope.FixedDistributionJson[11].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[11].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[11].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[11].CDOOnsiteL2);
            }

            //TandE api calls
            callTandEGridchange();

            if (status) {
                $scope.gridFTEDays.api.setRowData($scope.FixedFTEDaysJson);
                getPricostGriddata();
            }
        }

        function getcostpriceingridbyfilter(desc) {
            var data = _.filter($scope.GrossMargins_GRDDATA, function (someThing) {
                return someThing.mode_type == desc;
            });
            return _.pluck(data, $scope.OpportunityDetail.Currency);
        }

        //getting extended efforts submission or change
        $scope.changeExtendedEffort = function () {

            $scope.data2[0].REQ = (($scope.ExtendedEffortPercentage.REQ * (1 / 100)) * ($scope.ExtendedEffortCycle.REQ - 1)) * (sum(_.pluck($scope.data, "REQ")) + sum(_.pluck($scope.data1, "REQ")));
            $scope.data2[0].Design = (($scope.ExtendedEffortPercentage.Design * (1 / 100)) * ($scope.ExtendedEffortCycle.Design - 1)) * (sum(_.pluck($scope.data, "Design")) + sum(_.pluck($scope.data1, "Design")));
            $scope.data2[0].DevTest = (($scope.ExtendedEffortPercentage.DevTest * (1 / 100)) * ($scope.ExtendedEffortCycle.DevTest - 1)) * (sum(_.pluck($scope.data, "DevTest")) + sum(_.pluck($scope.data1, "DevTest")));
            $scope.data2[0].ST = (($scope.ExtendedEffortPercentage.ST * (1 / 100)) * ($scope.ExtendedEffortCycle.SysTest - 1)) * (sum(_.pluck($scope.data, "SysTest")) + sum(_.pluck($scope.data1, "SysTest")));
            $scope.data2[0].IMPL = (($scope.ExtendedEffortPercentage.IMPL * (1 / 100)) * ($scope.ExtendedEffortCycle.IMPL - 1)) * (sum(_.pluck($scope.data, "IMPL")) + sum(_.pluck($scope.data1, "IMPL")));
            $scope.data2[0].UAT = (($scope.ExtendedEffortPercentage.UAT * (1 / 100)) * ($scope.ExtendedEffortCycle.UAT - 1)) * (sum(_.pluck($scope.data, "UAT")) + sum(_.pluck($scope.data1, "UAT")));
            $scope.data2[0].PROD = (($scope.ExtendedEffortPercentage.PROD * (1 / 100)) * ($scope.ExtendedEffortCycle.PROD - 1)) * (sum(_.pluck($scope.data, "PROD")) + sum(_.pluck($scope.data1, "PROD")));
            $scope.data2[0].TRAIN = (($scope.ExtendedEffortPercentage.Train * (1 / 100)) * ($scope.ExtendedEffortCycle.Train - 1)) * (sum(_.pluck($scope.data, "TRAIN")) + sum(_.pluck($scope.data1, "TRAIN")));
            $scope.data2[0].MANUAL = (($scope.ExtendedEffortPercentage.Manual * (1 / 100)) * ($scope.ExtendedEffortCycle.Manual - 1)) * (sum(_.pluck($scope.data, "MANUAL")) + sum(_.pluck($scope.data1, "MANUAL")));
            $scope.data2[0].OH = (($scope.ExtendedEffortPercentage.OH * (1 / 100)) * ($scope.ExtendedEffortCycle.OH - 1)) * (sum(_.pluck($scope.data, "OH")) + sum(_.pluck($scope.data1, "OH")));
            $scope.data2[0].SQA = (($scope.ExtendedEffortPercentage.SQA * (1 / 100)) * ($scope.ExtendedEffortCycle.SQA - 1)) * (sum(_.pluck($scope.data, "SQA")) + sum(_.pluck($scope.data1, "SQA")));
            $scope.gridDay3.rowData = $scope.data2;
            $scope.gridDay3.api.setRowData($scope.data2);
            $timeout(function () {
                $scope.gridDay3.api.refreshView();
            });
            FindProjectComplexity();
        }
        //getting extended efforts submission


        function sum(numbers) {
            return _.reduce(numbers, function (result, current) {
                if (current != '--' && current != '')
                    return result + parseFloat(current);
                else
                    return result + 0;
            }, 0);
        }

        $scope.addUserGrid = {
            columnDefs: [
                { headerName: "UserID", field: "userId", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
                { headerName: "Name", field: "UserName", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
                { headerName: "Email", field: "EmailId", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
                {
                    headerName: "", field: "chkAddUser", checkboxSelection: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    cellRenderer: function (params) {
                        if ($scope.UpdatedUserTypes.length > 0) {
                            angular.forEach($scope.UpdatedUserTypes, function (value, key) {
                                if (params.data.EmailId == value.EmailId) {
                                    params.node.setSelected(true);
                                }
                            });
                        }
                        return '';
                    }
                }
            ],

            rowData: null,
            enableFilter: true,
            rowHeight: 25,
            headerHeight: 30,
            pinnedColumnCount: 1,
            enableColResize: true,
            rowSelection: 'multiple',
            suppressRowClickSelection: true,
            suppressHorizontalScroll: true,
            suppressCellSelection: true,
            onRowSelected: function (event) {
                $scope.chkChanged(event.node);
            },
            onGridReady: function (event) {
                $scope.addUserGrid.api.sizeColumnsToFit();
                //$timeout(function () {
                // angular.element(document.querySelector('#loader')).addClass('hide');
                //}, 500);
            }
        };

        $scope.chkChanged = function (event) {
            var isAddedAlready = false;
            if (event.selected == true) {
                angular.forEach($scope.UpdatedUserTypes, function (value, key) {
                    if (event.data.EmailId == value.EmailId) {
                        isAddedAlready = true;
                    }
                });
                if (!isAddedAlready)
                    $scope.UpdatedUserTypes.push({ 'userId': event.data.userId, 'UserName': event.data.UserName, 'EmailId': event.data.EmailId, 'checked': 1 });
            }
            else {
                for (var i = $scope.UpdatedUserTypes.length - 1; i >= 0; i--) {
                    if ($scope.UpdatedUserTypes[i].EmailId == event.data.EmailId) {
                        $scope.UpdatedUserTypes.splice(i, 1);
                    }
                }
            }
        }

        $scope.showSelectedUsers = function (isChecked) {
            if (isChecked) {
                console.log('setting row data');
                $scope.addUserGrid.api.setRowData($scope.UpdatedUserTypes);
                $timeout(function () {
                    $scope.addUserGrid.api.refreshView();
                }, 100);
            }
            else {
                $scope.addUserGrid.api.setRowData($scope.UserTypes);
                $timeout(function () {
                    $scope.addUserGrid.api.refreshView();
                }, 100);
            }
        }

        $scope.GetADUsers = function () {

            UserFactory.GetAllADUsers().success(function (data) {

                $scope.ConvertToUserTypes(data);
            }).error(function (error) {
                $scope.Error = error;
            });
        };

        $scope.ConvertToUserTypes = function (data) {
            $scope.UserTypes = [];
            angular.forEach(data, function (value, key) {
                $scope.UserTypes.push({ 'userId': value.Userid, 'UserName': value.UserName, 'EmailId': value.EmailId, 'checked': 1 });
            });
            $scope.addUserGrid.api.setRowData($scope.UserTypes);
            $timeout(function () {
                $scope.addUserGrid.api.refreshView();
            }, 100);
        };


        $scope.getSelected = function () {
            // debugger;
            var type = $scope.GridType;
            var gridkey = $scope.GridKey;


            var username = '';
            _.each($scope.UpdatedUserTypes, function (value, key) {
                username += value.EmailId + ','
            });

            username = username.substring(0, username.length - 1);
            _.each($scope.FixedFTEDaysJson, function (value, key) {
                if (value["SDLCStage"] == gridkey) {
                    if (type == 'FTE')
                        value["EffortAuthourize"] = username;
                    else
                        value["DaysAuthourize"] = username;
                }
            });
            $scope.gridFTEDays.api.setRowData($scope.FixedFTEDaysJson);
            $scope.gridDistribution.api.setRowData($scope.FixedDistributionJson);
            $scope.gridPriceCost.api.setRowData($scope.FixedPriceCostJson);
            $('#userModel').modal('hide');
        }

        $scope.EditGridModel = function (type, key, value) {

            $scope.GridType = type;
            $scope.GridKey = key;

            if (value == 'select')
                value = ''

            $scope.UpdatedUserTypes = [];

            if (value.length > 0) {
                var array = value.split(',');
                _.each(array, function (value, key) {
                    $scope.UpdatedUserTypes.push({ 'userId': value, 'UserName': value, 'EmailId': value, 'checked': 1 });
                });

            }

            angular.element(document.querySelector('#loader')).removeClass('hide');


            $scope.user = {};
            $scope.GetADUsers();
            $scope.editMode = false;
            // this.adduserform.$setPristine(); //for form reset
            $('#userModel').modal('show');
            $timeout(function () {
                angular.element(document.querySelector('#loader')).addClass('hide');
            }, 500);

        };

        $scope.cancel = function () {
            $scope.user = {};
            $('#userModel').modal('hide');
        }


        $scope.InitApiCalls_Daysheet = function () {
            //-----------------------------------------------
            // Page Load Calls
            //-----------------------------------------------

            $scope.GetOpportunityList($routeParams.OppId);
            $scope.GetMaximumGroupPriceSheetId();

            $scope.resetselection();
            $scope.checkIFFreshsheet();
            $scope.GetAllManualEstimationType();

            //-----------------------------------------------
            // Page Load Calls
            //-----------------------------------------------
        }

        $scope.InitApiCalls_Daysheet();




        ///-----------------------------------
        ///PriceSheetCode Integration
        ///-----------------------------------



        $scope.PageVariableInitialization_PriceList = function () {
            $scope.Isleaving_PriceList = true;
            $scope.DefautState_PriceList = false;


            $scope.OpportunityDetail_PriceList;
            $scope.ChildOpportunity_PriceList = [];
            $scope.GlobalIdentityOppId_PriceList = $routeParams.OppId;
            $scope.GlobalGroupId_PriceList = $routeParams.GroupId;

            $scope.IsfreshSheet_PriceList = false;
            $scope.data_PriceList = [];

            $scope.griduseredit_PriceList = false;
            $scope.hasedit_PriceList = false;
            $scope.sheetholdedby_PriceList = '';
            $scope.Totalresult_PriceList;

            $scope.call1finished_PriceList = false;
            $scope.call2finished_PriceList = false;
            $scope.call3finished_PriceList = false;
            //$scope.call4finished_PriceList = false;
            $scope.call5finished_PriceList = false;
            $scope.call6finished_PriceList = false;
            $scope.call7finished_PriceList = false;
            $scope.call8finished_PriceList = false;
            $scope.call9finished_PriceList = false;
            $scope.call10finished_PriceList = false;
            $scope.call11finished_PriceList = false;
            $scope.call12finished_PriceList = false;
            $scope.call13finished_PriceList = false;
            $scope.call14finished_PriceList = false;//margin
            $scope.call15finished_PriceList = false;//discount

            $scope.grideditable_PriceList = false;
            $scope.MaxSheetGroupID_PriceList;
            $scope.MaxVersion_PriceList;

            // $scope.ServionLegalEntityName = '--Select--';
            $scope.MaxSheetGroupIDForSaveAs_PriceList;
            $scope.ProductList_PriceList;
            $scope.CurrencyList_PriceList;
            $scope.IsReadOnly_PriceList = false;

            //default configuration related to legal entity
            $scope.IsDefaultRecordFoundForLegal_PriceList = false;
            $scope.DefaultCurrency_PriceList;
            $scope.DefaultConversionRate_PriceList;
            $scope.DefaultServionLegalEntity_PriceList;
            $scope.DefaultServionLegalEntityID_PriceList;
            //default configuration related to legal entity

            $scope.yearid = 5;

            //Start Expand/Collapse action temporarly removed
            $scope.ExpandState_PriceList = false;

            //initialize Grid options
            $scope.gridOptions_PriceList = {
                angularCompileRows: true,
                columnDefs: [],
                rowSelection: 'single',
                enableFilter: true,
                groupHeaders: true,
                headerHeight: 36,
                rowHeight: 24,
                rowData: $scope.data_PriceList,
                enableColResize: true,
                groupSuppressAutoColumn: false,
                groupSuppressGroupColumn: true,
                enableCellExpressions: true,
                suppressMovableColumns: true,
                singleClickEdit: true,
                onSelectionChanged: onSelectionChanged,


                icons: {
                    menu: '<i class="fa fa-bars"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                    groupExpanded: '<i class="fa fa-minus-square-o"/>',
                    groupContracted: '<i class="fa fa-plus-square-o"/>',
                    columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                    columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
                },
                onRowClicked: function (event) {
                    //  alert('a')
                    //if (!$scope.grideditable_PriceList)
                    //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

                    //var selectedRows = $scope.gridOptions_PriceList.api.getSelectedRows();
                    //console.log('a row clicked');
                },
                columnGroupOpened: function (event) {
                    // alert('s');
                },
                onGridReady: function (event) {
                    //$scope.gridOptions_PriceList.api.sizeColumnsToFit();
                    if ($scope.data_PriceList.length > 0)
                        onFloatingBottomCount_PriceList(1);
                },
                onCellValueChanged: cellValueChangedFunction,
                enableSorting: true,
                getRowStyle: function (params) {
                    if (params.node.floating) {
                        return { 'font-weight': 'bold', 'background-color': '#fff' }
                    }
                },
                floatingBottomRowData: [],
                headerCellRenderer: headerCellRendererFunc
            };

        }

        $scope.PageVariableInitialization_PriceList();

        $scope.clear_PriceList = function () {
            toaster.clear();
        };

        $scope.GetMarginbyBU_PriceList = function (buid, regionid) {
            priceService.GetMarginbyBU(buid, regionid).success(function (data) {
                //have to use margin threshold
                $scope.margin = data;
                $scope.call14finished_PriceList = true;
                $scope.callifAPIDone();

            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetDiscountbyBU_PriceList = function (buid, regionid) {
            priceService.GetDiscountbyBU(buid, regionid).success(function (data) {
                //have to use discount threshold
                $scope.discount = data;
                $scope.call15finished_PriceList = true;
                $scope.callifAPIDone();

            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.IsPageReadOnly_PriceList = function () {
            var isRead = true;
            $scope.IsReadOnly_PriceList = true;
            reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
                angular.forEach(rights.data, function (value, key) {
                    if (value.RightName == 'Pricing Write') {
                        isRead = false;
                    }
                })
                if (!isRead) {
                    $scope.IsReadOnly_PriceList = false;
                }
            });
        }

        $scope.GetPriceSheetVersionsForOpp_PriceList = function (oppid) {
            console.log('oppid, groupid' + oppid)
            priceService.GetPriceSheetVersionsForOpp(oppid).success(function (data) {
                $scope.Versiondata = data;
                $scope.Versions = data;
                $scope.VersionInfo = {};
                $scope.CurrentVersiondata = {};
                _.each($scope.Versiondata, function (value, key) {
                    if (value["PriceSheetId"] == $scope.GlobalGroupId_PriceList) {
                        $scope.CurrentVersiondata = value;
                        $scope.VersionInfo = value;
                        $scope.Version = value["Version"];
                    }
                });


            }).error(function (error) {
                $scope.Error = error;
            })
        };


        function resetgridcollapsestate_PriceList() {
            try {
                var coldata = $scope.CurrentVersiondata.ColStatus;

                var splitdata = coldata.split(',');
                for (var i = 0; i < splitdata.length; i++) {
                    var innersplit = splitdata[i].split(':')
                    $scope.gridOptions_PriceList.columnApi.setColumnGroupOpened('Group' + innersplit[0], JSON.parse(innersplit[1]));
                }
            }
            catch (ex) {
                console.log('error in collaspe and expand' + ex)
            }
        }

        //first call to get details about the sheet

        $scope.checkIFFreshsheet_PriceList = function () {
            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                $scope.IsfreshSheet_PriceList = true;
            }
        }

        //GetDefaultLegalEntity SBUId,RegionId
        //GetLegalEntityFromOpp Id -done
        //GetCurrencyFromLegalEntity Id

        //have to show in first
        $scope.GetDefaultLegalEntity_PriceList = function (sbuid, regionid) {
            priceService.GetDefaultLegalEntity(sbuid, regionid).success(function (data) {
                //have main default values here

                if (data.length > 0) {
                    var condition = false;
                    if (data.length > 1) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsDefault == "Y") {
                                condition = true;
                                $scope.DefaultLegalEntities = data[i];
                                //console.log($scope.DefaultLegalEntities)
                                $scope.IsDefaultRecordFoundForLegal_PriceList = true;
                                $scope.DefaultCurrency_PriceList = data[i].Currency;
                                $scope.DefaultCurrency_PriceListID = data[i].CurrencyID;

                                $scope.DefaultConversionRate_PriceList = data[i].ConversionRate;
                                $scope.ServionLegalEntityName = data[i].ServionLegalEntity;
                                $scope.OpportunityDetail_PriceList.ServionLegalEntity = data[i].ServionLegalEntityID;//default legalentity ID
                                $scope.ServionLegalEntities = checkiflegalentityisthere(data[i].ServionLegalEntityID, data[i].ServionLegalEntity)
                            }
                        }
                        if (!condition) {
                            $scope.DefaultLegalEntities = data;
                            //console.log($scope.DefaultLegalEntities)
                            $scope.IsDefaultRecordFoundForLegal_PriceList = true;
                            $scope.DefaultCurrency_PriceList = data[0].Currency;
                            $scope.DefaultCurrency_PriceListID = data[0].CurrencyID;

                            $scope.DefaultConversionRate_PriceList = data[0].ConversionRate;
                            $scope.ServionLegalEntityName = data[0].ServionLegalEntity;
                            $scope.OpportunityDetail_PriceList.ServionLegalEntity = data[0].ServionLegalEntityID;//default legalentity ID

                            $scope.ServionLegalEntities = checkiflegalentityisthere(data[0].ServionLegalEntityID, data[0].ServionLegalEntity)
                        }

                    }
                    else {
                        $scope.DefaultLegalEntities = data;
                        //console.log($scope.DefaultLegalEntities)
                        $scope.IsDefaultRecordFoundForLegal_PriceList = true;
                        $scope.DefaultCurrency_PriceList = data[0].Currency;
                        $scope.DefaultCurrency_PriceListID = data[0].CurrencyID;

                        $scope.DefaultConversionRate_PriceList = data[0].ConversionRate;
                        $scope.ServionLegalEntityName = data[0].ServionLegalEntity;
                        $scope.OpportunityDetail_PriceList.ServionLegalEntity = data[0].ServionLegalEntityID;//default legalentity ID

                        $scope.ServionLegalEntities = checkiflegalentityisthere(data[0].ServionLegalEntityID, data[0].ServionLegalEntity)
                    }
                }
                else {

                    $scope.OpportunityDetail_PriceList.ServionLegalEntity = 1;
                    $scope.ServionLegalEntityName = '--Select--';
                    $scope.DefaultCurrency_PriceList = '';
                    $scope.DefaultConversionRate_PriceList = 'NA';
                }
                //data
                // $scope.GetCurrencyFromLegalEntity(data[0].ServionLegalEntityID);
                $scope.call13finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetLegalEntityFromOpp_PriceList = function (Oppid) {
            priceService.GetLegalEntityFromOpp(Oppid).success(function (data) {
                $scope.ServionLegalEntities = data;
                //data
                var localcountry = '-1';
                console.log('country id' + $scope.OpportunityDetail_PriceList.CountryId)

                if ($scope.OpportunityDetail_PriceList.CountryId != null)
                    var localcountry = $scope.OpportunityDetail_PriceList.CountryId;

                $scope.GetDefaultLegalEntity_PriceList($scope.OpportunityDetail_PriceList.SBUId, localcountry);

                //if (data != null) {
                //    $scope.ServionLegalEntityName = getValue($scope.OpportunityDetail_PriceList.ServionLegalEntity, $scope.ServionLegalEntities);
                //}
                $scope.call8finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };


        //do legal entity first and then remove if it is already there...


        function checkiflegalentityisthere(legalentityid, legalentity) {

            var test = _.reject($scope.ServionLegalEntities, function (obj) {
                if (parseInt(obj.ServionLegalEntityID) == parseInt(legalentityid)) {
                    return obj;
                }
            });

            test.splice(0, 0, { ServionLegalEntityID: legalentityid, ServionLegalEntity: legalentity });

            return test;

        }


        //do legal entity first and then remove if it is already there... its my base

        // $scope.GetOpportunityList_PriceList = function (id) {
        //     Opportunityservice.GetopportunitybyID(id).success(function (data) {
        //         if (data != null && data.length > 0) {
        //         }
        //         else {
        //             toaster.pop('error', "Error", 'Invalid Opportunity Details', null);
        //             $window.location.href = "home";
        //         }
        //     });
        // }



        $scope.GetAllChildOpportunity_PriceList = function (OppId) {

            priceService.ChildOpportunity(OppId).success(function (data) {
                $scope.ChildOpportunity_PriceList = data;
                $scope.ChildOpportunity_PriceList.push({ 'OppId': $scope.OpportunityDetail_PriceList.OppId });
                $scope.call12finished_PriceList = true;
                $scope.callifAPIDone();

            }).error(function (error) {
                $scope.Error = error;
            })
        }

        $scope.GetCurrencyConversionForPricing = function (ServionLegalEntityId, SBUId, CountryId, CurrencyId) {
            currencyService.GetCurrencyConversionForPricing(ServionLegalEntityId, SBUId, CountryId, CurrencyId).success(function (data) {
                if (data != null && data.length > 0) {
                    //$scope.CurrencyList_PriceList = data;
                    $scope.data_PriceList[$scope.currentworkingrow].ConversionRate = data[0].ConversionRate;
                    //Currency Conversion
                    getFinalCurrencyConversionRate($scope.data_PriceList[$scope.currentworkingrow]);
                }
                else {
                    //error in console
                    $scope.data_PriceList[$scope.currentworkingrow].ConversionRate = 'NA';
                    getFinalCurrencyConversionRate($scope.data_PriceList[$scope.currentworkingrow]);
                    //apply default value
                }
                $scope.gridOptions_PriceList.api.refreshView();
            }).error(function (error) {
                $scope.Error = error;
            })
        }

        function getValue(key, array) {
            for (var el in array) {
                if (array[el].ServionLegalEntityID == key) {
                    return array[el].ServionLegalEntity;
                }
            }
        }

        //start Service call Declarations
        $scope.GetAllCurrency = function () {
            currencyService.GetAllCurrency().success(function (data) {

                $scope.CurrencyList_PriceList = data;
                $scope.call10finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetAllLOBList = function () {
            priceService.GetAllLOBList().success(function (data) {
                $scope.LOBList = data;
                $scope.call9finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetOemOptions_PriceList = function () {

            priceService.GetAllOEM().success(function (data) {
                $scope.setOEMSelectionOptions = data;
                $scope.call1finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetProductList_PriceList = function () {
            priceService.GetAllProduct().success(function (data) {
                $scope.ProductList_PriceList = data;
                $scope.call7finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.getAllPriceType = function () {
            priceService.GetAllPriceType().success(function (data) {
                $scope.setPriceTypeSelectionOptions = data;
                $scope.call2finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.getAllComponentType = function () {
            priceService.GetAllComponentType().success(function (data) {
                $scope.setComponentSelectionOptions = data;
                $scope.call3finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })

        };



        $scope.GetPriceSheetByversion = function (oppid, groupid) {
            $scope.checkIFFreshsheet_PriceList();

            if ($scope.IsfreshSheet_PriceList) {
                // $scope.MaxSheetGroupID_PriceList = 1;
                $scope.data_PriceList = [];
                $scope.call5finished_PriceList = true;
                $scope.callifAPIDone();
                //jay
                //$scope.grideditable_PriceList = true;
                $scope.hasedit_PriceList = true;
                $scope.call6finished_PriceList = true;
            }
            else {
                //debugger;
                priceService.GetAllPriceSheetbyOppGroupID(oppid, groupid).success(function (data) {

                    if (data.Error == null) {
                        $scope.data_PriceList = data;

                        $scope.call5finished_PriceList = true;
                        $scope.callifAPIDone();
                    }
                    else {
                        toaster.pop('error', "Error", data.Error, null);
                        $window.location.href = "home";
                    }
                }).error(function (error) {
                    $scope.Error = error;
                })
                $scope.GetPriceSheetMappeddataByversion(oppid, groupid);
            }
        };

        $scope.GetPriceSheetMappeddataByversion = function (oppid, groupid) {

            priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function (data) {
                //jay 
                $scope.MaxVersion_PriceList = data[0].Version;
                $scope.MaxSheetGroupID_PriceList = data[0].PriceSheetId;
                // $scope.grideditable_PriceList = data[0].IsEditable;
                $scope.hasedit_PriceList = data[0].IsEditable;
                $scope.call6finished_PriceList = true;
                $scope.callifAPIDone();
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.callifAPIDone = function () {
            if ($scope.call1finished_PriceList && $scope.call2finished_PriceList && $scope.call3finished_PriceList && $scope.call5finished_PriceList && $scope.call6finished_PriceList && $scope.call7finished_PriceList && $scope.call8finished_PriceList && $scope.call9finished_PriceList && $scope.call10finished_PriceList && $scope.call11finished_PriceList && $scope.call12finished_PriceList && $scope.call14finished_PriceList && $scope.call15finished_PriceList) {
                $scope.onLoad_PriceList();
                $scope.GetPaymentSheetbyOppGroup_payment($scope.OpportunityDetail.OppId, $routeParams.GroupId);
            }
        };
        //End Service call Declarations


        $scope.toggleCheck = function (val) {

            if (val == '+' && $scope.yearid < 5) {
                $scope.yearid = $scope.yearid + 1;
                var id = $scope.yearid;
                $scope.gridOptions_PriceList.columnApi.setColumnsVisible(['Cyear' + id, 'Vyear' + id, 'Lyear' + id, 'Oyear' + id, 'Syear' + id, 'DTyear' + id, 'FCUyear' + id, 'FCLyear' + id], true);
            }
            else if (val == '-' && $scope.yearid > 1) {
                var id = $scope.yearid;
                $scope.gridOptions_PriceList.columnApi.setColumnsVisible(['Cyear' + id, 'Vyear' + id, 'Lyear' + id, 'Oyear' + id, 'Syear' + id, 'DTyear' + id, 'FCUyear' + id, 'FCLyear' + id], false);
                $scope.yearid = $scope.yearid - 1;
            }
            else if ($scope.yearid == 5) {
                toaster.pop('warning', "Warning", 'Maximum five years only allowed', null);
            }
            else if ($scope.yearid == 1) {
                toaster.pop('warning', "Warning", 'Minimum one year should be required', null);
            }

        }

        $scope.expandall = function (expand) {
            // $scope.ExpandState_PriceList = !expand;

            var columnApi = $scope.gridOptions_PriceList.columnApi;
            var groupNames = ['GroupA', 'GroupB', 'GroupC', 'GroupD', 'GroupE', 'GroupF', 'GroupG', 'GroupH', 'GroupI', 'GroupJ', 'GroupK', 'GroupL'];

            groupNames.forEach(function (groupId) {
                $scope.gridOptions_PriceList.columnApi.setColumnGroupOpened(groupId, expand);
            });
        }
        //Start Expand/Collapse action

        //start Loading Column Definitions
        $scope.onLoad_PriceList = function () {

            var columnDefsPrice = [
                {
                    headerName: "", hide: true, field: "PricetypeId", width: 1
                },
                {
                    headerName: "", hide: true, field: "OemId", width: 1,
                },
                {
                    headerName: "", hide: true, field: 'ComponenttypeId', width: 1,
                },
                {
                    headerName: "", hide: true, field: 'LegalEntityId', width: 1
                },
                {
                    headerName: "", hide: true, field: 'lob', width: 1
                },
                {
                    headerName: "", hide: true, field: 'CurrencyId', width: 1
                },
                {
                    headerName: "", hide: true, field: 'ProductId', width: 1
                },
                {
                    headerName: "ID", field: "RowId", width: 47, headerTooltip: "ID", pinned: 'left'
                },
                {
                    headerName: "Opportunity ID", field: "OppId", width: 120, headerTooltip: "Opportunity ID", cellRenderer: OppEditor
                },
                {
                    headerName: "ServionLegal Entity", field: 'ServionLegalEntity', width: 140, cellRenderer: LegalEntityEditor, headerTooltip: "ServionLegal Entity",
                },
                {
                    headerName: "Vendor", field: "oem", width: 120, cellRenderer: OEMEditor, headerTooltip: "Vendor",
                    pinned: 'left'
                },
                {
                    headerName: "Component", field: "Component", editable: $scope.grideditable_PriceList, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                    }, pinned: 'left'
                },
                {
                    headerName: "Component Type", field: 'componenttype', width: 120, cellRenderer: customCompEditor, headerTooltip: "Component Type", pinned: 'left'
                },
                {
                    headerName: "Servion/Acqueon Product", field: 'ProductName', width: 120, cellRenderer: ProductEditor, headerTooltip: "Servion/Acqueon Product",
                },
                {
                    headerName: "Price Type", field: "pricetype", width: 120, cellRenderer: customPriceEditor, headerTooltip: "Price Type"
                },
                {
                    headerName: 'Vendor / Servion - List / Transfer Price (USD)',
                    groupId: "GroupA",
                    headerTooltip: "List/Transfer Price",
                    children: [
                        {
                            headerName: "Total", field: "LTotal", width: 90, headerTooltip: "Total",
                            valueGetter: LYearTotalcalc,
                            cellStyle: { 'background-color': '#CDCDCD' }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 1", field: "Lyear1", width: 90, columnGroupShow: 'open', editable: $scope.grideditable_PriceList, headerTooltip: "Year1",
                            onCellValueChanged: function (params) {
                                GetListCalculation(params, 1)
                                $scope.gridOptions_PriceList.api.refreshView();
                            },
                            cellStyle: { 'background-color': '#CDCDCD' },
                            newValueHandler: function (params) {
                                if (params.newValue == '') {
                                    params.data.Lyear1 = 0;
                                    params.newValue = 0;
                                }
                                params.data.Lyear1 = parseFloat(params.newValue);
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 2", field: "Lyear2", columnGroupShow: 'open', width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "Year2",
                            onCellValueChanged: function (params) {
                                GetListCalculation(params, 2)
                                $scope.gridOptions_PriceList.api.refreshView();
                            },
                            cellStyle: { 'background-color': '#CDCDCD' },
                            newValueHandler: function (params) {
                                if (params.newValue == '') {
                                    params.data.Lyear2 = 0;
                                    params.newValue = 0;
                                }
                                params.data.Lyear2 = parseFloat(params.newValue);
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }

                        },
                        {
                            headerName: "Year 3", field: "Lyear3", columnGroupShow: 'open', width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "Year3",
                            onCellValueChanged: function (params) {
                                GetListCalculation(params, 3)
                                $scope.gridOptions_PriceList.api.refreshView();
                            }, cellStyle: { 'background-color': '#CDCDCD' },
                            newValueHandler: function (params) {
                                if (params.newValue == '') {
                                    params.data.Lyear3 = 0;
                                    params.newValue = 0;
                                }
                                params.data.Lyear3 = parseFloat(params.newValue);
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 4", field: "Lyear4", columnGroupShow: 'open', width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "Year4",
                            onCellValueChanged: function (params) {
                                GetListCalculation(params, 4)
                                $scope.gridOptions_PriceList.api.refreshView();
                            },
                            cellStyle: { 'background-color': '#CDCDCD' },
                            newValueHandler: function (params) {
                                if (params.newValue == '') {
                                    params.data.Lyear4 = 0;
                                    params.newValue = 0;
                                }
                                params.data.Lyear4 = parseFloat(params.newValue);
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 5", field: "Lyear5", columnGroupShow: 'open', width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "Year5",
                            onCellValueChanged: function (params) {
                                GetListCalculation(params, 5)
                                $scope.gridOptions_PriceList.api.refreshView();
                            },
                            cellStyle: { 'background-color': '#CDCDCD' },
                            newValueHandler: function (params) {
                                if (params.newValue == '') {
                                    params.data.Lyear5 = 0;
                                    params.newValue = 0;
                                }
                                params.data.Lyear5 = parseFloat(params.newValue);
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        }

                    ]
                },
                {
                    headerName: 'Vendor Discount %', field: "forvendordiscount", width: 130, editable: $scope.grideditable_PriceList, cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else
                            return '<span title=' + params.value + '>' + params.value + ' </span>';

                    },
                    onCellValueChanged: function (params) {
                        if (params.data.oem != "Servion")
                            GetOEMVendorCalculation(params);
                    },
                    newValueHandler: function (params) {

                        if (params.newValue == '') {
                            params.newValue = 0;
                        }

                        if (params.data.oem == "Servion")
                            toaster.pop('warning', "Warning", 'For Servion Vendor Discount % not allowed', null);
                        else {

                            if (params.newValue > 100) {
                                toaster.pop('warning', "Warning", 'For OEM/Vendor Discount % cannot be greater than 100%', null);
                            }
                            else
                                params.data.forvendordiscount = params.newValue;
                        }

                    }
                },
                {
                    headerName: 'Vendor Offer Price(USD)',
                    groupId: "GroupB",
                    headerTooltip: "Vendor Offer Price(USD)",

                    children: [{
                        headerName: "Total", field: "OTotal", width: 90, headerTooltip: "Total",
                        valueGetter: OYearTotalcalc,

                        //cellStyle: { 'background-color': '#00ffff' },
                        newValueHandler: function (params) {
                            params.data.OTotal = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }, {
                        headerName: "Year 1", field: "Oyear1", columnGroupShow: 'open', width: 60,
                        newValueHandler: function (params) {
                            params.data.Oyear1 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", field: "Oyear2", columnGroupShow: 'open', width: 90,
                        newValueHandler: function (params) {
                            params.data.Oyear2 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", field: "Oyear3", columnGroupShow: 'open', width: 90,
                        newValueHandler: function (params) {
                            params.data.Oyear3 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", field: "Oyear4", columnGroupShow: 'open', width: 90,
                        newValueHandler: function (params) {
                            params.data.Oyear4 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", field: "Oyear5", columnGroupShow: 'open', width: 90,
                        newValueHandler: function (params) {
                            params.data.Oyear5 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }
                    ]
                },
                {
                    headerName: 'Distributor Margin %', field: "distmarginpercent", width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "Margin %", cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else
                            return '<span title=' + params.value + '>' + params.value + '</span>';
                    },
                    cellClassRules: {
                        'bg-red': 'x > 100',
                    },
                    onCellValueChanged: function (params) {

                        if (params.newValue == "") {
                            params.data.distmarginpercent = 0;
                        } else {
                            if (params.data.distmarginpercent != 0 && params.data.distdiscount > 0) {
                                params.data.distmarginpercent = 0;
                                toaster.pop('warning', "Warning", 'For Distributor Discount %  and  Distributor Margin %  both cannot be entered', null);
                            }
                            else {
                                if (params.data.distmarginpercent > 100) {
                                    params.data.distmarginpercent = 0;
                                    toaster.pop('warning', "Warning", 'For Distributor Margin % cannot be greater than 100%', null);
                                }

                            }

                        }
                        getdistributorandmargindiscount(params);
                    }

                },
                {
                    headerName: 'Distributor Discount %', field: "distdiscount", width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "To Customer Discount", cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else
                            return '<span title=' + params.value + '>' + params.value + '</span>';
                    },
                    cellClassRules: {
                        'bg-red': 'x > 100',
                    },
                    onCellValueChanged: function (params) {
                        if (params.newValue == '') {
                            params.data.distdiscount = 0;
                        }
                        else {
                            if (params.data.distdiscount != 0 && params.data.distmarginpercent > 0) {
                                params.data.distdiscount = 0;
                                toaster.pop('warning', "Warning", 'For Distributor Discount %  and  Distributor Margin %  both cannot be entered', null);
                            }
                            else {

                                if (params.data.distdiscount > 100) {
                                    params.data.distdiscount = 0;
                                    toaster.pop('warning', "Warning", 'For Distributor Discount % cannot be greater than 100%', null);
                                }

                            }
                        }
                        getdistributorandmargindiscount(params);
                    },

                },
                {
                    headerName: 'To Servion Price (USD) [Cost]',
                    headerTooltip: "To Servion Price (Cost)",
                    groupId: "GroupC",
                    children: [
                        {
                            headerName: "Total", field: "STotal", width: 90, headerTooltip: "Total",
                            valueGetter: SYearTotalcalc,
                            cellStyle: { 'background-color': '#ACD0C0' },

                            newValueHandler: function (params) {
                                params.data.STotal = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 1", columnGroupShow: 'open', field: "Syear1", width: 90,
                            cellStyle: { 'background-color': '#ACD0C0' },
                            newValueHandler: function (params) {
                                params.data.Syear1 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 2", columnGroupShow: 'open', field: "Syear2", width: 90,
                            cellStyle: { 'background-color': '#ACD0C0' },
                            newValueHandler: function (params) {
                                params.data.Syear2 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 3", columnGroupShow: 'open', field: "Syear3", width: 90,
                            cellStyle: { 'background-color': '#ACD0C0' },
                            newValueHandler: function (params) {
                                params.data.Syear3 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 4", columnGroupShow: 'open', field: "Syear4", width: 90,
                            cellStyle: { 'background-color': '#ACD0C0' },
                            newValueHandler: function (params) {
                                params.data.Syear4 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 5", columnGroupShow: 'open', field: "Syear5", width: 90,
                            cellStyle: { 'background-color': '#ACD0C0' },
                            newValueHandler: function (params) {
                                params.data.Syear5 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        }]
                },
                {
                    headerName: 'Margin %', field: "marginpercent", width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "Margin %", cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else {
                            return '<span title=' + params.value + '>' + params.value + '</span>';
                        }
                    },
                    onCellValueChanged: function (params) {

                        if (params.newValue == '') {
                            params.data.marginpercent = 0;
                        }
                        else {
                            if (params.data.marginpercent != 0 && params.data.customerdiscount > 0) {
                                toaster.pop('warning', "Warning", 'For Margin % and  Customer Discount % both cannot be entered', null);
                                params.data.marginpercent = 0;
                            }
                            else {

                                if (params.data.marginpercent >= 100) {
                                    toaster.pop('warning', "Warning", 'For Margin % should be less than 100%', null);
                                    params.data.marginpercent = 0;
                                }
                            }
                            getMarinpercent(params);
                        }
                    },
                },
                {
                    headerName: 'Customer Discount %', field: "customerdiscount", width: 90, editable: $scope.grideditable_PriceList, headerTooltip: "To Customer Discount", cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else {
                            return '<span title=' + params.value + '>' + params.value + '</span>';
                        }
                    },
                    onCellValueChanged: function (params) {
                        if (params.newValue == '') {
                            params.data.customerdiscount = 0;
                        }
                        else {
                            if (params.data.marginpercent > 0 && params.data.customerdiscount != 0) {
                                toaster.pop('warning', "Warning", 'For Margin % and  Distributor Discount % both cannot be entered', null);
                                params.data.customerdiscount = 0;
                            }
                            else {
                                if (params.data.customerdiscount > 100) {
                                    toaster.pop('warning', "Warning", 'For Customer Discount % cannot be greater than 100%', null);
                                    params.data.customerdiscount = 0;
                                }

                            }
                        }
                        getMarinpercent(params);
                    }
                },

                {
                    headerName: 'Calculated Margin %', field: "Calmarginpercent", width: 90, headerTooltip: "Calculated Margin %", cellRenderer: function (params) {
                        if (params.node.floating != "bottom") {
                            if (params.data.oem != 'Servion' && params.data.oem != '--Select--') {
                                var STotal = Math.round(parseFloat(params.data.Syear1) + parseFloat(params.data.Syear2) + parseFloat(params.data.Syear3) + parseFloat(params.data.Syear4) + parseFloat(params.data.Syear5));
                                var CTotal = Math.round(parseFloat(params.data.Cyear1) + parseFloat(params.data.Cyear2) + parseFloat(params.data.Cyear3) + parseFloat(params.data.Cyear4) + parseFloat(params.data.Cyear5));

                                var total = CTotal - STotal;
                                var val = 0;
                                if (total != 0)
                                    val = (total / CTotal) * 100;


                                params.value = parseFloat(val).toFixed(2);
                                params.data.Calmarginpercent = val;
                                return '<span title=' + params.value + ' class="' + getlevel(params) + '">' + params.value + ' %</span>';
                            }
                            else {
                                params.data.Calmarginpercent = 0;
                                params.value = 0;
                                return '<span title=' + params.value + '>' + params.value + '%</span>';
                            }
                        }
                        else {
                            params.data.Calmarginpercent = 0;
                            return '<span title=' + params.value + '>' + params.value + '%</span>';
                        }
                    },
                },
                {
                    headerName: 'Calculated Discount %', field: "Calcustomerdiscount", width: 90, headerTooltip: "Calculated Discount", cellRenderer: function (params) {
                        if (params.node.floating != "bottom") {
                            var CTotal = Math.round(parseFloat(params.data.Cyear1) + parseFloat(params.data.Cyear2) + parseFloat(params.data.Cyear3) + parseFloat(params.data.Cyear4) + parseFloat(params.data.Cyear5));
                            var LTotal = Math.round(parseFloat(params.data.Lyear1) + parseFloat(params.data.Lyear2) + parseFloat(params.data.Lyear3) + parseFloat(params.data.Lyear4) + parseFloat(params.data.Lyear5));

                            if (params.data.oem == 'Servion' && (LTotal > CTotal) && params.data.oem != '--Select--') {
                                var val = ((LTotal - CTotal) / LTotal) * 100;
                                params.value = parseFloat(val).toFixed(2);
                                params.data.Calcustomerdiscount = val;
                                return '<span title=' + params.value + ' class="' + getlevelcustomerdiscount(params) + '">' + params.value + ' %</span>';
                            }
                            else if (params.data.oem != '--Select--' && params.data.oem == 'Servion') {
                                params.data.Calcustomerdiscount = 0;
                                params.value = 0;
                                return '<span title=' + params.value + ' class="' + getlevelcustomerdiscount(params) + '">' + params.value + '%</span>';
                            }
                            else {
                                params.data.Calcustomerdiscount = 0;
                                params.value = 0;
                                return '<span title=' + params.value + '>' + params.value + '%</span>';
                            }
                        }
                        else {
                            params.data.Calcustomerdiscount = 0;
                            return '<span title=' + params.value + '>' + params.value + '%</span>';
                        }
                    }

                },


                {
                    headerName: 'Customer Price (USD) [Without Duty / Tax]',
                    headerTooltip: "Customer Price",
                    groupId: "GroupD",
                    children: [
                        {
                            headerName: "Total", field: "CTotal", width: 90, headerTooltip: "Total",
                            valueGetter: CYearTotalcalc,

                            cellStyle: { 'background-color': '#D4DDE1' },
                            newValueHandler: function (params) {
                                params.data.CTotal = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        }, {
                            headerName: "Year 1", field: "Cyear1", columnGroupShow: 'open', width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                            newValueHandler: function (params) {
                                params.data.Cyear1 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 2", columnGroupShow: 'open', field: "Cyear2", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                            newValueHandler: function (params) {
                                params.data.Cyear2 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 3", columnGroupShow: 'open', field: "Cyear3", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                            newValueHandler: function (params) {
                                params.data.Cyear3 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 4", columnGroupShow: 'open', field: "Cyear4", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                            newValueHandler: function (params) {
                                params.data.Cyear4 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        },
                        {
                            headerName: "Year 5", columnGroupShow: 'open', field: "Cyear5", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                            newValueHandler: function (params) {
                                params.data.Cyear5 = params.newValue;
                            }
                            , cellRenderer: function (params) {
                                return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                            }
                        }]
                },
                {
                    headerName: 'VAD / Margin (USD)',
                    groupId: "GroupE",
                    headerTooltip: "VAD/Margin",
                    children: [{
                        headerName: "Total", field: "VTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.Vyear1) + parseInt(data.Vyear2) + parseInt(data.Vyear3) + parseInt(data.Vyear4) + parseInt(data.Vyear5))',

                        cellStyle: { 'background-color': '#D6CA8B' },
                        newValueHandler: function (params) {
                            params.data.VTotal = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "Vyear1", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                        newValueHandler: function (params) {
                            params.data.Vyear1 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "Vyear2", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                        newValueHandler: function (params) {
                            params.data.Vyear2 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "Vyear3", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                        newValueHandler: function (params) {
                            params.data.Vyear3 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "Vyear4", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                        newValueHandler: function (params) {
                            params.data.Vyear4 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "Vyear5", width: 90, cellStyle: { 'background-color': '#D6CA8B' },
                        newValueHandler: function (params) {
                            params.data.Vyear5 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]

                },
                {
                    headerName: 'LOB', field: "LOBName", width: 100, headerTooltip: "LOB", //cellRenderer: LOBEditor
                },
                {
                    headerName: '', width: 30, headerTooltip: "", cellStyle: { 'background-color': '#04202C' } //cellRenderer: LOBEditor
                },
                {
                    headerName: 'Duty / TAX 1 %', field: "Dutytax1", width: 100, editable: $scope.grideditable_PriceList, headerTooltip: "Duty / TAX 1 %", cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else
                            return '<span title=' + params.value + '>' + params.value + '</span>';
                    },
                    onCellValueChanged: function (params) {
                        getcalculationfordutytax(params);
                        $scope.gridOptions_PriceList.api.refreshView();
                    },
                    newValueHandler: function (params) {
                        if (params.newValue == '') {
                            params.newValue = 0;
                        }
                        if (params.newValue > 100) {
                            toaster.pop('warning', "Warning", 'For Duty / TAX 1 % cannot be greater than 100%', null);
                            params.data.Dutytax1 = params.oldValue;
                        }
                        else
                            params.data.Dutytax1 = params.newValue;
                    }
                },
                {
                    headerName: 'Duty / TAX 2 %', field: "Dutytax2", width: 100, editable: $scope.grideditable_PriceList, headerTooltip: "Duty / TAX 2 %", cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else
                            return '<span title=' + params.value + '>' + params.value + '</span>';
                    },
                    onCellValueChanged: function (params) {
                        getcalculationfordutytax(params);
                        $scope.gridOptions_PriceList.api.refreshView();
                    },
                    newValueHandler: function (params) {
                        if (params.newValue == '') {
                            params.newValue = 0;
                        }
                        if (params.newValue > 100) {
                            toaster.pop('warning', "Warning", 'For Duty / TAX 2 % cannot be greater than 100%', null);
                            params.data.Dutytax2 = params.oldValue;
                        }
                        else
                            params.data.Dutytax2 = params.newValue;
                    }
                },
                {
                    headerName: 'Duty / TAX 3 %', field: "Dutytax3", width: 100, editable: $scope.grideditable_PriceList, headerTooltip: "Duty / TAX 3 %", cellRenderer: function (params) {
                        if (params.node.floating != "bottom")
                            return '<span title=' + params.value + '>' + params.value + ' %</span>';
                        else
                            return '<span title=' + params.value + '>' + params.value + '</span>';
                    }
                    , onCellValueChanged: function (params) {
                        getcalculationfordutytax(params);
                        $scope.gridOptions_PriceList.api.refreshView();
                    },
                    newValueHandler: function (params) {
                        if (params.newValue == '') {
                            params.newValue = 0;
                        }
                        if (params.newValue > 100) {
                            toaster.pop('warning', "Warning", 'For Duty / TAX 3 % cannot be greater than 100%', null);
                            params.data.Dutytax3 = params.oldValue;
                        }
                        else
                            params.data.Dutytax3 = params.newValue;
                    }
                },
                {
                    headerName: 'Total Duty / TAX Value (USD)',
                    groupId: "GroupF",
                    headerTooltip: "Total Duty / TAX Value",
                    children: [{
                        headerName: "Total", field: "DTTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.DTyear1) + parseInt(data.DTyear2) + parseInt(data.DTyear3) + parseInt(data.DTyear4) + parseInt(data.DTyear5))',

                        newValueHandler: function (params) {
                            params.data.DTTotal = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "DTyear1", width: 90,
                        newValueHandler: function (params) {
                            params.data.DTyear1 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "DTyear2", width: 90,
                        newValueHandler: function (params) {
                            params.data.DTyear2 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "DTyear3", width: 90,
                        newValueHandler: function (params) {
                            params.data.DTyear3 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "DTyear4", width: 90,
                        newValueHandler: function (params) {
                            params.data.DTyear4 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "DTyear5", width: 90,
                        newValueHandler: function (params) {
                            params.data.DTyear5 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]

                },
                {
                    headerName: 'Final Customer Price (USD) [Includes Duty / Tax]',
                    groupId: "GroupG",
                    headerTooltip: "Final Customer Price (USD) [Includes Duty / Tax]",
                    children: [{
                        headerName: "Total", field: "FCUTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.FCUyear1) + parseInt(data.FCUyear2) + parseInt(data.FCUyear3) + parseInt(data.FCUyear4) + parseInt(data.FCUyear5))',
                        cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function (params) {
                            params.data.FCUTotal = parseInt(params.newValue);
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "FCUyear1", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function (params) {
                            params.data.FCUyear1 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "FCUyear2", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function (params) {
                            params.data.FCUyear2 = params.newValue;
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "FCUyear3", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function (params) {
                            params.data.FCUyear3 = parseInt(params.newValue);
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "FCUyear4", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function (params) {
                            params.data.FCUyear4 = parseInt(params.newValue);
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "FCUyear5", width: 90, cellStyle: { 'background-color': '#D4DDE1' },
                        newValueHandler: function (params) {
                            params.data.FCUyear5 = parseInt(params.newValue);
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]

                },
                {
                    headerName: '', width: 30, headerTooltip: "", cellStyle: { 'background-color': '#04202C' },//cellRenderer: LOBEditor
                },
                {
                    headerName: 'Currency', field: "CurrencyDescrition", width: 100, headerTooltip: "Currency", cellRenderer: CurrencyEditor
                },
                {
                    headerName: 'Code', field: "Currency", width: 100, headerTooltip: "Code",
                },
                {
                    headerName: 'Conversion Rate', field: "ConversionRate", width: 100, editable: $scope.grideditable_PriceList, headerTooltip: "Conversion Rate", cellRenderer: function (params) {
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                    }
                    , onCellValueChanged: function (params) {
                        singlecalc(params);
                    }
                },

                {
                    headerName: 'PO Customer Price (LOCAL CURRENCY) [Includes Duty / Tax]',
                    groupId: "GroupH",
                    headerTooltip: "PO Customer Price (LOCAL CURRENCY) [Includes Duty / Tax]",
                    children: [{
                        headerName: "Total", field: "FCLTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.FCLyear1) + parseInt(data.FCLyear2) + parseInt(data.FCLyear3) + parseInt(data.FCLyear4) + parseInt(data.FCLyear5))',

                        cellStyle: { 'background-color': '#CDB7B5' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "FCLyear1", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "FCLyear2", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "FCLyear3", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "FCLyear4", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "FCLyear5", width: 90, cellStyle: { 'background-color': '#CDB7B5' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]
                },
                {
                    headerName: '', width: 30, headerTooltip: "", cellStyle: { 'background-color': '#04202C' },//cellRenderer: LOBEditor
                },

                {
                    headerName: 'INFORMATION - Duty / TAX Value (LOCAL CURRENCY)',
                    groupId: "GroupI",
                    headerTooltip: "INFORMATION - Duty / TAX Value (LOCAL CURRENCY)",
                    children: [{
                        headerName: "Total", field: "FDLTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.FDLyear1) + parseInt(data.FDLyear2) + parseInt(data.FDLyear3) + parseInt(data.FDLyear4) + parseInt(data.FDLyear5))',

                        cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "FDLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "FDLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        newValueHandler: function (params) {
                            params.data.FDLyear2 = parseInt(params.newValue);
                        }
                        , cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "FDLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "FDLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "FDLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]
                },

                {
                    headerName: 'INFORMATION - Customer Price  (LOCAL CURRENCY) [Without Duty / Tax]',
                    groupId: "GroupJ",
                    headerTooltip: "INFORMATION - Customer Price  (LOCAL CURRENCY) [Without Duty / Tax]",
                    children: [{
                        headerName: "Total", field: "FWDLTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.FWDLyear1) + parseInt(data.FWDLyear2) + parseInt(data.FWDLyear3) + parseInt(data.FWDLyear4) + parseInt(data.FWDLyear5))',

                        cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "FWDLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "FWDLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "FWDLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "FWDLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "FWDLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]
                },

                {
                    headerName: 'INFORMATION - To Servion Price (LOCAL CURRENCY) [Cost]',
                    groupId: "GroupK",
                    headerTooltip: "INFORMATION - To Servion Price (LOCAL CURRENCY) [Cost]",
                    children: [{
                        headerName: "Total", field: "FSLTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.FSLyear1) + parseInt(data.FSLyear2) + parseInt(data.FSLyear3) + parseInt(data.FSLyear4) + parseInt(data.FSLyear5))',

                        cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "FSLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "FSLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "FSLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "FSLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "FSLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]
                },

                {
                    headerName: 'INFORMATION - VAD / Margin (LOCAL CURRENCY)',
                    groupId: "GroupL",
                    headerTooltip: "INFORMATION - VAD / Margin (LOCAL CURRENCY)",
                    children: [{
                        headerName: "Total", field: "FVLTotal", width: 90, headerTooltip: "Total",
                        valueGetter: 'parseInt(parseInt(data.FVLyear1) + parseInt(data.FVLyear2) + parseInt(data.FVLyear3) + parseInt(data.FVLyear4) + parseInt(data.FVLyear5))',

                        cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 1", columnGroupShow: 'open', field: "FVLyear1", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 2", columnGroupShow: 'open', field: "FVLyear2", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 3", columnGroupShow: 'open', field: "FVLyear3", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 4", columnGroupShow: 'open', field: "FVLyear4", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    },
                    {
                        headerName: "Year 5", columnGroupShow: 'open', field: "FVLyear5", width: 90, cellStyle: { 'background-color': '#ffffff' },
                        cellRenderer: function (params) {
                            return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';;
                        }
                    }]
                },
            ];

            $scope.gridOptions_PriceList.api.setColumnDefs(columnDefsPrice);

            //for (var i = 2; i <= 5; i++) {
            //    $scope.gridOptions_PriceList.columnApi.setColumnsVisible(['Cyear' + i, 'Vyear' + i, 'Lyear' + i, 'Oyear' + i, 'Syear' + i, 'DTyear' + i, 'FCUyear' + i, 'FCLyear' + i], false);
            //}
            for (var i = 2; i <= $scope.yearid; i++) {
                $scope.gridOptions_PriceList.columnApi.setColumnsVisible(['Cyear' + i, 'Vyear' + i, 'Lyear' + i, 'Oyear' + i, 'Syear' + i, 'DTyear' + i, 'FCUyear' + i, 'FCLyear' + i, 'FVLyear' + i, 'FSLyear' + i, 'FWDLyear' + i, 'FDLyear' + i], true);
            }

            $scope.gridOptions_PriceList.columnApi.setColumnsVisible(['OemId', 'ComponenttypeId', 'PricetypeId'], false);

            $scope.gridOptions_PriceList.api.setRowData($scope.data_PriceList);
            $scope.gridOptions_PriceList.rowData = $scope.data_PriceList;
            $scope.expandall(true);
            document.getElementById('overlay').style.display = 'none';
            onFloatingBottomCount_PriceList(1);
            resetgridcollapsestate_PriceList();
        }
        //end Loading Column Definitions

        function getlevel(params) {
            if (params.data.oem != "Servion") {
                var returnval = '';
                _.each($scope.margin, function (value, key) {

                    if (value["ComponentType"] == params.data.ComponenttypeId && value["Vendor"] == params.data.OemId) {

                        if (params.data.Calmarginpercent <= value["DefaultVal"] && params.data.Calmarginpercent > value["Level1"]) {
                            returnval = "great";
                        }
                        else if (params.data.Calmarginpercent <= value["Level1"] && params.data.Calmarginpercent > value["Level2"]) {
                            returnval = "Level1";
                        }
                        else if (params.data.Calmarginpercent <= value["Level2"] && params.data.Calmarginpercent > value["Level3"]) {
                            returnval = "Level2";
                        }
                        else if (params.data.Calmarginpercent <= value["Level3"] && params.data.Calmarginpercent > 0) {
                            returnval = "Level3";
                        }
                    }
                    else if (value["ComponentType"] == params.data.ComponenttypeId) {

                        if (params.data.Calmarginpercent <= value["DefaultVal"] && params.data.Calmarginpercent > value["Level1"]) {
                            returnval = "great";
                        }
                        else if (params.data.Calmarginpercent <= value["Level1"] && params.data.Calmarginpercent > value["Level2"]) {
                            returnval = "Level1";
                        }
                        else if (params.data.Calmarginpercent <= value["Level2"] && params.data.Calmarginpercent > value["Level3"]) {
                            returnval = "Level2";
                        }
                        else if (params.data.Calmarginpercent <= value["Level3"] && params.data.Calmarginpercent > 0) {
                            returnval = "Level3";
                        }
                    }
                });

                return returnval;
            }
        }

        function getlevelcustomerdiscount(params) {
            if (params.data.oem == "Servion") {
                var returnval = '';
                _.each($scope.discount, function (value, key) {

                    if (value["ComponentType"] == params.data.ComponenttypeId && value["Vendor"] == params.data.OemId) {
                        if (params.data.Calcustomerdiscount >= value["DefaultVal"] && params.data.Calcustomerdiscount < value["Level1"] && params.data.Calcustomerdiscount > 0) {
                            returnval = "great";
                        }
                        else if (params.data.Calcustomerdiscount >= value["Level1"] && params.data.Calcustomerdiscount < value["Level2"]) {
                            returnval = "Level1";
                        }
                        else if (params.data.Calcustomerdiscount >= value["Level2"] && params.data.Calcustomerdiscount < value["Level3"]) {
                            returnval = "Level2";
                        }
                        else if (params.data.Calcustomerdiscount >= value["Level3"] && params.data.Calcustomerdiscount > value["Level2"]) {
                            returnval = "Level3";
                        }
                    }
                    else if (value["ComponentType"] == params.data.ComponenttypeId) {
                        if (params.data.Calcustomerdiscount >= value["DefaultVal"] && params.data.Calcustomerdiscount < value["Level1"] && params.data.Calcustomerdiscount > 0) {
                            returnval = "great";
                        }
                        else if (params.data.Calcustomerdiscount >= value["Level1"] && params.data.Calcustomerdiscount < value["Level2"]) {
                            returnval = "Level1";
                        }
                        else if (params.data.Calcustomerdiscount >= value["Level2"] && params.data.Calcustomerdiscount < value["Level3"]) {
                            returnval = "Level2";
                        }
                        else if (params.data.Calcustomerdiscount >= value["Level3"] && params.data.Calcustomerdiscount > value["Level2"]) {
                            returnval = "Level3";
                        }
                    }
                });
                return returnval;
            }
        }
        function LYearTotalcalc(params) {
            var finaltotal = 0;
            finaltotal = Math.round(parseFloat(params.data.Lyear1) + parseFloat(params.data.Lyear2) + parseFloat(params.data.Lyear3) + parseFloat(params.data.Lyear4) + parseFloat(params.data.Lyear5));
            params.data.LTotal = finaltotal;
            return finaltotal;
        }

        function OYearTotalcalc(params) {
            var finaltotal = 0;
            finaltotal = Math.round(parseFloat(params.data.Oyear1) + parseFloat(params.data.Oyear2) + parseFloat(params.data.Oyear3) + parseFloat(params.data.Oyear4) + parseFloat(params.data.Oyear5));
            params.data.OTotal = finaltotal;
            return finaltotal;
        }

        function SYearTotalcalc(params) {
            var finaltotal = 0;
            finaltotal = Math.round(parseFloat(params.data.Syear1) + parseFloat(params.data.Syear2) + parseFloat(params.data.Syear3) + parseFloat(params.data.Syear4) + parseFloat(params.data.Syear5));
            params.data.STotal = finaltotal;
            return finaltotal;
        }

        function CYearTotalcalc(params) {
            var finaltotal = 0;
            finaltotal = Math.round(parseFloat(params.data.Cyear1) + parseFloat(params.data.Cyear2) + parseFloat(params.data.Cyear3) + parseFloat(params.data.Cyear4) + parseFloat(params.data.Cyear5));
            params.data.CTotal = finaltotal;
            return finaltotal;
        }


        function headerCellRendererFunc(params) {
            var eHeader = document.createElement('span');
            //var eTitle = document.createTextNode(params.colDef.headerName);

            str = params.colDef.headerName;

            if (str.length > 8) {
                var html = str.split(" ");
                if (html.length > 1) {
                    html = html[0] + " <br /> " + html.slice(1).join(" ");
                    str = html;
                }

            }
            // var eTitle = document.innerHTML (str);
            eHeader.innerHTML = str;
            if (params.colDef.headerName == "Vendor Discount %" || params.colDef.headerName == "Distributor Margin %" || params.colDef.headerName == "Distributor Discount %" || params.colDef.headerName == "Margin %" || params.colDef.headerName == "Customer Discount %") {
                eHeader.style.color = 'yellow';
            }
            else if (params.colDef.headerName == "Calculated Margin %" || params.colDef.headerName == "Calculated Discount %") {
                eHeader.style.color = 'blue';
            }
            return eHeader;
        }


        function onSelectionChanged() {
            var selectedRows = $scope.gridOptions_PriceList.api.getSelectedNodes();
            $scope.currentworkingrow = selectedRows[0].childIndex;
        }


        function onFloatingBottomCount_PriceList(footerRowsToFloat) {
            var count = Number(footerRowsToFloat);
            var rows = createData(count, 'Bottom');
            $scope.gridOptions_PriceList.api.setFloatingBottomRowData(rows);
        }

        function createData(count, prefix) {
            var result = [];

            var cyear1 = 0, cyear2 = 0, cyear3 = 0, cyear4 = 0, cyear5 = 0, vyear1 = 0, vyear2 = 0, vyear3 = 0, vyear4 = 0, vyear5 = 0, lyear1 = 0, lyear2 = 0, lyear3 = 0, lyear4 = 0, lyear5 = 0, oyear1 = 0, oyear2 = 0, oyear3 = 0, oyear4 = 0, oyear5 = 0, forvendordiscount = 0, marginpercent = 0, customerdiscount = 0, Syear1 = 0, Syear2 = 0, Syear3 = 0, Syear4 = 0, Syear5 = 0, distmarginpercent = 0, distdiscount = 0, Dutytax1 = 0, Dutytax2 = 0, Dutytax3 = 0, DTyear1 = 0, DTyear2 = 0, DTyear3 = 0, DTyear4 = 0, DTyear5 = 0, DTTotal = 0, FCUyear1 = 0, FCUyear2 = 0, FCUyear3 = 0, FCUyear4 = 0, FCUyear5 = 0, FCUTotal = 0, Currency = 0, FCLyear1 = 0, FCLyear2 = 0, FCLyear3 = 0, FCLyear4 = 0, FCLyear5 = 0, FCLTotal = 0, FDLyear1 = 0, FDLyear2 = 0, FDLyear3 = 0, FDLyear4 = 0, FDLyear5 = 0, FDLTotal = 0, FWDLyear1 = 0, FWDLyear2 = 0, FWDLyear3 = 0, FWDLyear4 = 0, FWDLyear5 = 0, FWDLTotal = 0, FSLyear1 = 0, FSLyear2 = 0, FSLyear3 = 0, FSLyear4 = 0, FSLyear5 = 0, FSLTotal = 0, FVLyear1 = 0, FVLyear2 = 0, FVLyear3 = 0, FVLyear4 = 0, FVLyear5 = 0, FVLTotal = 0;

            for (var i = 0; i < $scope.data_PriceList.length; i++) {
                cyear1 += parseFloat($scope.data_PriceList[i].Cyear1);
                cyear2 += parseFloat($scope.data_PriceList[i].Cyear2);
                cyear3 += parseFloat($scope.data_PriceList[i].Cyear3);
                cyear4 += parseFloat($scope.data_PriceList[i].Cyear4);
                cyear5 += parseFloat($scope.data_PriceList[i].Cyear5);
                lyear1 += parseFloat($scope.data_PriceList[i].Lyear1);
                lyear2 += parseFloat($scope.data_PriceList[i].Lyear2);
                lyear3 += parseFloat($scope.data_PriceList[i].Lyear3);
                lyear4 += parseFloat($scope.data_PriceList[i].Lyear4);
                lyear5 += parseFloat($scope.data_PriceList[i].Lyear5);
                oyear1 += parseFloat($scope.data_PriceList[i].Oyear1);
                oyear2 += parseFloat($scope.data_PriceList[i].Oyear2);
                oyear3 += parseFloat($scope.data_PriceList[i].Oyear3);
                oyear4 += parseFloat($scope.data_PriceList[i].Oyear4);
                oyear5 += parseFloat($scope.data_PriceList[i].Oyear5);
                vyear1 += parseFloat($scope.data_PriceList[i].Vyear1);
                vyear2 += parseFloat($scope.data_PriceList[i].Vyear2);
                vyear3 += parseFloat($scope.data_PriceList[i].Vyear3);
                vyear4 += parseFloat($scope.data_PriceList[i].Vyear4);
                vyear5 += parseFloat($scope.data_PriceList[i].Vyear5);
                customerdiscount += parseFloat($scope.data_PriceList[i].customerdiscount);
                //forvendordiscount += parseFloat($scope.data_PriceList[i].forvendordiscount);
                //lob += parseFloat($scope.data_PriceList[i].lob);
                marginpercent += parseFloat($scope.data_PriceList[i].marginpercent);

                Syear1 += parseFloat($scope.data_PriceList[i].Syear1);
                Syear2 += parseFloat($scope.data_PriceList[i].Syear2);
                Syear3 += parseFloat($scope.data_PriceList[i].Syear3);
                Syear4 += parseFloat($scope.data_PriceList[i].Syear4);
                Syear5 += parseFloat($scope.data_PriceList[i].Syear5);

                DTyear1 += parseFloat($scope.data_PriceList[i].DTyear1);
                DTyear2 += parseFloat($scope.data_PriceList[i].DTyear2);
                DTyear3 += parseFloat($scope.data_PriceList[i].DTyear3);
                DTyear4 += parseFloat($scope.data_PriceList[i].DTyear4);
                DTyear5 += parseFloat($scope.data_PriceList[i].DTyear5);
                DTTotal += parseFloat($scope.data_PriceList[i].DTTotal);
                FCUyear1 += parseFloat($scope.data_PriceList[i].FCUyear1);
                FCUyear2 += parseFloat($scope.data_PriceList[i].FCUyear2);
                FCUyear3 += parseFloat($scope.data_PriceList[i].FCUyear3);
                FCUyear4 += parseFloat($scope.data_PriceList[i].FCUyear4);
                FCUyear5 += parseFloat($scope.data_PriceList[i].FCUyear5);
                FCUTotal += parseFloat($scope.data_PriceList[i].FCUTotal);

                FCLyear1 += parseFloat($scope.data_PriceList[i].FCLyear1);
                FCLyear2 += parseFloat($scope.data_PriceList[i].FCLyear2);
                FCLyear3 += parseFloat($scope.data_PriceList[i].FCLyear3);
                FCLyear4 += parseFloat($scope.data_PriceList[i].FCLyear4);
                FCLyear5 += parseFloat($scope.data_PriceList[i].FCLyear5);
                FCLTotal += parseFloat($scope.data_PriceList[i].FCLTotal);



                FDLyear1 += parseFloat($scope.data_PriceList[i].FDLyear1);
                FDLyear2 += parseFloat($scope.data_PriceList[i].FDLyear2);
                FDLyear3 += parseFloat($scope.data_PriceList[i].FDLyear3);
                FDLyear4 += parseFloat($scope.data_PriceList[i].FDLyear4);
                FDLyear5 += parseFloat($scope.data_PriceList[i].FDLyear5);
                FDLTotal += parseFloat($scope.data_PriceList[i].FDLTotal);



                FWDLyear1 += parseFloat($scope.data_PriceList[i].FWDLyear1);
                FWDLyear2 += parseFloat($scope.data_PriceList[i].FWDLyear2);
                FWDLyear3 += parseFloat($scope.data_PriceList[i].FWDLyear3);
                FWDLyear4 += parseFloat($scope.data_PriceList[i].FWDLyear4);
                FWDLyear5 += parseFloat($scope.data_PriceList[i].FWDLyear5);
                FWDLTotal += parseFloat($scope.data_PriceList[i].FWDLTotal);


                FSLyear1 += parseFloat($scope.data_PriceList[i].FSLyear1);
                FSLyear2 += parseFloat($scope.data_PriceList[i].FSLyear2);
                FSLyear3 += parseFloat($scope.data_PriceList[i].FSLyear3);
                FSLyear4 += parseFloat($scope.data_PriceList[i].FSLyear4);
                FSLyear5 += parseFloat($scope.data_PriceList[i].FSLyear5);
                FSLTotal += parseFloat($scope.data_PriceList[i].FSLTotal);


                FVLyear1 += parseFloat($scope.data_PriceList[i].FVLyear1);
                FVLyear2 += parseFloat($scope.data_PriceList[i].FVLyear2);
                FVLyear3 += parseFloat($scope.data_PriceList[i].FVLyear3);
                FVLyear4 += parseFloat($scope.data_PriceList[i].FVLyear4);
                FVLyear5 += parseFloat($scope.data_PriceList[i].FVLyear5);
                FVLTotal += parseFloat($scope.data_PriceList[i].FVLTotal);

            }

            for (var i = 0; i < count; i++) {
                result.push({
                    RowId: 'Total', OppId: '', ServionLegalEntity: '', oem: '', Component: '', LOBName: '', ProductName: '', componenttype: '', pricetype: '', Cyear1: cyear1, Cyear2: cyear2, Cyear3: cyear3, Cyear4: cyear4, Cyear5: cyear5, Vyear1: vyear1, Vyear2: vyear2, Vyear3: vyear3, Vyear4: vyear4, Vyear5: vyear5, Lyear1: Math.ceil(lyear1), Lyear2: Math.ceil(lyear2), Lyear3: Math.ceil(lyear3), Lyear4: Math.ceil(lyear4), Lyear5: Math.ceil(lyear5), Oyear1: oyear1, Oyear2: oyear2, Oyear3: oyear3, Oyear4: oyear4, Oyear5: oyear5, forvendordiscount: '', marginpercent: '', customerdiscount: '', Calcustomerdiscount: '', Calmarginpercent: '',
                    Syear1: Syear1, Syear2: Syear2, Syear3: Syear3, Syear4: Syear4, Syear5: Syear5, distmarginpercent: '', distdiscount: '', Dutytax1: '', Dutytax2: '', Dutytax3: '', DTyear1: DTyear1, DTyear2: DTyear2, DTyear3: DTyear3, DTyear4: DTyear4, DTyear5: DTyear5, DTTotal: DTTotal, FCUyear1: FCUyear1, FCUyear2: FCUyear2, FCUyear3: FCUyear3, FCUyear4: FCUyear4, FCUyear5: FCUyear5, FCUTotal: FCUTotal, Currency: '', ConversionRate: '', FCLyear1: FCLyear1, FCLyear2: FCLyear2, FCLyear3: FCLyear3, FCLyear4: FCLyear4, FCLyear5: FCLyear5, FCLTotal: FCLTotal,
                    FDLyear1: FDLyear1, FDLyear2: FDLyear2, FDLyear3: FDLyear3, FDLyear4: FDLyear4, FDLyear5: FDLyear5, FDLTotal: FDLTotal
                    , FWDLyear1: FWDLyear1, FWDLyear2: FWDLyear2, FWDLyear3: FWDLyear3, FWDLyear4: FWDLyear4, FWDLyear5: FWDLyear5, FWDLTotal: FWDLTotal
                    , FSLyear1: FSLyear1, FSLyear2: FSLyear2, FSLyear3: FSLyear3, FSLyear4: FSLyear4, FSLyear5: FSLyear5, FSLTotal: FSLTotal
                    , FVLyear1: FVLyear1, FVLyear2: FVLyear2, FVLyear3: FVLyear3, FVLyear4: FVLyear4, FVLyear5: FVLyear5, FVLTotal: FVLTotal
                });
            }

            $scope.Totalresult_PriceList = result;

            return result;
        }

        function cellValueChangedFunction() {
            onFloatingBottomCount_PriceList(1);
            PricingsheetFeedUpdate($scope.data_PriceList, true);
            PricesheetFeedToGrossMargin($scope.data_PriceList);
            console.log('cell value Changes')
        }

        //Start Grid Handler Operations

        function numberNewValueHandler(params) {
            var valueAsNumber = parseInt(params.newValue);
            if (isNaN(valueAsNumber)) {
                toaster.pop('warning', "Warning", "Invalid value " + params.newValue + ", must be a number", null);
            } else {
                params.data.number = valueAsNumber;
            }
        }

        function LegalEntityEditor(params) {
            if (params.node.floating != "bottom") {
                var editing = false;
                var eCell = document.createElement('span');
                eCell.title = params.value;
                var eLabel = document.createTextNode(params.value);
                eCell.appendChild(eLabel);
                if ($scope.grideditable_PriceList) {
                    var eSelect = document.createElement("select");
                    $scope.ServionLegalEntities.forEach(function (item) {
                        var eOption = document.createElement("option");
                        eOption.setAttribute("value", item.ServionLegalEntity);
                        eOption.setAttribute("title", item.ServionLegalEntityID);
                        eOption.innerHTML = item.ServionLegalEntity;
                        eSelect.appendChild(eOption);
                    });

                    eSelect.value = params.value;

                    params.eGridCell.addEventListener('click', function () {
                        if (!editing) {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    });

                    eSelect.addEventListener('blur', function () {
                        if (editing) {
                            editing = false;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }

                    });

                    eSelect.addEventListener('change', function () {
                        if (editing) {
                            var newValue = eSelect.value;
                            var id = eSelect[eSelect.selectedIndex].title;
                            params.data.LegalEntityId = parseInt(id);

                            if (newValue == '--Select--') {
                                toaster.pop('warning', "Warning", 'Please select ServionLegalEntity', null);
                            }
                            else {
                                editing = false;
                                params.data[params.colDef.field] = newValue;
                                eLabel.nodeValue = newValue;
                                eCell.removeChild(eSelect);
                                eCell.appendChild(eLabel);

                                GetDefaultcurencybyLegalEntity(id);
                            }
                        }
                    });
                }
                return eCell;
            }
            else {
                return "";
            }
        }

        function GetDefaultcurencybyLegalEntity(id) {
            priceService.GetDefaultcurencybyLegalEntity(id, $scope.OpportunityDetail_PriceList.SBUId, $scope.OpportunityDetail_PriceList.CountryId).success(function (data) {
                if (data != null && data.length > 0) {
                    //$scope.CurrencyList_PriceList = data;
                    $scope.data_PriceList[$scope.currentworkingrow].ConversionRate = data[0].ConversionRate;
                    //Currency Conversion
                    getFinalCurrencyConversionRate($scope.data_PriceList[$scope.currentworkingrow]);
                }
                else {
                    //error in console
                    $scope.data_PriceList[$scope.currentworkingrow].ConversionRate = 'NA';
                    getFinalCurrencyConversionRate($scope.data_PriceList[$scope.currentworkingrow]);
                    //apply default value
                }
                $scope.gridOptions_PriceList.api.refreshView();
            }).error(function (error) {
                $scope.Error = error;
            })


        }

        function CurrencyEditor(params) {
            if (params.node.floating != "bottom") {
                var editing = false;
                var eCell = document.createElement('span');
                eCell.title = params.value;
                var eLabel = document.createTextNode(params.value);
                eCell.appendChild(eLabel);
                if ($scope.grideditable_PriceList) {
                    var eSelect = document.createElement("select");

                    $scope.CurrencyList_PriceList.forEach(function (item) {
                        var eOption = document.createElement("option");
                        eOption.setAttribute("value", item.CurrencyDescrition);
                        eOption.setAttribute("title", item.Id);
                        eOption.innerHTML = item.CurrencyDescrition;
                        eSelect.appendChild(eOption);
                    });

                    eSelect.value = params.value;

                    params.eGridCell.addEventListener('click', function () {
                        if (!editing) {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    });

                    eSelect.addEventListener('blur', function () {
                        if (editing) {
                            editing = false;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }

                    });

                    eSelect.addEventListener('change', function () {
                        if (editing) {
                            var newValue = eSelect.value;
                            var id = eSelect[eSelect.selectedIndex].title;
                            params.data.CurrencyId = parseInt(id);

                            if (newValue == '--Select--') {
                                toaster.pop('warning', "Warning", 'Please select Currency', null);
                            }
                            else {
                                editing = false;
                                params.data[params.colDef.field] = newValue;
                                eLabel.nodeValue = newValue;
                                eCell.removeChild(eSelect);
                                eCell.appendChild(eLabel);
                                $scope.currentworkingrow = params.rowIndex;

                                var code = '';
                                _.each($scope.CurrencyList_PriceList, function (value, key) {
                                    if (value["CurrencyDescrition"] == newValue) {
                                        code = value["Currency"]
                                    }
                                });
                                params.data.Currency = code;

                                if (params.data.LegalEntityId != null) {
                                    $scope.GetCurrencyConversionForPricing(params.data.LegalEntityId, $scope.OpportunityDetail_PriceList.SBUId, $scope.OpportunityDetail_PriceList.CountryId, id);
                                }
                            }
                        }
                    });
                }
                return eCell;
            }
            else {
                return "";
            }
        }

        function OppEditor(params) {
            if (params.node.floating != "bottom") {
                var editing = false;
                var eCell = document.createElement('span');
                eCell.title = params.value;
                var eLabel = document.createTextNode(params.value);
                eCell.appendChild(eLabel);
                if ($scope.grideditable_PriceList) {
                    var eSelect = document.createElement("select");
                    $scope.ChildOpportunity_PriceList.forEach(function (item) {
                        var eOption = document.createElement("option");
                        eOption.setAttribute("value", item.OppId);
                        eOption.innerHTML = item.OppId;
                        eSelect.appendChild(eOption);
                    });

                    eSelect.value = params.value;

                    params.eGridCell.addEventListener('click', function () {
                        if (!editing) {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    });

                    eSelect.addEventListener('blur', function () {
                        if (editing) {
                            editing = false;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }

                    });

                    eSelect.addEventListener('change', function () {
                        if (editing) {
                            var newValue = eSelect.value;

                            if (newValue == '--Select--') {
                                toaster.pop('warning', "Warning", 'Please select Opportunity ID', null);
                            }
                            else {
                                editing = false;
                                params.data[params.colDef.field] = newValue;
                                eLabel.nodeValue = newValue;
                                eCell.removeChild(eSelect);
                                eCell.appendChild(eLabel);
                            }
                        }
                    });
                }
                return eCell;
            }
            else {
                return "";
            }
        }


        function ProductEditor(params) {
            if (params.node.floating != "bottom") {
                var editing = false;
                var eCell = document.createElement('span');
                eCell.title = params.value;
                var eLabel = document.createTextNode(params.value);
                eCell.appendChild(eLabel);

                if ($scope.grideditable_PriceList) {

                    var eSelect = document.createElement("select");

                    $scope.ProductList_PriceList.forEach(function (item) {
                        var eOption = document.createElement("option");
                        eOption.setAttribute("value", item.ProductName);
                        eOption.setAttribute("title", item.Id);
                        eOption.innerHTML = item.ProductName;
                        eSelect.appendChild(eOption);
                    });

                    eSelect.value = params.value;

                    params.eGridCell.addEventListener('click', function () {

                        if (getdataforselectionchange(params)) {
                            if (!editing) {
                                eCell.removeChild(eLabel);
                                eCell.appendChild(eSelect);
                                eSelect.focus();
                                editing = true;
                            }
                        }

                    });

                    eSelect.addEventListener('blur', function () {
                        if (editing) {
                            editing = false;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }

                    });

                    eSelect.addEventListener('change', function () {
                        if (editing) {
                            var newValue = eSelect.value;
                            var id = eSelect[eSelect.selectedIndex].title;
                            params.data.ProductId = parseInt(id);

                            if (newValue == '--Select--') {
                                toaster.pop('warning', "Warning", 'Please select ProductType', null);
                            }
                            else {
                                editing = false;
                                params.data[params.colDef.field] = newValue;
                                eLabel.nodeValue = newValue;
                                eCell.removeChild(eSelect);
                                eCell.appendChild(eLabel);
                            }
                        }
                    });
                }
                return eCell;
            }
            else {
                return "";
            }
        }

        function getdataforselectionchange(params) {
            if ((params.data.oem == 'Servion' || params.data.oem == 'Acqueon') && (params.data.componenttype == "AMC-SW" || params.data.componenttype == "Software")) {
                return true;
            }
            else {
                return false;
            }
        }

        function customCompEditor(params) {
            if (params.node.floating != "bottom") {
                var editing = false;
                var eCell = document.createElement('span');
                eCell.title = params.value;
                var eLabel = document.createTextNode(params.value);
                eCell.appendChild(eLabel);
                if ($scope.grideditable_PriceList) {

                    var eSelect = document.createElement("select");

                    $scope.setComponentSelectionOptions.forEach(function (item) {

                        var eOption = document.createElement("option");
                        eOption.setAttribute("value", item.ComponentType);
                        eOption.setAttribute("title", item.Id);
                        eOption.innerHTML = item.ComponentType;
                        eSelect.appendChild(eOption);
                    });

                    eSelect.value = params.value;

                    params.eGridCell.addEventListener('click', function () {
                        if (!editing) {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    });

                    eSelect.addEventListener('blur', function () {
                        if (editing) {
                            editing = false;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }

                    });

                    eSelect.addEventListener('change', function () {
                        if (editing) {
                            var newValue = eSelect.value;
                            var id = eSelect[eSelect.selectedIndex].title;
                            params.data.ComponenttypeId = parseInt(id);

                            if (newValue == '--Select--') {
                                toaster.pop('warning', "Warning", 'Please select ComponentType', null);
                            }
                            else {
                                editing = false;
                                params.data[params.colDef.field] = newValue;
                                eLabel.nodeValue = newValue;
                                eCell.removeChild(eSelect);
                                eCell.appendChild(eLabel);
                            }

                            if (!getdataforselectionchange(params)) {
                                params.data.ProductId = 1;
                                params.data.ProductName = 'NA';
                            }
                            getLOBValue(params);

                            $scope.gridOptions_PriceList.api.refreshView();
                        }
                    });
                }
                return eCell;
            }
            else {
                return "";
            }
        }

        function customPriceEditor(params) {
            if (params.node.floating != "bottom") {
                var editing = false;
                var eCell = document.createElement('span');
                eCell.title = params.value;

                var eLabel = document.createTextNode(params.value);
                eCell.appendChild(eLabel);
                if ($scope.grideditable_PriceList) {

                    var eSelect = document.createElement("select");

                    $scope.setPriceTypeSelectionOptions.forEach(function (item) {
                        var eOption = document.createElement("option");
                        eOption.setAttribute("value", item.PriceType);
                        eOption.setAttribute("title", item.Id);
                        eOption.innerHTML = item.PriceType;
                        eSelect.appendChild(eOption);
                    });

                    eSelect.value = params.value;

                    params.eGridCell.addEventListener('click', function () {

                        if (!editing) {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    });

                    eSelect.addEventListener('blur', function () {
                        if (editing) {
                            editing = false;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                        }

                    });

                    eSelect.addEventListener('change', function () {
                        if (editing) {
                            var newValue = eSelect.value;
                            if (newValue == '--Select--') {
                                toaster.pop('warning', "Warning", 'Please select PriceType', null);
                            }
                            else {
                                editing = false;
                                var newValue = eSelect.value;
                                var id = eSelect[eSelect.selectedIndex].title;
                                params.data[params.colDef.field] = newValue;
                                eLabel.nodeValue = newValue;
                                eCell.removeChild(eSelect);
                                eCell.appendChild(eLabel);
                                params.data.PricetypeId = parseInt(id);
                                getcalculationforPriceEditorChange(params);

                                onFloatingBottomCount_PriceList(1);
                                $scope.gridOptions_PriceList.api.refreshView();
                            }
                        }
                    });
                }
                return eCell;
            }
            else {
                return "";
            }
        }

        function OEMEditor(params) {
            if (params.node.floating != "bottom") {
                var editing = false;
                var eCell = document.createElement('span');
                eCell.title = params.value;
                var eLabel = document.createTextNode(params.value);
                eCell.appendChild(eLabel);
                if ($scope.grideditable_PriceList) {

                    var eSelect = document.createElement("select");

                    $scope.setOEMSelectionOptions.forEach(function (item) {
                        var eOption = document.createElement("option");
                        eOption.setAttribute("value", item.VendorName);
                        eOption.setAttribute("title", item.Id);
                        eOption.innerHTML = item.VendorName;
                        eSelect.appendChild(eOption);
                    });

                    eSelect.value = params.value;

                    params.eGridCell.addEventListener('click', function () {

                        if (!editing) {
                            eCell.removeChild(eLabel);
                            eCell.appendChild(eSelect);
                            eSelect.focus();
                            editing = true;
                        }
                    });

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
                            var newValue = eSelect.value;
                            var id = eSelect[eSelect.selectedIndex].title;

                            params.data[params.colDef.field] = newValue;
                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);
                            params.data.OemId = parseInt(id);
                            getcalculationforOEMEditorChange(params);
                            onFloatingBottomCount_PriceList(1);

                            if (!getdataforselectionchange(params)) {
                                params.data.ProductId = 1;
                                params.data.ProductName = 'NA';
                            }
                            getLOBValue(params);

                            $scope.gridOptions_PriceList.api.refreshView();

                        }
                    });

                }
                return eCell;
            }
            else {
                return "";
            }
        }

        //End Grid Handler Operations

        $scope.sizeToFit = function () {
            $scope.gridOptions_PriceList.api.sizeColumnsToFit();
        }

        $scope.autoSizeAll = function () {

            var allColumnIds = [];
            $scope.gridOptions_PriceList.api.columnController.allColumns.forEach(function (columnDef) {
                allColumnIds.push(columnDef.field);
            });
            $scope.gridOptions_PriceList.columnApi.autoSizeColumns(allColumnIds);
            $scope.gridOptions_PriceList.api.refreshView();
            $scope.gridOptions_PriceList.columnApi.setColumnsVisible(['OemId', 'ComponenttypeId', 'PricetypeId'], false);

        }

        $scope.addnewpricerow = function () {
            angular.element(document.getElementById('btnadd'))[0].disabled = true;
            angular.element(document.querySelector('#loader')).removeClass('hide');

            var selectedRows = $scope.gridOptions_PriceList.api.getSelectedNodes();

            var curentId = 0;
            if ($scope.gridOptions_PriceList.rowData.length == 0) {
                curentId = 1;
            }
            else {
                maxindex = $scope.gridOptions_PriceList.rowData.length - 1;
                var curentId = $scope.gridOptions_PriceList.rowData[maxindex].RowId + 1;
            }

            //come

            var Currencydescription = '';
            _.each($scope.CurrencyList_PriceList, function (value, key) {
                if (value["Currency"] == $scope.DefaultCurrency_PriceList) {
                    Currencydescription = value["CurrencyDescrition"]
                }
            });

            if (selectedRows.length > 0) {
                var alterrows = selectedRows[0].childIndex + 1;
                var newid = alterrows + 1;
                $scope.data_PriceList.splice(alterrows, 0, { RowId: newid, ProductId: 1, OppId: $scope.OpportunityDetail_PriceList.OppId, LegalEntityId: $scope.OpportunityDetail_PriceList.ServionLegalEntity, ProductName: '--Select--', ServionLegalEntity: $scope.ServionLegalEntityName, oem: '--Select--', Component: '', componenttype: '--Select--', pricetype: '--Select--', Cyear1: '0', Cyear2: '0', Cyear3: '0', Cyear4: '0', Cyear5: '0', CTotal: '0', Vyear1: '0', Vyear2: '0', Vyear3: '0', Vyear4: '0', Vyear5: '0', VTotal: '0', Lyear1: '0', Lyear2: '0', Lyear3: '0', Lyear4: '0', Lyear5: '0', LTotal: '0', Oyear1: '0', Oyear2: '0', Oyear3: '0', Oyear4: '0', Oyear5: '0', OTotal: '0', Syear1: '0', Syear2: '0', Syear3: '0', Syear4: '0', Syear5: '0', STotal: '0', forvendordiscount: '0', marginpercent: '0', customerdiscount: '0', distmarginpercent: '0', distdiscount: '0', LOBName: 'OTHERS', version: 1, PriceSheetGroupId: $scope.MaxSheetGroupID_PriceList, IsEditable: $scope.grideditable_PriceList, Dutytax1: '0', Dutytax2: '0', Dutytax3: '0', DTyear1: '0', DTyear2: '0', DTyear3: '0', DTyear4: '0', DTyear5: '0', DTTotal: '0', FCUyear1: '0', FCUyear2: '0', FCUyear3: '0', FCUyear4: '0', FCUyear5: '0', FCUTotal: '0', Currency: $scope.DefaultCurrency_PriceList, ConversionRate: $scope.DefaultConversionRate_PriceList, FCLyear1: '0', FCLyear2: '0', FCLyear3: '0', FCLyear4: '0', FCLyear5: '0', FCLTotal: '0', FDLyear1: '0', FDLyear2: '0', FDLyear3: '0', FDLyear4: '0', FDLyear5: '0', FDLTotal: '0', FWDLyear1: '0', FWDLyear2: '0', FWDLyear3: '0', FWDLyear4: '0', FWDLyear5: '0', FWDLTotal: '0', FSLyear1: '0', FSLyear2: '0', FSLyear3: '0', FSLyear4: '0', FSLyear5: '0', FSLTotal: '0', FVLyear1: '0', FVLyear2: '0', FVLyear3: '0', FVLyear4: '0', FVLyear5: '0', FVLTotal: '0', lobname: '-Select-', CurrencyId: $scope.DefaultCurrency_PriceListID, PricetypeId: 1, OemId: 1, ComponenttypeId: 1, lob: 1, CurrencyDescrition: Currencydescription });
                alterrows = newid;

                for (alterrows; alterrows < $scope.gridOptions_PriceList.rowData.length; alterrows++) {
                    console.log(alterrows)
                    $scope.data_PriceList[alterrows].RowId = alterrows + 1;
                }

            }
            else {
                $scope.data_PriceList.push({
                    RowId: curentId, ProductId: 1, OppId: $scope.OpportunityDetail_PriceList.OppId, LegalEntityId: $scope.OpportunityDetail_PriceList.ServionLegalEntity, ProductName: '--Select--', ServionLegalEntity: $scope.ServionLegalEntityName, oem: '--Select--', Component: '', componenttype: '--Select--', pricetype: '--Select--', Cyear1: '0', Cyear2: '0', Cyear3: '0', Cyear4: '0', Cyear5: '0', CTotal: '0', Vyear1: '0', Vyear2: '0', Vyear3: '0', Vyear4: '0', Vyear5: '0', VTotal: '0', Lyear1: '0', Lyear2: '0', Lyear3: '0', Lyear4: '0', Lyear5: '0', LTotal: '0', Oyear1: '0', Oyear2: '0', Oyear3: '0', Oyear4: '0', Oyear5: '0', OTotal: '0', Syear1: '0', Syear2: '0', Syear3: '0', Syear4: '0', Syear5: '0', STotal: '0', forvendordiscount: '0', marginpercent: '0', customerdiscount: '0', distmarginpercent: '0', distdiscount: '0', LOBName: 'OTHERS', version: 1, PriceSheetGroupId: $scope.MaxSheetGroupID_PriceList, IsEditable: $scope.grideditable_PriceList, Dutytax1: '0', Dutytax2: '0', Dutytax3: '0', DTyear1: '0', DTyear2: '0', DTyear3: '0', DTyear4: '0', DTyear5: '0', DTTotal: '0', FCUyear1: '0', FCUyear2: '0', FCUyear3: '0', FCUyear4: '0', FCUyear5: '0', FCUTotal: '0', Currency: $scope.DefaultCurrency_PriceList, ConversionRate: $scope.DefaultConversionRate_PriceList, FCLyear1: '0', FCLyear2: '0', FCLyear3: '0', FCLyear4: '0', FCLyear5: '0', FCLTotal: '0', FDLyear1: '0', FDLyear2: '0', FDLyear3: '0', FDLyear4: '0', FDLyear5: '0', FDLTotal: '0', FWDLyear1: '0', FWDLyear2: '0', FWDLyear3: '0', FWDLyear4: '0', FWDLyear5: '0', FWDLTotal: '0', FSLyear1: '0', FSLyear2: '0', FSLyear3: '0', FSLyear4: '0', FSLyear5: '0', FSLTotal: '0', FVLyear1: '0', FVLyear2: '0', FVLyear3: '0', FVLyear4: '0', FVLyear5: '0', FVLTotal: '0', lobname: '-Select-', CurrencyId: $scope.DefaultCurrency_PriceListID, PricetypeId: 1, OemId: 1, ComponenttypeId: 1, lob: 1, CurrencyDescrition: Currencydescription
                });
            }


            $scope.gridOptions_PriceList.rowData = $scope.data_PriceList;
            $scope.gridOptions_PriceList.api.setRowData($scope.data_PriceList);

            //if ($scope.gridOptions_PriceList.rowData[maxindex].oem != "--Select--" && $scope.gridOptions_PriceList.rowData[maxindex].componenttype != "--Select--" && $scope.gridOptions_PriceList.rowData[maxindex].pricetype != "--Select--") {
            //}
            // else {
            //  toaster.pop('warning', "Warning", 'Please complete the row ' + (maxindex + 1), null);
            // }

            onFloatingBottomCount_PriceList(1);

            $timeout(function () {
                angular.element(document.querySelector('#loader')).addClass('hide');
            }, 500);

            angular.element(document.getElementById('btnadd'))[0].disabled = false;

        }

        function LastNode(node, index) {
            if (node.data) {
                console.log(index + ' -> data: ' + node.data.Lyear1 + ', ' + node.data.oem);
            } else {
                console.log(index + ' -> group: ' + node.key);
            }
        }


        function getexpandedcolstatus() {
            var constructstr = '';
            var GroupA = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupA').originalColumnGroup.expanded;
            constructstr = 'A:' + GroupA + ',';
            var GroupB = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupB').originalColumnGroup.expanded;
            constructstr += 'B:' + GroupB + ',';
            var GroupC = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupC').originalColumnGroup.expanded;
            constructstr += 'C:' + GroupC + ',';
            var GroupD = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupD').originalColumnGroup.expanded;
            constructstr += 'D:' + GroupD + ',';
            var GroupE = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupE').originalColumnGroup.expanded;
            constructstr += 'E:' + GroupE + ',';
            var GroupF = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupF').originalColumnGroup.expanded;
            constructstr += 'F:' + GroupF + ',';
            var GroupG = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupG').originalColumnGroup.expanded;
            constructstr += 'G:' + GroupG + ',';
            var GroupH = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupH').originalColumnGroup.expanded;
            constructstr += 'H:' + GroupH + ',';
            var GroupI = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupI').originalColumnGroup.expanded;
            constructstr += 'I:' + GroupI + ',';
            var GroupJ = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupJ').originalColumnGroup.expanded;
            constructstr += 'J:' + GroupJ + ',';
            var GroupK = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupK').originalColumnGroup.expanded;
            constructstr += 'K:' + GroupK + ',';
            var GroupL = $scope.gridOptions_PriceList.columnApi.getColumnGroup('GroupL').originalColumnGroup.expanded;
            constructstr += 'L:' + GroupL;
            return constructstr;
        }


        //Final Single save Operations
        $scope.AddPriceSheet = function (isdiscard) {

            //daysheet
            if (validatedataonSAVE() && validatedataonSAVE_PriceList() && ValidateTandEResourceData() && ValidateResourceData() && ValidateTandEPSData() && validatedataonSAVE_pricingsheet()) {

                var Daysheetdata = $scope.data.concat($scope.data1).concat($scope.data2).concat($scope.data3).concat($scope.dataLOB);

                for (var j = 0; j < Daysheetdata.length; j++) {
                    try {
                        delete Daysheetdata[j].Id
                        Daysheetdata[j].Description = String(Daysheetdata[j].Description);
                        Daysheetdata[j].REQ = String(Daysheetdata[j].REQ);
                        Daysheetdata[j].Design = String(Daysheetdata[j].Design);
                        Daysheetdata[j].DevTest = String(Daysheetdata[j].DevTest);
                        Daysheetdata[j].SysTest = String(Daysheetdata[j].SysTest);
                        Daysheetdata[j].IMPL = String(Daysheetdata[j].IMPL);
                        Daysheetdata[j].UAT = String(Daysheetdata[j].UAT);
                        Daysheetdata[j].PROD = String(Daysheetdata[j].PROD);
                        Daysheetdata[j].TRAIN = String(Daysheetdata[j].TRAIN);
                        Daysheetdata[j].MANUAL = String(Daysheetdata[j].MANUAL);
                        Daysheetdata[j].OH = String(Daysheetdata[j].OH);
                        Daysheetdata[j].SQA = String(Daysheetdata[j].SQA);
                        Daysheetdata[j].PM = String(Daysheetdata[j].PM);
                        Daysheetdata[j].Product = String(Daysheetdata[j].Product);
                        Daysheetdata[j].Total = String(Daysheetdata[j].Total);
                        Daysheetdata[j].GridName = String(Daysheetdata[j].GridName);
                        Daysheetdata[j].DaySheetGroupId = String($scope.MaxSheetGroupID);
                    }
                    catch (e) {
                        console.log('some error while sending Daysheetdata to server')
                    }
                }

                for (var j = 0; j < $scope.FixedFTEDaysJson.length; j++) {
                    try {
                        delete $scope.FixedFTEDaysJson[j].Id
                        $scope.FixedFTEDaysJson[j].SDLCStage = String($scope.FixedFTEDaysJson[j].SDLCStage);
                        $scope.FixedFTEDaysJson[j].Tool = String($scope.FixedFTEDaysJson[j].Tool);
                        $scope.FixedFTEDaysJson[j].Manual = String($scope.FixedFTEDaysJson[j].Manual);
                        $scope.FixedFTEDaysJson[j].Extend = String($scope.FixedFTEDaysJson[j].Extend);
                        $scope.FixedFTEDaysJson[j].CalculatedEfforts = String($scope.FixedFTEDaysJson[j].CalculatedEfforts);
                        $scope.FixedFTEDaysJson[j].Total = String($scope.FixedFTEDaysJson[j].Total);
                        $scope.FixedFTEDaysJson[j].Change = String($scope.FixedFTEDaysJson[j].Change);
                        $scope.FixedFTEDaysJson[j].EffortAuthourize = String($scope.FixedFTEDaysJson[j].EffortAuthourize);
                        $scope.FixedFTEDaysJson[j].FTEHours = String($scope.FixedFTEDaysJson[j].FTEHours);
                        $scope.FixedFTEDaysJson[j].Resources = String($scope.FixedFTEDaysJson[j].Resources);
                        $scope.FixedFTEDaysJson[j].Days = String($scope.FixedFTEDaysJson[j].Days);
                        $scope.FixedFTEDaysJson[j].Daychange = String($scope.FixedFTEDaysJson[j].Daychange);
                        $scope.FixedFTEDaysJson[j].DaysAuthourize = String($scope.FixedFTEDaysJson[j].DaysAuthourize);
                        $scope.FixedFTEDaysJson[j].BusinessDays = String($scope.FixedFTEDaysJson[j].BusinessDays);
                        $scope.FixedFTEDaysJson[j].OnsitePercentage = String($scope.FixedFTEDaysJson[j].OnsitePercentage);
                        $scope.FixedFTEDaysJson[j].PrevvalueFTE = String($scope.FixedFTEDaysJson[j].PrevvalueFTE);
                        $scope.FixedFTEDaysJson[j].PrevvalueBD = String($scope.FixedFTEDaysJson[j].PrevvalueBD);
                        $scope.FixedFTEDaysJson[j].FTEChangeStatus = String($scope.FixedFTEDaysJson[j].FTEChangeStatus);
                        $scope.FixedFTEDaysJson[j].BDChangeStatus = String($scope.FixedFTEDaysJson[j].BDChangeStatus);

                        $scope.FixedFTEDaysJson[j].DaySheetGroupId = String($scope.MaxSheetGroupID);
                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }

                for (var j = 0; j < $scope.FixedDistributionJson.length; j++) {
                    try {
                        delete $scope.FixedDistributionJson.Id
                        $scope.FixedDistributionJson[j].SDLCStage = String($scope.FixedDistributionJson[j].SDLCStage);
                        $scope.FixedDistributionJson[j].BUOnsiteL1 = String($scope.FixedDistributionJson[j].BUOnsiteL1);
                        $scope.FixedDistributionJson[j].BUOnsiteL2 = String($scope.FixedDistributionJson[j].BUOnsiteL2);
                        $scope.FixedDistributionJson[j].BURemoteL1 = String($scope.FixedDistributionJson[j].BURemoteL1);
                        $scope.FixedDistributionJson[j].BURemoteL2 = String($scope.FixedDistributionJson[j].BURemoteL2);
                        $scope.FixedDistributionJson[j].CDOOnsiteL1 = String($scope.FixedDistributionJson[j].CDOOnsiteL1);
                        $scope.FixedDistributionJson[j].CDOOnsiteL2 = String($scope.FixedDistributionJson[j].CDOOnsiteL2);
                        $scope.FixedDistributionJson[j].Total = String(parseInt($scope.FixedDistributionJson[j].BUOnsiteL1) + parseInt($scope.FixedDistributionJson[j].BUOnsiteL2) + parseInt($scope.FixedDistributionJson[j].BURemoteL1) + parseInt($scope.FixedDistributionJson[j].BURemoteL2) + parseInt($scope.FixedDistributionJson[j].CDOOnsiteL1) + parseInt($scope.FixedDistributionJson[j].CDOOnsiteL2));
                        $scope.FixedDistributionJson[j].DaySheetGroupId = String($scope.MaxSheetGroupID);
                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }

                for (var j = 0; j < $scope.FixedPriceCostJson.length; j++) {
                    try {
                        delete $scope.FixedPriceCostJson[j].Id

                        $scope.FixedPriceCostJson[j].SDLCStage = String($scope.FixedPriceCostJson[j].SDLCStage);
                        $scope.FixedPriceCostJson[j].PriceBU = String($scope.FixedPriceCostJson[j].PriceBU);
                        $scope.FixedPriceCostJson[j].PriceCDO = String($scope.FixedPriceCostJson[j].PriceCDO);
                        $scope.FixedPriceCostJson[j].FTEBUL1 = String($scope.FixedPriceCostJson[j].FTEBUL1);
                        $scope.FixedPriceCostJson[j].FTEBUL2 = String($scope.FixedPriceCostJson[j].FTEBUL2);
                        $scope.FixedPriceCostJson[j].FTECDOL1 = String($scope.FixedPriceCostJson[j].FTECDOL1);
                        $scope.FixedPriceCostJson[j].FTECDOL2 = String($scope.FixedPriceCostJson[j].FTECDOL2);
                        $scope.FixedPriceCostJson[j].CostBUL1 = String($scope.FixedPriceCostJson[j].CostBUL1);
                        $scope.FixedPriceCostJson[j].CostBUL2 = String($scope.FixedPriceCostJson[j].CostBUL2);
                        $scope.FixedPriceCostJson[j].CostCDOL1 = String($scope.FixedPriceCostJson[j].CostCDOL1);
                        $scope.FixedPriceCostJson[j].CostCDOL2 = String($scope.FixedPriceCostJson[j].CostCDOL2);
                        $scope.FixedPriceCostJson[j].DaySheetGroupId = String($scope.MaxSheetGroupID);

                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }

                $scope.ExtendedEffortCycle.DaySheetGroupId = String($scope.MaxSheetGroupID);


                var DaysheetJsondata = {
                    OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, SheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable_PriceList, DaySheet: Daysheetdata, Authour: $rootScope.UserInfo.user.userId,
                    DaysheetPriceCost: $scope.FixedPriceCostJson,
                    DaysheetResourceDistribution: $scope.FixedDistributionJson,
                    DaysheetFTEHours: $scope.FixedFTEDaysJson,
                    DaysheetExtendedEffort: $scope.ExtendedEffortCycle,
                    DaySheetVersionJSON: JSON.stringify($scope.localversionConfirm)
                };


                $scope.OpportunityDetail.PriceGroupId = $scope.MaxSheetGroupID;
                //site details
                var OppConfigJsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, SheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable, paymentsheet: $scope.OpportunityDetail, Authour: $rootScope.UserInfo.user.userId };



                //payment


                for (var j = 0; j < $scope.Paymentdata.length; j++) {
                    try {
                        delete $scope.Paymentdata[j].Id

                        $scope.Paymentdata[j].PaymentSheetGroupId = $routeParams.GroupId;
                        $scope.Paymentdata[j].Iyear1 = String($scope.Paymentdata[j].Iyear1);
                        $scope.Paymentdata[j].Iyear2 = String($scope.Paymentdata[j].Iyear2);
                        $scope.Paymentdata[j].Iyear3 = String($scope.Paymentdata[j].Iyear3);
                        $scope.Paymentdata[j].Iyear4 = String($scope.Paymentdata[j].Iyear4);
                        $scope.Paymentdata[j].Iyear5 = String($scope.Paymentdata[j].Iyear5);
                        $scope.Paymentdata[j].paymentTerms = String($scope.Paymentdata[j].paymentTerms);
                        $scope.Paymentdata[j].percentageTotal = String($scope.Paymentdata[j].percentageTotal);
                        $scope.Paymentdata[j].OEMHWandSW = String($scope.Paymentdata[j].OEMHWandSW);
                        $scope.Paymentdata[j].OEMServices = String($scope.Paymentdata[j].OEMServices);
                        $scope.Paymentdata[j].OEMPS = String($scope.Paymentdata[j].OEMPS);
                        $scope.Paymentdata[j].OEMOther = String($scope.Paymentdata[j].OEMOther);
                        $scope.Paymentdata[j].SERVSW = String($scope.Paymentdata[j].SERVSW);
                        $scope.Paymentdata[j].SERVServices = String($scope.Paymentdata[j].SERVServices);
                        $scope.Paymentdata[j].SERVPS = String($scope.Paymentdata[j].SERVPS);
                        $scope.Paymentdata[j].SERVCare = String($scope.Paymentdata[j].SERVCare);
                        $scope.Paymentdata[j].SERVOther = String($scope.Paymentdata[j].SERVOther);
                        $scope.Paymentdata[j].SERVConsulting = String($scope.Paymentdata[j].SERVConsulting);
                        $scope.Paymentdata[j].SERVResource = String($scope.Paymentdata[j].SERVResource);
                        $scope.Paymentdata[j].SERVHosted = String($scope.Paymentdata[j].SERVHosted);
                        $scope.Paymentdata[j].SERVTM = String($scope.Paymentdata[j].SERVTM);
                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }

                var PaymentJsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, SheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable_PriceList, paymentsheet: $scope.Paymentdata, Authour: $rootScope.UserInfo.user.userId };


                //Resourcing

                var data = $scope.ResourcingData;
                for (var j = 0; j < data.length; j++) {
                    try {
                        delete data[j].Id
                        data[j].OppId = $scope.OppDetail.OppId;
                        //ata[j].GroupId = $scope.MaxGroupID;  for final complete source finder for maxgroup variable
                        data[j].GroupId = $scope.MaxSheetGroupID;
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }

                var ResourcingJsondata = { OppId: $scope.OppDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxSheetGroupID, Comment: '', Version: $scope.Version, ResourceSheet: data, Author: $scope.LoggedUser, NumberofApp: 0 };



                //T & E Resource data

                var data = $scope.TandEResourceData;
                $scope.TandEResourceData.push(totalrowResource[0]);
                for (var j = 0; j < data.length; j++) {
                    try {
                        delete data[j].Id
                        data[j].OppId = $scope.OppDetail.OppId;
                        data[j].GroupId = $scope.MaxSheetGroupID;
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }

                var TEJsondata = { OppId: $scope.OppDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxSheetGroupID, Comment: '', Version: $scope.Version, TandEResourceSheet: data, Author: $scope.LoggedUser, NumberofApp: 0 };



                //T & E PS

                var data = $scope.TandEPSData;
                $scope.TandEPSData.push(totalrowPS[0]);
                for (var j = 0; j < data.length; j++) {
                    try {
                        delete data[j].Id
                        data[j].OppId = $scope.OppDetail.OppId;
                        data[j].GroupId = $scope.MaxSheetGroupID;
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }

                var TEPSJsondata = { OppId: $scope.OppDetail.OppId, IsSaveAs: false, ApplicationId: $scope.MaxSheetGroupID, Comment: '', Version: $scope.Version, TandEPSSheet: data, Author: $scope.LoggedUser, NumberofApp: 0 };


                //Gross margin start
                $scope.GrossMargindata = {};
                $scope.GrossMargindata.MAINTANACE = $scope.margin.MAINTANACE;
                $scope.GrossMargindata.IP = $scope.margin.IP;
                $scope.GrossMargindata.HOSTED = $scope.margin.HOSTED;
                $scope.GrossMargindata.PS = $scope.margin.PS;
                $scope.GrossMargindata.RESOURCING = $scope.margin.RESOURCING;
                $scope.GrossMargindata.TRADING = $scope.margin.TRADING;
                $scope.GrossMargindata.CONSULTING = $scope.margin.CONSULTING;
                $scope.GrossMargindata.MAINTANACEvalue = $scope.MAINTANACEvalue;
                $scope.GrossMargindata.IPvalue = $scope.IPvalue;
                $scope.GrossMargindata.HOSTEDvalue = $scope.HOSTEDvalue;
                $scope.GrossMargindata.PSvalue = $scope.PSvalue;
                $scope.GrossMargindata.RESOURCINGvalue = $scope.RESOURCINGvalue;
                $scope.GrossMargindata.TRADINGvalue = $scope.TRADINGvalue;
                $scope.GrossMargindata.CONSULTINGvalue = $scope.CONSULTINGvalue;
                $scope.GrossMargindata.MarginGroupId = $scope.MaxSheetGroupID;

                var GMJsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, SheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable_PriceList, paymentsheet: $scope.GrossMargindata, Authour: $rootScope.UserInfo.user.userId };


                calculatePMThreshold();



                //pricing

                var constructstr = getexpandedcolstatus();

                calculateThreshold();
                for (var j = 0; j < $scope.data_PriceList.length; j++) {
                    try {
                        delete $scope.data_PriceList[j].Id

                        $scope.data_PriceList[j].PriceSheetGroupId = $routeParams.GroupId;
                        $scope.data_PriceList[j].Cyear1 = String($scope.data_PriceList[j].Cyear1);
                        $scope.data_PriceList[j].Cyear2 = String($scope.data_PriceList[j].Cyear2);
                        $scope.data_PriceList[j].Cyear3 = String($scope.data_PriceList[j].Cyear3);
                        $scope.data_PriceList[j].Cyear4 = String($scope.data_PriceList[j].Cyear4);
                        $scope.data_PriceList[j].Cyear5 = String($scope.data_PriceList[j].Cyear5);
                        $scope.data_PriceList[j].Vyear1 = String($scope.data_PriceList[j].Vyear1);
                        $scope.data_PriceList[j].Vyear2 = String($scope.data_PriceList[j].Vyear2);
                        $scope.data_PriceList[j].Vyear3 = String($scope.data_PriceList[j].Vyear3);
                        $scope.data_PriceList[j].Vyear4 = String($scope.data_PriceList[j].Vyear4);
                        $scope.data_PriceList[j].Vyear5 = String($scope.data_PriceList[j].Vyear5);
                        $scope.data_PriceList[j].Lyear1 = String($scope.data_PriceList[j].Lyear1);
                        $scope.data_PriceList[j].Lyear2 = String($scope.data_PriceList[j].Lyear2);
                        $scope.data_PriceList[j].Lyear3 = String($scope.data_PriceList[j].Lyear3);
                        $scope.data_PriceList[j].Lyear4 = String($scope.data_PriceList[j].Lyear4);
                        $scope.data_PriceList[j].Lyear5 = String($scope.data_PriceList[j].Lyear5);
                        $scope.data_PriceList[j].Oyear1 = String($scope.data_PriceList[j].Oyear1);
                        $scope.data_PriceList[j].Oyear2 = String($scope.data_PriceList[j].Oyear2);
                        $scope.data_PriceList[j].Oyear3 = String($scope.data_PriceList[j].Oyear3);
                        $scope.data_PriceList[j].Oyear4 = String($scope.data_PriceList[j].Oyear4);
                        $scope.data_PriceList[j].Oyear5 = String($scope.data_PriceList[j].Oyear5);
                        $scope.data_PriceList[j].Syear1 = String($scope.data_PriceList[j].Syear1);
                        $scope.data_PriceList[j].Syear2 = String($scope.data_PriceList[j].Syear2);
                        $scope.data_PriceList[j].Syear3 = String($scope.data_PriceList[j].Syear3);
                        $scope.data_PriceList[j].Syear4 = String($scope.data_PriceList[j].Syear4);
                        $scope.data_PriceList[j].Syear5 = String($scope.data_PriceList[j].Syear5);
                        $scope.data_PriceList[j].STotal = String($scope.data_PriceList[j].STotal);
                        $scope.data_PriceList[j].VTotal = String($scope.data_PriceList[j].VTotal);
                        $scope.data_PriceList[j].OTotal = String($scope.data_PriceList[j].OTotal);
                        $scope.data_PriceList[j].CTotal = String($scope.data_PriceList[j].CTotal);
                        $scope.data_PriceList[j].LTotal = String($scope.data_PriceList[j].LTotal);
                        $scope.data_PriceList[j].forvendordiscount = String($scope.data_PriceList[j].forvendordiscount);
                        $scope.data_PriceList[j].distmarginpercent = String($scope.data_PriceList[j].distmarginpercent);
                        $scope.data_PriceList[j].distdiscount = String($scope.data_PriceList[j].distdiscount);
                        $scope.data_PriceList[j].marginpercent = String($scope.data_PriceList[j].marginpercent);
                        $scope.data_PriceList[j].customerdiscount = String($scope.data_PriceList[j].customerdiscount);
                        $scope.data_PriceList[j].Dutytax1 = String($scope.data_PriceList[j].Dutytax1);
                        $scope.data_PriceList[j].Dutytax2 = String($scope.data_PriceList[j].Dutytax2);
                        $scope.data_PriceList[j].Dutytax3 = String($scope.data_PriceList[j].Dutytax3);
                        $scope.data_PriceList[j].DTyear1 = String($scope.data_PriceList[j].DTyear1);
                        $scope.data_PriceList[j].DTyear2 = String($scope.data_PriceList[j].DTyear2);
                        $scope.data_PriceList[j].DTyear3 = String($scope.data_PriceList[j].DTyear3);
                        $scope.data_PriceList[j].DTyear4 = String($scope.data_PriceList[j].DTyear4);
                        $scope.data_PriceList[j].DTyear5 = String($scope.data_PriceList[j].DTyear5);
                        $scope.data_PriceList[j].DTTotal = String($scope.data_PriceList[j].DTTotal);
                        $scope.data_PriceList[j].FCUyear1 = String($scope.data_PriceList[j].FCUyear1);
                        $scope.data_PriceList[j].FCUyear2 = String($scope.data_PriceList[j].FCUyear2);
                        $scope.data_PriceList[j].FCUyear3 = String($scope.data_PriceList[j].FCUyear3);
                        $scope.data_PriceList[j].FCUyear4 = String($scope.data_PriceList[j].FCUyear4);
                        $scope.data_PriceList[j].FCUyear5 = String($scope.data_PriceList[j].FCUyear5);
                        $scope.data_PriceList[j].FCUTotal = String($scope.data_PriceList[j].FCUTotal);
                        $scope.data_PriceList[j].ConversionRate = String($scope.data_PriceList[j].ConversionRate);
                        $scope.data_PriceList[j].FCLyear1 = String($scope.data_PriceList[j].FCLyear1);
                        $scope.data_PriceList[j].FCLyear2 = String($scope.data_PriceList[j].FCLyear2);
                        $scope.data_PriceList[j].FCLyear3 = String($scope.data_PriceList[j].FCLyear3);
                        $scope.data_PriceList[j].FCLyear4 = String($scope.data_PriceList[j].FCLyear4);
                        $scope.data_PriceList[j].FCLyear5 = String($scope.data_PriceList[j].FCLyear5);
                        $scope.data_PriceList[j].FCLTotal = String($scope.data_PriceList[j].FCLTotal);
                        $scope.data_PriceList[j].FDLyear1 = String($scope.data_PriceList[j].FDLyear1);
                        $scope.data_PriceList[j].FDLyear2 = String($scope.data_PriceList[j].FDLyear2);
                        $scope.data_PriceList[j].FDLyear3 = String($scope.data_PriceList[j].FDLyear3);
                        $scope.data_PriceList[j].FDLyear4 = String($scope.data_PriceList[j].FDLyear4);
                        $scope.data_PriceList[j].FDLyear5 = String($scope.data_PriceList[j].FDLyear5);
                        $scope.data_PriceList[j].FDLTotal = String($scope.data_PriceList[j].FDLTotal);
                        $scope.data_PriceList[j].FWDLyear1 = String($scope.data_PriceList[j].FWDLyear1);
                        $scope.data_PriceList[j].FWDLyear2 = String($scope.data_PriceList[j].FWDLyear2);
                        $scope.data_PriceList[j].FWDLyear3 = String($scope.data_PriceList[j].FWDLyear3);
                        $scope.data_PriceList[j].FWDLyear4 = String($scope.data_PriceList[j].FWDLyear4);
                        $scope.data_PriceList[j].FWDLyear5 = String($scope.data_PriceList[j].FWDLyear5);
                        $scope.data_PriceList[j].FWDLTotal = String($scope.data_PriceList[j].FWDLTotal);
                        $scope.data_PriceList[j].FSLyear1 = String($scope.data_PriceList[j].FSLyear1);
                        $scope.data_PriceList[j].FSLyear2 = String($scope.data_PriceList[j].FSLyear2);
                        $scope.data_PriceList[j].FSLyear3 = String($scope.data_PriceList[j].FSLyear3);
                        $scope.data_PriceList[j].FSLyear4 = String($scope.data_PriceList[j].FSLyear4);
                        $scope.data_PriceList[j].FSLyear5 = String($scope.data_PriceList[j].FSLyear5);
                        $scope.data_PriceList[j].FSLTotal = String($scope.data_PriceList[j].FSLTotal);
                        $scope.data_PriceList[j].FVLyear1 = String($scope.data_PriceList[j].FVLyear1);
                        $scope.data_PriceList[j].FVLyear2 = String($scope.data_PriceList[j].FVLyear2);
                        $scope.data_PriceList[j].FVLyear3 = String($scope.data_PriceList[j].FVLyear3);
                        $scope.data_PriceList[j].FVLyear4 = String($scope.data_PriceList[j].FVLyear4);
                        $scope.data_PriceList[j].FVLyear5 = String($scope.data_PriceList[j].FVLyear5);
                        $scope.data_PriceList[j].FVLTotal = String($scope.data_PriceList[j].FVLTotal);

                    }
                    catch (e) {
                        console.log('some error while sending data to server')
                    }
                }

                var PriceSheetJsondata = {
                    OppId: $scope.OpportunityDetail_PriceList.OppId, IsSaveAs: false, PriceSheetId: $scope.MaxSheetGroupID_PriceList, Version: $scope.MaxVersion_PriceList, IsReadOnly_PriceList: $scope.grideditable_PriceList, ColStatus: constructstr, pricesheet: $scope.data_PriceList, Authour: $rootScope.UserInfo.user.userId,
                    paymentsheet: PaymentJsondata.paymentsheet,
                    GMsheet: GMJsondata.paymentsheet
                    , opsheet: OppConfigJsondata.paymentsheet
                    , TandEPSSheet: TEPSJsondata.TandEPSSheet
                    , TandEResourceSheet: TEJsondata.TandEResourceSheet
                    , ResourceSheet: ResourcingJsondata.ResourceSheet
                    , DaySheet: DaysheetJsondata.DaySheet
                    , DaysheetPriceCost: DaysheetJsondata.DaysheetPriceCost
                    , DaysheetResourceDistribution: DaysheetJsondata.DaysheetResourceDistribution
                    , DaysheetFTEHours: DaysheetJsondata.DaysheetFTEHours
                    , DaysheetExtendedEffort: DaysheetJsondata.DaysheetExtendedEffort
                    , DaySheetVersionJSON: DaysheetJsondata.DaySheetVersionJSON
                };



                if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null') {
                    PriceSheetJsondata.Version = 'Ver_0.1';
                    PriceSheetJsondata.Comment = 'Initial';
                    $routeParams.GroupId = $scope.MaxSheetGroupID_PriceList;
                    priceService.AddPriceSheet(PriceSheetJsondata).success(function (data) {
                        if (data.Error == '' || data.Error == undefined || data.Error == null) {
                            $scope.griduseredit_PriceList = false;
                            $scope.hasedit_PriceList = true;
                            $scope.grideditable_PriceList = false;
                            $scope.onLoad_PriceList();

                            //j  if ($scope.Isleaving_PriceList)
                            //j        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                            toaster.pop('success', "SAVE", 'Price Sheet Saved Successfully', 3000);
                            return true;
                        }
                        else {

                            toaster.pop('error', "Error", data.Error, null);
                        }

                    }).error(function (error) {
                        alert("failure message: " + JSON.stringify(error));
                    });
                }
                else {
                    priceService.UpdatePriceSheet(PriceSheetJsondata).success(function (data) {

                        if (data.Error == '' || data.Error == undefined || data.Error == null) {
                            $scope.griduseredit_PriceList = false;
                            $scope.hasedit_PriceList = true;
                            $scope.grideditable_PriceList = false;
                            //j     if ($scope.Isleaving_PriceList)
                            //j       redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                            $scope.onLoad_PriceList();
                            toaster.pop('success', "SAVE", 'Price Sheet Saved Successfully', 3000);
                            return true;
                        }
                        else {
                            toaster.pop('error', "Error", data.Error, null);
                        }

                    }).error(function (error) {
                        alert("failure message: " + JSON.stringify(error));
                    });
                }

            }
            else {

            }


            $('#showSavemodel').modal('hide');

        }

        //updating pricesheet to new version
        $scope.UpdatePriceSheetVersion = function () {
            //have to work here

            if (validatedataonSAVE()) {
                priceService.GetMaximumGroupPriceSheetId().success(function (data) {
                    if (data[0].count == 'null') {
                        $scope.MaxSheetGroupIDForSaveAs = 1;
                    }
                    else {
                        $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
                    }

                    var currentversion = $scope.MaxVersion.split('_')[1];
                    var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
                    var version = 'Ver_' + i;

                    $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;
                    var data = $scope.data.concat($scope.data1).concat($scope.data2).concat($scope.data3);


                    for (var j = 0; j < data.length; j++) {
                        try {
                            delete data[j].Id
                            data[j].GridName = String(data[j].GridName);
                            data[j].PM = String(data[j].PM);
                            data[j].ProductName = String(data[j].Section);
                            data[j].DaySheetGroupId = String($scope.MaxSheetGroupID);

                        }
                        catch (e) {
                            console.log('some error while sending data to server')
                        }
                    }

                    var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, SheetId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable_PriceList, DaySheet: data, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId, DaySheetVersionJSON: JSON.stringify($scope.localversionConfirm) };

                    Jsondata.Version = version;
                    DayService.AddDaySheet(Jsondata).success(function (data) {
                        if (data.Error == '' || data.Error == undefined || data.Error == null) {
                            $scope.griduseredit = false;
                            redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                        }
                        else {
                            toaster.pop('error', "Error", data.Error, 3000);
                        }
                    }).error(function (error) {
                        alert("failure message: " + JSON.stringify(error));
                    });
                });
                //$scope.ReleaseSheetWhenExpired($scope.MaxSheetGroupID).success(function (data) {
                //    //alert(data)
                //}).error(function (error) {

                //    $scope.Error = error;
                //})
            }

            $('#showsaveAsmodel').modal('hide');
        }



        function validatedataonSAVE_pricingsheet() {

            if ($scope.data_PriceList.length > 0) {
                //return true;
                $scope.validdataonsave = [];
                var isvalid = true;

                for (var i = 0; i < $scope.data_PriceList.length; i++) {

                    if ($scope.data_PriceList[i].LegalEntityId != null && $scope.data_PriceList[i].LegalEntityId != '' && $scope.data_PriceList[i].CurrencyId != '' && $scope.data_PriceList[i].CurrencyId != null) {

                        if (($scope.data_PriceList[i].OemId == 1 || $scope.data_PriceList[i].ComponenttypeId == 1) && $scope.data_PriceList[i].LTotal > 0) {
                            isvalid = false;
                            var errorrow = i + 1;
                            toaster.pop('error', "Failed", 'Sheet contains invalid data in row number ' + errorrow, null);
                            break;
                        }
                        else if ($scope.data_PriceList[i].OemId != 1 && $scope.data_PriceList[i].ComponenttypeId != 1 && $scope.data_PriceList[i].LTotal > 0) {
                            $scope.validdataonsave.push($scope.data_PriceList[i]);
                        }
                    }
                    else {
                        isvalid = false;
                        var errorrow = i + 1;
                        toaster.pop('error', "Failed", 'Country or currency not filled in row number ' + errorrow, null);
                        break;
                    }
                }
                return isvalid;
            }

            else {
                toaster.pop('error', "Failed", 'No data to update', null);
                return false;
            }
        }

        $scope.deleteRow = function () {
            angular.element(document.querySelector('#loader')).removeClass('hide');

            var selected = $scope.gridOptions_PriceList.api.getFocusedCell();
            if (selected == null) {
                toaster.pop('error', "Error", 'Please select row to delete', null);
            }
            else {
                $scope.data_PriceList.splice(selected.rowIndex, 1);
                toaster.pop('success', "Success", 'Row ' + (parseInt(selected.rowIndex) + 1) + ' deleted successfully', null);
                var alterrows = selected.rowIndex;
                for (alterrows; alterrows < $scope.gridOptions_PriceList.rowData.length; alterrows++) {
                    console.log(alterrows)
                    $scope.data_PriceList[alterrows].RowId = alterrows + 1;
                }

                $scope.gridOptions_PriceList.api.setRowData($scope.data_PriceList);
                $scope.gridOptions_PriceList.rowData = $scope.data_PriceList;
                onFloatingBottomCount_PriceList(1);
            }
            $timeout(function () {
                angular.element(document.querySelector('#loader')).addClass('hide');
            }, 500);

        }

        $scope.onBtExport = function () {
            //var params = {
            //    skipHeader: false,
            //    skipFooters: false,
            //    skipGroups: false,
            //    //allColumns: true,
            //    onlySelected: false,
            //    fileName: 'test1s.csv',
            //    columnSeparator: ''
            //};

            //$scope.gridOptions_PriceList.api.exportDataAsCsv(params);
            priceService.ExportToExcelSheet($scope.data_PriceList).success(function (data) {
                console.log(data);
                var url = BaseURL + 'ExportFiles/' + data.name;

                $scope.downloadurl = url;
                $scope.filename = data.name;
                setTimeout(function () {
                    $('#downloadpdf')[0].click();
                }, 1000);

            }).error(function (error) {
                $scope.Error = error;
            })

        }

        function redirectRefreshPage(oppId, groupId) {
            $window.location.href = "PriceList/" + oppId + "/" + groupId;
        }

        $scope.IncreaseAdditionalTimeToSheet = function () {
            var LockSheetModel = { GroupId: $scope.MaxSheetGroupID_PriceList, username: $rootScope.UserInfo.user.userId, LockedInApp: 'PriceSheet' };
            priceService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
                if (!data.IsLocked) {
                    $scope.hasedit_PriceList = false;
                    $scope.griduseredit_PriceList = true;
                    $scope.$broadcast('timer-add-cd-seconds', 840);
                    $('#showmod').modal('hide');
                }
                else {
                    $scope.sheetholdedby_PriceList = data.LockedUser;

                    if (data.LockedUser == $rootScope.UserInfo.user.userId) {
                        $scope.hasedit_PriceList = false;
                        $scope.griduseredit_PriceList = true;
                        $scope.grideditable_PriceList = true;
                        $scope.counter = 0;
                        $scope.$broadcast('timer-add-cd-seconds', 840);
                        $('#showmod').modal('hide');
                    }
                    else {
                        $scope.grideditable_PriceList = false;
                        $scope.hasedit_PriceList = true;
                        $scope.griduseredit_PriceList = false;
                        $scope.sheetholdedby_PriceList = 'Error occured..';
                    }
                }

                //  $scope.GetPriceSheetByversion($scope.OpportunityDetail_PriceList.OppId, $routeParams.GroupId);

                //   $scope.onLoad_PriceList();


            }).error(function (error) {

                $scope.Error = error;
            })
        }

        $scope.ReleaseSheetWhenExpired = function () {
            priceService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID_PriceList).success(function (data) {
                //have to verify
                //alert(data)
            }).error(function (error) {

                $scope.Error = error;
            })
        }

        $scope.EditSheet = function () {

            $scope.sheetholdedby_PriceList = '';
            angular.element(document.querySelector('#loader')).removeClass('hide');

            priceService.GetMaximumGroupPriceSheetId().success(function (data) {
                if (data[0].count == 'null') {
                    $scope.MaxSheetGroupIDForSaveAs_PriceList = 1;
                }
                else {
                    $scope.MaxSheetGroupIDForSaveAs_PriceList = data[0].count + 1;
                }

                if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                    $scope.MaxVersion_PriceList = 'Ver_0.1'
                    //jay please had look here 
                    $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs_PriceList;
                    $scope.MaxSheetGroupID_PriceList = $scope.MaxSheetGroupIDForSaveAs_PriceList;
                }



                var LockSheetModel = { OppId: $scope.OpportunityDetail_PriceList.OppId, GroupId: $scope.MaxSheetGroupID_PriceList, username: $rootScope.UserInfo.user.userId, LockedInApp: 'PriceSheet', IsPriceSheetUpdated: true };

                priceService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {

                    if (!data.IsLocked) {
                        $scope.hasedit_PriceList = false;
                        $scope.griduseredit_PriceList = true;
                        $scope.isEditClicked = true;
                        $routeParams.GroupId = data.PriceSheetId;
                        $scope.MaxVersion_PriceList = data.Version;
                        $scope.grideditable_PriceList = data.IsEditable;
                        $scope.$broadcast('timer-reset');
                        $scope.$broadcast('timer-start');
                    }
                    else {

                        if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "PriceSheet") {
                            $scope.hasedit_PriceList = false;
                            $scope.griduseredit_PriceList = true;
                            $scope.grideditable_PriceList = true;
                            $scope.isEditClicked = true;
                            $routeParams.GroupId = data.PriceSheetId;
                            $scope.MaxVersion_PriceList = data.Version;
                            $scope.sheetholdedby_PriceList = '';
                            $scope.$broadcast('timer-reset');
                            $scope.$broadcast('timer-start');
                        }
                        else {
                            $scope.grideditable_PriceList = false;
                            $scope.hasedit_PriceList = true;
                            $scope.griduseredit_PriceList = false;
                            $scope.isEditClicked = false;
                            // $scope.sheetholdedby_PriceList = data.LockedUser;
                            // $scope.sheetholdedby_PriceList = "LockedIn: " + data.LockedIn + " By " + data.LockedUser;
                            $scope.sheetholdedby_PriceList = "Locked By " + data.LockedUser;
                        }
                    }

                    if ($scope.MaxSheetGroupID_PriceList != 'undefined' && $scope.MaxSheetGroupID_PriceList != 'null' && $scope.MaxSheetGroupID_PriceList != '') {
                        priceService.GetAllPriceSheetbyOppGroupID($scope.OpportunityDetail_PriceList.OppId, $scope.MaxSheetGroupID_PriceList).success(function (data) {
                            if (data.Error == null) {
                                $scope.data_PriceList = data;
                                $scope.onLoad_PriceList();
                            }
                            else {
                                // toaster.pop('error', "Error", 'Error in edit API calls', null);
                            }
                        });
                    }

                    docalculationforpayment();
                    console.log($scope.grideditable_PriceList)
                    //debugger;
                    $scope.onLoad();


                    $timeout(function () {
                        angular.element(document.querySelector('#loader')).addClass('hide');
                    }, 500);




                }).error(function (error) {

                    $scope.Error = error;
                })

            }).error(function (error) {
                $scope.Error = error;
            })

        }

        //start cell value change calculations

        function GetOEMVendorCalculation(params) {
            singlecalc(params);
        }

        function getcalculationforPriceEditorChange(params) {
            singlecalc(params);
        }

        function getcalculationforOEMEditorChange(params) {
            singlecalc(params);
        }

        function GetListCalculation(params, year) {
            singlecalc(params);
        }

        function getdistributorandmargindiscount(params) {
            singlecalc(params);
        }

        function getMarinpercent(params) {
            singlecalc(params);
        }

        function getcalculationforVAD(params) {
            singlecalc(params);
        }

        //used in single calc
        function getcalculationfordutytax(params) {

            for (var id = 1; id <= 5; id++) {
                params.data['DTyear' + id] = Math.round(parseFloat(params.data['Cyear' + id]) * ((parseFloat(params.data.Dutytax1) + parseFloat(params.data.Dutytax2) + parseFloat(params.data.Dutytax3)) / 100));
                params.data['FCUyear' + id] = parseFloat(parseFloat(params.data['DTyear' + id])) + parseFloat(params.data['Cyear' + id]);
            }
            //Currency Conversion
            getFinalCurrencyConversionRate(params.data);
        }

        function getFinalCurrencyConversionRate(params) {

            if (params.ConversionRate == '--' || params.ConversionRate == 'NA') {
                for (var id = 1; id <= 5; id++) {
                    params['FCLyear' + id] = params['FCUyear' + id];
                    params['FDLyear' + id] = params['DTyear' + id];
                    params['FWDLyear' + id] = params['Cyear' + id];
                    params['FSLyear' + id] = params['Syear' + id];
                    params['FVLyear' + id] = params['Vyear' + id];
                }
            }
            else {
                for (var id = 1; id <= 5; id++) {
                    params['FCLyear' + id] = Math.ceil(parseFloat(params['FCUyear' + id]) * parseFloat(params.ConversionRate));
                    params['FDLyear' + id] = Math.ceil(parseFloat(params['DTyear' + id]) * parseFloat(params.ConversionRate));
                    params['FWDLyear' + id] = Math.ceil(parseFloat(params['Cyear' + id]) * parseFloat(params.ConversionRate));
                    params['FSLyear' + id] = Math.ceil(parseFloat(params['Syear' + id]) * parseFloat(params.ConversionRate));
                    params['FVLyear' + id] = Math.ceil(parseFloat(params['Vyear' + id]) * parseFloat(params.ConversionRate));
                }
            }


        }

        function singlecalc(params) {

            if (params.data.oem != 'Servion') {
                for (var year = 1; year <= 5; year++) {
                    //OEM/vendor Price calc
                    params.data['Oyear' + year] = Math.ceil(Math.ceil(params.data['Lyear' + year]) * (1 - (params.data.forvendordiscount / 100)));
                    //To Servion Price (Cost)
                    if (params.data.distdiscount > 0) {
                        params.data['Syear' + year] = Math.ceil(Math.ceil(params.data['Lyear' + year]) * (1 - (params.data.distdiscount / 100)));
                    }
                    else {
                        params.data['Syear' + year] = Math.ceil(params.data['Oyear' + year] / (1 - (params.data.distmarginpercent / 100)));
                    }
                }
            }
            else {
                //To Servion Price (Cost)
                for (var year = 1; year <= 5; year++) {
                    params.data.forvendordiscount = 0;
                    params.data['Oyear' + year] = 0;
                    params.data['Syear' + year] = Math.ceil(params.data['Oyear' + year] / (1 - (params.data.distmarginpercent / 100)))
                }
            }

            //Customer Price (USD) [Without Duty / Tax]
            if (params.data.pricetype == "VAD" || params.data.pricetype == "COST") {
                for (var id = 1; id <= 5; id++) {
                    params.data['Cyear' + id] = 0;
                }
            }
            else {
                if (params.data.customerdiscount > 0) {
                    for (var id = 1; id <= 5; id++) {
                        params.data['Cyear' + id] = Math.ceil(Math.ceil(params.data['Lyear' + id]) * (1 - (params.data.customerdiscount / 100)));;
                    }
                }
                else {
                    if (params.data.oem != 'Servion') {
                        for (var id = 1; id <= 5; id++) {
                            params.data['Cyear' + id] = Math.ceil(params.data['Syear' + id] / (1 - (params.data.marginpercent / 100)));
                        }
                    }
                    else {
                        for (var id = 1; id <= 5; id++) {
                            params.data['Cyear' + id] = Math.ceil(Math.ceil(params.data['Lyear' + id]) / (1 - (params.data.marginpercent / 100)));
                        }
                    }
                }
            }

            if (params.data.componenttype != "T&E") {
                //VAD calc
                if (params.data.pricetype == "VAD") {

                    for (var id = 1; id <= 5; id++) {
                        params.data['Vyear' + id] = Math.ceil(params.data['Lyear' + id]);
                        params.data['Syear' + id] = 0;
                    }
                }
                else {
                    if (params.data.pricetype == "COST") {
                        for (var id = 1; id <= 5; id++) {
                            params.data['Vyear' + id] = 0
                        }
                    }
                    else if (params.data.oem == 'Servion') {
                        for (var id = 1; id <= 5; id++) {
                            params.data['Vyear' + id] = parseFloat(params.data['Cyear' + id]);
                        }
                    }
                    else {
                        for (var id = 1; id <= 5; id++) {
                            params.data['Vyear' + id] = parseFloat(params.data['Cyear' + id]) - parseFloat(params.data['Syear' + id]);
                        }
                    }
                }
            }
            else {
                for (var id = 1; id <= 5; id++) {
                    params.data['Vyear' + id] = 0;
                }
            }

            getcalculationfordutytax(params);

        }
        //end cell value change calculations


        //LOB logic start
        function getLOBValue(params) {

            if (params.data.oem != 'Servion' && params.data.oem != 'Acqueon') {
                //"TRADING"
                var obj = getLOBbyFilter("TRADING");
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Acqueon') {
                //"IP"
                var obj = getLOBbyFilter("IP");
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && params.data.componenttype == "Software") {
                //IP
                var obj = getLOBbyFilter("IP")
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && params.data.componenttype == "AMC-SW") {
                //IP
                var obj = getLOBbyFilter("IP")
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && params.data.componenttype == "ServCare") {
                //MAINTENANCE
                var obj = getLOBbyFilter("MAINTENANCE")
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && params.data.componenttype == "Resourcing") {
                //RESOURCING
                var obj = getLOBbyFilter("RESOURCING")
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && params.data.componenttype == "Consulting") {
                //CONSULTING
                var obj = getLOBbyFilter("CONSULTING")
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && (params.data.componenttype == "PS" || params.data.componenttype == "T&M")) {
                //PS
                var obj = getLOBbyFilter("PS");
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && params.data.componenttype == "Hosted") {
                //CONSULTING
                var obj = getLOBbyFilter("HOSTED");
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
            else if (params.data.oem == 'Servion' && params.data.componenttype == "T&E") {
                //CONSULTING
                var obj = getLOBbyFilter("TRADING");
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }

            else {
                var obj = getLOBbyFilter("OTHER");
                if (obj != null) {
                    params.data.lob = obj.Id;
                    params.data.LOBName = obj.LOBName;
                }
            }
        }
        //LOB logic end

        function getLOBbyFilter(lobtype) {
            var obj = getObjects($scope.LOBList, 'LOBName', lobtype);
            return obj;
        }

        function getObjects(obj, key, val) {
            var newObj = false;
            $.each(obj, function () {
                var testObject = this;
                $.each(testObject, function (k, v) {
                    //alert(k);
                    if (val == v && k == key) {
                        newObj = testObject;
                    }
                });
            });

            return newObj;
        }

        $scope.AddPriceSheetpop = function () {
            $('#showSavemodel').modal('show');
        }


        $scope.saveasPriceSheetpop = function () {

            $('#showsaveAsmodel').modal('show');
        }



        $scope.saveasPriceSheetdiscard = function () {
            $scope.Isleaving_PriceList = false;
            if ($scope.AddPriceSheet(true)) {
                // var url = $scope.newnavigateURl.split('#');
                // $location.path(url[1]);
                $window.location.href = $scope.newnavigateURl;

            }

            $('#showSaveChangesmodel').modal('hide');
        }

        $scope.IgnoreChanges = function () {

            $scope.$broadcast('timer-stop');
            $scope.griduseredit_PriceList = false;
            $scope.hasedit_PriceList = false;
            priceService.ReleaseSheetWhenExpired($scope.MaxSheetGroupID_PriceList).success(function (data) {
                //alert(data)

                // if ($scope.MaxSheetGroupID_PriceList != 'undefined' && $scope.MaxSheetGroupID_PriceList != 'null' && $scope.MaxSheetGroupID_PriceList != '') {
                //     priceService.GetAllPriceSheetbyOppGroupID($scope.OpportunityDetail_PriceList.OppId, $scope.MaxSheetGroupID_PriceList).success(function (data) {
                //         if (data.Error == null) {
                //             $scope.data_PriceList = data;
                //             $scope.onLoad_PriceList();
                //         }
                //         else {
                //             //jay commented here
                //             // toaster.pop('error', "Error", 'Error in edit API calls', null);
                //         }
                //     });
                // }

            }).error(function (error) {

                $scope.Error = error;
            })
        }



        function calculatePMThreshold() {

            var ProjectMArginOjectsLevel1 = [];
            var ProjectMArginOjectsLevel2 = [];
            var ProjectMArginOjectsLevel3 = [];

            var data = $scope.TempDiscount;
            if (data.length > 0) {
                if ($scope.margin.TRADING != 0) {

                    var trade = _.where(data, { LOBName: "TRADING" })
                    if (trade.length > 0) {
                        if ($scope.margin.TRADING <= trade[0].Level1 && $scope.margin.TRADING > trade[0].Level2) {
                            ProjectMArginOjectsLevel1.push({ value1: $scope.TRADINGvalue, value2: $scope.margin.TRADING, Type: 'TRADING', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.TRADING <= trade[0].Level2 && $scope.margin.TRADING > trade[0].Level3) {
                            ProjectMArginOjectsLevel2.push({ value1: $scope.TRADINGvalue, value2: $scope.margin.TRADING, Type: 'TRADING', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.TRADING <= trade[0].Level3 && $scope.margin.TRADING > 0) {
                            ProjectMArginOjectsLevel3.push({ value1: $scope.TRADINGvalue, value2: $scope.margin.TRADING, Type: 'TRADING', OppId: $scope.OpportunityDetail.OppId })
                        }
                    }
                }



                if ($scope.margin.MAINTANACE != 0) {
                    var maintenance = _.where(data, { LOBName: "MAINTANACE" })
                    if (maintenance.length > 0) {
                        if ($scope.margin.MAINTANACE <= maintenance[0].Level1 && $scope.margin.MAINTANACE > maintenance[0].Level2) {
                            ProjectMArginOjectsLevel1.push({ value1: $scope.margin.MAINTANACE, value2: $scope.MAINTANACEvalue, Type: 'MAINTANACE', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.MAINTANACE <= maintenance[0].Level2 && $scope.margin.MAINTANACE > maintenance[0].Level3) {
                            ProjectMArginOjectsLevel2.push({ value1: $scope.margin.MAINTANACE, value2: $scope.MAINTANACEvalue, Type: 'MAINTANACE', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.MAINTANACE <= maintenance[0].Level3 && $scope.margin.MAINTANACE > 0) {
                            ProjectMArginOjectsLevel3.push({ value1: $scope.margin.MAINTANACE, value2: $scope.MAINTANACEvalue, Type: 'MAINTANACE', OppId: $scope.OpportunityDetail.OppId })
                        }
                    }
                }


                if ($scope.margin.IP != 0) {
                    var ip = _.where(data, { LOBName: "IP" })
                    if (ip.length > 0) {
                        if ($scope.margin.IP <= ip[0].Level1 && $scope.margin.IP > ip[0].Level2) {
                            ProjectMArginOjectsLevel1.push({ value1: $scope.margin.IP, value2: $scope.IPvalue, Type: 'IP', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.IP <= ip[0].Level2 && $scope.margin.IP > ip[0].Level3) {
                            ProjectMArginOjectsLevel2.push({ value1: $scope.margin.IP, value2: $scope.IPvalue, Type: 'IP', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.IP <= ip[0].Level3 && $scope.margin.IP > 0) {
                            ProjectMArginOjectsLevel3.push({ value1: $scope.margin.IP, value2: $scope.IPvalue, Type: 'IP', OppId: $scope.OpportunityDetail.OppId })
                        }
                    }
                }




                if ($scope.margin.HOSTED != 0) {
                    var hosted = _.where(data, { LOBName: "HOSTED" })
                    if (hosted.length > 0) {
                        if ($scope.margin.HOSTED <= hosted[0].Level1 && $scope.margin.HOSTED > hosted[0].Level2) {
                            ProjectMArginOjectsLevel1.push({ value1: $scope.margin.HOSTED, value2: $scope.HOSTEDvalue, Type: 'HOSTED', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.HOSTED <= hosted[0].Level2 && $scope.margin.HOSTED > hosted[0].Level3) {
                            ProjectMArginOjectsLevel2.push({ value1: $scope.margin.HOSTED, value2: $scope.HOSTEDvalue, Type: 'HOSTED', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.HOSTED <= hosted[0].Level3 && $scope.margin.HOSTED > 0) {
                            ProjectMArginOjectsLevel3.push({ value1: $scope.margin.HOSTED, value2: $scope.HOSTEDvalue, Type: 'HOSTED', OppId: $scope.OpportunityDetail.OppId })
                        }
                    }
                }



                if ($scope.margin.PS != 0) {
                    var ps = _.where(data, { LOBName: "PS" })
                    if (ps.length > 0) {
                        if ($scope.margin.PS <= ps[0].Level1 && $scope.margin.PS > ps[0].Level2) {
                            ProjectMArginOjectsLevel1.push({ value1: $scope.margin.PS, value2: $scope.PSvalue, Type: 'PS', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.PS <= ps[0].Level2 && $scope.margin.PS > ps[0].Level3) {
                            ProjectMArginOjectsLevel2.push({ value1: $scope.margin.PS, value2: $scope.PSvalue, Type: 'PS', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.PS <= ps[0].Level3 && $scope.margin.PS > 0) {
                            ProjectMArginOjectsLevel3.push({ value1: $scope.margin.PS, value2: $scope.PSvalue, Type: 'PS', OppId: $scope.OpportunityDetail.OppId })
                        }
                    }
                }



                if ($scope.margin.RESOURCING != 0) {
                    var resource = _.where(data, { LOBName: "RESOURCING" })
                    if (resource.length > 0) {
                        if ($scope.margin.RESOURCING <= resource[0].Level1 && $scope.margin.RESOURCING > resource[0].Level2) {
                            ProjectMArginOjectsLevel1.push({ value1: $scope.margin.RESOURCING, value2: $scope.RESOURCINGvalue, Type: 'RESOURCING', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.RESOURCING <= resource[0].Level2 && $scope.margin.RESOURCING > resource[0].Level3) {
                            ProjectMArginOjectsLevel2.push({ value1: $scope.margin.RESOURCING, value2: $scope.RESOURCINGvalue, Type: 'RESOURCING', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.RESOURCING <= resource[0].Level3 && $scope.margin.RESOURCING > 0) {
                            ProjectMArginOjectsLevel3.push({ value1: $scope.margin.RESOURCING, value2: $scope.RESOURCINGvalue, Type: 'RESOURCING', OppId: $scope.OpportunityDetail.OppId })
                        }
                    }
                }



                if ($scope.margin.CONSULTING != 0) {
                    var consulting = _.where(data, { LOBName: "CONSULTING" })
                    if (consulting.length > 0) {
                        if ($scope.margin.CONSULTING <= consulting[0].Level1 && $scope.margin.CONSULTING > consulting[0].Level2) {
                            ProjectMArginOjectsLevel1.push({ value1: $scope.margin.CONSULTING, value2: $scope.CONSULTINGvalue, Type: 'CONSULTING', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.CONSULTING <= consulting[0].Level2 && $scope.margin.CONSULTING > consulting[0].Level3) {
                            ProjectMArginOjectsLevel2.push({ value1: $scope.margin.CONSULTING, value2: $scope.CONSULTINGvalue, Type: 'CONSULTING', OppId: $scope.OpportunityDetail.OppId })
                        }
                        else if ($scope.margin.CONSULTING <= consulting[0].Level3 && $scope.margin.CONSULTING > 0) {
                            ProjectMArginOjectsLevel3.push({ value1: $scope.margin.CONSULTING, value2: $scope.CONSULTINGvalue, Type: 'CONSULTING', OppId: $scope.OpportunityDetail.OppId })
                        }
                    }
                }


                var JSONMaildata = { Level1: ProjectMArginOjectsLevel1, Level2: ProjectMArginOjectsLevel2, Level3: ProjectMArginOjectsLevel3 }
                priceService.PMSendEmail(JSONMaildata).success(function (data) {
                    //alert(data);
                }).error(function (error) {

                    $scope.Error = error;
                })
            }

        }


        function calculateThreshold() {

            var EmailMArginOjectsLevel1 = [];
            var EmailMArginOjectsLevel2 = [];
            var EmailMArginOjectsLevel3 = [];

            var EmailDiscountOjectsLevel1 = [];
            var EmailDiscountOjectsLevel2 = [];
            var EmailDiscountOjectsLevel3 = [];

            _.each($scope.validdataonsave, function (value, key) {
                if (value.oem != 'Servion') {
                    _.each($scope.margin, function (value1, key) {
                        if (value1.ComponentType == value.ComponenttypeId && value1.Vendor == value.OemId) {
                            if (value.Calmarginpercent <= value1.Level1 && value.Calmarginpercent > value1.Level2) {
                                EmailMArginOjectsLevel1.push(value)
                            }
                            else if (value.Calmarginpercent <= value1.Level2 && value.Calmarginpercent > value1.Level3) {
                                EmailMArginOjectsLevel2.push(value)
                            }
                            else if (value.Calmarginpercent <= value1.Level3 && value.Calmarginpercent > 0) {
                                EmailMArginOjectsLevel3.push(value)
                            }
                        }
                        else if (value1.ComponentType == value.ComponenttypeId) {

                            if (value.Calmarginpercent <= value1.Level1 && value.Calmarginpercent > value1.Level2) {
                                EmailMArginOjectsLevel1.push(value)
                            }
                            else if (value.Calmarginpercent <= value1.Level2 && value.Calmarginpercent > value1.Level3) {
                                EmailMArginOjectsLevel2.push(value)
                            }
                            else if (value.Calmarginpercent <= value1.Level3 && value.Calmarginpercent > 0) {
                                EmailMArginOjectsLevel3.push(value)
                            }

                        }
                    });
                }
                else {
                    _.each($scope.discount, function (value2, key) {
                        if (value2.ComponentType == value.ComponenttypeId && value2.Vendor == value.OemId) {
                            if (value.Calcustomerdiscount >= value2.Level1 && value.Calcustomerdiscount < value2.Level2) {
                                EmailDiscountOjectsLevel1.push(value)
                            }
                            else if (value.Calcustomerdiscount >= value2.Level2 && value.Calcustomerdiscount < value2.Level3) {
                                EmailDiscountOjectsLevel2.push(value)
                            }
                            else if (value.Calcustomerdiscount >= value2.Level3 && value.Calcustomerdiscount > value2.Level2) {
                                EmailDiscountOjectsLevel3.push(value)
                            }
                        }
                        else if (value2.ComponentType == value.ComponenttypeId) {
                            if (value.Calcustomerdiscount >= value2.Level1 && value.Calcustomerdiscount < value2.Level2) {
                                EmailDiscountOjectsLevel1.push(value)
                            }
                            else if (value.Calcustomerdiscount >= value2.Level2 && value.Calcustomerdiscount < value2.Level3) {
                                EmailDiscountOjectsLevel2.push(value)
                            }
                            else if (value.Calcustomerdiscount >= value2.Level3 && value.Calcustomerdiscount > value2.Level2) {
                                EmailDiscountOjectsLevel3.push(value)
                            }
                        }
                    });
                }

                //if (value.marginpercent != 'All') {
                //    EmailOjects.push(value);
                //}

            });


            var JSONMaildata = { EmailMArginOjectsLevel1: EmailMArginOjectsLevel1, EmailMArginOjectsLevel2: EmailMArginOjectsLevel2, EmailMArginOjectsLevel3: EmailMArginOjectsLevel3, EmailDiscountOjectsLevel1: EmailDiscountOjectsLevel1, EmailDiscountOjectsLevel2: EmailDiscountOjectsLevel2, EmailDiscountOjectsLevel3: EmailDiscountOjectsLevel3 }
            priceService.SendEmail(JSONMaildata).success(function (data) {
                //alert(data);


            }).error(function (error) {

                $scope.Error = error;
            })
        }


        ///-----------------------------------
        ///PriceSheetCode Integration
        ///-----------------------------------

        //---------======================
        //Payment sheet Code Integration
        //===============================


        $scope.PageVariableInitializationPayment = function () {

            $scope.GlobalIdentityOppId_payment = $routeParams.OppId;
            $scope.GlobalGroupId_payment = $routeParams.GroupId;

            $scope.call1finished_payment = false;
            $scope.call2finished_payment = false;
            $scope.call3finished_payment = false;
            $scope.call4finished_payment = false;
            $scope.call5finished_payment = true;
            $scope.call6finished_payment = false; // for payment period

            $scope.hasedit_payment = false;
            $scope.iscellrefresh_payment = false;
            $scope.isPricingSheetUpdated = false;

            $scope.GlobalIdentityOppId_payment = $routeParams.OppId;
            $scope.showmsg_payment = true;
            $scope.SelectOptions_payment = []



            $scope.DefautState_payment = false;

            //variable declaration
            $scope.componentList_payment = [];
            $scope.OEMOptions_payment = [];
            $scope.PSdata_payment = [];
            $scope.hasslice_payment = false;
            $scope.gridPayment = {
                angularCompileRows: true,
                columnDefs: [],
                rowSelection: 'single',
                //enableFilter: true,
                groupHeaders: true,
                headerHeight: 38,
                rowHeight: 25,
                rowData: $scope.Paymentdata,
                enableColResize: true,
                groupSuppressAutoColumn: false,
                groupSuppressGroupColumn: true,
                //enableCellExpressions: true,
                suppressMovableColumns: true,
                singleClickEdit: true,

                icons: {
                    menu: '<i class="fa fa-bars"/>',
                    // filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                    groupExpanded: '<i class="fa fa-minus-square-o"/>',
                    groupContracted: '<i class="fa fa-plus-square-o"/>',
                    columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                    columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
                },

                pinnedColumnCount: 1,

            };


            $scope.calculatedTotalinPayment = 0;
            $scope.calculatedTotalinPricing = 0;

        }

        $scope.PageVariableInitializationPayment();


        //initialize Grid options


        $scope.GetPriceSheetVersionsForOpp_payment = function (oppid) {

            console.log('oppid, groupid' + oppid)

            priceService.GetPriceSheetVersionsForOpp(oppid).success(function (data) {
                $scope.Versiondata = data;
                _.each($scope.Versiondata, function (value, key) {
                    if (value["PriceSheetId"] == $scope.GlobalGroupId_payment) {
                        if (value["IsPriceSheetUpdated"]) {
                            $scope.isPricingSheetUpdated = value["IsPriceSheetUpdated"];
                        }

                    }
                });

            }).error(function (error) {
                $scope.Error = error;
            })

        };

        $scope.GetPaymentSheetbyOppGroup_payment = function (oppid, groupid) {
            console.log('oppid, groupid' + oppid)
            paymentService.GetPaymentSheetbyOppGroup(oppid, groupid).success(function (data) {

                if (data != null && data.length > 0) {
                    localStorage.removeItem('price');
                    localStorage.setItem('price', JSON.stringify(data));
                    //$scope.Sourcedata = data;
                    $scope.call1finished_payment = true;
                    $scope.call2finished_payment = true;
                    $scope.callifAPIDone_Payment();
                }
                else {
                    $scope.call1finished_payment = true;
                    $scope.GetPaymentDefaultConfiguration_PriceList($scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId);
                }
                //by default need to load pricesheet for that payment
                $scope.GetAllPriceSheetbyOppGroupID_payment($scope.OpportunityDetail.OppId, $routeParams.GroupId);
                $scope.GetPriceSheetMappeddataByversion_payment($scope.OpportunityDetail.OppId, $routeParams.GroupId);
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetPriceSheetMappeddataByversion_payment = function (oppid, groupid) {

            priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function (data) {
                //jay 
                $scope.MaxVersion = data[0].Version;
                $scope.MaxSheetGroupID = data[0].PriceSheetId;
                //$scope.grideditable_PriceList = data[0].IsEditable;
                $scope.hasedit_payment = data[0].IsEditable;
                $scope.call4finished_payment = true;
                $scope.callifAPIDone_Payment();

            }).error(function (error) {
                $scope.Error = error;
            })
        };


        $scope.GetMaximumGroupPriceSheetId_PriceList = function () {

            priceService.GetMaximumGroupPriceSheetId().success(function (data) {
                if (data[0].count == 'null') {
                    $scope.MaxSheetGroupIDForSaveAs = 1;
                }
                else {
                    $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
                }

                if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                    //block the application
                }

                $scope.call5finished_payment = true;
                $scope.callifAPIDone_Payment();
            }).error(function (error) {
                $scope.Error = error;
            })

        };

        //getting default configuration for payment sheet based on BU and Region
        $scope.GetPaymentDefaultConfiguration_PriceList = function (BU, Region) {

            paymentConfigFactory.GetPaymentConfig(BU, Region).success(function (data) {
                //paymentService.GetPaymentDefaultConfiguration(BU, Region).success(function (data) {
                if (data != null && data.length > 0) {
                    localStorage.removeItem('price');
                    localStorage.setItem('price', JSON.stringify(data));
                    //$scope.Sourcedata = data;
                    console.log(data)
                    $scope.call2finished_payment = true;
                    $scope.callifAPIDone_Payment();
                }
                else {
                    //Default data not available then populate with 0 values
                    //default configuration mapped for sbu=0 and region=0 -> DB
                    paymentConfigFactory.GetPaymentConfig(0, 0).success(function (data) {
                        localStorage.removeItem('price');
                        localStorage.setItem('price', JSON.stringify(data));
                        $scope.call2finished_payment = true;
                        $scope.callifAPIDone_Payment();
                    }).error(function (error) {
                        $scope.Error = error;
                    })
                }
            }).error(function (error) {
                $scope.Error = error;
            })
        };



        $scope.GetPaymentPeriod_PriceList = function () {

            paymentService.GetPaymentPeriod().success(function (data) {

                $scope.SelectOptions_payment = data;
                $scope.call6finished_payment = true;
                $scope.callifAPIDone_Payment();

            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.getAllComponentType_payment = function () {
            priceService.GetAllComponentType().success(function (data) {
                $scope.componentList_payment = data;
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetOemOptions_payment = function () {
            priceService.GetAllOEM().success(function (data) {
                $scope.OEMOptions_payment = data;
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        //getting pricesheet data by groupid
        $scope.GetAllPriceSheetbyOppGroupID_payment = function (oppid, groupid) {
            priceService.GetAllPriceSheetbyOppGroupID(oppid, groupid).success(function (data) {
                PricingsheetFeedUpdate(data, false);
            }).error(function (error) {
                $scope.Error = error;
            })
        }

        //end service calls

        function PricingsheetFeedUpdate(data, isfeed) {
            var totalcustomerpricefromPricing = 0;
            $scope.PSdata_payment = [];
            angular.forEach(data, function (value, key) {
                if (value.oem != '--Select--' && value.componenttype != '--Select--') {
                    $scope.PSdata_payment.push(value);
                    totalcustomerpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }
            });
            $scope.calculatedTotalinPricing = parseInt(totalcustomerpricefromPricing);

            if (isfeed)
                docalculationforpayment();
            else
                $scope.callifAPIDone_Payment();

            $scope.call3finished_payment = true;
        }



        //processing master and slave grid content 
        function docalculationforpayment() {
            //debugger;
            $scope.slicearrayCnt = 0;
            $scope.Paymentdata = [];
            $scope.Paymentdata = JSON.parse(localStorage.getItem('price'));
            //  addrowforTotalPercentageUtilizeamount();
            for (var slicloop = 0; slicloop < $scope.slicearrayCnt; slicloop++) {
                $scope['Distinctedarray' + slicloop] = [];
                $scope['slicearray' + slicloop] = [];
            }

            if ($scope.Paymentdata != null) {
                var cnt = $scope.PSdata_payment.length;
                for (var i = 0; i < $scope.Paymentdata.length; i++) {
                    $scope.Paymentdata[i].Iyear1 = $scope.Paymentdata[i].Iyear2 = $scope.Paymentdata[i].Iyear3 = $scope.Paymentdata[i].Iyear4 = $scope.Paymentdata[i].Iyear5 = 0;

                    if ($scope.Paymentdata[i].PercentageType == "Yes") {

                        if ($scope.Paymentdata[i].VendorBreakdown == "Yes") {

                            $scope.hasslice_payment = true;
                            $scope['slicearray' + $scope.slicearrayCnt] = [];
                            $scope['Distinctedarray' + $scope.slicearrayCnt] = [];

                            for (var j = 0; j < cnt; j++) {
                                $scope['slicearray' + $scope.slicearrayCnt].push({ colid: i, MilestoneDescription: $scope.PSdata_payment[j].oem, Code: '', SubPaymentCode: $scope.Paymentdata[i].PaymentCode, Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: 0, percentageTotal: 0, OEMHWandSW: '--', OEMServices: '--', OEMPS: '--', SERVSW: '--', SERVServices: '--', SERVPS: '--', SERVResource: '--', SERVCare: '--', Others1: '--', Others2: '--', Others3: '--' });
                                paymentpercentcalc(i, j)
                            }
                            $scope.slicearrayCnt++;
                        }
                        else {
                            $scope.hasslice_payment = false;
                            paymentpercentcalc(i, 0)
                        }
                    }
                    else {
                        if ($scope.Paymentdata[i].PaymentCode != 'S9' && $scope.Paymentdata[i].PaymentCode != 'S10') {
                            if ($scope.Paymentdata[i].OEMHWandSW != '--Select--' && $scope.Paymentdata[i].OEMHWandSW != '--' && $scope.Paymentdata[i].OEMHWandSW != '0') {
                                calculatevaluesfromsheetoemdata(i, 'Hardware', 100);
                                calculatevaluesfromsheetoemdata(i, 'Software', 100);
                                calculatevaluesfromsheetoemdata(i, 'HW&SW', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].OEMHWandSW)
                            }
                            else {
                                $scope.Paymentdata[i].OEMHWandSW = '--Select--';
                            }
                            if ($scope.Paymentdata[i].OEMServices != '--Select--' && $scope.Paymentdata[i].OEMServices != '--' && $scope.Paymentdata[i].OEMServices != '0') {
                                calculatevaluesfromsheetoemdata(i, 'AMC-HW', 100);
                                calculatevaluesfromsheetoemdata(i, 'AMC-SW', 100);
                                calculatevaluesfromsheetoemdata(i, 'AMC-HW&SW', 100);
                                calculatevaluesfromsheetoemdata(i, 'AMC-PS', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].OEMServices)
                            }
                            else {
                                $scope.Paymentdata[i].OEMServices = '--Select--';
                            }

                            if ($scope.Paymentdata[i].OEMPS != '--Select--' && $scope.Paymentdata[i].OEMPS != '--' && $scope.Paymentdata[i].OEMPS != '0') {
                                calculatevaluesfromsheetoemdata(i, 'PS', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].OEMPS)
                            }
                            else {
                                $scope.Paymentdata[i].OEMPS = '--Select--';
                            }

                            if ($scope.Paymentdata[i].OEMOther != '--Select--' && $scope.Paymentdata[i].OEMOther != '--' && $scope.Paymentdata[i].OEMOther != '0') {
                                calculatevaluesfromsheetoemdata(i, "ServCare", 100);
                                calculatevaluesfromsheetoemdata(i, "T&M", 100);
                                calculatevaluesfromsheetoemdata(i, "Consulting", 100);
                                calculatevaluesfromsheetoemdata(i, "Resourcing", 100);
                                calculatevaluesfromsheetoemdata(i, "Hosted", 100);
                                calculatevaluesfromsheetoemdata(i, "Rebate", 100);
                                calculatevaluesfromsheetoemdata(i, "OTHER", 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].OEMOther)
                            }
                            else {
                                $scope.Paymentdata[i].OEMOther = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVSW != '--Select--' && $scope.Paymentdata[i].SERVSW != '--' && $scope.Paymentdata[i].SERVSW != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'Software', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVSW)
                            }
                            else {
                                $scope.Paymentdata[i].SERVSW = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVServices != '--Select--' && $scope.Paymentdata[i].SERVServices != '--' && $scope.Paymentdata[i].SERVServices != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'AMC-SW', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVServices)
                            }
                            else {
                                $scope.Paymentdata[i].SERVServices = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVPS != '--Select--' && $scope.Paymentdata[i].SERVPS != '--' && $scope.Paymentdata[i].SERVPS != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'PS', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVPS)
                            }
                            else {
                                $scope.Paymentdata[i].SERVPS = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVConsulting != '--Select--' && $scope.Paymentdata[i].SERVConsulting != '--' && $scope.Paymentdata[i].SERVConsulting != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'Consulting', 100)
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVConsulting)
                            }
                            else {
                                $scope.Paymentdata[i].SERVConsulting = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVCare != '--Select--' && $scope.Paymentdata[i].SERVCare != '--' && $scope.Paymentdata[i].SERVCare != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'ServCare', 100)
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVCare)
                            }
                            else {
                                $scope.Paymentdata[i].SERVCare = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVOther != '--Select--' && $scope.Paymentdata[i].SERVOther != '--' && $scope.Paymentdata[i].SERVOther != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', "Hardware", 100)
                                calculatevaluesfromsheetserviondata(i, 'Servion', "HW&SW", 100)
                                calculatevaluesfromsheetserviondata(i, 'Servion', "AMC-HW", 100)
                                calculatevaluesfromsheetserviondata(i, 'Servion', "AMC-HW&SW", 100)
                                calculatevaluesfromsheetserviondata(i, 'Servion', "AMC-PS", 100)
                                calculatevaluesfromsheetserviondata(i, 'Servion', "Rebate", 100)
                                calculatevaluesfromsheetserviondata(i, 'Servion', "OTHER", 100)
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVOther)
                            }
                            else {
                                $scope.Paymentdata[i].SERVOther = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVResource != '--Select--' && $scope.Paymentdata[i].SERVResource != '--' && $scope.Paymentdata[i].SERVResource != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'Resourcing', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVResource)
                            }
                            else {
                                $scope.Paymentdata[i].SERVResource = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVTM != '--Select--' && $scope.Paymentdata[i].SERVTM != '--' && $scope.Paymentdata[i].SERVTM != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'T&M', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].SERVTM)
                            }
                            else {
                                $scope.Paymentdata[i].SERVTM = '--Select--';
                            }
                            if ($scope.Paymentdata[i].SERVHosted != '--Select--' && $scope.Paymentdata[i].SERVHosted != '--' && $scope.Paymentdata[i].SERVHosted != '0') {
                                calculatevaluesfromsheetserviondata(i, 'Servion', 'Hosted', 100);
                                $scope.Paymentdata[i].MilestoneDescription = replacename($scope.Paymentdata[i].MilestoneDescription, $scope.Paymentdata[i].Hosted)
                            }
                            else {
                                $scope.Paymentdata[i].SERVHosted = '--Select--';
                            }



                        }
                        else {
                            $scope.Paymentdata[i].OEMHWandSW = '--';
                            $scope.Paymentdata[i].OEMServices = '--';
                            $scope.Paymentdata[i].OEMPS = '--';
                            $scope.Paymentdata[i].OEMOther = '--';
                            $scope.Paymentdata[i].SERVSW = '--';
                            $scope.Paymentdata[i].SERVServices = '--';
                            $scope.Paymentdata[i].SERVPS = '--';
                            $scope.Paymentdata[i].SERVConsulting = '--';
                            $scope.Paymentdata[i].SERVCare = '--';
                            $scope.Paymentdata[i].SERVOther = '--';
                            $scope.Paymentdata[i].SERVResource = '--';
                            $scope.Paymentdata[i].SERVTM = '--';
                            $scope.Paymentdata[i].SERVHosted = '--';
                        }
                    }

                    if ($scope.Paymentdata[i].PaymentCode == 'S9') {
                        getDutyandtax(i);
                    }
                    else if ($scope.Paymentdata[i].PaymentCode == 'S10') {
                        getTravelandexpense(i);
                    }
                }
                // localStorage.removeItem('price');

                // localStorage.setItem('price', JSON.stringify($scope.Paymentdata));

                for (var slicloop = 0; slicloop < $scope.slicearrayCnt; slicloop++) {
                    GetDistinctOEMVendordrilldown($scope['slicearray' + slicloop], slicloop)
                }

                $scope.passedvalue = 0;
                $scope.maxrowinserted = 0;
                $scope.lastmaxrow = 0;

                for (var slicloop = 0; slicloop < $scope.slicearrayCnt; slicloop++) {

                    var init = 0;
                    var curentrowid = findParentappendrowID($scope.passedvalue);
                    $scope.passedvalue = curentrowid;

                    var len = 0;
                    if ($scope.maxrowinserted == 0) {
                        $scope.maxrowinserted = curentrowid;
                        len = curentrowid + ($scope['Distinctedarray' + slicloop].length);
                    }
                    else {
                        $scope.maxrowinserted += $scope.passedvalue - $scope.lastmaxrow;
                        len = $scope.maxrowinserted + ($scope['Distinctedarray' + slicloop].length);
                    }

                    for ($scope.maxrowinserted; $scope.maxrowinserted < len; $scope.maxrowinserted++) {
                        $scope.Paymentdata.splice($scope.maxrowinserted, 0, $scope['Distinctedarray' + slicloop][init++]);
                    }
                    $scope.lastmaxrow = curentrowid;
                    $scope.maxrowinserted = len;
                }
                //total calculation for percentage in sheet
                //$scope.Paymentdata.splice($scope.Paymentdata.length, 0, addrowforTotalPercentageUtilize($scope.Paymentdata));
                addrowforTotalPercentageUtilize($scope.Paymentdata);
                //addrowforTotalPercentageUtilize($scope.Paymentdata);
                dopercentageforeachrow()
                //$scope.Paymentdata.splice($scope.Paymentdata.length, 0, addrowforTotalPercentageUtilizeamount($scope.Paymentdata[0]));


            }
            $scope.onLoad_payment();
            $scope.iscellrefresh_payment = false;

        }

        function getDutyandtax(i) {
            angular.forEach($scope.PSdata, function (value, key) {
                $scope.Paymentdata[i].Iyear1 += parseFloat(value.DTyear1);
                $scope.Paymentdata[i].Iyear2 += parseFloat(value.DTyear2);
                $scope.Paymentdata[i].Iyear3 += parseFloat(value.DTyear3);
                $scope.Paymentdata[i].Iyear4 += parseFloat(value.DTyear4);
                $scope.Paymentdata[i].Iyear5 += parseFloat(value.DTyear5);

            });
        }


        function getTravelandexpense(i) {
            angular.forEach($scope.PSdata, function (value, key) {
                if (value.componenttype == "T&E" && (value.pricetype == "Transfer" || value.pricetype == "List")) {
                    $scope.Paymentdata[i].Iyear1 += parseFloat(value.Cyear1);
                    $scope.Paymentdata[i].Iyear2 += parseFloat(value.Cyear2);
                    $scope.Paymentdata[i].Iyear3 += parseFloat(value.Cyear3);
                    $scope.Paymentdata[i].Iyear4 += parseFloat(value.Cyear4);
                    $scope.Paymentdata[i].Iyear5 += parseFloat(value.Cyear5);
                }
            });
        }


        function replacename(str, newValue) {

            str = str.replace("--Select--", newValue);
            str = str.replace("Monthly", newValue);
            str = str.replace("Weekly", newValue);
            str = str.replace("Quaterly", newValue);

            return str;
        }


        //percentage from total
        function dopercentageforeachrow() {
            for (var i = 0; i < $scope.Paymentdata.length; i++) {
                if ($scope.Paymentdata[i].Iyear1 != 0 || $scope.Paymentdata[i].Iyear2 != 0 || $scope.Paymentdata[i].Iyear3 != 0 || $scope.Paymentdata[i].Iyear4 != 0 || $scope.Paymentdata[i].Iyear5 != 0) {
                    if ($scope.Paymentdata[i].PaymentCode != 'S9' && $scope.Paymentdata[i].PaymentCode != 'S10') {

                        var sbtot = parseFloat((parseFloat($scope.Paymentdata[i].Iyear1) + parseFloat($scope.Paymentdata[i].Iyear2) + parseFloat($scope.Paymentdata[i].Iyear3) + parseFloat($scope.Paymentdata[i].Iyear4) + parseFloat($scope.Paymentdata[i].Iyear5)));
                        $scope.Paymentdata[i].percentageTotal = parseFloat((sbtot / $scope.calculatedTotalinPricing) * 100).toFixed(5);
                    }
                    else {
                        $scope.Paymentdata[i].percentageTotal = 0;
                    }
                }
                else {
                    $scope.Paymentdata[i].percentageTotal = 0;
                }
            }

        }

        //have to find where to place drill down row data
        function findParentappendrowID(value) {

            var rowfinder = JSON.parse(localStorage.getItem('price'));
            for (value; value < rowfinder.length; value++) {
                if (rowfinder[value].VendorBreakdown == 'Yes') {
                    return value + 1;
                }
            }
        }

        //distinct drilldown based on OEM/Vendor
        function GetDistinctOEMVendordrilldown(drildata, slicloop) {

            $scope['Distinctedarray' + slicloop] = [];

            for (var i = 0; i < $scope.OEMOptions_payment.length; i++) {
                $scope.newarray = [];
                var returnobj = dodistinct(drildata, $scope.OEMOptions_payment[i].VendorName);
                if (returnobj != null) {
                    $scope['Distinctedarray' + slicloop].push(returnobj);
                }
            }

        }

        //distinct dril work
        function dodistinct(drildata, OEMName) {
            var json = {
                MilestoneDescription: '', Code: '', SubPaymentCode: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: 0, percentageTotal: 0, OEMHWandSW: '--', OEMServices: '--', OEMPS: '--', OEMOther: '--', SERVSW: '--', SERVServices: '--', SERVPS: '--', SERVConsulting: '--', SERVCare: '--', SERVOther: '--', SERVResource: '--', SERVTM: '--', SERVHosted: '--'
            };
            var ismodified = false;

            angular.forEach(drildata, function (value, key) {

                if (value.MilestoneDescription == OEMName) {
                    ismodified = true;
                    json.SubPaymentCode = value.SubPaymentCode;
                    json.MilestoneDescription = value.MilestoneDescription;
                    json.Iyear1 += parseFloat(value.Iyear1);
                    json.Iyear2 += parseFloat(value.Iyear2);
                    json.Iyear3 += parseFloat(value.Iyear3);
                    json.Iyear4 += parseFloat(value.Iyear4);
                    json.Iyear5 += parseFloat(value.Iyear5);
                }
            });
            if (ismodified) {
                return json;
            }
            else {
                return null;
            }
        }

        //total calculation for complete data
        function addrowforTotalPercentageUtilize(data) {
            //debugger;
            $scope.calculatedTotalinPayment = 0;
            $scope.Finalcalculatedrow = {};
            var Jsondata = { MilestoneDescription: 'Notes', Code: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: '0', percentageTotal: '0', OEMHWandSW: 0, OEMServices: 0, OEMPS: 0, OEMOther: 0, SERVSW: 0, SERVServices: 0, SERVPS: 0, SERVResource: 0, SERVCare: 0, SERVOther: 0, SERVConsulting: 0, SERVHosted: 0, SERVTM: 0 };

            angular.forEach(data, function (value, key) {

                if (value.PaymentCode != '' && value.PercentageType == 'Yes' && value.PaymentCode != 'S9' && value.PaymentCode != 'S10') {
                    Jsondata.OEMHWandSW = parseFloat(Jsondata.OEMHWandSW) + parseFloat(value.OEMHWandSW);
                    Jsondata.OEMServices = parseFloat(Jsondata.OEMServices) + parseFloat(value.OEMServices);
                    Jsondata.OEMPS = parseFloat(Jsondata.OEMPS) + parseFloat(value.OEMPS);
                    Jsondata.SERVSW = parseFloat(Jsondata.SERVSW) + parseFloat(value.SERVSW);
                    Jsondata.SERVServices = parseFloat(Jsondata.SERVServices) + parseFloat(value.SERVServices);
                    Jsondata.SERVPS = parseFloat(Jsondata.SERVPS) + parseFloat(value.SERVPS);
                    Jsondata.SERVResource = + parseInt(value.SERVResource);
                    Jsondata.SERVCare = parseFloat(Jsondata.SERVCare) + parseFloat(value.SERVCare);

                    Jsondata.OEMOther = parseFloat(Jsondata.OEMOther) + parseFloat(value.OEMOther);
                    Jsondata.SERVConsulting = parseFloat(Jsondata.SERVConsulting) + parseFloat(value.SERVConsulting);
                    Jsondata.SERVOther = parseFloat(Jsondata.SERVOther) + parseFloat(value.SERVOther);
                    Jsondata.SERVHosted = parseFloat(Jsondata.SERVHosted) + parseInt(value.SERVHosted);
                    Jsondata.SERVTM = parseFloat(Jsondata.SERVTM) + parseInt(value.SERVTM);
                }
                else if (value.PaymentCode != '' && value.PercentageType == 'No' && value.PaymentCode != 'S9' && value.PaymentCode != 'S10') {

                    if (value.OEMHWandSW != '--Select--' && value.OEMHWandSW != '0')
                        Jsondata.OEMHWandSW = parseFloat(Jsondata.OEMHWandSW) + 100;
                    if (value.OEMServices != '--Select--' && value.OEMServices != '0')
                        Jsondata.OEMServices = parseFloat(Jsondata.OEMServices) + 100;
                    if (value.OEMPS != '--Select--' && value.OEMPS != '0')
                        Jsondata.OEMPS = parseFloat(Jsondata.OEMPS) + 100;
                    if (value.SERVSW != '--Select--' && value.SERVSW != '0')
                        Jsondata.SERVSW = parseFloat(Jsondata.SERVSW) + 100;
                    if (value.SERVServices != '--Select--' && value.SERVServices != '0')
                        Jsondata.SERVServices = parseFloat(Jsondata.SERVServices) + 100;
                    if (value.SERVPS != '--Select--' && value.SERVPS != '0')
                        Jsondata.SERVPS = parseFloat(Jsondata.SERVPS) + 100;

                    if (value.SERVCare != '--Select--' && value.SERVCare != '0')
                        Jsondata.SERVCare = parseFloat(Jsondata.SERVCare) + 100;
                    if (value.OEMOther != '--Select--' && value.OEMOther != '0')
                        Jsondata.OEMOther = parseFloat(Jsondata.OEMOther) + 100;
                    if (value.SERVConsulting != '--Select--' && value.SERVConsulting != '0')
                        Jsondata.SERVConsulting = parseFloat(Jsondata.SERVConsulting) + 100;
                    if (value.SERVOther != '--Select--' && value.SERVOther != '0')
                        Jsondata.SERVOther = parseFloat(Jsondata.SERVOther) + 100;

                    if (value.SERVResource != '--Select--' && value.SERVResource != '0')
                        Jsondata.SERVResource = parseFloat(Jsondata.SERVResource) + 100;
                    if (value.SERVTM != '--Select--' && value.SERVTM != '0')
                        Jsondata.SERVTM = parseFloat(Jsondata.SERVTM) + 100;
                    if (value.SERVHosted != '--Select--' && value.SERVHosted != '0')
                        Jsondata.SERVHosted = parseFloat(Jsondata.SERVHosted) + 100;
                }

                if (value.PaymentCode != 'S9') {
                    Jsondata.Iyear1 = parseFloat(Jsondata.Iyear1) + parseFloat(value.Iyear1);
                    Jsondata.Iyear2 = parseFloat(Jsondata.Iyear2) + parseFloat(value.Iyear2);
                    Jsondata.Iyear3 = parseFloat(Jsondata.Iyear3) + parseFloat(value.Iyear3);
                    Jsondata.Iyear4 = parseFloat(Jsondata.Iyear4) + parseFloat(value.Iyear4);
                    Jsondata.Iyear5 = parseFloat(Jsondata.Iyear5) + parseFloat(value.Iyear5);
                }

            });


            $scope.Finalcalculatedrow = Jsondata;

            var total = Jsondata.Iyear1 + Jsondata.Iyear2 + Jsondata.Iyear3 + Jsondata.Iyear4 + Jsondata.Iyear5;

            $scope.calculatedTotalinPayment = Math.round(total);
            return Jsondata;
        }

        //total calculation for complete data final amount
        function addrowforTotalPercentageUtilizeamount() {
            $scope.hasslice_payment = false;
            $scope.isfinal = true;
            var Jsondata = { MilestoneDescription: 'calculation', Code: '', Iyear1: 0, Iyear2: 0, Iyear3: 0, Iyear4: 0, Iyear5: 0, paymentTerms: '0', percentageTotal: '0', OEMHWandSW: 0, OEMServices: 0, OEMPS: 0, OEMOther: 0, SERVSW: 0, SERVServices: 0, SERVPS: 0, SERVCare: 0, SERVOther: 0, SERVConsulting: 0, SERVResource: '0', SERVHosted: '0', SERVTM: '0' };

            Jsondata.OEMHWandSW = calculatevaluesfromsheetoemdata(0, 'Hardware', 100) + calculatevaluesfromsheetoemdata(0, 'Software', 100) + calculatevaluesfromsheetoemdata(0, 'HW&SW', 100);
            Jsondata.OEMServices = calculatevaluesfromsheetoemdata(0, 'AMC-HW', 100) + calculatevaluesfromsheetoemdata(0, 'AMC-SW', 100) + calculatevaluesfromsheetoemdata(0, 'AMC-HW&SW', 100) + calculatevaluesfromsheetoemdata(0, 'AMC-PS', 100);
            Jsondata.OEMPS = calculatevaluesfromsheetoemdata(0, 'PS', 100);
            Jsondata.SERVSW = calculatevaluesfromsheetserviondata(0, 'Servion', 'Software', 100);
            Jsondata.SERVServices = calculatevaluesfromsheetserviondata(0, 'Servion', 'AMC-SW', 100);
            Jsondata.SERVPS = calculatevaluesfromsheetserviondata(0, 'Servion', 'PS', 100);
            Jsondata.SERVResource = calculatevaluesfromsheetserviondata(0, 'Servion', 'Resourcing', 100) + calculatevaluesfromsheetserviondata(0, 'Servion', 'T&M', 100);
            Jsondata.SERVCare = calculatevaluesfromsheetserviondata(0, 'Servion', 'ServCare', 100)
            Jsondata.SERVConsulting = calculatevaluesfromsheetserviondata(0, 'Servion', 'Consulting', 100)
            Jsondata.OEMOther = calculatevaluesfromsheetoemdata(0, "ServCare", 100) + calculatevaluesfromsheetoemdata(0, "T&M", 100) + calculatevaluesfromsheetoemdata(0, "Consulting", 100) + calculatevaluesfromsheetoemdata(0, "Resourcing", 100) + calculatevaluesfromsheetoemdata(0, "Hosted", 100) + calculatevaluesfromsheetoemdata(0, "Rebate", 100) + calculatevaluesfromsheetoemdata(0, "OTHER", 100);
            Jsondata.SERVOther = calculatevaluesfromsheetserviondata(0, 'Servion', "Hardware", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "HW&SW", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "AMC-HW", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "AMC-HW&SW", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "AMC-PS", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "Rebate", 100) + calculatevaluesfromsheetserviondata(0, 'Servion', "OTHER", 100);
            Jsondata.SERVTM = 0;
            Jsondata.SERVTM = String(Jsondata.SERVTM);
            Jsondata.SERVResource = String(Jsondata.SERVResource);
            Jsondata.SERVHosted = String(Jsondata.SERVHosted);

            return Jsondata;
        }

        //on percentage change in cell
        function paymentpercentcalc(i, j) {
            $scope.isfinal = false;
            if (!$scope.hasslice_payment)
                j = i;

            if ($scope.Paymentdata[i].OEMHWandSW != '--' && parseFloat($scope.Paymentdata[i].OEMHWandSW) != 0) {
                calculatevaluesfromsheetoemdata(j, 'Hardware', parseFloat($scope.Paymentdata[i].OEMHWandSW));
                calculatevaluesfromsheetoemdata(j, 'Software', parseFloat($scope.Paymentdata[i].OEMHWandSW));
                calculatevaluesfromsheetoemdata(j, 'HW&SW', parseFloat($scope.Paymentdata[i].OEMHWandSW));
            }

            if ($scope.Paymentdata[i].OEMServices != '--' && parseFloat($scope.Paymentdata[i].OEMServices) != 0) {
                calculatevaluesfromsheetoemdata(j, 'AMC-HW', parseFloat($scope.Paymentdata[i].OEMServices));
                calculatevaluesfromsheetoemdata(j, 'AMC-SW', parseFloat($scope.Paymentdata[i].OEMServices));
                calculatevaluesfromsheetoemdata(j, 'AMC-HW&SW', parseFloat($scope.Paymentdata[i].OEMServices));
                calculatevaluesfromsheetoemdata(j, 'AMC-PS', parseFloat($scope.Paymentdata[i].OEMServices));
            }

            if ($scope.Paymentdata[i].OEMPS != '--' && parseFloat($scope.Paymentdata[i].OEMPS) != 0) {
                calculatevaluesfromsheetoemdata(j, 'PS', parseFloat($scope.Paymentdata[i].OEMPS));
            }

            if ($scope.Paymentdata[i].OEMOther != '--' && parseFloat($scope.Paymentdata[i].OEMOther) != 0) {
                // other than above OEM
                calculatevaluesfromsheetoemdata(j, "ServCare", parseFloat($scope.Paymentdata[i].OEMOther));
                calculatevaluesfromsheetoemdata(j, "T&M", parseFloat($scope.Paymentdata[i].OEMOther));
                calculatevaluesfromsheetoemdata(j, "Consulting", parseFloat($scope.Paymentdata[i].OEMOther));
                calculatevaluesfromsheetoemdata(j, "Resourcing", parseFloat($scope.Paymentdata[i].OEMOther));
                calculatevaluesfromsheetoemdata(j, "Hosted", parseFloat($scope.Paymentdata[i].OEMOther));
                calculatevaluesfromsheetoemdata(j, "Rebate", parseFloat($scope.Paymentdata[i].OEMOther));
                calculatevaluesfromsheetoemdata(j, "OTHER", parseFloat($scope.Paymentdata[i].OEMOther));

            }

            if ($scope.Paymentdata[i].SERVSW != '--' && parseFloat($scope.Paymentdata[i].SERVSW) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'Software', parseFloat($scope.Paymentdata[i].SERVSW));
            }

            if ($scope.Paymentdata[i].SERVServices != '--' && parseFloat($scope.Paymentdata[i].SERVServices) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'AMC-SW', parseFloat($scope.Paymentdata[i].SERVServices));
            }

            if ($scope.Paymentdata[i].SERVPS != '--' && parseFloat($scope.Paymentdata[i].SERVPS) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'PS', parseFloat($scope.Paymentdata[i].SERVPS));
            }
            if ($scope.Paymentdata[i].SERVCare != '--' && parseFloat($scope.Paymentdata[i].SERVCare) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'ServCare', parseFloat($scope.Paymentdata[i].SERVCare))
            }
            if ($scope.Paymentdata[i].SERVConsulting != '--' && parseFloat($scope.Paymentdata[i].SERVConsulting) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'Consulting', parseFloat($scope.Paymentdata[i].SERVConsulting))
            }

            if ($scope.Paymentdata[i].SERVOther != '--' && parseFloat($scope.Paymentdata[i].SERVOther) != 0) {
                //loop other than above
                calculatevaluesfromsheetserviondata(j, 'Servion', "Hardware", parseFloat($scope.Paymentdata[i].SERVOther))
                calculatevaluesfromsheetserviondata(j, 'Servion', "HW&SW", parseFloat($scope.Paymentdata[i].SERVOther))
                calculatevaluesfromsheetserviondata(j, 'Servion', "AMC-HW", parseFloat($scope.Paymentdata[i].SERVOther))
                calculatevaluesfromsheetserviondata(j, 'Servion', "AMC-HW&SW", parseFloat($scope.Paymentdata[i].SERVOther))
                calculatevaluesfromsheetserviondata(j, 'Servion', "AMC-PS", parseFloat($scope.Paymentdata[i].SERVOther))
                calculatevaluesfromsheetserviondata(j, 'Servion', "Rebate", parseFloat($scope.Paymentdata[i].SERVOther))
                calculatevaluesfromsheetserviondata(j, 'Servion', "OTHER", parseFloat($scope.Paymentdata[i].SERVOther))
            }
            if ($scope.Paymentdata[i].SERVResource != '--' && parseFloat($scope.Paymentdata[i].SERVResource) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'Resourcing', parseFloat($scope.Paymentdata[i].SERVResource));
            }
            if ($scope.Paymentdata[i].SERVTM != '--' && parseFloat($scope.Paymentdata[i].SERVTM) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'T&M', parseFloat($scope.Paymentdata[i].SERVTM));
            }
            if ($scope.Paymentdata[i].SERVHosted != '--' && parseFloat($scope.Paymentdata[i].SERVHosted) != 0) {
                calculatevaluesfromsheetserviondata(j, 'Servion', 'Hosted', parseFloat($scope.Paymentdata[i].SERVHosted));
            }
        }

        //calculation for servion
        function calculatevaluesfromsheetserviondata(i, oem, component, percentage) {
            var obj = { year1: 0, year2: 0, year3: 0, year4: 0, year5: 0 };

            if (!$scope.hasslice_payment) {
                angular.forEach($scope.PSdata_payment, function (value, key) {
                    if (value.oem == oem && value.componenttype == component) {
                        obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                        obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                        obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                        obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                        obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
                    }
                });
            }
            else {
                var value = $scope.PSdata_payment[i];
                if (value.oem == oem && value.componenttype == component) {
                    obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                    obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                    obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                    obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                    obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
                }
            }


            if (!$scope.isfinal) {
                if (!$scope.hasslice_payment) {

                    $scope.Paymentdata[i].Iyear1 = parseFloat($scope.Paymentdata[i].Iyear1) + parseFloat(obj.year1);
                    $scope.Paymentdata[i].Iyear2 = parseFloat($scope.Paymentdata[i].Iyear2) + parseFloat(obj.year2);
                    $scope.Paymentdata[i].Iyear3 = parseFloat($scope.Paymentdata[i].Iyear3) + parseFloat(obj.year3);
                    $scope.Paymentdata[i].Iyear4 = parseFloat($scope.Paymentdata[i].Iyear4) + parseFloat(obj.year4);
                    $scope.Paymentdata[i].Iyear5 = parseFloat($scope.Paymentdata[i].Iyear5) + parseFloat(obj.year5);
                }
                else {
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear1 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear1) + parseFloat(obj.year1);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear2 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear2) + parseFloat(obj.year2);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear3 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear3) + parseFloat(obj.year3);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear4 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear4) + parseFloat(obj.year4);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear5 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear5) + parseFloat(obj.year5);
                }
            }
            else {
                var total = obj.year1 + obj.year2 + obj.year3 + obj.year4 + obj.year5;
                return total;
            }

        }

        //calculation for other OEM /Non servion
        function calculatevaluesfromsheetoemdata(i, component, percentage) {
            var obj = { year1: 0, year2: 0, year3: 0, year4: 0, year5: 0 };
            if (!$scope.hasslice_payment) {
                angular.forEach($scope.PSdata_payment, function (value, key) {
                    if (value.oem != "Servion" && value.componenttype == component) {
                        obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                        obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                        obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                        obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                        obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
                    }
                });
            }
            else {
                var value = $scope.PSdata_payment[i];
                if (value.oem != "Servion" && value.componenttype == component) {
                    obj.year1 += parseFloat(value.Cyear1) * (percentage / 100);
                    obj.year2 += parseFloat(value.Cyear2) * (percentage / 100);
                    obj.year3 += parseFloat(value.Cyear3) * (percentage / 100);
                    obj.year4 += parseFloat(value.Cyear4) * (percentage / 100);
                    obj.year5 += parseFloat(value.Cyear5) * (percentage / 100);
                }
            }
            if (!$scope.isfinal) {
                if (!$scope.hasslice_payment) {
                    $scope.Paymentdata[i].Iyear1 = parseFloat($scope.Paymentdata[i].Iyear1) + parseFloat(obj.year1);
                    $scope.Paymentdata[i].Iyear2 = parseFloat($scope.Paymentdata[i].Iyear2) + parseFloat(obj.year2);
                    $scope.Paymentdata[i].Iyear3 = parseFloat($scope.Paymentdata[i].Iyear3) + parseFloat(obj.year3);
                    $scope.Paymentdata[i].Iyear4 = parseFloat($scope.Paymentdata[i].Iyear4) + parseFloat(obj.year4);
                    $scope.Paymentdata[i].Iyear5 = parseFloat($scope.Paymentdata[i].Iyear5) + parseFloat(obj.year5);
                }
                else {
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear1 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear1) + parseFloat(obj.year1);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear2 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear2) + parseFloat(obj.year2);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear3 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear3) + parseFloat(obj.year3);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear4 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear4) + parseFloat(obj.year4);
                    $scope['slicearray' + $scope.slicearrayCnt][i].Iyear5 = parseFloat($scope['slicearray' + $scope.slicearrayCnt][i].Iyear5) + parseFloat(obj.year5);
                }
            }
            else {
                var total = parseFloat(obj.year1) + parseFloat(obj.year2) + parseFloat(obj.year3) + parseFloat(obj.year4) + parseFloat(obj.year5);
                return total;
            }
        }

        function getOEMbyFilter(comptype) {
            var obj = getObjects($scope.OEMOptions_payment, 'VendorName', comptype);
            return obj;
        }

        function getCompbyFilter(comptype) {
            var obj = getObjects($scope.componentList_payment, 'ComponentType', comptype);
            return obj;
        }

        function getObjects(obj, key, val) {
            var newObj = false;
            $.each(obj, function () {
                var testObject = this;
                $.each(testObject, function (k, v) {
                    //alert(k);
                    if (val == v && k == key) {
                        newObj = testObject;
                    }
                });
            });

            return newObj;
        }

        //checking api calls are done
        $scope.callifAPIDone_Payment = function () {
            if ($scope.call1finished_payment && $scope.call2finished_payment && $scope.call3finished_payment && $scope.call4finished_payment && $scope.call5finished_payment && $scope.call6finished_payment) {
                //price sheet call
                docalculationforpayment();
                //jay pricing payment reflect is immediate now
            }
        };

        $scope.onLoad_payment = function () {
            //Declaring column definitions
            var columnDefs = [
                {
                    headerName: "Code", field: "Code", hide: true
                },
                {
                    headerName: "Invoicing Milestones", field: "MilestoneDescription", width: 300, headerTooltip: "Invoicing Milestones", pinned: 'left',
                    cellRenderer: function (params) {
                        if (params.data.PaymentCode == 'C1' || params.data.PaymentCode == 'C2' || params.data.PaymentCode == 'C3' || params.data.PaymentCode == 'C4' || params.data.PaymentCode == 'C5')
                            return "<a style='text-decoration: underline;' title='" + params.data.MilestoneDescription + "' data-ng-click=\"EditModel('" + params.data.PaymentCode + "','" + params.data.MilestoneDescription + "')\" href=\"javascript:;\" ng-show=\"!IsReadOnly\"> " + params.data.MilestoneDescription + "</a>";
                        else
                            return "<span title='" + params.value + "'> " + params.data.MilestoneDescription + "</span>";
                    },
                    cellClassRules: {
                        'nonservion': function (params) {
                            if (params.data.PaymentCode == '' || params.data.PaymentCode == null)
                                return true;
                            else
                                return false
                        },
                    }
                },
                {
                    headerName: 'Invoice Values',
                    groupId: "GroupA",
                    children: [
                        {
                            headerName: "Year 1", field: "Iyear1", width: 90, headerTooltip: "Year1", cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                        },
                        {
                            headerName: "Year 2", field: "Iyear2", width: 90, headerTooltip: "Year2", cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                        },
                        {
                            headerName: "Year 3", field: "Iyear3", width: 90, headerTooltip: "Year3", cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                        },
                        {
                            headerName: "Year 4", field: "Iyear4", width: 90, headerTooltip: "Year4", cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                        },
                        {
                            headerName: "Year 5", field: "Iyear5", width: 90, headerTooltip: "Year5", cellRenderer: function (params) {
                                if (params.value > 0) {
                                    return '<span title=' + params.value + '>' + $filter('number')(params.value, 2) + '</span>';
                                }
                                else {
                                    return params.value;
                                }
                            },
                        }]
                },
                {
                    headerName: "Payment Terms(Days)", field: "paymentTerms", width: 120, headerTooltip: "Payment Terms(Days)", editable: $scope.grideditable_PriceList,
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
                    headerName: "% of Total", field: "percentageTotal", width: 80, headerTooltip: "% of Total",
                    cellRenderer: function (params) {
                        if (params.value > 0) {
                            return '<span title=' + params.value + '>' + parseFloat(params.value).toFixed(2) + '</span>';
                        }
                        else {
                            return params.value;
                        }
                    },
                },
                {
                    headerName: 'OEM',
                    groupId: "GroupB",
                    children: [
                        {
                            headerName: "HW & SW", field: "OEMHWandSW", width: 75, headerTooltip: "HW & SW", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#6EB5C0' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.OEMHWandSW > 100 || $scope.Finalcalculatedrow.OEMHWandSW < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "Services", field: "OEMServices", width: 60, headerTooltip: "Services", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#6EB5C0' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.OEMServices > 100 || $scope.Finalcalculatedrow.OEMServices < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {

                            headerName: "PS", field: "OEMPS", width: 60, headerTooltip: "PS", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#6EB5C0' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.OEMPS > 100 || $scope.Finalcalculatedrow.OEMPS < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "Other", field: "OEMOther", width: 60, headerTooltip: "PS", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#6EB5C0' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.OEMOther > 100 || $scope.Finalcalculatedrow.OEMOther < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        }
                    ]
                },
                {
                    headerName: 'Servion',
                    groupId: "GroupC",
                    children: [
                        {
                            headerName: "Software", field: "SERVSW", width: 72, headerTooltip: "Software", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2E8E4' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.SERVSW > 100 || $scope.Finalcalculatedrow.SERVSW < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "Services", field: "SERVServices", width: 60, headerTooltip: "Services", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2E8E4' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.SERVServices > 100 || $scope.Finalcalculatedrow.SERVServices < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "PS", field: "SERVPS", width: 60, headerTooltip: "PS", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2E8E4' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.SERVPS > 100 || $scope.Finalcalculatedrow.SERVPS < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "Consulting", field: "SERVConsulting", width: 72, headerTooltip: "Consulting", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2E8E4' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.SERVConsulting > 100 || $scope.Finalcalculatedrow.SERVConsulting < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "ServCare", field: "SERVCare", width: 70, headerTooltip: "SERVCare", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2E8E4' },
                            cellClassRules: {
                                'redbackground': function (params) {

                                    if ($scope.Finalcalculatedrow.SERVCare > 100 || $scope.Finalcalculatedrow.SERVCare < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "Other", field: "SERVOther", width: 60, cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2E8E4' },
                            cellClassRules: {
                                'redbackground': function (params) {

                                    if ($scope.Finalcalculatedrow.SERVOther > 100 || $scope.Finalcalculatedrow.SERVOther < 100)
                                        return true;
                                    else
                                        return false
                                },
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
                            headerName: "Resourcing", field: "SERVResource", width: 90, headerTooltip: "Resourcing", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2C499' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.SERVResource > 100 || $scope.Finalcalculatedrow.SERVResource < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "T&M", field: "SERVTM", width: 90, headerTooltip: "T&M", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2C499' },

                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.SERVTM > 100 || $scope.Finalcalculatedrow.SERVTM < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        },
                        {
                            headerName: "Hosted", field: "SERVHosted", width: 90, headerTooltip: "Hosted", cellRenderer: NonPercentTypeEditor_payment,
                            cellStyle: { 'background-color': '#E2C499' },
                            cellClassRules: {
                                'redbackground': function (params) {
                                    if ($scope.Finalcalculatedrow.SERVHosted > 100 || $scope.Finalcalculatedrow.SERVHosted < 100)
                                        return true;
                                    else
                                        return false
                                },
                                'blockbackground': function (params) {
                                    return params.value == '--';
                                },
                            },
                        }]
                }];


            $scope.gridPayment.api.setColumnDefs(columnDefs);

            $scope.gridPayment.rowData = $scope.Paymentdata;

            $scope.gridPayment.api.setRowData($scope.Paymentdata);


            document.getElementById('overlay').style.display = 'none';
            $timeout(function () {
                $scope.gridPayment.api.refreshView();
            }, 500);


        }

        //cell changed function call
        function docellchangedcalculation(params, column) {
            var data = JSON.parse(localStorage.getItem('price'));

            _.each(data, function (value, key) {
                value["Iyear1"] = value["Iyear2"] = value["Iyear3"] = value["Iyear4"] = value["Iyear5"] = "0";

                if (value["PaymentCode"] == params.data.PaymentCode) {
                    value[column] = params.data[column];
                }
            });

            //[params.node.childIndex][column]== params.data[column];

            localStorage.removeItem('price');

            localStorage.setItem('price', JSON.stringify(data));
            $scope.iscellrefresh_payment = false;
            docalculationforpayment();
        }

        function NonPercentTypeEditor_payment(params) {

            var editing = false;
            var eCell = document.createElement('span');
            eCell.title = params.value;
            var eLabel = document.createTextNode(params.value);
            eCell.appendChild(eLabel);

            if ($scope.grideditable_PriceList) {


                var eSelect = document.createElement("select");
                var eInput = document.createElement('input');
                eInput.type = 'text';

                $scope.SelectOptions_payment.forEach(function (item) {
                    var eOption = document.createElement("option");
                    eOption.setAttribute("value", item.Type);
                    eOption.setAttribute("title", item.Id);
                    eOption.innerHTML = item.Type;
                    eSelect.appendChild(eOption);
                });

                eSelect.value = params.value;

                params.eGridCell.addEventListener('click', function () {
                    if ($scope.grideditable_PriceList) {
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
                    eLabel.data = newValue;
                    params.data[params.colDef.field] = newValue;
                    docellchangedcalculation(params, params.colDef.field)
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
                    //debugger;
                    if (editing) {
                        editing = false;
                        if (checksameTypeinrow(params, eSelect.value, params.colDef.field)) {

                            var newValue = eSelect.value;
                            var id = eSelect[eSelect.selectedIndex].title;

                            eLabel.nodeValue = newValue;
                            eCell.removeChild(eSelect);
                            eCell.appendChild(eLabel);

                            params.data[params.colDef.field] = newValue;

                            var data = JSON.parse(localStorage.getItem('price'));

                            _.each(data, function (value, key) {
                                if (value["PaymentCode"] == params.data.PaymentCode) {
                                    value[params.colDef.field] = params.data[params.colDef.field];
                                }
                            });

                            localStorage.removeItem('price');
                            localStorage.setItem('price', JSON.stringify(data));
                            docalculationforpayment();
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
            // if ($scope.Finalcalculatedrow[curentcol] > 100) {
            //     toaster.pop('warning', "Warning", "Please select % Type or Select Options", null);
            //     return false;
            // }

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



        function validatedataonsavePayment() {

            if ($scope.Paymentdata.length > 0) {
                //return true;

                var isvalid = true;

                // for (var i = 0; i < $scope.Paymentdata.length; i++) {
                //     if ($scope.Paymentdata[i].OemId == 1 && $scope.Paymentdata[i].ComponenttypeId == 1 && $scope.Paymentdata[i].LTotal > 0) {
                //         isvalid = false;
                //         var errorrow = i + 1;
                //         toaster.pop('error', "Failed", 'Sheet contains invalid data in row number ' + errorrow, null);
                //         break;
                //     }

                // }
                return isvalid;
            }

            else {
                toaster.pop('error', "Failed", 'No data to update', null);
                return false;
            }
        }

        $scope.updatescope = function () {
            var data = JSON.parse(localStorage.getItem('price'));
            var key1 = $scope.dynamickey;
            _.each(data, function (value, key) {
                if (value["PaymentCode"] == key1) {
                    value["MilestoneDescription"] = $scope.Newvalue;
                }
            });

            $scope.Newvalue = "";
            localStorage.removeItem('price');
            localStorage.setItem('price', JSON.stringify(data));


            $('#AdditionalInvoice').modal('hide');
            $scope.iscellrefresh_payment = true;
            docalculationforpayment();
        }

        $scope.onBtExport = function () {
            paymentService.ExportToExcelSheet($routeParams.OppId, $routeParams.GroupId).success(function (data) {
                console.log(data);
                var url = BaseURL + 'ExportFiles/' + data.name;

                $scope.downloadurl = url;
                $scope.filename = data.name;
                setTimeout(function () {
                    $('#downloadpdf')[0].click();
                }, 1000);

            }).error(function (error) {
                $scope.Error = error;
            })

        }

        //refresh page when data done
        function redirectRefreshPage(oppId, groupId) {
            $location.path("PaymentList/" + oppId + "/" + groupId);
        }

        $scope.ClosePriceSheetdiscard = function () {
            $('#showSaveChangesmodel').modal('hide');
        }

        $scope.InitApiCalls_PayList = function () {
            //first call to pricesheet
            $scope.GetProductList_PriceList();
            $scope.GetOemOptions_PriceList();
            $scope.getAllPriceType();
            $scope.getAllComponentType();
            $scope.GetMaximumGroupPriceSheetId();
            $scope.GetAllLOBList();
            $scope.GetAllCurrency();
            $scope.IsPageReadOnly_PriceList();
            //end Service Calls
            //first call to pricesheet
            $scope.GetPaymentPeriod_PriceList();
            $scope.GetMaximumGroupPriceSheetId_PriceList();
            $scope.getAllComponentType_payment();
            $scope.GetOemOptions_payment();
        }

        $scope.InitApiCalls_PayList();
        //---------======================
        //Payment sheet Code Integration
        //===============================
        //---------======================
        //Gross Margin start
        //===============================

        $scope.PageVariableInitialization_GM = function () {
            $scope.GlobalIdentityOppId = $routeParams.OppId;
            $scope.GlobalGroupId = $routeParams.GroupId;
            $scope.grideditable_PriceList = false;
            $scope.hasedit = false;

            $scope.margin = {};
            $scope.margin.PS = 0;
            $scope.margin.RESOURCING = 0;
            $scope.margin.MAINTANACE = 0;
            $scope.margin.IP = 0;
            $scope.margin.HOSTED = 0;
            $scope.margin.TRADING = 0;
            $scope.margin.CONSULTING = 0;

            $scope.pageLoad = false;
            $scope.DefautState = false;

        }

        $scope.PageVariableInitialization_GM();



        function PricesheetFeedToGrossMargin(data) {
            $scope.totalPSpricefromPricing = 0;
            $scope.totalPSpricefromPricingMinus = 0;
            $scope.totalMaintenancefromPricing = 0;
            $scope.totalIPpricefromPricing = 0;
            $scope.totalHostedpricefromPricing = 0;
            $scope.totalResourcingpricefromPricing = 0;
            $scope.totalTradingpricefromPricing = 0;
            $scope.totalConsultingpricefromPricing = 0;
            $scope.totalTradingpricefromPricingMinus = 0;
            $scope.totalTradingpricefromPricingPlus = 0;

            angular.forEach(data, function (value, key) {
                if (value.oem == 'Servion' && value.componenttype == 'PS') {
                    $scope.totalPSpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }
                if (value.oem == 'Servion' && value.PriceType == 'COST') {
                    $scope.totalPSpricefromPricingMinus += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem == 'Servion' && value.LOBName == 'MAINTENANCE') {
                    $scope.totalMaintenancefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }
                if ((value.oem == 'Servion' || "Acqueon") && value.LOBName == 'IP') {

                    $scope.totalIPpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem == 'Servion' && value.LOBName == 'HOSTED') {

                    $scope.totalHostedpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem == 'Servion' && value.LOBName == 'RESOURCING') {

                    $scope.totalResourcingpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem != 'Servion' && value.LOBName == 'TRADING') {

                    $scope.totalTradingpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

                if (value.oem != 'Servion' && value.LOBName == 'TRADING' && value.componenttype == "Rebate") {
                    $scope.totalTradingpricefromPricingPlus += parseFloat(value.Vyear1) + parseFloat(value.Vyear2) + parseFloat(value.Vyear3) + parseFloat(value.Vyear4) + parseFloat(value.Vyear5);
                }
                if (value.oem != 'Servion' && value.LOBName == 'TRADING') {
                    $scope.totalTradingpricefromPricingMinus += parseFloat(value.Syear1) + parseFloat(value.Syear2) + parseFloat(value.Syear3) + parseFloat(value.Syear4) + parseFloat(value.Syear5);
                }
                if (value.oem == 'Servion' && value.LOBName == 'CONSULTING') {

                    $scope.totalConsultingpricefromPricing += (parseFloat(value.Cyear1) + parseFloat(value.Cyear2) + parseFloat(value.Cyear3) + parseFloat(value.Cyear4) + parseFloat(value.Cyear5));
                }

            });


            $scope.totalPSpricefromPricing = parseFloat($scope.totalPSpricefromPricing);
            $scope.totalPSpricefromPricingMinus = parseFloat($scope.totalPSpricefromPricingMinus);
            $scope.totalMaintenancefromPricing = parseFloat($scope.totalMaintenancefromPricing);
            $scope.totalIPpricefromPricing = parseFloat($scope.totalIPpricefromPricing);
            $scope.totalHostedpricefromPricing = parseFloat($scope.totalHostedpricefromPricing);
            $scope.totalResourcingpricefromPricing = parseFloat($scope.totalResourcingpricefromPricing);
            $scope.totalTradingpricefromPricing = parseFloat($scope.totalTradingpricefromPricing);
            $scope.totalConsultingpricefromPricing = parseFloat($scope.totalConsultingpricefromPricing);
            $scope.totalTradingpricefromPricingMinus = parseFloat($scope.totalTradingpricefromPricingMinus);
            $scope.totalTradingpricefromPricingPlus = parseFloat($scope.totalTradingpricefromPricingPlus);


            $scope.TRADINGvalue = $scope.totalTradingpricefromPricingMinus;

            if ($scope.totalTradingpricefromPricing != 0)
                $scope.margin.TRADING = ((($scope.totalTradingpricefromPricing + $scope.totalTradingpricefromPricingPlus - $scope.totalTradingpricefromPricingMinus) / ($scope.totalTradingpricefromPricing)) * 100).toFixed(2);
            else
                $scope.margin.TRADING = 0;

            if ($scope.totalMaintenancefromPricing != 0)
                $scope.margin.MAINTANACE = ((($scope.totalMaintenancefromPricing - parseFloat($scope.MAINTANACEvalue)) / $scope.totalMaintenancefromPricing) * 100).toFixed(2);
            else
                $scope.margin.MAINTANACE = 0;

            if ($scope.totalIPpricefromPricing != 0)
                $scope.margin.IP = ((($scope.totalIPpricefromPricing - parseFloat($scope.IPvalue)) / $scope.totalIPpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.IP = 0;

            if ($scope.totalHostedpricefromPricing != 0)
                $scope.margin.HOSTED = ((($scope.totalHostedpricefromPricing - parseFloat($scope.HOSTEDvalue)) / $scope.totalHostedpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.HOSTED = 0;

            if ($scope.totalPSpricefromPricing != 0)
                $scope.margin.PS = ((($scope.totalPSpricefromPricing - $scope.totalPSpricefromPricingMinus - parseFloat($scope.PSvalue)) / $scope.totalPSpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.PS = 0;

            if ($scope.totalResourcingpricefromPricing != 0)
                $scope.margin.RESOURCING = ((($scope.totalResourcingpricefromPricing - parseFloat($scope.RESOURCINGvalue)) / $scope.totalResourcingpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.RESOURCING = 0;

            if ($scope.totalConsultingpricefromPricing != 0)
                $scope.margin.CONSULTING = ((($scope.totalConsultingpricefromPricing - parseFloat($scope.CONSULTINGvalue)) / $scope.totalConsultingpricefromPricing) * 100).toFixed(2);
            else
                $scope.margin.CONSULTING = 0;

            $scope.pageLoad = true;

            if ($scope.TempDiscount != null && $scope.TempDiscount.length > 0) {
                ProcessProjectMarginDiscount($scope.TempDiscount);
            }
            else
                $scope.GetDiscount($scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId);
        }

        $scope.GetAllPriceSheetbyOppGroupID_GM = function (oppid, groupid) {
            priceService.GetAllPriceSheetbyOppGroupID(oppid, groupid).success(function (data) {
                //  debugger
                PricesheetFeedToGrossMargin(data);
                /// $scope.AddGrossMargin(true) HEre after auto sync
            }).error(function (error) {
                $scope.Error = error;
            })
        }


        $scope.calculatevalue = function (calValue, input) {

            if (input == 1) {
                if ($scope.totalMaintenancefromPricing != 0) {
                    if (calValue == '')
                        $scope.MAINTANACEvalue = 0;
                    $scope.margin.MAINTANACE = ((($scope.totalMaintenancefromPricing - $scope.MAINTANACEvalue) / $scope.totalMaintenancefromPricing) * 100).toFixed(2);
                }
                else
                    $scope.margin.MAINTANACE = 0;
            }
            else if (input == 2) {
                if ($scope.totalIPpricefromPricing != 0) {
                    if (calValue == '')
                        $scope.IPvalue = 0;
                    $scope.margin.IP = ((($scope.totalIPpricefromPricing - $scope.IPvalue) / $scope.totalIPpricefromPricing) * 100).toFixed(2);
                }
                else
                    $scope.margin.IP = 0;
            }
            else if (input == 3) {
                if ($scope.totalHostedpricefromPricing != 0) {
                    if (calValue == '')
                        $scope.HOSTEDvalue = 0;
                    $scope.margin.HOSTED = ((($scope.totalHostedpricefromPricing - $scope.HOSTEDvalue) / $scope.totalHostedpricefromPricing) * 100).toFixed(2);
                }
                else
                    $scope.margin.HOSTED = 0;
            }
            else if (input == 4) {
                if ($scope.totalPSpricefromPricing != 0) {
                    if (calValue == '')
                        $scope.PSvalue = 0;
                    $scope.margin.PS = ((($scope.totalPSpricefromPricing - $scope.totalPSpricefromPricingMinus - $scope.PSvalue) / $scope.totalPSpricefromPricing) * 100).toFixed(2);
                }
                else {
                    $scope.margin.PS = 0;
                }
            }
            else if (input == 5) {
                if ($scope.totalResourcingpricefromPricing != 0) {
                    if (calValue == '')
                        $scope.RESOURCINGvalue = 0;
                    $scope.margin.RESOURCING = ((($scope.totalResourcingpricefromPricing - $scope.RESOURCINGvalue) / $scope.totalResourcingpricefromPricing) * 100).toFixed(2);
                }
                else
                    $scope.margin.RESOURCING = 0;
            }
            else if (input == 6) {

                if ($scope.totalConsultingpricefromPricing != 0) {
                    if (calValue == '')
                        $scope.CONSULTINGvalue = 0;
                    $scope.margin.CONSULTING = ((($scope.totalConsultingpricefromPricing - $scope.CONSULTINGvalue) / $scope.totalConsultingpricefromPricing) * 100).toFixed(2);
                }
                else
                    $scope.margin.CONSULTING = 0;
            }


            if ($scope.TempDiscount != null && $scope.TempDiscount.length > 0) {
                ProcessProjectMarginDiscount($scope.TempDiscount);
            }
            else
                $scope.GetDiscount($scope.OpportunityDetail.SBUId, $scope.OpportunityDetail.CountryId);

        }

        $scope.GetGrossmarginbyOppGroup_GM = function (oppid, groupid) {
            console.log('oppid, groupid' + oppid)
            GrossMarginService.GetGrossmarginbyOppGroup(oppid, groupid).success(function (data) {

                if (data != null && data.length > 0) {
                    $scope.margin = {};

                    // $scope.margin.PS = data[0].PS;
                    // $scope.margin.RESOURCING = data[0].RESOURCING;
                    // $scope.margin.MAINTANACE = data[0].MAINTANACE;
                    // $scope.margin.IP = data[0].IP;
                    // $scope.margin.HOSTED = data[0].HOSTED;
                    // $scope.margin.TRADING = data[0].TRADING;
                    // $scope.margin.CONSULTING = data[0].CONSULTING;
                    if (data[0].MAINTANACEvalue == null)
                        $scope.MAINTANACEvalue = 0;
                    else
                        $scope.MAINTANACEvalue = parseFloat(data[0].MAINTANACEvalue);

                    if (data[0].IPvalue == null)
                        $scope.IPvalue = 0;
                    else
                        $scope.IPvalue = parseFloat(data[0].IPvalue);

                    if (data[0].HOSTEDvalue == null)
                        $scope.HOSTEDvalue = 0;
                    else
                        $scope.HOSTEDvalue = parseFloat(data[0].HOSTEDvalue);

                    if (data[0].PSvalue == null)
                        $scope.PSvalue = 0;
                    else
                        $scope.PSvalue = parseFloat(data[0].PSvalue);

                    if (data[0].RESOURCINGvalue == null)
                        $scope.RESOURCINGvalue = 0;
                    else
                        $scope.RESOURCINGvalue = parseFloat(data[0].RESOURCINGvalue)

                    if (data[0].TRADINGvalue == null)
                        $scope.TRADINGvalue = 0;
                    else
                        $scope.TRADINGvalue = parseFloat(data[0].TRADINGvalue);

                    if (data[0].CONSULTINGvalue == null)
                        $scope.CONSULTINGvalue = 0;
                    else
                        $scope.CONSULTINGvalue = parseFloat(data[0].CONSULTINGvalue);

                    $scope.call1finished = true;
                    $scope.call2finished = true;
                }
                else {
                    $scope.margin.PS = 0;
                    $scope.margin.RESOURCING = 0;
                    $scope.margin.MAINTANACE = 0;
                    $scope.margin.IP = 0;
                    $scope.margin.HOSTED = 0;
                    $scope.margin.TRADING = 0;
                    $scope.margin.CONSULTING = 0;
                    $scope.MAINTANACEvalue = 0;
                    $scope.IPvalue = 0;
                    $scope.HOSTEDvalue = 0;
                    $scope.PSvalue = 0;
                    $scope.RESOURCINGvalue = 0;
                    $scope.TRADINGvalue = 0;
                    $scope.CONSULTINGvalue = 0;
                    $scope.call1finished = true;

                }
                //by default need to load pricesheet for that payment

                $scope.GetAllPriceSheetbyOppGroupID_GM($scope.OpportunityDetail.OppId, $routeParams.GroupId);

            }).error(function (error) {
                $scope.Error = error;
            })
        };



        $scope.GetMaximumGroupPriceSheetId = function () {

            priceService.GetMaximumGroupPriceSheetId().success(function (data) {
                if (data[0].count == 'null') {
                    $scope.MaxSheetGroupIDForSaveAs = 1;
                }
                else {
                    $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
                }

                if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                    //block the application
                }

            }).error(function (error) {
                $scope.Error = error;
            })

        };




        $scope.IncreaseAdditionalTimeToSheet = function () {
            var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'GrossMargin' };
            priceService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
                if (!data.IsLocked) {
                    $scope.hasedit = false;
                    $scope.griduseredit = true;
                    $scope.$broadcast('timer-add-cd-seconds', 840);
                    $('#showmod').modal('hide');
                }
                else {
                    $scope.sheetholdedby = data.LockedUser;

                    if (data.LockedUser == $rootScope.UserInfo.user.userId) {
                        $scope.hasedit = false;
                        $scope.griduseredit = true;
                        $scope.grideditable_PriceList = true;
                        $scope.counter = 0;
                        $scope.$broadcast('timer-add-cd-seconds', 840);
                        $('#showmod').modal('hide');
                    }
                    else {
                        $scope.grideditable_PriceList = false;
                        $scope.hasedit = true;
                        $scope.griduseredit = false;
                        $scope.sheetholdedby = 'Error occured..';
                    }
                }
                $scope.onLoad();

            }).error(function (error) {

                $scope.Error = error;
            })
        }


        $scope.onBtExport = function () {


            paymentService.ExportToExcelSheet($routeParams.OppId, $routeParams.GroupId).success(function (data) {
                console.log(data);
                var url = BaseURL + 'ExportFiles/' + data.name;

                $scope.downloadurl = url;
                $scope.filename = data.name;
                setTimeout(function () {
                    $('#downloadpdf')[0].click();
                }, 1000);

            }).error(function (error) {
                $scope.Error = error;
            })

        }





        //---------======================
        //Gross Margin end
        //===============================

        //=========================
        //OppSite Config 
        //========================

        $scope.GetOpportunityDataCenterLocated = function () {
            Opportunityservice.GetOpportunityDataCenterLocated().success(function (data) {
                $scope.DataCenterLocated = data;
            }).error(function (error) {
                $scope.Error = error;
            })
        };

        $scope.GetOpportunityDataCenterLocated();


        $scope.GetOpportunityListOppConfig = function (oppid, groupid) {
            console.log('oppid, groupid' + oppid)
            GrossMarginService.GetOppConfigbyOppGroup(oppid, groupid).success(function (data) {

                if (data != null && data.length > 0) {
                    $scope.OpportunityDetail.NoOfDataCenterLocs = data[0].NoOfDataCenterLocs;
                    $scope.OpportunityDetail.NoOfAgentCenterLocs = data[0].NoOfAgentCenterLocs;
                    $scope.OpportunityDetail.IsDataCenterandAgentsColocated = parseInt(data[0].IsDataCenterandAgentsColocated);
                }
                $scope.onchangedatacenter();
                //by default need to load pricesheet for that payment


            }).error(function (error) {
                $scope.Error = error;
            })
        };


        //first call to pricesheet
        // $scope.GetOpportunityList_OPPCONFIG($routeParams.OppId);

        //=========================
        //OppSite Config 
        //========================


        //=====================================
        //Niranjana Code Development
        //=====================================

        // ---- Variables Definition ------// 

        $scope.MaxGroupID = $routeParams.GroupId;
        $scope.OppId = $routeParams.OppId;
        $scope.GroupId = $routeParams.GroupId;
        $scope.LoggedUser = $rootScope.UserInfo.user.userId;

        $scope.Version = '';
        $scope.SheetLockedMessage = '';

        $scope.isResourceEditable = false;
        $scope.isEditClicked = false;
        $scope.DefautState = false;
        $scope.isTandEPSEditable = false;
        $scope.isTandEResourceEditable = false;

        $scope.TandEPSData = [];
        $scope.TandEResourceData = [];
        $scope.ResourcingData = [];
        $scope.Region = [];
        $scope.SBUList = [];
        $scope.LOBList = [];
        $scope.Versions = [];
        $scope.RegionCollection = [];
        var totalrowPS = [];
        var totalrowResource = [];

        $scope.OppDetail = {};
        $scope.VersionInfo = {};
        var OppConfig = {};

        //--------------End-------------------//

        // -----------T & E - Resource Grid --------//

        var columnDefTandEResource = [
            {
                headerName: " # ", field: "RowNo", width: 40, pinned: true, cellRenderer: function (params) {
                    if (params.value == 0) {
                        return '';
                    }
                    else
                        return params.value;
                }
            },
            {
                headerName: "Description", field: "Description", width: 200, pinned: true, cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        if ($scope.isEditClicked) {
                            if (params.data.EditableDesc)
                                return '<span><input id="resTypeTxt" ng-disabled="false" ng-model="TandEResourceData[' + params.rowIndex + '].Description" />';
                            else
                                return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="TandEResourceData[' + params.rowIndex + '].Description" />';
                        }
                        else
                            return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="TandEResourceData[' + params.rowIndex + '].Description" />';
                    }
                    else
                        return '<b>' + params.value + '</b>';

                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Description</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Unit", field: "Unit", width: 60, pinned: true,
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }, cellRenderer: function (params) {
                    if (params.data.Description == 'TOTAL') {
                        return '';
                    }
                    else
                        return params.value;
                }
            },
            {
                headerName: 'Duration',
                groupId: "GroupHC",
                headerTooltip: "Duration",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "UnitCount1",
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "UnitCount2", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "UnitCount3", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "UnitCount4", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "UnitCount5", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    }]
            },
            {
                headerName: 'Resource Count',
                groupId: "GroupRC",
                headerTooltip: "Resource Count",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "ResourceCount1",
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "ResourceCount2", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "ResourceCount3", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "ResourceCount4", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "ResourceCount5", columnGroupShow: 'closed',
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }, cellRenderer: function (params) {
                            if (params.data.Description == 'TOTAL') {
                                return '';
                            }
                            else
                                return params.value;
                        }
                    }]
            },
            {
                headerName: 'Change Resource Count To',
                groupId: "GroupChangeRC",
                headerTooltip: "Change Resource Count To",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "ChangeResourceCountTo1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input type="text" numberonly id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + ' min=0 ng-model="TandEResourceData[' + params.rowIndex + '].ChangeResourceCountTo1"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "ChangeResourceCountTo2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input type="text" numberonly id="yearsTxt2" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + ' min=0 ng-model="TandEResourceData[' + params.rowIndex + '].ChangeResourceCountTo2"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "ChangeResourceCountTo3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input type="text" numberonly id="yearsTxt3" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + ' min=0 ng-model="TandEResourceData[' + params.rowIndex + '].ChangeResourceCountTo3"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "ChangeResourceCountTo4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input type="text" numberonly id="yearsTxt4" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + ' min=0 ng-model="TandEResourceData[' + params.rowIndex + '].ChangeResourceCountTo4"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "ChangeResourceCountTo5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input type="text" numberonly id="yearsTxt5" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + ' min=0 ng-model="TandEResourceData[' + params.rowIndex + '].ChangeResourceCountTo5"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    }]
            },
            {
                headerName: 'Onsite %',
                groupId: "GroupOnsitePer",
                headerTooltip: "Onsite %",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "OnsitePercent1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsitePercent1"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "OnsitePercent2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsitePercent2"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "OnsitePercent3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsitePercent3"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "OnsitePercent4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsitePercent4"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "OnsitePercent5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsitePercent5"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    }]
            },
            {
                headerName: 'Average Travels per Resource',
                groupId: "GroupAvg",
                headerTooltip: "Average Travels per Resource",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "AvgTravel1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AvgTravel1"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "AvgTravel2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AvgTravel2"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "AvgTravel3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AvgTravel3"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "AvgTravel4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AvgTravel4"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "AvgTravel5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AvgTravel5"'
                                    + ' ng-blur="GetTandEResourceValues(' + params.rowIndex + ')" '
                                    + '/></span>';
                            }
                            else
                                return '';
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        }
                    }]
            },
            {
                headerName: 'Onsite Business Days',
                groupId: "GroupOnsiteBusiness",
                headerTooltip: "Onsite Business Days",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "OnsiteBusinessDays1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsiteBusinessDays1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "OnsiteBusinessDays2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsiteBusinessDays2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "OnsiteBusinessDays3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsiteBusinessDays3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "OnsiteBusinessDays4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsiteBusinessDays4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "OnsiteBusinessDays5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].OnsiteBusinessDays5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Effective Business Days',
                groupId: "GroupEffectiveBusiness",
                headerTooltip: "Effective Business Days",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "EffectiveBusinessDays1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].EffectiveBusinessDays1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "EffectiveBusinessDays2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].EffectiveBusinessDays2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "EffectiveBusinessDays3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].EffectiveBusinessDays3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "EffectiveBusinessDays4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].EffectiveBusinessDays4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "EffectiveBusinessDays5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].EffectiveBusinessDays5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Travel Man Days',
                groupId: "GroupTravelManDays",
                headerTooltip: "Travel Man Days",
                children: [
                    {
                        headerName: "Year 1", width: 60, field: "TravelManDays1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].TravelManDays1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 60, field: "TravelManDays2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].TravelManDays2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 60, field: "TravelManDays3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].TravelManDays3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 60, field: "TravelManDays4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].TravelManDays4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 60, field: "TravelManDays5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].TravelManDays5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 0);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Visa',
                groupId: "GroupVisa",
                headerTooltip: "Visa",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "Visa1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Visa1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "Visa2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Visa2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "Visa3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Visa3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "Visa4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Visa4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "Visa5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Visa5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Air Fare (2 Way)',
                groupId: "GroupAirFare",
                headerTooltip: "Air Fare (2 Way)",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "AirFare1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AirFare1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "AirFare2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AirFare2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "AirFare3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AirFare3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "AirFare4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AirFare4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "AirFare5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].AirFare5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Accomodation',
                groupId: "GroupAccomodation",
                headerTooltip: "Accomodation",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "Accomodation1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Accomodation1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "Accomodation2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Accomodation2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "Accomodation3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Accomodation3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "Accomodation4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Accomodation4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "Accomodation5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Accomodation5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Per-Diem & Laundry',
                groupId: "GroupPerDiem",
                headerTooltip: "Per-Diem & Laundry",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "PerDiem1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].PerDiem1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "PerDiem2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].PerDiem2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "PerDiem3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].PerDiem3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "PerDiem4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].PerDiem4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "PerDiem5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].PerDiem5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Local Conveyance',
                groupId: "GroupLocalConveyance",
                headerTooltip: "Local Conveyance",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "LocalConveyance1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].LocalConveyance1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "LocalConveyance2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].LocalConveyance2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "LocalConveyance3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].LocalConveyance3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "LocalConveyance4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].LocalConveyance4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "LocalConveyance5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].LocalConveyance5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Misc',
                groupId: "GroupMisc",
                headerTooltip: "Misc",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "Misc1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Misc1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "Misc2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Misc2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "Misc3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Misc3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "Misc4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Misc4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "Misc5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Misc5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                if (params.data.Description == 'TOTAL')
                                    return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: 'Total',
                groupId: "GroupTotal",
                headerTooltip: "Total",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "Total1", cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Total1"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "Total2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Total2"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "Total3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Total3"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "Total4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Total4"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "Total5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            if (params.data.Description != 'TOTAL') {
                                return '<span><input id="yearsTxt" ng-disabled="true" '
                                    + 'type="text" numberonly min=0 ng-model="TandEResourceData[' + params.rowIndex + '].Total5"'
                                    + '/></span>';
                            }
                            else
                                return params.value;
                        },
                        cellClassRules: {
                            'bg-light': function (params) {
                                return true;
                            }
                        },
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            }
        ];

        $scope.tandEResourceGrid = {
            rowSelection: 'single',
            headerHeight: 36,
            rowHeight: 24,
            angularCompileRows: true,
            singleClickEdit: true,
            suppressRowClickSelection: false,
            columnDefs: columnDefTandEResource,
            groupHeaders: true,
            rowData: [],
            enableColResize: true,
            debug: true,
            icons: {
                menu: '<i class="fa fa-bars"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupContracted: '<i class="fa fa-minus-square-o"/>',
                groupExpanded: '<i class="fa fa-plus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-minus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-plus-square-o"/>'
            }
        };

        // --------------- END ---------------------//

        // -----------T & E - PS Grid---------------//

        var columnDefTandEPS = [
            {
                headerName: " # ", field: "RowNo", width: 40, pinned: true, cellRenderer: function (params) {
                    if (params.value == 0) {
                        return '';
                    }
                    else
                        return params.value;
                }
            },
            {
                headerName: "Description", field: "Description", width: 200, pinned: true, cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        if ($scope.isEditClicked) {
                            if (params.data.EditableDesc)
                                return '<span><input id="resTypeTxt" ng-disabled="false" ng-model="TandEPSData[' + params.rowIndex + '].Description" />';
                            else
                                return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="TandEPSData[' + params.rowIndex + '].Description" />';
                        }
                        else
                            return '<span><input style="background-color:white" id="resTypeTxt" ng-disabled="true" ng-model="TandEPSData[' + params.rowIndex + '].Description" />';
                    }
                    else
                        return '<b>' + params.value + '</b>';

                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Description</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Man Days", width: 100, headerTooltip: 'ManDays', field: "ManDays", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].ManDays"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Man Days</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Resource Count", width: 100, headerTooltip: 'ResourceCount', field: "ResourceCount", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].ResourceCount"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Resource Count</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Change Resource Count To", width: 100, headerTooltip: 'ChangeResourceCountTo', field: "ChangeResourceCountTo", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                            + 'ng-blur="GetTandEPSValues(' + params.rowIndex + ')" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].ChangeResourceCountTo"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Change Resource<br>Count To</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Onsite %", width: 100, headerTooltip: 'Onsite Percent', field: "OnsitePercent", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true"'
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].OnsitePercent"'
                            + '/>%</span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Onsite %</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Change Onsite % To", width: 100, headerTooltip: 'Change Onsite Percent To', field: "ChangeOnsitePercentTo", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                            + 'ng-blur="GetTandEPSValues(' + params.rowIndex + ')" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].ChangeOnsitePercentTo"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Change Onsite<br>Percent To</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Average number of Travels per Resource", width: 100, headerTooltip: 'AvgTravel', field: "AvgTravel", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:#F0F8FF" ng-disabled="!isEditClicked" '
                            + 'ng-blur="GetTandEPSValues(' + params.rowIndex + ')"'
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].AvgTravel"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Average number<br> of Travels<br> per Resource</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Resource stays Onsite (No Travel)", field: "StaysOnsite", width: 85, cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><select style="background-color:#F0F8FF" id="ddUnit" ng-disabled="!isEditClicked"'
                            + ' ng-blur="GetTandEPSValues(' + params.rowIndex + ')"'
                            + ' name="ddlUnit" ng-model="TandEPSData[' + params.rowIndex + '].StaysOnsite" title="Select Y/N">'
                            + '<option value="">- Select Y/N -</option>'
                            + '<option value="Y">Y</option>'
                            + '<option value="N">N</option>'
                            + '</select></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Resource stays<br> Onsite<br> (No Travel)</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Onsite Business Days", width: 100, headerTooltip: 'OnsiteBusinessDays', field: "OnsiteBusinessDays", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].OnsiteBusinessDays"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Onsite<br> Business Days</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Effective Business Days", width: 100, headerTooltip: 'EffectiveBusinessDays', field: "EffectiveBusinessDays", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].EffectiveBusinessDays"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Effective<br> Business Days</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Travel Man Days", width: 100, headerTooltip: 'TravelManDays', field: "TravelManDays", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].TravelManDays"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Travel<br> Man Days</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                }
            },
            {
                headerName: "Visa", width: 100, headerTooltip: 'Visa', field: "Visa", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].Visa"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Visa</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                },
                cellRenderer: function (params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Air Fare (2 Way)", width: 100, headerTooltip: 'AirFare', field: "AirFare", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].AirFare"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Air Fare<br> (2 Way)</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                },
                cellRenderer: function (params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Accomodation", width: 100, headerTooltip: 'Accomodation', field: "Accomodation", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].Accomodation"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Accomodation</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                },
                cellRenderer: function (params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Per-Diem & Laundry", width: 100, headerTooltip: 'Per-Diem & Laundry', field: "PerDiem", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].PerDiem"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Per-Diem<br> & Laundry</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                },
                cellRenderer: function (params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Local Conveyance", width: 100, headerTooltip: 'LocalConveyance', field: "LocalConveyance", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].LocalConveyance"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Local<br> Conveyance</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                },
                cellRenderer: function (params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Misc", width: 100, headerTooltip: 'Misc', field: "Misc", cellRenderer: function (params) {
                    if (params.data.Description != 'TOTAL') {
                        return '<span><input id="yearsTxt" style="background-color:white" ng-disabled="true" '
                            + 'type="text" numberonly min=0 ng-model="TandEPSData[' + params.rowIndex + '].Misc"'
                            + '/></span>';
                    }
                    else
                        return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Misc</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        if (params.data.Description == 'TOTAL')
                            return true;
                    }
                },
                cellRenderer: function (params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            },
            {
                headerName: "Total", width: 100, headerTooltip: 'Total', field: "Total", cellRenderer: function (params) {
                    return params.value;
                },
                headerCellTemplate: function () {
                    return '<div style="color:white"><b>Total</b></div>';
                },
                cellClassRules: {
                    'bg-light': function (params) {
                        return true;
                    }
                },
                cellRenderer: function (params) {
                    var eCell = document.createElement('span');
                    var number;
                    if (!params.value || !isFinite(params.value)) {
                        number = 0;
                    } else {
                        number = $filter('number')(params.value, 2);
                    }
                    eCell.innerHTML = number;
                    return eCell;
                }
            }
        ];

        $scope.tandEPSGrd = {
            rowSelection: 'single',
            headerHeight: 36,
            rowHeight: 24,
            angularCompileRows: true,
            singleClickEdit: true,
            suppressRowClickSelection: false,
            columnDefs: columnDefTandEPS,
            groupHeaders: true,
            rowData: [],
            enableColResize: true,
            debug: true
        };

        // --------------- END ---------------------//
        // -----------Resource Grid ----------------//

        var columnDefResource = [
            {
                headerName: " # ", field: "RowNo", width: 40, pinned: true
            },
            {
                headerName: "LOB", field: "LOB", width: 90, pinned: true, cellRenderer: function (params) {
                    return '<span><select id="ddLOB" ng-disabled="!isEditClicked" ng-options="item.Id as item.LOBName for item in LOBList"'
                        + ' name="ddlLOB" ng-model="ResourcingData[' + params.rowIndex + '].LOB" title="Select LOB">'
                        + '<option value="">- Select LOB -</option>'
                        + '</select></span>';
                }
            },
            {
                headerName: "SBU", field: "SBU", width: 85, pinned: true, cellRenderer: function (params) {
                    return '<span><select id="ddSBU" ng-disabled="!isEditClicked" ng-options="item.id as item.SBU for item in SBUList"'
                        + 'ng-change="RefreshRegion(ResourcingData[' + params.rowIndex + '].SBU,' + params.rowIndex + ')"'
                        + ' name="ddlSBU" ng-model="ResourcingData[' + params.rowIndex + '].SBU" title="Select SBU">'
                        + '<option value="">- Select SBU -</option>'
                        + '</select></span>';
                }
            },
            {
                headerName: "Region", field: "Region", width: 100, pinned: true, cellRenderer: function (params) {
                    return '<span><select id="ddRegion" ng-disabled="!isEditClicked" ng-options="item.Id as item.CountryName for item in RegionCollection[' + params.rowIndex + ']"'
                        + 'name="ddlRegion" ng-model="ResourcingData[' + params.rowIndex + '].Region" title="Select Region">'
                        + '<option value="">- Select Region -</option>'
                        + '</select></span>';
                }
            },
            {
                headerName: "Resource Type", width: 200, field: "ResourceType", cellRenderer: function (params) {
                    return '<span><input id="resTypeTxt" ng-disabled="!isEditClicked" ng-blur="ResourceRowChanged(\'Modify\',' + params.rowIndex + ')" ng-model="ResourcingData[' + params.rowIndex + '].ResourceType" />';
                }
            },
            {
                headerName: "Years of <br>Experience", width: 100, headerTooltip: 'Years of Experience', field: "Experience", cellRenderer: function (params) {
                    return '<span><input id="yearsTxt" ng-disabled="!isEditClicked" '
                        + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].Experience"'
                        + '/></span>';
                }
            },
            {
                headerName: "Unit", field: "Unit", width: 85, cellRenderer: function (params) {
                    return '<span><select id="ddUnit" ng-disabled="!isEditClicked"'
                        + ' ng-change="GetResourceYear(' + params.rowIndex
                        + ')"  name="ddlUnit" ng-model="ResourcingData[' + params.rowIndex + '].Unit" title="Select Unit">'
                        + '<option value="">- Select Unit -</option>'
                        + '<option value="Hour">Hour</option>'
                        + '<option value="Month">Month</option>'
                        + '<option value="Year">Year</option>'
                        + '</select></span>';
                }
            },
            {
                headerName: "Unit Rate <br>(Cost)", width: 100, field: "UnitRate", cellRenderer: function (params) {
                    return '<span><input id="unitRateTxt" ng-disabled="!isEditClicked"'
                        + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                        + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitRate"'
                        + '/></span>';
                }
            },
            {
                headerName: 'Duration',
                groupId: "GroupDur",
                headerTooltip: "Duration",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "UnitCount1", cellRenderer: function (params) {
                            return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount1"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "UnitCount2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount2"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "UnitCount3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount3"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "UnitCount4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount4"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "UnitCount5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="unitCountTxt" ng-disabled="!isEditClicked"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].UnitCount5"'
                                + '/></span>';
                        }
                    }]
            },
            {
                headerName: 'Head Count',
                groupId: "GroupHC",
                headerTooltip: "Head Count",
                children: [
                    {
                        headerName: "Year 1", width: 100, field: "HeadCount1", cellRenderer: function (params) {
                            return '<span><input id="hc1Txt" ng-disabled="isEditClicked ? (('
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount1"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "HeadCount2", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="hc2Txt" ng-disabled="isEditClicked ? (('
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount2"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "HeadCount3", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="hc3Txt" ng-disabled="isEditClicked ? (('
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount3"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "HeadCount4", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="hc4Txt" ng-disabled="isEditClicked ? (('
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount5 > 0)) ? true : false) : true"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount4"'
                                + '/></span>';
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "HeadCount5", columnGroupShow: 'closed', cellRenderer: function (params) {
                            return '<span><input id="hc5Txt" ng-disabled="isEditClicked ? (('
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount2 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount3 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount4 > 0) || '
                                + '(ResourcingData[' + params.rowIndex + '].HeadCount1 > 0)) ? true : false) : true"'
                                + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                                + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].HeadCount5"'
                                + '/></span>';
                        }
                    }]
            },
            {
                headerName: 'COST',
                groupId: "GroupCost",
                headerTooltip: "Cost",
                children: [{
                    headerName: "Total", field: "TotalYearCost", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                    cellRenderer: function (params) {
                        var number = parseInt(parseInt(params.data.Year1) + parseInt(params.data.Year2) + parseInt(params.data.Year3) + parseInt(params.data.Year4) + parseInt(params.data.Year5));
                        return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                    }
                },
                {
                    headerName: "Year 1", width: 100, field: "Year1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    },
                },
                {
                    headerName: "Year 2", width: 100, field: "Year2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 3", width: 100, field: "Year3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 4", width: 100, field: "Year4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                },
                {
                    headerName: "Year 5", width: 100, field: "Year5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                    cellRenderer: function (params) {
                        var eCell = document.createElement('span');
                        var number;
                        if (!params.value || !isFinite(params.value)) {
                            number = 0;
                        } else {
                            number = $filter('number')(params.value, 2);
                        }
                        eCell.innerHTML = number;
                        return eCell;
                    }
                }]
            },

            {
                headerName: 'Penalty',
                groupId: "GroupPenalty",
                headerTooltip: "Penalty",
                children: [
                    {
                        headerName: "Total", field: "TotalYearPenalty", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                        cellRenderer: function (params) {
                            var number = parseInt((isNaN(parseInt(params.data.PenaltyYear1)) ? 0 : parseInt(params.data.PenaltyYear1)) + (isNaN(parseInt(params.data.PenaltyYear2)) ? 0 : parseInt(params.data.PenaltyYear2)) + (isNaN(parseInt(params.data.PenaltyYear3)) ? 0 : parseInt(params.data.PenaltyYear3)) + (isNaN(parseInt(params.data.PenaltyYear4)) ? 0 : parseInt(params.data.PenaltyYear4)) + (isNaN(parseInt(params.data.PenaltyYear5)) ? 0 : parseInt(params.data.PenaltyYear5)));
                            return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                        }
                    },
                    {
                        headerName: "Year 1", width: 100, field: "PenaltyYear1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        },
                    },
                    {
                        headerName: "Year 2", width: 100, field: "PenaltyYear2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "PenaltyYear3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "PenaltyYear4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "PenaltyYear5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            },
            {
                headerName: "Overhead",
                groupId: "GroupOverhead",
                children: [
                    {
                        headerName: "Total", field: "TotalYearOverhead", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                        cellRenderer: function (params) {
                            var number = parseInt((isNaN(parseInt(params.data.OverheadYear1)) ? 0 : parseInt(params.data.OverheadYear1)) + (isNaN(parseInt(params.data.OverheadYear2)) ? 0 : parseInt(params.data.OverheadYear2)) + (isNaN(parseInt(params.data.OverheadYear3)) ? 0 : parseInt(params.data.OverheadYear3)) + (isNaN(parseInt(params.data.OverheadYear4)) ? 0 : parseInt(params.data.OverheadYear4)) + (isNaN(parseInt(params.data.OverheadYear5)) ? 0 : parseInt(params.data.OverheadYear5)));
                            return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                        }
                    },
                    {
                        headerName: "Year 1", width: 100, field: "OverheadYear1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 2", width: 100, field: "OverheadYear2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "OverheadYear3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "OverheadYear4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "OverheadYear5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }
                ]
            },
            {
                headerName: "Margin", width: 100, field: "Margin", cellRenderer: function (params) {
                    return '<span><input id="unitRateTxt" ng-disabled="!isEditClicked"'
                        + ' ng-blur="GetResourceYear(' + params.rowIndex + ')" '
                        + 'type="text" numberonly min=0 ng-model="ResourcingData[' + params.rowIndex + '].Margin"'
                        + '/></span>';
                }
            },
            {
                headerName: 'TOTAL',
                groupId: "GroupMargin",
                headerTooltip: "Total",
                children: [
                    {
                        headerName: "Total", field: "TotalYearMargin", width: 90, headerTooltip: "Total", editable: false, cellStyle: { 'background-color': '#CDCDCD' },
                        cellRenderer: function (params) {
                            var number = parseInt((isNaN(parseInt(params.data.MarginYear1)) ? 0 : parseInt(params.data.MarginYear1)) + (isNaN(parseInt(params.data.MarginYear2)) ? 0 : parseInt(params.data.MarginYear2)) + (isNaN(parseInt(params.data.MarginYear3)) ? 0 : parseInt(params.data.MarginYear3)) + (isNaN(parseInt(params.data.MarginYear4)) ? 0 : parseInt(params.data.MarginYear4)) + (isNaN(parseInt(params.data.MarginYear5)) ? 0 : parseInt(params.data.MarginYear5)));
                            return '<span title=' + number + '>' + $filter('number')(number, 2) + '</span>';
                        }
                    },
                    {
                        headerName: "Year 1", width: 100, field: "MarginYear1", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        },
                    },
                    {
                        headerName: "Year 2", width: 100, field: "MarginYear2", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 3", width: 100, field: "MarginYear3", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 4", width: 100, field: "MarginYear4", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    },
                    {
                        headerName: "Year 5", width: 100, field: "MarginYear5", editable: false, cellStyle: { 'background-color': '#CDCDCD' }, columnGroupShow: 'closed',
                        cellRenderer: function (params) {
                            var eCell = document.createElement('span');
                            var number;
                            if (!params.value || !isFinite(params.value)) {
                                number = 0;
                            } else {
                                number = $filter('number')(params.value, 2);
                            }
                            eCell.innerHTML = number;
                            return eCell;
                        }
                    }]
            }
        ];

        $scope.resourceGrid = {
            angularCompileRows: true,
            rowSelection: 'single',
            enableFilter: true,
            groupHeaders: true,
            headerHeight: 36,
            rowHeight: 24,
            groupSuppressAutoColumn: false,
            groupSuppressGroupColumn: true,
            enableCellExpressions: true,
            suppressMovableColumns: true,
            singleClickEdit: true,
            columnDefs: columnDefResource,
            rowData: [],
            enableColResize: true,
            debug: true,
            icons: {
                menu: '<i class="fa fa-bars"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupContracted: '<i class="fa fa-minus-square-o"/>',
                groupExpanded: '<i class="fa fa-plus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-minus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-plus-square-o"/>'
            }
        };

        //--------- End Grid ---------------//





        $scope.GetResourceGridData = function () {
            if ($routeParams.GroupId != 'undefined') {
                console.log('Getting service data..');
                ResourceService.GetAllResourcebyOppGroupID($scope.OppDetail.OppId, $scope.MaxGroupID).success(function (data) {
                    if (data.Error == null) {
                        $scope.ResourcingData = data;
                        angular.forEach($scope.ResourcingData, function (value, key) {
                            $scope.RefreshRegion(value.SBU, value.RowNo - 1);
                            value.SBU = $scope.OppDetail.SBUId;
                            value.Margin = parseInt(value.Margin);
                            //value.Region = $scope.OppDetail.CountryId;
                        });
                        $scope.resourceGrid.api.setRowData($scope.ResourcingData);
                        $scope.resourceGrid.rowData = $scope.ResourcingData;
                        $timeout(function () {
                            $scope.resourceGrid.api.refreshView();
                        }, 500);
                    }
                }).error(function (error) {
                    console.log('Error occurred: ' + error);
                    $scope.Error = error;
                });
            }
        };

        $scope.GetTandEPSGridData = function () {
            try {
                if ($routeParams.GroupId != 'undefined') {
                    console.log('Getting service data..');
                    $scope.TandEPSData = [];
                    DayService.GetDaysheetFTEHoursbyOppGroup($scope.OppId, $scope.MaxGroupID).success(function (inputs) {
                        //if (inputs.length > 0) {
                        TandEPSService.GetAllTandEPSbyOppGroupID($scope.OppDetail.OppId, $scope.MaxGroupID).success(function (data) {
                            if (data.Error == null) {
                                console.log('-------------------------------------Input-----------------------------------------');
                                console.log(JSON.stringify(inputs))
                                console.log('-----------------------------------End Input---------------------------------------');

                                angular.forEach(inputs, function (row, key) {
                                    row.ManDays = Math.ceil((parseFloat(row.FTEHours)) / (($scope.OpportunityDetail.UseManDayshours == 'Hours') ? ((OppConfig.WorkingHoursperDay > 0) ? OppConfig.WorkingHoursperDay : 1) : 1));
                                });

                                $scope.TandEPSData = data;
                                if (data.length == 0) {
                                    if (inputs.length > 0) {
                                        $scope.TandEPSData.push({ RowNo: 1, Description: 'Requirements Gathering', ManDays: inputs[0].ManDays, ResourceCount: parseInt(inputs[0].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[0].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 2, Description: 'Design', ManDays: inputs[1].ManDays, ResourceCount: parseInt(inputs[1].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[1].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 3, Description: 'Development & Test', ManDays: inputs[2].ManDays, ResourceCount: parseInt(inputs[2].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[2].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 4, Description: 'System Testing', ManDays: inputs[3].ManDays, ResourceCount: parseInt(inputs[3].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[3].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 5, Description: 'Implementation', ManDays: inputs[4].ManDays, ResourceCount: parseInt(inputs[4].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[4].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 6, Description: 'UAT', ManDays: inputs[5].ManDays, ResourceCount: parseInt(inputs[5].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[5].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 7, Description: 'Production Support / Cutover', ManDays: inputs[6].ManDays, ResourceCount: parseInt(inputs[6].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[6].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 8, Description: 'Training', ManDays: inputs[7].ManDays, ResourceCount: parseInt(inputs[7].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[7].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 9, Description: 'Manuals', ManDays: inputs[8].ManDays, ResourceCount: parseInt(inputs[8].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[8].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 10, Description: 'Orientation & Handover', ManDays: inputs[9].ManDays, ResourceCount: parseInt(inputs[9].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[9].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 11, Description: 'SQA', ManDays: inputs[10].ManDays, ResourceCount: parseInt(inputs[10].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[10].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 12, Description: 'Project Management', ManDays: inputs[11].ManDays, ResourceCount: parseInt(inputs[11].Resources), ChangeResourceCountTo: '', OnsitePercent: parseInt(inputs[11].OnsitePercentage), ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        // $scope.TandEPSData.push({ RowNo: 13, Description: 'Calculated Efforts', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 13, Description: 'From Cost Sheet - Resourcing Model', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 14, Description: 'Other 1', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 15, Description: 'Other 2', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 16, Description: 'Other 3', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 17, Description: 'Other 4', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 18, Description: 'Other 5', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });

                                        totalrowPS = [{ RowNo: '', Description: 'TOTAL', ManDays: '', ResourceCount: '', ChangeResourceCountTo: '', OnsitePercent: '', ChangeOnsitePercentTo: '', AvgTravel: '', StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false }];
                                    }
                                    else {
                                        $scope.TandEPSData.push({ RowNo: 1, Description: 'Requirements Gathering', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 2, Description: 'Design', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 3, Description: 'Development & Test', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 4, Description: 'System Testing', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 5, Description: 'Implementation', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 6, Description: 'UAT', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 7, Description: 'Production Support / Cutover', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 8, Description: 'Training', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 9, Description: 'Manuals', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 10, Description: 'Orientation & Handover', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 11, Description: 'SQA', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 12, Description: 'Project Management', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        // $scope.TandEPSData.push({ RowNo: 13, Description: 'Calculated Efforts', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 13, Description: 'From Cost Sheet - Resourcing Model', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                                        $scope.TandEPSData.push({ RowNo: 14, Description: 'Other 1', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 15, Description: 'Other 2', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 16, Description: 'Other 3', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 17, Description: 'Other 4', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                                        $scope.TandEPSData.push({ RowNo: 18, Description: 'Other 5', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });

                                        totalrowPS = [{ RowNo: '', Description: 'TOTAL', ManDays: '', ResourceCount: '', ChangeResourceCountTo: '', OnsitePercent: '', ChangeOnsitePercentTo: '', AvgTravel: '', StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false }];
                                    }
                                }
                                else {
                                    totalrowPS = []
                                    totalrowPS.push($scope.TandEPSData[18]);
                                    $scope.TandEPSData.splice(18, 1);
                                }
                            }

                            $scope.tandEPSGrd.api.setRowData($scope.TandEPSData);
                            $scope.tandEPSGrd.api.setFloatingBottomRowData(totalrowPS);
                            $scope.tandEPSGrd.rowData = $scope.TandEPSData;
                            $timeout(function () {
                                $scope.tandEPSGrd.api.refreshView();
                            }, 500);
                        }).error(function (error) {
                            console.log('Error occurred: ' + error);
                            $scope.Error = error;
                        });
                        //}
                        // else {
                        //     console.log('T and E PS Grid cannot be loaded as data unavailable for this opportunity in Days Sheet');
                        // }

                    }).error(function (error) {
                        $scope.Error = error;
                        console.log('Error occurred when fetching inputs.. ' + error);
                    });
                }
                else {
                    $scope.TandEPSData.push({ RowNo: 1, Description: 'Requirements Gathering', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 2, Description: 'Design', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 3, Description: 'Development & Test', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 4, Description: 'System Testing', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 5, Description: 'Implementation', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 6, Description: 'UAT', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 7, Description: 'Production Support / Cutover', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 8, Description: 'Training', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 9, Description: 'Manuals', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 10, Description: 'Orientation & Handover', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 11, Description: 'SQA', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 12, Description: 'Project Management', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: "N", OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    // $scope.TandEPSData.push({ RowNo: 13, Description: 'Calculated Efforts', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: 'Y', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 13, Description: 'From Cost Sheet - Resourcing Model', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false });
                    $scope.TandEPSData.push({ RowNo: 14, Description: 'Other 1', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                    $scope.TandEPSData.push({ RowNo: 15, Description: 'Other 2', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                    $scope.TandEPSData.push({ RowNo: 16, Description: 'Other 3', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                    $scope.TandEPSData.push({ RowNo: 17, Description: 'Other 4', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });
                    $scope.TandEPSData.push({ RowNo: 18, Description: 'Other 5', ManDays: 0, ResourceCount: 0, ChangeResourceCountTo: '', OnsitePercent: 0, ChangeOnsitePercentTo: '', AvgTravel: 1, StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: true });

                    totalrowPS = [{ RowNo: '', Description: 'TOTAL', ManDays: '', ResourceCount: '', ChangeResourceCountTo: '', OnsitePercent: '', ChangeOnsitePercentTo: '', AvgTravel: '', StaysOnsite: '', OnsiteBusinessDays: 0, EffectiveBusinessDays: 0, TravelManDays: 0, Visa: 0, AirFare: 0, Accomodation: 0, PerDiem: 0, LocalConveyance: 0, Misc: 0, Total: 0, EditableDesc: false }];

                    $scope.tandEPSGrd.api.setRowData($scope.TandEPSData);
                    $scope.tandEPSGrd.api.setFloatingBottomRowData(totalrowPS);
                    $scope.tandEPSGrd.rowData = $scope.TandEPSData;
                    $timeout(function () {
                        $scope.tandEPSGrd.api.refreshView();
                    }, 500);
                }
            }
            catch (ex) {
                console.log('Error occurred fetching PS Grid data: ' + ex);
            }
        };

        $scope.GetTandEResourceGridData = function () {
            if ($routeParams.GroupId != 'undefined') {
                console.log('Getting service data..');
                $scope.TandEResourceData = [];
                totalrowResource = [];
                TandEResourceService.GetAllTandEResourcebyOppGroupID($scope.OppDetail.OppId, $scope.MaxGroupID).success(function (data) {
                    if (data.Error == null) {
                        $scope.TandEResourceData = data;
                        if (data.length == 0) {
                            var i = 1;
                            angular.forEach($scope.ResourcingData, function (value, key) {
                                $scope.TandEResourceData.push({
                                    RowNo: i, Description: value.ResourceType, Unit: value.Unit,
                                    UnitCount1: value.UnitCount1,
                                    UnitCount2: value.UnitCount2,
                                    UnitCount3: value.UnitCount3,
                                    UnitCount4: value.UnitCount4,
                                    UnitCount5: value.UnitCount5,
                                    ResourceCount1: value.HeadCount1,
                                    ResourceCount2: value.HeadCount2,
                                    ResourceCount3: value.HeadCount3,
                                    ResourceCount4: value.HeadCount4,
                                    ResourceCount5: value.HeadCount5,
                                    // ChangeResourceCountTo1: '',
                                    // ChangeResourceCountTo2: '',
                                    // ChangeResourceCountTo3: '',
                                    // ChangeResourceCountTo4: '',
                                    // ChangeResourceCountTo5: '',        
                                    OnsitePercent1: 0,
                                    OnsitePercent2: 0,
                                    OnsitePercent3: 0,
                                    OnsitePercent4: 0,
                                    OnsitePercent5: 0,
                                    AvgTravel1: 1,
                                    AvgTravel2: 1,
                                    AvgTravel3: 1,
                                    AvgTravel4: 1,
                                    AvgTravel5: 1,
                                    OnsiteBusinessDays1: 0,
                                    OnsiteBusinessDays2: 0,
                                    OnsiteBusinessDays3: 0,
                                    OnsiteBusinessDays4: 0,
                                    OnsiteBusinessDays5: 0,
                                    EffectiveBusinessDays1: 0,
                                    EffectiveBusinessDays2: 0,
                                    EffectiveBusinessDays3: 0,
                                    EffectiveBusinessDays4: 0,
                                    EffectiveBusinessDays5: 0,
                                    TravelManDays1: 0,
                                    TravelManDays2: 0,
                                    TravelManDays3: 0,
                                    TravelManDays4: 0,
                                    TravelManDays5: 0,
                                    Visa1: 0,
                                    Visa2: 0,
                                    Visa3: 0,
                                    Visa4: 0,
                                    Visa5: 0,
                                    AirFare1: 0,
                                    AirFare2: 0,
                                    AirFare3: 0,
                                    AirFare4: 0,
                                    AirFare5: 0,
                                    Accomodation1: 0,
                                    Accomodation2: 0,
                                    Accomodation3: 0,
                                    Accomodation4: 0,
                                    Accomodation5: 0,
                                    PerDiem1: 0,
                                    PerDiem2: 0,
                                    PerDiem3: 0,
                                    PerDiem4: 0,
                                    PerDiem5: 0,
                                    LocalConveyance1: 0,
                                    LocalConveyance2: 0,
                                    LocalConveyance3: 0,
                                    LocalConveyance4: 0,
                                    LocalConveyance5: 0,
                                    Misc1: 0,
                                    Misc2: 0,
                                    Misc3: 0,
                                    Misc4: 0,
                                    Misc5: 0,
                                    Total1: 0,
                                    Total2: 0,
                                    Total3: 0,
                                    Total4: 0,
                                    Total5: 0
                                });

                                i++;
                            });

                            totalrowResource.push({
                                RowNo: '', Description: 'TOTAL', Unit: '',
                                UnitCount1: '',
                                UnitCount2: '',
                                UnitCount3: '',
                                UnitCount4: '',
                                UnitCount5: '',
                                ResourceCount1: '',
                                ResourceCount2: '',
                                ResourceCount3: '',
                                ResourceCount4: '',
                                ResourceCount5: '',
                                ChangeResourceCountTo1: '',
                                ChangeResourceCountTo2: '',
                                ChangeResourceCountTo3: '',
                                ChangeResourceCountTo4: '',
                                ChangeResourceCountTo5: '',
                                OnsitePercent1: '',
                                OnsitePercent2: '',
                                OnsitePercent3: '',
                                OnsitePercent4: '',
                                OnsitePercent5: '',
                                AvgTravel1: '',
                                AvgTravel2: '',
                                AvgTravel3: '',
                                AvgTravel4: '',
                                AvgTravel5: '',
                                OnsiteBusinessDays1: 0,
                                OnsiteBusinessDays2: 0,
                                OnsiteBusinessDays3: 0,
                                OnsiteBusinessDays4: 0,
                                OnsiteBusinessDays5: 0,
                                EffectiveBusinessDays1: 0,
                                EffectiveBusinessDays2: 0,
                                EffectiveBusinessDays3: 0,
                                EffectiveBusinessDays4: 0,
                                EffectiveBusinessDays5: 0,
                                TravelManDays1: 0,
                                TravelManDays2: 0,
                                TravelManDays3: 0,
                                TravelManDays4: 0,
                                TravelManDays5: 0,
                                Visa1: 0,
                                Visa2: 0,
                                Visa3: 0,
                                Visa4: 0,
                                Visa5: 0,
                                AirFare1: 0,
                                AirFare2: 0,
                                AirFare3: 0,
                                AirFare4: 0,
                                AirFare5: 0,
                                Accomodation1: 0,
                                Accomodation2: 0,
                                Accomodation3: 0,
                                Accomodation4: 0,
                                Accomodation5: 0,
                                PerDiem1: 0,
                                PerDiem2: 0,
                                PerDiem3: 0,
                                PerDiem4: 0,
                                PerDiem5: 0,
                                LocalConveyance1: 0,
                                LocalConveyance2: 0,
                                LocalConveyance3: 0,
                                LocalConveyance4: 0,
                                LocalConveyance5: 0,
                                Misc1: 0,
                                Misc2: 0,
                                Misc3: 0,
                                Misc4: 0,
                                Misc5: 0,
                                Total1: 0,
                                Total2: 0,
                                Total3: 0,
                                Total4: 0,
                                Total5: 0
                            });
                        }
                        else {
                            angular.forEach($scope.ResourcingData, function (res, key) {
                                angular.forEach($scope.TandEResourceData, function (te, key) {
                                    if (res.RowNo == te.RowNo)
                                        te.Unit = res.Unit;
                                });
                            });
                            totalrowResource.push(data[data.length - 1]);
                            $scope.TandEResourceData.splice(data.length - 1, 1);
                        }
                    }

                    $scope.tandEResourceGrid.api.setRowData($scope.TandEResourceData);
                    $scope.tandEResourceGrid.api.setFloatingBottomRowData(totalrowResource);
                    $scope.tandEResourceGrid.rowData = $scope.TandEResourceData;
                    $timeout(function () {
                        $scope.tandEResourceGrid.api.refreshView();
                    }, 500);
                }).error(function (error) {
                    console.log('Error occurred: ' + error);
                    $scope.Error = error;
                });

            }
        };

        $scope.ResourceRowChanged = function (change, index) {
            if (change == 'Modify') { //Modified row data
                $scope.TandEResourceData[index].Description = $scope.ResourcingData[index].ResourceType;
                $scope.TandEResourceData[index].Unit = $scope.ResourcingData[index].Unit;
                $scope.TandEResourceData[index].UnitCount1 = $scope.ResourcingData[index].UnitCount1;
                $scope.TandEResourceData[index].UnitCount2 = $scope.ResourcingData[index].UnitCount2;
                $scope.TandEResourceData[index].UnitCount3 = $scope.ResourcingData[index].UnitCount3;
                $scope.TandEResourceData[index].UnitCount4 = $scope.ResourcingData[index].UnitCount4;
                $scope.TandEResourceData[index].UnitCount5 = $scope.ResourcingData[index].UnitCount5;
                $scope.TandEResourceData[index].ResourceCount1 = $scope.ResourcingData[index].HeadCount1;
                $scope.TandEResourceData[index].ResourceCount2 = $scope.ResourcingData[index].HeadCount2;
                $scope.TandEResourceData[index].ResourceCount3 = $scope.ResourcingData[index].HeadCount3;
                $scope.TandEResourceData[index].ResourceCount4 = $scope.ResourcingData[index].HeadCount4;
                $scope.TandEResourceData[index].ResourceCount5 = $scope.ResourcingData[index].HeadCount5;
                $scope.GetTandEResourceValues(index);
            }
            else if (change == 'Delete') { // Deleted a row
                var alterrows = index;
                for (alterrows; alterrows < $scope.TandEResourceData.length; alterrows++) {
                    $scope.TandEResourceData[alterrows].RowNo = alterrows + 1;
                }
            }
            else if (change == 'Add') { // Added new row
                if ($scope.TandEResourceData.length > index) {
                    var alterrows = index;
                    var newid = alterrows + 1;

                    $scope.TandEResourceData.splice(alterrows, 0, {
                        RowNo: newid, Description: $scope.ResourcingData[index].ResourceType, Unit: $scope.ResourcingData[index].Unit,
                        UnitCount1: $scope.ResourcingData[index].UnitCount1,
                        UnitCount2: $scope.ResourcingData[index].UnitCount2,
                        UnitCount3: $scope.ResourcingData[index].UnitCount3,
                        UnitCount4: $scope.ResourcingData[index].UnitCount4,
                        UnitCount5: $scope.ResourcingData[index].UnitCount5,
                        ResourceCount1: $scope.ResourcingData[index].HeadCount1,
                        ResourceCount2: $scope.ResourcingData[index].HeadCount2,
                        ResourceCount3: $scope.ResourcingData[index].HeadCount3,
                        ResourceCount4: $scope.ResourcingData[index].HeadCount4,
                        ResourceCount5: $scope.ResourcingData[index].HeadCount5,
                        OnsitePercent1: 0,
                        OnsitePercent2: 0,
                        OnsitePercent3: 0,
                        OnsitePercent4: 0,
                        OnsitePercent5: 0,
                        AvgTravel1: 1,
                        AvgTravel2: 1,
                        AvgTravel3: 1,
                        AvgTravel4: 1,
                        AvgTravel5: 1,
                        OnsiteBusinessDays1: 0,
                        OnsiteBusinessDays2: 0,
                        OnsiteBusinessDays3: 0,
                        OnsiteBusinessDays4: 0,
                        OnsiteBusinessDays5: 0,
                        EffectiveBusinessDays1: 0,
                        EffectiveBusinessDays2: 0,
                        EffectiveBusinessDays3: 0,
                        EffectiveBusinessDays4: 0,
                        EffectiveBusinessDays5: 0,
                        TravelManDays1: 0,
                        TravelManDays2: 0,
                        TravelManDays3: 0,
                        TravelManDays4: 0,
                        TravelManDays5: 0,
                        Visa1: 0,
                        Visa2: 0,
                        Visa3: 0,
                        Visa4: 0,
                        Visa5: 0,
                        AirFare1: 0,
                        AirFare2: 0,
                        AirFare3: 0,
                        AirFare4: 0,
                        AirFare5: 0,
                        Accomodation1: 0,
                        Accomodation2: 0,
                        Accomodation3: 0,
                        Accomodation4: 0,
                        Accomodation5: 0,
                        PerDiem1: 0,
                        PerDiem2: 0,
                        PerDiem3: 0,
                        PerDiem4: 0,
                        PerDiem5: 0,
                        LocalConveyance1: 0,
                        LocalConveyance2: 0,
                        LocalConveyance3: 0,
                        LocalConveyance4: 0,
                        LocalConveyance5: 0,
                        Misc1: 0,
                        Misc2: 0,
                        Misc3: 0,
                        Misc4: 0,
                        Misc5: 0,
                        Total1: 0,
                        Total2: 0,
                        Total3: 0,
                        Total4: 0,
                        Total5: 0
                    });

                    for (alterrows; alterrows < $scope.TandEResourceData.length; alterrows++) {
                        $scope.TandEResourceData[alterrows].RowNo = alterrows + 1;
                    }
                }
                else {
                    $scope.TandEResourceData.push({
                        RowNo: index + 1, Description: $scope.ResourcingData[index].ResourceType, Unit: $scope.ResourcingData[index].Unit,
                        UnitCount1: $scope.ResourcingData[index].UnitCount1,
                        UnitCount2: $scope.ResourcingData[index].UnitCount2,
                        UnitCount3: $scope.ResourcingData[index].UnitCount3,
                        UnitCount4: $scope.ResourcingData[index].UnitCount4,
                        UnitCount5: $scope.ResourcingData[index].UnitCount5,
                        ResourceCount1: $scope.ResourcingData[index].HeadCount1,
                        ResourceCount2: $scope.ResourcingData[index].HeadCount2,
                        ResourceCount3: $scope.ResourcingData[index].HeadCount3,
                        ResourceCount4: $scope.ResourcingData[index].HeadCount4,
                        ResourceCount5: $scope.ResourcingData[index].HeadCount5,
                        OnsitePercent1: 0,
                        OnsitePercent2: 0,
                        OnsitePercent3: 0,
                        OnsitePercent4: 0,
                        OnsitePercent5: 0,
                        AvgTravel1: 1,
                        AvgTravel2: 1,
                        AvgTravel3: 1,
                        AvgTravel4: 1,
                        AvgTravel5: 1,
                        OnsiteBusinessDays1: 0,
                        OnsiteBusinessDays2: 0,
                        OnsiteBusinessDays3: 0,
                        OnsiteBusinessDays4: 0,
                        OnsiteBusinessDays5: 0,
                        EffectiveBusinessDays1: 0,
                        EffectiveBusinessDays2: 0,
                        EffectiveBusinessDays3: 0,
                        EffectiveBusinessDays4: 0,
                        EffectiveBusinessDays5: 0,
                        TravelManDays1: 0,
                        TravelManDays2: 0,
                        TravelManDays3: 0,
                        TravelManDays4: 0,
                        TravelManDays5: 0,
                        Visa1: 0,
                        Visa2: 0,
                        Visa3: 0,
                        Visa4: 0,
                        Visa5: 0,
                        AirFare1: 0,
                        AirFare2: 0,
                        AirFare3: 0,
                        AirFare4: 0,
                        AirFare5: 0,
                        Accomodation1: 0,
                        Accomodation2: 0,
                        Accomodation3: 0,
                        Accomodation4: 0,
                        Accomodation5: 0,
                        PerDiem1: 0,
                        PerDiem2: 0,
                        PerDiem3: 0,
                        PerDiem4: 0,
                        PerDiem5: 0,
                        LocalConveyance1: 0,
                        LocalConveyance2: 0,
                        LocalConveyance3: 0,
                        LocalConveyance4: 0,
                        LocalConveyance5: 0,
                        Misc1: 0,
                        Misc2: 0,
                        Misc3: 0,
                        Misc4: 0,
                        Misc5: 0,
                        Total1: 0,
                        Total2: 0,
                        Total3: 0,
                        Total4: 0,
                        Total5: 0
                    });
                }
                $scope.GetTandEResourceValues(index);
            }
            $scope.tandEResourceGrid.api.setRowData($scope.TandEResourceData);
            $scope.tandEResourceGrid.rowData = $scope.TandEResourceData;
        };

        $scope.PSDataChanged = function (index, ps) {

            if ($scope.TandEPSData.length > 0) {
                $scope.TandEPSData[index].ManDays = Math.ceil((parseFloat(ps.FTEHours)) / (($scope.OpportunityDetail.UseManDayshours == 'Hours') ? ((OppConfig.WorkingHoursperDay > 0) ? OppConfig.WorkingHoursperDay : 1) : 1));
                $scope.TandEPSData[index].ResourceCount = parseInt(ps.Resources);
                $scope.TandEPSData[index].OnsitePercent = parseInt(ps.OnsitePercentage);
                $scope.GetTandEPSValues(index);
            }
        }


        $scope.GetAllSBU = function () {
            UserFactory.GetAllSBU().success(function (data) {
                angular.forEach(data, function (value, key) {
                    if (value.SBU != 'All') {
                        $scope.SBUList.push(value);
                    }
                });
            }).error(function (error) {
                $scope.Error = error;
            });
        };

        $scope.RefreshRegion = function (sbuid, rowIndex) {
            if (sbuid != '') {
                OppFactory.GetAllCountry().success(function (data) {
                    var collection = [];
                    angular.forEach(data, function (value, key) {
                        if (value.SBUId == sbuid) {
                            collection.push(value);
                        }
                    });
                    $scope.RegionCollection.splice(rowIndex, 0, collection);
                }).error(function (error) {
                    $scope.Error = error;
                });
            }
        };

        $scope.GetAllLOBList = function () {
            priceService.GetAllLOBList().success(function (data) {
                $scope.LOBList = data;
                $scope.LOBList.splice(0, 1);
                $scope.LOBList.splice(2, 1);
                $scope.LOBList.splice(3, 1);
            }).error(function (error) {
                $scope.Error = error;
            })
        };




        $scope.GetResourceYear = function (row) {
            try {
                $scope.ResourceRowChanged('Modify', row);
                var resourceInfo = $scope.ResourcingData[row];
                if (resourceInfo.Unit != undefined && resourceInfo.UnitRate != 0 &&
                    (resourceInfo.UnitCount1 != 0 || resourceInfo.UnitCount2 != 0 || resourceInfo.UnitCount3 != 0 || resourceInfo.UnitCount4 != 0 || resourceInfo.UnitCount5 != 0) &&
                    (resourceInfo.HeadCount1 != 0 || resourceInfo.HeadCount2 != 0 || resourceInfo.HeadCount3 != 0 || resourceInfo.HeadCount4 != 0 || resourceInfo.HeadCount5 != 0)) {

                    console.log('Calculating year..');
                    var uc = 0;
                    var hike = OppConfig.SalaryHike;
                    var penalty = OppConfig.Penalty;
                    var spike = OppConfig.SalarySpike;
                    var margin = (resourceInfo.Margin == undefined || resourceInfo.Margin == null || resourceInfo.Margin == '') ? OppConfig.Margin : resourceInfo.Margin;
                    var headCount = 0;
                    var multiplier = 0;
                    var maxDur = 0;
                    var withHike = 0;
                    var withSpike = 0;
                    var withPenalty = 0;
                    var withMargin = 0;
                    var unitCountArray = [];
                    var fromYear = 0;
                    var yearCount = 0;

                    if (resourceInfo.HeadCount1 != 0) {
                        headCount = resourceInfo.HeadCount1;
                        fromYear = 1;
                        yearCount = 5;
                    }
                    else if (resourceInfo.HeadCount2 != 0) {
                        headCount = resourceInfo.HeadCount2;
                        fromYear = 2;
                        yearCount = 4;
                    }
                    else if (resourceInfo.HeadCount3 != 0) {
                        headCount = resourceInfo.HeadCount3;
                        fromYear = 3;
                        yearCount = 3;
                    }
                    else if (resourceInfo.HeadCount4 != 0) {
                        headCount = resourceInfo.HeadCount4;
                        fromYear = 4;
                        yearCount = 2;
                    }
                    else if (resourceInfo.HeadCount5 != 0) {
                        headCount = resourceInfo.HeadCount5;
                        fromYear = 5;
                        yearCount = 1;
                    }

                    switch (resourceInfo.Unit) {
                        case 'Hour':
                            multiplier = 0.125; // 1 hour = 1/8 days
                            maxDur = 2016;
                            break;
                        case 'Month':
                            multiplier = 21; // 1 month = 21 days
                            maxDur = 12;
                            break;
                        case 'Year':
                            multiplier = 252; // 1 year = 252 days
                            maxDur = 1;
                            break;
                        default:
                            break;
                    }
                    console.log('Filling up unitcount for years..');

                    if (multiplier > 0) {

                        var temp = {};
                        temp.Duration1 = resourceInfo.UnitCount1;
                        temp.Duration2 = resourceInfo.UnitCount2;
                        temp.Duration3 = resourceInfo.UnitCount3;
                        temp.Duration4 = resourceInfo.UnitCount4;
                        temp.Duration5 = resourceInfo.UnitCount5;

                        for (var c = 1; c <= 5; c++) {
                            var ucYearCurr = 'Duration' + c;
                            var ucYearNext = 'Duration' + (c + 1);

                            if (c < 5 && temp[ucYearCurr] > maxDur) {
                                temp[ucYearNext] += (temp[ucYearCurr] - maxDur);
                                temp[ucYearCurr] = maxDur;
                            }
                        }

                        var ucLength = 0;
                        for (var c = 1; c <= 5; c++) {
                            var dur = 'Duration' + c;
                            if (temp[dur] > 0)
                                ucLength++;
                        }

                        console.log('Final Calculations..');
                        var j = 0;
                        for (var inx = 0; inx < 5; inx++) {
                            var year = 'Year' + (inx + 1);
                            var prevyear = 'Year' + inx;
                            var penaltyYear = 'PenaltyYear' + (inx + 1);
                            var overhearYear = 'OverheadYear' + (inx + 1);
                            var marginYear = 'MarginYear' + (inx + 1);
                            var durYear = 'Duration' + (inx + 1);

                            if (inx < fromYear - 1) {
                                resourceInfo[year] = 0;
                            }
                            else {
                                if (inx == fromYear - 1 && j == 0) //First year is calculated without Hike
                                {
                                    var baseValY1 = (resourceInfo.UnitRate / multiplier) * (temp[durYear] * multiplier) * headCount;
                                    withPenalty = 0;
                                    withSpike = 0;

                                    if (baseValY1 > 0) {
                                        withPenalty = baseValY1 * penalty / 100;
                                        withSpike = baseValY1 * spike / 100;
                                    }
                                    resourceInfo[year] = baseValY1;
                                    resourceInfo[penaltyYear] = withPenalty;
                                    resourceInfo[overhearYear] = withSpike;
                                    resourceInfo[marginYear] = (resourceInfo[year] / (1 - (margin / 100))) + withPenalty + withSpike;
                                    //resourceInfo[durYear] = unitCountArray[j];
                                    j++;
                                }
                                else if (j < ucLength) {
                                    withHike = 0;
                                    withPenalty = 0;
                                    withSpike = 0;
                                    //var baseval = (resourceInfo[prevyear]/multiplier) * resourceInfo[durYear];
                                    var baseval = ((resourceInfo.UnitRate / multiplier) * (temp[durYear] * multiplier) * (1 + (hike / 100))) * headCount;
                                    if (baseval > 0) {
                                        //withHike = baseval * hike / 100;
                                        withPenalty = baseval * penalty / 100;
                                        withSpike = baseval * spike / 100;
                                    }
                                    resourceInfo[year] = baseval;
                                    resourceInfo[penaltyYear] = withPenalty;
                                    resourceInfo[overhearYear] = withSpike;
                                    resourceInfo[marginYear] = (resourceInfo[year] / (1 - (margin / 100))) + withPenalty + withSpike;
                                    //resourceInfo[durYear] = unitCountArray[j];
                                    j++;
                                }
                            }
                        }
                        $scope.ResourcingData[row] = resourceInfo;
                        $scope.resourceGrid.api.refreshView();
                    }
                }
            }
            catch (ex) {
                console.log('Error occurred when calculating Year value: ' + ex);
            }
        }

        $scope.AddResourceRow = function () {

            angular.element(document.getElementById('btnaddResource'))[0].disabled = true;
            angular.element(document.querySelector('#loader')).removeClass('hide');
            var selectedRows = $scope.resourceGrid.api.getSelectedNodes();
            var curentId = 0;
            if ($scope.resourceGrid.rowData.length == 0) {
                curentId = 1;
            }
            else {
                maxindex = $scope.resourceGrid.rowData.length - 1;
                var curentId = $scope.resourceGrid.rowData[maxindex].RowNo + 1;
            }

            if (selectedRows.length > 0) {
                var alterrows = selectedRows[0].childIndex + 1;
                var newid = alterrows + 1;

                $scope.RefreshRegion($scope.OppDetail.SBUId, newid - 1);
                $scope.ResourcingData.splice(alterrows, 0, {
                    'RowNo': newid,
                    'OppId': $scope.OppDetail.OppId,
                    'LOB': $scope.ResourcingData[newid - 2].LOB,
                    'SBU': $scope.ResourcingData[newid - 2].SBU,
                    'Region': $scope.ResourcingData[newid - 2].Region,
                    'ResourceType': '',
                    'Experience': 0,
                    'Unit': '',
                    'UnitRate': 0,
                    'UnitCount1': 0,
                    'UnitCount2': 0,
                    'UnitCount3': 0,
                    'UnitCount4': 0,
                    'UnitCount5': 0,
                    'HeadCount1': 0,
                    'HeadCount2': 0,
                    'HeadCount3': 0,
                    'HeadCount4': 0,
                    'HeadCount5': 0,
                    'Year1': 0,
                    'Year2': 0,
                    'Year3': 0,
                    'Year4': 0,
                    'Year5': 0,
                    Margin: OppConfig.Margin
                });

                for (alterrows; alterrows < $scope.resourceGrid.rowData.length; alterrows++) {
                    $scope.ResourcingData[alterrows].RowNo = alterrows + 1;
                }
                $scope.ResourceRowChanged('Add', newid - 1);
            }
            else {
                $scope.RefreshRegion($scope.OppDetail.SBUId, curentId - 1);
                $scope.ResourcingData.push({
                    'RowNo': curentId,
                    'OppId': $scope.OppDetail.OppId,
                    'LOB': '',
                    'SBU': $scope.OppDetail.SBUId,
                    'Region': $scope.OppDetail.CountryId,
                    'ResourceType': '',
                    'Experience': 0,
                    'Unit': '',
                    'UnitRate': 0,
                    'UnitCount1': 0,
                    'UnitCount2': 0,
                    'UnitCount3': 0,
                    'UnitCount4': 0,
                    'UnitCount5': 0,
                    'HeadCount1': 0,
                    'HeadCount2': 0,
                    'HeadCount3': 0,
                    'HeadCount4': 0,
                    'HeadCount5': 0,
                    'Year1': 0,
                    'Year2': 0,
                    'Year3': 0,
                    'Year4': 0,
                    'Year5': 0,
                    Margin: OppConfig.Margin
                });
                $scope.ResourceRowChanged('Add', curentId - 1);
            }
            $scope.resourceGrid.rowData = $scope.ResourcingData;
            $scope.resourceGrid.api.setRowData($scope.ResourcingData);
            $timeout(function () {
                $scope.resourceGrid.api.refreshView();
            }, 500);


            $timeout(function () {
                angular.element(document.querySelector('#loader')).addClass('hide');
            }, 500);

            angular.element(document.getElementById('btnaddResource'))[0].disabled = false;
        }

        $scope.DeleteResourceRow = function () {
            angular.element(document.querySelector('#loader')).removeClass('hide');

            var selected = $scope.resourceGrid.api.getFocusedCell();
            if (selected == null) {
                toaster.pop('error', "Error", 'Please select row to delete', null);
            }
            else {
                $scope.ResourcingData.splice(selected.rowIndex, 1);
                toaster.pop('success', "Success", 'Row ' + (parseFloat(selected.rowIndex) + 1) + ' deleted successfully', null);
                var alterrows = selected.rowIndex;
                $scope.ResourceRowChanged('Delete', alterrows);
                for (alterrows; alterrows < $scope.resourceGrid.rowData.length; alterrows++) {
                    $scope.ResourcingData[alterrows].RowNo = alterrows + 1;
                }
                $scope.resourceGrid.api.setRowData($scope.ResourcingData);
                $scope.resourceGrid.rowData = $scope.ResourcingData;
            }
            $timeout(function () {
                angular.element(document.querySelector('#loader')).addClass('hide');
            }, 500);
        }

        $scope.GetTandEPSValues = function (row) {
            try {
                var stinfo = $scope.TandEPSData[row];

                if (stinfo.AvgTravel != undefined && stinfo.AvgTravel != '' &&
                    stinfo.StaysOnsite != undefined && stinfo.StaysOnsite != '') {

                    console.log('Calculating stay & travel..');

                    stinfo.OnsitePercent = stinfo.ChangeOnsitePercentTo == '' ? stinfo.OnsitePercent : stinfo.ChangeOnsitePercentTo;

                    stinfo.OnsiteBusinessDays = Math.ceil((stinfo.ResourceCount == 0 ? 0 : (stinfo.ManDays / stinfo.ResourceCount) * (stinfo.OnsitePercent / 100)));
                    stinfo.EffectiveBusinessDays = (stinfo.OnsiteBusinessDays > 5 ? Math.ceil(Math.ceil(stinfo.OnsiteBusinessDays / 5) * 2 + stinfo.OnsiteBusinessDays) : stinfo.OnsiteBusinessDays);
                    stinfo.TravelManDays = ((stinfo.OnsitePercent > 0 && stinfo.ManDays > 0 && stinfo.StaysOnsite == "N") ? (stinfo.AvgTravel * 2 * stinfo.ResourceCount) : 0);
                    stinfo.Visa = stinfo.OnsitePercent > 0 ? (stinfo.StaysOnsite == "N" ? (stinfo.AvgTravel * (OppConfig.Visa != undefined ? OppConfig.Visa : 0) * ((stinfo.ChangeResourceCountTo != '') ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount)) : 0) : 0;
                    stinfo.AirFare = stinfo.OnsitePercent > 0 ? (stinfo.StaysOnsite == "N" ? (stinfo.AvgTravel * (OppConfig.AirFare != undefined ? OppConfig.AirFare : 0) * ((stinfo.ChangeResourceCountTo != '') ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount)) : 0) : 0;
                    stinfo.Accomodation = stinfo.EffectiveBusinessDays * (OppConfig.Accommodation != undefined ? OppConfig.Accommodation : 0) * ((stinfo.ChangeResourceCountTo != '') ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                    stinfo.PerDiem = stinfo.EffectiveBusinessDays * (OppConfig.PerDiemLaundry != undefined ? OppConfig.PerDiemLaundry : 0) * ((stinfo.ChangeResourceCountTo != '') ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                    stinfo.LocalConveyance = stinfo.EffectiveBusinessDays * (OppConfig.LocalConveyance != undefined ? OppConfig.LocalConveyance : 0) * ((stinfo.ChangeResourceCountTo != '') ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                    stinfo.Misc = stinfo.EffectiveBusinessDays * (OppConfig.Miscellaneous != undefined ? OppConfig.Miscellaneous : 0) * ((stinfo.ChangeResourceCountTo != '') ? stinfo.ChangeResourceCountTo : stinfo.ResourceCount);
                    stinfo.Total = stinfo.Visa + stinfo.AirFare + stinfo.Accomodation + stinfo.PerDiem + stinfo.LocalConveyance + stinfo.Misc;

                    totalrowPS[0].OnsiteBusinessDays = 0;
                    totalrowPS[0].EffectiveBusinessDays = 0;
                    totalrowPS[0].TravelManDays = 0;
                    totalrowPS[0].Visa = 0;
                    totalrowPS[0].AirFare = 0;
                    totalrowPS[0].Accomodation = 0;
                    totalrowPS[0].PerDiem = 0;
                    totalrowPS[0].LocalConveyance = 0;
                    totalrowPS[0].Misc = 0;
                    totalrowPS[0].Total = 0;

                    for (var i = 0; i < $scope.TandEPSData.length; i++) {
                        var sti = $scope.TandEPSData[i];
                        totalrowPS[0].OnsiteBusinessDays += sti.OnsiteBusinessDays;
                        totalrowPS[0].EffectiveBusinessDays += sti.EffectiveBusinessDays;
                        totalrowPS[0].TravelManDays += sti.TravelManDays;
                        totalrowPS[0].Visa += sti.Visa;
                        totalrowPS[0].AirFare += sti.AirFare;
                        totalrowPS[0].Accomodation += sti.Accomodation;
                        totalrowPS[0].PerDiem += sti.PerDiem;
                        totalrowPS[0].LocalConveyance += sti.LocalConveyance;
                        totalrowPS[0].Misc += sti.Misc;
                        totalrowPS[0].Total += sti.Total;
                    }

                    $scope.TandEPSData[row] = stinfo;


                    $scope.TandEPSData = $scope.TandEPSData;

                    getcalculatedEffortgriddata();
                    setcalculatedeffortsonly();

                    //Niranjana api

                    $scope.tandEPSGrd.api.refreshView();
                }
            }
            catch (ex) {
                console.log('Error occurred when calculating Year value: ' + ex);
            }
        }

        $scope.GetTandEResourceValues = function (row) {
            try {
                var stinfo = $scope.TandEResourceData[row];
                totalrowResource = [{}];


                console.log('Calculating t & e..');

                for (var i = 1; i <= 5; i++) {

                    var multiplier = 0;
                    switch (stinfo.Unit) {
                        case 'Hour':
                            multiplier = 1 / 8;
                            maxDur = 2016;
                            break;
                        case 'Month':
                            multiplier = 21;
                            maxDur = 12;
                            break;
                        case 'Year':
                            multiplier = 252;
                            maxDur = 1;
                            break;
                        default:
                            break;
                    }

                    var temp = {};
                    temp.Duration1 = stinfo.UnitCount1;
                    temp.Duration2 = stinfo.UnitCount2;
                    temp.Duration3 = stinfo.UnitCount3;
                    temp.Duration4 = stinfo.UnitCount4;
                    temp.Duration5 = stinfo.UnitCount5;
                    temp.ResourceCount = 0;


                    for (var c = 1; c <= 5; c++) {
                        var ucYearCurr = 'Duration' + c;
                        var ucYearNext = 'Duration' + (c + 1);
                        var resC = 'ResourceCount' + c;

                        if (c < 5 && temp[ucYearCurr] > maxDur) {
                            temp[ucYearNext] += (temp[ucYearCurr] - maxDur);
                            temp[ucYearCurr] = maxDur;
                        }
                        if (stinfo[resC] > 0)
                            temp.ResourceCount = stinfo[resC];
                    }

                    var mandays = 'ManDays' + i;
                    var avgTravel = 'AvgTravel' + i;
                    var onsiteBusinessDays = 'OnsiteBusinessDays' + i;
                    var effectiveBusinessDays = 'EffectiveBusinessDays' + i;
                    var travelManDays = 'TravelManDays' + i;
                    var visa = 'Visa' + i;
                    var airFare = 'AirFare' + i;
                    var accomodation = 'Accomodation' + i;
                    var perDiem = 'PerDiem' + i;
                    var localConveyance = 'LocalConveyance' + i;
                    var misc = 'Misc' + i;
                    var total = 'Total' + i;
                    var resourceCount = 'ResourceCount' + i;
                    var unitCount = 'UnitCount' + i;
                    var onsitePercent = 'OnsitePercent' + i;
                    var changeResourceCountTo = 'ChangeResourceCountTo' + i;
                    var tempCount = 'Duration' + i;

                    stinfo[mandays] = multiplier * temp[tempCount]; //TODO: check !!

                    stinfo[onsiteBusinessDays] = Math.ceil((temp.ResourceCount == 0 ? 0 : (stinfo[mandays] / temp.ResourceCount) * (stinfo[onsitePercent] / 100)));
                    stinfo[effectiveBusinessDays] = (stinfo[onsiteBusinessDays] > 5 ? Math.ceil(Math.ceil(stinfo[onsiteBusinessDays] / 5) * 2 + stinfo[onsiteBusinessDays]) : stinfo[onsiteBusinessDays]);
                    stinfo[travelManDays] = ((stinfo[onsitePercent] > 0 && stinfo[mandays] > 0) ? (stinfo[avgTravel] * 2 * temp.ResourceCount) : 0);
                    stinfo[visa] = stinfo[onsitePercent] > 0 ? stinfo[avgTravel] * (OppConfig.Visa != undefined ? OppConfig.Visa : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : temp.ResourceCount) : 0;
                    stinfo[airFare] = stinfo[onsitePercent] > 0 ? stinfo[avgTravel] * (OppConfig.AirFare != undefined ? OppConfig.AirFare : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : temp.ResourceCount) : 0;
                    stinfo[accomodation] = stinfo[effectiveBusinessDays] * (OppConfig.Accommodation != undefined ? OppConfig.Accommodation : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : temp.ResourceCount);
                    stinfo[perDiem] = stinfo[effectiveBusinessDays] * (OppConfig.PerDiemLaundry != undefined ? OppConfig.PerDiemLaundry : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : temp.ResourceCount);
                    stinfo[localConveyance] = stinfo[effectiveBusinessDays] * (OppConfig.LocalConveyance != undefined ? OppConfig.LocalConveyance : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : temp.ResourceCount);
                    stinfo[misc] = stinfo[effectiveBusinessDays] * (OppConfig.Miscellaneous != undefined ? OppConfig.Miscellaneous : 0) * ((stinfo[changeResourceCountTo] > 0) ? stinfo[changeResourceCountTo] : temp.ResourceCount);
                    stinfo[total] = stinfo[visa] + stinfo[airFare] + stinfo[accomodation] + stinfo[perDiem] + stinfo[localConveyance] + stinfo[misc];

                    totalrowResource[0].RowNo = '';
                    totalrowResource[0].Description = 'TOTAL';
                    totalrowResource[0][unitCount] = '';
                    totalrowResource[0][resourceCount] = '';
                    totalrowResource[0][changeResourceCountTo] = '';
                    totalrowResource[0][onsitePercent] = '';
                    totalrowResource[0][avgTravel] = '';
                    totalrowResource[0][onsiteBusinessDays] = 0;
                    totalrowResource[0][effectiveBusinessDays] = 0;
                    totalrowResource[0][travelManDays] = 0;
                    totalrowResource[0][visa] = 0;
                    totalrowResource[0][airFare] = 0;
                    totalrowResource[0][accomodation] = 0;
                    totalrowResource[0][perDiem] = 0;
                    totalrowResource[0][localConveyance] = 0;
                    totalrowResource[0][misc] = 0;
                    totalrowResource[0][total] = 0;

                    for (var j = 0; j < $scope.TandEResourceData.length; j++) {
                        var sti = $scope.TandEResourceData[j];

                        totalrowResource[0][onsiteBusinessDays] += sti[onsiteBusinessDays];
                        totalrowResource[0][effectiveBusinessDays] += sti[effectiveBusinessDays];
                        totalrowResource[0][travelManDays] += sti[travelManDays];
                        totalrowResource[0][visa] += sti[visa];
                        totalrowResource[0][airFare] += sti[airFare];
                        totalrowResource[0][accomodation] += sti[accomodation];
                        totalrowResource[0][perDiem] += sti[perDiem];
                        totalrowResource[0][localConveyance] += sti[localConveyance];
                        totalrowResource[0][misc] += sti[misc];
                        totalrowResource[0][total] += sti[total];
                    }
                }

                $scope.TandEResourceData[row] = stinfo;
                $scope.tandEResourceGrid.api.setFloatingBottomRowData(totalrowResource);
                $scope.tandEResourceGrid.api.refreshView();
                //}
            }
            catch (ex) {
                console.log('Error occurred when calculating Year value: ' + ex);
            }
        }

        //------------Functions-------------------//

        function redirectRefreshPage_TandEResource(oppId, groupId) {
            $location.path("TandEResource/" + oppId + "/" + groupId);
        }

        function ValidateTandEResourceData() {
            for (var j = 0; j < $scope.TandEResourceData.length; j++) {
                try {
                    if ($scope.TandEResourceData[j].ManDays > 0 && $scope.TandEResourceData[j].ResourceCount > 0) {
                        if ($scope.TandEResourceData[j].ChangeResourceCountTo == '') {
                            toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEResourceData[j].RowNo + ' is incomplete!', null);
                            return false;
                        }
                        if ($scope.TandEResourceData[j].AvgTravel == '') {
                            toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEResourceData[j].RowNo + ' is incomplete!', null);
                            return false;
                        }
                        if ($scope.TandEResourceData[j].StaysOnsite == '') {
                            toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEResourceData[j].RowNo + ' is incomplete!', null);
                            return false;
                        }
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
            }
            return true;
        }

        function AddSheetInternalcall_TandEResource(Jsondata) {
            TandEResourceService.AddTandEResource(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.isEditClicked = false;

                    //j   if ($scope.IsLeavingTandEResource)
                    //j       redirectRefreshPage_TandEResource($routeParams.OppId, $routeParams.GroupId)
                    //j   else {
                    //j      $window.location.href = $scope.newnavigateURl;
                    //j    }
                    toaster.pop('success', "Save", 'TandEResource Sheet Saved Successfully', 3000);
                    return true;
                }
                else {

                    toaster.pop('error', "Error", data.Error, null);
                }

            }).error(function (error) {
                console.log("failure message: " + JSON.stringify(error));
            });
        }

        function ValidateResourceData() {
            for (var j = 0; j < $scope.ResourcingData.length; j++) {
                try {
                    if ($scope.ResourcingData[j].LOB == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' is incomplete!', null);
                        return false;
                    }
                    if ($scope.ResourcingData[j].SBU == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' is incomplete!', null);
                        return false;
                    }
                    if ($scope.ResourcingData[j].Unit == '') {
                        toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' is incomplete!', null);
                        return false;
                    }
                    else {
                        switch ($scope.ResourcingData[j].Unit) {
                            case 'Hour':
                                if ($scope.ResourcingData[j].UnitCount5 > 2016) { // 1 yr = 252 * 8 = 2016
                                    toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' has invalid Duration!', null);
                                    return false;
                                }
                                break;
                            case 'Month':
                                if ($scope.ResourcingData[j].UnitCount5 > 12) {
                                    toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' has invalid Duration!', null);
                                    return false;
                                }
                                break;
                            case 'Year':
                                if ($scope.ResourcingData[j].UnitCount5 > 1) {
                                    toaster.pop('warning', "Warning", 'The Row ' + $scope.ResourcingData[j].RowNo + ' has invalid Duration!', null);
                                    return false;
                                }
                                break;
                        }
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
            }
            return true;
        }

        function AddSheetInternalcall_Resource(Jsondata) {
            ResourceService.AddResource(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.isEditClicked = false;

                    //j      if ($scope.IsLeavingResource)
                    //j          redirectRefreshPage_Resource($routeParams.OppId, $routeParams.GroupId)
                    //j       else {
                    //j       $window.location.href = $scope.newnavigateURl;
                    //j     }
                    toaster.pop('success', "Save", 'Resource Sheet Saved Successfully', 3000);
                    return true;
                }
                else {

                    toaster.pop('error', "Error", data.Error, null);
                }

            }).error(function (error) {
                console.log("failure message: " + JSON.stringify(error));
            });
        }

        function redirectRefreshPage_TandEPS(oppId, groupId) {
            $location.path("TandEPS/" + oppId + "/" + groupId);
        }

        function ValidateTandEPSData() {
            for (var j = 0; j < $scope.TandEPSData.length; j++) {
                try {
                    if ($scope.TandEPSData[j].ManDays > 0 && $scope.TandEPSData[j].ResourceCount > 0) {
                        if ($scope.TandEPSData[j].AvgTravel == '') {
                            toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEPSData[j].RowNo + ' is incomplete!', null);
                            return false;
                        }
                        if ($scope.TandEPSData[j].StaysOnsite == '') {
                            toaster.pop('warning', "Warning", 'The Row ' + $scope.TandEPSData[j].RowNo + ' is incomplete!', null);
                            return false;
                        }
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
            }
            return true;
        }

        function AddSheetInternalcall_TandEPS(Jsondata) {
            TandEPSService.AddTandEPS(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.isEditClicked = false;

                    //j     if ($scope.IsLeavingTandEPS)
                    //j        redirectRefreshPage_TandEPS($routeParams.OppId, $routeParams.GroupId)
                    //j     else {
                    //j        $window.location.href = $scope.newnavigateURl;
                    //j   }
                    toaster.pop('success', "Save", 'TandEPS Sheet Saved Successfully', 3000);
                    return true;
                }
                else {

                    toaster.pop('error', "Error", data.Error, null);
                }

            }).error(function (error) {
                console.log("failure message: " + JSON.stringify(error));
            });
        }
        //------------Initialization Calls----------//


        $scope.InitResoucreApiCalls = function () {
            $scope.GetAllLOBList();
            $scope.GetAllSBU();

            //$scope.GetOpportunityListResourcing($routeParams.OppId);
        }

        $scope.GetDiscount = function (SBUID, CountryId) {
            ProjectMarginAdminFactory.GetAllProjectMarginAdmin().success(function (data) {
                $scope.TempDiscount = [];
                if (SBUID != null && SBUID != undefined && CountryId != null && CountryId != undefined) {
                    for (var i = 0; i < data.length; i++) {
                        if (parseInt(data[i].SBUID) == SBUID && parseInt(data[i].RegionId) == CountryId) {
                            $scope.TempDiscount.push(data[i]);
                        }
                    }
                    console.log($scope.TempDiscount);
                    if ($scope.TempDiscount.length > 0) {
                        ProcessProjectMarginDiscount($scope.TempDiscount);
                    }

                }
            }).error(function (error) {
                $scope.Error = error;
            });
        }

        function ProcessProjectMarginDiscount(data) {

            $scope.ColorValues = [];
            $scope.ColorValues['TRADING'] = $scope.ColorValues['MAINTANACE'] = $scope.ColorValues['IP'] =
                $scope.ColorValues['HOSTED'] = $scope.ColorValues['PS'] =
                $scope.ColorValues['RESOURCING'] = $scope.ColorValues['CONSULTING'] = 'Nocolor';

            if ($scope.margin.TRADING != 0) {

                var trade = _.where(data, { LOBName: "TRADING" })
                if (trade.length > 0) {
                    if ($scope.margin.TRADING <= trade[0].DefaultVal && $scope.margin.TRADING > trade[0].Level1) {
                        $scope.ColorValues['TRADING'] = "PMgreat";
                    }
                    else if ($scope.margin.TRADING <= trade[0].Level1 && $scope.margin.TRADING > trade[0].Level2) {
                        $scope.ColorValues['TRADING'] = "PMLevel1";
                    }
                    else if ($scope.margin.TRADING <= trade[0].Level2 && $scope.margin.TRADING > trade[0].Level3) {
                        $scope.ColorValues['TRADING'] = "PMLevel2";
                    }
                    else if ($scope.margin.TRADING <= trade[0].Level3 && $scope.margin.TRADING > 0) {
                        $scope.ColorValues['TRADING'] = "PMLevel3";
                    }
                }
            }
            else
                $scope.ColorValues['TRADING'] = 'Nocolor';


            if ($scope.margin.MAINTANACE != 0) {
                var maintenance = _.where(data, { LOBName: "MAINTANACE" })
                if (maintenance.length > 0) {
                    if ($scope.margin.MAINTANACE <= maintenance[0].DefaultVal && $scope.margin.MAINTANACE > maintenance[0].Level1) {
                        $scope.ColorValues['MAINTANACE'] = "PMgreat";
                    }
                    else if ($scope.margin.MAINTANACE <= maintenance[0].Level1 && $scope.margin.MAINTANACE > maintenance[0].Level2) {
                        $scope.ColorValues['MAINTANACE'] = "PMLevel1";
                    }
                    else if ($scope.margin.MAINTANACE <= maintenance[0].Level2 && $scope.margin.MAINTANACE > maintenance[0].Level3) {
                        $scope.ColorValues['MAINTANACE'] = "PMLevel2";
                    }
                    else if ($scope.margin.MAINTANACE <= maintenance[0].Level3 && $scope.margin.MAINTANACE > 0) {
                        $scope.ColorValues['MAINTANACE'] = "PMLevel3";
                    }
                }
            }
            else
                $scope.ColorValues['MAINTANACE'] = 'Nocolor';


            if ($scope.margin.IP != 0) {
                var ip = _.where(data, { LOBName: "IP" })
                if (ip.length > 0) {
                    if ($scope.margin.IP <= ip[0].DefaultVal && $scope.margin.IP > ip[0].Level1) {
                        $scope.ColorValues['IP'] = "PMgreat";
                    }
                    else if ($scope.margin.IP <= ip[0].Level1 && $scope.margin.IP > ip[0].Level2) {
                        $scope.ColorValues['IP'] = "PMLevel1";
                    }
                    else if ($scope.margin.IP <= ip[0].Level2 && $scope.margin.IP > ip[0].Level3) {
                        $scope.ColorValues['IP'] = "PMLevel2";
                    }
                    else if ($scope.margin.IP <= ip[0].Level3 && $scope.margin.IP > 0) {
                        $scope.ColorValues['IP'] = "PMLevel3";
                    }
                }
            }
            else
                $scope.ColorValues['IP'] = 'Nocolor';



            if ($scope.margin.HOSTED != 0) {
                var hosted = _.where(data, { LOBName: "HOSTED" })
                if (hosted.length > 0) {
                    if ($scope.margin.HOSTED <= hosted[0].DefaultVal && $scope.margin.HOSTED > hosted[0].Level1) {
                        $scope.ColorValues['HOSTED'] = "PMgreat";
                    }
                    else if ($scope.margin.HOSTED <= hosted[0].Level1 && $scope.margin.HOSTED > hosted[0].Level2) {
                        $scope.ColorValues['HOSTED'] = "PMLevel1";
                    }
                    else if ($scope.margin.HOSTED <= hosted[0].Level2 && $scope.margin.HOSTED > hosted[0].Level3) {
                        $scope.ColorValues['HOSTED'] = "PMLevel2";
                    }
                    else if ($scope.margin.HOSTED <= hosted[0].Level3 && $scope.margin.HOSTED > 0) {
                        $scope.ColorValues['HOSTED'] = "PMLevel3";
                    }
                }
            }
            else
                $scope.ColorValues['HOSTED'] = 'Nocolor';



            if ($scope.margin.PS != 0) {
                var ps = _.where(data, { LOBName: "PS" })
                if (ps.length > 0) {
                    if ($scope.margin.PS <= ps[0].DefaultVal && $scope.margin.PS > ps[0].Level1) {
                        $scope.ColorValues['PS'] = "PMgreat";
                    }
                    else if ($scope.margin.PS <= ps[0].Level1 && $scope.margin.PS > ps[0].Level2) {
                        $scope.ColorValues['PS'] = "PMLevel1";
                    }
                    else if ($scope.margin.PS <= ps[0].Level2 && $scope.margin.PS > ps[0].Level3) {
                        $scope.ColorValues['PS'] = "PMLevel2";
                    }
                    else if ($scope.margin.PS <= ps[0].Level3 && $scope.margin.PS > 0) {
                        $scope.ColorValues['PS'] = "PMLevel3";
                    }
                }
            }
            else
                $scope.ColorValues['PS'] = 'Nocolor';


            if ($scope.margin.RESOURCING != 0) {
                var resource = _.where(data, { LOBName: "RESOURCING" })
                if (resource.length > 0) {
                    if ($scope.margin.RESOURCING <= resource[0].DefaultVal && $scope.margin.RESOURCING > resource[0].Level1) {
                        $scope.ColorValues['RESOURCING'] = "PMgreat";
                    }
                    else if ($scope.margin.RESOURCING <= resource[0].Level1 && $scope.margin.RESOURCING > resource[0].Level2) {
                        $scope.ColorValues['RESOURCING'] = "PMLevel1";
                    }
                    else if ($scope.margin.RESOURCING <= resource[0].Level2 && $scope.margin.RESOURCING > resource[0].Level3) {
                        $scope.ColorValues['RESOURCING'] = "PMLevel2";
                    }
                    else if ($scope.margin.RESOURCING <= resource[0].Level3 && $scope.margin.RESOURCING > 0) {
                        $scope.ColorValues['TRADING'] = "PMLevel3";
                    }
                }
            }
            else
                $scope.ColorValues['RESOURCING'] = 'Nocolor';



            if ($scope.margin.CONSULTING != 0) {
                var consulting = _.where(data, { LOBName: "CONSULTING" })
                if (consulting.length > 0) {
                    if ($scope.margin.CONSULTING <= consulting[0].DefaultVal && $scope.margin.CONSULTING > consulting[0].Level1) {
                        $scope.ColorValues['TRADING'] = "PMgreat";
                    }
                    else if ($scope.margin.CONSULTING <= consulting[0].Level1 && $scope.margin.CONSULTING > consulting[0].Level2) {
                        $scope.ColorValues['TRADING'] = "PMLevel1";
                    }
                    else if ($scope.margin.CONSULTING <= consulting[0].Level2 && $scope.margin.CONSULTING > consulting[0].Level3) {
                        $scope.ColorValues['TRADING'] = "PMLevel2";
                    }
                    else if ($scope.margin.CONSULTING <= consulting[0].Level3 && $scope.margin.CONSULTING > 0) {
                        $scope.ColorValues['TRADING'] = "PMLevel3";
                    }
                }
            }
            else
                $scope.ColorValues['CONSULTING'] = 'Nocolor';


        }


        $scope.InitResoucreApiCalls();

        $scope.PutComma = function (x) {
            return res = $filter('number')(x, 2);
        }

    }]);
