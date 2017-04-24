ReportApp.controller("OpportunitySiteController", function ($rootScope, $scope, $routeParams, $window, $http, priceService, paymentService, currencyService, Opportunityservice, $timeout, toaster, $location, reportFactory, GrossMarginService) {
    $scope.GlobalIdentityOppId = $routeParams.OppId;
    $scope.GlobalGroupId = $routeParams.GroupId;
    $scope.grideditable = false;
    $scope.hasedit = false;
    $scope.GlobalIdentityOppId = $routeParams.OppId;
    $scope.dynamicPopover = {
        templateUrl: 'popover.html',
    };

    $scope.GetOpportunityList = function (id) {
        Opportunityservice.GetopportunitybyID(id).success(function (data) {

            $scope.OpportunityDetail = data[0];
            $scope.OpportunityDetail.PriceGroupId = $scope.GlobalGroupId;

            $scope.MaxSheetGroupID = $routeParams.GroupId;

            $scope.GetOppConfigbyOppGroup($scope.OpportunityDetail.OppId, $routeParams.GroupId);
            $scope.GetPriceSheetVersionsForOpp($scope.OpportunityDetail.OppId)
            $scope.GetPriceSheetMappeddataByversion($scope.OpportunityDetail.OppId, $routeParams.GroupId);
        });
    };


    $scope.GetOpportunityDataCenterLocated = function () {
        Opportunityservice.GetOpportunityDataCenterLocated().success(function (data) {
            $scope.DataCenterLocated = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityDataCenterLocated();


    $scope.GetPriceSheetVersionsForOpp = function (oppid) {
        console.log('oppid, groupid' + oppid)
        priceService.GetPriceSheetVersionsForOpp(oppid).success(function (data) {
            $scope.Versiondata = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.pageLoad = false;



    $scope.GetOppConfigbyOppGroup = function (oppid, groupid) {
        console.log('oppid, groupid' + oppid)
        GrossMarginService.GetOppConfigbyOppGroup(oppid, groupid).success(function (data) {

            if (data != null && data.length > 0) {
                $scope.OpportunityDetail.NoOfDataCenterLocs = data[0].NoOfDataCenterLocs;
                $scope.OpportunityDetail.NoOfAgentCenterLocs = data[0].NoOfAgentCenterLocs;
                $scope.OpportunityDetail.IsDataCenterandAgentsColocated = parseInt(data[0].IsDataCenterandAgentsColocated);
            }
            //by default need to load pricesheet for that payment



        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetPriceSheetMappeddataByversion = function (oppid, groupid) {

        priceService.GetPriceSheetMapbyOppGroup(oppid, groupid).success(function (data) {
            //jay 
            $scope.MaxVersion = data[0].Version;
            $scope.MaxSheetGroupID = data[0].PriceSheetId;
            //$scope.grideditable = data[0].IsEditable;
            $scope.hasedit = data[0].IsEditable;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetMaximumGroupPriceSheetId = function () {

        priceService.GetMaximumGroupPriceSheetId().success(function (data) {
            if (data[0].count == 'null') {
                $scope.MaxSheetGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
            }

            if ($routeParams.GroupId == 'undefined' || $routeParams.GroupId == 'null' || $routeParams.GroupId == '') {
                //block the application
            }

        }).error(function (error) {
            $scope.Error = error;
        })

    };

    //first call to pricesheet
    $scope.GetOpportunityList($routeParams.OppId);
    $scope.GetMaximumGroupPriceSheetId();


    $scope.EditSheet = function () {
        //$scope.GetOpportunityList($routeParams.OppId);
        var LockSheetModel = { OppId: $scope.OpportunityDetail.OppId, GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'OppConfig', IsPriceSheetUpdated: false };

        priceService.LocktheSheetByGroupid(LockSheetModel).success(function (data) {

            if (!data.IsLocked) {
                $scope.grideditable = true;
                $scope.$broadcast('timer-reset');
                $scope.$broadcast('timer-start');
                $('#showmod').modal('hide');
            }
            else {
                if (data.LockedUser == $rootScope.UserInfo.user.userId && data.LockedIn == "OppConfig") {
                    $scope.grideditable = true;
                    $scope.counter = 0;
                    $scope.$broadcast('timer-reset');
                    $scope.$broadcast('timer-start');
                    $('#showmod').modal('hide');
                }
                else {
                    $scope.grideditable = false;
                    $scope.sheetholdedby = "LockedIn: " + data.LockedIn + " By " + data.LockedUser;
                }
            }

        }).error(function (error) {

            $scope.Error = error;
        })
    }

    //adding Paymenet sheet values
    $scope.AddOppConfig = function (isdiscard) {
        // debugger;


        var Jsondata = { OppId: $scope.OpportunityDetail.OppId, IsSaveAs: false, SheetId: $scope.MaxSheetGroupID, Version: $scope.MaxVersion, IsReadOnly: $scope.grideditable, paymentsheet: $scope.OpportunityDetail, Authour: $rootScope.UserInfo.user.userId };


        GrossMarginService.AddOppConfig(Jsondata).success(function (data) {
            if (!$scope.pageLoad) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.grideditable = false;

                    toaster.pop('success', "SAVE", 'OppConfig Sheet Saved Successfully', 3000);

                }
                else {
                    toaster.pop('error', "Error", data.Error, null);
                }
            }
            else {
                $scope.pageLoad = false;
            }

        }).error(function (error) {

        });

        $('#showSavemodel').modal('hide');

    }

    //updating pricesheet to new version
    $scope.UpdateOppConfigSheetVersion = function () {
        //have to work here
        priceService.GetMaximumGroupPriceSheetId().success(function (data) {
            if (data[0].count == 'null') {
                $scope.MaxSheetGroupIDForSaveAs = 1;
            }
            else {
                $scope.MaxSheetGroupIDForSaveAs = data[0].count + 1;
            }

            var currentversion = $scope.MaxVersion.split('_')[1];
            var i = (parseFloat(currentversion) + parseFloat('0.1')).toFixed(1);
            var version = 'Ver_' + i;

            $routeParams.GroupId = $scope.MaxSheetGroupIDForSaveAs;

            var Jsondata = { ExisitingPriceGroupId: $scope.MaxSheetGroupID, OppId: $scope.OpportunityDetail.OppId, IsSaveAs: true, SheetId: $scope.MaxSheetGroupIDForSaveAs, IsReadOnly: $scope.grideditable, paymentsheet: $scope.data, Comment: $scope.Comment, Authour: $rootScope.UserInfo.user.userId };
            Jsondata.Version = version;
            GrossMarginService.AddOppConfig(Jsondata).success(function (data) {
                if (data.Error == '' || data.Error == undefined || data.Error == null) {
                    $scope.grideditable = false;
                    redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
                }
                else {
                    toaster.pop('error', "Error", data.Error, 3000);
                }
            }).error(function (error) {

            });

            $('#showsaveAsmodel').modal('hide');
        });
    }

    $scope.GetPriceSheetVersionsForOpp = function (oppid) {
        console.log('version template' + oppid)
        priceService.GetPriceSheetVersionsForOpp(oppid).success(function (data) {
            // debugger
            $scope.Versiondata = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.IncreaseAdditionalTimeToSheet = function () {
        var LockSheetModel = { GroupId: $scope.MaxSheetGroupID, username: $rootScope.UserInfo.user.userId, LockedInApp: 'OppConfig' };
        priceService.IncreaseAdditionalTimeToSheet(LockSheetModel).success(function (data) {
            if (!data.IsLocked) {
                $scope.hasedit = false;
                $scope.griduseredit = true;
                $scope.$broadcast('timer-add-cd-seconds', 840);
                $('#showmod').modal('hide');
            }
            else {
                $scope.sheetholdedby = data.LockedUser;

                if (data.LockedUser == $rootScope.UserInfo.user.userId) {
                    $scope.hasedit = false;
                    $scope.griduseredit = true;
                    $scope.grideditable = true;
                    $scope.counter = 0;
                    $scope.$broadcast('timer-add-cd-seconds', 840);
                    $('#showmod').modal('hide');
                }
                else {
                    $scope.grideditable = false;
                    $scope.hasedit = true;
                    $scope.griduseredit = false;
                    $scope.sheetholdedby = 'Error occured..';
                }
            }
            $scope.onLoad();

        }).error(function (error) {

            $scope.Error = error;
        })
    }

    //pop up data 
    $scope.closepopup = function () {
        redirectRefreshPage($routeParams.OppId, $routeParams.GroupId)
    }

    $scope.finished = function () {
        $('#showmod').modal('show');
    }

    $scope.AddOppConfigpop = function () {
        $('#showSavemodel').modal('show');
    }

    $scope.CancelOppConfig = function () {
        $('#showSavemodel').modal('hide');
    }

    $scope.saveasOppConfigpop = function () {
        $('#showsaveAsmodel').modal('show');
    }

    $scope.CancelOppConfigsaveas = function () {
        $('#showsaveAsmodel').modal('hide');
    }

    $scope.onBtExport = function () {


        paymentService.ExportToExcelSheet($routeParams.OppId, $routeParams.GroupId).success(function (data) {
            console.log(data);
            var url = BaseURL + 'ExportFiles/' + data.name;

            $scope.downloadurl = url;
            $scope.filename = data.name;
            setTimeout(function () {
                $('#downloadpdf')[0].click();
            }, 1000);

        }).error(function (error) {
            $scope.Error = error;
        })

    }

    //pop up data 

    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        //if ($scope.grideditable) {
        //    $('#showSaveChangesmodel').modal('show');
        //    event.preventDefault();
        //}
    });


    $scope.saveasOppConfigdiscard = function () {
        $scope.grideditable = false;
        $scope.AddOppConfig(true);
        $('#showSaveChangesmodel').modal('hide');
        // var url = $scope.newnavigateURl.split('#');
        // $location.path(url[1]);
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.CancelOppConfigdiscard = function () {
        $scope.grideditable = false;
        $scope.IgnoreChanges();
        $('#showSaveChangesmodel').modal('hide');
        // var url = $scope.newnavigateURl.split('#');
        // $location.path(url[1]);
        $window.location.href = $scope.newnavigateURl;
    }

    $scope.DefautState = false;
    $scope.MakeContainerFullScreen = function (state) {
        $scope.DefautState = !state;
        if ($scope.DefautState) {
            document.getElementsByClassName('main-sidebar')[0].style.display = "none";
            document.getElementsByClassName('main-header')[0].style.display = "none";
            document.getElementsByClassName('main-footer')[0].style.display = "none";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = "0px";
            //style.marginLeft = "0px!important";
        }
        else {
            document.getElementsByClassName('main-sidebar')[0].style.display = "block";
            document.getElementsByClassName('main-header')[0].style.display = "block";
            document.getElementsByClassName('main-footer')[0].style.display = "block";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = null;
        }
    }

    //refresh page when data done
    function redirectRefreshPage(oppId, groupId) {
        $location.path("OppConfig/" + oppId + "/" + groupId);
    }



    $scope.MakeContainerFullScreen = function (state) {
        $scope.DefautState = !state;
        if ($scope.DefautState) {
            document.getElementsByClassName('main-sidebar')[0].style.display = "none";
            document.getElementsByClassName('main-header')[0].style.display = "none";
            document.getElementsByClassName('main-footer')[0].style.display = "none";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = "0px";
        }
        else {
            document.getElementsByClassName('main-sidebar')[0].style.display = "block";
            document.getElementsByClassName('main-header')[0].style.display = "block";
            document.getElementsByClassName('main-footer')[0].style.display = "block";
            document.getElementsByClassName('content-wrapper')[0].style.marginLeft = null;
        }

    }


    $scope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {
        $scope.newnavigateURl = newUrl;
        if ($scope.grideditable) {
            $('#showSaveChangesmodel').modal('show');
            event.preventDefault();
        }
    });


    $scope.IgnoreChanges = function () {
        priceService.ReleaseSheetWhenExpired($scope.GlobalGroupId).success(function (data) {
            //alert(data)
            $scope.grideditable = false;
            $scope.GetOpportunityList($routeParams.OppId);
        }).error(function (error) {

            $scope.Error = error;
        })
    }


    $scope.ClosePriceSheetdiscard = function () {
        $('#showSaveChangesmodel').modal('hide');
    }

    $scope.IsPageReadOnly = function () {
        var isRead = true;
        $scope.IsReadOnly = true;
        reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName == 'OppConfig Write') {
                    isRead = false;
                }
            })
            if (!isRead) {
                $scope.IsReadOnly = false;
            }
        });
    }
    $scope.IsPageReadOnly();



});


