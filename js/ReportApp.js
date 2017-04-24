var ReportApp = angular.module('reportApp', ['ngRoute', 'ui.tree', 'userApp', 'homeApp', 'roleApp', 'ui.bootstrap', 'agGrid', 'angular.filter', 'profileApp', 'timer', 'toaster', 'ngMessages', 'ngFileUpload']);
ReportApp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider',
    function ($routeProvider, $locationProvider, $httpProvider, $compileProvider) {
        $compileProvider.debugInfoEnabled(false);
        $httpProvider.interceptors.push('authInterceptor');
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        $httpProvider.defaults.headers.get['-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        var UserInfo = window.sessionStorage.getItem('userAuth');

        if (UserInfo != undefined || UserInfo != null) {

            $routeProvider
                .when('/ProjectMarginAdmin', {
                    controller: 'ProjectMarginAdminController',
                    templateUrl: 'js/views/Utilities/ProjectMarginAdminMgmt.html'
                })
                .when('/CommonPricing/:OppId/:GroupId', {
                    controller: 'CommonPriceController',
                    templateUrl: 'js/views/CommonPricing.html'
                })
                .when('/OppSiteConfig/:OppId/:GroupId', {
                    controller: 'OpportunitySiteController',
                    templateUrl: 'js/views/Day/OpportunityControlSiteDetails.html'
                })
                .when('/TandEResourcePSResource/:OppId/:GroupId', {
                    controller: 'TandEResourcePSResourceController',
                    templateUrl: 'js/views/TandEResource/TandEResourceResources.html'
                })
                .when('/OpportunityRate', {
                    controller: 'OpportunityRateController',
                    templateUrl: 'js/views/Utilities/OpportunityRate.html'
                })
                .when('/ManualEstimationType', {
                    controller: 'ManualEstimationTypeController',
                    templateUrl: 'js/views/Utilities/ManualEstimationType.html'
                })
                .when('/Selection', {
                    controller: 'SelectionController',
                    templateUrl: 'js/views/Utilities/Selection.html'
                })
                .when('/EstimationSDLC', {
                    controller: 'EstimationSDLCController',
                    templateUrl: 'js/views/Estimation/EstimationSDLC.html'
                })
                .when('/SDLCResource', {
                    controller: 'EstimationSDLCResourceController',
                    templateUrl: 'js/views/Estimation/EstimationSDLCResource.html'
                })
                .when('/OpportunityEstimationSDLC/:OppId', {
                    controller: 'OpportunityEstimationSDLCController',
                    templateUrl: 'js/views/Estimation/OpportunityEstimationSDLC.html'
                })
                .when('/DaySheet/:OppId/:GroupId', {
                    controller: 'DaySheetController',
                    templateUrl: 'js/views/Day/PS.html'
                })
                .when('/Resource/:OppId/:GroupId', {
                    controller: 'ResourceController',
                    templateUrl: 'js/views/Resource/Resourcing.html'
                })
                .when('/TandEPS/:OppId/:GroupId', {
                    controller: 'ResourceController',
                    templateUrl: 'js/views/TandE/PS.html'
                })
                .when('/TandEResource/:OppId/:GroupId', {
                    controller: 'ResourceController',
                    templateUrl: 'js/views/TandE/Resource.html'
                })
                .when('/home', {
                    controller: 'HomeController', templateUrl: 'js/views/Home.html'
                })
                .when('/Users', {
                    controller: 'UserController', templateUrl: 'js/views/Users/Users.html'
                })
                .when('/Roles', {
                    controller: 'RoleController', templateUrl: 'js/views/Users/Roles.html'
                })
                .when('/OEMList', {
                    controller: 'OemController', templateUrl: 'js/views/Users/OEMList.html'
                })
                .when('/profile', {
                    controller: 'ProfileController', templateUrl: 'js/views/Users/Profile.html'
                })
                .when('/Utilities', {
                    templateUrl: 'js/views/Utilities.html'
                })
                .when('/OpportunityDetail/:OppId', {
                    controller: 'OpportunityCtrl',
                    templateUrl: 'js/views/Opportunity/OpportunityDetail.html'
                })
                .when('/home/:id', {
                    controller: 'HomeController',
                    templateUrl: 'js/views/Home.html'
                })
                .when('/PaymentList/:OppId/:GroupId', {
                    controller: 'PaymentController',
                    templateUrl: 'js/views/Payment/Payment.html'
                })
                .when('/OpportunityPriceList', {
                    controller: 'OpportunityPriceController',
                    templateUrl: 'js/views/Price/OpportunityPriceList.html'
                })
                .when('/OpportunityPaymentList', {
                    controller: 'OpportunityPaymentController',
                    templateUrl: 'js/views/Payment/OpportunityPaymentList.html'
                })
                .when('/PriceList/:OppId/:GroupId', {
                    controller: 'PriceController',
                    templateUrl: 'js/views/Price/PriceList.html'
                })
                .when('/PriceSheetLock', {
                    controller: 'PricesheetmgntController',
                    templateUrl: 'js/views/Utilities/PricesheetLockMgnt.html'
                })
                .when('/CurrencyConversions', {
                    controller: 'CurrencyController',
                    templateUrl: 'js/views/Utilities/Currency.html'
                })
                .when('/OppConfiguration', {
                    controller: 'OppConfigController',
                    templateUrl: 'js/views/Utilities/OpportunityConfiguration.html'
                })
                .when('/mergeOpportunity', {
                    controller: 'MergeOppCntl',
                    templateUrl: 'js/views/Utilities/MergeOpportunity.html'
                })
                .when('/ProductList', {
                    controller: 'ProductController',
                    templateUrl: 'js/views/Utilities/Product.html'
                })
                .when('/VendorList', {
                    controller: 'VendorController',
                    templateUrl: 'js/views/Utilities/Vendor.html'
                })
                .when('/DiscountMgmt', {
                    controller: 'DiscountController',
                    templateUrl: 'js/views/Utilities/DiscountMgmt.html'
                })
                .when('/MarginMgmt', {
                    controller: 'MarginController',
                    templateUrl: 'js/views/Utilities/MarginMgmt.html'
                })
                .when('/Milestone', {
                    controller: 'MilestoneController',
                    templateUrl: 'js/views/Utilities/PaymentMilestone.html'
                })
                .when('/PaymentMgmt', {
                    controller: 'PaymentConfigurationController',
                    templateUrl: 'js/views/Utilities/PaymentConfiguration.html'
                })
                .when('/EmailConfiguration', {
                    controller: 'EmailConfigurationController',
                    templateUrl: 'js/views/Utilities/EmailConfiguration.html'
                })
                .when('/MyDayReports', {
                    controller: 'MyDayController',
                    templateUrl: 'js/views/Utilities/MyDayTabs.html'
                })
                .when('/MyDay', {
                    controller: 'MyDayController',
                    templateUrl: 'js/views/Utilities/MyDayMainTabs.html'
                })
                .when('/HRMISLeaves', {
                    controller: 'MyDayController',
                    templateUrl: 'js/views/Utilities/HRMISLeaves.html'
                })
                .when('/WeekendLeaves', {
                    controller: 'HolidayController',
                    templateUrl: 'js/views/Utilities/WeekendLeaves.html'
                })
                .when('/HolidayCalendar', {
                    controller: 'HolidayController',
                    templateUrl: 'js/views/Utilities/HolidayCalUpload.html'
                })
                .when('/UserHierarchy', {
                    controller: 'HierarchyController',
                    templateUrl: 'js/views/Utilities/UserHierarchy.html'
                })
                .when('/UserSession', {
                    controller: 'UserSessionController',
                    templateUrl: 'js/views/Utilities/UserSession.html'
                })
                .when('/GrossMargin/:OppId/:GroupId', {
                    controller: 'GrossMarginController',
                    templateUrl: 'js/views/GrossMargin/GrossMargin.html'
                })
                .when('/TaskTypeMgmt', {
                    controller: 'TaskTypeController',
                    templateUrl: 'js/views/Utilities/TaskType.html'
                })
                .when('/Location', {
                    controller: 'LocationController',
                    templateUrl: 'js/views/Utilities/Location.html'
                })
                .when('/BaseSkill', {
                    controller: 'BaseSkillController',
                    templateUrl: 'js/views/Utilities/BaseSkill.html'
                })
                .when('/BillingConfig', {
                    controller: 'BillingConfigController',
                    templateUrl: 'js/views/Utilities/BillingConfig.html'
                })
                .when('/SubUtilities', {
                    templateUrl: 'js/views/SubUtilities.html'
                })
                .when('/adminreports/:OppId/:GroupId', {
                    controller: 'EstimationAdminReportsController', templateUrl: 'js/views/Estimation/EstimationAdminReports.html'
                })
                .when('/others/:OppId/:GroupId', {
                    controller: 'EstimationOthersController', templateUrl: 'js/views/Estimation/EstimationOther.html'
                })
                .when('/egain/:OppId/:GroupId', {
                    controller: 'EstimationEGainController', templateUrl: 'js/views/Estimation/EstimationEGain.html'
                })
                .when('/wfo/:OppId/:GroupId', {
                    controller: 'EstimationWFOController', templateUrl: 'js/views/Estimation/EstimationWFO.html'
                })
                .when('/servionproducts/:OppId/:GroupId', {
                    controller: 'EstimationServionProductsController', templateUrl: 'js/views/Estimation/EstimationServionProducts.html'
                })
                .when('/manualestimation/:OppId/:GroupId', {
                    controller: 'ManualEstimationController', templateUrl: 'js/views/Estimation/ManualEstimation.html'
                })
                .when('/acqueon/:OppId/:GroupId', {
                    controller: 'EstimationAcqueonController', templateUrl: 'js/views/Estimation/EstimationAcqueon.html'
                })

                .when('/application/:OppId/:GroupId', {
                    controller: 'EstimationApplicationController', templateUrl: 'js/views/Estimation/EstimationApplication.html'
                })
                .when('/selfservice/:OppId/:GroupId', {
                    controller: 'EstimationSelfServiceController', templateUrl: 'js/views/Estimation/EstimationSelfService.html'
                })
                .when('/cisco/:OppId/:GroupId', {
                    controller: 'EstimationCiscoController', templateUrl: 'js/views/Estimation/EstimationCisco.html'
                })
                .when('/servionproductmaster', {
                    controller: 'EstimationServionProductsMasterController', templateUrl: 'js/views/Estimation/EstimationServionProductsMaster.html'
                })
                .when('/wfo', {
                    controller: 'EstimationWFOController', templateUrl: 'js/views/Estimation/EstimationWFO.html'
                })
                .when('/wfomaster', {
                    controller: 'EstimationWFOMasterController', templateUrl: 'js/views/Estimation/EstimationWFOMaster.html'
                })
                .when('/othermaster', {
                    controller: 'EstimationOthersMasterController', templateUrl: 'js/views/Estimation/EstimationOthersMaster.html'
                })

                .when('/acqueonmaster', {
                    controller: 'EstimationAcqueonMasterController', templateUrl: 'js/views/Estimation/EstimationAcqueonMaster.html'
                })
                .when('/acqueon', {
                    controller: 'EstimationAcqueonController', templateUrl: 'js/views/Estimation/EstimationMaster.html'
                })
                .when('/avayamaster', {
                    controller: 'EstimationAvayaMasterController', templateUrl: 'js/views/Estimation/EstimationAvayaMaster.html'
                })
                .when('/avaya/:OppId/:GroupId', {
                    controller: 'EstimationAvayaController', templateUrl: 'js/views/Estimation/EstimationAvaya.html'
                })
                .when('/egainmaster', {
                    controller: 'EstimationEGainMasterController', templateUrl: 'js/views/Estimation/EstimationEGainMaster.html'
                })
                .when('/egain', {
                    controller: 'EstimationEGainController', templateUrl: 'js/views/Estimation/EstimationEGain.html'
                })
                .when('/ciscomaster', {
                    controller: 'EstimationCiscoMasterController', templateUrl: 'js/views/Estimation/EstimationCiscoMaster.html'
                })
                .when('/cisco', {
                    controller: 'EstimationCiscoController', templateUrl: 'js/views/Estimation/EstimationCisco.html'
                })

                .when('/selfservicemaster', {
                    controller: 'EstimationSelfServiceMasterController', templateUrl: 'js/views/Estimation/EstimationSelfServiceMaster.html'
                })
                .when('/AdminReportsMaster', {
                    controller: 'EstimationAdminReportsMasterController', templateUrl: 'js/views/Estimation/EstimationAdminReportsMaster.html'
                })
                .when('/applicationmaster', {
                    controller: 'EstimationApplicationMasterController', templateUrl: 'js/views/Estimation/EstimationApplicationMaster.html'
                })
                .when('/grid', {
                    controller: 'GridController', templateUrl: 'js/views/Estimation/gridsample.html'
                })
                .when('/ExtendedEffortsSDLC', {
                    controller: 'ExtendedEffortsController', templateUrl: 'js/views/Utilities/ExtendedEfforts.html'
                })
                .when('/DynamiceSection', {
                    controller: 'DynamiceSectionConfigController', templateUrl: 'js/views/Utilities/DynamicSectionConfig.html'
                })
                .when('/OpportunityReport', {
                    controller: 'OpportunityReportController', templateUrl: 'js/views/Report/OpportunityReport.html'
                })

                .otherwise({ redirectTo: '/home' });
        }

        $locationProvider.html5Mode(true).hashPrefix('*');

    }]).run(['$rootScope', '$location', '$window', '$http', '$templateCache', '$routeParams', function ($rootScope, $location, $window, $http, $templateCache, $routeParams) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (typeof (current) !== 'undefined') {
                $templateCache.remove(current.templateUrl);
            }
        });

        $rootScope.UserInfo = angular.fromJson($window.sessionStorage.getItem('userAuth'));
        //console.log($rootScope.UserInfo);
        if ($rootScope.UserInfo) {
            $rootScope.isAuth = true;
            $http.defaults.headers.common['x-access-token'] = $rootScope.UserInfo.token;
        }
        $rootScope.$on('$locationChangeStart', function (event, next, current) {


            //console.log('Event ' + event);
            //console.log('Next ' + next);
            //console.log('Current ' + current);
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), [HostPath + '/Login.html', '/register']) === -1;
            //console.log($location.path());
            //console.log(restrictedPage)
            //console.log($rootScope.UserInfo)            
            if (restrictedPage && ($rootScope.UserInfo === undefined || $rootScope.UserInfo === null)) {

                var url = urltype + "//" + $window.location.host + HostPath + "/Login.html";
                if ($location.absUrl() != undefined && $location.absUrl() != null) {
                    var split = $location.absUrl();

                    var content = split.split('?');
                    if (content.length > 1) {
                        url = url + '?' + content[1];

                    }
                    else {
                        url = url;
                    }
                }

                $window.location.href = url;
            }
        });
    }]);
