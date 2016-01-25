var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var passport = require('passport');

var routes = require('./routes/index');
var user = require('./routes/user');
var login = require('./routes/login');

// Create global database definitions
var Sequelize = require("sequelize");
//TODO: Move authentication stuff to a config file
var sequelize = new Sequelize('AudioVoid', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	// SQLite only
	storage: 'db.sqlite'
});
GLOBAL.User = sequelize.import(__dirname + "/models/user.js");
sequelize.sync();

var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//TODO: Do something more secure with this
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'totally secure text string. no session hijacking here. nope. no way.'
}));

// Add Passport authentication to express
// Passport login strategies are setup in ./routes/login.js
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/user', user);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
