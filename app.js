var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongodb = require('./database/mongodb');

var index = require('./routes/index');
var chatting = require('./routes/chatting');
var fileManager = require('./routes/fileManager');
var run = require('./routes/run');
var app = express();
var server = http.createServer(app);

/*
    채팅핸들러 모듈화
    http서버를 socket서버로 업그래이드하기위하여 매개변수로 넘겨줌 
*/
var io = require('./middleware/chat').chat(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setup
app.set('port', process.env.PORT || 80);

app.use(session({
	// TODO: secret 수정사항
	secret: 'secretKey',
	resave: false,
	saveUninitialized: true
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/chatting', chatting);
app.use('/fileManager', fileManager);
app.use('/run', run);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

server.listen(app.get('port'), function() {
    console.log('Open Serve Port:', app.get('port'));
});
