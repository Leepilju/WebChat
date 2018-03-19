module.exports = (dir) => {
    const execa = require('execa');
    const multer = require('multer');
    // 업로드 스토리지, 이름 관리
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            // 파일업로드 저장소
            callback(null, dir+'/uploads/');
        },
        filename: (req, file, callback) =>  {
            // 파일이름은 본래의 이름 그대로 저장한다.
            callback(null, file.originalname);
        }
    });

    var uploadHandle = multer({ 
        storage: storage,
        fileFilter: (req, file, callback) => { 
            // mimetype에따른 필터
            // c, c++, js, python, .tar, .zip 파일일경우만 파일 업로드를 허용한다.
            // 만약 원치않는 확장자(mimeType)를 가진 파일이 업로드 될 경우, 에러를 리턴한다.
            switch(file.mimetype) {
                // tar
                case 'application/x-tar': 
                // zip
                case 'application/zip':
                case 'application/x-zip-compressed':
                // js
                case 'application/javascript': 
                case 'application/js': 
                // phyton
                case 'text/x-script.phyton': 
                // c, cpp
                case 'text/plain': 
                case 'text/x-c': 
                case 'text/x-csrc': 
                    callback(null, true);
                    break;
                default:
                    console.log(file);
                    callback(new Error('업로드가 가능한 파일은 소스파일(javascript, python, c/c++), 압축파일(.tar, .zip)입니다.'), false);
                    break;
            }
        }
    });
    return uploadHandle;
};