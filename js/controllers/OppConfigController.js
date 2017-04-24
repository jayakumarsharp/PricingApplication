ReportApp.controller('OppConfigController', function ($scope, $rootScope, UserFactory, OppFactory, Opportunityservice, toaster, $timeout) {
    $scope.SBU = [];
    $scope.Region = [];
    $scope.opp = {};
    $scope.OpportunityConfigurationDetail = {};
    
    $scope.GetOppConfig = function (SBUID, CountryId) {
        if (SBUID != null && SBUID != undefined && CountryId != null && CountryId != undefined) {
            Opportunityservice.GetOpportunityConfigBySBU(SBUID, CountryId).success(function (data) {
                if (data[0] != undefined)
                    $scope.OpportunityConfigurationDetail = data[0];
                else {
                    $scope.OpportunityConfigurationDetail = {};
                    $scope.OpportunityConfigurationDetail.SBU = SBUID;
                    $scope.OpportunityConfigurationDetail.Region = CountryId;
                }
            }).error(function (error) {
                $scope.Error = error;
            });
        }
        else{
            //$scope.opp = {};
             $scope.OpportunityConfigurationDetail = {};
        }
    }; 

    $scope.AddOppConfig = function (config) {
        var configuration = [];
        if (config != null) {
            configuration.push(config);
            Opportunityservice.AddOppConfig(configuration).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {
                    $scope.opp = {};
                    $scope.OpportunityConfigurationDetail = {};
                    toaster.pop('success', "Success", "Configuration added successfully", null);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while updating Configuration!", null);
                $scope.error = "An Error has occured while Adding OppConfig! " + data.ExceptionMessage;
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

    $scope.RefreshRegion = function (sbuid) {
        if (sbuid != '') {
            OppFactory.GetAllCountry().success(function (data) {
                $scope.Region = [];
                //$scope.OpportunityConfigurationDetail = {};
                angular.forEach(data, function (value, key) {
                    if (value.SBUId == sbuid) {
                        $scope.Region.push(value);
                    }
                });                
            }).error(function (error) {
                $scope.Error = error;
            });
        }
    };
    $scope.GetAllSBU();  
});


