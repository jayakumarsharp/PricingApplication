ReportApp.controller("OpportunityPriceController", function ($window, $scope, $http, OpportunityPriceservice) {

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
        $location.path("PriceList/" + oppId + "/" + groupId);
    }

});



ReportApp.factory('OpportunityPriceservice', function ($http) {

    var Homeurl = BaseURL;

    var OpportunityPriceservice = {
        GetAllOpportunityVersion: function () {
            var result = $http.get(Homeurl + 'price/GetAllOpportunityVersion');
            return result;
        },
    };

    return OpportunityPriceservice;
});

