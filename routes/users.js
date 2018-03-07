var express = require('express');
var router = express.Router();

var User = require('../models/User');

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
		res.send(user);
	});
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

// signin(login)
router.post('/signin', function(req, res, next) {
	User.findOne({
		id: req.body.id,
		pw: req.body.pw
	}, function(err, user) {
		if (err) return next(err);
		res.send(user);
	});
});

// modify User
router.put('/', function(req, res, next) {
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

module.exports = router;
