var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
    from: String, // 메시지를 받는사람
    to: String, // 메시지를 보낸사람
    message: String, // 메시지내용
	sendTime: { type: Date, default: Date.now } // 메시지 저장 날짜시간
});
mongoose.model('Messages', MessageSchema);
module.exports = mongoose.model('Messages');