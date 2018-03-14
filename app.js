const http = require('http');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const mongodb = require('./database/mongodb');

const index = require('./routes/index');
const chatting = require('./routes/chatting');
const fileManager = require('./routes/fileManager');
const run = require('./routes/run');
const app = express();
const server = http.createServer(app);

/*
    채팅핸들러 모듈화
    http서버를 socket서버로 업그래이드하기위하여 매개변수로 넘겨줌 
*/
const io = require('./middleware/chat').chat(server);

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
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
    
  // 404의경우에는 로그를 출력하지 않도록한다.
  if(err.status !== 404) console.log(err);
  res.send('error');
});

server.listen(app.get('port'), () => {
    console.log('Open Serve Port:', app.get('port'));
});
