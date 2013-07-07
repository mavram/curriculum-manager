var app = angular.module('K12', []);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
            controller: 'AppController',
            templateUrl: 'partials/index.html'
        }).when('/login', {
            controller: 'AppController',
            templateUrl: 'partials/login.html'
        }).when('/about', {
            controller: 'AppController',
            templateUrl: 'partials/about.html'
        }).when('/blog', {
            controller: 'AppController',
            templateUrl: 'partials/blog.html'
        }).when('/careers', {
            controller: 'AppController',
            templateUrl: 'partials/careers.html'
        }).when('/pricing', {
            controller: 'AppController',
            templateUrl: 'partials/pricing.html'
        }).when('/signup', {
            controller: 'AppController',
            templateUrl: 'partials/signup.html'
        }).when('/terms', {
            controller: 'AppController',
            templateUrl: 'partials/terms.html'
        }).when('/privacy', {
            controller: 'AppController',
            templateUrl: 'partials/privacy.html'
        }).when('/contacts', {
            controller: 'AppController',
            templateUrl: 'partials/contacts.html'
        }).when('/faq', {
            controller: 'AppController',
            templateUrl: 'partials/faq.html'
        }).when('/faq', {
            controller: 'AppController',
            templateUrl: 'partials/faq.html'
        }).when('/account_settings', {
            controller: 'AppController',
            templateUrl: 'partials/account_settings.html'
        }).when('/hierarchy', {
            controller: 'AppController',
            templateUrl: 'partials/hierarchy.html'
        }).when('/create_question', {
            controller: 'AppController',
            templateUrl: 'partials/create_question.html'
    });
});

app.controller('AppController', function($scope) {
    $scope.message = 'Angular is up!';
});
