/*
 * Main app
 */

'use strict';

angular.module('K12', ['ngCookies', 'K12.services', 'K12.controllers']).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
        controller: 'AppCtrl',
        templateUrl: 'partials/index.html'
    });

    $routeProvider.when('/about', {
        controller: 'AppCtrl',
        templateUrl: 'partials/about.html'
    });

    $routeProvider.when('/signin', {
        controller: 'AuthCtrl',
        templateUrl: 'partials/signin.html'
    });

    $routeProvider.when('/blog', {
        controller: 'AppCtrl',
        templateUrl: 'partials/blog.html'
    });

    $routeProvider.when('/trial', {
        controller: 'AppCtrl',
        templateUrl: 'partials/trial.html'
    });

    $routeProvider.when('/pricing', {
        controller: 'AppCtrl',
        templateUrl: 'partials/pricing.html'
    });

    $routeProvider.when('/terms', {
        controller: 'AppCtrl',
        templateUrl: 'partials/terms.html'
    });

    $routeProvider.when('/privacy', {
        controller: 'AppCtrl',
        templateUrl: 'partials/privacy.html'
    });

    $routeProvider.when('/contacts', {
        controller: 'AppCtrl',
        templateUrl: 'partials/contacts.html'
    });

    $routeProvider.when('/faq', {
        controller: 'AppCtrl',
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

    $routeProvider.when('/questions', {
        controller: 'AppCtrl',
        templateUrl: 'partials/questions.html'
    });

    $routeProvider.when('/404', {
        controller: 'AppCtrl',
        templateUrl:'/partials/404.html'
    });

    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);
}]).run(['$rootScope', '$location', 'AuthSvc', function ($rootScope, $location, AuthSvc) {
    //console.log("Application started...");
}]);


