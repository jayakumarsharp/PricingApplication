var profileApp = angular.module('profileApp', []);

profileApp.factory('ProfileFactory', function ($http, $q) {
    var profileUrl = BaseURL + 'users';
    var ProfileFactory = {
        GetUserProfile: function (userId) {
            return $http.get(profileUrl + '/profile/?userId=' + userId);
        },
        GetUser: function (userid) {
            return $http.get(profileUrl + '/?userId=' + userid);
        },
    };
    return ProfileFactory;
});

profileApp.controller('ProfileController', function ($scope, $rootScope, ProfileFactory) {
    $scope.userId = $rootScope.UserInfo.user.userId;
    $scope.errMsg = '';
    $scope.UserProfile = {};
    $scope.UserImagePath = ServionImages + 'ADUsers/' +  $scope.userId;

    $scope.GetUserProfile = function () {
        console.log('Getting user profile for user  ' + $scope.userId);
        $scope.errMsg = '';

        ProfileFactory.GetUserProfile($scope.userId).success(function (data) {
            $scope.UserProfile = data;            
        }).error(function (error) {
            $scope.errMsg = error;
        });
        ProfileFactory.GetUser($scope.userId).success(function (data) {
            $scope.UserProfile.User = data;
            var lastAuthDate = new Date(data.LastAuthenticatedDate);
            $scope.UserProfile.User.LastAuthenticatedDate = formatDate(lastAuthDate);
        }).error(function (error) {
            $scope.errMsg = error;
        });
    }

    var formatDate = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + "  " + strTime;
    }
    $scope.GetUserProfile();
});