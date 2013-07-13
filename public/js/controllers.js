/*
 * Controllers
 */

'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl',['$rootScope', '$scope', '$location', 'AuthSvc', function($rootScope, $scope, $location, AuthSvc) {
        console.log('AppCtrl:init: .......');

        $scope.user = AuthSvc.user();
        console.log('AppCtrl:init:user' + JSON.stringify($scope.user));

        $scope.signout = function() {
            AuthSvc.signout(function() {
                // TODO: fix this (the AppCtrl is not reloaded)
                $location.path('/');
            }, function() {
                $rootScope.error = "Failed to sign out.";
            });
        };
    }])

    .controller('AuthCtrl',['$scope', '$location', 'AuthSvc', '$cookieStore', function($scope, $location, AuthSvc) {
        console.log('AuthCtrl:init: .......');

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

    .controller('UserCtrl', ['$scope', '$http', 'UserSvc', function ($scope, $http, $UserSvc) {
        console.log('UserCtrl:init: .......');

        $scope.settings = function() {
            UserSvc.settings(function(settings) {
                $scope.settings = settings;
            }, function(msg) {
                $scope.error = msg;
            });
        };
    }])

    .controller('HierarchyCtrl', ['$scope', '$http', function ($scope, $http) {
        console.log('HierarchyCtrl:init: .......');

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
    }]);
