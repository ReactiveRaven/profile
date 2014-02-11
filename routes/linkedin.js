var config = require("../sensitive/config.json");
var q = require('q');
var dumbCache = require("../utils/dumbcache").dumbcache;
var linkedin_client = require('linkedin-js')(config.oauth.linkedin.key, config.oauth.linkedin.secret, 'http://localhost:3000/auth');

var promiseGetPositions = function () {
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
};

var promiseGetProfile = dumbCache(function () {
    var deferred = q.defer();
    linkedin_client.apiCall('GET', '/people/~',
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

var promiseGetSkills = function () {
    var deferred = q.defer();
    linkedin_client.apiCall('GET', '/people/~:(skills)',
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
};

var promiseGetSkillsAndPositions = function () {
    var deferred = q.defer();
    linkedin_client.apiCall('GET', '/people/~:(skills,positions)',
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
};

exports.promiseGetPositions = promiseGetPositions;
exports.promiseGetSkills = promiseGetSkills;
exports.promiseGetProfile = promiseGetProfile;
exports.promiseGetSkillsAndPositions = promiseGetSkillsAndPositions;