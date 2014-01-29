'use strict';

/* Services */

var jcrServices = angular.module('jcrServices', []);
var base = 'http://localhost:8080/modules';
var baseAPI = base + '/api';
var byPathAPI = baseAPI + '/byPath/';
var byIdAPI = baseAPI + '/nodes/';

// Based on http://stackoverflow.com/questions/11850025/recommended-way-of-getting-data-from-the-server
jcrServices.factory('DemoSession', function ($http) {
    // CORS support
//    $http.defaults.useXDomain = true;
//    delete $http.defaults.headers.common['X-Requested-With'];


    // todo: extract login
    $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $http.post('http://localhost:8080/cms/login?doLogin=true&restMode=true&username=root&password=xxxxxxx&redirectActive=false')
        .then(function (data) {
//            alert(data.data);
        });


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

    DemoSession.prototype.cleanedDescription = function () {
        return String(this.properties.text.value).replace(/<(?:.|\n)*?>/gm, '').replace('&amp;', '&')
            .replace('&rquot;', '\'').replace('&#39;', '\'').replace('&ldquo;', '\"').replace('&rdquo;', '"')
            .replace('&nbsp;', '');
    };

    DemoSession.getSessions = function () {
        return $http.get(baseAPI + '/byType/genericnt__event?depth=1').then(function (response) {
            var sessions = [];
            for (var i in response.data) {
                sessions.push(new DemoSession(response.data[i]));
            }

            // make sure sessions are sorted by name (should be done using the query but doesn't work)
            sessions.sort(function (a, b) {
                return (a.name > b.name) - (b.name > a.name);
            });

            return sessions;
        });
    };

    DemoSession.prototype.vote = function (value) {
        var jmixRating = this.mixins.jmix__rating;

        var jNbOfVotes = this.properties.j__nbOfVotes;
        if (!jNbOfVotes) {
            jNbOfVotes = 0;
        }

        var jSumOfVotes = this.properties.j__sumOfVotes;
        if (!jSumOfVotes) {
            jSumOfVotes = 0;
        }

        return $http.put(byIdAPI + this.id + '/mixins/jmix__rating',
            {
                'properties': {
                    'j__lastVote': {
                        'value': value
                    },
                    'j__nbOfVotes': {
                        'value': jNbOfVotes + 1
                    },
                    'j__sumOfVotes': {
                        'value': jSumOfVotes + value
                    }
                }
            }
        ).then(function (response) {
                alert('Vote recorded!');
            }, function (error) {
                alert(error.data.message);
            }
        );

    };

    return DemoSession;
});