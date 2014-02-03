/*
 * GET home page.
 */

var linkedin = require('./linkedin')

exports.linkedin = linkedin;

exports.index = function(req, res){
    linkedin.promiseGetPositions().then(function (response) {
        res.render('index', { title: 'Express', positions: response.positions.values });
    })
};