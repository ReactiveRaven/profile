
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var https = require('https');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

if (fs.existsSync('sensitive/ssl/74222061-localhost_3000.key') && fs.existsSync('sensitive/ssl/74222061-localhost_3000.cert')) {
    var sslPort = parseInt(app.get('port'), 10) + 353;
    var privateKey  = fs.readFileSync('sensitive/ssl/74222061-localhost_3000.key', 'utf8');
    var certificate = fs.readFileSync('sensitive/ssl/74222061-localhost_3000.cert', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    
    httpsServer = https.createServer(credentials, app).listen(sslPort, function () {
      console.log('Express SSL server listening on port ' + sslPort);
    });
}