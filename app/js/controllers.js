'use strict';

/* Controllers */
var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('NodeCtrl', ['$scope', '$routeParams', 'Node',
    function ($scope, $routeParams, Node) {
        var id = $routeParams.nodeId;
        if (id && id != 'root') {
            Node.getById(id).then(function (node) {
                $scope.node = node;
            });
        } else {
            Node.getRoot().then(function (node) {
                $scope.node = node;
            });
        }
    }
]);

demoControllers.controller('PathCtrl', ['$scope', '$routeParams', 'Node',
    function ($scope, $routeParams, Node) {
        var path = $routeParams.path;
        Node.getByPath(path).then(function (node) {
            $scope.node = node;
        });
    }
]);
