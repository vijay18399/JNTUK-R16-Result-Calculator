// Importing required modules and packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts')
var indexRouter = require('./routes/index');

// Creating an instance of Express application
var app = express();

// Setting up view engine and static folder
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Defining routes
app.use('/', indexRouter);

// Handling 404 errors
app.use(function(req, res, next) {
  next(createError(404));
});

// Handling other errors
app.use(function(err, req, res, next) {
  // Setting locals for rendering the error page
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Setting status and rendering error page
  res.status(err.status || 500);
  res.render('error');
});

// Exporting the Express application instance
module.exports = app;
