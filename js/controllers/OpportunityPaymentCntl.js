ReportApp.controller("OpportunityPaymentController", function ($window, $scope, $http, OpportunityPriceservice) {

    $scope.opportunities = [];

    $scope.GetAllOpportunityVersion = function () {
        OpportunityPriceservice.GetAllOpportunityVersion().success(function (data) {
            $scope.opportunities = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetAllOpportunityVersion();

    $scope.RedirectToPrice = function (oppId, groupId) {
        $location.path("PaymentList/" + oppId + "/" + groupId);
    }

});


