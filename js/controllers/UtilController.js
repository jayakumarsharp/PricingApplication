ReportApp.controller('UtilController', function ($scope, $rootScope, reportFactory) {

  $scope.UtilImagesPath = View360ImagesPath + 'Utilities/';  
  $scope.EstImagesPath  = View360ImagesPath+ 'Estimation/';
  $scope.showCurrencyRate = false;
  $scope.showPriceSheetLock = false;
  $scope.showVendorMgmt = false;
  $scope.showProductMgmt = false;
  $scope.showMergeOpp = false;
  $scope.showDiscount = false;
  $scope.showMargin = false;
  $scope.showMilestone = false;
  $scope.showPaymentMgmt = false;
  $scope.showEmailConfig = false;
  $scope.showLoggedInUsers = false;
  $scope.showOppConfig = false;
  $scope.showMyDay = false;
  $scope.showTaskType = false;
  $scope.showUserHierarchy = false;
  $scope.showMyDayReports = false;
  $scope.showHRMISLeaves = false;
  $scope.showHolidayCalendar = false;
  $scope.showWeekendLeaves = false;
  $scope.showLocation = false;
  $scope.showBaseSkill = false;
  $scope.showBillingConfig = false;


  $scope.GetRightsList = function () {
        reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName.contains('Currency Rate')) {
                      $scope.showCurrencyRate = true;
                }
                else if (value.RightName == 'Pricing Sheet Lock Status') {
                    $scope.showPriceSheetLock = true;
                }
                else if (value.RightName == 'Vendor Management') {
                    $scope.showVendorMgmt = true;
                }
                else if (value.RightName == 'Product Management') {
                    $scope.showProductMgmt = true;
                }
                else if (value.RightName == 'Merge Opportunity') {
                    $scope.showMergeOpp = true;
                }
                else if (value.RightName == 'Discount Management') {
                    $scope.showDiscount = true;
                }
                else if (value.RightName == 'Margin Management') {
                    $scope.showMargin = true;
                }
                else if (value.RightName == 'Payment Milestone') {
                    $scope.showMilestone = true;
                }
                else if (value.RightName == 'Payment Management') {
                    $scope.showPaymentMgmt = true;
                }
                else if (value.RightName == 'Email Management') {
                    $scope.showEmailConfig = true;
                }
                else if(value.RightName == 'Find Logged-In Users'){
                    $scope.showLoggedInUsers = true;                    
                }
                else if(value.RightName == 'Opportunity Config'){
                    $scope.showOppConfig = true;                    
                }
                else if(value.RightName == 'My Day'){
                    $scope.showMyDay = true;                    
                }
				else if (value.RightName == 'TaskType Management') {
                    $scope.showTaskType = true;
                }
                else if(value.RightName == 'User Hierarchy'){
                    $scope.showUserHierarchy = true;
                }
                else if(value.RightName == 'SC Billing Report'){
                    $scope.showMyDayReports = true;                    
                }
                else if(value.RightName == 'SC Utilization Report'){
                    $scope.showMyDayReports = true;                    
                }
                else if(value.RightName == 'HRMIS Leaves'){
                    $scope.showHRMISLeaves = true;                    
                }
                else if(value.RightName == 'Holiday Calendar'){
                    $scope.showHolidayCalendar = true;                    
                }
                else if(value.RightName == 'Weekend Leaves'){
                    $scope.showWeekendLeaves = true;           
                }
                else if (value.RightName == 'Location') {
                    $scope.showLocation = true;
                }
                else if (value.RightName == 'BaseSkill') {
                    $scope.showBaseSkill = true;
                }
                else if (value.RightName == 'MyDay Billing Configuration') {
                    $scope.showBillingConfig = true;
                }
            })           
        });
    }
    
    $scope.GetRightsList();
});

