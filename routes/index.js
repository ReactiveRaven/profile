/*
 * GET home page.
 */

var linkedin = require('./linkedin')
var q = require('q');
var reddit = require('./reddit');
var dumbCache = require("../utils/dumbcache").dumbcache;
var extend = require('extend');
var eighttracks = require('./8tracks');
var md = require("node-markdown").Markdown;
exports.linkedin = linkedin;

var dumbCachedGetSkillsAndPositions = dumbCache(linkedin.promiseGetSkillsAndPositions, 3600, "linkedin.promiseGetSkillsAndPositions");
var dumbCachedGetAbout = dumbCache(reddit.promiseGetAbout, 3600, "reddit.promiseGetAbout");
var dumbCachedGetListened = dumbCache(eighttracks.promiseGetListened, 3600, "8tracks.promiseGetListened");

exports.index = function(req, res){
    dumbCachedGetSkillsAndPositions().then(function (response) {
        var aboutDeferreds = [];
        for (var i = 0; i < response.skills.values.length; i++) {
            var currentSkill = response.skills.values[i];
            var promise = (function () {
                var privateSkill = currentSkill;
                var skillName = currentSkill.skill.name;
                var subreddit = skillName.toLowerCase().replace(/\W/g, '');
                return dumbCachedGetAbout(subreddit).then(function(answer) {
                    answer.skillName = skillName;
                    privateSkill.reddit = answer.data;
                    return answer;
                });
            })();
            aboutDeferreds.push(promise);
        }
        var listened = null;
        aboutDeferreds.push(dumbCachedGetListened().then(function (ak47) {
            listened = ak47;
        }));
        q.allSettled(aboutDeferreds).then(function (results) {
            var arguments = { title: 'Express', positions: response.positions.values, skills: response.skills.values, request: req, listened: listened, requests: results };
            arguments = extend(true, {md: md}, arguments);
            res.render('index', arguments);
        });
    }, function (error) {
        console.log("ERROR: " + JSON.stringify(error));
    });
};