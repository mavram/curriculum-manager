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
            $scope.grades = HierarchySvc.grades;

            function _defaultError(msg) {
                $scope.setError(msg);
            };

            HierarchySvc.initHierarchy(function () {
                $scope.subject = $scope.subjects[0];
                $scope.category = $scope.categories[$scope.subject][0];
                _resetState();
            }, _defaultError);

            function _resetState() {
                $scope.editableCategory = null;
                $scope.editableSkill = null;
                $scope.skillWithGrades = null;
                $scope.assignedGrades = [];
            }

            $scope.onSubjectClick = function (s) {
                $scope.subject = s;
                $scope.category = $scope.categories[$scope.subject][0];
                _resetState();
            };

            $scope.onCategoryClick = function (c) {
                $scope.category = c;
                _resetState();
            };

            $scope.addCategory = function (name) {
                HierarchySvc.addCategory($scope.subject, name, _defaultError);
            };

            $scope.startEditingCategory = function (c) {
                $scope.editableCategory = c;
            };

            $scope.doneEditingCategory = function (c, isUpdating) {
                if (isUpdating) {
                    HierarchySvc.updateCategory(c, _defaultError);
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

                HierarchySvc.removeCategory($scope.subject, id, success, _defaultError);
            };

            $scope.addSkill = function (name) {
                HierarchySvc.addSkill($scope.subject, $scope.category, name, _defaultError);
            };


            $scope.startEditingSkill = function (s) {
                $scope.editableSkill = s;
            };

            $scope.doneEditingSkill = function (s, isUpdating) {
                if (isUpdating) {
                    HierarchySvc.updateSkill($scope.category, s, _defaultError);
                }
                $scope.editableSkill = null;
            };

            $scope.startAssigningGradesToSkill = function (s) {
                $scope.skillWithGrades = s;
                $scope.grades.forEach(function(g) {
                    $scope.assignedGrades.push(false);
                });
            };

            $scope.assignGrade = function(idx) {
                $scope.assignedGrades[idx] = !$scope.assignedGrades[idx];
            }

            $scope.doneAssigningGradesToSkill = function (s, isAssigning) {
                if (isAssigning) {
                    // add code
                    console.log(JSON.stringify($scope.assignedGrades));
                }
                $scope.skillWithGrades = null;
                $scope.assignedGrades = [];
            };

            $scope.removeSkill = function (id) {
                HierarchySvc.removeSkill($scope.subject, $scope.category, id, _defaultError);
            };
        }]);