var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
	sendTime: { type: Date, default: Date.now }
});
mongoose.model('Message', MessageSchema);
module.exports = mongoose.model('Message');