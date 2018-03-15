module.exports = (req, res, next) => {
    // 세션에 정보가 없을경우 로그인페이지로 리다이렉트
	if(!req.session.user) {
	    return res.redirect('/signin');
	}
    // 인증된 사용자일경우 다음 미들웨어를 실행시켜준다.
	next();
};