ReportApp.controller('MainController', function ($scope, $rootScope, $cacheFactory, $location, $window, reportFactory) {
    $rootScope.rootname = 'opp';
    $scope.updatemenuclick = function (menuname) {
        $rootScope.rootname = menuname;
    }
    $scope.MenuList = [];
    $scope.userImage;
    $scope.defaultImage = ServionImages + "ADUsers/defaultuser.jpg";
    $scope.BroadCastToggle = function () {
        $rootScope.$broadcast("toggle");
    },
        $scope.Logout = function () {

            reportFactory.Logout($scope.userId).success(function (data) {
                $window.sessionStorage.removeItem('userAuth');
                $window.sessionStorage.removeItem('token');
                $rootScope.UserInfo = null;
                $rootScope.isAuth = false;
                $location.path('/');
            }).error(function (error) {
                $window.sessionStorage.removeItem('userAuth');
                $window.sessionStorage.remove('token');
                $rootScope.UserInfo = null;
                $rootScope.isAuth = false;
                $location.path('/');
            });
            sessionStorage.clear();
            //$window.location.href = 'https://adfs.servion.com/adfs/ls/?wa=wsignout1.0&wreply={' + ('http://104.215.141.10/PricingTool') + '}';
        },
        $scope.GetMenuList = function (userId) {
            reportFactory.GetMenuList(userId).success(function (data) {

                var distinctArray = [];
                for (var i = 0; i < data.length; i++) {
                    if (distinctArray.indexOf(data[i].MenuName) < 0 && data[i].MenuName != 'Opportunities' && data[i].ShowMenu == 'true') {
                        distinctArray.push(data[i].MenuName);
                        $scope.MenuList.push({ 'MenuName': data[i].MenuName, 'Path': data[i].Path, 'Icon': data[i].Icon });
                    }
                }

            }).error(function (error) {
                console.log('Error when getting menu list: ' + error);
            });
        },
        $scope.GetRightsList = function (userId) {
            reportFactory.GetRightsList(userId).success(function (data) {
                $rootScope.RightList = data;
            }).error(function (error) {
                console.log('Error when getting rights list: ' + error);
            });
        },
        $scope.SetImagePaths = function (userId) {
            reportFactory.GetUser(userId).success(function (data) {
                if (data.IsADUser == 'Yes') {
                    $scope.userImage = ServionImages + "ADUsers/" + $rootScope.UserInfo.user.userId + '.jpg';
                }
                else {
                    $scope.userImage = $scope.defaultImage;
                }
            }).error(function (error) {
                console.log('Error when getting rights list: ' + error);
            });
        }

    $scope.GetMenuList($rootScope.UserInfo.user.userId);
    $scope.GetRightsList($rootScope.UserInfo.user.userId);
    $scope.SetImagePaths($rootScope.UserInfo.user.userId);


});

