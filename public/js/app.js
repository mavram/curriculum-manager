/*
 * Main app
 */
'use strict';


// App level module which depends on filters, and services
angular.module('K12', ['K12.controllers'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
                controller: 'AppCtrl',
                templateUrl: 'partials/index.html'
            }).when('/about', {
                controller: 'AppCtrl',
                templateUrl: 'partials/about.html'
            }).when('/blog', {
                controller: 'AppCtrl',
                templateUrl: 'partials/blog.html'
            }).when('/careers', {
                controller: 'AppCtrl',
                templateUrl: 'partials/careers.html'
            }).when('/membership', {
                controller: 'AppCtrl',
                templateUrl: 'partials/membership.html'
            }).when('/signup', {
                controller: 'AppCtrl',
                templateUrl: 'partials/signup.html'
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
            }).when('/faq', {
                controller: 'AppCtrl',
                templateUrl: 'partials/faq.html'
            }).when('/account', {
                controller: 'AccountCtrl',
                templateUrl: 'partials/account.html'
            }).when('/hierarchy', {
                controller: 'AppCtrl',
                templateUrl: 'partials/hierarchy.html'
            }).when('/questions', {
                controller: 'AppCtrl',
                templateUrl: 'partials/questions.html'
        }).otherwise({});
    }]);


