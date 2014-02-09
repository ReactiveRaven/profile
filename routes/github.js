var passwords = require('../sensitive/passwords.json');
var GitHubApi = require('github');

var github = new GitHubApi({
    version: "3.0.0",
    timeout: 5000
});

github.events.getFromRepo({
    user: "ReactiveRaven",
    repo: "profile"
}, function(err, res) {
    for (var i = 0; i < res.length; i++) {
        var currentEvent = res[i];
        if (currentEvent.type === "PushEvent") {
            for (var j = 0; j < currentEvent.payload.commits.length; j++) {
                var currentCommit = currentEvent.payload.commits[j];
                console.log(currentEvent.created_at + " " + currentCommit.message);
            }
        }
    }
});