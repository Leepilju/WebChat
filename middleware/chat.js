var Message = require('../models/Messages');
module.exports.chat = function(server) {
    // http서버를 socket.io서버로 업그래이드
    let io = require('socket.io').listen(server);
    
    
    // 채팅사용자 관리를 위하여 생성
    let chatting = [];
    // 소켓서버 connection 성공시 Event Handler
    io.on('connection', function(socket) {
        // 채팅 참여시
        socket.on('login', function(data) {
            socket.userName = data.id;
            // 채팅참여시 사용자의 아이디값과, 소켓아이디값을 key-value 형태로 사용하기위함
            chatting[data.id] = socket.id;
            // 모두에게 채팅참여사실을 알려주도록 한다.
            io.emit('login', data.id);
        });
        
        
        // 소켓과 연결이 끊길경우(사용자가 채팅방에서 나갈경우)
        socket.on('disconnect', function(reason) {
            // 종료한 사용자의 아이디를 채팅방에 참여중인 목록에서 삭제한다.
            delete chatting[socket.userName];
            // 사용자의 아이디값을 클라이언트 소켓으로 전송한다.
            io.emit('disconnect', socket.userName);
        });

        // 채팅메시지 수신
        socket.on('chat', function(data) {
            // 채팅내용
            let msg = {
                from: data.from,
                to: data.to,
                message: data.message
            }; 
            
            // MongoDB에 채팅내역 저장
            Message.create(msg, function(err, result) {
                if (err) {
                    console.log("Save Message On mongoDB Fails...");
                } else {
                    console.log("Save Message On mongoDB Success...");
                }
            });
            
            if(msg.to == 'ALL') {
                // 보내는사람이 all일경우 나를 제외한 모든 사용자에게 메시지를 발송한다.
                socket.broadcast.emit('chat', msg);
            } else {
                console.log(chatting[msg.to]);
                // 특정사용자에게 메시지 발송(귓속말)
                socket.to(chatting[msg.to]).emit('chat', msg);
            }
        });
    });
};