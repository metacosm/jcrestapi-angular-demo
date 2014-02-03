'use strict';

/* Services */

var jcrServices = angular.module('jcrServices', []);
var base = 'http://localhost:8080/modules';
var baseAPI = base + '/api';
var byPathAPI = baseAPI + '/byPath/';
var byIdAPI = baseAPI + '/nodes/';

// Based on http://stackoverflow.com/questions/11850025/recommended-way-of-getting-data-from-the-server
jcrServices.factory('DemoSession', function ($http, $cookies) {
    // CORS support
//    $http.defaults.useXDomain = true;
//    delete $http.defaults.headers.common['X-Requested-With'];


    // Node is a class which we can use for retrieving and
    // updating data on the server
    var DemoSession = function (data) {
        angular.extend(this, data);

        var result = [];
        for (var i in this.children) {
            if (this.children.hasOwnProperty(i)) {
                result.push(new DemoSession(this.children[i]));
            }
        }
        this.childrenAsNode = result;

    };

    // todo: extract login
    DemoSession.login = function($cookies) {
        $http.post('http://localhost:8080/cms/login?doLogin=true&restMode=true&username=root&password=xxxxxxxxxx&redirectActive=false')
            .then(function (data) {
                // cookie is sent with HTTP Only so cannot work here :(
//                var jsessionid = $cookies.get('JSESSIONID');
//                alert(jsessionid);
            });
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
        if (this.properties) {
            var title = this.properties.jcr__title;
            if (title) {
                return title.value;
            }
        }

        return this.name ? this.name : "root";
    };

    DemoSession.prototype.cleanedDescription = function () {
        return String(this.properties.text.value).replace(/<(?:.|\n)*?>/gm, '').replace('&amp;', '&')
            .replace('&rsquo;', '\'').replace('&lsquo;', '\'').replace('&#39;', '\'')
            .replace('&ldquo;', '\"').replace('&rdquo;', '"').replace('&nbsp;', '');
    };

    DemoSession.getSessions = function () {
        return $http.get(baseAPI + '/byType/genericnt__event?depth=1').then(function (response) {
            var sessions = [];
            response.data.forEach(function (session) {
                sessions.push(new DemoSession(session));
            });

            // make sure sessions are sorted by name (should be done using the query but doesn't work)
            sessions.sort(function (a, b) {
                return (a.name > b.name) - (b.name > a.name);
            });

            return sessions;
        }, function(error) {
            alert(error.data.message);
        });
    };

    DemoSession.prototype.currentVotes = function () {
        return this.getAndCreateIfInexistent('j__sumOfVotes', 0);
    };

    DemoSession.prototype.numberOfVotes = function () {
        return this.getAndCreateIfInexistent('j__nbOfVotes', 0);
    };

    DemoSession.prototype.getAndCreateIfInexistent = function (property, initialValue) {
        return this.ensure(property, initialValue).value;
    };

    DemoSession.prototype.ensure = function (property, initialValue) {
        var prop = this.properties[property];
        if (!prop) {
            this.properties[property] = { 'value': initialValue};
            return this.properties[property];
        }

        return prop;
    };

    DemoSession.prototype.setAndCreateIfInexistent = function (property, value) {
        this.ensure(property, value).value = value;
    };

    DemoSession.prototype.vote = function (value) {
        var nbOfVotes = this.ensure('j__nbOfVotes', 0);
        var newNbOfVotes = nbOfVotes.value + 1;

        var sumOfVotes = this.ensure('j__sumOfVotes', 0);
        var newSumOfVotes = sumOfVotes.value + value;

        // which URI we use will determine if we're creating a mixin or updating a node that already has the mixin
        // either way, we're just adding / modifying properties which uses the same data
        var uri = byIdAPI + this.id; // session URI
        if (nbOfVotes.value === 0) {
            // we don't have any votes so we need to add the jmix:rating mixin to our session node
            uri += '/mixins/jmix__rating';
        }

        $http.put(uri,
            {
                'properties': {
                    'j__lastVote': {
                        'value': value
                    },
                    'j__nbOfVotes': {
                        'value': newNbOfVotes
                    },
                    'j__sumOfVotes': {
                        'value': newSumOfVotes
                    }
                }
            }
        ).then(function (response) {
                alert('Vote recorded!');
                nbOfVotes.value = newNbOfVotes;
                sumOfVotes.value = newSumOfVotes;
            }, function (error) {
                alert(error.data.message);
            }
        );
    };

    DemoSession.prototype.resetVotes = function () {
        var uri = byIdAPI + this.id + '/mixins/jmix__rating';
        var nbOfVotes = this.ensure('j__nbOfVotes', 0);
        var sumOfVotes = this.ensure('j__sumOfVotes', 0);

        $http.delete(uri).then(function (response) {
                alert('Vote reset!');
                nbOfVotes.value = 0;
                sumOfVotes.value = 0;
            }, function (error) {
                alert(error.data.message);
            }
        );
    };


    DemoSession.login();

    return DemoSession;
});