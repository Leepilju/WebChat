module.exports = function(dir) {
    var multer = require('multer');
    // 업로드 스토리지, 이름 관리
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, dir+'/uploads');
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var uploadHandle = multer({ 
        storage: storage,
        fileFilter: function(req, file, callback) { 
            // mimetype에따른 필터
            // c, c++, js, .tar, .zip 파일일경우만 정상적으로 작동하도록한다.
            // 만약 원치않는 확장자를 가진 파일이 업로드 될 경우, 에러를 리턴한다.
            if(file.mimetype === 'application/x-tar' || file.mimetype === 'application/javascript' 
                   || file.mimetype === 'application/zip' || file.mimetype === 'application/js' 
                   || file.mimetype === 'text/plain' || file.mimetype === 'text/x-c' || file.mimetype === 'text/x-script.phyton') {
                callback(null, true);
            } else {
                callback(new Error('업로드가능파일은 소스코드, 압축파일(.tar, .zip)입니다.'), false);
            }
        }
    });
    return uploadHandle;
};