/*
 * Services
 */

'use strict';

angular.module('K12.services', [])
    .factory('AuthSvc', function($http, $cookieStore) {
        var persistedUser = $cookieStore.get('_k12_user');
        $cookieStore.remove('_k12_user');

        var cachedUser = persistedUser ? persistedUser : {};

        return {
            user: cachedUser,

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
                    angular.copy({}, cachedUser);
                    success();
                }).error(error);
            }
        };
    })

    .factory('UserSvc', function($http) {
        var cachedSettings = {};

        return {
            settings: cachedSettings,

            initSettings: function(error) {
                if (!$.isEmptyObject(cachedSettings)) {
                    return;
                }

                $http.get('/api/v.1/user/settings').success(function (settings) {
                    $.extend(cachedSettings, settings);
                }).error(function(msg) {
                    error(msg);
                });
            }
        };
    })

    .factory('HierarchySvc', function($http) {

        var cachedSubjects = [];
        var allCategories = [];
        var cachedCategories = [];

        var _reloadCategories = function(subject) {
            cachedCategories.splice(0, cachedCategories.length);
            allCategories.forEach(function (c) {
                if (c.subject === subject) {
                    cachedCategories.push(c);
                }
            });
        };

        return {
            subjects: cachedSubjects,

            categories: cachedCategories,

            initHierarchy: function(success, error) {
                if (cachedSubjects.length) {
                    return success();
                }

                return $http.get('/api/v.1/subjects').success(function (subjects) {
                    subjects.forEach(function(s){
                        cachedSubjects.push(s);
                    });

                    $http.get('/api/v.1/categories').success(function (categories) {
                        categories.forEach(function(c){
                            allCategories.push(c);
                            _reloadCategories(cachedSubjects[0]);
                        });
                        success();
                    }).error(error);
                }).error(error);
            },

            reloadCategories: _reloadCategories,

            addCategory: function(subject, name, success, error) {
                var data = { subject: subject, name: name };
                // TODO: add validation
                $http.post('/api/v.1/categories', data).success(function (category) {
                    allCategories.push(category);
                    cachedCategories.push(category);
                    success(category);
                }).error(error);
            },

            removeCategory: function(id, success, error) {
                $http.delete('/api/v.1/categories/' + id).success(function (category) {
                    for (var i = 0; i < cachedCategories.length; i++) {
                        if (cachedCategories[i]._id === category._id) {
                            cachedCategories.splice(i, 1);
                            break;
                        }
                    }
                    for (var j = 0; j < allCategories.length; j++) {
                        if (allCategories[j]._id === category._id) {
                            allCategories.splice(j, 1);
                            break;
                        }
                    }
                    success(category);
                }).error(error);
            },

            addSkill: function(categoryId, name, success, error) {
                var data = { name: name };
                // TODO: add validation
                $http.post('/api/v.1/categories/' + categoryId + '/skills', data).success(function (skill) {
                    cachedCategories.forEach(function (c) {
                        if (c._id == categoryId) {
                            if (!c.skills) {
                                c.skills = [];
                            }
                            c.skills.push(skill);
                        }
                    });
                    success(skill);
                }).error(error);
            },

            removeSkill: function(categoryId, id, success, error) {
                $http.delete('/api/v.1/categories/' + categoryId + '/skills/' + id).success(function (skill) {
                    cachedCategories.forEach(function (c) {
                        if (c._id == categoryId) {
                            c.skills = c.skills.filter(function (s) {
                                return (s._id !== skill._id);
                            });
                        }
                    });
                    success(skill);
                }).error(error);
            }
        };
    })


    .factory('TestSvc', function() {
        var cachedElements = ['Element 0'];

        return {
            elements: cachedElements,

            add: function(e) {
                cachedElements.push(e);
            }
        };
    });
