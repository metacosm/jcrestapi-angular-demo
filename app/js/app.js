'use strict';

/* App Module */

var demoApp = angular.module('demoApp', [
    'ngRoute',

    'demoControllers',
    'jcrServices',
    'ui.bootstrap'
]);

demoApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                redirectTo: '/api/nodes/root'
            }).
            when('/sessions', {
                templateUrl: 'partials/sessions.html',
                controller: 'SessionCtrl'
            }).
            when('/api/nodes/:nodeId', {
                templateUrl: 'partials/node.html',
                controller: 'NodeCtrl'
            }).
            when('/api/byPath/:path*', {
                templateUrl: 'partials/node.html',
                controller: 'PathCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
