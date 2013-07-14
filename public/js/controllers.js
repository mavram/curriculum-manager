/*
 * Controllers
 */

'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl', ['$rootScope', '$scope', '$location', 'AuthSvc',
        function ($rootScope, $scope, $location, AuthSvc) {
            $scope.$location = $location;
            $scope.user = AuthSvc.user;

            $scope.signout = function () {
                AuthSvc.signout(function () {
                    // TODO: fix this (the AppCtrl is not reloaded)
                    $location.path('/');
                }, function () {
                    $scope.error = "Failed to sign out.";
                });
            };
        }])

    .controller('AuthCtrl', ['$rootScope', '$scope', '$location', 'AuthSvc', '$cookieStore',
        function ($rootScope, $scope, $location, AuthSvc) {
            $scope.$location = $location;

            $scope.signin = function () {
                AuthSvc.signin({
                    username: $scope.username,
                    password: $scope.password,
                    rememberMe: $scope.rememberMe
                }, function () {
                    $location.path('/');
                }, function (msg) {
                    $scope.error = msg;
                });
            };
        }])

    .controller('UserCtrl', ['$rootScope', '$scope', '$http', '$location', '$route', '$routeParams', 'UserSvc',
        function ($rootScope, $scope, $http, $location, $route, $routeParams, UserSvc) {
            $scope.$location = $location;
            $scope.settings = UserSvc.settings;

            UserSvc.initSettings(function (msg) {
                $scope.error = msg;
            });
        }])

    .controller('HierarchyCtrl', ['$rootScope', '$scope', '$http', '$route', '$location', 'HierarchySvc',
        function ($rootScope, $scope, $http, $route, $location, HierarchySvc) {
            $scope.$location = $location;

            $scope.subjects = HierarchySvc.subjects;
            if ($scope.subjects.length) {
                $scope.subject = $scope.subjects[0];
            }
            HierarchySvc.initSubjects(function () {
                $scope.subject = $scope.subjects[0];
            }, function (msg) {
                $scope.error = msg;
            });

            $scope.grades = HierarchySvc.grades;
            if ($scope.grades.length) {
                $scope.grade = $scope.grades[0];
            }
            HierarchySvc.initGrades(function () {
                $scope.grade = $scope.grades[0];
            }, function (msg) {
                $scope.error = msg;
            });

            var _reloadCategories = function () {
                HierarchySvc.loadCategoriesBySubjectAndGrade($scope.subject, $scope.grade, $scope.categories);
                $scope.category = $scope.categories[0];
            }

            $scope.categories = [];
            HierarchySvc.initCategories(function () {
                _reloadCategories();
            }, function (msg) {
                $scope.error = msg;
            });

            $scope.onSubjectClick = function (idx) {
                $scope.subject = $scope.subjects[idx];
                _reloadCategories();
            };

            $scope.onGradeClick = function (idx) {
                $scope.grade = $scope.grades[idx];
                _reloadCategories();
            };

            $scope.onCategoryClick = function (id) {
                $scope.category = HierarchySvc.categoryById(id);
            };

            $scope.addCategory = function () {
                // TODO: add new category
                $scope.newCategoryName = undefined;
            };

            $scope.editCategory = function (id) {
                // TODO: edit category
            };

            $scope.removeCategory = function (id) {
                // TODO: remove category
            };

            $scope.addSkill = function () {
                // TODO: add new skill
                $scope.newSkillName = undefined;
            };

            $scope.editSkill = function (id) {
                // TODO: edit skill
            };

            $scope.removeSkill = function (id) {
                // TODO: remove skill
            };
        }]);
