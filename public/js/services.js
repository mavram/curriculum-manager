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
                    // TODO: user is not erased
                    $.extend(cachedUser, {});
                    console.log('AuthSvc:signout:cachedUser:' + JSON.stringify(cachedUser));
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

                $http.get('/api/v.1/subjects').success(function (subjects) {
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

                $http.get('/api/v.1/grades').success(function (grades) {
                    $.extend(cachedGrades, grades);
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            initCategories: function(success, error) {
                if (cachedCategories.length) {
                    return success();
                }

                $http.get('/api/v.1/categories').success(function (categories) {
                    categories.forEach(function(c){
                        cachedCategories.push(c);
                    })
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            subjects: cachedSubjects,

            grades: cachedGrades,

            categories: cachedCategories
        };
    });
