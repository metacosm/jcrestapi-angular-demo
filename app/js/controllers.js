'use strict';

/* Controllers */
var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('SessionCtrl', ['$scope', 'DemoSession',
    function ($scope, DemoSession) {
        DemoSession.getSessions().then(function (sessions) {
            $scope.sessions = sessions;
        });
    }
]);