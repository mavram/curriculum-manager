/*
 * Main app
 */

'use strict';

angular.module('K12', ['ngCookies', 'K12.services', 'K12.controllers']).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
            controller: 'AppCtrl',
            templateUrl: 'partials/index.html'
        }).when('/about', {
            controller: 'AppCtrl',
            templateUrl: 'partials/about.html'
        }).when('/signin', {
            controller: 'AuthCtrl',
            templateUrl: 'partials/signin.html'
        }).when('/blog', {
            controller: 'AppCtrl',
            templateUrl: 'partials/blog.html'
        }).when('/trial', {
            controller: 'AppCtrl',
            templateUrl: 'partials/trial.html'
        }).when('/pricing', {
            controller: 'AppCtrl',
            templateUrl: 'partials/pricing.html'
        }).when('/terms', {
            controller: 'AppCtrl',
            templateUrl: 'partials/terms.html'
        }).when('/privacy', {
            controller: 'AppCtrl',
            templateUrl: 'partials/privacy.html'
        }).when('/contacts', {
            controller: 'AppCtrl',
            templateUrl: 'partials/contacts.html'
        }).when('/faq', {
            controller: 'AppCtrl',
            templateUrl: 'partials/faq.html'
        }).when('/settings', {
            controller: 'UserCtrl',
            templateUrl: 'partials/settings.html'
        }).when('/hierarchy', {
            controller: 'HierarchyCtrl',
            templateUrl: 'partials/hierarchy.html'
        }).when('/questions', {
            controller: 'AppCtrl',
            templateUrl: 'partials/questions.html'
    }).otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);
}]).run(['$rootScope', '$location', 'AuthSvc', function ($rootScope, $location, AuthSvc) {
    //console.log("Application started...");
}]);


