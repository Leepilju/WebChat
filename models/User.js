var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	id: { type: String, unique: true, require: true },
	pw: { type: String, require: true },
    salt: { type: String, require: true },
	signTime: { type: Date, default: Date.now }	
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');