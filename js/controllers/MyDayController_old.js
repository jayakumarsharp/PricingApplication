ReportApp.controller('MyDayController', function ($scope, $rootScope, OppFactory, MyDayFactory, UserFactory, HolidayFactory, toaster, reportFactory, $timeout) {
    $scope.date = {};
    $scope.HRMIS = {};
    $scope.opp = {};
    $scope.Users = [];
    $scope.UsersForMyDay = [];
    $scope.OppIDsForMyDay = [];
    $scope.OppNamesForMyDay = [];
    $scope.Types = [];
    $scope.AllOpps = [];
    $scope.SBUs = []; //Has full SBU info
    $scope.AllSBUs = []; //Only has SBU name
    $scope.UserSBUs = []; //User-SBU mapping
    $scope.OppsToTag = [];
    $scope.FilterOpps = [];
    $scope.SelectedOpps = [];
    $scope.UpdatedOpps = [];
    $scope.OppToTag = {};
    $scope.TaggedOppInfo = {};
    $scope.myTask = {};
    $scope.taskDetails = {};
    $scope.TaskDetails = [];
    $scope.scUtilInput = {};
    $scope.scUtilWeekInput = {};
    $scope.SCUtilization = [];
    $scope.SCUtilizationWeekly = [];
    $scope.scBillingInput = {};
    $scope.scBillingNewInput = {};
    $scope.SCBilling = [];
    $scope.SCBillingNew = [];
    $scope.MyTasks = [];
    $scope.TaskTypes = [];
    $scope.IsSCUser = false;
    $scope.view360imgPath = View360ImagesPath;
    $scope.currentTab = 'js/views/Utilities/SCUtilization.html';
    $scope.currentMainTab = 'js/views/Utilities/MyDay.html';
    $scope.showGrid = false;
    $scope.ShowSummaryGrid = false;
    $scope.showUtilsGrid = false;
    $scope.showUtilsWeeklyGrid = false;
    $scope.showBillingGrid = false;
    $scope.showBillingNewGrid = false;
    $scope.TotalHoursSpent = '';
    $scope.WorkingDaysCount = 0;
    $scope.TaskID = '';
    $scope.taskSummary = {};
    $scope.TaskSummary = [];
    $scope.TaskSummaryResult = [];
    $scope.tasktypeSummary = {};
    $scope.TaskTypeSummary = [];
    $scope.customColumns = [];
    $scope.ShowTaskTypeSummaryGrid = false;
    $scope.UserBasedSummary = [];
    $scope.ShowUserBasedSummaryGrid = false;
    $scope.SCLeavesHours = [];
    $scope.SumOfAllSBUHours = [];
    $scope.showSCBillingReport = false;
    $scope.showSCBillingNewReport = false;
    $scope.showSCUtilReport = false;
    $scope.showSCUtilWeeklyReport = false;
    var TaskArray = [];
    var TaskTypeArray = [];
    var UserArray = [];
    var SharedUsersBilling = [];
    var BillingNewSum = [];
    var TotalHoursPerMonth = [];
    var MDUsers = [];
    var HolidayCalendar = [];
    var LoggedInUser = {};
    $scope.custom = [];
    $scope.SBU = [];
    $scope.taskcustomColumns = [];

    // --- ADD OPPS GRID --- //
    $rootScope.$on("toggle", function () {
        $timeout(function () {
            $scope.addOppGrid.api.sizeColumnsToFit();
        }, 1000);
    });

    var columnDefs = [
        {
            headerName: "SBU", field: "SBU", editable: false, width: 100, headerTooltip: "SBU", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Account Name", field: "AccountName", width: 200, headerTooltip: "Account Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Opportunity Name", field: "OpportunityName", editable: false, width: 200, headerTooltip: "Opportunity Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Opportunity ID", field: "OppId", editable: false, width: 120, headerTooltip: "OpportunityID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "", field: "chkAddUser", checkboxSelection: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if ($scope.UpdatedOpps.length > 0) {
                    angular.forEach($scope.UpdatedOpps, function (value, key) {
                        if (params.data.OppId == value.OppId && params.data.OpportunityName == value.OpportunityName) {
                            params.node.setSelected(true);
                        }
                    });
                }
                return '';
            }
        }];

    $scope.addOppGrid = {
        columnDefs: columnDefs,
        rowData: $scope.AllOpps,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        angularCompileRows: true,
        enableColResize: true,
        onRowSelected: function (event) {
            $scope.chkChanged(event.node);
        },
        onGridReady: function (event) {
            $scope.addOppGrid.api.sizeColumnsToFit();
        }
    };

    // --- END --- //

    // --- TAG OPPS GRID --- //

    $rootScope.$on("toggle", function () {
        $timeout(function () {
            $scope.tagOppsGrid.api.sizeColumnsToFit();
        }, 1000);
    });

    var columnDefs = [
        {
            headerName: "SBU", field: "SBU", editable: false, width: 100, headerTooltip: "SBU", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Account Name", field: "AccountName", width: 200, headerTooltip: "Account Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Opportunity Name", field: "OpportunityName", editable: false, width: 200, headerTooltip: "Opportunity Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Opportunity ID", field: "OppId", editable: false, width: 120, headerTooltip: "OpportunityID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "", field: "chkAddUser", checkboxSelection: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        }];

    $scope.tagOppsGrid = {
        columnDefs: columnDefs,
        rowData: $scope.AllOpps,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        angularCompileRows: true,
        enableColResize: true,
        onRowSelected: function (event) {
            $scope.chkChangedTag(event.node);
        },
        onGridReady: function (event) {
            $scope.tagOppsGrid.api.sizeColumnsToFit();
        }
    };

    // --- END --- //

    $scope.GetHRMISLeave = function (userId, date) {
        if (userId != undefined && userId != '' && date != undefined && date != '') {
            var dt = new Date(date);
            MyDayFactory.GetHRMISLeave(userId, dt.getMonth() + 1, dt.getFullYear()).success(function (data) {
                $scope.HRMIS.LeaveCount = data.LeaveCount;
            }).error(function (error) {
                $scope.Error = error;
            });
        }
    };
    $scope.SetHRMISLeave = function () {
        $scope.HRMIS.LeaveDate = new Date($scope.HRMIS.LeaveDate);
        var currMonth = new Date().getMonth();
        var currYear = new Date().getFullYear();
        var hrmiMonth = $scope.HRMIS.LeaveDate.getMonth();
        var hrmiYear = $scope.HRMIS.LeaveDate.getFullYear();
        if (hrmiYear > currYear) {
            toaster.pop('warning', "Warning", "Future month cannot be selected!", null);
        }
        else if (hrmiYear < currYear) {
            //toaster.pop('warning', "Warning", "Please enter leave count only for last month or the current month", null);
            MyDayFactory.SetHRMISLeave($scope.HRMIS).success(function (data) {
                $scope.HRMIS = {};
                toaster.pop('success', "Success", "HRMIS Leave updated successfully", null);
            }).error(function (error) {
                $scope.Error = error;
            });
        }
        else if (hrmiYear == currYear) {
            // if (hrmiMonth <= currMonth - 2)
            //     toaster.pop('warning', "Warning", "Please enter leave count only for last month or the current month", null);
            if (hrmiMonth > currMonth)
                toaster.pop('warning', "Warning", "Future month cannot be selected!", null);
            else {
                if (($scope.HRMIS.LeaveCount * 10) % 5 != 0) {
                    toaster.pop('warning', "Warning", "The Leave count is invalid!", null);
                }
                else {
                    MyDayFactory.SetHRMISLeave($scope.HRMIS).success(function (data) {
                        $scope.HRMIS = {};
                        toaster.pop('success', "Success", "HRMIS Leave updated successfully", null);
                    }).error(function (error) {
                        $scope.Error = error;
                    });
                }
            }
        }
    };
    $scope.GetAllSBU = function () {
        UserFactory.GetAllSBU().success(function (data) {
            $scope.AllSBUs = [];
            $scope.SBUs = [];
            angular.forEach(data, function (value, key) {
                if (value.id != '6') {
                    $scope.AllSBUs.push(value.SBU);
                    $scope.SBUs.push(value);
                }
            });
            $scope.AllSBUs.push('None');
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetAllUsers = function () {
        UserFactory.GetUsers().success(function (data) {
            $scope.Users = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetAllUserBillingSBU = function () {
        UserFactory.GetAllUserBillingSBU().success(function (data) {
            $scope.UserSBUs = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetUsersByTypes = function (types) {
        if (types != '') {
            var typeid = [];
            angular.forEach(types, function (value, key) {
                typeid.push({ 'TypeId': value });
            });
            UserFactory.GetUsersByTypes(typeid).success(function (data) {
                $scope.Users = data;
            }).error(function (error) {
                $scope.Error = error;
            });
        }
        else {
            UserFactory.GetUsers().success(function (data) {
                $scope.Users = data;
            }).error(function (error) {
                $scope.Error = error;
            });
        }
    };
    $scope.GetRightsList = function () {
        reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName == 'SC Billing Report') {
                    $scope.showSCBillingReport = true;
                }
                else if (value.RightName == 'SC Utilization Report') {
                    $scope.showSCUtilReport = true;
                }
                else if (value.RightName == 'SC Utilization Weekly Report') {
                    $scope.showSCUtilWeeklyReport = true;
                }
                else if (value.RightName == 'SC Billing New Way Report') {
                    $scope.showSCBillingNewReport = true;
                }
            });
            if (!$scope.showSCUtilReport)
                $scope.currentTab = 'js/views/Utilities/SCBilling.html';
            else if (!$scope.showSCBillingReport)
                $scope.currentTab = 'js/views/Utilities/SCUtilizationWeekly.html';
            else if (!$scope.showSCUtilWeeklyReport)
                $scope.currentTab = 'js/views/Utilities/SCBillingNewWay.html';
        });
    };
    $scope.GetTaskTypes = function () {
        console.log('getting all task types');
        $scope.TaskTypes = [];
        MyDayFactory.GetTaskTypes().success(function (data) {
            $scope.TaskTypes = data;
            $scope.TaskTypes.splice(0, 1);
        }).error(function (error) {
            console.log('Error occurred: ' + error);
            $scope.Error = error;
        });
    };

    $scope.GetOppForMyDay = function () {
        console.log('getting all opp');
        $scope.opp.onlyNew = false;
        $scope.AllOpps = [];
        $scope.FilterOpps = [];
        MyDayFactory.GetNewOpps($rootScope.UserInfo.user.userId).success(function (opps) {
            $scope.OppsToTag = opps;
            OppFactory.GetOppForMyDay().success(function (data) {
                $scope.AllOpps = data;
                angular.forEach($scope.OppsToTag, function (value, key) {
                    $scope.AllOpps.push({ 'OppId': value.OppId, 'AccountName': 'NA', 'OpportunityName': value.OpportunityName, 'SBU': value.SBU })
                });
                $scope.addOppGrid.api.setRowData($scope.AllOpps);
                $timeout(function () {
                    $scope.addOppGrid.api.refreshView();
                }, 500);
                $('#oppsToAdd').modal('show');
            }).error(function (error) {
                $scope.Error = error;
            });
        }).error(function (error) {
            $scope.Error = error;
        });
        console.log('received all opp - end');
    };

    $scope.GetOppsToTag = function () {
        console.log('getting opps to tag');
        $scope.AllOpps = [];
        MyDayFactory.GetNewOpps($rootScope.UserInfo.user.userId).success(function (opps) {
            $scope.OppsToTag = opps;
            OppFactory.GetOppForMyDay().success(function (data) {
                $scope.AllOpps = data;
                $scope.tagOppsGrid.api.setRowData($scope.AllOpps);
                $timeout(function () {
                    $scope.tagOppsGrid.api.refreshView();
                }, 500);
                $('#oppsToTag').modal('show');
            }).error(function (error) {
                $scope.Error = error;
            });
        }).error(function (error) {
            $scope.Error = error;
        });
        console.log('received all opps to tag - end');
    };

    $scope.OnlyNEW = function (checked) {
        $scope.FilterOpps = [];
        if (checked) {
            $scope.FilterOpps.push({ 'OppId': 'NEW' });
        }
    }

    $scope.chkChanged = function (event) {
        var isAddedAlready = false;
        if (event.selected == true) {
            angular.forEach($scope.UpdatedOpps, function (value, key) {
                if (event.data.OppId == value.OppId && event.data.OpportunityName == value.OpportunityName) {
                    isAddedAlready = true;
                }
            });
            if (!isAddedAlready) {
                $scope.UpdatedOpps.push({ 'OppId': event.data.OppId, 'OpportunityName': event.data.OpportunityName, 'SBU': event.data.SBU });
            }
        }
        else {
            for (var i = $scope.UpdatedOpps.length - 1; i >= 0; i--) {
                if ($scope.UpdatedOpps[i].OppId == event.data.OppId) {
                    $scope.UpdatedOpps.splice(i, 1);
                }
            }
        }
    }

    $scope.chkChangedTag = function (event) {
        if (event.selected == true) {
            $scope.TaggedOppInfo = { 'OppId': event.data.OppId, 'OpportunityName': event.data.OpportunityName, 'SBU': event.data.SBU };
        }
        else {
            $scope.TaggedOppInfo = {};
        }
    }

    $scope.TagOpp = function (OppToTag) {
        if ($scope.TaggedOppInfo.OppId != '' || $scope.TaggedOppInfo.OppId != undefined) {
            var sbuid = GetSBUId($scope.TaggedOppInfo.SBU);
            var oppToUpdate = { 'OldOppName': OppToTag.OpportunityName, 'OppId': $scope.TaggedOppInfo.OppId, 'OpportunityName': $scope.TaggedOppInfo.OpportunityName, 'SBU': sbuid }
            MyDayFactory.UpdateNewOpp(oppToUpdate).success(function (data) {
                $('#oppsToTag').modal('hide');
                toaster.pop('success', "Success", "Tagged opportunity successfully", null);
            }).error(function (error) {
                $scope.Error = error;
                toaster.pop('error', "Error", "Error occurred when Tagging", null);
                console.log('Error when Tagging: ' + error);
            });
        }
        else {
            toaster.pop('warning', "Warning", "There are no opportunities selected to be tagged with", null);
        }
    }

    //Display only selected opps
    $scope.showSelectedOpps = function (isChecked) {
        if (isChecked) {
            console.log('setting row data');
            $scope.addOppGrid.api.setRowData($scope.UpdatedOpps);
            $timeout(function () {
                $scope.addOppGrid.api.refreshView();
            }, 100);
        }
        else {
            $scope.addOppGrid.api.setRowData($scope.AllOpps);
            $timeout(function () {
                $scope.addOppGrid.api.refreshView();
            }, 100);
        }
    };

    $scope.AddNEWOpp = function () {
        $scope.MyTasks.push({ 'OppId': 'NEW', 'OpportunityName': '', 'SBU': '' });
        for (var i = 0; i < $scope.SelectedOpps.length; i++) {
            if ($scope.SelectedOpps[i] == "NEW") {
                $scope.SelectedOpps.splice(i, 1);
            }
        };

        for (var i = 0; i < $scope.SelectedOpps.length; i++) {
            if ($scope.SelectedOpps[i] == "NONE") {
                $scope.SelectedOpps.splice(i, 1);
            }
        };
        $scope.SelectedOpps.push("NEW");
        $scope.SelectedOpps.push("NONE");
    };

    $scope.AddOpps = function () {
        console.log('Total selected: ' + $scope.UpdatedOpps.length);
        var defaultValSet = false;

        if ($scope.UpdatedOpps.length == 0 && $scope.FilterOpps.length == 0) {
            toaster.pop('warning', "Warning", "There are no opportunities selected", null);
        }
        else {
            angular.forEach($scope.UpdatedOpps, function (value, key) {
                console.log(JSON.stringify(value));
                for (var i = 0; i < $scope.SelectedOpps.length; i++) {
                    if ($scope.SelectedOpps[i] == value.OppId) {
                        $scope.SelectedOpps.splice(i, 1);
                    }
                };
                $scope.SelectedOpps.push(value.OppId);
                $scope.MyTasks.push({ 'OppId': value.OppId, 'OpportunityName': value.OpportunityName, 'SBU': value.SBU });


                for (var i = 0; i < $scope.FilterOpps.length; i++) {
                    if ($scope.FilterOpps[i].OppId == value.OppId) {
                        $scope.FilterOpps.splice(i, 1);
                    }
                };
                $scope.FilterOpps.push({ 'OppId': value.OppId });
            });

            for (var i = 0; i < $scope.SelectedOpps.length; i++) {
                if ($scope.SelectedOpps[i] == "NEW") {
                    $scope.SelectedOpps.splice(i, 1);
                }
            };
            for (var i = 0; i < $scope.SelectedOpps.length; i++) {
                if ($scope.SelectedOpps[i] == "NONE") {
                    $scope.SelectedOpps.splice(i, 1);
                }
            };
            $scope.SelectedOpps.push("NEW");
            $scope.SelectedOpps.push("NONE");

            $('#oppsToAdd').modal('hide');
        }
        $scope.UpdatedOpps = [];
    };

    $scope.SaveOrSubmit = function () {
        var myDayTasks = [];
        //'submit'
        var isWorkDateValid = true;
        var min = 9999;
        var max = 0;

        angular.forEach($scope.MyTasks, function (task, key) {
            var wrkYr = new Date(task.WorkDate).getFullYear();
            if (wrkYr < min)
                min = wrkYr;
            if (wrkYr > max)
                max = wrkYr;
        });
        console.log('Min Year: ' + min + ' Max Year: ' + max);

        HolidayFactory.GetHoliday(LoggedInUser.LocationId, min, max).success(function (holiday) {
            MyDayFactory.GetLockedDate().success(function (data) {
                if (data[0].LockDate != null || data[0].LockDate != undefined) {
                    $scope.date.LockDate = formatDate(data[0].LockDate);
                    console.log('Lock set until 2: ' + $scope.date.LockDate);
                }
                else {
                    console.log('No lock set yet');
                    $scope.date.LockDate = data[0].LockDate;
                }

                angular.forEach($scope.MyTasks, function (value, key) {
                    var sbuid = GetSBUId(value.SBU);
                    //var dur = value.Duration.split(':');

                    if (value.TaskTypeId == 30 && IsDateHoliday(value.WorkDate, holiday)) {
                        console.log('Ignoring task as it falls on holiday');
                    }
                    else if (value.OppId == 'NONE') {
                        myDayTasks.push({
                            'WorkDate': value.WorkDate,
                            'OppId': value.OppId,
                            'OpportunityName': 'NA',
                            'SBU': sbuid,
                            'TaskTypeId': value.TaskTypeId,
                            'hhDuration': value.hhDuration,
                            'mmDuration': value.mmDuration,
                            'Note': value.Note,
                            'UpdatedBy': $rootScope.UserInfo.user.userId,
                        })
                    }
                    else {
                        if (value.OpportunityName == '') {
                            toaster.pop('warning', "Warning", "Provide Opportunity Name for Opportunity ID: " + value.OppId, null);
                            isWorkDateValid = false;
                        }
                        else if (sbuid == 0) {
                            toaster.pop('warning', "Warning", "SBU - None cannot be chosen for Opportunity ID : " + value.OppId, null);
                            isWorkDateValid = false;
                        }
                        else {
                            myDayTasks.push({
                                'WorkDate': value.WorkDate,
                                'OppId': value.OppId,
                                'OpportunityName': value.OpportunityName,
                                'SBU': sbuid,
                                'TaskTypeId': value.TaskTypeId,
                                'hhDuration': value.hhDuration,
                                'mmDuration': value.mmDuration,
                                'Note': value.Note,
                                'UpdatedBy': $rootScope.UserInfo.user.userId,
                            });
                        }
                    }

                    if (isWorkDateValid && !IsDateValid(value.WorkDate, $scope.date.LockDate)) {
                        isWorkDateValid = false;
                    }
                })

                if (isWorkDateValid) {
                    console.log('Saving/Submitting.. ' + JSON.stringify(myDayTasks));
                    MyDayFactory.SaveSubmitMyDay(myDayTasks).success(function (data) {
                        toaster.pop('success', "Success", "Tasks submitted successfully", null);
                        $scope.MyTasks = [];
                        $scope.SelectedOpps = [];
                    }).error(function (error) {
                        $scope.Error = error;
                        toaster.pop('error', "Error", "Error occurred when Submitting", null);
                        console.log('Error when Save/Submit: ' + error);
                    });
                }
                else {
                    console.log('Invlaid Work Date. Cannot Submit');
                }
            }).error(function (error) {
                console.log('Error occurred: ' + error);
            });
        }).error(function (error) {
            console.log('Error occurred getting holiday: ' + error);
        });
    };

    $scope.ReplicateRow = function (row) {
        var index = -1;
        for (var i = 0; i < $scope.MyTasks.length; i++) {
            if ($scope.MyTasks[i] == row) {
                index = i;
            }
        };
        if (index >= 0) {
            var pushRow = { 'WorkDate': row.WorkDate, 'OppId': row.OppId, 'OpportunityName': row.OpportunityName, 'SBU': row.SBU };
            $scope.MyTasks.splice(index, 0, pushRow);
        }
    };

    $scope.IsTaskLeave = function (opp) {
        if (opp.TaskTypeId == 30 || opp.TaskTypeId == 32) {
            opp.hhDuration = 8;
        }
    };

    $scope.OnOppIdChanged = function (opp) {
        if (opp.OppId == 'NONE') {
            opp.SBU = 'None';
            opp.OpportunityName = '';
        }
        else {
            angular.forEach($scope.AllOpps, function (value, key) {
                if (opp.OppId == value.OppId) {
                    opp.SBU = value.SBU;
                    opp.OpportunityName = value.OpportunityName;
                }
            });
        }
    };

    $scope.IsUserSCHead = function () {
        UserFactory.GetUser($rootScope.UserInfo.user.userId).success(function (data) {
            if (data.TypeId == '8') {
                $scope.IsSCUser = true;
            }
            LoggedInUser = data;
        }).error(function (err) {
            $scope.IsSCUser = false;
        });
    };

    ValidateFromToDates = function (fromDate, toDate) {

        console.log('fromDate - ' + fromDate);
        console.log('toDate - ' + toDate);

        if (fromDate == '' && toDate == '') {
            toaster.pop('warning', "Warning", 'Please provide Start date & End date', null);
            return false;
        }
        else if (fromDate == '') {
            toaster.pop('warning', "Warning", 'Please provide Start date', null);
            return false;
        }
        else if (toDate == '') {
            toaster.pop('warning', "Warning", 'Please provide End date', null);
            return false;
        }

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
    };


    function IsDateHoliday(dt, dateArr) {
        var isHol = false;
        angular.forEach(dateArr, function (hlDate, key) {
            if (!isHol) {
                var holDate = new Date(hlDate.Date);
                var chkDAte = new Date(dt);

                var twoDigitMonthHol = ((holDate.getMonth().length + 1) === 1) ? (holDate.getMonth() + 1) : '0' + (holDate.getMonth() + 1);
                var twoDigitMonthChk = ((chkDAte.getMonth().length + 1) === 1) ? (chkDAte.getMonth() + 1) : '0' + (chkDAte.getMonth() + 1);

                var HolDate = holDate.getFullYear() + "-" + twoDigitMonthHol + "-" + holDate.getDate();
                var ChkDate = chkDAte.getFullYear() + "-" + twoDigitMonthChk + "-" + chkDAte.getDate();

                if (HolDate == ChkDate) {
                    isHol = true;
                    console.log('The Date ' + HolDate + ' is a holiday');
                }
            }
        });
        return isHol;
    };


    IsDateValid = function (fndDate, lckdate) {
        console.log('findDate - ' + fndDate);
        console.log('lockdate - ' + lckdate);

        if (fndDate == '' || fndDate == null) {
            toaster.pop('warning', "Warning", 'Please provide Work Dates for all Tasks', null);
            return false;
        }

        var findDate = new Date(fndDate);
        var lockdate = new Date(lckdate);
        var currDate = new Date();

        var twoDigitMonthFind = ((findDate.getMonth().length + 1) === 1) ? (findDate.getMonth() + 1) : '0' + (findDate.getMonth() + 1);
        var twoDigitMonthLock = ((lockdate.getMonth().length + 1) === 1) ? (lockdate.getMonth() + 1) : '0' + (lockdate.getMonth() + 1);
        var twoDigitMonthCurr = ((currDate.getMonth().length + 1) === 1) ? (currDate.getMonth() + 1) : '0' + (currDate.getMonth() + 1);

        var FindDate = findDate.getFullYear() + "-" + twoDigitMonthFind + "-" + findDate.getDate();
        var LockDate = lockdate.getFullYear() + "-" + twoDigitMonthLock + "-" + lockdate.getDate();
        var CurrDate = currDate.getFullYear() + "-" + twoDigitMonthCurr + "-" + currDate.getDate();

        var find = new Date(FindDate);
        var lock = new Date(LockDate);
        var curr = new Date(CurrDate);

        if (find > curr) {
            toaster.pop('warning', "Warning", 'Work Date cannot be greater than Current Date', null);
            return false;
        }

        if (find <= lock) {
            toaster.pop('warning', "Warning", 'My Day is locked for submitting until ' + lckdate, null);
            return false;
        }
        else {
            console.log('The Work Date ' + find + ' is valid');
            return true;
        }
    };

    $scope.cancel = function () {
        $scope.AllOpps = [];
        $scope.UpdatedOpps = [];
        $scope.OppsToTag = [];
        $scope.OppToTag = {};
        $scope.opp = {};
        $('#oppsToAdd').modal('hide');
        $('#oppsToTag').modal('hide');
        $('#TaskDetailModel').modal('hide');
    };

    $scope.showconfirm = function (data) {
        $scope.myTask = data;
        $('#confirmModal').modal('show');
    };

    $scope.GetLockDate = function () {
        MyDayFactory.GetLockedDate().success(function (data) {
            if (data[0].LockDate != null || data[0].LockDate != undefined) {
                $scope.date.LockDate = formatDate(data[0].LockDate);
                console.log('Lock set until: ' + $scope.date.LockDate);
            }
            else {
                console.log('No lock set yet');
                $scope.date.LockDate = data[0].LockDate;
            }
        }).error(function (error) {
            console.log('Error occurred: ' + error);
        });
    };

    $scope.ShowLock = function () {
        MyDayFactory.GetLockedDate().success(function (data) {
            if (data[0].LockDate != null || data[0].LockDate != undefined) {
                $scope.date.LockDate = formatDate(data[0].LockDate);
            }
            else {
                $scope.date.LockDate = '';
            }
            $('#lockModal').modal('show');
        }).error(function (error) {
            console.log('Error occurred: ' + error);
            toaster.pop('error', "Error", "Error occurred. Cannot open Lock Screen.", null);
        });
    };

    $scope.SetLock = function (lockdate) {
        var Lock = { 'LockDate': lockdate };
        MyDayFactory.SetLock(Lock).success(function (data) {
            toaster.pop('success', "Success", "Lock set successfully", null);
            $scope.date.LockDate = undefined;
            $('#lockModal').modal('hide');
        }).error(function (err) {
            console.log('Error occurred: ' + err);
            toaster.pop('error', "Error", "Error occurred. Failed to set lock", null);
        });
    };

    $scope.ReleaseLock = function () {
        MyDayFactory.ReleaseLock().success(function (data) {
            $scope.date.LockDate = undefined;

            toaster.pop('success', "Success", "Lock released successfully", null);
            $('#lockModal').modal('hide');
        }).error(function (err) {
            console.log('Error occurred: ' + err);
            toaster.pop('error', "Error", "Error occurred. Failed to release lock", null);
        });
    };

    var formatDate = function (indate) {
        indateTime = indate.split('T');
        var date = new Date(indateTime[0]);
        var time = indateTime[1].substring(0, 8);
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    };

    var formatDates = function (indate) {
        indateTime = indate.split('T');
        var date = new Date(indateTime[0]);
        //var time = indateTime[1].substring(0, 8);
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    }

    function GetSBUId(sbuName) {
        console.log('Getting id for SBU: ' + sbuName);
        var id = 0;
        angular.forEach($scope.SBUs, function (value, key) {
            if (value.SBU == sbuName) {
                console.log('ID found: ' + value.id);
                id = value.id;
            }
        });
        console.log('ID not found.Returning 0');
        return id;
    };
    function GetSBUName(sbuid) {
        console.log('Getting name for SBU: ' + sbuid);
        var sbuname = 'None';
        angular.forEach($scope.SBUs, function (value, key) {
            if (value.id == sbuid) {
                console.log('Name found: ' + value.SBU);
                sbuname = value.SBU;
            }
        });
        console.log('SBU name not found');
        return sbuname;
    };
    $scope.isActiveTab = function (tabUrl) {
        return tabUrl == $scope.currentTab;
    };
    $scope.isActiveMainTab = function (tabUrl) {
        return tabUrl == $scope.currentMainTab;
    };
    $scope.onClickTab = function (url) {
        $scope.SCBilling = [];
        $scope.SCBillingNew = [];
        $scope.SCUtilization = [];
        $scope.SCUtilizationWeekly = [];
        $scope.showBillingGrid = false;
        $scope.showBillingNewGrid = false;
        $scope.showUtilsGrid = false;
        $scope.showUtilsWeeklyGrid = false;
        $scope.currentTab = url;
    };
    $scope.onClickMainTab = function (url) {
        $scope.TotalHoursSpent = '';
        $scope.TaskDetails = [];
        $scope.TaskSummary = [];
        $scope.TaskTypeSummary = [];
        $scope.UserBasedSummary = [];
        $scope.showGrid = false;
        $scope.ShowSummaryGrid = false;
        $scope.ShowTaskTypeSummaryGrid = false;
        $scope.ShowUserBasedSummaryGrid = false;
        $scope.currentMainTab = url;
        $scope.custom = [];
        $scope.taskcustom = [];
        $scope.customuser = [];
    };

    //-----Task Summary Grid ------//
    //------REPORT CONTROLS------//
    // $rootScope.$on("toggle", function () {
    //     $timeout(function () {
    //         $scope.taskSummaryGrid.api.sizeColumnsToFit();
    //     }, 1000);
    // });

    $scope.taskSummaryGrid = {
        columnDefs: [],
        rowData: [],
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: false,
        angularCompileRows: true,
        enableColResize: true,
        onRowSelected: function (event) {
            $scope.chkChangedTag(event.node);
        },
        onGridReady: function (event) {
            if ($scope.TaskSummary.length > 0)
                onFloatingBottomCount(1);
        },
        getRowStyle: function (params) {
            if (params.node.floating) {
                return { 'font-weight': 'bold', 'background-color': '#fff' }
            }
        },
        floatingBottomRowData: []

    };
    function onFloatingBottomCount(footerRowsToFloat) {
        var count = Number(footerRowsToFloat);
        var rows = createData(count, 'Bottom');
        $scope.taskSummaryGrid.api.setFloatingBottomRowData(rows);
    }
    function createData(count, prefix) {
        var result = [];
        $scope.newData = [];
        var hh = 0;
        var mm = 0;
        $scope.TotalHours = 0;

        // result.push({ headerName: "Total", width: 100 });
        angular.forEach($scope.TaskSummary, function (value, key) {
            var isdataFound = true;
            var dataRow = {};
            if (value.WorkDate != undefined || value.WorkDate != '' || value.WorkDate != null) {
                var WorkDates = value.WorkDate;
            }
            for (var i = 0; i < $scope.newData.length; i++) {
                if ($scope.newData[i].WorkDate == $scope.TaskSummary[i].WorkDate) {
                    hh = hh + parseInt(value.Hour);
                    mm = mm + parseInt(value.Minutes);
                    if (mm > 59) {
                        hh++;
                        mm = mm - 60;
                    }
                    value.CumulativeDuration = hh + ':' + mm;
                    $scope.newData[i].TotalHours = value.CumulativeDuration;
                    isdataFound = true;
                }
                if (!isdataFound) {
                    dataRow.SBU = "Total";
                    dataRow.TotalHours = value.CumulativeDuration;
                    $scope.newData.push(TaskRow);
                }

            }

        });
        return result;
    }


    //$scope.customColumns = [];

    // $rootScope.$on("toggle", function () {
    //     $timeout(function () {
    //         $scope.taskSummaryGrid.api.sizeColumnsToFit();
    //     }, 1000);
    // });

    var tasktypeSummaryColumnDefs = [
        {
            headerName: "Task Type", field: "TaskName", editable: false, headerTooltip: "Task Type", cellStyle: {
                'text-align': 'left',

                'display': 'flex', 'align-items': 'center'
            }
        },
        {
            headerName: "Hours (hh:mm)", field: "Duration", editable: false, headerTooltip: "Hours (hh:mm)", cellStyle: {
                'text-align':

                'left', 'display': 'flex', 'align-items': 'center'
            }
        },

        {
            headerName: "Date", field: "WorkDate", headerTooltip: "Work Date", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
        },

    ];

    // $rootScope.$on("toggle", function () {
    //     $timeout(function () {
    //         $scope.tasktypeSummaryGrid.api.sizeColumnsToFit();
    //     }, 1000);
    // });

    $scope.tasktypeSummaryGrid = {
        //columnDefs: tasktypeSummaryColumnDefs,
        //rowData: $scope.TaskTypeSummary,
        columnDefs: [],
        rowData: [],
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: false,
        angularCompileRows: true,
        enableColResize: true,
        onRowSelected: function (event) {
            $scope.chkChangedTag(event.node);
        },
        onGridReady: function (event) {
            $scope.tasktypeSummaryGrid.api.sizeColumnsToFit();
        }
    };
    // $rootScope.$on("toggle", function () {
    //     $timeout(function () {
    //         $scope.userbasedSummaryGrid.api.sizeColumnsToFit();
    //     }, 1000);
    // });

    function dateComparator(date1, date2) {
        var date1Number = monthToComparableNumber(date1);
        var date2Number = monthToComparableNumber(date2);

        if (date1Number === null && date2Number === null) {
            return 0;
        }
        if (date1Number === null) {
            return -1;
        }
        if (date2Number === null) {
            return 1;
        }

        return date1Number - date2Number;
    }

    function monthToComparableNumber(date) {
        if (date === undefined || date === null) {
            return null;
        }

        var yearNumber = date.substring(0, 4);
        var dayNumber = date.substring(8, 10);
        var monthNumber = date.substring(5, 7);

        var result = (yearNumber * 10000) + (monthNumber * 100) + dayNumber;
        return result;
    }

    $scope.userbasedSummaryGrid = {
        //columnDefs: userbasedSummaryColumnDefs,
        //rowData: $scope.UserBasedSummary,
        columnDefs: [],
        rowData: [],
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: false,
        angularCompileRows: true,
        enableColResize: true,
        onRowSelected: function (event) {
            $scope.chkChangedTag(event.node);
        },
        onGridReady: function (event) {
            $scope.userbasedSummaryGrid.api.sizeColumnsToFit();
        }
    };

    var ConstructTaskArray = function () {
        $scope.newDatasList = [];
        console.log("TaskArray " + JSON.stringify($scope.TaskTypeSummary));
        angular.forEach($scope.TaskTypeSummary, function (value, key) {
            var TaskRow = {};
            var dataFound = false;

            value.Duration = value.Hour + ':' + value.Minutes;

            for (var i = 0; i < $scope.newDatasList.length; i++) {
                if ($scope.newDatasList[i].TaskName == value.TaskName) {
                    $scope.newDatasList[i].HH = $scope.newDatasList[i].HH + parseInt(value.Hour);
                    $scope.newDatasList[i].MM = $scope.newDatasList[i].MM + parseInt(value.Minutes);

                    if ($scope.newDatasList[i].MM > 59) {
                        $scope.newDatasList[i].HH++;
                        $scope.newDatasList[i].MM = $scope.newDatasList[i].MM - 60;
                    }
                    $scope.newDatasList[i][value.WorkDate] = value.Duration;
                    $scope.newDatasList[i].Total = $scope.newDatasList[i].HH + ':' + $scope.newDatasList[i].MM;
                    dataFound = true;
                }
            }
            if (!dataFound) {
                TaskRow.TaskName = value.TaskName;
                TaskRow[value.WorkDate] = value.Duration;
                TaskRow.Total = parseInt(value.Hour) + ':' + parseInt(value.Minutes);
                TaskRow.HH = parseInt(value.Hour);
                TaskRow.MM = parseInt(value.Minutes);
                $scope.newDatasList.push(TaskRow);
            }
        });

        $scope.tasktypeSummaryGrid.api.setRowData($scope.newDatasList);
        $timeout(function () {
            $scope.tasktypeSummaryGrid.api.refreshView();
        }, 100);

    };
    var ConstructArray = function () {
        $scope.newDataList = [];
        console.log("SBUArray " + JSON.stringify($scope.TaskSummary));
        angular.forEach($scope.TaskSummary, function (value, key) {
            var sbuRow = {};
            var dataFound = false;

            value.Duration = value.Hour + ':' + value.Minutes;

            for (var i = 0; i < $scope.newDataList.length; i++) {
                if ($scope.newDataList[i].SBU == value.SBU) {
                    $scope.newDataList[i].HH = $scope.newDataList[i].HH + parseInt(value.Hour);
                    $scope.newDataList[i].MM = $scope.newDataList[i].MM + parseInt(value.Minutes);

                    if ($scope.newDataList[i].MM > 59) {
                        $scope.newDataList[i].HH++;
                        $scope.newDataList[i].MM = $scope.newDataList[i].MM - 60;
                    }
                    $scope.newDataList[i][value.WorkDate] = value.Duration;
                    $scope.newDataList[i].Total = $scope.newDataList[i].HH + ':' + $scope.newDataList[i].MM;
                    dataFound = true;
                }
            }
            if (!dataFound) {
                sbuRow.SBU = value.SBU;
                sbuRow[value.WorkDate] = value.Duration;
                sbuRow.Total = parseInt(value.Hour) + ':' + parseInt(value.Minutes);
                sbuRow.HH = parseInt(value.Hour);
                sbuRow.MM = parseInt(value.Minutes);
                $scope.newDataList.push(sbuRow);
            }
        });
        $scope.taskSummaryGrid.api.setRowData($scope.newDataList);
        onFloatingBottomCount(1);
        $timeout(function () {
            $scope.taskSummaryGrid.api.refreshView();
        }, 100);

    };
    var ConstructUserArray = function () {
        $scope.newUserDataList = [];
        console.log("UserArray " + JSON.stringify($scope.UserBasedSummary));
        angular.forEach($scope.UserBasedSummary, function (value, key) {
            var userRow = {};
            var dataFound = false;

            value.Duration = value.Hour + ':' + value.Minutes;

            for (var i = 0; i < $scope.newUserDataList.length; i++) {
                if ($scope.newUserDataList[i].Resource == value.Resource) {
                    $scope.newUserDataList[i].HH = $scope.newUserDataList[i].HH + parseInt(value.Hour);
                    $scope.newUserDataList[i].MM = $scope.newUserDataList[i].MM + parseInt(value.Minutes);

                    if ($scope.newUserDataList[i].MM > 59) {
                        $scope.newUserDataList[i].HH++;
                        $scope.newUserDataList[i].MM = $scope.newUserDataList[i].MM - 60;
                    }
                    $scope.newUserDataList[i][value.WorkDate] = value.Duration;
                    $scope.newUserDataList[i].Total = $scope.newUserDataList[i].HH + ':' + $scope.newUserDataList[i].MM;
                    dataFound = true;
                }
            }
            if (!dataFound) {
                userRow.Resource = value.Resource;
                userRow[value.WorkDate] = value.Duration;
                userRow.Total = parseInt(value.Hour) + ':' + parseInt(value.Minutes);
                userRow.HH = parseInt(value.Hour);
                userRow.MM = parseInt(value.Minutes);
                $scope.newUserDataList.push(userRow);
            }
        });
        $scope.userbasedSummaryGrid.api.setRowData($scope.newUserDataList);
        $timeout(function () {
            $scope.userbasedSummaryGrid.api.refreshView();
        }, 100);
    };

    $scope.FetchTaskSummaryReport = function () {
        $scope.TaskSummary = [];
        $scope.ShowSummaryGrid = false;
        $scope.ShowTaskTypeSummaryGrid = false;
        $scope.ShowUserBasedSummaryGrid = false;
        $scope.taskSummary.MainUser = $rootScope.UserInfo.user.userId;

        $scope.taskSummary.AllSBU = $scope.SBUs;
        $scope.taskSummary.AllTaskType = $scope.TaskTypes;

        if ($scope.taskSummary.UserId == undefined || $scope.taskSummary.UserId.length == 0) {
            $scope.taskSummary.UserId = $scope.UsersForMyDay;
        }

        if ($scope.taskSummary.SBUId == undefined || $scope.taskSummary.SBUId.length == 0) {
            $scope.taskSummary.SBUId = [];
            angular.forEach($scope.SBUs, function (value, key) {
                $scope.taskSummary.SBUId.push(value.id);
            });
        }
        if ($scope.taskSummary.TaskName == undefined || $scope.taskSummary.TaskName.length == 0) {
            $scope.taskSummary.TaskName = [];
            angular.forEach($scope.TaskTypes, function (value, key) {
                $scope.taskSummary.TaskName.push(value.TaskTypeId);
            });
        }
        if ($scope.taskSummary.ReportType == undefined || $scope.taskSummary.ReportType == "All") {
            $scope.taskSummary.ReportType = [];
            $scope.taskSummary.ReportType.push('Resource');
            $scope.taskSummary.ReportType.push('SBU');
            $scope.taskSummary.ReportType.push('Task');
        }
        if (ValidateFromToDates($scope.taskSummary.FromDate, $scope.taskSummary.ToDate)) {
            MyDayFactory.GetTaskSummaryReport($scope.taskSummary).success(function (data) {
                $scope.TaskSummaryResult = data;
                UpdateTaskSummaryReportGrid();
            }).error(function (error) {
                $scope.Error = error;
            });
        }
        else {
            $scope.ShowSummaryGrid = false;
            $scope.ShowTaskTypeSummaryGrid = false;
            $scope.ShowUserBasedSummaryGrid = false;
        }
    };

    function UpdateTaskSummaryReportGrid() {
        $scope.ShowSummaryGrid = false;
        $scope.ShowTaskTypeSummaryGrid = false;
        $scope.ShowUserBasedSummaryGrid = false;
        for (var len = 0; len < $scope.TaskSummaryResult.length; len++) {
            if ($scope.TaskSummaryResult[len].SBUReport != undefined) {

                //Definitions
                $scope.customData = [];
                $scope.TaskSummary = [];
                $scope.custom = [];
                $scope.customColumns = [];
                $scope.ShowSummaryGrid = true;
                var hh = 0;
                var mm = 0;
                //End

                $scope.TaskSummary = $scope.TaskSummaryResult[len].SBUReport;
                TaskArray = JSON.stringify($scope.TaskSummary);
                angular.forEach($scope.TaskSummary, function (value, key) {
                    if (value.WorkDate != undefined || value.WorkDate != '' || value.WorkDate != null) {
                        var WorkDates = value.WorkDate;
                    }
                    hh += value.Hour;
                    mm += value.Minutes;
                    if (mm > 59) {
                        hh++;
                        mm = mm - 60;
                    }
                    value.Duration = value.Hour + ':' + value.Minutes;
                    var index = $scope.customColumns.indexOf(WorkDates);
                    if ($scope.customColumns.indexOf(WorkDates) == -1) {
                        $scope.customColumns.push(WorkDates);
                    }
                    $scope.customData.push(value.Duration);
                });
                $scope.custom.push({
                    headerName: "SBU", field: "SBU", width: 100,
                    cellRenderer: function (params) {
                        if (params.value == 'Total') {
                            return '<b>' + params.value + '</b>';
                        }
                        else
                            return params.value;
                    }
                });
                for (i = 0; i < $scope.customColumns.length; i++) {
                    $scope.custom.push({ headerName: $scope.customColumns[i], field: $scope.customColumns[i], width: 100 });
                }
                $scope.custom.push({ headerName: "Total", field: "Total", width: 100 });
                $scope.taskSummaryGrid.api.setColumnDefs($scope.custom);
                ConstructArray();
            }
            else if ($scope.TaskSummaryResult[len].TaskReport != undefined) {

                //Definitions
                $scope.taskcustomData = [];
                $scope.taskcustom = [];
                $scope.TaskTypeSummary = [];
                $scope.taskcustomColumns = [];
                $scope.ShowTaskTypeSummaryGrid = true;
                var hh = 0;
                var mm = 0;
                //End

                $scope.TaskTypeSummary = $scope.TaskSummaryResult[len].TaskReport;
                TaskTypeArray = JSON.stringify($scope.TaskTypeSummary);
                angular.forEach($scope.TaskTypeSummary, function (value, key) {
                    if (value.WorkDate != undefined || value.WorkDate != '' || value.WorkDate != null) {
                        var WorkDates = value.WorkDate;
                    }
                    hh += value.Hour;
                    mm += value.Minutes;
                    if (mm > 59) {
                        hh++;
                        mm = mm - 60;
                    }
                    value.Duration = value.Hour + ':' + value.Minutes;
                    var index = $scope.taskcustomColumns.indexOf(WorkDates);
                    if ($scope.taskcustomColumns.indexOf(WorkDates) == -1) {
                        $scope.taskcustomColumns.push(WorkDates);
                    }
                    $scope.taskcustomData.push(value.Duration);
                });
                $scope.taskcustom.push({
                    headerName: "TaskName", field: "TaskName", width: 100,
                    cellRenderer: function (params) {
                        if (params.value == 'Total') {
                            return '<b>' + params.value + '</b>';
                        }
                        else
                            return params.value;
                    }
                });
                for (i = 0; i < $scope.taskcustomColumns.length; i++) {
                    $scope.taskcustom.push({ headerName: $scope.taskcustomColumns[i], field: $scope.taskcustomColumns[i], width: 100 });
                }
                $scope.taskcustom.push({ headerName: "Total", field: "Total", width: 100 });
                $scope.tasktypeSummaryGrid.api.setColumnDefs($scope.taskcustom);
                ConstructTaskArray();
            }
            else if ($scope.TaskSummaryResult[len].UserReport != undefined) {
                //Definitions
                $scope.customUserData = [];
                $scope.customUserColumns = [];
                $scope.customuser = [];
                var hh = 0;
                var mm = 0;
                $scope.ShowUserBasedSummaryGrid = true;
                $scope.UserBasedSummary = [];
                //End

                $scope.UserBasedSummary = $scope.TaskSummaryResult[len].UserReport;
                UserArray = JSON.stringify($scope.UserBasedSummary);
                angular.forEach($scope.UserBasedSummary, function (value, key) {
                    if (value.WorkDate != undefined || value.WorkDate != '' || value.WorkDate != null) {
                        var WorkDates = value.WorkDate;
                    }
                    hh += value.Hour;
                    mm += value.Minutes;
                    if (mm > 59) {
                        hh++;
                        mm = mm - 60;
                    }
                    value.Duration = value.Hour + ':' + value.Minutes;
                    var index = $scope.customUserColumns.indexOf(WorkDates);
                    if ($scope.customUserColumns.indexOf(WorkDates) == -1) {
                        $scope.customUserColumns.push(WorkDates);
                    }
                    $scope.customUserData.push(value.Duration);
                });
                $scope.customuser.push({
                    headerName: "Resource", field: "Resource", width: 100,
                    cellRenderer: function (params) {
                        if (params.value == 'Total') {
                            return '<b>' + params.value + '</b>';
                        }
                        else
                            return params.value;
                    }
                });
                for (i = 0; i < $scope.customUserColumns.length; i++) {
                    $scope.customuser.push({ headerName: $scope.customUserColumns[i], field: $scope.customUserColumns[i], width: 100 });
                }
                $scope.customuser.push({ headerName: "Total", field: "Total", width: 100 });
                $scope.userbasedSummaryGrid.api.setColumnDefs($scope.customuser);
                ConstructUserArray();
            }
        }
    };

    //-------END---------//

    //------REPORT CONTROLS------//
    $rootScope.$on("toggle", function () {
        $timeout(function () {
            $scope.taskDetailsGrid.api.sizeColumnsToFit();
        }, 1000);
    });

    var taskDetailsColumnDefs = [
        {
            headerName: "Task ID", field: "TaskId", editable: false, headerTooltip: "Unique Task ID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Associate", field: "UpdatedBy", editable: false, headerTooltip: "Updated By", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Date", field: "WorkDate", headerTooltip: "Work Date", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            comparator: dateComparator
        },
        {
            headerName: "Opportunity ID", field: "OppId", editable: false, headerTooltip: "OpportunityID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Opportunity <br>ID</b></div>';
            }
        },
        {
            headerName: "Opportunity Name", field: "OpportunityName", editable: false, headerTooltip: "Opportunity Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Opportunity <br>Name</b></div>';
            }
        },
        {
            headerName: "Opportunity SBU", field: "SBU", editable: false, headerTooltip: "Opportunity SBU", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Opportunity <br>SBU</b></div>';
            }
        },
        {
            headerName: "Task Type", field: "TaskName", editable: false, headerTooltip: "Task Type", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Note", field: "Note", editable: false, headerTooltip: "Note", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Hours (hh:mm)", field: "Duration", editable: false, headerTooltip: "Hours (hh:mm)", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Hours <br>(hh:mm)</b></div>';
            }
        },
        // {
        //     headerName: "Cumulative Hours (hh:mm)", field: "CumulativeDuration", editable: false, headerTooltip: "Cumulative Hours (hh:mm)", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' }
        // },
        {
            headerName: "", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }, field: "Action", cellRenderer: function (params) {
                return "<a data-ng-click=\"showEdit('" + params.data.TaskId + "')\" href=\"javascript:;\">Edit</a><span> |</span><a data-ng-click=\"DeleteTask('" + params.data.TaskId + "')\" href=\"javascript:;\"> Delete</a>";
            }
        }];

    $scope.taskDetailsGrid = {
        columnDefs: taskDetailsColumnDefs,
        rowData: $scope.TaskDetails,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        angularCompileRows: true,
        enableColResize: true,
        enableSorting: true,
        onRowSelected: function (event) {
            $scope.chkChangedTag(event.node);
        },
        onGridReady: function (event) {
            $scope.taskDetailsGrid.api.sizeColumnsToFit();
        }
    };

    $scope.GetUsersForMyDay = function () {
        UserFactory.GetUserHierarchy($rootScope.UserInfo.user.userId).success(function (data) {
            $scope.UsersForMyDay.push($rootScope.UserInfo.user.userId);
            angular.forEach(data, function (value, key) {
                $scope.UsersForMyDay.push(value);
            });
            MyDayFactory.GetMyDayOppIDsForUsers($scope.UsersForMyDay).success(function (data2) {
                $scope.OppIDsForMyDay = data2;
                MyDayFactory.GetMyDayOppNamesForUsers($scope.UsersForMyDay).success(function (data3) {
                    $scope.OppNamesForMyDay = data3;
                }).error(function (error) {
                    $scope.Error = error;
                });
            }).error(function (error) {
                $scope.Error = error;
            });

        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetAllUserTypes = function () {
        UserFactory.GetTypes().success(function (data) {
            $scope.Types = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.FetchTaskDetails = function () {
        var taskInputs = [];
        $scope.TaskDetails = [];
        $scope.showGrid = false;
        $scope.taskDetails.OppIdArray = $scope.FilterOpps;
        $scope.taskDetails.MainUser = $rootScope.UserInfo.user.userId;
        taskInputs.push($scope.taskDetails);
        if (ValidateFromToDates($scope.taskDetails.FromDate, $scope.taskDetails.ToDate)) {
            MyDayFactory.GetTaskDetailsReport(taskInputs).success(function (data) {
                $scope.showGrid = true;
                $scope.FilterOpps = [];
                $scope.TaskDetails = data;
                UpdateTaskDetailsGrid();
            }).error(function (error) {
                $scope.Error = error;
            });
        }
        else {
            $scope.showGrid = false;
        }
    };

    $scope.ExportTaskDetails = function () {
        var params = {
            skipHeader: false,
            skipFooters: false,
            skipGroups: false,
            allColumns: true,
            onlySelected: false,
            fileName: 'TaskDetailsReport.csv',
            columnSeparator: ''
        };
        $scope.taskDetailsGrid.api.exportDataAsCsv(params);
    };

    $scope.ExportTaskTypeSummary = function () {
        var params = {
            skipHeader: false,
            skipFooters: false,
            skipGroups: false,
            allColumns: true,
            onlySelected: false,
            fileName: 'TaskTypeSummaryReport.csv',
            columnSeparator: ''
        };
        $scope.tasktypeSummaryGrid.api.exportDataAsCsv(params);
    };
    $scope.ExportTaskSummary = function () {
        var params = {
            skipHeader: false,
            skipFooters: false,
            skipGroups: false,
            allColumns: true,
            onlySelected: false,
            fileName: 'TaskSummaryReport.csv',
            columnSeparator: ''
        };
        $scope.taskSummaryGrid.api.exportDataAsCsv(params);
    };
    $scope.ExportUserBasedSummary = function () {
        var params = {
            skipHeader: false,
            skipFooters: false,
            skipGroups: false,
            allColumns: true,
            onlySelected: false,
            fileName: 'UserBasedSummaryReport.csv',
            columnSeparator: ''
        };
        $scope.userbasedSummaryGrid.api.exportDataAsCsv(params);
    };
    $scope.showEdit = function (taskid) {
        $scope.makeSBUEditable = false;
        MyDayFactory.GetMyDayFromTaskId(taskid).success(function (data) {
            $scope.opp = data[0];
            $scope.opp.WorkDate = formatDate($scope.opp.WorkDate);
            $scope.opp.Resource = $rootScope.UserInfo.user.userId;
            $scope.opp.SBU = GetSBUName($scope.opp.SBU);

            if ($scope.opp.OppId == 'NONE' || $scope.opp.OppId == 'NEW') {
                $scope.makeSBUEditable = true;
            }

            $('#TaskDetailModel').modal('show');
        }).error(function (error) {
            console.log(error);
        });
    };
    $scope.EditTask = function () {
        if (IsDateValid($scope.opp.WorkDate, $scope.date.LockDate)) {
            $scope.opp.SBUId = GetSBUId($scope.opp.SBU);
            MyDayFactory.EditTask($scope.opp).success(function (data) {
                var taskInputs = [];
                taskInputs.push($scope.taskDetails);
                MyDayFactory.GetTaskDetailsReport(taskInputs).success(function (data) {
                    $scope.showGrid = true;
                    $scope.TaskDetails = data;
                    toaster.pop('success', "Success", "Task edited successfully", null);
                    $('#TaskDetailModel').modal('hide');
                    UpdateTaskDetailsGrid();
                }).error(function (error) {
                    $scope.Error = error;
                });
            }).error(function (error) {
                toaster.pop('error', "Error", "Error occurred. Task could not be edited", null);
                console.log(error);
            });
        }
    };
    $scope.delete = function () {
        if ($scope.TaskID == '' || $scope.TaskID == null) {
            for (var i = 0; i < $scope.MyTasks.length; i++) {
                if ($scope.MyTasks[i].OppId == $scope.myTask.OppId &&
                    (($scope.MyTasks[i].OpportunityName == undefined ? '' : $scope.MyTasks[i].OpportunityName) == ($scope.myTask.OpportunityName == undefined ? '' : $scope.myTask.OpportunityName)) &&
                    (($scope.MyTasks[i].SBU == undefined ? '' : $scope.MyTasks[i].SBU) == ($scope.myTask.SBU == undefined ? '' : $scope.myTask.SBU)) &&
                    (($scope.MyTasks[i].TaskTypeId == undefined ? '' : $scope.MyTasks[i].TaskTypeId) == ($scope.myTask.TaskTypeId == undefined ? '' : $scope.myTask.TaskTypeId)) &&
                    (($scope.MyTasks[i].Note == undefined ? '' : $scope.MyTasks[i].Note) == ($scope.myTask.Note == undefined ? '' : $scope.myTask.Note)) &&
                    (($scope.MyTasks[i].hhDuration == undefined ? '' : $scope.MyTasks[i].hhDuration) == ($scope.myTask.hhDuration == undefined ? '' : $scope.myTask.hhDuration)) &&
                    (($scope.MyTasks[i].mmDuration == undefined ? '' : $scope.MyTasks[i].mmDuration) == ($scope.myTask.mmDuration == undefined ? '' : $scope.myTask.mmDuration))
                ) {
                    $scope.MyTasks.splice(i, 1);
                    $('#confirmModal').modal('hide');
                    return;
                }
            };
            $('#confirmModal').modal('hide');
        }
        else {
            var Task = { 'Id': $scope.TaskID }
            MyDayFactory.DeleteTask(Task).success(function (data) {
                for (var i = 0; i < $scope.TaskDetails.length; i++) {
                    if ($scope.TaskDetails[i].TaskId == $scope.TaskID)
                        $scope.TaskDetails.splice(i, 1);
                }
                UpdateTaskDetailsGrid();
                $scope.TaskID = '';
                toaster.pop('success', "Success", "Task deleted successfully", null);
                $('#confirmModal').modal('hide');
            }).error(function (error) {
                toaster.pop('error', "Error", "Error occurred. Task could not be deleted", null);
                console.log(error);
            });
        }
    };
    $scope.DeleteTask = function (taskId) {
        $scope.TaskID = taskId;
        $('#confirmModal').modal('show');
    };
    var UpdateTaskDetailsGrid = function () {
        var hh = 0;
        var mm = 0;
        angular.forEach($scope.TaskDetails, function (value, key) {
            hh += value.hhDuration;
            mm += value.mmDuration;
            if (mm > 59) {
                hh++;
                mm = mm - 60;
            }
            value.Duration = value.hhDuration + ':' + value.mmDuration;
            value.CumulativeDuration = hh + ':' + mm;
            if (value.SBU == 0) {
                value.SBU = 'None'
            }
            else {
                value.SBU = GetSBUName(value.SBU);
            }
        });
        $scope.TotalHoursSpent = hh + ':' + mm;
        $scope.taskDetailsGrid.api.setRowData($scope.TaskDetails);
        $timeout(function () {
            $scope.taskDetailsGrid.api.refreshView();
        }, 100);
    }
    var formatDate = function (indate) {
        indateTime = indate.split('T');
        var date = new Date(indateTime[0]);
        var time = indateTime[1].substring(0, 8);
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    }


    //------END-----//

    //------SC Utilization Weekly Report-----//

    $scope.SCUtilsWeekGrid = {
        columnDefs: [],
        rowData: [],
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: false,
        angularCompileRows: true,
        enableColResize: true,
    };

    $scope.FetchSCUtilizationWeekly = function (typeid, userid) {
        if (typeid == undefined || typeid == '') {
            typeid = [];
            angular.forEach($scope.Types, function (value, key) {
                typeid.push(value.TypeID);
            });
        }
        var users = [];
        if (userid == undefined || userid == '') {
            userid = [];
            angular.forEach($scope.Users, function (value, key) {
                users.push({ 'UserId': value.userId, 'LocationId': value.LocationId });
            });
        }
        else {
            angular.forEach(userid, function (value, key) {
                var user = _.where($scope.Users, { userId: value });
                users.push({ 'UserId': value, 'LocationId': user[0].LocationId });
            });
        }
        $scope.scUtilWeekInput.TypeId = typeid;
        $scope.scUtilWeekInput.UserId = users;
        $scope.SCUtilizationWeekly = [];
        $scope.showUtilsWeeklyGrid = false;
        if ($scope.scUtilWeekInput.FromDate == undefined) {
            toaster.pop('warning', "Warning", "Provide 'From' date and 'To' date", null);
        }
        else {

            MyDayFactory.GetSCUtilizationWeeklyReport($scope.scUtilWeekInput).success(function (UtilWeekly) {
                $scope.scUtilWeekInput = {};
                $scope.custCol = [];
                $scope.custCol.push({
                    headerName: "UserId", field: "UpdatedBy", width: 100, pinned: true
                });
                for (i = 0; i < UtilWeekly.Dates.length; i++) {
                    $scope.custCol.push({
                        headerName: UtilWeekly.Dates[i].WorkDate, field: UtilWeekly.Dates[i].WorkDate, width: 100,
                        cellClassRules: {
                            'bg-light': function (params) {
                                return params.value == 'Weekend';
                            },
                            'rag-amber': function (params) {
                                return params.value == '';
                            },
                            'rag-green': function (params) {
                                return params.value == 'Holiday';
                            },
                            'rag-red': function (params) {
                                return params.value == 'Leave';
                            }
                        },
                    });
                }
                $scope.custCol.push({
                    headerName: "Total", field: "Total", width: 100
                });
                $scope.custCol.push({
                    headerName: "Holiday", field: "Holiday", width: 100
                });
                $scope.custCol.push({
                    headerName: "Leave", field: "Leave", width: 100
                });
                $scope.custCol.push({
                    headerName: "Days", field: "Days", width: 100
                });
                $scope.custCol.push({
                    headerName: "UTILIZATION", field: "Util", width: 100
                });
                $scope.SCUtilsWeekGrid.api.setColumnDefs($scope.custCol);
                UpdateSCUtilsWeeklyGrid(UtilWeekly.WeeklyReport, UtilWeekly.Counts);
            }).error(function (error) {
                toaster.pop('error', "Error", "Error occurred. Failed to fetch Weekly report", null);
                console.log(error);
            });
        }
    };

    function UpdateSCUtilsWeeklyGrid(UtilWeekly, Counts) {
        var FinalList = [];
        angular.forEach(UtilWeekly, function (value, key) {
            var userExist = _.where(FinalList, { UpdatedBy: value.UpdatedBy });
            if (userExist.length > 0) {
                angular.forEach(FinalList, function (finVal, key) {
                    if (finVal.UpdatedBy == value.UpdatedBy) {
                        finVal[value.WorkDate] = value[value.WorkDate];
                    }
                });
            }
            else {
                var toPush = {};
                toPush.UpdatedBy = value.UpdatedBy;
                toPush[value.WorkDate] = value[value.WorkDate];
                FinalList.push(toPush);
            }
        });

        angular.forEach(Counts, function (cnt, key) {
            var datFound = false;
            angular.forEach(FinalList, function (fin, key) {
                if (!datFound && fin.UpdatedBy == cnt.UpdatedBy) {
                    datFound = true;
                    fin.Total = cnt.Total;
                    fin.Holiday = cnt.Holiday;
                    fin.Leave = cnt.Leave;
                    fin.Days = cnt.Days;
                    fin.Util = cnt.Util;
                }
            });
        });

        if (FinalList.length > 0) {
            $scope.SCUtilizationWeekly = FinalList;
            $scope.showUtilsWeeklyGrid = true;
            $scope.SCUtilsWeekGrid.api.setRowData($scope.SCUtilizationWeekly);
            $timeout(function () {
                $scope.SCUtilsWeekGrid.api.refreshView();
            }, 100);
        }
        else {
            toaster.pop('warning', "Warning", "No data found", null);
        }
    }

    $scope.ExportSCUtilizationWeekly = function () {
        var params = {
            skipHeader: false,
            skipFooters: false,
            skipGroups: false,
            allColumns: true,
            onlySelected: false,
            fileName: 'SCUtilizationWeeklyReport.csv',
            columnSeparator: ''
        };
        $scope.SCUtilsWeekGrid.api.exportDataAsCsv(params);
    };

    //---------End Util Weekly Report--------//

    //------SC Utilization Report---------//

    $rootScope.$on("toggle", function () {
        $timeout(function () {
            $scope.SCUtilsGrid.api.sizeColumnsToFit();
        }, 1000);
    });
    var SCUtilsGridColumnDefs = [
        {
            headerName: "CSC Name", field: "UserName", editable: false, headerTooltip: "CSC User Name", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.value == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>CSC Name</b></div>';
            }
        },
        {
            headerName: "My Day Logged Days", field: "MDLoggedDays", editable: false, headerTooltip: "My Day Logged Days", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>My Day <br>Logged Days</b></div>';
            }
        },
        {
            headerName: "My Day Leave Days", field: "MDLeaveDays", editable: false, headerTooltip: "My Day Leave Days", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellClassRules: {
                'rag-red': function (params) {
                    return params.value != params.data.HRMISLeaveDays;
                },
            },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>My Day <br>Leave Days</b></div>';
            }
        },
        {
            headerName: "My Day Active Days", field: "MDActiveDays", editable: false, headerTooltip: "My Day Active Days", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>My Day <br>Active Days</b></div>';
            }
        },
        {
            headerName: "HRMIS Leave Days", field: "HRMISLeaveDays", editable: false, headerTooltip: "HRMIS Leave Days", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellClassRules: {
                'rag-red': function (params) {
                    return params.value != params.data.MDLeaveDays;
                },
            },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>HRMIS <br>Leave Days</b></div>';
            }
        },
        {
            headerName: "Calendar Active Days", field: "CalendarActiveDays", editable: false, headerTooltip: "Calendar Active Days", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Calendar <br>Active Days</b></div>';
            }
        },
        {
            headerName: "Work Hours", field: "WorkHours", editable: false, headerTooltip: "Work Hours", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Work Hours</b></div>';
            }
        },
        {
            headerName: "Total Hours Spent", field: "TotalHoursSpent", editable: false, headerTooltip: "Total Hours Spent", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Total Hours <br>Spent</b></div>';
            }
        },
        {
            headerName: "Total Utilization", field: "TotalUtilization", editable: false, headerTooltip: "Total Utilization", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Total <br>Utilization</b></div>';
            }
        },
        {
            headerName: "Non BU Logged Days", field: "NonBULoggedDays", editable: false, headerTooltip: "Non BU Logged Days", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Non BU <br>Logged Days</b></div>';
            }
        },
        {
            headerName: "Non Logged Days", field: "NonLoggedDays", editable: false, headerTooltip: "Non Logged Days", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Non Logged <br>Days</b></div>';
            }
        },
        {
            headerName: "Billable Hours Spent", field: "BillableHoursSpent", editable: false, headerTooltip: "Billable Hours Spent", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Billable <br>Hours Spent</b></div>';
            }
        },
        {
            headerName: "Billable Utilization", field: "BillableUtilization", editable: false, headerTooltip: "Billable Utilization", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.UserName == 'Total') {
                    return '<b>' + params.value + '</b>';
                }
                else
                    return params.value;
            },
            headerCellTemplate: function () {
                return '<div style="color:white"><b>Billable <br>Utilization</b></div>';
            }
        },
        // {
        //     headerName: "Ratio", field: "Ratio", editable: false, headerTooltip: "Ratio", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        //     cellRenderer: function (params) {
        //         if (params.data.UserName == 'Total') {
        //             return '<b>' + params.value + '</b>';
        //         }
        //         else
        //             return params.value;
        //     }
        // },
    ];
    $scope.SCUtilsGrid = {
        columnDefs: SCUtilsGridColumnDefs,
        rowData: $scope.SCUtilization,
        enableFilter: false,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        suppressHorizontalScroll: false,
        angularCompileRows: true,
        enableColResize: true,

        onGridReady: function (event) {
            $scope.SCUtilsGrid.api.sizeColumnsToFit();
        }
    };


    function UpdateSCUtilsGrid() {
        var cntMdLoggedDays = 0;
        var cntMdLeaveDays = 0;
        var cntMdActiveDays = 0;
        var cntHRMISLeaveDays = 0;
        var cntCalActiveDays = 0;
        var cntWorkHours = 0;
        var cntTotalHoursSpent = 0;
        var cntTotalUtilization = 0;
        var cntNonBULoggedDays = 0;
        var cntNonLoggedDays = 0;
        var cntBillHoursSpent = 0;
        var cntBillUtilization = 0;
        var cntRatio = 0;

        angular.forEach($scope.SCUtilization, function (value, key) {
            var locationid = 0;
            var Holidayavail = 0;
            var rs = _.where($scope.Holidaycount, { UserName: value['UserName'] });
            if (rs.length > 0) {
                locationid = rs[0].LocationId;
                Holidayavail = rs[0].cnt;
            }

            var leavedays = [];
            var rs = _.where($scope.HolidayWeekend, { LocationId: locationid });
            if (rs.length > 0) {
                _.each(rs, function (someThing) {
                    leavedays.push(someThing['DayId']);
                })
            }

            var lastdta = moment($scope.scUtilInput.ToDate).daysInMonth();
            var ToDate = moment($scope.scUtilInput.ToDate).add((lastdta - 1), 'days').format('L');
            var weekenddays = moment().weekdayCalc($scope.scUtilInput.FromDate, ToDate, leavedays);


            var d1 = moment($scope.scUtilInput.FromDate);
            var d2 = moment(ToDate);
            var totalDays = d2.diff(d1, 'days') + 1;

            var workingDays = totalDays - (weekenddays + Holidayavail); // Total Working Days
            var calcdate = workingDays - (value.HRMISLeaveDays == undefined ? 0 : value.HRMISLeaveDays);
            value.MDActiveDays = value.MDLoggedDays - (value.MDLeaveDays == undefined ? 0 : value.MDLeaveDays);
            value.CalendarActiveDays = calcdate;
            value.WorkHours = 8 * value.CalendarActiveDays;
            value.TotalUtilization = ((value.TotalHoursSpent / value.WorkHours) * 100).toFixed(2);
            value.NonLoggedDays = value.CalendarActiveDays - value.MDActiveDays;
            value.BillableUtilization = ((value.BillableHoursSpent / value.WorkHours) * 100).toFixed(2);
            value.Ratio = ((value.BillableUtilization / value.TotalUtilization) * 100).toFixed(2) + '%';
            value.TotalUtilization = ((value.TotalHoursSpent / value.WorkHours) * 100).toFixed(2) + '%';
            value.BillableUtilization = ((value.BillableHoursSpent / value.WorkHours) * 100).toFixed(2) + '%';
            value.HRMISLeaveDays = (value.HRMISLeaveDays == undefined ? 0 : value.HRMISLeaveDays);
            value.MDLeaveDays = (value.MDLeaveDays == undefined ? 0 : value.MDLeaveDays);

            cntMdLoggedDays += value.MDLoggedDays;
            cntMdLeaveDays += value.MDLeaveDays;
            cntMdActiveDays += value.MDActiveDays;
            cntHRMISLeaveDays += value.HRMISLeaveDays;
            cntCalActiveDays += value.CalendarActiveDays;
            cntWorkHours += value.WorkHours;
            cntTotalHoursSpent += value.TotalHoursSpent;
            cntNonBULoggedDays += value.NonBULoggedDays;
            cntNonLoggedDays += value.NonLoggedDays;
            cntBillHoursSpent += value.BillableHoursSpent;

        });
        cntTotalUtilization = ((cntTotalHoursSpent / cntWorkHours) * 100).toFixed(2);
        cntBillUtilization = ((cntBillHoursSpent / cntWorkHours) * 100).toFixed(2);
        cntRatio = ((cntBillUtilization / cntTotalUtilization) * 100).toFixed(2) + '%';
        cntTotalUtilization = cntTotalUtilization + '%';
        cntBillUtilization = cntBillUtilization + '%';
        $scope.SCUtilization.push({
            'UserName': 'Total',
            'MDLoggedDays': cntMdLoggedDays,
            'MDLeaveDays': cntMdLeaveDays,
            'MDActiveDays': cntMdActiveDays,
            'HRMISLeaveDays': cntHRMISLeaveDays,
            'CalendarActiveDays': cntCalActiveDays,
            'WorkHours': cntWorkHours,
            'TotalHoursSpent': cntTotalHoursSpent.toFixed(2),
            'TotalUtilization': cntTotalUtilization,
            'NonBULoggedDays': cntNonBULoggedDays,
            'NonLoggedDays': cntNonLoggedDays,
            'BillableHoursSpent': cntBillHoursSpent.toFixed(2),
            'BillableUtilization': cntBillUtilization,
            'Ratio': cntRatio
        });

        if ($scope.SCUtilization.length > 1) {
            $scope.showUtilsGrid = true;
            $scope.SCUtilsGrid.api.setRowData($scope.SCUtilization);

            $timeout(function () {
                $scope.SCUtilsGrid.api.refreshView();
            }, 100);
        }
        else {
            toaster.pop('warning', "Warning", "No data found", null);
        }
    };
    $scope.FetchSCUtilization = function (typeid, userid) {
        if (typeid == undefined || typeid == '') {
            typeid = [];
            angular.forEach($scope.Types, function (value, key) {
                typeid.push(value.TypeID);
            });
        }
        if (userid == undefined || userid == '') {
            userid = [];
            angular.forEach($scope.Users, function (value, key) {
                userid.push(value.userId);
            });
        }
        $scope.scUtilInput.TypeId = typeid;
        $scope.scUtilInput.UserId = userid;
        $scope.SCUtilization = [];
        $scope.showUtilsGrid = false;
        if ($scope.scUtilInput.FromDate == undefined || $scope.scUtilInput.ToDate == undefined) {
            toaster.pop('warning', "Warning", "Provide 'From' date and 'To' date", null);
        }
        else {
            MyDayFactory.GetWeekends(null).success(function (data2) {
                $scope.HolidayWeekend = data2;
                if (ValidateFromToDates($scope.scUtilInput.FromDate, $scope.scUtilInput.ToDate)) {

                    var fromDate = new Date($scope.scUtilInput.FromDate);
                    var toDate = new Date($scope.scUtilInput.ToDate);

                    var twoDigitMonthFrom = ((fromDate.getMonth().length + 1) === 1) ? (fromDate.getMonth() + 1) : '0' + (fromDate.getMonth() + 1);
                    var twoDigitMonthTo = ((toDate.getMonth().length + 1) === 1) ? (toDate.getMonth() + 1) : '0' + (toDate.getMonth() + 1);

                    $scope.scUtilInput.FromDate = fromDate.getFullYear() + "-" + twoDigitMonthFrom + "-" + fromDate.getDate();
                    $scope.scUtilInput.ToDate = toDate.getFullYear() + "-" + twoDigitMonthTo + "-" + toDate.getDate();

                    MyDayFactory.GetSCUtilizationReport($scope.scUtilInput).success(function (data1) {
                        $scope.SCUtilization = data1;
                        MyDayFactory.GetHolidaybetweendate($scope.scUtilInput).success(function (data) {
                            $scope.Holidaycount = data;
                            UpdateSCUtilsGrid();
                        });
                    }).error(function (error) {
                        $scope.Error = error;
                    });
                }
                else {
                    $scope.showUtilsGrid = false;
                }
            }).error(function (error) {
                $scope.Error = error;
            });
        }
    };

    $scope.ExportSCUtilization = function () {
        var params = {
            skipHeader: false,
            skipFooters: false,
            skipGroups: false,
            allColumns: true,
            onlySelected: false,
            fileName: 'SCUtilizationReport.csv',
            columnSeparator: ''
        };
        $scope.SCUtilsGrid.api.exportDataAsCsv(params);
    };

    //-----------END------------//


    //---------SC Billing Report--------//

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var scBillingColumnDefs = [
        {
            headerName: "Name", width: 100, field: "UserName", pinned: 'left', editable: false, headerTooltip: "User Name", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Email ID", width: 175, field: "EmailId", pinned: 'left', editable: false, headerTooltip: "Email ID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "APRIL", field: "April", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Apr_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Apr_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Apr_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Apr_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Apr_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Apr_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Apr_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "MAY", field: "May", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "May_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "May_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "May_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "May_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "May_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "May_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "May_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "JUNE", field: "June", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Jun_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Jun_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Jun_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Jun_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Jun_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Jun_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Jun_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "JULY", field: "July", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Jul_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Jul_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Jul_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Jul_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Jul_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Jul_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Jul_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "AUGUST", field: "August", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Aug_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Aug_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Aug_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Aug_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Aug_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Aug_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Aug_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "SEPTEMBER", field: "September", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Sep_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Sep_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Sep_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Sep_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Sep_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Sep_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Sep_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "OCTOBER", field: "October", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Oct_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Oct_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Oct_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Oct_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Oct_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Oct_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Oct_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "NOVEMBER", field: "November", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Nov_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Nov_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Nov_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Nov_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Nov_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Nov_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Nov_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "DECEMBER", field: "December", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Dec_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Dec_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Dec_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Dec_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Dec_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Dec_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Dec_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "JANUARY", field: "January", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Jan_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Jan_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Jan_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Jan_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Jan_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Jan_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Jan_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "FEBRUARY", field: "February", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Feb_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Feb_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Feb_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Feb_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Feb_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Feb_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Feb_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "MARCH", field: "March", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Mar_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Mar_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Mar_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Mar_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Mar_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Mar_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Mar_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        }
    ];
    $scope.SCBillingGrid = {
        columnDefs: scBillingColumnDefs,
        rowData: $scope.SCBilling,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 34,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: false,
        suppressCellSelection: true,
        angularCompileRows: true,
        enableColResize: true,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
    };

    $scope.FetchSCBilling = function (typeid) {
        $scope.showBillingGrid = false;
        $scope.SCBillingGrid.columnApi.setColumnsVisible(['Jan_APA', 'Jan_EUR', 'Jan_IND', 'Jan_MEA', 'Jan_US', 'Jan_PED', 'Jan_ACQ',
            'Feb_APA', 'Feb_EUR', 'Feb_IND', 'Feb_MEA', 'Feb_US', 'Feb_PED', 'Feb_ACQ', 'Mar_APA', 'Mar_EUR', 'Mar_IND', 'Mar_MEA', 'Mar_US', 'Mar_PED', 'Mar_ACQ',
            'Apr_APA', 'Apr_EUR', 'Apr_IND', 'Apr_MEA', 'Apr_US', 'Apr_PED', 'Apr_ACQ', 'May_APA', 'May_EUR', 'May_IND', 'May_MEA', 'May_US', 'May_PED', 'May_ACQ',
            'Jun_APA', 'Jun_EUR', 'Jun_IND', 'Jun_MEA', 'Jun_US', 'Jun_PED', 'Jun_ACQ', 'Jul_APA', 'Jul_EUR', 'Jul_IND', 'Jul_MEA', 'Jul_US', 'Jul_PED', 'Jul_ACQ',
            'Aug_APA', 'Aug_EUR', 'Aug_IND', 'Aug_MEA', 'Aug_US', 'Aug_PED', 'Aug_ACQ', 'Sep_APA', 'Sep_EUR', 'Sep_IND', 'Sep_MEA', 'Sep_US', 'Sep_PED', 'Sep_ACQ',
            'Oct_APA', 'Oct_EUR', 'Oct_IND', 'Oct_MEA', 'Oct_US', 'Oct_PED', 'Oct_ACQ', 'Nov_APA', 'Nov_EUR', 'Nov_IND', 'Nov_MEA', 'Nov_US', 'Nov_PED', 'Nov_ACQ',
            'Dec_APA', 'Dec_EUR', 'Dec_IND', 'Dec_MEA', 'Dec_US', 'Dec_PED', 'Dec_ACQ'], false);
        $scope.SCBilling = [];
        if (typeid == undefined || typeid == '') {
            typeid = [];
            angular.forEach($scope.Types, function (value, key) {
                typeid.push(value.TypeID);
            });
        }
        var allTypes = [];
        angular.forEach(typeid, function (value, key) {
            allTypes.push({ 'TypeId': value });
        });
        UserFactory.GetUsersByTypes(allTypes).success(function (data) {
            $scope.Users = data;
            $scope.scBillingInput.TypeId = typeid;
            MyDayFactory.GetSCBillingReport($scope.scBillingInput).success(function (hourspersbu) {
                if (hourspersbu.length > 0) {
                    $scope.SCLeavesHours = hourspersbu;
                    MyDayFactory.GetSCBillingTotal($scope.scBillingInput).success(function (data) {
                        $scope.SumOfAllSBUHours = data;
                        $scope.showBillingGrid = true;
                        UpdateSCBillingGrid();
                    }).error(function (error) {
                        $scope.Error = error;
                    });
                }
                else {
                    $scope.showBillingGrid = false;
                    toaster.pop('warning', "Warning", "Data is not available for this period", null);
                }
            }).error(function (error) {
                $scope.Error = error;
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.ExportSCBilling = function () {
        MyDayFactory.ExportToExcelSheet($scope.SCBilling).success(function (data) {
            //console.log(data);
            var url = BaseURL + 'ExportFiles/' + data.name;

            $scope.downloadurl = url;
            $scope.filename = data.name;
            setTimeout(function () {
                $('#downloadpdf')[0].click();
            }, 1000);

            toaster.pop('success', "Success", "SC Billing Report exported successfully", null);
        }).error(function (error) {
            $scope.Error = error;
        });

    };
    function GetTotalSBUHoursPerMonth(month) {
        var tot = 0;
        var continueLoop = true;
        angular.forEach(TotalHoursPerMonth, function (value, key) {
            if (continueLoop && value.Month == month) {
                tot = value.Total;
                continueLoop = false;
            }
        });
        return tot;
    };
    function GetTotalHours(month, allper, hrs) {
        var continueLoop = true;
        var TotalHours = 0;
        angular.forEach($scope.SumOfAllSBUHours, function (sum, key) {
            if (continueLoop && sum.Month == month) {
                sum.HoursSpent = (sum.HoursSpent / 60).toFixed(2);
                TotalHours = (sum.HoursSpent * allper) / 100 + hrs;
                continueLoop = false;
            }
        });
        return TotalHours;
    }
    function CalculateBillingForSharedUsers() {
        try {
            SharedUsersBilling = [];
            for (i = 1; i <= 12; i++) { //Loop through each month
                var yCount = 0;
                var yCountPerc = 0;
                var yCountVariable = 0;
                var TotalLeaves = 0;
                var AllHours = 0;
                var continueLeaveLoop = true;

                angular.forEach($scope.SCLeavesHours, function (leave, key) {
                    if (continueLeaveLoop && i == leave.Month) {
                        TotalLeaves = leave.LeaveHours;
                        continueLeaveLoop = false;
                    }
                });

                angular.forEach($scope.SumOfAllSBUHours, function (sumval, key) {
                    if (i == sumval.Month) {
                        if (sumval.SBU != 0 && sumval.SBU != 6) {
                            yCount++;
                        }
                        else {
                            AllHours += sumval.HoursSpent;
                        }
                    }
                });
                if (yCount != 0)
                    yCountPerc = (100 / yCount).toFixed(2);
                else
                    yCountPerc = 0;
                console.log('************************************************');
                console.log('AllHours for month ' + i + ' is ' + AllHours);
                console.log('TotalLeaves for month ' + i + ' is ' + TotalLeaves);

                yCountVariable = ((AllHours - TotalLeaves) * yCountPerc / 100);
                console.log('yCountVariable for month ' + i + ' is ' + yCountVariable);

                angular.forEach($scope.SBUs, function (bu, key) {
                    var sbuFound = false;
                    var continueSBULoop = true;
                    var tot = 0;
                    angular.forEach($scope.SumOfAllSBUHours, function (sum, key) {
                        if (continueSBULoop && i == sum.Month && bu.id == sum.SBU) {
                            sbuFound = true;
                            continueSBULoop = false;
                            tot += sum.HoursSpent;
                        }
                    });
                    if (!sbuFound) {
                        SharedUsersBilling.push({ 'Month': i, 'SBU': bu.id, 'SBUHours': 0 });
                        console.log('SBU Hours for month ' + i + ' SBU ' + bu.id + ' is ' + 0);
                    }
                    else {
                        tot = tot + yCountVariable;
                        SharedUsersBilling.push({ 'Month': i, 'SBU': bu.id, 'SBUHours': tot });
                        console.log('SBU Hours for month ' + i + ' SBU ' + bu.id + ' is ' + tot);
                    }
                });
            }
            TotalHoursPerMonth = [];
            for (var k = 1; k <= 12; k++) {
                var MonthTotal = 0;
                angular.forEach(SharedUsersBilling, function (bill2, key) {
                    if (bill2.Month == k) {
                        MonthTotal += bill2.SBUHours;
                    }
                });
                TotalHoursPerMonth.push({ 'Month': k, 'Total': MonthTotal });
            }
        }
        catch (ex) {
            console.log('Error occurred when calculating billing: ' + ex);
        }
    };
    function GetBillingPercentage(month, sbu, userid, defBilllingid) {
        var per = '0%';
        var billingId = defBilllingid;
        var billingSbu = GetUserSBU(userid);
        var ar = [];

        ar = MDUsers.filter(
            function (value) {
                if (value.Month <= month && value.UpdatedBy == userid) {
                    return true;
                } else {
                    return false;
                }
            }
        );
        if (ar.length > 0) {
            billingId = ar[ar.length - 1].BillingId;
            billingSbu = ar[ar.length - 1].BillingSBU.split(',').map(function (item) {
                return parseInt(item, 10);
            });
        }
        if (billingId == 1) {
            angular.forEach(SharedUsersBilling, function (value, key) {
                if (month == value.Month && sbu == value.SBU) {
                    var hrsSBU = value.SBUHours;
                    var hrsTot = GetTotalSBUHoursPerMonth(month);
                    console.log('************************************************');
                    console.log('Hours spent on SBU ' + value.SBU + ': ' + hrsSBU);
                    console.log('Total hours spent: ' + hrsTot);
                    if (hrsSBU > 0 && hrsTot > 0) {
                        var percent = Math.round((hrsSBU / hrsTot) * 100);
                        per = percent + '%';
                    }
                    console.log('for month ' + month + ' & sbu ' + sbu + ' percentage is: ' + per);
                }
            });
        }
        else if (billingId == 2) {
            var bill = Math.round(100 / billingSbu.length);
            var index = billingSbu.indexOf(sbu);
            if (index >= 0) {
                per = bill + '%';
            }
            else {
                per = '0%';
            }
        }
        return per;
    };
    function GetKeyNameForSBU(month, sbu) {
        var sbuname = sbu.toUpperCase().substring(0, 3);
        var monthname = months[month];
        return monthname + '_' + sbuname;
    };
    function GetUserSBU(userid) {
        var mapping = []
        angular.forEach($scope.UserSBUs, function (value, key) {
            if (value.UserID == userid) {
                mapping.push(value.SBUID);
            }
        });
        return mapping;
    }
    function UpdateSCBillingGrid() {
        $scope.SCBilling = [];
        //MDUsers = [];
        var jsonRowShared = {};

        try {
            CalculateBillingForSharedUsers();
            angular.forEach($scope.Users, function (user, key) {
                var lwdMonth = 0;
                var lwdYear = 0;
                var fwdMonth = 0;
                var fwdYear = 0;

                var isLWDValid = user.LastWorkingDate == null ? true : false;
                var isFWDValid = user.FirstWorkingDate == null ? true : false;

                if (!isLWDValid) {
                    var lwd = new Date(user.LastWorkingDate.split('T')[0]);
                    lwdMonth = lwd.getMonth() + 1;
                    lwdYear = lwd.getFullYear();
                    if ((lwdYear == $scope.scBillingInput.BillingPeriod && lwdMonth >= 4) || (lwdYear == $scope.scBillingInput.BillingPeriod + 1 && lwdMonth <= 3))
                        isLWDValid = true;
                }
                if (!isFWDValid) {
                    var fwd = new Date(user.FirstWorkingDate.split('T')[0]);
                    fwdMonth = fwd.getMonth() + 1;
                    fwdYear = fwd.getFullYear();
                    if (fwdYear < $scope.scBillingInput.BillingPeriod || (fwdYear == $scope.scBillingInput.BillingPeriod) || (fwdYear == $scope.scBillingInput.BillingPeriod + 1 && fwdMonth <= 3))
                        isFWDValid = true;
                }
                if (isLWDValid && isFWDValid) {
                    for (var i = 0; i < 12; i++) {
                        angular.forEach($scope.SBUs, function (value, key) {
                            var fieldName = GetKeyNameForSBU(i, value.SBU);
                            var fieldValue = '';
                            if ((fwdMonth == 0 && lwdMonth == 0) ||
                                (fwdMonth == 0 && ((lwdYear == $scope.scBillingInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                (fwdMonth == 0 && ((lwdYear == $scope.scBillingInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) ||
                                ((fwdYear < $scope.scBillingInput.BillingPeriod) && lwdMonth == 0) ||
                                ((fwdYear < $scope.scBillingInput.BillingPeriod) && ((lwdYear == $scope.scBillingInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                ((fwdYear < $scope.scBillingInput.BillingPeriod) && ((lwdYear == $scope.scBillingInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) ||
                                ((fwdYear == $scope.scBillingInput.BillingPeriod && (i >= fwdMonth - 1)) && (lwdMonth == 0)) ||
                                ((fwdYear == $scope.scBillingInput.BillingPeriod && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                ((fwdYear == $scope.scBillingInput.BillingPeriod && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) ||
                                ((fwdYear == $scope.scBillingInput.BillingPeriod + 1 && (fwdYear <= 3) && (i >= fwdMonth - 1)) && (lwdMonth == 0)) ||
                                ((fwdYear == $scope.scBillingInput.BillingPeriod + 1 && (fwdYear <= 3) && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                (fwdYear == $scope.scBillingInput.BillingPeriod + 1 && (fwdYear <= 3) && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) {
                                fieldValue = GetBillingPercentage(i + 1, value.id, user.userId, user.BillingId);
                                jsonRowShared[fieldName] = fieldValue;
                            }
                            else {
                                fieldValue = '';
                                jsonRowShared[fieldName] = fieldValue;
                            }
                        });

                    }
                    jsonRowShared.UserName = user.UserName;
                    jsonRowShared.EmailId = user.EmailId;
                    var tempArray = JSON.parse(JSON.stringify(jsonRowShared));
                    $scope.SCBilling.push(tempArray);
                }
            });
            hideAllColumns($scope.scBillingInput.Month);
            $scope.SCBillingGrid.api.setRowData($scope.SCBilling);
            $timeout(function () {
                $scope.SCBillingGrid.api.refreshView();
            }, 100);
        }
        catch (ex) {
            console.log('Error occurred: ' + ex);
        }
    };

    function hideAllColumns(month) {
        switch (month) {
            case '01':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Jan_APA', 'Jan_EUR', 'Jan_IND', 'Jan_MEA', 'Jan_US', 'Jan_PED', 'Jan_ACQ'], true);
                break;
            case '02':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Feb_APA', 'Feb_EUR', 'Feb_IND', 'Feb_MEA', 'Feb_US', 'Feb_PED', 'Feb_ACQ'], true);
                break;
            case '03':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Mar_APA', 'Mar_EUR', 'Mar_IND', 'Mar_MEA', 'Mar_US', 'Mar_PED', 'Mar_ACQ'], true);
                break;
            case '04':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Apr_APA', 'Apr_EUR', 'Apr_IND', 'Apr_MEA', 'Apr_US', 'Apr_PED', 'Apr_ACQ'], true);
                break;
            case '05':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['May_APA', 'May_EUR', 'May_IND', 'May_MEA', 'May_US', 'May_PED', 'May_ACQ'], true);
                break;
            case '06':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Jun_APA', 'Jun_EUR', 'Jun_IND', 'Jun_MEA', 'Jun_US', 'Jun_PED', 'Jun_ACQ'], true);
                break;
            case '07':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Jul_APA', 'Jul_EUR', 'Jul_IND', 'Jul_MEA', 'Jul_US', 'Jul_PED', 'Jul_ACQ'], true);
                break;
            case '08':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Aug_APA', 'Aug_EUR', 'Aug_IND', 'Aug_MEA', 'Aug_US', 'Aug_PED', 'Aug_ACQ'], true);
                break;
            case '09':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Sep_APA', 'Sep_EUR', 'Sep_IND', 'Sep_MEA', 'Sep_US', 'Sep_PED', 'Sep_ACQ'], true);
                break;
            case '10':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Oct_APA', 'Oct_EUR', 'Oct_IND', 'Oct_MEA', 'Oct_US', 'Oct_PED', 'Oct_ACQ'], true);
                break;
            case '11':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Nov_APA', 'Nov_EUR', 'Nov_IND', 'Nov_MEA', 'Nov_US', 'Nov_PED', 'Nov_ACQ'], true);
                break;
            case '12':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Dec_APA', 'Dec_EUR', 'Dec_IND', 'Dec_MEA', 'Dec_US', 'Dec_PED', 'Dec_ACQ'], true);
                break;
            case 'All':
                $scope.SCBillingGrid.columnApi.setColumnsVisible(['Jan_APA', 'Jan_EUR', 'Jan_IND', 'Jan_MEA', 'Jan_US', 'Jan_PED', 'Jan_ACQ',
                    'Feb_APA', 'Feb_EUR', 'Feb_IND', 'Feb_MEA', 'Feb_US', 'Feb_PED', 'Feb_ACQ', 'Mar_APA', 'Mar_EUR', 'Mar_IND', 'Mar_MEA', 'Mar_US', 'Mar_PED', 'Mar_ACQ',
                    'Apr_APA', 'Apr_EUR', 'Apr_IND', 'Apr_MEA', 'Apr_US', 'Apr_PED', 'Apr_ACQ', 'May_APA', 'May_EUR', 'May_IND', 'May_MEA', 'May_US', 'May_PED', 'May_ACQ',
                    'Jun_APA', 'Jun_EUR', 'Jun_IND', 'Jun_MEA', 'Jun_US', 'Jun_PED', 'Jun_ACQ', 'Jul_APA', 'Jul_EUR', 'Jul_IND', 'Jul_MEA', 'Jul_US', 'Jul_PED', 'Jul_ACQ',
                    'Aug_APA', 'Aug_EUR', 'Aug_IND', 'Aug_MEA', 'Aug_US', 'Aug_PED', 'Aug_ACQ', 'Sep_APA', 'Sep_EUR', 'Sep_IND', 'Sep_MEA', 'Sep_US', 'Sep_PED', 'Sep_ACQ',
                    'Oct_APA', 'Oct_EUR', 'Oct_IND', 'Oct_MEA', 'Oct_US', 'Oct_PED', 'Oct_ACQ', 'Nov_APA', 'Nov_EUR', 'Nov_IND', 'Nov_MEA', 'Nov_US', 'Nov_PED', 'Nov_ACQ',
                    'Dec_APA', 'Dec_EUR', 'Dec_IND', 'Dec_MEA', 'Dec_US', 'Dec_PED', 'Dec_ACQ'], true);
                break;
        }
    }

    //-----------END-----------//

    //-------------SC Billing New Way Report--------------//

    var scBillingNewColumnDefs = [
        {
            headerName: "Name", width: 100, field: "UserName", pinned: 'left', editable: false, headerTooltip: "User Name", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Email ID", width: 175, field: "EmailId", pinned: 'left', editable: false, headerTooltip: "Email ID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "APRIL", field: "April", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Apr_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Apr_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Apr_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Apr_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Apr_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Apr_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Apr_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "MAY", field: "May", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "May_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "May_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "May_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "May_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "May_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "May_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "May_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "JUNE", field: "June", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Jun_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Jun_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Jun_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Jun_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Jun_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Jun_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Jun_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "JULY", field: "July", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Jul_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Jul_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Jul_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Jul_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Jul_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Jul_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Jul_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "AUGUST", field: "August", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Aug_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Aug_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Aug_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Aug_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Aug_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Aug_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Aug_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "SEPTEMBER", field: "September", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Sep_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Sep_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Sep_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Sep_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Sep_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Sep_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Sep_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "OCTOBER", field: "October", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Oct_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Oct_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Oct_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Oct_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Oct_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Oct_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Oct_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "NOVEMBER", field: "November", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Nov_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Nov_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Nov_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Nov_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Nov_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Nov_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Nov_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "DECEMBER", field: "December", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Dec_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Dec_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Dec_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Dec_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Dec_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Dec_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Dec_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "JANUARY", field: "January", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Jan_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Jan_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Jan_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Jan_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Jan_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Jan_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Jan_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "FEBRUARY", field: "February", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Feb_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Feb_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Feb_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Feb_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Feb_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Feb_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Feb_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-light': function (params) {
                            return true;
                        },
                    }
                },
            ]
        },
        {
            headerName: "MARCH", field: "March", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            children: [
                {
                    headerName: "APAC", width: 60, field: "Mar_APA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "EUR", width: 60, field: "Mar_EUR", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "IND", width: 60, field: "Mar_IND", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "MEA", width: 60, field: "Mar_MEA", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "USA", width: 60, field: "Mar_US", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "PED", width: 60, field: "Mar_PED", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
                {
                    headerName: "ACQ", width: 60, field: "Mar_ACQ", editable: false, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                    hide: true, cellClassRules: {
                        'bg-white color-palette': function (params) {
                            return true;
                        },
                    }
                },
            ]
        }
    ];
    $scope.SCBillingNewGrid = {
        columnDefs: scBillingNewColumnDefs,
        rowData: $scope.SCBillingNew,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 34,
        pinnedColumnCount: 1,
        rowSelection: 'single',
        suppressRowClickSelection: false,
        suppressCellSelection: true,
        angularCompileRows: true,
        enableColResize: true,
        groupSuppressAutoColumn: false,
        groupSuppressGroupColumn: true,
        enableCellExpressions: true,
        suppressMovableColumns: true,
    };

    $scope.FetchSCBillingNew = function (typeid) {
        $scope.showBillingNewGrid = false;
        $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Jan_APA', 'Jan_EUR', 'Jan_IND', 'Jan_MEA', 'Jan_US', 'Jan_PED', 'Jan_ACQ',
            'Feb_APA', 'Feb_EUR', 'Feb_IND', 'Feb_MEA', 'Feb_US', 'Feb_PED', 'Feb_ACQ', 'Mar_APA', 'Mar_EUR', 'Mar_IND', 'Mar_MEA', 'Mar_US', 'Mar_PED', 'Mar_ACQ',
            'Apr_APA', 'Apr_EUR', 'Apr_IND', 'Apr_MEA', 'Apr_US', 'Apr_PED', 'Apr_ACQ', 'May_APA', 'May_EUR', 'May_IND', 'May_MEA', 'May_US', 'May_PED', 'May_ACQ',
            'Jun_APA', 'Jun_EUR', 'Jun_IND', 'Jun_MEA', 'Jun_US', 'Jun_PED', 'Jun_ACQ', 'Jul_APA', 'Jul_EUR', 'Jul_IND', 'Jul_MEA', 'Jul_US', 'Jul_PED', 'Jul_ACQ',
            'Aug_APA', 'Aug_EUR', 'Aug_IND', 'Aug_MEA', 'Aug_US', 'Aug_PED', 'Aug_ACQ', 'Sep_APA', 'Sep_EUR', 'Sep_IND', 'Sep_MEA', 'Sep_US', 'Sep_PED', 'Sep_ACQ',
            'Oct_APA', 'Oct_EUR', 'Oct_IND', 'Oct_MEA', 'Oct_US', 'Oct_PED', 'Oct_ACQ', 'Nov_APA', 'Nov_EUR', 'Nov_IND', 'Nov_MEA', 'Nov_US', 'Nov_PED', 'Nov_ACQ',
            'Dec_APA', 'Dec_EUR', 'Dec_IND', 'Dec_MEA', 'Dec_US', 'Dec_PED', 'Dec_ACQ'], false);
        $scope.SCBillingNew = [];
        if (typeid == undefined || typeid == '') {
            typeid = [];
            angular.forEach($scope.Types, function (value, key) {
                typeid.push(value.TypeID);
            });
        }
        var allTypes = [];
        angular.forEach(typeid, function (value, key) {
            allTypes.push({ 'TypeId': value });
        });
        UserFactory.GetUsersByTypes(allTypes).success(function (data) {
            $scope.Users = data;
            $scope.scBillingNewInput.TypeId = typeid;
            MyDayFactory.GetSCBillingNewReport($scope.scBillingNewInput).success(function (billData) {
                if (billData.length > 0) {
                    BillingNewSum = billData;
                    UpdateSCBillingNewGrid();
                }
                else {
                    $scope.showBillingNewGrid = false;
                    toaster.pop('warning', "Warning", "Data is not available for this period", null);
                }
            }).error(function (error) {
                $scope.Error = error;
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.ExportSCBillingNew = function () {
        MyDayFactory.ExportToExcelSheet($scope.SCBillingNew).success(function (data) {
            //console.log(data);
            var url = BaseURL + 'ExportFiles/' + data.name;

            $scope.downloadurl = url;
            $scope.filename = data.name;
            setTimeout(function () {
                $('#downloadpdf')[0].click();
            }, 1000);

            toaster.pop('success', "Success", "SC Billing New Way Report exported successfully", null);
        }).error(function (error) {
            $scope.Error = error;
        });

    };

    function GetBillingValue(month, sbu, userid) {
        var allSBUEfforts = _.where(BillingNewSum, { UpdatedBy: userid, Month: month });
        var buEffort = 0;
        var buAllEffort = 0;
        var buTotalEffort = 0;
        var totalEffort = 0;
        var calcValue = 0;

        if (allSBUEfforts.length > 0) {
            angular.forEach(allSBUEfforts, function (value, key) {
                if (value.SBU == sbu)
                    buEffort = value.Efforts;
                if (value.SBU != 0 && value.SBU != 6)
                    buTotalEffort += value.Efforts;
                else
                    buAllEffort += value.Efforts;
                totalEffort += value.Efforts;
            });
            if (buAllEffort == 0 || totalEffort == 0 || buEffort == 0 || buTotalEffort == 0)
                calcValue = 0;
            else
                calcValue = 1 - ((buAllEffort / totalEffort) * (buEffort / buTotalEffort));
            if (allSBUEfforts[0].RoleId == 6 || allSBUEfforts[0].RoleId == 7 || allSBUEfforts[0].RoleId == 9) { //CSC Roles
                if (buAllEffort > 0 && totalEffort > 0)
                    calcValue += (buAllEffort / totalEffort) * (1 / 6) // 6 -> Number of SBUs
            }
            else {
                var BU = allSBUEfforts[0].BillingSBU.split(',');
                billsbu = parseInt(BU[0]);
                if (billsbu == sbu) {
                    calcValue += ((buAllEffort / totalEffort));
                }
            }
            calcValue = calcValue * 100;
            calcValue = calcValue.toFixed(2);
        }
        return calcValue + '%';
    };

    function UpdateSCBillingNewGrid() {
        $scope.SCBillingNew = [];
        var jsonRowShared = {};

        try {
            angular.forEach($scope.Users, function (user, key) {
                var lwdMonth = 0;
                var lwdYear = 0;
                var fwdMonth = 0;
                var fwdYear = 0;

                var isLWDValid = user.LastWorkingDate == null ? true : false;
                var isFWDValid = user.FirstWorkingDate == null ? true : false;

                if (!isLWDValid) {
                    var lwd = new Date(user.LastWorkingDate.split('T')[0]);
                    lwdMonth = lwd.getMonth() + 1;
                    lwdYear = lwd.getFullYear();
                    if ((lwdYear == $scope.scBillingNewInput.BillingPeriod && lwdMonth >= 4) || (lwdYear == $scope.scBillingNewInput.BillingPeriod + 1 && lwdMonth <= 3))
                        isLWDValid = true;
                }
                if (!isFWDValid) {
                    var fwd = new Date(user.FirstWorkingDate.split('T')[0]);
                    fwdMonth = fwd.getMonth() + 1;
                    fwdYear = fwd.getFullYear();
                    if (fwdYear < $scope.scBillingNewInput.BillingPeriod || (fwdYear == $scope.scBillingNewInput.BillingPeriod) || (fwdYear == $scope.scBillingNewInput.BillingPeriod + 1 && fwdMonth <= 3))
                        isFWDValid = true;
                }
                if (isLWDValid && isFWDValid) {
                    for (var i = 0; i < 12; i++) {
                        angular.forEach($scope.SBUs, function (value, key) {
                            var fieldName = GetKeyNameForSBU(i, value.SBU);
                            var fieldValue = '';
                            if ((fwdMonth == 0 && lwdMonth == 0) ||
                                (fwdMonth == 0 && ((lwdYear == $scope.scBillingNewInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                (fwdMonth == 0 && ((lwdYear == $scope.scBillingNewInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) ||
                                ((fwdYear < $scope.scBillingNewInput.BillingPeriod) && lwdMonth == 0) ||
                                ((fwdYear < $scope.scBillingNewInput.BillingPeriod) && ((lwdYear == $scope.scBillingNewInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                ((fwdYear < $scope.scBillingNewInput.BillingPeriod) && ((lwdYear == $scope.scBillingNewInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) ||
                                ((fwdYear == $scope.scBillingNewInput.BillingPeriod && (i >= fwdMonth - 1)) && (lwdMonth == 0)) ||
                                ((fwdYear == $scope.scBillingNewInput.BillingPeriod && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingNewInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                ((fwdYear == $scope.scBillingNewInput.BillingPeriod && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingNewInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) ||
                                ((fwdYear == $scope.scBillingNewInput.BillingPeriod + 1 && (fwdYear <= 3) && (i >= fwdMonth - 1)) && (lwdMonth == 0)) ||
                                ((fwdYear == $scope.scBillingNewInput.BillingPeriod + 1 && (fwdYear <= 3) && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingNewInput.BillingPeriod && lwdMonth >= 4) && (i >= 3 && i <= lwdMonth - 1))) ||
                                (fwdYear == $scope.scBillingNewInput.BillingPeriod + 1 && (fwdYear <= 3) && (i >= fwdMonth - 1)) && ((lwdYear == $scope.scBillingNewInput.BillingPeriod + 1) && (i >= 3 && i <= 11))) {
                                fieldValue = GetBillingValue(i + 1, value.id, user.userId);
                                jsonRowShared[fieldName] = fieldValue;
                            }
                            else {
                                fieldValue = '';
                                jsonRowShared[fieldName] = fieldValue;
                            }
                        });
                    }
                    jsonRowShared.UserName = user.UserName;
                    jsonRowShared.EmailId = user.EmailId;
                    var tempArray = JSON.parse(JSON.stringify(jsonRowShared));
                    $scope.SCBillingNew.push(tempArray);
                }
            });
            hideAllColumnsNew($scope.scBillingNewInput.Month);
            $scope.showBillingNewGrid = true;
            $scope.SCBillingNewGrid.api.setRowData($scope.SCBillingNew);
            $timeout(function () {
                $scope.SCBillingNewGrid.api.refreshView();
            }, 100);
        }
        catch (ex) {
            console.log('Error occurred: ' + ex);
        }
    };

    function hideAllColumnsNew(month) {
        switch (month) {
            case '01':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Jan_APA', 'Jan_EUR', 'Jan_IND', 'Jan_MEA', 'Jan_US', 'Jan_PED', 'Jan_ACQ'], true);
                break;
            case '02':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Feb_APA', 'Feb_EUR', 'Feb_IND', 'Feb_MEA', 'Feb_US', 'Feb_PED', 'Feb_ACQ'], true);
                break;
            case '03':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Mar_APA', 'Mar_EUR', 'Mar_IND', 'Mar_MEA', 'Mar_US', 'Mar_PED', 'Mar_ACQ'], true);
                break;
            case '04':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Apr_APA', 'Apr_EUR', 'Apr_IND', 'Apr_MEA', 'Apr_US', 'Apr_PED', 'Apr_ACQ'], true);
                break;
            case '05':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['May_APA', 'May_EUR', 'May_IND', 'May_MEA', 'May_US', 'May_PED', 'May_ACQ'], true);
                break;
            case '06':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Jun_APA', 'Jun_EUR', 'Jun_IND', 'Jun_MEA', 'Jun_US', 'Jun_PED', 'Jun_ACQ'], true);
                break;
            case '07':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Jul_APA', 'Jul_EUR', 'Jul_IND', 'Jul_MEA', 'Jul_US', 'Jul_PED', 'Jul_ACQ'], true);
                break;
            case '08':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Aug_APA', 'Aug_EUR', 'Aug_IND', 'Aug_MEA', 'Aug_US', 'Aug_PED', 'Aug_ACQ'], true);
                break;
            case '09':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Sep_APA', 'Sep_EUR', 'Sep_IND', 'Sep_MEA', 'Sep_US', 'Sep_PED', 'Sep_ACQ'], true);
                break;
            case '10':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Oct_APA', 'Oct_EUR', 'Oct_IND', 'Oct_MEA', 'Oct_US', 'Oct_PED', 'Oct_ACQ'], true);
                break;
            case '11':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Nov_APA', 'Nov_EUR', 'Nov_IND', 'Nov_MEA', 'Nov_US', 'Nov_PED', 'Nov_ACQ'], true);
                break;
            case '12':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Dec_APA', 'Dec_EUR', 'Dec_IND', 'Dec_MEA', 'Dec_US', 'Dec_PED', 'Dec_ACQ'], true);
                break;
            case 'All':
                $scope.SCBillingNewGrid.columnApi.setColumnsVisible(['Jan_APA', 'Jan_EUR', 'Jan_IND', 'Jan_MEA', 'Jan_US', 'Jan_PED', 'Jan_ACQ',
                    'Feb_APA', 'Feb_EUR', 'Feb_IND', 'Feb_MEA', 'Feb_US', 'Feb_PED', 'Feb_ACQ', 'Mar_APA', 'Mar_EUR', 'Mar_IND', 'Mar_MEA', 'Mar_US', 'Mar_PED', 'Mar_ACQ',
                    'Apr_APA', 'Apr_EUR', 'Apr_IND', 'Apr_MEA', 'Apr_US', 'Apr_PED', 'Apr_ACQ', 'May_APA', 'May_EUR', 'May_IND', 'May_MEA', 'May_US', 'May_PED', 'May_ACQ',
                    'Jun_APA', 'Jun_EUR', 'Jun_IND', 'Jun_MEA', 'Jun_US', 'Jun_PED', 'Jun_ACQ', 'Jul_APA', 'Jul_EUR', 'Jul_IND', 'Jul_MEA', 'Jul_US', 'Jul_PED', 'Jul_ACQ',
                    'Aug_APA', 'Aug_EUR', 'Aug_IND', 'Aug_MEA', 'Aug_US', 'Aug_PED', 'Aug_ACQ', 'Sep_APA', 'Sep_EUR', 'Sep_IND', 'Sep_MEA', 'Sep_US', 'Sep_PED', 'Sep_ACQ',
                    'Oct_APA', 'Oct_EUR', 'Oct_IND', 'Oct_MEA', 'Oct_US', 'Oct_PED', 'Oct_ACQ', 'Nov_APA', 'Nov_EUR', 'Nov_IND', 'Nov_MEA', 'Nov_US', 'Nov_PED', 'Nov_ACQ',
                    'Dec_APA', 'Dec_EUR', 'Dec_IND', 'Dec_MEA', 'Dec_US', 'Dec_PED', 'Dec_ACQ'], true);
                break;
        }
    }

    //-----------END-----------//

    //Initialize calls

    $scope.GetRightsList();
    $scope.GetTaskTypes();
    $scope.GetAllSBU();
    $scope.GetAllUsers();
    $scope.GetAllUserBillingSBU();
    $scope.IsUserSCHead();
    $scope.GetLockDate();
    $scope.GetUsersForMyDay();
    $scope.GetAllUserTypes();
});

'use strict';
ReportApp.factory('MyDayFactory', function ($http) {
    var MyDayURL = BaseURL + 'myday';
    var MyDayFactory = {};

    MyDayFactory.GetTaskTypes = function () {
        var result = $http.get(MyDayURL + '/GetTaskTypes');
        return result;
    }
    MyDayFactory.GetLockedDate = function () {
        var result = $http.get(MyDayURL + '/GetLockedDate');
        return result;
    }
    MyDayFactory.GetMyDay = function (userid) {
        var result = $http.get(MyDayURL + '/GetMyDay?userid=' + userid);
        return result;
    }
    MyDayFactory.GetYears = function () {
        var result = $http.get(MyDayURL + '/GetYears');
        return result;
    }
    MyDayFactory.GetHolidays = function (locationId, year) {
        var result = $http.get(MyDayURL + '/GetHolidays?locationId=' + locationId + '&year=' + year);
        return result;
    }
    MyDayFactory.SaveHolidays = function (hols) {
        var result = $http.post(MyDayURL + '/SaveHolidays', hols, {
            headers: {
                'Content-Type': false
            },
            transformRequest: hols,
            data: { file: hols }
        });
        return result;
    }
    MyDayFactory.GetAllDays = function () {
        var result = $http.get(MyDayURL + '/GetAllDays');
        return result;
    }
    MyDayFactory.GetWeekends = function (locationId) {
        var result = $http.get(MyDayURL + '/GetWeekends?locationId=' + locationId);
        return result;
    }
    MyDayFactory.SaveWeekends = function (weekends) {
        return $http.post(MyDayURL + '/SaveWeekends', weekends);
    }
    MyDayFactory.GetMyDayFromTaskId = function (taskId) {
        var result = $http.get(MyDayURL + '/GetMyDayFromTaskId?taskId=' + taskId);
        return result;
    }
    MyDayFactory.GetHolidaybetweendate = function (scUtilInput) {
        var result = $http.get(MyDayURL + '/GetHolidaybetweendate' + scUtilInput);
        return result;
    }
    MyDayFactory.GetHRMISLeave = function (userid, month, year) {
        var result = $http.get(MyDayURL + '/GetHRMISLeave?UserId=' + userid + '&Month=' + month + '&Year=' + year);
        return result;
    }
    MyDayFactory.SetHRMISLeave = function (hrmis) {
        return $http.post(MyDayURL + '/SetHRMISLeave', hrmis);
    }
    MyDayFactory.GetNewOpps = function (userid) {
        var result = $http.get(MyDayURL + '/GetNewOpps?userid=' + userid);
        return result;
    }
    MyDayFactory.GetMyDayOppIDsForUsers = function (users) {
        var result = $http.get(MyDayURL + '/GetMyDayOppIDsForUsers?Users=' + users);
        return result;
    }
    MyDayFactory.GetMyDayOppNamesForUsers = function (users) {
        var result = $http.get(MyDayURL + '/GetMyDayOppNamesForUsers?Users=' + users);
        return result;
    }
    MyDayFactory.GetTaskDetailsReport = function (taskdetails) {
        var result = $http.post(MyDayURL + '/GetTaskDetailsReport', taskdetails);
        return result;
    }
    MyDayFactory.GetSCUtilizationReport = function (scUtilInput) {
        var result = $http.post(MyDayURL + '/GetSCUtilizationReport', scUtilInput);
        return result;
    }
    MyDayFactory.GetSCUtilizationWeeklyReport = function (scUtilInput) {
        var result = $http.post(MyDayURL + '/GetSCUtilizationWeeklyReport', scUtilInput);
        return result;
    }
    MyDayFactory.GetHolidaybetweendate = function (scUtilInput) {
        var result = $http.post(MyDayURL + '/GetHolidaybetweendate', scUtilInput);
        return result;
    }
    MyDayFactory.GetSCBillingReport = function (scBillingInput) {
        var result = $http.post(MyDayURL + '/GetSCBillingReport', scBillingInput);
        return result;
    }
    MyDayFactory.GetSCBillingNewReport = function (scBillingNewInput) {
        var result = $http.post(MyDayURL + '/GetSCBillingNewReport', scBillingNewInput);
        return result;
    }
    MyDayFactory.GetSCBillingTotal = function (scBillingInput) {
        var result = $http.post(MyDayURL + '/GetSCBillingTotal', scBillingInput);
        return result;
    }
    MyDayFactory.GetUsersBillingID = function (scBillingInput) {
        var result = $http.post(MyDayURL + '/GetUsersBillingID', scBillingInput);
        return result;
    }
    MyDayFactory.SetLock = function (lockdate) {
        return $http.post(MyDayURL + '/SetReleaseLock', lockdate);
    }
    MyDayFactory.ReleaseLock = function () {
        return $http.post(MyDayURL + '/SetReleaseLock');
    }
    MyDayFactory.SaveSubmitMyDay = function (myday) {
        return $http.post(MyDayURL + '/SaveSubmitMyDay', myday);
    }
    MyDayFactory.UpdateNewOpp = function (newopp) {
        return $http.post(MyDayURL + '/UpdateNewOpp', newopp);
    }
    MyDayFactory.DeleteTask = function (taskid) {
        return $http.post(MyDayURL + '/DeleteTask', taskid);
    }
    MyDayFactory.EditTask = function (task) {
        return $http.post(MyDayURL + '/EditTask', task);
    }
    MyDayFactory.GetTaskSummaryReport = function (taskSummary) {
        var result = $http.post(MyDayURL + '/GetTaskSummaryReport', taskSummary);
        return result;
    }
    MyDayFactory.ExportToExcelSheet = function (scbill) {
        var result = $http.post(MyDayURL + '/ExportToExcelSheet', scbill);
        return result;
    }
    return MyDayFactory;
});