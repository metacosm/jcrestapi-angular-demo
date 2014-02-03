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

    DemoSession.login();

    return DemoSession;
});