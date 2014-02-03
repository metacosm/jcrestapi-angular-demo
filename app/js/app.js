'use strict';

/* App Module */

var demoApp = angular.module('demoApp', [
    'ngRoute',

    'demoControllers',
    'jcrServices'
]);

demoApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/sessions', {
                templateUrl: 'partials/sessions.html',
                controller: 'SessionCtrl'
            }).
            otherwise({
                redirectTo: '/sessions'
            });
    }]);
