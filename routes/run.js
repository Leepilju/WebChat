const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');
const fs = require('fs');
const path = require('path');
const url = require('url');
const execa = require('execa');

// 파일실행
router.post('/*', isAuthenticated, (req, res, next) => {
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
            res.send(new Error('실행불가능한파일 및 코드'));
    }
    
    // c, c++
    // c와 c++의경우는 코드 실행전 컴파일이 필요하다.
    if(filePath.lastIndexOf('.c') !== -1 || filePath.lastIndexOf('.C') !== -1) {
         // 컴파일부터 진행
         execa
        .shell(fileCompile)
        .then(result => {
             // 컴파일이 완료된 경우, 파일을 실행한다.
             let run = execa(filePath.replace(path.extname(filePath), '.out'));
             run.stdin.write(stdin);
             run.stdin.end();
             return run;
        })
        .then(result => {
            // 컴파일과, 실행을 정상적으로 실행하였다면, 컴파일된 파일을 삭제하여 사용자의 혼란을 방지한다.
            return new Promise((resolve, reject) => {
                fs.unlink(filePath.replace(path.extname(filePath), '.out'), err => {
                    if(err) return reject(err);
                    return resolve(result);
                });
            });
        })
        .then(result => {
            // 코드의 실행결과를 사용자가 볼 수 있도록 한다.
            res.send({result: result.stdout});
        })
        .catch(err => {
             // 코드를 실행하며 ERROR 메시지를 사용자가 볼 수 있도록 리턴하여준다.
             // 단, 서버내부의 구조를 모르게하기위하여 '/workspace/PIL/web/uploads/' 부분의 코드는 제거한다.            
             res.send({result: err.stderr.replace(/\/workspace\/PIL\/web\/uploads\//gi, '')});
        });
    } else { // js, python
        let run = execa.shell(fileCompile);
        run.stdin.write(stdin);
        run.stdin.end();
        run
        .then(result => {
            res.send({result: result.stdout});
        })
        .catch(err => {
            if(err) {
                return res.send({result: err.stderr.replace(/\/workspace\/PIL\/web\/uploads\//gi, '')});
            }
        });
    }
});

module.exports = router;