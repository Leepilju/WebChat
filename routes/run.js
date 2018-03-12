var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var ay = require('async');
/*
    shell 명령어를 활용하기위하여 사용
    Node 내장모듈인 child_process 로 변경하기!
*/
var execa = require('execa');


// 파일실행
router.get('/*', function(req, res, next) {
    // 코드의 실행결과를 보고싶을 경우
    var originalUrl = req.originalUrl;
    var filePath = path.dirname(__dirname)+'/uploads'+ originalUrl.replace('/run', '');
    
    var fileName = path.basename(filePath);
    
    // 파일의 확장자에따른 컴파일 변경
    switch(path.extname(filePath)) {
        case '.c':
            // 컴파일후, 파일실행
             execa
            .shell('gcc '+filePath + ' -o ' + filePath.replace(path.extname(filePath), '.out'))
            .then(result => {
                 return execa.shell(filePath.replace(path.extname(filePath), '.out'));
            })
            .then(result => {
                return new Promise((resolve, reject) => {
                    fs.unlink(filePath.replace(path.extname(filePath), '.out'), err => {
                        if(err) return reject(err);
                        return resolve(result);
                    });
                });
            })
            .then(result => {
                res.send({result: result.shdout});
             })
            .catch(err => {
                 console.log('실행실패');
                 res.send({err: err});
            });

            break;
            
        case '.js':
            execa.shell('node '+filePath)
            .then(result => {
                res.send({result: result.stdout});
            })
            .catch(err => {
                if(err) return res.send({err: err});
            });
            break;
            
        case '.py':
            execa.shell('python '+filePath)
            .then(result => {
                res.send({result: result.stdout});
            })
            .catch(err => {
                if(err) return res.send({err: err});
            });           
            break;
    }

});

module.exports = router;