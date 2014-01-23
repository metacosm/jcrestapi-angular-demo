'use strict';

/* Services */

var jcrServices = angular.module('jcrServices', ['ngResource']);
var base = 'http://localhost:8080/modules';
var baseAPI = base + '/api';
var byPathAPI = baseAPI + '/byPath/';
var byIdAPI = baseAPI + '/nodes/';

// Based on http://stackoverflow.com/questions/11850025/recommended-way-of-getting-data-from-the-server
jcrServices.factory('Node', function ($http) {
    // Node is a class which we can use for retrieving and
    // updating data on the server
    var Node = function (data) {
        angular.extend(this, data);
    }

    // a static method to retrieve a node by id
    Node.getById = function (id) {
        return $http.get(byIdAPI + id).then(function (response) {
            return new Node(response.data);
        });
    };

    // a static method to retrieve a node by its path
    Node.getByPath = function (path) {
        return $http.get(byPathAPI + path).then(function (response) {
            return new Node(response.data);
        });
    };

    // retrieve the root node
    Node.getRoot = function() {
        return $http.get(byIdAPI).then(function (response) {
            return new Node(response.data);
        });
    };

    // an instance method to create a new node
    Node.prototype.create = function (parent) {
        var node = this;
        return $http.put(byIdAPI + parent.id, node).then(function (response) {
            node.id = response.data.id;
            return node;
        });
    }

    Node.prototype.link = function (rel) {
        return '#' + this._links[rel].href;
    }

    Node.prototype.safeName = function () {
        return this.name ? this.name : "root";
    }

    return Node;
});