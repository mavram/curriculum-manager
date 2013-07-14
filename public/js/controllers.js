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

    .controller('UserCtrl', ['$rootScope', '$scope', '$http', '$location', '$route', 'UserSvc', function ($rootScope, $scope, $http, $location, $route, UserSvc) {
        console.log('UserCtrl:init:.......');

        $scope.settings = UserSvc.settings();
        UserSvc.initSettings(function() {
            $route.reload();
        }, function(msg) {
            $scope.error = msg;
        });
        console.log("UserCtrl:" + JSON.stringify($scope.settings));
        console.log('UserCtrl:init: OK!');
    }])

    .controller('HierarchyCtrl', ['$rootScope', '$scope', '$http', '$route', 'HierarchySvc', function ($rootScope, $scope, $http, $route, HierarchySvc) {
        console.log('HierarchyCtrl:init:.......');

        $scope.subjects = HierarchySvc.subjects();
        HierarchySvc.initSubjects(function() {
            console.log("HierarchyCtrl: loaded subjects:" + JSON.stringify($scope.subjects));
            $route.reload();
        }, function(msg) {
            $scope.error = msg;
        });
        $scope.subject = $scope.subjects.length ? $scope.subjects[0] : undefined;

        $scope.grades = HierarchySvc.grades();
        HierarchySvc.initGrades(function() {
            console.log("HierarchyCtrl: loaded grades:" + JSON.stringify($scope.grades));
            $route.reload();
        }, function(msg) {
            $scope.error = msg;
        });
        $scope.grade = $scope.grades.length ? $scope.grades[0] : undefined;

        $scope.categories = HierarchySvc.categories($scope.subject, $scope.grade);
        HierarchySvc.initCategories(function() {
            console.log("HierarchyCtrl: loaded categories:" + JSON.stringify($scope.categories));
            $route.reload();
        }, function(msg) {
            $scope.error = msg;
        });
        $scope.category = $scope.categories.length ? $scope.categories[0] : undefined;

        console.log("HierarchyCtrl:subjects:" + JSON.stringify($scope.subjects));
        console.log("HierarchyCtrl:grades:" + JSON.stringify($scope.grades));
        console.log("HierarchyCtrl:categories:" + JSON.stringify($scope.categories));
        console.log("HierarchyCtrl:category:" + JSON.stringify($scope.category));
        console.log('HierarchyCtrl:init: OK!');

        $scope.onSubjectClick = function(idx) {
            $scope.subject = $scope.subjects[idx];
        };

        $scope.onGradeClick = function(idx) {
           $scope.grade = $scope.grades[idx];
        };

        $scope.onCategoryClick = function(id) {
            // TODO: switch to new category
        };

        $scope.addCategory = function() {
            // TODO: add new category
            $scope.newCategoryName = undefined;
        };

        $scope.editCategory = function(id) {
            // TODO: edit category
        };

        $scope.removeCategory = function(id) {
            // TODO: remove category
        };
        
        $scope.addSkill = function() {
            // TODO: add new skill
            $scope.newSkillName = undefined;
        };

        $scope.editSkill = function(id) {
            // TODO: edit skill
        };

        $scope.removeSkill = function(id) {
            // TODO: remove skill
        };
    }]);
