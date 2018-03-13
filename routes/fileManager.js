const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');
const path = require('path');
const fs = require('fs');
const url = require('url');
// 파일업로드 설정내역을 미들웨어로 모듈화
const multer = require('../middleware/multer')(path.dirname(__dirname));

// 파일리스트
// 업로드 내역중, 어떤파일과 어떤 리스트가 들어있는지 모르기때문에 와일드카드를 사용하여 응답결과를 다르게 보내주도록한다.
router.get('/*', (req, res, next) => {
    /*
        실제 파일이 저장된 경로
        프로젝트경로/uploads/url을통하여 받은 파일이름
        ex) url: baseUrl/a.js 일경우
            web/uploads/a.js 로 바꾸어준다
    */
    const filePath = path.dirname(__dirname)+'/uploads'+ url.parse(req.originalUrl).pathname.replace('/fileManager', '');
    fs.stat(filePath, (err, file) => {
        if(file.isFile()) {
            // 파일일경우
            fs.readFile(filePath, 'utf-8', (err, result) => {
                // 파일의 내용을 읽어와, 파일의 내용을 템플릿엔진에 뿌려주도록한다.
                res.render('fileManager', {title: 'fileManager', files: null, file: result, fileType: true});
            });
        } else {
            // 폴더일경우
            fs.readdir(filePath, (err, files) => {
                res.render('fileManager', {title: 'fileManager', files: files, file: null, fileType: false});
            });
        }
    });
    
});

//파일업로드
router.post('/', isAuthenticated, multer.array('files'), (req, res, next) => {
    res.redirect('/fileManager');
});


// 파일수정(저장)
router.put('/*', isAuthenticated, (req, res, next) => {
    // 저장할 내용
    const code = req.body.code;
    // 파일의경로
    const filePath = path.dirname(__dirname)+'/uploads'+ req.originalUrl.replace('/fileManager', '');
    fs.writeFile(filePath, code, 'utf8', function(err) {
        if(err) {
            console.error("error: ",err);
            return next(err);
        }
        res.send({result: "SUCCESS"});
    });
});

module.exports = router;