ReportApp.directive('numberonly', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {

                if (event.which == 64 || event.which == 16) {
                    // to allow numbers  
                    return false;
                } else if (event.which >= 48 && event.which <= 57) {
                    // to allow numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // to allow numpad number  
                    return true;
                } else if ([46, 8, 9, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {

                    // to allow backspace, enter, escape, arrows  
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others  
                    return false;
                }
            });
        }
    }
});


ReportApp.factory('_', ['$window', function ($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);

ReportApp.directive('numberdotonly', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                if (event.which == 64 || event.which == 16) {
                    // to allow numbers  
                    return false;
                } else if (event.which >= 48 && event.which <= 57 || event.which == 190) {
                    // to allow numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // to allow numpad number  
                    return true;
                } else if ([46, 8, 9, 13, 27, 37, 38, 39, 40, 110].indexOf(event.which) > -1) {

                    // to allow backspace, enter, escape, arrows  
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others  
                    return false;
                }
            });
        }
    }
});

ReportApp.directive('charonly', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                if (event.which >= 65 && event.which <= 90) {
                    // to allow numpad number  
                    return true;
                } else if ([8, 9, 13, 27, 37, 38, 39, 40, 32, 46].indexOf(event.which) > -1) {
                    // to allow backspace, enter, escape, arrows  
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others  
                    return false;
                }
            });
        }
    }
});

