var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Message = require('../models/Messages');
var isAuthenticated = require('../middleware/isAuthenticated');
var crypto = require('../util/crypto');

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Web', userid: req.session.user.id });
});

// 로그인페이지
router.get('/signin', function(req, res, next) {
	res.render('sign/signin', {title: '로그인'});
});

// 로그인
router.post('/signin', function(req, res, next) {
    /*
        1. 해당 id를 찾는다.
        2. 해당 id에따른 salt값을 찾아온다
        3. 사용자에게 받은 패스워드를 salt와 함께 압호화해 비교한다.
        4. 결과값이 나올경우 로그인성공
    */
    User.findOne()
        .select('-_id salt')
        .where('id').equals(req.body.id)
        .then(result => {
            return User.findOne()
                .select('salt id')
                .where('id').equals(req.body.id)
                .where('pw').equals(crypto.sha512(req.body.pw, result.salt).pw)
                .where('salt');
            })
        .then((result) => {
            if (result._id) {
                req.session.user = result;
                return res.redirect('/');
            }
            res.send("ID or PW 확인");
        })
        .catch(err => {
            if (err) return next(err);
        });

});

// 회원가입페이지
router.get('/signup', function(req, res, next) {
	res.render('sign/signup', {title: '회원가입'});
});

// 회원가입
router.post('/signup', function(req, res, next) {
    // 사용자의 id값과, 해쉬화된 비밀번호, salt값을 함께 저장하도록한다.
    var userInfo = Object.assign({'id': req.body.id}, crypto.saltHashPassword(req.body.pw));
    User.create(userInfo, function(err, result) {
        if (err) {
            return next(err);
        }
        // 로그인페이지로이동
        res.redirect('/signin');
    });
});

// 로그아웃
router.get('/signout', isAuthenticated, function(req, res, next) {
    // 세션에 저장된 회원의 정보를 삭제한다.
	delete req.session.user;
    res.redirect('/signin');
});

module.exports = router;
