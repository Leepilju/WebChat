const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');
const Message = require('../models/Messages');
/*
    채팅목록을 불러올 API
    Ajax를이용한다
*/
// chatting
router.get('/', isAuthenticated, (req, res, next) => {
    res.render("chatting", {title: "채팅", userid: req.session.user.id});
});

// chatting/chatlist
router.get('/list', isAuthenticated, (req, res, next) => {
    const userID = req.session.user.id;  
    Message.find()
            .select('-_id from to message')
            .or([{from: userID},{to: userID},{to: 'ALL'}])
            .sort('sendTime')
            .exec((err, result) => {
                if (err) return res.send(null);
                res.send(result);
            });
});

module.exports = router;