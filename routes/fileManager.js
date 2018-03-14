const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');
const path = require('path');
const fs = require('fs');
const url = require('url');
// 파일업로드 설정내역을 미들웨어로 모듈화
const multer = require('../middleware/multer')(path.dirname(__dirname));
// 파일의 경로를 찾아주는함수
function filePathFun(req) {
    return path.dirname(__dirname)+'/uploads'+ url.parse(req.originalUrl).pathname.replace('/fileManager', '');   
}
// 파일리스트
// 업로드 내역중, 어떤파일과 어떤 리스트가 들어있는지 모르기때문에 와일드카드를 사용하여 응답결과를 다르게 보내주도록한다.
router.get('/*', isAuthenticated, (req, res, next) => {
    /*
        실제 파일이 저장된 경로
        프로젝트경로/uploads/url을통하여 받은 파일이름
        ex) url: baseUrl/a.js 일경우
            web/uploads/a.js 로 바꾸어준다
    */
    const filePath = filePathFun(req);
    fs.stat(filePath, (err, file) => {
        if(err) return next(err);
        fileCheck(file.isFile(), (err, result) => {
            if (err) return next(err);
            res.render('fileManager', Object.assign({title: 'fileManager', userid: req.session.user.id}, result));
        });
    });
    
    // 파일인지 폴더인지 확인하여 결과값을 리턴해주는 콜백함수
    function fileCheck(isFile, callback) {
        if(isFile) {
             // 파일일경우
             fs.readFile(filePath, 'utf-8', (err, result) => {
                if(err) return callback(err, null);
                return callback(null, {files: null, file: result, fileType: true});
            });
        } else {
            // 폴더일경우
            fs.readdir(filePath, (err, result) => {
                if(err) return callback(err, null);
                return callback(null, {files: result, file: null, fileType: false});
            });           
        }
    }
    
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
    const filePath = filePathFun(req);
    fs.writeFile(filePath, code, 'utf8', function(err) {
        if(err) {
            return next(err);
        }
        res.send({result: "SUCCESS"});
    });
});

module.exports = router;
