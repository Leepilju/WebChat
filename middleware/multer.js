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
            callback(null, true);
        }
    });
    return uploadHandle;
};