ReportApp.controller('EstimationController', function ($scope, $rootScope) {
    $scope.grideditable = true;
    var columnDefs = [
        {
            headerName: "Resource Type", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },
        {
            headerName: "YOE", field: 'ServionLegalEntity', width: 140, headerTooltip: "ServionLegal Entity",
        },
        {
            headerName: "Y0", field: "oem", width: 120, headerTooltip: "Vendor",

        },
        {
            headerName: 'Vendor / Servion - List / Transfer Price (USD)',
            groupId: "GroupA",
            headerTooltip: "List/Transfer Price",
            children: [
                {
                    headerName: "Y1", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                    },
                },
                {
                    headerName: "Y2", field: 'componenttype', width: 120, headerTooltip: "Component Type",
                },
                {
                    headerName: "Y3", field: 'ProductName', width: 120, headerTooltip: "Servion/Acqueon Product",
                },
                {
                    headerName: "Y4", field: "pricetype", width: 120, headerTooltip: "Price Type"
                },
                {
                    headerName: "Y5", field: "LTotal", width: 90, headerTooltip: "Total",
                    cellStyle: { 'background-color': '#CDCDCD' }

                },
                {
                    headerName: "Y6", field: "Lyear1", width: 90, columnGroupShow: 'open', editable: $scope.grideditable, headerTooltip: "Year1",
                },
                {
                    headerName: "Y7", field: "Lyear2", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year2",

                },


            ]
        },

        {
            headerName: 'Default Rate', field: "forvendordiscount", width: 130, editable: $scope.grideditable, cellRenderer: function (params) {
                if (params.node.floating != "bottom")
                    return '<span title=' + params.value + '>' + params.value + ' %</span>';
                else
                    return '<span title=' + params.value + '>' + params.value + ' </span>';

            },

        },
        {
            headerName: 'Unit Rate', field: "forvendordiscount", width: 130, editable: $scope.grideditable, cellRenderer: function (params) {
                if (params.node.floating != "bottom")
                    return '<span title=' + params.value + '>' + params.value + ' %</span>';
                else
                    return '<span title=' + params.value + '>' + params.value + ' </span>';

            },

        },

        {
            headerName: 'Yearly Resource Price',
            groupId: "GroupB",
            headerTooltip: "Vendor Offer Price(USD)",

            children: [{
                headerName: "Year 0", field: "OTotal", width: 90, headerTooltip: "Total",
            }, {
                    headerName: "Year 1", field: "Oyear1", columnGroupShow: 'open', width: 60,
                },
                {
                    headerName: "Year 2", field: "Oyear2", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Year 3", field: "Oyear3", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Year 4", field: "Oyear4", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Year 5", field: "Oyear5", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Year 6", field: "Oyear5", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Year 7", field: "Oyear5", columnGroupShow: 'open', width: 90,
                }]
        }

    ];

    //initialize Grid options
    $scope.gridOptions = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        rowHeight: 24,
        rowData: [],
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions1.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };


    $scope.grideditable = true;
    var columnDefs1 = [
        {
            headerName: "SDLC Stage", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },

        {
            headerName: 'Man Days',
            groupId: "GroupA",
            headerTooltip: "List/Transfer Price",
            children: [
                {
                    headerName: "Tool", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                    },
                },
                {
                    headerName: "Manual", field: 'componenttype', width: 120, headerTooltip: "Component Type",
                },
                {
                    headerName: "Extend", field: 'ProductName', width: 120, headerTooltip: "Servion/Acqueon Product",
                },
                {
                    headerName: "Total", field: "pricetype", width: 120, headerTooltip: "Price Type"
                },
                {
                    headerName: "Change 1", field: "LTotal", width: 90, headerTooltip: "Total",
                    cellStyle: { 'background-color': '#CDCDCD' }

                },
                {
                    headerName: "Change 2", field: "Lyear1", width: 90, columnGroupShow: 'open', editable: $scope.grideditable, headerTooltip: "Year1",
                },
                {
                    headerName: "Man Days", field: "Lyear2", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year2",

                },

            ]
        },

        {
            headerName: 'Business Days',
            groupId: "GroupB",
            headerTooltip: "Vendor Offer Price(USD)",

            children: [{
                headerName: "Resources", field: "OTotal", width: 90, headerTooltip: "Total",
            }, {
                    headerName: "Days", field: "Oyear1", columnGroupShow: 'open', width: 60,
                },
                {
                    headerName: "Change 1", field: "Oyear2", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Change 2", field: "Oyear3", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Business Days", field: "Oyear4", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "% Onsite", field: "Oyear5", columnGroupShow: 'open', width: 90,
                },
            ]
        }

    ];

    //initialize Grid options
    $scope.gridOptions1 = {
        angularCompileRows: true,
        columnDefs: columnDefs1,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        rowHeight: 24,
        rowData: [],
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions1.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };




    $scope.grideditable = true;
    var columnDefs2 = [
        {
            headerName: "Pricing By Resource Type", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },

        {
            headerName: 'BU %',
            groupId: "GroupA",
            headerTooltip: "List/Transfer Price",
            children: [
                {
                    headerName: "Tool", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                        return '<span title=' + params.value + '>' + params.value + '</span>';
                    },
                },
                {
                    headerName: "Manual", field: 'componenttype', width: 120, headerTooltip: "Component Type",
                },
                {
                    headerName: "Extend", field: 'ProductName', width: 120, headerTooltip: "Servion/Acqueon Product",
                },
                {
                    headerName: "Total", field: "pricetype", width: 120, headerTooltip: "Price Type"
                },
                {
                    headerName: "Change 1", field: "LTotal", width: 90, headerTooltip: "Total",
                    cellStyle: { 'background-color': '#CDCDCD' }

                },
                {
                    headerName: "Change 2", field: "Lyear1", width: 90, columnGroupShow: 'open', editable: $scope.grideditable, headerTooltip: "Year1",
                },
                {
                    headerName: "Man Days", field: "Lyear2", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year2",

                },

            ]
        },

        {
            headerName: 'CDO %',
            groupId: "GroupB",
            headerTooltip: "Vendor Offer Price(USD)",

            children: [{
                headerName: "Resources", field: "OTotal", width: 90, headerTooltip: "Total",
            }, {
                    headerName: "Days", field: "Oyear1", columnGroupShow: 'open', width: 60,
                },
                {
                    headerName: "Change 1", field: "Oyear2", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Change 2", field: "Oyear3", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Business Days", field: "Oyear4", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "% Onsite", field: "Oyear5", columnGroupShow: 'open', width: 90,
                },
            ]
        },

        {
            headerName: "Phases", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },
        {
            headerName: 'CDO %',
            groupId: "GroupB",
            headerTooltip: "Vendor Offer Price(USD)",

            children: [{
                headerName: "Resources", field: "OTotal", width: 90, headerTooltip: "Total",
            }, {
                    headerName: "Days", field: "Oyear1", columnGroupShow: 'open', width: 60,
                },
                {
                    headerName: "Change 1", field: "Oyear2", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Change 2", field: "Oyear3", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Business Days", field: "Oyear4", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "% Onsite", field: "Oyear5", columnGroupShow: 'open', width: 90,
                },
            ]
        }, {
            headerName: 'Man Days',
            groupId: "GroupB",
            headerTooltip: "Vendor Offer Price(USD)",

            children: [{
                headerName: "Resources", field: "OTotal", width: 90, headerTooltip: "Total",
            }, {
                    headerName: "Days", field: "Oyear1", columnGroupShow: 'open', width: 60,
                },
                {
                    headerName: "Change 1", field: "Oyear2", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Change 2", field: "Oyear3", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Business Days", field: "Oyear4", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "% Onsite", field: "Oyear5", columnGroupShow: 'open', width: 90,
                },
            ]
        },
        {
            headerName: 'Cost',
            groupId: "GroupB",
            headerTooltip: "Vendor Offer Price(USD)",

            children: [{
                headerName: "Resources", field: "OTotal", width: 90, headerTooltip: "Total",
            }, {
                    headerName: "Days", field: "Oyear1", columnGroupShow: 'open', width: 60,
                },
                {
                    headerName: "Change 1", field: "Oyear2", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Change 2", field: "Oyear3", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "Business Days", field: "Oyear4", columnGroupShow: 'open', width: 90,
                },
                {
                    headerName: "% Onsite", field: "Oyear5", columnGroupShow: 'open', width: 90,
                },
            ]
        },
    ];

    //initialize Grid options
    $scope.gridOptions2 = {
        angularCompileRows: true,
        columnDefs: columnDefs2,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        rowHeight: 24,
        rowData: [],
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions1.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };


    var columnDefs3 = [
        {
            headerName: "", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },
        {
            headerName: "REQ", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component"
        },
        {
            headerName: "Design", field: 'componenttype', width: 120, headerTooltip: "Component Type",
        },
        {
            headerName: "DevTest", field: 'ProductName', width: 120, headerTooltip: "Servion/Acqueon Product",
        },
        {
            headerName: "SysTest", field: "pricetype", width: 120, headerTooltip: "Price Type"
        },
        {
            headerName: "IMPL", field: "LTotal", width: 90, headerTooltip: "Total",
            cellStyle: { 'background-color': '#CDCDCD' }

        },
        {
            headerName: "UAT", field: "Lyear1", width: 90, columnGroupShow: 'open', editable: $scope.grideditable, headerTooltip: "Year1",
        },
        {
            headerName: "PROD", field: "Lyear2", columnGroupShow: 'open', width: 90, editable: $scope.grideditable, headerTooltip: "Year2",
        },
        {
            headerName: "Train", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },

        {
            headerName: "Manual", field: "Oyear5", columnGroupShow: 'open', width: 90,
        },

        {
            headerName: "O & H", field: "OTotal", width: 90, headerTooltip: "Total",
        }, {
            headerName: "SQA", field: "Oyear1", columnGroupShow: 'open', width: 60,
        },
        {
            headerName: "PM", field: "Oyear2", columnGroupShow: 'open', width: 90,
        },
        {
            headerName: "Total", field: "Oyear3", columnGroupShow: 'open', width: 90,
        }
    ];

    //initialize Grid options
    $scope.gridOptions3 = {
        angularCompileRows: true,
        columnDefs: columnDefs3,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        rowHeight: 24,
        rowData: [],
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions1.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };

    var columnDefs4 = [
        {
            headerName: "", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },

        {
            headerName: "Changed Man Days - Post Delivery Head Clearance - 1", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                return '<span title=' + params.value + '>' + params.value + '</span>';
            },
        },
        {
            headerName: "Changed Man Days - Post Delivery Head Clearance - 2", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                return '<span title=' + params.value + '>' + params.value + '</span>';
            },
        },

    ];

    //initialize Grid options
    $scope.gridOptions4 = {
        angularCompileRows: true,
        columnDefs: columnDefs4,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        rowHeight: 24,
        suppressHorizontalScroll: true,
        rowData: [],
        enableColResize: true,
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

        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions5.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };

    var columnDefs5 = [
        {
            headerName: "", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },
        {
            headerName: "Changed Business Days - Post Delivery Head Clearance - 1", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                return '<span title=' + params.value + '>' + params.value + '</span>';
            },
        },
        {
            headerName: "Changed Business Days - Post Delivery Head Clearance - 2	", field: 'componenttype', width: 120, headerTooltip: "Component Type",
        }

    ];

    //initialize Grid options
    $scope.gridOptions5 = {
        angularCompileRows: true,
        columnDefs: columnDefs5,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: [],
        enableColResize: true,
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

        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions6.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };



    var columnDefs6 = [
        {
            headerName: "", field: "OppId", width: 120, headerTooltip: "Opportunity ID"
        },

        {
            headerName: "SDLC Stage Removal", field: "Component", editable: $scope.grideditable, width: 120, headerTooltip: "Component", cellRenderer: function (params) {
                return '<span title=' + params.value + '>' + params.value + '</span>';
            },
        }

    ];

    //initialize Grid options
    $scope.gridOptions6 = {
        angularCompileRows: true,
        columnDefs: columnDefs6,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: [],
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions7.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };

    var data1 = [{ ivrcallflow: 'Address', DM: '10', Count: '', Hours: '100' }];


    var columnDefs7 = [
        {
            headerName: 'Number of IVR Call Flows : 1',
            groupId: "GroupB",
            headerTooltip: "Number of IVR Call Flows : 1",

            children: [{
                headerName: "Dialog Modules", field: "ivrcallflow", width: 220, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'IVR Call Flow # 1',
            groupId: "GroupB",
            headerTooltip: "IVR Call Flow # 1",

            children: [{
                headerName: "DM Count", field: "DM", editable: $scope.grideditable, width: 120, headerTooltip: "Component"
            },
                {
                    headerName: "", field: "Count", editable: $scope.grideditable, width: 120, headerTooltip: "Component"
                },
                {
                    headerName: "Hours", field: "Hours", editable: $scope.grideditable, width: 120, headerTooltip: "Component"
                },
            ]
        }

    ];

    //initialize Grid options
    $scope.gridOptions7 = {
        angularCompileRows: true,
        columnDefs: columnDefs7,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: data1,
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions7.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };

    var data8 = [{ framework: 'Are you using the Citius framework for the application', DM: '10', Count: '', Hours: '100' }];

    var columnDefs8 = [
        {
            headerName: 'Number of Applications : 1',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "Framework", field: "framework", width: 320, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'Application # 1',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [{
                headerName: "", field: "DM", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
            },
                {
                    headerName: "", field: "Count", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
                {
                    headerName: "Hours", field: "Hours", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        }

    ];

    //initialize Grid options
    $scope.gridOptions8 = {
        angularCompileRows: true,
        columnDefs: columnDefs8,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: data8,
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions8.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };




    var data9 = [{ Application: 'Are you using the Citius framework for the application or developing a Custom Main Screen', dm: '1', Select: 'custom', Hours: '100' }];

    var columnDefs9 = [
        {
            headerName: 'Admin Application', field: "Application", width: 420, headerTooltip: "Opportunity ID"
        },

        {
            headerName: '# of Modules', field: "DM", editable: $scope.grideditable, width: 120, headerTooltip: "Component"
        },
        {
            headerName: "Select", field: "Select", editable: $scope.grideditable, width: 120, headerTooltip: "Component"
        },
        {
            headerName: "Hours", field: "Hours", editable: $scope.grideditable, width: 120, headerTooltip: "Component"
        },


    ];

    //initialize Grid options
    $scope.gridOptions9 = {
        angularCompileRows: true,
        columnDefs: columnDefs9,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: data9,
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions8.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };

    var data10 = [{ UCS: 'Number of UCS B series chassis to be installed', framework: '', framework1: '', framework2: '', Hours: '10', Hours2: '', Hours3: '100' }];

    var columnDefs10 = [
        {
            headerName: "UCS Servers", field: "UCS", editable: $scope.grideditable, width: 350, headerTooltip: "Component"
        },

        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework1", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework2", width: 120, headerTooltip: "Opportunity ID"

            }]
        },
        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours1", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours2", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        }

    ];

    //initialize Grid options
    $scope.gridOptions10 = {
        angularCompileRows: true,
        columnDefs: columnDefs10,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: data10,
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions8.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };

    var data11 = [{ UCS: 'Number of HP DL360 G8 Rack servers to be installed', framework: '', framework1: '', framework2: '', Hours: '10', Hours2: '', Hours3: '100' }];

    var columnDefs11 = [
        {
            headerName: "Servers", field: "UCS", editable: $scope.grideditable, width: 350, headerTooltip: "Component"
        },

        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework1", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework2", width: 120, headerTooltip: "Opportunity ID"

            }]
        },
        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours1", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours2", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        }

    ];

    //initialize Grid options
    $scope.gridOptions11 = {
        angularCompileRows: true,
        columnDefs: columnDefs11,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: data10,
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions8.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };
    
    var data12 = [{ UCS: 'Servion Collaboration App', framework: '', framework1: '', framework2: '', Hours: '10', Hours2: '', Hours3: '100' }];

    var columnDefs12 = [
        {
            headerName: "", field: "UCS", editable: $scope.grideditable, width: 350, headerTooltip: "Component"
        },

        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework1", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework2", width: 120, headerTooltip: "Opportunity ID"

            }]
        },
        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours1", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours2", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        }

    ];

    //initialize Grid options
    $scope.gridOptions12 = {
        angularCompileRows: true,
        columnDefs: columnDefs12,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: data10,
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions8.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };




    var data13 = [{ UCS: 'Servion Collaboration App', framework: '', framework1: '', framework2: '', Hours: '10', Hours2: '', Hours3: '100' }];

    var columnDefs13 = [
        {
            headerName: "", field: "UCS", editable: $scope.grideditable, width: 350, headerTooltip: "Component"
        },

        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework1", width: 120, headerTooltip: "Opportunity ID"

            }]
        },

        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Number of Applications : 1",

            children: [{
                headerName: "# of Units", field: "framework2", width: 120, headerTooltip: "Opportunity ID"

            }]
        },
        {
            headerName: 'PROD',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UAT',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours1", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        },
        {
            headerName: 'UPG',
            groupId: "GroupB",
            headerTooltip: "Application # 1",

            children: [
                {
                    headerName: "Hours", field: "Hours2", editable: $scope.grideditable, width: 150, headerTooltip: "Component"
                },
            ]
        }

    ];

    //initialize Grid options
    $scope.gridOptions13 = {
        angularCompileRows: true,
        columnDefs: columnDefs13,
        rowSelection: 'single',
        enableFilter: true,
        groupHeaders: true,
        headerHeight: 36,
        suppressHorizontalScroll: true,
        rowHeight: 24,
        rowData: data10,
        enableColResize: true,
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
            //if (!$scope.grideditable)
            //    toaster.pop('warning', "Warning", 'Please click edit to make changes', null);

            //var selectedRows = $scope.gridOptions.api.getSelectedRows();
            //console.log('a row clicked');
        },
        columnGroupOpened: function (event) {
            // alert('s');
            $scope.gridOptions8.api.sizeColumnsToFit();
        },
        onGridReady: function (event) {

        },


    };
});





