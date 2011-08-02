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
	fugue		= require('fugue'),
	everyauth	= require('everyauth');

client.on("error", function(err) {
	console.log("Error" + err);
});

/*
 *   OAUTH INFO
 */

everyauth.twitter
	.consumerKey('8zq12b5WobtJkU5WG2NqA')
	.consumerSecret('y5QS4NDX5TqRYZFYi7qLsjsRCefa46Dlx42j97YeU')
	.findOrCreateUser( function (session, accessToken, accessTokenSecret, data) {
	})
	.redirectPath('/');
	
/*
 *   CONFIGURATION
 */
var app = module.exports = express.createServer(
		express.bodyParser(),
		express.methodOverride(),
		express.cookieParser(),
		express.session({ 
			store: new RedisStore({}), 
			secret: 'paneldiscussions' 
		}),
		express.static(__dirname + '/public'),
		everyauth.middleware()
	);

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(app.router);
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
 *   ROUTES
 */

//	APP ROUTES
	
app.get('/', function(req, res) {
	res.render('index', {});
});


/*	links to createAccount page
	-->opens twitter authentication window
		-->returns to authCallback -->(create entry, save token, create bookmarklet)
			-->closes window
				--> redirects main page to authSuccess -->(show bookmarklet)

*/
app.get('/createAccount', function(req, res) {
	res.render('createAccount', {});
});

app.get('/authCallback', function(req, res) {
	//SAVE THE TOKEN
	console.log("GOT HERE");
//	res.redirect('/close.html');
});

app.get('/authSuccess', function(req, res) {
	res.render('authSuccess', {});
});

/*	gets room's post list with :(room)id
	--> gets posts related to that room
		--> renders view (intricacies with if logged in editable, else viewable)



*/
app.get('/room/:id', function(req, res) {
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

/*  LATER - user has a history page of all posts
 */
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
app.listen(80);
// 
// fugue.start(app, 80, null, 2, {
// 	verbose: true
// });



/*
 *    HELPER FUNCTIONS
 */

var rt = {};