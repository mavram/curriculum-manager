/*
 * Services
 */

'use strict';

angular.module('K12.services', [])
    .factory('AuthSvc', function($http, $cookieStore) {
        var cachedUser = $cookieStore.get('_k12_user');
        $cookieStore.remove('_k12_user');

        return {
            signin: function(user, success, error) {
                $http.post('/api/v.1/auth/signin', user).success(function (user) {
                    cachedUser = user;
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            signout: function(success, error) {
                $http.get('/api/v.1/auth/signout').success(function () {
                    cachedUser = {};
                    success();
                }).error(error);
            },

            user: function () {
                return cachedUser;
            }
        };
    })

    .factory('UserSvc', function($http) {
        var cachedSettings = undefined;

        return {
            initSettings: function(success, error) {
                if (cachedSettings) {
                    return;
                }
                $http.get('/api/v.1/user/settings').success(function (settings) {
                    cachedSettings = settings;
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            settings: function () {
                return cachedSettings;
            }
        };
    })

    .factory('HierarchySvc', function($http) {

        var cachedSubjects = [];
        var cachedGrades = [];
        var cachedCategories = undefined;

        var isLoaded = function () {
            return (cachedSubjects.length && cachedGrades.length && cachedCategories);
        }

        return {
            initSubjects: function(success) {
                if (cachedSubjects.length) {
                    return;
                }

                $http.get('/api/v.1/hierarchy/subjects').success(function (subjects) {
                    cachedSubjects = subjects;
                    if (isLoaded()) {
                        success();
                    }
                }).error(function(msg) {
                    error(msg);
                });
            },

            initGrades: function(success, error) {
                if (cachedGrades.length) {
                    return;
                }

                $http.get('/api/v.1/hierarchy/grades').success(function (grades) {
                    cachedGrades = grades;
                    if (isLoaded()) {
                        success();
                    }
                }).error(function(msg) {
                    error(msg);
                });
            },

            initCategories: function(success, error) {
                if (cachedCategories) {
                    return;
                }

                $http.get('/api/v.1/hierarchy/categories').success(function (categories) {
                    cachedCategories = categories;
                    if (isLoaded()) {
                        success();
                    }
                }).error(function(msg) {
                    error(msg);
                });
            },

            subjects : function () {
                return cachedSubjects;
            },

            grades : function () {
                return cachedGrades;
            },

            categories : function (subject, grade) {
                if (cachedCategories && subject && grade) {
                    var categories = [];
                    cachedCategories.forEach(function (c) {
                        if ((c.subject === subject) && (c.grade === grade)) {
                            categories.push(c);
                        }
                    });
                    return categories;
                }
                return [];
            }
        };
    });
