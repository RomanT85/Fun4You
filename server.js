var express 			= require('express'),
	bodyParser 			= require('body-parser'),
	path				= require('path'),
	expressValidator	= require('express-validator'),
	morgan 				= require('morgan'),
	mongoose 			= require('mongoose'),
	cookieParser		= require('cookie-parser'),
	session				= require('express-session'),
	MongoStore        	= require('connect-mongo/es5')(session),
	flash				= require('express-flash'),
	moment 				= require('moment'),
	passport			= require('passport'),
	ejs					= require('ejs'),
	engine				= require('ejs-mate');

var secret 				= require('./config/secret');

var app 				= express();

//Connect to the database
mongoose.connect(secret.database, function(err) {
	if(err) {
		console.error(err);
	} else {
		console.log('Connected to the database');
	}
});

//Middleware part
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
	resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.locals.moment = require('moment');

app.use(function(req, res, next) {
	res.locals.user = req.user;
	res.locals.message = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

//Require and use routes
var indexRoutes 	= require('./routes/indexroutes'),
	signRoutes 		= require('./routes/signroutes'),
	accountRoutes 	= require('./routes/accountroutes'),
	greeterRoutes 	= require('./routes/greeter'),
	mathGames 		= require('./routes/mathgames'),
	todoListRoutes 	= require('./routes/todolistroutes'),
	colorGameRoutes = require('./routes/colorgameRoutes');	

app.use(indexRoutes);
app.use(signRoutes);
app.use(accountRoutes);
app.use(greeterRoutes);
app.use(mathGames);
app.use(todoListRoutes);
app.use(colorGameRoutes);

//Setup Server
app.listen(process.env.PORT || secret.port, process.env.IP || '0.0.0.0', function(err) {
	if(err) {
		console.error(err);
	} else {
		console.log('Fun4You apps server is running!');
	}
});