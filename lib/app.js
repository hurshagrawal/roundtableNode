(function() {
  var RedisStore, app, client, everyauth, express, fugue, http, numUsers, redis, step, sys, url, userList, util;
  express = require('express');
  sys = require('sys');
  url = require('url');
  http = require('http');
  step = require('step');
  redis = require('redis');
  client = redis.createClient();
  RedisStore = require('connect-redis')(express);
  everyauth = require('everyauth');
  util = require('util');
  fugue = require('fugue');
  client.on("error", function(err) {
    return console.log("Error" + err);
  });
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      store: new RedisStore({}),
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
  userList = [];
  numUsers = 0;
  client.mget('userlist', function(err, replies) {
    if (!err) {
      return userList = replies[0];
    }
  });
  client.mget('numUsers', function(err, replies) {
    if (!err) {
      return numUsers = replies[0];
    }
  });
  everyauth.twitter.consumerKey('8zq12b5WobtJkU5WG2NqA').consumerSecret('y5QS4NDX5TqRYZFYi7qLsjsRCefa46Dlx42j97YeU').findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserMetadata) {
    return console.log(twitterUserMetadata);
  }).redirectPath('/');
  everyauth.debug = true;
  app.get('/', function(req, res) {
    return res.render('index', {});
  });
  app.get('/createAccount', function(req, res) {
    return res.render('index', {});
  });
  app.get('/room/:id', function(req, res) {
    var getPostsForRoom;
    return step(getPostsForRoom = function() {
      return client.mget("rooms:" + req.params.id);
    });
  });
  app.post('/submitPost');
  app.get('/user/:id', function(req, res) {});
  app.post('createRoom', function(req, res) {});
  everyauth.helpExpress(app);
  app.listen(3000);
}).call(this);
