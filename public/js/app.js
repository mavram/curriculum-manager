/*
 * Main app
 */

'use strict';

angular.module('K12', ['ngCookies', 'K12.services', 'K12.controllers']).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    // TODO: investigate if we can remove the activePage from ng-click and set variable as routes are changing

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

    $routeProvider.when('/questions', {
        templateUrl: 'partials/questions.html'
    });

    $routeProvider.when('/404', {
        templateUrl:'/partials/404.html'
    });

    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);
}]).run(['$rootScope', '$location', 'AuthSvc', function ($rootScope, $location, AuthSvc) {
    console.log("Application started...");

    // TODO: support for HTTP error codes
}]);


