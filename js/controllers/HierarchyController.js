ReportApp.controller('HierarchyController', function ($scope, $rootScope, UserFactory, toaster, $timeout, _) {
    $scope.data = [];
    $scope.UsersToAdd = [];
    $scope.SelectedUsers = [];
    $scope.User = {};
    $scope.rootUser = {};
    $scope.tempDataNode = [];
    $scope.UserHierarchy = [];
    var HierData;
    var HierNode = {};
    var setRootOperation = false;

    $scope.addUserGrid = {
        columnDefs: [
            { headerName: "UserID", field: "Userid", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
            { headerName: "Name", field: "UserName", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
            { headerName: "Email", field: "EmailId", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
            {
                headerName: "", field: "chkAddUser", checkboxSelection: true, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
                cellRenderer: function (params) {
                    if ($scope.SelectedUsers.length > 0) {
                        angular.forEach($scope.SelectedUsers, function (value, key) {
                            if (params.data.Userid == value.Userid) {
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
        }
    };

    $scope.chkChanged = function (event) {
        var isAddedAlready = false;
        if (event.selected == true) {
            angular.forEach($scope.SelectedUsers, function (value, key) {
                if (event.data.Userid == value.Userid) {
                    isAddedAlready = true;
                }
            });
            if (!isAddedAlready)
                $scope.SelectedUsers.push(event.data);
        }
        else {
            for (var i = $scope.SelectedUsers.length - 1; i >= 0; i--) {
                if ($scope.SelectedUsers[i].Userid == event.data.Userid) {
                    $scope.SelectedUsers.splice(i, 1);
                }
            }
        }
    };

    $scope.cancel = function () {
        $scope.SelectedUsers = [];
        $('#usersToAdd').modal('hide');
    };

    $scope.showSelectedUsers = function (isChecked) {
        if (isChecked) {
            console.log('setting row data');
            $scope.addUserGrid.api.setRowData($scope.SelectedUsers);
            $timeout(function () {
                $scope.addUserGrid.api.refreshView();
            }, 100);
        }
        else {
            $scope.addUserGrid.api.setRowData($scope.UsersToAdd);
            $timeout(function () {
                $scope.addUserGrid.api.refreshView();
            }, 100);
        }
    };

    $scope.AddUsers = function () {
        if (setRootOperation == true) {
            if ($scope.SelectedUsers.length == 1) {

                $scope.rootUser.UserName = $scope.SelectedUsers[0].UserName;
                $scope.rootUser.UserId = $scope.SelectedUsers[0].Userid;

                var addroot = {};
                addroot.UserId = '';
                addroot.Reportee = $scope.rootUser.UserId;

                var temp = [];
                temp.push(addroot);
                UserFactory.AddUserHierarchy(temp).success(function (data) {
                    $scope.data = [{ name: $scope.rootUser.UserName, userid: $scope.rootUser.UserId, nodes: [] }];
                    var treejson = { TreeJSON: JSON.stringify($scope.data) };
                    UserFactory.UpdateHierarchyJSON(treejson).success(function (data) {
                        toaster.pop('success', "Success", "Nodes updated successfully", null);
                    }).error(function (error) {
                        $scope.Error = error;
                    });
                    $('#usersToAdd').modal('hide');
                }).error(function (error) {
                    $scope.Error = error;
                });
            }
            else {
                toaster.pop('warning', "Warning", "Select only 1 root user", null);
            }
        }
        else {
            if ($scope.SelectedUsers.length > 0) {
                var temp = [];
                angular.forEach($scope.SelectedUsers, function (value, key) {
                    $scope.tempDataNode.nodes.push({ 'name': value.UserName, 'userid': value.Userid, 'nodes': [] });
                    temp.push({ UserId: $scope.User.userid, Reportee: value.Userid });
                });
                UserFactory.AddUserHierarchy(temp).success(function (data) {
                    $('#usersToAdd').modal('hide');
                }).error(function (error) {
                    $scope.Error = error;
                });
            }
            else {
                toaster.pop('warning', "Warning", "There are no users selected", null);
            }
            var treejson = { TreeJSON: JSON.stringify($scope.data) };
            UserFactory.UpdateHierarchyJSON(treejson).success(function (data) {
                toaster.pop('success', "Success", "Nodes updated successfully", null);
            }).error(function (error) {
                $scope.Error = error;
            });
        }
    };

    $scope.ShowUserList = function (node) {
        if (node != undefined) {
            setRootOperation = false;
            $scope.tempDataNode = node;
            UserFactory.GetUsersToAddInHierarchy().success(function (data) {
                $scope.UsersToAdd = data;
                $scope.User = node;
                $scope.SelectedUsers = [];
                $('#usersToAdd').modal('show');
                $scope.addUserGrid.api.setRowData($scope.UsersToAdd);
                $timeout(function () {
                    $scope.addUserGrid.api.refreshView();
                }, 500);
            }).error(function (error) {
                $scope.Error = error;
            });
        }
        else {
            setRootOperation = true;
            UserFactory.GetUsersToAddInHierarchy().success(function (data) {
                $scope.UsersToAdd = data;
                $scope.SelectedUsers = [];
                $('#usersToAdd').modal('show');
                $scope.addUserGrid.api.setRowData($scope.UsersToAdd);
                $timeout(function () {
                    $scope.addUserGrid.api.refreshView();
                }, 500);
            }).error(function (error) {
                $scope.Error = error;
            });
        }
    };

    $scope.showConfirm = function(data, node){
         HierData = data;
         HierNode = node;
         $('#confirmModal').modal('show');
    };


    $scope.delete = function () {
        $scope.remove(HierData);
        if(HierData.length == 0){
            $scope.rootUser = {};
        }
        var treejson = { TreeJSON: JSON.stringify($scope.data) };
        var mainuser = { UserId: HierNode.userid}
        UserFactory.UpdateHierarchyJSON(treejson).success(function (data) {
            UserFactory.DeleteUserHierarchy(mainuser).success(function (data) {
                toaster.pop('success', "Success", "Nodes deleted successfully", null);
                $('#confirmModal').modal('hide');
            }).error(function (error) {
                $scope.Error = error;
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    }; 

    $scope.ClearHierarchy = function () {
        UserFactory.UpdateHierarchyJSON().success(function (data) {
            $scope.data = [];
            $scope.rootUser = {};
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetHierarchy = function () {
        UserFactory.GetHierarchyJSON().success(function (data) {
            if (data == null) {
                $scope.data = [];
            }
            else {
                $scope.data = JSON.parse(data.TreeJSON);
            }
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };

    $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        });
    };

    $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
    };

    $scope.data = [{
        'id': 1,
        'title': 'node1',
        'nodes': [
            {
                'id': 11,
                'title': 'node1.1',
                'nodes': [
                    {
                        'id': 111,
                        'title': 'node1.1.1',
                        'nodes': []
                    }
                ]
            },
            {
                'id': 12,
                'title': 'node1.2',
                'nodes': []
            }
        ]
    }];


    $scope.GetHierarchy();
});


// (function () {
//   'use strict';

//     ReportApp.controller('HierarchyController', ['$scope', function ($scope) {

//     }]);

// }());


