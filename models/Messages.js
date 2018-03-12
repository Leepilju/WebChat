var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
	sendTime: { type: Date, default: Date.now }
});
mongoose.model('Messages', MessageSchema);
module.exports = mongoose.model('Messages');