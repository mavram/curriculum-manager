/*
 * Controllers
 */

'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl',['$rootScope', '$scope', '$location', 'AuthSvc', function($rootScope, $scope, $location, AuthSvc) {
        console.log('AppCtrl:init: .......');

        $scope.user = AuthSvc.user();

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

    .controller('UserCtrl', ['$rootScope', '$scope', '$http', '$location', 'UserSvc', function ($rootScope, $scope, $http, $location, UserSvc) {
        console.log('UserCtrl:init: .......');

        $scope.settings = UserSvc.settings();
        UserSvc.initSettings(function() {
            // TODO: how to refresh???
        }, function(msg) {
            $scope.error = msg;
        });
        console.log("UserCtrl:" + JSON.stringify($scope.settings));
        console.log('UserCtrl:init: OK!');
    }])

    .controller('HierarchyCtrl', ['$rootScope', '$scope', '$http', 'HierarchySvc', function ($rootScope, $scope, $http, HierarchySvc) {
        console.log('HierarchyCtrl:init: .......');

        $scope.subjects = HierarchySvc.subjects;
        HierarchySvc.initSubjects(function(msg) {
            $scope.error = msg;
        });
        $scope.subject = $scope.subjects.length ? $scope.subjects[0] : undefined;

        $scope.grades = HierarchySvc.grades;
        HierarchySvc.initGrades(function(msg) {
            $scope.error = msg;
        });
        $scope.grade = $scope.grades.length ? $scope.grades[0] : undefined;

        $scope.categories = HierarchySvc.categories;
        HierarchySvc.initCategories(function(msg) {
            $scope.error = msg;
        });
        $scope.category = $scope.categories.length ? $scope.categories[0] : undefined;
        $scope.skills = HierarchySvc.skills($scope.category);

        $scope.onSubjectClick = function(idx) {
            //$scope.subject = $scope.subjects[idx];
        };

        $scope.onGradeClick = function(idx) {
           //$scope.grade = $scope.grades[idx];
        };

        $scope.onCategoryClick = function(idx) {
            //$scope.category = $scope.categories[idx];
        };

        $scope.addCategory = function() {
            //$scope.categories.push($scope.newCategory);
            $scope.newCategory = undefined;
        };

        $scope.removeCategory = function(c) {
            console.log('removeCategory:' + c);
        };

        $scope.addSkill = function() {
            //$scope.skills.push($scope.newSkill);
            $scope.newSkill = undefined;
        };

        $scope.removeSkill = function(s) {
            console.log('removeSkill:' + s);
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
