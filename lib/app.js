(function() {
  var app, express, fugue, http, step, sys, url;
  express = require('express');
  sys = require('sys');
  url = require('url');
  http = require('http');
  step = require('step');
  fugue = require('fugue');
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: 'paneldiscussions'
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + 'public'));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return res.render('index', {});
  });
  app.listen(3000);
}).call(this);
