/*
 *   DEPENDENCIES
 */

var express 	= require('express'),
	sys			= require('sys'),
	url			= require ('url'),
	http		= require('http'),
	step		= require('step'),
	redis		= require('redis'),
	client		= redis.createClient(),
	RedisStore 	= require('connect-redis')(express),
	everyauth 	= require('everyauth'),
	util		= require('util'),
	fugue		= require('fugue');

client.on("error", function(err) {
	console.log("Error" + err);
}

/*
 *   CONFIGURATION
 */
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
	app.use(express.static(__dirname + '/public'));
});
	
/*
 *   ENVIRONMENTS
 */

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/*
 *   INITIALIZATION
 */

var userList = [];
var numUsers = 0;

client.mget('userlist', function(err, replies) {
	if (!err) {
		userList = replies[0];
	}
});

client.mget('numUsers', function(err, replies) {
	if (!err) {
		numUsers = replies[0];
	}
});

/*
 *   OAUTH INFO
 */

everyauth.twitter
	.consumerKey('8zq12b5WobtJkU5WG2NqA')
	.consumerSecret('y5QS4NDX5TqRYZFYi7qLsjsRCefa46Dlx42j97YeU')
	.findOrCreateUser(function(session, accessToken, accessTokenSecret, twitData) {
	
		})
	.redirectPath('/');

everyauth.debug = true;

/*
 *   ROUTES
 */

//	APP ROUTES
	
app.get('/', function(req, res) {
	res.render('index', {});
});


app.get('/createAccount', function(req, res) {
	//(1)Creates acct in db
	//(2)authenticates with twitter
	//(3)creates bookmarklet dynamically for user
	res.render('index', {});
});


app.get('/room/:id', function(req, res) {
	//(1)gets room info (posts)
	//(2)gets posts
	//(3)renders posts
	
	step(
		function getPostsForRoom() {
			//client.mget("rooms:" + req.params.id, , );
		}
	);
});


app.post('/submitPost', function(req, res) {
	//(1)Add post to db
	//(2)Push post out via sockets
});

app.get('/user/:id', function(req, res) {
	
});

// BOOKMARKLET ROUTE(S)

app.post('createRoom', function(req, res) {
	//(1) tweets out message
	//(2) creates room
	//(3) creates bitly link
	//(4) sends back ajax response with link
});

/*
 *   DEPLOY SERVER
 */

everyauth.helpExpress(app);
app.listen(3000);
// fugue.start(app, 80, null, 2, {
// 	verbose: true
// });
