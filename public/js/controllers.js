/*
 * Controllers
 */
'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl', ['$scope', function ($scope) {
    }])
    .controller('UserCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/v.1/user/accountSettings').success(function(data) {
            $scope.user = data;
        });
    }]);