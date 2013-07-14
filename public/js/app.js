/*
 * Main app
 */

'use strict';

angular.module('K12', ['ngCookies', 'K12.services', 'K12.controllers'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/', {
            controller: 'AppCtrl',
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/about', {
            templateUrl: 'partials/about.html'
        });

        $routeProvider.when('/signin', {
            controller: 'AuthCtrl',
            templateUrl: 'partials/signin.html'
        });

        $routeProvider.when('/blog', {
            templateUrl: 'partials/blog.html'
        });

        $routeProvider.when('/trial', {
            templateUrl: 'partials/trial.html'
        });

        $routeProvider.when('/pricing', {
            templateUrl: 'partials/pricing.html'
        });

        $routeProvider.when('/terms', {
            templateUrl: 'partials/terms.html'
        });

        $routeProvider.when('/privacy', {
            templateUrl: 'partials/privacy.html'
        });

        $routeProvider.when('/contacts', {
            templateUrl: 'partials/contacts.html'
        });

        $routeProvider.when('/faq', {
            templateUrl: 'partials/faq.html'
        });

        $routeProvider.when('/settings', {
            controller: 'UserCtrl',
            templateUrl: 'partials/settings.html'
        });

        $routeProvider.when('/hierarchy', {
            controller: 'HierarchyCtrl',
            templateUrl: 'partials/hierarchy.html'
        });

        $routeProvider.when('/problems', {
            templateUrl: 'partials/problems.html'
        });

        $routeProvider.when('/404', {
            templateUrl: '/partials/404.html'
        });

        $routeProvider.otherwise({redirectTo: '/404'});

        $locationProvider.html5Mode(true);

        var interceptor = ['$location', '$q', function ($location, $q) {
            function success(response) {
                return response;
            }

            function error(response) {
                if (response.status === 401) {
                    $location.path('/signin');
                    return $q.reject(response);
                } if (response.status === 403) {
                    $location.path('/404');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }

            return function (promise) {
                return promise.then(success, error);
            }
        }];

        $httpProvider.responseInterceptors.push(interceptor);
    }]).run(['$rootScope', '$location', 'AuthSvc', function ($rootScope, $location, AuthSvc) {
//    console.log("Application started...");

        // TODO: support for HTTP error codes
        // TODO: add authentication for routes
    }]);


