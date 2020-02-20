var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");

require('dotenv').config()
mongoose.Promise = global.Promise;

var dbhost = process.env.DB_HOST || 'localhost';
var dbport = process.env.DB_PORT || '27017';
var dbcollection = process.env.DB_COLLECTION || 'foo';
var connectionString = "mongodb://"+dbhost+":"+dbport+"/"+dbcollection;

console.log(connectionString);
mongoose.connect(connectionString, { useNewUrlParser: true });
mongoose.promise = global.Promise;



var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var User = require(__dirname+'/models/User');

require(__dirname+'/config/passport')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var resetRouter = require('./routes/reset');
app.use(require('./routes'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reset', resetRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
