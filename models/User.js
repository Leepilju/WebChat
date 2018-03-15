var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	id: { type: String, unique: true, require: true }, // 사용자의 아이디값(로그인아이디)
	pw: { type: String, require: true }, // 암호화된 사용자의 패스워드
    salt: { type: String, require: true }, // 암호화를 진행할때 필요한 임의문자열
	signTime: { type: Date, default: Date.now } // 회원가입 날짜시간
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');