var request = require("request");
var q = require("q");
var config = require("../sensitive/config.json");
var passwords = require("../sensitive/passwords.json");

exports.promiseGetListened = function () {
    var deferred = q.defer();
    
    request(
        "http://" + passwords['8tracks'].username + ":" + passwords['8tracks'].password + 
            "@8tracks.com/mix_sets/listened.json?api_key=" + config.oauth['8tracks'].key, 
        function (error, response, body) {
            if (error) {
                console.log(error);
                console.log(response);
                console.log(body);
                deferred.reject(error + body);
            }
            try {
                body = JSON.parse(body);
            } catch (Exception) {
                console.log(body);
                deferred.reject(Exception);
            }
            deferred.resolve(body.mixes);
        }
    );
    
    return deferred.promise;
};