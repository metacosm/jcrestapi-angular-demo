'use strict';

/* Controllers */
var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('NodeCtrl', ['$scope', '$routeParams', 'DemoSession',
    function ($scope, $routeParams, DemoSession) {
        var id = $routeParams.nodeId;
        if (id && id != 'root') {
            DemoSession.getById(id).then(function (node) {
                $scope.node = node;
            });
        } else {
            DemoSession.getRoot().then(function (node) {
                $scope.node = node;
            });
        }
    }
]);

demoControllers.controller('PathCtrl', ['$scope', '$routeParams', 'DemoSession',
    function ($scope, $routeParams, DemoSession) {
        var path = $routeParams.path;
        DemoSession.getByPath(path).then(function (node) {
            $scope.node = node;
        });
    }
]);


demoControllers.controller('SessionCtrl', ['$scope', '$routeParams', 'DemoSession',
    function ($scope, $routeParams, DemoSession) {
        DemoSession.getSessions().then(function (sessions) {
            $scope.sessions = sessions;
        });
    }
]);