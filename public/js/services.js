/*
 * Services
 */

'use strict';

angular.module('K12.services', [])
    .factory('AuthSvc', function($http, $cookieStore) {
        var persistedUser = $cookieStore.get('_k12_user');
        $cookieStore.remove('_k12_user');

        var cachedUser = persistedUser ? persistedUser : {};

        function _resetUser (user) {
            angular.copy(user, cachedUser);
        }

        return {
            user: cachedUser,

            signin: function(user, success, error) {
                $http.post('/api/v.1/auth/signin', user).success(function (user) {
                    _resetUser(user);
                    success();
                }).error(function(msg) {
                        error(msg);
                    });
            },

            signout: function(success, error) {
                $http.get('/api/v.1/auth/signout').success(function () {
                    _resetUser({});
                    success();
                }).error(error);
            },

            signup: function(user, success, error) {
                $http.post('/api/v.1/user', user).success(function (user) {
                    _resetUser(user);
                    success(user);
                }).error(function(msg) {
                    error(msg);
                });
            },

            updateSettings: function(settings, success, error) {

                if ((settings.firstname === cachedUser.firstname) &&
                    (settings.lastname === cachedUser.lastname) &&
                    (settings.grade === cachedUser.grade)) {
                    return success();
                }

                return $http.put('/api/v.1/user/' + cachedUser._id, settings).success(function () {
                    angular.copy(settings, cachedUser);
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            deleteUser: function(success, error) {
                $http.delete('/api/v.1/user/' + cachedUser._id).success(function () {
                    _resetUser({});
                    success();
                }).error(error);
            }
        };
    })

    .factory('BasicHierarchySvc', function($http) {

        var cachedGrades = [];
        var cachedSubjects = [];

        return {
            grades: cachedGrades,
            subjects: cachedSubjects,

            initBasicHierarchy: function(success, error) {
                if (cachedSubjects.length > 0) {
                    return success();
                }

                return $http.get('/api/v.1/subjects').success(function (subjects) {
                    subjects.forEach(function(s){
                        cachedSubjects.push(s);
                    });

                    $http.get('/api/v.1/grades').success(function (grades) {
                        grades.forEach(function(g){
                            cachedGrades.push(g);
                        });
                        success();
                    }).error(error);
                }).error(error);
            }
        };
    })

    .factory('HierarchySvc', function($http) {

        var cachedCategories = {};

        return {
            categories: cachedCategories,

            initHierarchy: function(success, error) {
                $http.get('/api/v.1/categories').success(function (categories) {
                    categories.forEach(function(c){
                        // cache category for hierarchy
                        if (!cachedCategories[c.subject]) {
                            cachedCategories[c.subject] = [];
                        }
                        cachedCategories[c.subject].push(c);
                    });

                    success();
                }).error(error);
            },

            getCategoriesByGradeAndSubject: function(grade, subject, success, error) {
                $http.get('/api/v.1/categories/' + grade + '/' + subject).success(function (categories) {
                    success(categories);
                }).error(error);
            },

            addCategory: function(subject, name, success, error) {
                var data = { subject: subject, name: name };
                $http.post('/api/v.1/categories', data).success(function (category) {
                    if (!cachedCategories[category.subject]) {
                        cachedCategories[category.subject] = [];
                    }
                    cachedCategories[subject].push(category);
                    success(category);
                }).error(error);
            },

            updateCategory: function(updatedCategory, error) {
                var data = { name: updatedCategory.name };
                $http.put('/api/v.1/categories/' + updatedCategory._id, data).success(function () {
                    // nothing to do
                }).error(error);
            },

            removeCategory: function(subject, id, success, error) {
                $http.delete('/api/v.1/categories/' + id).success(function (category) {
                    for (var i = 0; i < cachedCategories[subject].length; i++) {
                        if (cachedCategories[subject][i]._id === category._id) {
                            cachedCategories[subject].splice(i, 1);
                            break;
                        }
                    }
                    success(category);
                }).error(error);
            },

            addSkill: function(subject, category, name, error) {
                var data = { name: name };
                $http.post('/api/v.1/categories/' + category._id + '/skills', data).success(function (skill) {
                    cachedCategories[subject].forEach(function (c) {
                        if (c._id == category._id) {
                            if (!c.skills) {
                                c.skills = [];
                            }
                            c.skills.push(skill);
                        }
                    });
                }).error(error);
            },

            updateSkill: function(category, updatedSkill, error) {
                var data = { name: updatedSkill.name };
                $http.put('/api/v.1/categories/' + category._id + '/skills/' + updatedSkill._id, data).success(function () {
                    // nothing to do
                }).error(error);
            },

            updateSkillGrades: function(category, updatedSkill, error) {
                var data = { grades: updatedSkill.grades };
                $http.put('/api/v.1/categories/' + category._id + '/skills/' + updatedSkill._id + '/grades', data).success(function () {
                    // nothing to do
                }).error(error);
            },

            removeSkill: function(subject, category, id, success, error) {
                $http.delete('/api/v.1/categories/' + category._id + '/skills/' + id).success(function (skill) {
                    cachedCategories[subject].forEach(function (c) {
                        if (c._id == category._id) {
                            c.skills = c.skills.filter(function (s) {
                                return (s._id !== skill._id);
                            });
                        }
                    });
                }).error(error);
            }
        };
    });
