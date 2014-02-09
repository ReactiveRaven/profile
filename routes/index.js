/*
 * GET home page.
 */

var linkedin = require('./linkedin')
var q = require('q');
var reddit = require('./reddit');
var dumbCache = require("../utils/dumbcache").dumbcache;

exports.linkedin = linkedin;

var dumbCachedGetSkillsAndPositions = dumbCache(linkedin.promiseGetSkillsAndPositions, 3600, "linkedin.promiseGetSkillsAndPositions");
var dumbCachedGetAbout = dumbCache(reddit.promiseGetAbout, 3600, "reddit.promiseGetAbout");

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
            })()
            aboutDeferreds.push(promise);
        }
        q.allSettled(aboutDeferreds).then(function (results) {
            res.render('index', { title: 'Express', positions: response.positions.values, skills: response.skills.values, request: req });
        });
    }, function (error) {
        console.log("ERROR: " + JSON.stringify(error));
    });
};