/*
 * Controllers
 */
'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl', ['$scope', function ($scope) {
    }])
    .controller('AccountCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('/api/v.1/account/:').success(function(data) {
            console.log(data);
            $scope.username = 'hekademos';
        });

    }]);