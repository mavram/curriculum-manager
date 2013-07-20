/*
 * Controllers
 */

'use strict';

angular.module('K12.controllers', [])
    .controller('AppCtrl', ['$rootScope', '$scope', '$location', '$route', 'AuthSvc',
        function ($rootScope, $scope, $location, $route, AuthSvc) {
            $scope.$location = $location;
            $scope.currentPage = $location.path().slice(1);
            if ($scope.currentPage.length == 0) {
                $scope.currentPage = "home";
            }

            $scope.user = AuthSvc.user;

            $scope.signin = function (username, password, rememberMe) {
                AuthSvc.signin({
                    username: username,
                    password: password,
                    rememberMe: rememberMe
                }, function () {
                    $location.path('/');
                }, function (msg) {
                    $scope.setError(msg);
                });
            };

            $scope.signout = function () {
                AuthSvc.signout(function () {
                    $location.path('/');
                    $route.reload();
                }, function () {
                    $scope.error = "Failed to sign out.";
                });
            };

            $scope.setError = function (msg) {
                $scope.error = msg;
            };
        }])

    .controller('UserCtrl', ['$rootScope', '$scope', '$http', '$location', '$route', '$routeParams', 'UserSvc',
        function ($rootScope, $scope, $http, $location, $route, $routeParams, UserSvc) {
            $scope.$location = $location;
            $scope.settings = UserSvc.settings;

            UserSvc.initSettings(function (msg) {
                $scope.setError(msg);
            });
        }])

    .controller('HierarchyCtrl', ['$rootScope', '$scope', '$http', '$route', '$location', 'HierarchySvc',
        function ($rootScope, $scope, $http, $route, $location, HierarchySvc) {
            $scope.$location = $location;

            $scope.subjects = HierarchySvc.subjects;
            $scope.categories = HierarchySvc.categories;

            var defaultError = function (msg) {
                $scope.setError(msg);
            };

            HierarchySvc.initHierarchy(function () {
                $scope.subject = $scope.subjects[0];
                $scope.category = $scope.categories[$scope.subject][0];
            }, defaultError);

            $scope.onSubjectClick = function (s) {
                $scope.subject = s;
                $scope.category = $scope.categories[$scope.subject][0];
                $scope.editableCategory = null;
                $scope.editableSkill = null;

            };

            $scope.onCategoryClick = function (c) {
                $scope.category = c;
                $scope.editableCategory = null;
                $scope.editableSkill = null;
            };

            $scope.addCategory = function (name) {
                HierarchySvc.addCategory($scope.subject, name, defaultError);
            };

            $scope.startEditingCategory = function (c) {
                $scope.editableCategory = c;
            };

            $scope.doneEditingCategory = function (c, isUpdating) {
                if (isUpdating) {
                    HierarchySvc.updateCategory(c, defaultError);
                }
                $scope.editableCategory = null;
            };

            $scope.removeCategory = function (id) {
                var success = function (category) {
                    // update current category
                    if ($scope.category._id == category._id) {
                        if ($scope.categories[$scope.subject].length) {
                            $scope.category = $scope.categories[$scope.subject][0];
                        } else {
                            $scope.category = null;
                        }
                    }
                };

                HierarchySvc.removeCategory($scope.subject, id, success, defaultError);
            };

            $scope.addSkill = function (name) {
                HierarchySvc.addSkill($scope.subject, $scope.category, name, defaultError);
            };


            $scope.startEditingSkill = function (s) {
                $scope.editableSkill = s;
            };

            $scope.doneEditingSkill = function (s, isUpdating) {
                if (isUpdating) {
                    HierarchySvc.updateSkill($scope.category, s, defaultError);
                }
                $scope.editableSkill = null;
            };

            $scope.removeSkill = function (id) {
                HierarchySvc.removeSkill($scope.subject, $scope.category, id, defaultError);
            };
        }]);