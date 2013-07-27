/*
 * Controllers
 */

'use strict';


var _getGradeName = function(idx) {
    if (idx === 0) {
        return 'JK/SK';
    }
    return 'Grade ' + idx;
};


angular.module('K12.controllers', [])
    .controller('AppCtrl', ['$rootScope', '$scope', '$location', '$route', 'AuthSvc', 'BasicHierarchySvc',
        function ($rootScope, $scope, $location, $route, AuthSvc, BasicHierarchySvc) {
            $scope.$location = $location;
            $scope.currentPage = $location.path().slice(1);
            if ($scope.currentPage.length == 0) {
                $scope.currentPage = "home";
            }

            $scope.grades = BasicHierarchySvc.grades;
            $scope.subjects = BasicHierarchySvc.subjects;
            $scope.user = AuthSvc.user;

            BasicHierarchySvc.initBasicHierarchy(function () {
                if (!$scope.user.grade) {
                    $scope.user.grade = $scope.grades[0];
                }
            }, _defaultError);

            function _defaultError(msg) {
                $scope.error = msg;
            }

            $scope.signin = function (email, password, rememberMe) {
                AuthSvc.signin({
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                }, function () {
                    $location.path('/');
                }, _defaultError);
            };

            $scope.signout = function () {
                AuthSvc.signout(function () {
                    $location.path('/');
                }, function () {
                    _defaultError("Failed to sign out.");
                });
            };

            $scope.signup = function() {
                var password = $scope.user.password;
                AuthSvc.signup($scope.user, function (user) {
                    $scope.signin($scope.user.email, password, true);
                }, _defaultError);
            };

            $scope.getGradeName = _getGradeName;

            $scope.setError = _defaultError;

            $scope.onAlertClose = function () {
                _defaultError(null);
            };
        }])

    .controller('HierarchyCtrl', ['$rootScope', '$scope', '$http', '$route', '$location', 'HierarchySvc',
        function ($rootScope, $scope, $http, $route, $location, HierarchySvc) {
            $scope.$location = $location;

            $scope.subjects = HierarchySvc.subjects;
            $scope.categories = HierarchySvc.categories;
            $scope.grades = HierarchySvc.grades;

            function _defaultError(msg) {
                $scope.setError(msg);
            }

            function _resetState() {
                $scope.editableCategory = null;
                $scope.editableSkill = null;
                $scope.skillWithGrades = null;
                $scope.assignedGrades = [];
            }

            HierarchySvc.initHierarchy(function () {
                $scope.subject = $scope.subjects[0];
                $scope.category = $scope.categories[$scope.subject][0];
                _resetState();
            }, _defaultError);

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
                HierarchySvc.addCategory($scope.subject, name, function() {
                    $scope.category = $scope.categories[$scope.subject][0];
                    _resetState();
                }, _defaultError);
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
                        _resetState();
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
                $scope.assignedGrades = [];
                $scope.grades.forEach(function() {
                    $scope.assignedGrades.push(false);
                });
                if (s.grades) {
                    s.grades.forEach(function(g) {
                        $scope.assignedGrades[g] = true;
                    });
                }
            };
            $scope.getGradeName = _getGradeName;

            $scope.assignGrade = function(idx) {
                $scope.assignedGrades[idx] = !$scope.assignedGrades[idx];
            };

            $scope.doneAssigningGradesToSkill = function (s, isAssigning) {
                if (isAssigning) {
                    s.grades = [];
                    for (var i = 0; i < $scope.assignedGrades.length; i++) {
                        if ($scope.assignedGrades[i]) {
                            s.grades.push(i);
                        }
                    }
                    $scope.assignedGrades = [];
                    HierarchySvc.updateSkillGrades($scope.category, s, _defaultError);
                }
                $scope.skillWithGrades = null;
                $scope.assignedGrades = [];
            };

            $scope.removeSkill = function (id) {
                HierarchySvc.removeSkill($scope.subject, $scope.category, id, _defaultError);
            };
        }])

    .controller('DashboardCtrl', ['$rootScope', '$scope', '$location', 'HierarchySvc',
        function ($rootScope, $scope, $location, HierarchySvc) {
            $scope.$location = $location;

            $scope.subjects = HierarchySvc.subjects;
            $scope.grades = HierarchySvc.grades;

            var cachedCategoriesByGradeAndSubject = [];

            function _defaultError(msg) {
                $scope.setError(msg);
            }

            function _reloadCategoriesByGradeAndSubject() {
                function _reset(categories) {
                    $scope.categories = categories;
                    $scope.category = null;
                    $scope.skill = null;
                    if ($scope.categories.length) {
                        $scope.category = $scope.categories[0];
                        if ($scope.category.skills && $scope.category.skills.length) {
                            $scope.skill = $scope.category.skills[0];
                        }
                    }
                }

                var key = $scope.grade + '-' + $scope.subject;
                var cachedCategories = cachedCategoriesByGradeAndSubject[key];
                if (cachedCategories) {
                    return _reset(cachedCategories);
                }

                $scope.categories = [];
                return HierarchySvc.getCategoriesByGradeAndSubject($scope.grade, $scope.subject, function(categories) {
                    cachedCategoriesByGradeAndSubject[key] = categories;
                    _reset(categories)
                }, _defaultError);
            }

            HierarchySvc.initHierarchy(function () {
                $scope.grade = $scope.user.grade ? $scope.user.grade : 0;
                $scope.subject = $scope.subjects[0];
                _reloadCategoriesByGradeAndSubject();
            }, _defaultError);

            $scope.getGradeName = _getGradeName;

            $scope.getCurrentGradeName = function () {
                return _getGradeName($scope.grade);
            };

            $scope.onGradeClick = function (g) {
                $scope.grade = g;
                _reloadCategoriesByGradeAndSubject();
            };

            $scope.onSubjectClick = function (s) {
                $scope.subject = s;
                _reloadCategoriesByGradeAndSubject();
            };

            $scope.onCategoryClick = function (c) {
                $scope.category = c;
                $scope.skill = null;
                if ($scope.category.skills && $scope.category.skills.length) {
                    $scope.skill = $scope.category.skills[0];
                }
            };

            $scope.onSkillClick = function (s) {
                $scope.skill = s;
            };
        }]);