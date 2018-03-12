var express = require('express');
var router = express.Router();

var isAuthenticated = require('../middleware/isAuthenticated');
var Message = require('../models/Messages');
/*
    채팅목록을 불러올 API
    Ajax를이용한다
*/
// chatting
router.get('/', isAuthenticated, function(req, res, next) {
    res.render("chatting", {title: "채팅", userid: req.session.user.id});
});

// chatting/chatlist
router.get('/list', isAuthenticated, function(req, res, next) {
    var userID = req.session.user.id;  
    Message.find()
            .select('-_id from to message')
            .or([{from: userID},{to: userID},{to: 'ALL'}])
            .sort('sendTime')
            .exec(function(err, result) {
                if (err) return res.send(null);
                res.send(result);
            });
});

module.exports = router;