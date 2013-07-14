/*
 * Services
 */

'use strict';

angular.module('K12.services', [])
    .factory('AuthSvc', function($http, $cookieStore) {
        var persistedUser = $cookieStore.get('_k12_user')
        $cookieStore.remove('_k12_user');

        var cachedUser = persistedUser ? persistedUser : {};

        return {
            signin: function(user, success, error) {
                $http.post('/api/v.1/auth/signin', user).success(function (user) {
                    $.extend(cachedUser, user);
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

            user: cachedUser
        };
    })

    .factory('UserSvc', function($http) {
        var cachedSettings = {};

        return {
            initSettings: function(error) {
                if (!$.isEmptyObject(cachedSettings)) {
                    return;
                }

                $http.get('/api/v.1/user/settings').success(function (settings) {
                    $.extend(cachedSettings, settings);
                }).error(function(msg) {
                    error(msg);
                });
            },

            settings: cachedSettings
        };
    })

    .factory('HierarchySvc', function($http) {

        var cachedSubjects = [];
        var cachedGrades = [];
        var cachedCategories = [];

        var isLoaded = function () {
            return (cachedSubjects.length && cachedGrades.length && cachedCategories);
        }

        return {
            initSubjects: function(success, error) {
                if (cachedSubjects.length) {
                    return;
                }

                $http.get('/api/v.1/hierarchy/subjects').success(function (subjects) {
                    $.extend(cachedSubjects, subjects);
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            initGrades: function(success, error) {
                if (cachedGrades.length) {
                    return;
                }

                $http.get('/api/v.1/hierarchy/grades').success(function (grades) {
                    $.extend(cachedGrades, grades);
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            initCategories: function(success, error) {
                if (cachedCategories.length) {
                    return;
                }

                $http.get('/api/v.1/hierarchy/categories').success(function (categories) {
                    cachedCategories = categories;
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            loadCategoriesBySubjectAndGrade : function (subject, grade, categories) {
                if (!$.isEmptyObject(cachedCategories) && subject && grade) {
                    cachedCategories.forEach(function (c) {
                        if ((c.subject === subject) && (c.grade === grade)) {
                            categories.push(c);
                        }
                    });
                }
            },

            subjects : cachedSubjects,

            grades : cachedGrades
        };
    });
