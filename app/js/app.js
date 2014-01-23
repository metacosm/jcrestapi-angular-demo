'use strict';

/* App Module */

var demoApp = angular.module('demoApp', [
    'ngRoute',

    'demoControllers',
    'jcrServices'
]);

demoApp.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        $routeProvider.
            when('/', {
                redirectTo: '/api/nodes/root'
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
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
