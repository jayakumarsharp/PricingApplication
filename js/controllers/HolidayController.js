agGrid.initialiseAgGridWithAngular1(angular);
ReportApp.controller('HolidayController', function (Upload, $window, $scope, $rootScope, UserFactory, MyDayFactory, toaster, $timeout, HolidayFactory, _) {


    $scope.submit = function () { //function to call on form submit
        if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
            $scope.upload($scope.file); //call upload function
        }
    }

    $scope.upload = function (file) {
        Upload.upload({
            url: BaseURL + 'FileUploads/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                console.log(resp.data)
                toaster.pop('success', "Success", "Holiday calender uploaded successfully", null);
                GetAllLocations();
                GetAllDays();
                GetYears();

            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };



    $scope.GetData = function (year, locId) {

        if (locId != null && locId != undefined && year != null && year != undefined) {
            HolidayFactory.GetHolidayCalender(year, locId).success(function (data) {
                var data = _.each(data, function (someThing) {
                    someThing.Date = moment(someThing.Date).format('MM/DD/YYYY');
                })

                $scope.HolidayGrid.api.setRowData(data);
            }).error(function (error) {
                $scope.Error = error;
            });

        }
        else {
            $scope.HolidayGrid.api.setRowData(null);
        }
    }


    $scope.Days = [];
    $scope.Years = [];
    $scope.Locations = [];
    $scope.Weekends = {};
    $scope.holiday = {};
    $scope.showHoliday = false;



    function GetAllLocations() {
        UserFactory.GetAllLocations().success(function (data) {
            $scope.Locations = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    function GetAllDays() {
        MyDayFactory.GetAllDays().success(function (data) {
            $scope.Days = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    function GetYears() {
        MyDayFactory.GetYears().success(function (data) {
            $scope.Years = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetWeekends = function (locationId) {
        var temp = [];
        $scope.Weekends.Days = [];
        MyDayFactory.GetWeekends(locationId).success(function (data) {  
            angular.forEach(data, function (selectedVal, selkey) {
                angular.forEach($scope.Days, function (masterVal, maskey) {
                    if(selectedVal.DayId == masterVal.Id){
                        $scope.Weekends.Days.push(masterVal);
                    }
                });
            });          
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.SaveWeekends = function () {
        var LocWeekend = [];
        angular.forEach($scope.Weekends.Days, function (value, key) {
            LocWeekend.push({ 'LocationId': $scope.Weekends.LocationId, 'DayId': value.Id });
        });
        MyDayFactory.SaveWeekends(LocWeekend).success(function (data) {
            $scope.Weekends = {};
            toaster.pop('success', "Success", "Weekends configured successfully", null);
        }).error(function (error) {
            toaster.pop('error', "Error", "Failed to configure weekends for this location", null);
            console.log('Error occurred when saving Weekends: ' + error);
            $scope.Error = error;
        });
    };

    $scope.UploadHoliday = function (files) {
        var fd = new FormData();
        fd.append("file", files[0]);
        MyDayFactory.SaveHolidays(fd).success(function (data) {
            toaster.pop('success', "Success", "Holiday Calendar uploaded successfully", null);
        }).error(function (error) {
            toaster.pop('error', "Error", "Failed to upload Holiday Calendar for this location", null);
            console.log('Error occurred when saving Holiday Calendar: ' + error);
        });
    };

    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.HolidayGrid.api.sizeColumnsToFit();
        }, 1000);
    });

    var columnDefs = [
        { headerName: 'Date', field: 'Date', width: 70, cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
        { headerName: 'Holiday Description', width: 250, field: 'Holiday', cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' } },
    ];

    $scope.HolidayGrid = {
        angularCompileRows: true,
        columnDefs: columnDefs,
        suppressHorizontalScroll: true,
        suppressCellSelection: true,
        rowData: [],
        onGridReady: function (event) {
            $scope.HolidayGrid.api.sizeColumnsToFit();
        }
    };

    //Initialize Calls
    GetAllLocations();
    GetAllDays();
    GetYears();
});


ReportApp.factory('HolidayFactory', function ($http) {
    var MyDayURL = BaseURL + 'HolidayCalender';
    var HolidayFactory = {};

    HolidayFactory.GetHolidayCalender = function (year, locid) {
        var result = $http.get(MyDayURL + '/GetAllHolidayCalenderUpload?locationid=' + locid + '&Year=' + year);
        return result;
    }
    HolidayFactory.GetHoliday = function (locid, fromYr, toYr) {
        var result = $http.get(MyDayURL + '/GetHolidayCalender?locationid=' + locid + '&fromYear=' + fromYr + '&toYear=' + toYr);
        return result;
    }
    return HolidayFactory;
});