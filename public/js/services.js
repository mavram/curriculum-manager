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
            signin: function(user, success, error) {
                $http.post('/api/v.1/auth/signin', user).success(function (user) {
                    $.extend(cachedUser, user);
                    $dev_null.log('AuthSvc:signin:cachedUser' + JSON.stringify(cachedUser));
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            signout: function(success, error) {
                $http.get('/api/v.1/auth/signout').success(function () {
                    // TODO: user is not erased
                    $.extend(cachedUser, {});
                    $dev_null.log('AuthSvc:signout:cachedUser:' + JSON.stringify(cachedUser));
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

        return {
            initSubjects: function(success, error) {
                if (!cachedSubjects.length) {
                    $http.get('/api/v.1/subjects').success(function (subjects) {
                        $.extend(cachedSubjects, subjects);
                        success();
                    }).error(error);
                }
            },

            initGrades: function(success, error) {
                if (!cachedGrades.length) {
                    $http.get('/api/v.1/grades').success(function (grades) {
                        $.extend(cachedGrades, grades);
                        success();
                    }).error(error);
                }
            },

            initCategories: function(success, error) {
                if (cachedCategories.length) {
                    success();
                } else {
                    $http.get('/api/v.1/categories').success(function (categories) {
                        categories.forEach(function(c){
                            cachedCategories.push(c);
                        });
                        success();
                    }).error(error);
                }
            },

            addCategory: function(subject, name, success, error) {
                var data = { subject: subject, name: name };
                // TODO: add validation
                $http.post('/api/v.1/categories', data).success(function (category) {
                    $dev_null.log('HierarchySvc:addCategory:success:' + JSON.stringify(category));
                    cachedCategories.push(category);
                    success(category);
                }).error(error);
            },

            removeCategory: function(id, success, error) {
                $http.delete('/api/v.1/categories/' + id).success(function (category) {
                    $dev_null.log('HierarchySvc:removeCategory:' + JSON.stringify(category));
                    for (var i = 0; i < cachedCategories.length; i++) {
                        if (cachedCategories[i]._id === category._id) {
                            cachedCategories.splice(i, 1);
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
                    $dev_null.log('HierarchySvc:addSkill:success:categoryId:' + categoryId + ':' + JSON.stringify(skill));
                    cachedCategories.forEach(function (c) {
                        if (c._id == categoryId) {
                            c.skills.push(skill);
                        }
                    });
                    success(skill);
                }).error(error);
            },

            removeSkill: function(categoryId, id, success, error) {
                $http.delete('/api/v.1/categories/' + categoryId + '/skills/' + id).success(function (skill) {
                    $dev_null.log('HierarchySvc:removeSkill:success:categoryId:' + categoryId + ':' + JSON.stringify(skill));
                    cachedCategories.forEach(function (c) {
                        if (c._id == categoryId) {
                            c.skills = c.skills.filter(function (s) {
                                return (s._id !== skill._id);
                            });
                        }
                    });
                    success(skill);
                }).error(error);
            },

            subjects: cachedSubjects,

            grades: cachedGrades,

            categories: cachedCategories
        };
    });
