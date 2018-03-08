var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Message = require('../models/Messages');
var isOAuthenticated = require('../OAuth/oauth').isOAuthenticated;

/* GET home page. */
router.get('/', isOAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Pil-Web', userid: req.session.user.id });
});

// 몽고디비에 저장된 채팅메시지리스트틀 불러온다.
router.post('/chatlist', isOAuthenticated, function(req, res, next) {
	// 작성자나 받는사람이 본인일경우와, 모두에게 보낼경우
	var userid = req.session.userid
	Message.find()
			.select('-_id from to message')
			.or([{ from: userid }, { to: userid }, {to: "ALL"}])
			.sort('-sendTime')
			.exec(function(err, chatList) {
				if(err) {
					console.error(err);
					res.send(null);
				} else {
					res.send(chatList);
				}
			});
});

// signup: Create User
router.post('/signup', function(req, res, next) {
	User.create({
		id: req.body.id,
		pw: req.body.pw
	}, function(err, user) {
		if (err) {
			if(err.message.indexOf('duplicate key error') !== -1) {
				console.error(err);
			}
			return next(err);
    }
    req.session.user = user;
		res.redirect('/');
	});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: "회원가입"});
});

// User All List
router.get('/', function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) {
			return next(err);
		}
		res.send(users);
	});
});

// User All List
router.get('/signin', function(req, res, next) {
	res.render('signin', {title: "로그인"});
});


// signin(login)
router.post('/signin', function(req, res, next) {
	var session = req.session;
	User.findOne({
		id: req.body.id,
		pw: req.body.pw
	}, function(err, user) {
		if (err) return next(err);
		if (!user) {
			err = new Error('Check id And pw');
			err.status = 401;
			return next(err);
		}
    session.user = user;
    res.redirect('/');
	});
});

// modify User
router.put('/', isOAuthenticated, function(req, res, next) {
	User.findOneAndUpdate({
		id: req.body.id,	// old id
		pw: req.body.pw	// old pw
	}, {
		id: req.body.newId,	//new id
		pw: req.body.newPw	//new pw
	}, {
		new: true // result: oldID, oldPW -> newID, newPW
	}, function(err, result) {
		if (err) return next(err);
		res.send(result);
	});
});

// signout(logout)
router.get('/signout', isOAuthenticated, function(req, res, next) {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
