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
                $scope.error = "Failed to sign out.";
            });
        };
    }])

    .controller('AuthCtrl',['$rootScope', '$scope', '$location', 'AuthSvc', '$cookieStore', function($rootScope, $scope, $location, AuthSvc) {
        //console.log('AuthCtrl:init: .......');

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

    .controller('UserCtrl', ['$rootScope', '$scope', '$http', 'UserSvc', function ($rootScope, $scope, $http, $UserSvc) {
        //console.log('UserCtrl:init: .......');

        $scope.settings = function() {
            UserSvc.settings(function(settings) {
                $scope.settings = settings;
            }, function(msg) {
                $scope.error = msg;
            });
        };
    }])

    .controller('HierarchyCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
        console.log('HierarchyCtrl:init: .......');

        $scope.subjects = ['Math', 'Science'];
        $scope.subject = $scope.subjects.length > 0 ? $scope.subjects[0] : undefined;
        $scope.grades = [1, 2, 3, 4, 5, 6, 7, 8];
        $scope.grade = $scope.grades.length > 0 ? $scope.grades[0] : undefined;
        $scope.categories = ['Addition', 'Substraction', 'Geometry'];
        $scope.category = $scope.categories.length ? $scope.categories[0] : undefined;
        $scope.skills = ['Addition - one digit'];

        $scope.onSubjectClick = function(idx) {
            $scope.subject = $scope.subjects[idx];
        };

        $scope.onGradeClick = function(idx) {
           $scope.grade = $scope.grades[idx];
        };

        $scope.onCategoryClick = function(idx) {
            $scope.category = $scope.categories[idx];

            switch (idx) {
                case 0: {
                    $scope.skills = ['Addition - one digit'];
                }; break;
                case 1: {
                    $scope.skills = ['Substraction on digit'];
                }; break;
                case 2: {
                    $scope.skills = ['Perimeter', 'Area'];
                }; break;
            }
        };

//
//
//
//        $http.get('/api/v.1/hierarchy/curricula').success(function(data) {
//            $scope.curricula = data;
//        });
//        $http.get('/api/v.1/hierarchy/subjects').success(function(data) {
//            $scope.subjects = data;
//        });
//        $http.get('/api/v.1/hierarchy/categories').success(function(data) {
//            $scope.categories = data;
//        });
//        $http.get('/api/v.1/hierarchy/skills').success(function(data) {
//            $scope.skills = data;
//        });
    }]);
