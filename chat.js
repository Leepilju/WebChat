exports.chatListen = function (server) {
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

            Message.create(msg, function(err, user) {
                if (err) { console.error("Save Message On mongoDB Fail...."); }
                else { console.log("Save Message On mongoDB Success....")}
            });

            if (msg.to === '' || msg.to == null || msg.to === 'ALL') {
                // 받는사람이 없을 경우 메시지를 전송한 클라이언트(본인)를 제외한 모든 클라이언트에게 메시지를 전송한다
                socket.broadcast.emit('chat', msg);
            } else {
                // 특정 사용자에게만 메시지를 보낸다(귓속말)
                socket.to(chatting[msg.to]).emit('chat', data);
            }
        });

    });
}