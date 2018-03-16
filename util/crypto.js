// 암호화관련모듈
const crypto = require('crypto');

/**
 * 임의문자열(salt)을 생성하여준다 
 */
const genRandomString = length => {
    return crypto.randomBytes(Math.ceil(length/2)) //randomBytes 임의문자열을 생성해주도록한다.
            .toString('hex')  // 인코딩방식
            .slice(0, length);   // 필요한 문자수를 반환
};


/**
 * sha512로 해쉬화
 * @function
 * @param {string} password - 사용자에게 받아온 비밀번호값
 * @param {string} salt - 만들어진 임의문자열
 */
const sha512 = (password, salt) => {
    var hash = crypto.createHmac('sha512', salt); // sha512로 해쉬화
    hash.update(password); // 비밀번호를 업데이트한다.
    var value = hash.digest('hex');
    return {
        /*
            salt는 임의문자열로 생성한다.
            즉, 생성할때마다 다른 문자열로 나타난다. 
            따라서 유효성을 채크하기위하여 해쉬화한 비밀번호와 같이 저장하도록한다.
        */
        salt:salt, 
        pw:value
    };
};

const saltHashPassword = userpassword => {
    var salt = genRandomString(16); // 임의문자열의 길이
    return sha512(userpassword, salt);
};

module.exports.saltHashPassword = saltHashPassword;
module.exports.sha512 = sha512;