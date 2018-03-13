const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const url = require('url');
const execa = require('execa');

// 파일실행
router.post('/*', (req, res, next) => {
    const stdin = req.body.stdin.replace(',', '\n');
    // 코드의 실행결과를 보고싶을 경우
    let filePath = path.dirname(__dirname)+'/uploads'+ url.parse(req.originalUrl).pathname.replace('/run', '');
    let fileCompile = '';
    switch(path.extname(filePath)) {
        case '.cpp':
        case '.c++':
        case '.C++':
        case '.CPP':
            fileCompile = 'g++ '+filePath + ' -o ' + filePath.replace(path.extname(filePath), '.out');
            break;
        case '.c':
        case '.C':
            fileCompile = 'gcc '+filePath + ' -o ' + filePath.replace(path.extname(filePath), '.out');
            break;
        case '.js':
        case '.JS':
            fileCompile = 'node '+filePath;
            break;
        case '.py':
        case '.PY':
            fileCompile = 'python '+filePath;
            break;
        default:
            res.send(new Error('실행불가능'));
    }
    if(filePath.lastIndexOf('.c') !== -1 || filePath.lastIndexOf('.C') !== -1) {
         // 컴파일후, 파일실행
         execa
        .shell(fileCompile)
        .then(result => {
             let run = execa(filePath.replace(path.extname(filePath), '.out'));
             run.stdin.write(stdin);
             run.stdin.end();
             return run;

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
            res.send({result: result.stdout});
         })
        .catch(err => {
             res.send({result: err.stderr});
        });
    } else {
        let run = execa.shell(fileCompile);
        run.stdin.write(stdin);
        run.stdin.end();
        run
        .then(result => {
            res.send({result: result.stdout});
        })
        .catch(err => {
            if(err) return res.send({result: err.stderr});
        });
    }
});

module.exports = router;