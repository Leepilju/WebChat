module.exports = function(req, res, next) {
    // 세션에 정보가 없을경우 로그인페이지로 리다이렉트
	if(!req.session.user) {
	    return res.redirect('/signin');
	}
	next();
};

