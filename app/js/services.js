'use strict';

/* Services */

var jcrServices = angular.module('jcrServices', []);
var base = 'http://localhost:8080/modules';
var baseAPI = base + '/api';
var byPathAPI = baseAPI + '/byPath/';
var byIdAPI = baseAPI + '/nodes/';

// Based on http://stackoverflow.com/questions/11850025/recommended-way-of-getting-data-from-the-server
jcrServices.factory('DemoSession', function ($http) {
    // Node is a class which we can use for retrieving and
    // updating data on the server
    var DemoSession = function (data) {
        angular.extend(this, data);
    };

    // a static method to retrieve a node by id
    DemoSession.getById = function (id) {
        return $http.get(byIdAPI + id).then(function (response) {
            return new DemoSession(response.data);
        });
    };

    // a static method to retrieve a node by its path
    DemoSession.getByPath = function (path) {
        return $http.get(byPathAPI + path).then(function (response) {
            return new DemoSession(response.data);
        });
    };

    // retrieve the root node
    DemoSession.getRoot = function () {
        return $http.get(byIdAPI).then(function (response) {
            return new DemoSession(response.data);
        });
    };

    // an instance method to create a new node
    DemoSession.prototype.create = function (parent) {
        var node = this;
        return $http.put(byIdAPI + parent.id, node).then(function (response) {
            node.id = response.data.id;
            return node;
        });
    };

    DemoSession.prototype.link = function (rel) {
        return '#' + this._links[rel].href;
    };

    DemoSession.prototype.safeName = function () {
        return this.name ? this.name : "root";
    };

    DemoSession.getSessions = function () {
        return $http.get(baseAPI + '/byType/genericnt__event').then(function (response) {
            var sessions = [];
            for ( var i in response.data )
            {
                sessions.push(new DemoSession(response.data[i]));
            }

            // make sure sessions are sorted by name (should be done using the query but doesn't work)
            sessions.sort(function (a, b) {
                return (a.name > b.name) - (b.name > a.name);
            });

            return sessions;
        });
    };

    return DemoSession;
});