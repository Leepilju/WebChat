const express = require('express');
const router = express.Router();

// 파일경로를 표시하기위하여 사용한 모듈
const dir = require('node-dir');

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
router.get('/list', isAuthenticated, (req, res, next) => {
    dir.promiseFiles(path.dirname(__dirname)+'/uploads')
    .then((files)=> {
        res.render('fileManager', {title: 'fileManager', userid: req.session.user.id, files: files});
    })
    .catch(error => {
        console.error(error);
        return next(error);
    });
});

// 코드보기
router.get('/*', isAuthenticated, (req, res, next) => {
    const filePath = filePathFun(req);
    // 파일에 저장된 내용을 'utf-8'로 읽어와 클라이언트로 전송한다.
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) return next(err);
        res.render('fileManager', {title: 'fileManager', userid: req.session.user.id, file: content, files: null});
    });
});


//파일업로드
router.post('/', isAuthenticated, multer.array('files'), (req, res, next) => {
    let execa = require('execa');
    let files = req.files;
    let decompress = '';
    
    // .zip, .tar 파일일경우에만 압축을 푼이후, 저장된 압축파일을 삭제하도록한다.
    files.forEach((file) => {
        if(file.mimetype === 'application/x-tar' || file.mimetype === 'application/zip') {
            switch(file.mimetype) {
                case 'application/x-tar': 
                    decompress = 'tar -xf ' + file.path + ' -C ' + file.path.replace(path.basename(file.path), '');
                break;
                case 'application/zip':
                    decompress = 'unzip '+file.path +' -d ' + file.path.replace(path.basename(file.path), '');
                break;
            }
            // 파일의 압축을 풀도록한다.
            execa.shell(decompress)
            .then(result => {
                // 압축풀기가 성공적으로 진행됬을 경우, 압축파일을 삭제하도록한다.
                return execa.shell('rm -r '+file.path);
            })
            .then(result => {
            })
            .catch(err => {
                return next(err);
            });
        }
    });
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
