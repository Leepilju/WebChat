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

// http서버를 io서버로 업그래이드
var io = require('socket.io').listen(server);

var chatting = new Array();
// connection event handler
// connection 성공시 event handler function의 인자로 socket 들어온다
io.on('connection', function (socket) {

    // 접속한 클라이어트의 정보 수신
    // 채팅방입장시 
    socket.on('login', function (data) {
        console.log('Client logged-in:\n UserID:' + data.id + ',\t socket.id: ' + socket.id);

        // 채팅방에 입장한 사람들을 관리하기위하여 사용.
        chatting[data.id] = socket.id;

        // 채팅방입장시 모두에게 입장한 사실을 알려준다.
        io.emit('login', data.id);
    });

    // 클라이언트로부터의 메시지 수신(채팅내용 수신시)
    socket.on('chat', function (data) {
        console.log('Message: %s, from: %s, to: %s', data.message, data.from, data.to);
        var msg = {
            from: data.from,
            to: data.to,
            message: data.message
        };

        if (msg.to === '' || msg.to == null || msg.to === 'ALL') {
            // 받는사람이 없을 경우 메시지를 전송한 클라이언트(본인)를 제외한 모든 클라이언트에게 메시지를 전송한다
            socket.broadcast.emit('chat', msg);
        } else {
            // 특정 사용자에게만 메시지를 보낸다(귓속말)
            socket.to(chatting[msg.to]).emit('chat', data);
        }
    });

});

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