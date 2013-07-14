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
        $scope.category = $scope.categories ? $scope.categories[0] : undefined;
        $scope.skills = HierarchySvc.skills($scope.category);

        console.log("HierarchyCtrl:subjects:" + JSON.stringify($scope.subjects));
        console.log("HierarchyCtrl:grades:" + JSON.stringify($scope.grades));
        console.log("HierarchyCtrl:categories:" + JSON.stringify($scope.categories));
        console.log("HierarchyCtrl:skills:" + JSON.stringify($scope.skills));
        console.log('HierarchyCtrl:init: OK!');

        $scope.onSubjectClick = function(idx) {
            $scope.subject = $scope.subjects[idx];
        };

        $scope.onGradeClick = function(idx) {
           $scope.grade = $scope.grades[idx];
        };

        $scope.onCategoryClick = function(c) {
            console.log(c)
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
