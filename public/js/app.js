var app = angular.module('K12', []);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
            controller: AppCtrl,
            templateUrl: 'partials/index.html'
        }).when('/about', {
            controller: AppCtrl,
            templateUrl: 'partials/about.html'
        }).when('/blog', {
            controller: AppCtrl,
            templateUrl: 'partials/blog.html'
        }).when('/careers', {
            controller: AppCtrl,
            templateUrl: 'partials/careers.html'
        }).when('/membership', {
            controller: AppCtrl,
            templateUrl: 'partials/membership.html'
        }).when('/signup', {
            controller: AppCtrl,
            templateUrl: 'partials/signup.html'
        }).when('/terms', {
            controller: AppCtrl,
            templateUrl: 'partials/terms.html'
        }).when('/privacy', {
            controller: AppCtrl,
            templateUrl: 'partials/privacy.html'
        }).when('/contacts', {
            controller: AppCtrl,
            templateUrl: 'partials/contacts.html'
        }).when('/faq', {
            controller: AppCtrl,
            templateUrl: 'partials/faq.html'
        }).when('/faq', {
            controller: AppCtrl,
            templateUrl: 'partials/faq.html'
        }).when('/account_settings', {
            controller: AppCtrl,
            templateUrl: 'partials/account_settings.html'
        }).when('/hierarchy', {
            controller: AppCtrl,
            templateUrl: 'partials/hierarchy.html'
        }).when('/questions', {
            controller: AppCtrl,
            templateUrl: 'partials/questions.html'
    }).otherwise({});
});

