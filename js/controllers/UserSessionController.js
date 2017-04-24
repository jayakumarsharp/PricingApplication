agGrid.initialiseAgGridWithAngular1(angular);
ReportApp.controller('UserSessionController', function ($scope, $rootScope, UserFactory, toaster, $timeout) {
    $scope.Users = [];
    $scope.showGrid = false;
    $scope.showErr = false;
    $scope.DateMessage = '';
    
    $scope.UserSessionGrid = {
        columnDefs: [
            { headerName: "UserID", field: "UserId", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
            { headerName: "Logged In Time", field: "CreatedDate", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                cellRenderer: function(params){
                    return formatDate(params.value);
                }
            }                           
        ],

    rowData: null,
    enableFilter: true,
    rowHeight: 25,
    headerHeight: 30,
    enableColResize: true,
    suppressRowClickSelection: true,
    suppressHorizontalScroll: true,
    suppressCellSelection: true,
    
    onGridReady: function (event) {
        $scope.UserSessionGrid.api.sizeColumnsToFit();       
    }
    };

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.UserSessionGrid.api.sizeColumnsToFit();
        }, 1000);
    });

    var formatDate = function (indate) {
        indateTime = indate.split('T');
        var date = new Date(indateTime[0]);
        var time =  indateTime[1].substring(0, 8);
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + time;
    }

    // var formatDate = function (indate) {
    //     var currentTime = new Date(indate);
    //     var currentOffset = currentTime.getTimezoneOffset();
    //     var ISTTime = new Date(currentTime.getTime() + (currentOffset) * 60000);
    //     var hours = ISTTime.getHours();        
    //     var minutes = ISTTime.getMinutes();
    //     var ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours = hours % 12;
    //     hours = hours ? hours : 12; // the hour '0' should be '12'
    //     minutes = minutes < 10 ? '0' + minutes : minutes;
    //     var strTime = hours + ':' + minutes + ' ' + ampm;
    //     var final =  currentTime.getMonth() + 1 + "/" + currentTime.getDate() + "/" + currentTime.getFullYear() + "  " + strTime;
    //     return final;
    // }

    $scope.GetUserSession = function(){
        try
        {
            $scope.showErr = false;
            $scope.showGrid = false;
            var inDate = $("#searchDate").val();
            
            if (inDate == '' || inDate == undefined) {
                $scope.showErr = true;
                $scope.showGrid = false;
                $scope.DateMessage = 'Invalid Date!';
                return;
            }
            
            var findDate = new Date(inDate);
            var twoDigitMonthFind = (findDate.getMonth() + 1 >= 10) ? (findDate.getMonth() + 1) : '0' + (findDate.getMonth() + 1);
            var FindDate = findDate.getFullYear() + "-" + twoDigitMonthFind + "-" + findDate.getDate();  
       
            var current = new Date();
            var twoDigitMonthCur = (current.getMonth() + 1 >= 10) ? (current.getMonth() + 1) : '0' + (current.getMonth() + 1);
            var CurDate = current.getFullYear() + "-" + twoDigitMonthCur + "-" + current.getDate();  
            
            var search = new Date(FindDate);
            var curr = new Date(CurDate);
            
            if(search > curr){
                        $scope.showErr = true;
                        $scope.showGrid = false;
                        $scope.DateMessage = 'Search date cannot be greater than current date!';
                        return;
            }
            
            UserFactory.GetUserSessionInfo(FindDate).success( function(users){
                   if(users.length > 0){
                        $scope.showErr = false;
                        $scope.showGrid = true;
                        $scope.Users = users;
                        $scope.UserSessionGrid.api.refreshView();
                        $scope.UserSessionGrid.api.setRowData(users);
                        $timeout(function () {
                            $scope.UserSessionGrid.api.refreshView();
                        }, 50);
                   }
                    else{
                        $scope.showErr = true;
                        $scope.showGrid = false;
                        $scope.DateMessage = 'No users logged in on this date!';
                    }
             }).error(function(err){
                        toaster.pop('error', "Error", "Failed to retrieve users", null);           
                    });
        }
        catch(ex){
            toaster.pop('error', "Error", "Failed to retrieve users", null);    
        } 
    }
});