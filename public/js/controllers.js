/*
 * Controllers
 */
'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl', ['$scope', function ($scope) {
    }])
    .controller('HierarchyCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/v.1/hierarchy/curricula').success(function(data) {
            $scope.curricula = data;
        });
        $http.get('/api/v.1/hierarchy/subjects').success(function(data) {
            $scope.subjects = data;
        });
    }])
    .controller('UserCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/v.1/user/accountSettings').success(function(data) {
            $scope.user = data;
        });
    }]);