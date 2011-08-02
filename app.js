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
	everyauth	= require('everyauth'),
	promise		= everyauth.Promise;

client.on("error", function(err) {
	console.log("Error" + err);
});

/*
 *   OAUTH INFO
 */

everyauth.debug = true;

everyauth.twitter
	.consumerKey('8zq12b5WobtJkU5WG2NqA')
	.consumerSecret('y5QS4NDX5TqRYZFYi7qLsjsRCefa46Dlx42j97YeU')
	.findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterData) {
		var promise = this.Promise();
		rt.findOrCreateUser(promise, accessToken, accessTokenSecret, twitterData);
		return promise;
	})
	.redirectPath('/close.html');
	
/*
 *   CONFIGURATION
 */
var app = module.exports = express.createServer();

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ 
		store: new RedisStore({}), 
		secret: 'paneldiscussions' 
	}));
	app.use(express.static(__dirname + '/public'));
	app.use(everyauth.middleware());
	app.use(app.router);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
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

var postCount = 0;
var threadCount = 0;

client.mget('postCount', function(err, replies) {
	if (!err) {
		postCount = replies[0];
	}
});

client.mget('threadCount', function(err, replies) {
	if (!err) {
		threadCount = replies[0];
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
		-->returns to everyauth -->(create entry, save token, create bookmarklet)
			-->closes window (redirects to close.html)
				--> redirects main page to authSuccess -->(show bookmarklet)

*/
app.get('/createAccount', function(req, res) {
	res.render('createAccount', {});
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

rt.findOrCreateUser = function(promise, accessToken, accessTokenSecret, twitterData) {
	client.mget('users:' + twitterData.id_str, function(err, replies) {
		console.log("GET OVER HERE");
		if (err) {
			console.log("User id "+twitterData.id_str+" not found. Creating account.");
		
			var newUser = new rt.User(twitterData.name, twitterData.screen_name, 
					accessToken, accessTokenSecret);	
							
			console.log(util.inspect(newUser));
			
			client.set('users:' + twitterData.id_str, JSON.stringify(newUser), function(err) {
				if (err) {
					console.log("Some sort of database error occured.");
					promise.fail(err);
					return;
				}
				promise.fulfill(newUser);
				return;
			});
		} else {
			console.log(console.log(replies[0]));
			
			promise.fulfill(replies[0]);
			return;
		}
	});
	
	//promise.fail("Unknown error.");
};

rt.User = function(name, twitterHandle, accessToken, accessTokenSecret) {
	name = this.name,
	twitterHandle = this.twitterHandle,
	accessToken = this.accessToken,
	accessTokenSecret = this.accessTokenSecret,
	timeCreated = new Date()
};