'use strict';

/* Services */

var jcrServices = angular.module('jcrServices', []);
var base = 'http://localhost:8080/modules';
var baseAPI = base + '/api';
var byPathAPI = baseAPI + '/byPath/';
var byIdAPI = baseAPI + '/nodes/';

jcrServices.factory('DemoSession', function ($http) {

    // DemoSession is a class which we can use for retrieving and
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

        var safeName = this.name ? this.name : "root";
        if (this.properties) {
            var title = this.properties.jcr__title;
            if (title) {
                safeName = title.value;
            }
        }
        this.safeName = safeName;

    };

    DemoSession.login = function () {
        $http.post('http://localhost:8080/cms/login?doLogin=true&restMode=true&username=root&password=jahiaoneWar5jx.&redirectActive=false')
            .then(function (data) {
            });
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
        }, function (error) {
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

    DemoSession.login();

    return DemoSession;
});