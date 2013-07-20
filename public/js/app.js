/*
 * Main app
 */

'use strict';


angular.module('K12', ['ngCookies', 'K12.services', 'K12.controllers'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/about', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/signin', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/blog', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/trial', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/pricing', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/terms', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/privacy', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/contacts', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/faq', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/settings', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/hierarchy', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/problems', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/worksheets', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/tests', {
            templateUrl: 'partials/index.html'
        });

        $routeProvider.when('/404', {
            templateUrl: '/partials/index.html'
        });

        $routeProvider.when('/403', {
            templateUrl: '/partials/index.html'
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
                    $location.path('/403');
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
        // TODO: support for HTTP error codes
        // TODO: add authentication for routes
    }]);


