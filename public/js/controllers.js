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

            var _reloadCategories = function () {
                $scope.categories = [];
                if (HierarchySvc.categories.length && $scope.subject) {
                    HierarchySvc.categories.forEach(function (c) {
                        if (c.subject === $scope.subject) {
                            $scope.categories.push(c);
                        }
                    });
                }
                $scope.category = $scope.categories[0];
            };

            HierarchySvc.initCategories(function () {
                _reloadCategories();
            }, function (msg) {
                $scope.setError(msg);
            });

            $dev_null.log("HierarchyCtrl:$location.path():" + $location.path());

            $scope.onSubjectClick = function (idx) {
                $scope.subject = $scope.subjects[idx];
                _reloadCategories();
            };

            $scope.onCategoryClick = function (id) {
                HierarchySvc.categories.forEach(function (c) {
                    if (c._id === id) {
                        $scope.category = c;
                    }
                });
            };

            $scope.addCategory = function (name) {
                var error = function (msg) {
                    $scope.setError(msg);
                };

                var success = function (category) {
                    $dev_null.log('HierarchyCtrl:addCategory:' + JSON.stringify(category));
                    // TODO: reload only changed DOM elements
                    $route.reload();
                };

                HierarchySvc.addCategory($scope.subject, name, success, error);
            };

            $scope.editCategory = function (id) {
                // TODO: edit category
            };

            $scope.removeCategory = function (id) {
                var error = function (msg) {
                    $scope.setError(msg);
                };

                var success = function (category) {
                    $dev_null.log('HierarchyCtrl:removeCategory:' + JSON.stringify(category));
                    $route.reload();
                };

                HierarchySvc.removeCategory(id, success, error);
            };

            $scope.addSkill = function (categoryId, name) {
                var error = function (msg) {
                    $scope.setError(msg);
                };

                var success = function (skill) {
                    $dev_null.log('HierarchyCtrl:addSkill:' + JSON.stringify(skill));
                    $route.reload();
                };

                HierarchySvc.addSkill(categoryId, name, success, error);
            };

            $scope.editSkill = function (categoryId, id) {
                // TODO: edit skill
            };

            $scope.removeSkill = function (categoryId, id) {
                var error = function (msg) {
                    $scope.setError(msg);
                };

                var success = function (skill) {
                    $dev_null.log('HierarchyCtrl:removeSkill:' + JSON.stringify(skill));
                    $route.reload();
                };

                HierarchySvc.removeSkill(categoryId, id, success, error);
            };
        }]);
