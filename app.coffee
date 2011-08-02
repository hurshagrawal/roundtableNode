# DEPENDENCIES

express = require 'express'
sys		= require 'sys'
url		= require 'url'
http	= require 'http'
step	= require 'step'
fugue	= require 'fugue'

app = module.exports = express.createServer();

# CONFIGURATION

app.configure ->
	app.set 'views', __dirname + '/views'
	app.set 'view engine', 'ejs'
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use express.cookieParser()
	app.use express.session
		secret: 'paneldiscussions'
	app.use app.router
	app.use express.static __dirname + 'public'
	
# ENVIRONMENTS

app.configure 'development', ->
	app.use express.errorHandler
		dumpExceptions: true
		showStack: true

app.configure 'production', ->
	app.use express.errorHandler()

# ROUTES

app.get '/', (req, res) ->
	res.render 'index', {}

app.listen 3000
# fugue.start app, 80, null, 2
# 	verbose: true
	