ReportApp.factory('reportFactory', function ($http, $q) {
    var authurl = BaseURL + 'auth';
    var userurl = BaseURL + 'users';
    var Tokenurl = '/OAuth2/auth';
    var AuthFactory = {
        Logout: function (userId) {
            return $http.post(authurl + '/Logout/', { userId: userId });
        },
        GetMenuList: function (userId) {
            return $http.get(authurl + '/?userId=' + userId);
        },
        GetRightsList: function (userId) {
            return $http.get(authurl + '/rights/?userId=' + userId);
        },
        GetUser: function (userId) {
            return $http.get(userurl + '/?userId=' + userId);
        }
    };
    return AuthFactory;
});


ReportApp.controller('OemController', ['$scope', function ($scope) {
    $scope.oem = {
        name: ''
    };
    $scope.oems = [{
        name: 'Servion'
    },
    {
        name: 'Cisco'
    },
    {
        name: 'Avaya'
    },
    {
        name: 'Acqueon'
    },
    {
        name: 'Nice'
    },
    {
        name: 'Verint'
    },
    {
        name: 'Calabrio'
    },
    {
        name: 'Knoahsoft'
    },
    {
        name: 'Other'
    }];
    $scope.addOEM = function () {
        $scope.oems.push({
            name: $scope.oemlist.oem.name
        });
    };
    $scope.removeOEM = function (item) {
        var index = $scope.oems.indexOf(item);
        $scope.oems.splice(index, 1);
    };
}]);



ReportApp.factory('authInterceptor', function ($location, $q, $window, $rootScope) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            var UserInfo = angular.fromJson($window.sessionStorage.getItem('userAuth'));
            config.headers.Authorization = 'Bearer ' + UserInfo.token;
            if (config.method == 'GET' && config.url.indexOf('uib') == -1 && config.url.indexOf('myPopoverTemplate') == -1 && config.url.indexOf('popover') == -1) {
                var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                config.url = config.url + separator + 'noCache=' + new Date().getTime();
            }
            return config;
        },
        requestError: function (config) { return config; },
        response: function (res) { return res; },
        responseError: function (res) {
            if (res.status != undefined && res.status != null && (res.status == '403' || res.status == '400')) {
                $window.sessionStorage['userAuth'] = null;
                $rootScope.UserInfo = null;
                $rootScope.isAuth = false;
                $location.path('/');
            }
            return res;
        }

    };
});




ReportApp.directive("min", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.min = function (modelValue) {
                if (!isNaN(modelValue) && modelValue !== "" && attributes.min !== "")
                    return parseFloat(modelValue) >= attributes.min;
                else
                    return true;
            }
        }
    };
});

ReportApp.directive("max", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.max = function (modelValue) {
                if (!isNaN(modelValue) && modelValue !== "" && attributes.max !== "")
                    return parseFloat(modelValue) <= attributes.max;
                else
                    return true;
            }
        }
    };
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

