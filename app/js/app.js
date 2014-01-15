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
                redirectTo: '/nodes/root'
            }).
            when('/nodes/:nodeId', {
                templateUrl: 'partials/node.html',
                controller: 'NodeCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
