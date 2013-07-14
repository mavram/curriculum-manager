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

            $dev_null.log("AppCtrl:$location.path():" + $location.path());
            $dev_null.log("AppCtrl:currentPage:" + $scope.currentPage);

            $scope.user = AuthSvc.user;
//            $dev_null.log("AppCtrl:user:" + JSON.stringify($scope.user));

            $scope.signin = function (username, password, rememberMe) {
                $dev_null.log('AuthSvc:signin:' + username + ':' + password + ':' + rememberMe);

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

            $dev_null.log("UserCtrl:$location.path():" + $location.path());
//            $dev_null.log("UserCtrl:UserSvc:settings:" + JSON.stringify(UserSvc.settings));
//            $dev_null.log("UserCtrl:$scope;settings:" + JSON.stringify($scope.settings));

            UserSvc.initSettings(function (msg) {
                $scope.setError(msg);
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
                $scope.setError(msg);
            });

            $scope.grades = HierarchySvc.grades;
            if ($scope.grades.length) {
                $scope.grade = $scope.grades[0];
            }
            HierarchySvc.initGrades(function () {
                $scope.grade = $scope.grades[0];
            }, function (msg) {
                $scope.setError(msg);
            });

            var _reloadCategories = function () {
                $scope.categories = [];
                if (HierarchySvc.categories.length && $scope.subject && $scope.grade) {
                    HierarchySvc.categories.forEach(function (c) {
                        if ((c.subject === $scope.subject) && (c.grade === $scope.grade)) {
                            $scope.categories.push(c);
                        }
                    });
                }
                $scope.category = $scope.categories[0];
            }

            HierarchySvc.initCategories(function () {
                _reloadCategories();
            }, function (msg) {
                $scope.setError(msg);
            });

            $dev_null.log("HierarchyCtrl:$location.path():" + $location.path());
//            $dev_null.log("HierarchyCtrl:HierarchySvc;categories:" + JSON.stringify(HierarchySvc.categories));
//            $dev_null.log("HierarchyCtrl:$scope;categories:" + JSON.stringify($scope.categories));

            $scope.onSubjectClick = function (idx) {
                $scope.subject = $scope.subjects[idx];
                _reloadCategories();
            };

            $scope.onGradeClick = function (idx) {
                $scope.grade = $scope.grades[idx];
                _reloadCategories();
            };

            $scope.onCategoryClick = function (id) {
                HierarchySvc.categories.forEach(function (c) {
                    if (c._id === id) {
                        $scope.category = c;
                    }
                });
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
