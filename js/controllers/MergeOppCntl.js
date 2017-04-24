

$(document).ready(function () {
    function closeMessage() {
        setTimeout(function () {
            $('#mergestatus').hide();
            $('#mergestatus').fadeOut('fast');
        }, 6000);
    }
});

ReportApp.controller('MergeOppCntl', function ($scope, $rootScope, OppFactory, Opportunityservice, toaster) {
    $scope.MergeOpportunityDetail = {
        manualOppertunity: 0,
        cmsOppertunity: 0
    };
    $scope.MergeOpportunityDetailData = {};
    $scope.CreateManualOpportunity = function (ManualOpportunityData) {
        OppFactory.SaveManualOpportunity(ManualOpportunityData).success(function () {
            //   $scope.GetOpportunityForUser($rootScope.UserInfo.user.userId);

        }).error(function (err) {
            alert('Unable to create Opportunity');
        })
        var url = urltype + "//" + $window.location.host + HostPath + "/index.html";
        $window.location.href = url;
    };

    $scope.refreshCMSOpportunity = function () {
        var selectedSBU = 0;
        var allOpportunity = null;
        if ($scope.MergeOpportunityDetail.manualOppertunity != '' && $scope.MergeOpportunityDetail.manualOppertunity != undefined) {
            OppFactory.GetAllOpportunity().success(function (data) {
                allOpportunity = data;
                angular.forEach(data, function (value, key) {
                    if (value.id == $scope.MergeOpportunityDetail.manualOppertunity) {
                        selectedSBU = value.SBUId;
                        Opportunityservice.GetCountryById(value.CountryId).success(function (country) {
                            $scope.MergeOpportunityDetailData = value;
                            $scope.MergeOpportunityDetailData.CountryName = country.CountryName;
                        }).error(function (error) {
                            $scope.Error = error;
                        })
                    }
                });

                if (selectedSBU != 0) {
                    $scope.cmsOppertunity = [];
                    angular.forEach(allOpportunity, function (value, key) {
                        if (value.IsManual != 1 && value.IsActive != 0 && selectedSBU == value.SBUId) {
                            $scope.cmsOppertunity.push(value);
                        }
                    });
                }
            }).error(function (error) {
                $scope.Error = error;
            })
        }
        else {
            $scope.MergeOpportunityDetail = {};
            $scope.MergeOpportunityDetailData = {};
        }
    }

    $scope.MergeOpportunity = function (MergeOpportunityDetail) {
        var merge = { 'oppID': MergeOpportunityDetail.cmsOppertunity, 'ManualoppID': MergeOpportunityDetail.manualOppertunity, 'ActualOppID': MergeOpportunityDetail.cmsOppertunity, 'MergedBy': $rootScope.UserInfo.user.userId };
        OppFactory.MergeManualOpportunity(merge).success(function (data) {
            $scope.MergeOpportunityDetailData = {};
            $scope.GetAllOpportunityDetail();
            toaster.pop('success', "Success", "Opportunity merged successfully", null);
            // $("#mergestatus").show();
            // setTimeout(function () {
            //     $('#mergestatus').fadeOut('fast');
            // }, 3000);
        }).error(function (error) {
            toaster.pop('error', "Error", "Unable to merge the opportunities", null);
        })
    };

    $scope.GetAllOpportunityDetail = function () {
        $scope.manualOppertunity = [];
        $scope.cmsOppertunity = [];
        console.log('GetAllOpportunity..');
        OppFactory.GetAllOpportunity().success(function (data) {
            angular.forEach(data, function (value, key) {
                if (value.IsManual == 1 && value.IsActive != 0) {
                    $scope.manualOppertunity.push(value);
                }
                else {
                    //  $scope.cmsOppertunity.push(value);
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.cancel = function () {
        $scope.MergeOpportunityDetail = {};
        $scope.MergeOpportunityDetailData = {};
    };

    $scope.GetAllOpportunityDetail();
});