/*
 * Controllers
 */

'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl',['$rootScope', '$scope', '$location', 'AuthSvc', function($rootScope, $scope, $location, AuthSvc) {
        $scope.user = AuthSvc.user();

        //console.log('AppCtrl:init:user:' + JSON.stringify($scope.user));

        $scope.signout = function() {
            AuthSvc.signout(function() {
                $location.path('/');
            }, function() {
                $rootScope.alertMessage = "Failed to sign out.";
            });
        };
    }])

    .controller('AuthCtrl',['$scope', '$location', 'AuthSvc', '$cookieStore', function($scope, $location, AuthSvc) {
        $scope.rememberMe = AuthSvc.doesRememberMe();
        $scope.signin = function() {
            AuthSvc.signin({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }, function() {
                $location.path('/');
            }, function(msg) {
                $scope.error = msg;
            });
        };
    }])

    .controller('HierarchyCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/v.1/hierarchy/curricula').success(function(data) {
            $scope.curricula = data;
        });
        $http.get('/api/v.1/hierarchy/subjects').success(function(data) {
            $scope.subjects = data;
        });
        $http.get('/api/v.1/hierarchy/categories').success(function(data) {
            $scope.categories = data;
        });
        $http.get('/api/v.1/hierarchy/skills').success(function(data) {
            $scope.skills = data;
        });
    }])

    .controller('UserCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/v.1/user/settings').success(function(data) {
            $scope.user = data;
        });
    }]);
