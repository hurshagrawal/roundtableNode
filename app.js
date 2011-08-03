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
	util		= require('util'),
	promise		= everyauth.Promise,
	querystring	= require('querystring');

client.on("error", function(err) {
	console.log("Error" + err);
});

/*
 *   CONSTANTS
 */

//on changing - remember to change in: (twitter oauth, bookmarklet JS)
var SERVERURL = "http://ec2-67-202-30-240.compute-1.amazonaws.com/";
var DEBUG = true;

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
	if (!err && replies[0] !== null) {
		postCount = replies[0];
	}
});

client.mget('threadCount', function(err, replies) {
	if (!err && replies[0] !== null) {
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
	
	res.render('authSuccess', {
		serverURL: SERVERURL
	});
});

/*	gets room's post list with :(room)id
	--> gets posts related to that room
		--> renders view (intricacies with if logged in editable, else viewable)

*/
app.get('/roundtable/:id', function(req, res) {
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

// BOOKMARKLET ROUTE

/*	(1) tweets out message
	(2) creates room
	(3) creates bitly link
	(4) sends back ajax response with link
*/
app.get('/createRoundtable', function(req, res) {
	
	var urlParams = url.parse(req.url, true);
	
	var userID = urlParams.query.userID;
	
	var postContent = new Buffer(urlParams.query.postContent, 'base64').toString('ascii');
	console.log(postContent);
	
	var newPostID = ++postCount;
	var newPost = new rt.Post(parseInt(userID), postContent);
	
	var newThreadID = ++threadCount;
	var newThread;
	
	
	step(
		function updatePostCountInDB() {
			client.set('postCount', postCount, this)
		},
		function updateThreadCountInDB(err) {
			if (err) {
				console.log(err);
			} else {
				client.set('threadCount', threadCount, this);
			}
		},
		function addNewPostToDB(err) {
			if (err) {
				console.log(err);
			} else {
				client.set('posts:'+newPostID, JSON.stringify(newPost), this);
			}
		},
		function getBitlyLink(err) {
			if (err) {
				console.log(err);
			} else {
				//PLACEHOLDER
				newThread = new rt.Thread("NO BITLY LINK YET");
				this();
			}
		},
		function addNewThreadToDB(err) {
			if (err) {
				console.log(err);
			} else {
				client.set('threads:'+newThreadID, JSON.stringify(newThread), this);
			}
		},
		function addNewPostToThread(err) {
			if (err) {
				console.log(err);
			} else {
				var postArray = [newPost];
				client.set('threads:'+newThreadID+':posts', JSON.stringify(postArray), this);
			}
		},
		function extractUserListFromContent(err) {
			if (err) {
				console.log(err);
			} else {
				var nameArray = new Array();
				var arr = postContent.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s+/gi, " ").split("@");
				console.log(arr);
				for (var i=1;i<arr.length;i++) {
					console.log("i="+i);
					nameArray.push(arr[i].split(" ")[0]);
					console.log("get's here");
				}
				console.log(nameArray);
				this(nameArray);
			}
		},
		function getUserIDsFromTwitterHandles(nameArray) {
			var group = this.group();
			nameArray.forEach(function(name) {
				var options = {
					host: 'api.twitter.com',
					port: 80,
					path: '/1/users/lookup.json?screen_name='+name
				};

				var groupSlot = group();

				http.get(options, function(res) {
					var body = "";
					res.setEncoding('utf8');
					res.on('data', function(chunk) {
						body += chunk;
					});
					res.on('end', function() {
						groupSlot(null, body);
					})
					res.on('close', function() {
						groupSlot(null, body);
					})
				}).on('error', function(err) {
					console.log(err);
					groupSlot(err);
				});	
			});
		},
		function addUsersToThread(err, userInfo) {
			var tempUser;
			var userArray = new Array();
			userInfo.forEach(function(userInfo) {
				var user = JSON.parse(userInfo);
				if (user instanceof Array) {
					tempUser = {
						id: user[0].id_str,
						name: user[0].name,
						twitterHandle: user[0].screen_name 
					};
					userArray.push(tempUser);
				}
			});
			this(userArray);
		},
		function addUserArrayToPost(userArray) {
			client.set('threads:'+newThreadID+':users', JSON.stringify(userArray), this);
		},
		function renderPageInBookmarklet(err) {
			if (err) {
				console.log(err);
			} else {
				res.render('rtSuccess', {
					roundtableURL: SERVERURL+"roundtable/"+newThreadID
				});
			}
		}	
	);
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
		if (err) { //Database error of some sort
			console.log("Some sort of database error occured.");
			promise.fail(err);
			return;
		} else if (replies[0] === null || DEBUG) { //not found in the database
			var newUser = new rt.User(twitterData.name, twitterData.screen_name, 
				accessToken, accessTokenSecret);	

			console.log("User id "+twitterData.id_str+" not found. Creating account.");
			console.log(newUser);

			client.set('users:' + twitterData.id_str, JSON.stringify(newUser), function(err) {
				if (err) {
					console.log("Some sort of database error occured.");
					promise.fail(err);
					return;
				}
				promise.fulfill(newUser);
				return;
			});
		} else { //found in database
			console.log("Found user: "+replies[0]);
			promise.fulfill(JSON.parse(replies[0]));
			return;
		}
	});
	
};

rt.User = function(name, twitterHandle, accessToken, accessTokenSecret) {
	this.name = name;
	this.twitterHandle = twitterHandle;
	this.accessToken = accessToken;
	this.accessTokenSecret = accessTokenSecret;
	this.timeCreated = new Date();
};

rt.Post = function(creatorID, postContent) {
	this.creatorID = creatorID;
	this.timeCreated = new Date();
	this.postContent = postContent;
};

rt.Thread = function(bitlyLink) {
	this.bitlyLink = bitlyLink;
	this.timeCreated = new Date();
};