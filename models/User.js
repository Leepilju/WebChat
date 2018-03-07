var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	id: { type: String, unique: true },
	pw: String,
	c_time: { type: Date, default: Date.now }
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');