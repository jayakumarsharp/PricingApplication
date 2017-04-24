loginApp.controller('validateController', function ($scope, $routeParams, $window, AccessToken, TokenFactory, Endpoint, Storage, $location, $rootScope) {
    //alert(" Code --" + $rootScope.code);
    var authCode = $rootScope.code;
    $scope.loading = false;
    var UserInfo = window.sessionStorage.getItem('userAuth');

    if (UserInfo != undefined || UserInfo != null) {
        $scope.imagesPath = ServionImages;
        $scope.loading = true;
    }

    if (authCode != undefined && authCode.length > 1) {

        $scope.imagesPath = ServionImages;
        $scope.loading = true;
        GetAccessToken();
    }
    else {
        console.log('unable to fid code');
    }
    function GetAccessToken() {

        if ((authCode != null && authCode != undefined) && ($scope.accessToken == null || $scope.accessToken == undefined)) {
            // alert(angular.toJson(Endpoint.config));
            //console.log(angular.toJson(Endpoint.config));
            var param = {
                grant_type: 'authorization_code', client_id: '1234567',
                redirect_uri: 'http://localhost/PT/Login.html', code: authCode, profileUri: undefined,
                tokenPath: '/oauth2/token', site: 'https://adfs.servion.com/adfs'
            };
            TokenFactory.ADFSToken(param).success(function (data) {
                Storage.set('token', data.AccesTokenData);
                $window.sessionStorage.setItem("userAuth", angular.toJson(data.UserInfo));

                var url = urltype + "//" + $window.location.host + HostPath + "/index.html";

                $window.location.href = url;
                $scope.loading = false;
            }).error(function (errData) {
                console.log(errData);
                // console.log(errData);
                // alert(errData);
                $scope.loading = false;
                $scope.errMsg = errData.message;
                $window.sessionStorage.removeItem('userAuth');

            })
        }

    }

    $scope.$on('oauth:login', function (event, token) {
        
        $scope.accessToken = token.access_token;
    });
    $scope.$on('oauth:logout', function (event) {
        console.log('logout');
        $scope.accessToken = null;
        //  GetAccessToken();
    });

}).factory('TokenFactory', function ($http) {
    var TokenFactory = {
        ADFSToken: function (param) {
            return $http({
                method: 'POST',
                url: BaseURL + 'auth/Login',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: param
            });
        }
    };
    return TokenFactory;
});