// 인증확인
module.exports.isOAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signin'); 
    }
    next();
}