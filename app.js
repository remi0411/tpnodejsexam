var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiConferencesRouter = require('./routes/conferences');

var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');


var app = express();



var options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Conference API',
      version: '1.0.1',
      description: 'API pour site de conférences',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./routes/conference.js'],
};

const specs = swaggerJsdoc(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/conferences', apiConferencesRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
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
