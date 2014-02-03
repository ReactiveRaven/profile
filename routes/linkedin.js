var config = require("../config.json");
var q = require('q');
var dumbCache = require("../utils/dumbcache").dumbcache;
var linkedin_client = require('linkedin-js')(config.oauth.linkedin.key, config.oauth.linkedin.secret, 'http://localhost:3000/auth');

var promiseGetPositions = dumbCache(function () {
    var deferred = q.defer();
    linkedin_client.apiCall('GET', '/people/~:(positions)',
        {
            token: config.oauth.linkedin.token
        },
        function (error, result) {
            if (error) {
                deferred.reject(error);
            }
            deferred.resolve(result);
        }
    );
    return deferred.promise;
}, 3600);

exports.promiseGetPositions = promiseGetPositions;

exports.routes = {};

exports.routes.positions = function (req, res) {
    promiseGetPositions().then(function (result) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
};