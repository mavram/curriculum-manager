/*
 * Services
 */

'use strict';

angular.module('K12.services', [])
    .factory('AuthSvc', function($http, $cookieStore) {
        var currentUser = $cookieStore.get('_k12_user');
        $cookieStore.remove('_k12_user');

        return {
            signin: function(user, success, error) {
                $http.post('/api/v.1/auth/signin', user).success(function(user){
                    currentUser = user;
                    success();
                }).error(function(msg) {
                    error(msg);
                });
            },

            signout: function(success, error) {
                $http.get('/api/v.1/auth/signout').success(function(){
                    currentUser = {};
                    success();
                }).error(error);
            },

            user: function () {
                return currentUser;
            }
        };
    })

    .factory('UserSvc', function($http) {
        return {
            settings: function(user, success, error) {
                $http.get('/api/v.1/user/settings').success(function(settings) {
                    success(settings);
                }).error(function(msg) {
                    error(msg);
                });
            }
        };
    });