ReportApp.directive('datetimepicker', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {

            if (!ngModel) return; // do nothing if no ng-model

            var currentdate = '';
            if (scope.opp != undefined && scope.opp.WorkDate != undefined) {
                currentdate = scope.opp.WorkDate;
            }
            else if (scope.user != undefined && scope.user.length == 0) {
                currentdate = '';
            }
            else if (scope.user != undefined && (scope.user.FirstWorkingDate != '' || scope.user.FirstWorkingDate != null)) {
                currentdate = scope.user.FirstWorkingDate;
            }
            else if (scope.user != undefined && (scope.user.LastWorkingDate != '' || scope.user.LastWorkingDate != null)) {
                currentdate = scope.user.LastWorkingDate;
            }
            else if (scope.taskDetails != undefined && scope.taskDetails.length > 0 && (scope.taskDetails.FromDate != undefined || scope.taskDetails.FromDate != '' || scope.taskDetails.FromDate != null)) {
                currentdate = scope.taskDetails.FromDate;
            }
            else if (scope.taskDetails != undefined && scope.taskDetails.length > 0 && (scope.taskDetails.ToDate != undefined || scope.taskDetails.ToDate != '' || scope.taskDetails.ToDate != null)) {
                currentdate = scope.taskDetails.ToDate;
            }
            else {
                currentdate = new Date();
            }

            ngModel.$render = function () {
                $(element).find('input').val(ngModel.$viewValue || '');
            }

            $(element).datetimepicker({
                language: 'en',
                pickTime: false,
                defaultDate: currentdate
            });

            $(element).on('dp.change', function () {
                scope.$apply(read);
            });

            read();

            function read() {
                var value = element.find('input').val();
                ngModel.$setViewValue(value);
            }
        }
    }
});
ReportApp.directive('pickdate', ['MyDayFactory', function (MyDayFactory) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {

            if (!ngModel) return;

            var currentdate = '';

            MyDayFactory.GetLockedDate().success(function (data) {
                if (data[0].LockDate != null || data[0].LockDate != undefined) {
                    var indateTime = data[0].LockDate.split('T');
                    var date = new Date(indateTime[0]);
                    currentdate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                    console.log('Lock set until: ' + currentdate);
                    //alert('set');
                }
                else {
                    currentdate = '';
                    //alert('cleared');
                }
            }).error(function (error) {
                console.log('Error occurred: ' + error);
            });

            if (scope.LockDate != undefined && scope.LockDate != '') {
                currentdate = scope.LockDate;
            }
            ngModel.$render = function () {
                $(element).find('input').val(ngModel.$viewValue || '');
            }

            $(element).datetimepicker({
                language: 'en',
                pickTime: false,
                defaultDate: currentdate
            });

            $(element).on('dp.change', function () {
                scope.$apply(read);
            });

            read();

            function read() {
                var value = element.find('input').val();
                ngModel.$setViewValue(value);
            }
        }
    }
}]);


ReportApp.directive('onlytime', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            ngModel.$parsers.push(function (inputValue) {
                var dateObj = new Date(inputValue.toString());
                var hours = (0 + dateObj.getHours().toString()).slice(-2);
                var minutes = (0 + dateObj.getMinutes().toString()).slice(-2);
                var outputDate = hours + ':' + minutes;
                return outputDate.toString();
            });
        }
    };
});

ReportApp.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                var val = [];
                for (var i = 0; i < files.length; i++) {
                    //emit event upward
                    val.push(files[i]);
                    scope.$emit("fileSelected", { file: val });
                    console.log(files[i]);
                }
            });
        }
    };
});

