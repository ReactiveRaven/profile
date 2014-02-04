/*
 * GET home page.
 */

var linkedin = require('./linkedin')
var q = require('q');

exports.linkedin = linkedin;

exports.index = function(req, res){
    linkedin.promiseGetSkillsAndPositions().then(function (response) {
        res.render('index', { title: 'Express', positions: response.positions.values, skills: response.skills.values, request: req });
    });
};