var config = require("../sensitive/config.json");
var q = require('q');
var request = require('request');
var dumbCache = require("../utils/dumbcache").dumbcache;

var promiseGetAbout = function (subreddit) {
    var deferred = q.defer();
    request(
        {
            url: 'http://www.reddit.com/r/' + subreddit + '/about.json',
            headers: {
                'User-Agent': 'portfolio for /u/burfdl'
            }
        }, 
        function (error, response, body) {
            if (error) {
                deferred.reject(error);
            }
            try {
                body = JSON.parse(body);
            } catch (Exception) {
                deferred.reject(Exception);
            }
            deferred.resolve(body);
        }
    );
    return deferred.promise;
};
exports.promiseGetAbout = promiseGetAbout;