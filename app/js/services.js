'use strict';

/* Services */

var jcrServices = angular.module('jcrServices', []);
var base = 'http://localhost:8080/modules';
var baseAPI = base + '/api';
var byPathAPI = baseAPI + '/byPath/';
var byIdAPI = baseAPI + '/nodes/';

// Based on http://stackoverflow.com/questions/11850025/recommended-way-of-getting-data-from-the-server
jcrServices.factory('JCRNode', function ($http) {
    // Node is a class which we can use for retrieving and
    // updating data on the server
    var JCRNode = function (data) {
        angular.extend(this, data);
    };

    // a static method to retrieve a node by id
    JCRNode.getById = function (id) {
        return $http.get(byIdAPI + id).then(function (response) {
            return new Node(response.data);
        });
    };

    // a static method to retrieve a node by its path
    JCRNode.getByPath = function (path) {
        return $http.get(byPathAPI + path).then(function (response) {
            return new Node(response.data);
        });
    };

    // retrieve the root node
    JCRNode.getRoot = function () {
        return $http.get(byIdAPI).then(function (response) {
            return new Node(response.data);
        });
    };

    // an instance method to create a new node
    JCRNode.prototype.create = function (parent) {
        var node = this;
        return $http.put(byIdAPI + parent.id, node).then(function (response) {
            node.id = response.data.id;
            return node;
        });
    };

    JCRNode.prototype.link = function (rel) {
        return '#' + this._links[rel].href;
    };

    JCRNode.prototype.safeName = function () {
        return this.name ? this.name : "root";
    };

    return JCRNode;
});