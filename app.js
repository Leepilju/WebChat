var http = require('http');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var db = require('./db/db');

var index = require('./routes/index');

var app = express();
var server = http.createServer(app);

// 채팅서버 모듈화
var io = require('./chat.js').chatListen(server);

app.use(session({
    secret: 'secretKey', // 세션키: 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 올때 세션을 수정하지 않더라도 세션을 다시 저장소에 저장되로록한다. 2개이상의 병렬요청이 왓을 경우 원치 않은 저장이 이루어질 수 있으니 유의 기본값은 false
    saveUninitialized: true // 초기화되지않은 세션을 강제로 저장
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setup
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(app.get('port'), function () {
    console.log('Open port:', app.get('port'));
});