ReportApp.directive('my360', function (OppFactory, reportFactory, UserFactory, EstimationApplicationMasterService, Opportunityservice, toaster, _) {
    return {
        templateUrl: 'js/views/Users/View360.html',
        scope: true,
        controller: function ($scope, $rootScope, $location) {
            $scope.Ishome = true;
            $scope.EFirstOpen = true;
            $scope.ShowPricing = function () {
                var showprice = false;
                var showResource = false;
                var showStayTravel = false;
                var showTandE = false;
                $scope.ShowPrice = false;
                $scope.ShowResource = false;
                $scope.ShowStayTravel = false;
                $scope.ShowTandE = false;

                reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
                    angular.forEach(rights.data, function (value, key) {
                        if (value.RightName == 'Pricing Read' || value.RightName == 'Pricing Write') {
                            showprice = true;
                        }
                        else if (value.RightName == 'Resourcing Read' || value.RightName == 'Resourcing Write') {
                            showResource = true;
                        }
                        else if (value.RightName == 'StayTravel Read' || value.RightName == 'StayTravel Write') {
                            showStayTravel = true;
                        }
                        else if (value.RightName == 'TandE Read' || value.RightName == 'TandE Write') {
                            showTandE = true;
                        }
                    })
                    if (showprice) {
                        $scope.ShowPrice = true;
                    }
                    if (showResource) {
                        $scope.ShowResource = true;
                    }
                    if (showStayTravel) {
                        $scope.ShowStayTravel = true;
                    }
                    if (showTandE) {
                        $scope.ShowTandE = true;
                    }
                });
            }
            $scope.View360 = function (opp) {
                $scope.Opp = opp;
                console.log('Received opp  ' + $scope.Opp.id);
                if ($scope.Opp.id == undefined) {
                    toaster.pop('warning', "Warning", 'You do not have permission to view this Opportunity', null);
                }
                else {
                    //$scope.GetPriceVersions($scope.Opp.OppId);
                    //  debugger;
                    $scope.GetPriceVersions($scope.Opp.id);
                    // $scope.GetResourceVersions($scope.Opp.id, $scope.Opp.OppId);
                    // $scope.GetStayTravelVersions($scope.Opp.id);
                    // $scope.GetTandEVersions($scope.Opp.id);
                    $scope.GetAppVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetManualVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetSelfServiceVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetOthersVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetEGainVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetAdminVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetAvayaVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetCiscoVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetWFOVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetServProductsVersions($scope.Opp.id, $scope.Opp.OppId);
                    $scope.GetAcqueonVersions($scope.Opp.id, $scope.Opp.OppId);

                    $scope.Opp.CSCStatus = ($scope.Opp.CSCStatus == null || $scope.Opp.CSCStatus == undefined) ? 'Not Assigned' : $scope.Opp.CSCStatus;
                    console.log('showing 360 for opp: ' + $scope.Opp.id);
                    $('#View360').modal('show');
                }
            };


            $scope.GetPriceVersions = function (oppId) {

                var arraydata = ['ACQUEON', 'ADMIN', 'APPLICATIONS', 'Avaya', 'CISCO', 'eGain', 'PACKAGE', 'REPORT', 'SELF_SERVICE', 'SERVION_PRODUCTS', 'WFO', 'OTHERS']
                Opportunityservice.getOpportunityEstimationProduct(oppId).success(function (ServionEstimationProductdata) {

                    angular.forEach(arraydata, function (value, key) {
                        $scope[value] = false;
                        if (_.where(ServionEstimationProductdata, { ProductName: value }).length > 0)
                            $scope[value] = true;
                    });

                })

                $scope.PriceVersions = [];
                $scope.isPriceSheetExist = false;
                $scope.Opp.LatestPriceVersion = 0;
                angular.forEach($scope.OppVersions, function (value, key) {
                    if (value.id == oppId && value.PriceSheetId != null) {
                        if (value.CreatedOn != null) {
                            value.CreatedOn = formatDate(value.CreatedOn);
                        }
                        $scope.PriceVersions.push(value);
                        if ($scope.Opp.LatestPriceVersion < value.PriceSheetId) {
                            $scope.Opp.LatestPriceVersion = value.PriceSheetId;
                            $scope.isPriceSheetExist = true;
                        }
                    }
                });
            };

            $scope.Currentpage = 'Application Sheet';

            $scope.GetResourceVersions = function (id, oppId) {

                $scope.ResourceVersions = [];
                $scope.isResourceSheetExist = false;
                $scope.Opp.LatestResourceVersion = 0;

                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ResourceSheet').success(function (data) {
                    $scope.ResVersions = data;
                    angular.forEach($scope.ResVersions, function (value, key) {


                        if (value.ApplicationId != null) {

                            value.oppautoid = id;
                            $scope.ResourceVersions.push(value);
                            if ($scope.Opp.LatestResourceVersion < value.ApplicationId) {
                                $scope.Opp.LatestResourceVersion = value.ApplicationId;
                                $scope.isResourceSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetStayTravelVersions = function (oppId) {
                $scope.StayTravelVersions = [];
                $scope.isStayTravelSheetExist = false;
                $scope.Opp.LatestStayTravelVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'StayTravelSheet').success(function (data) {
                    $scope.stayVersions = data;
                    angular.forEach($scope.stayVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.StayTravelVersions.push(value);
                            if ($scope.Opp.LatestStayTravelVersion < value.ApplicationId) {
                                $scope.Opp.LatestStayTravelVersion = value.ApplicationId;
                                $scope.isStayTravelSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetTandEVersions = function (oppId) {
                $scope.TandEVersions = [];
                $scope.isTandESheetExist = false;
                $scope.Opp.LatestTandEVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'TandESheet').success(function (data) {
                    $scope.tandEVersions = data;
                    angular.forEach($scope.tandEVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TandEVersions.push(value);
                            if ($scope.Opp.LatestTandEVersion < value.ApplicationId) {
                                $scope.Opp.LatestTandEVersion = value.ApplicationId;
                                $scope.isTandESheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetAppVersions = function (id, oppId) {
                $scope.AppVersions = [];
                $scope.isApplicatonSheetExist = false;
                $scope.Opp.LatestAppVersion = 0;
                $scope.TotalAppVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ApplicationSheet').success(function (data) {
                    $scope.ApplicatonVersions = data;

                    angular.forEach($scope.ApplicatonVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalAppVersion++;
                            value.oppautoid = id;
                            $scope.AppVersions.push(value);
                            if ($scope.Opp.LatestAppVersion < value.ApplicationId) {
                                $scope.Opp.LatestAppVersion = value.ApplicationId;
                                $scope.isApplicatonSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetManualVersions = function (id, oppId) {
                $scope.ManualVersions = [];
                $scope.isManualSheetExist = false;
                $scope.Opp.LatestManualVersion = 0;
                $scope.TotalOthersVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ManualEstimationSheet').success(function (data) {
                    $scope.OthersVersions = data;

                    angular.forEach($scope.OthersVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalOthersVersion++;
                            value.oppautoid = id;
                            $scope.ManualVersions.push(value);
                            if ($scope.Opp.LatestManualVersion < value.ApplicationId) {
                                $scope.Opp.LatestManualVersion = value.ApplicationId;
                                $scope.isManualSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });


            };


            $scope.GetOthersVersions = function (id, oppId) {
                $scope.OtherVersions = [];
                $scope.isOthersSheetExist = false;
                $scope.Opp.LatestOthersVersion = 0;
                $scope.TotalOthersVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'OthersSheet').success(function (data) {
                    $scope.OthersVersions = data;

                    angular.forEach($scope.OthersVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalOthersVersion++;
                            value.oppautoid = id;
                            $scope.OtherVersions.push(value);
                            if ($scope.Opp.LatestOthersVersion < value.ApplicationId) {
                                $scope.Opp.LatestOthersVersion = value.ApplicationId;
                                $scope.isOthersSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });


            };
            $scope.GetSelfServiceVersions = function (id, oppId) {
                $scope.SelfVersions = [];
                $scope.isSelfServiceSheetExist = false;
                $scope.Opp.LatestSelfServiceVersion = 0;
                $scope.TotalSelfServiceVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'SelfServiceSheet').success(function (data) {
                    $scope.SelfServiceVersions = data;

                    angular.forEach($scope.SelfServiceVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalSelfServiceVersion++;
                            value.oppautoid = id;
                            $scope.SelfVersions.push(value);
                            if ($scope.Opp.LatestSelfServiceVersion < value.ApplicationId) {
                                $scope.Opp.LatestSelfServiceVersion = value.ApplicationId;
                                $scope.isSelfServiceSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });


            };

            $scope.GetEGainVersions = function (id, oppId) {
                $scope.EGVersions = [];
                $scope.isEGainSheetExist = false;
                $scope.Opp.LatestEGainVersion = 0;
                $scope.TotalEGainVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'EGainSheet').success(function (data) {
                    $scope.EGainVersions = data;

                    angular.forEach($scope.EGainVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalEGainVersion++;
                            value.oppautoid = id;
                            $scope.EGVersions.push(value);
                            if ($scope.Opp.LatestEGainVersion < value.ApplicationId) {
                                $scope.Opp.LatestEGainVersion = value.ApplicationId;
                                $scope.isEGainSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };




            $scope.GetAvayaVersions = function (id, oppId) {
                $scope.AVVersions = [];
                $scope.isAvayaSheetExist = false;
                $scope.Opp.LatestAvayaVersion = 0;
                $scope.TotalAvayaVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AvayaSheet').success(function (data) {
                    $scope.AvayaVersions = data;

                    angular.forEach($scope.AvayaVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalAvayaVersion++;
                            value.oppautoid = id;
                            $scope.AVVersions.push(value);
                            if ($scope.Opp.LatestAvayaVersion < value.ApplicationId) {
                                $scope.Opp.LatestAvayaVersion = value.ApplicationId;
                                $scope.isAvayaSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetCiscoVersions = function (id, oppId) {
                $scope.CSVersions = [];
                $scope.isCiscoSheetExist = false;
                $scope.Opp.LatestCiscoVersion = 0;
                $scope.TotalCiscoVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'CiscoSheet').success(function (data) {
                    $scope.CiscoVersions = data;

                    angular.forEach($scope.CiscoVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalCiscoVersion++;
                            value.oppautoid = id;
                            $scope.CSVersions.push(value);
                            if ($scope.Opp.LatestCiscoVersion < value.ApplicationId) {
                                $scope.Opp.LatestCiscoVersion = value.ApplicationId;
                                $scope.isCiscoSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };


            $scope.GetAcqueonVersions = function (id, oppId) {
                $scope.ACQVersions = [];
                $scope.isAcqueonSheetExist = false;
                $scope.Opp.LatestAcqueonVersion = 0;
                $scope.TotalAcqueonVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AcqueonSheet').success(function (data) {
                    $scope.AcqueonVersions = data;

                    angular.forEach($scope.AcqueonVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalAcqueonVersion++;
                            value.oppautoid = id;
                            $scope.ACQVersions.push(value);
                            if ($scope.Opp.LatestAcqueonVersion < value.ApplicationId) {
                                $scope.Opp.LatestAcqueonVersion = value.ApplicationId;
                                $scope.isAcqueonSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetWFOVersions = function (id, oppId) {
                $scope.WFVersions = [];
                $scope.isWFOSheetExist = false;
                $scope.Opp.LatestWFOVersion = 0;
                $scope.TotalWFOVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'WFOSheet').success(function (data) {
                    $scope.WFOVersions = data;

                    angular.forEach($scope.WFOVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalWFOVersion++;
                            value.oppautoid = id;
                            $scope.WFVersions.push(value);
                            if ($scope.Opp.LatestWFOVersion < value.ApplicationId) {
                                $scope.Opp.LatestWFOVersion = value.ApplicationId;
                                $scope.isWFOSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };


            $scope.GetServProductsVersions = function (id, oppId) {
                $scope.ServPoductVersions = [];
                $scope.isServionProductsSheetExist = false;
                $scope.Opp.LatestServionProductsVersion = 0;
                $scope.TotalServionProductsVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ServionProductsSheet').success(function (data) {
                    $scope.ServionProductsVersions = data;

                    angular.forEach($scope.ServionProductsVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalServionProductsVersion++;
                            value.oppautoid = id;
                            $scope.ServPoductVersions.push(value);
                            if ($scope.Opp.LatestServionProductsVersion < value.ApplicationId) {
                                $scope.Opp.LatestServionProductsVersion = value.ApplicationId;
                                $scope.isServionProductsSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetAdminVersions = function (id, oppId) {
                $scope.AdminVersions = [];
                $scope.isAdminReportsSheetExist = false;
                $scope.Opp.LatestAdminReportsVersion = 0;
                $scope.TotalAdminReportsVersion = 0;
                EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AdminReportsSheet').success(function (data) {
                    $scope.AdminReportsVersions = data;

                    angular.forEach($scope.AdminReportsVersions, function (value, key) {
                        if (value.ApplicationId != null) {
                            $scope.TotalAdminReportsVersion++;
                            value.oppautoid = id;
                            $scope.AdminVersions.push(value);
                            if ($scope.Opp.LatestAdminReportsVersion < value.ApplicationId) {
                                $scope.Opp.LatestAdminReportsVersion = value.ApplicationId;
                                $scope.isAdminReportsSheetExist = true;
                            }
                        }
                    });
                }).error(function (error) {
                    $scope.Error = error;
                });
            };

            $scope.GetAllOpportunityVersion = function () {
                OppFactory.GetAllOpportunityVersion().success(function (data) {
                    $scope.OppVersions = data;
                    //   alert(JSON.stringify(data));
                }).error(function (error) {
                    //  alert('Error: ' + error);
                    $$scope.Error = error;
                })
            };


            $scope.RedirectToOpp = function (oppId) {
                $('#View360').modal('hide');
                $location.path("OpportunityDetail/" + oppId);
            };
            $scope.RedirectToHome = function () {
                $('#View360').modal('hide');
                $location.path("home");
            };
            $scope.RedirectToPrice = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("DaySheet/" + oppId + "/" + groupId);
            };
            $scope.RedirectToResource = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("Resource/" + oppId + "/" + groupId);
            };
            $scope.RedirectToStayTravel = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("StayTravel/" + oppId + "/" + groupId);
            };
            $scope.RedirectToTandE = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("TandE/" + oppId + "/" + groupId);
            };
            $scope.RedirectToDay = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("DaySheet/" + oppId + "/" + groupId);
            };
            $scope.RedirectTomanualestimation = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("manualestimation/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimate = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("application/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateWFO = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("wfo/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateSelf = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("selfservice/" + oppId + "/" + groupId);
            };
            $scope.RedirectToOpportunityEstimate = function (oppId) {
                $('#View360').modal('hide');
                $location.path("OpportunityEstimationSDLC/" + oppId);
            };
            $scope.RedirectToEstimateAdmin = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("adminreports/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateAvaya = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("avaya/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateCisco = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("cisco/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateEGain = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("egain/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateServionProducts = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("servionproducts/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateAcqueon = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("acqueon/" + oppId + "/" + groupId);
            };
            $scope.RedirectToEstimateOthers = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("others/" + oppId + "/" + groupId);
            };
            $scope.RedirectToPayment = function (oppId, groupId) {
                $('#View360').modal('hide');
                $location.path("PaymentList/" + oppId + "/" + groupId);
            };
            $scope.RightToViewOpp = true;
            $scope.ValidateTabRights = function () {
                var currentTab = '';

                OppFactory.GetRightsList($rootScope.UserInfo.user.userId).success(function (data) {
                    angular.forEach(data, function (value, key) {
                        if (value.RightName == 'CSC Details') {
                            currentTab = 'CSCDetails';
                        }
                        else if (value.RightName == 'Access Details') {
                            currentTab = 'AccessDetails';
                        }
                        else if (value.RightName == 'Configuration Details') {
                            currentTab = 'OpportunityDetailTab';
                        }
                    });
                    if (currentTab == '') {
                        $scope.RightToViewOpp = false;
                    }
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }
            $scope.view360imgPath = View360ImagesPath;

            $scope.GetAllOpportunityVersion();
            $scope.ShowPricing();
            $scope.ValidateTabRights();

        }

        //   template: 'Name: sfasdgfsadfasdfsa asgfasdfsad'
    };
});


ReportApp.directive('dropdownMultiselect', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            pre_selected: '=preSelected',
            grideditable: '=editble',
            dropdownTitle: '@'
        },
        template: "<div class='btn-group' data-ng-class='{open: open}'>" +
        "<button class='btn btn-small btn-info btn-flat btntest' ng-class='{ yellowbg: IsNothing ,greenbg: IsLatestSelected ,orangebg: IsLatestSelected == false  }' data-ng-click='open=!open;'>{{dropdownTitle}} </button>" +
        //"<button class='btn btn-small dropdown-toggle  btn-flat' ng-class='{bluebg: IsLatestSelected == null,greenbg: IsLatestSelected,orangebg: IsLatestSelected == false }'  data-ng-click='open=!open;'><span class='caret'></span></button>" +
        "<ul class='dropdown-menu scrollable-menu' aria-labelledby='dropdownMenu'>" +

        "<li  class='users-list-name' data-ng-repeat='option in options' ng-class='{selected: selectedItems[option.ApplicationId]}'> &nbsp; <input type='checkbox' ng-disabled='!grideditable' data-ng-change='setSelectedItem(option.ApplicationId,dropdownTitle)' ng-model='selectedItems[option.ApplicationId]'> <span>&nbsp; {{option.Version}} &nbsp; - {{option.Comment}} </span></li><br />" +
        "</ul>" +
        "</div>" +
        "<div  class='users-list-name' data-ng-repeat='option in options' ng-show='selectedItems[option.ApplicationId]'> &nbsp; <span style='color:green' class='glyphicon glyphicon-ok-circle' /> <span style='color:black;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;padding-left:-1px;'> {{option.Version}} &nbsp; - {{option.Comment}} </span></div><br />"
        ,
        bindToController: false,
        controller: function ($scope, $timeout, toaster, _) {
            $scope.selectedItems = {};
            $scope.model = [];
            //    init();
            // alert($scope.grideditable);

            function init() {
                $scope.model = [];
                //$scope.$watch('pre_selected', function () {
                $scope.selectedItems = {};
                $scope.IsLatestSelected = null;
                $scope.IsNothing = false;
                $scope.LatestVersion = 0;
                if ($scope.options.length > 0) {
                    angular.forEach($scope.options, function (value, key) {
                        if (value.Version == "Ver_0.1")
                            value.Comment = "Initial";

                        if (value.IsEditable) {
                            $scope.LatestVersion = value.ApplicationId;
                        }
                    });
                }
                else
                    $scope.IsNothing = true;

                if ($scope.pre_selected != null) {
                    //orangebg
                    var latestdone = false;
                    for (var i = 0; i < $scope.pre_selected.length; i++) {
                        $scope.model.push($scope.pre_selected[i]);
                        $scope.selectedItems[$scope.pre_selected[i]] = true;
                        if (!latestdone) {
                            if ($scope.LatestVersion == $scope.pre_selected[i]) {
                                $scope.IsLatestSelected = true;
                                latestdone = true;
                            }
                            else
                                $scope.IsLatestSelected = false;
                        }
                    }

                }

            }
            $timeout(init, 5000);

            $scope.setSelectedItem = function (id, title) {
                var filteredArray = [];
                if ($scope.model == undefined)
                    $scope.model = [];

                if ($scope.selectedItems[id] == true) {
                    if (title == "Manual Estimation") {
                        if ($scope.model.length > 0) {
                            $scope.selectedItems[id] = false;
                            toaster.pop('warning', "Warning", 'Manual Estimation Version Selection only one allowed', null);
                            return false;
                        }

                    }
                    $scope.model.push(id);
                } else {

                    filteredArray = $scope.model.filter(function (value) {
                        return value != id;
                    });

                    $scope.model = filteredArray;

                }
                if ($scope.model.length == 0)
                    $scope.IsLatestSelected = null;
                else {
                    for (var i = 0; i < $scope.model.length; i++) {

                        filteredArray1 = $scope.model.filter(function (value) {
                            return value == $scope.LatestVersion;
                        });
                        if ($scope.LatestVersion == filteredArray1)
                            $scope.IsLatestSelected = true;
                        else
                            $scope.IsLatestSelected = false;
                    }
                }

                return false;
            };
        },

    }
});