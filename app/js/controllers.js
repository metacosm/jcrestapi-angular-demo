'use strict';

/* Controllers */
var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('DemoCtrl', ['$scope', 'Node',
    function ($scope, Node) {
        $scope.root = Node.getRoot();
    }
]);

demoControllers.controller('NodeCtrl', ['$scope', '$routeParams', 'Node',
    function ($scope, $routeParams, Node) {
        $scope.node = Node.get($routeParams.nodeId);
    }
]);
