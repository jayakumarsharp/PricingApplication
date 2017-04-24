ReportApp.controller('EmailConfigurationController', function ($scope, $rootScope, emailService, toaster, $timeout, UserFactory) {
    $scope.email = {};
    $scope.SBU = [];

    $scope.GetEmails = function (bu, group, level) {
        if (bu != '' && bu != undefined && group != '' && group != undefined && level != '' && level != undefined) {
            emailService.GetEmails(bu, group, level).success(function (data) {
                if (data.length > 0) {
                    if (data[0].Emails != null && data[0].Emails != '') {
                        $scope.listB = data[0].Emails.split(',');
                        var unselectedEmails = JSON.parse(JSON.stringify($scope.Emails));
                        $scope.listA = unselectedEmails.filter(function (el) {
                            return $scope.listB.indexOf(el) < 0;
                        });
                    }
                    else {
                        $scope.listA = JSON.parse(JSON.stringify($scope.Emails));
                        $scope.listB = [];
                    }
                }
                else {
                    $scope.listA = JSON.parse(JSON.stringify($scope.Emails));
                    $scope.listB = [];
                }
            }).error(function (error) {
                $scope.Error = error;
            });
        }
        else {
            $scope.listA = [];
            $scope.listB = [];
        }
    };

    $scope.AddEmails = function (email) {
        email.EmailIDs = '';
        angular.forEach($scope.listB, function (value, key) {
            email.EmailIDs = email.EmailIDs + value + ',';
        });
        email.EmailIDs = email.EmailIDs.replace(/,\s*$/, "");
        emailService.AddEmails(email).success(function (data) {
            // $scope.email = {};
            // $scope.listA = [];
            // $scope.listB = [];
            toaster.pop('success', "Success", "Email list added successfully", null);
        }).error(function (error) {
            $scope.Error = error;
            toaster.pop('error', "Error", "Failed to add the email list", null);
        });
    };

    // --- DUAL LIST --- //
    // init
    $scope.Emails = [];
    $scope.selectedA = [];
    $scope.selectedB = [];

    $scope.listA = [];
    $scope.listB = [];

    $scope.checkedA = false;
    $scope.checkedB = false;

    function reset() {
        $scope.selectedA = [];
        $scope.selectedB = [];
    }

    $scope.GetAllEmails = function () {
        emailService.GetUserEmails().success(function (data) {
            angular.forEach(data, function (value, key) {
                if (emailArrayObjectIndexOf(value.EmailId) == -1)
                    $scope.Emails.push(value.EmailId);
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    }

    function emailArrayObjectIndexOf(searchTerm) {
        for (var i = 0, len = $scope.Emails.length; i < len; i++) {
            if ($scope.Emails[i] == searchTerm) {
                return i;
            }
        }
        return -1;
    }

    function arrayObjectIndexOf(myArray, searchTerm) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i] == searchTerm) {
                return i;
            }
        }
        return -1;
    }

    $scope.stateBChanged = function (isChecked, emailId) {
        if (isChecked == true) {
            $scope.selectedB.push(emailId);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedB, emailId);
            $scope.selectedB.splice(delId, 1);
        }
    }
    $scope.stateAChanged = function (isChecked, emailId) {
        if (isChecked == true) {
            $scope.selectedA.push(emailId);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedA, emailId);
            $scope.selectedA.splice(delId, 1);
        }
    }

    $scope.AlltoA = function () {
        if ($scope.selectedA.length == 0) {
            $scope.selectedB = [];
            angular.forEach($scope.listB, function (value, key) {
                $scope.selectedB.push(value);
            })
            $scope.bToA();
        }
    }

    $scope.AlltoB = function () {
        if ($scope.selectedB.length == 0) {
            $scope.selectedA = [];
            angular.forEach($scope.listA, function (value, key) {
                $scope.selectedA.push(value);
            })
            $scope.aToB();
        }
    }

    $scope.aToB = function () {
        console.log('a to b');
        if ($scope.selectedB.length == 0) {
            var items = JSON.parse(JSON.stringify($scope.Emails));
            for (var i = 0; i < $scope.selectedA.length; i++) {
                var moveId = arrayObjectIndexOf(items, $scope.selectedA[i]);
                $scope.listB.push(items[moveId]);
                var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i]);
                $scope.listA.splice(delId, 1);
                console.log('list A count after: ' + $scope.listA.length);
                console.log('list B count after: ' + $scope.listB.length);
            }
            reset();
        }
    };

    $scope.bToA = function () {
        console.log('b to a');
        if ($scope.selectedA.length == 0) {
            var items = JSON.parse(JSON.stringify($scope.Emails));
            for (var i = 0; i < $scope.selectedB.length; i++) {
                var moveId = arrayObjectIndexOf($scope.Emails, $scope.selectedB[i]);
                $scope.listA.push(items[moveId]);
                var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i]);
                $scope.listB.splice(delId, 1);
                console.log('list B count after: ' + $scope.listB.length);
                console.log('list A count after: ' + $scope.listA.length);
            }
            reset();
        }
    };
    // --- END DUAL LIST --- //

    $scope.GetAllSBU = function () {
        UserFactory.GetAllSBU().success(function (data) {
            angular.forEach(data, function (value, key) {
                if (value.SBU != 'All') {
                    $scope.SBU.push(value);
                }
            });
            console.log($scope.SBU);
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAllSBU();
    $scope.GetAllEmails();
});

ReportApp.factory('emailService', function ($http, $q) {
    var userurl = BaseURL + 'users';
    var emailurl = BaseURL + 'email';
    var emailService = {
        GetEmails: function (bu, group, level) {
            return $http.get(emailurl + '/?bu=' + bu + '&group=' + group + '&level=' + level);
        },
        AddEmails: function (email) {
            return $http.post(emailurl + '/Add/', { emails: email });
        },
        GetUserEmails: function () {
            return $http.get(userurl + '/email');
        }
    };
    return emailService;
});

