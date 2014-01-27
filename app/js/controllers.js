'use strict';

/* Controllers */
var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('NodeCtrl', ['$scope', '$routeParams', 'JCRNode',
    function ($scope, $routeParams, JCRNode) {
        var id = $routeParams.nodeId;
        if (id && id != 'root') {
            JCRNode.getById(id).then(function (node) {
                $scope.node = node;
            });
        } else {
            JCRNode.getRoot().then(function (node) {
                $scope.node = node;
            });
        }
    }
]);

demoControllers.controller('PathCtrl', ['$scope', '$routeParams', 'JCRNode',
    function ($scope, $routeParams, JCRNode) {
        var path = $routeParams.path;
        JCRNode.getByPath(path).then(function (node) {
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
