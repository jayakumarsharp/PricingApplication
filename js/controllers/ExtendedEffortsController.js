ReportApp.controller('ExtendedEffortsController', function ($scope, $rootScope,Opportunityservice, toaster, $timeout) {
    $scope.SBU = [];
    $scope.Region = [];
    $scope.opp = {};
    $scope.OpportunityConfigurationDetail = {};
    
    $scope.GetExtendedEfforts = function () {
            Opportunityservice.GetExtendedEfforts().success(function (data) {
                if (data[0] != undefined)
                    $scope.OpportunityConfigurationDetail = data[0];
                else {
                    $scope.OpportunityConfigurationDetail = {};
                   
                }
            }).error(function (error) {
                $scope.Error = error;
            });
    }; 

    $scope.AddExtendedEfforts = function (config) {
        if (config != null) {
            Opportunityservice.AddExtendedEfforts(config).success(function (data) {
                if (data.Error != undefined) {
                    toaster.pop('error', "Error", data.Error, null);
                } else {
                    
                    toaster.pop('success', "Success", "Configuration added successfully", null);
                }
            }).error(function (data) {
                toaster.pop('error', "Error", "An Error has occured while updating Configuration!", null);
                $scope.error = "An Error has occured while Adding OppConfig! " + data.ExceptionMessage;
            });
        }
    };

 

 
    $scope.GetExtendedEfforts();  
});


