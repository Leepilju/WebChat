# Node.js를 활용한 채팅 & 웹 코드실행기
### run
`codemirror`- 다운로드후, public/javascript/안에 위치시켜주도록한다.  
`service mongodb start` - 몽고디비를 시작시켜준다.  
`cd /web && npm install && npm start`- 서버실행

### Stack
- back-end
    - Node.js 6.12(Language)
        - express.js 4.x(frameWork)
	    - socket.io(채팅에사용)
	    - mongoose(몽고디비와 ODM)
	    - multer(파일업로드)
        - execa(코드실행 - 자식프로세스를 실행하여준다. 즉, 서버 내에서 코드를 실행한후, 결과값을 리턴할 수 있도록 사용)
	    - baseModule
	        - fs(파일업로드, 및 불러오기 관련 사용)
	        - path(파일 및 폴더의 경로를 불러오기위하여 사용)
	        - crypto(해쉬화에 사용)
    - mongoDB 3.2
- front-ent
    - ejs(템플릿엔진)
    - codemirror5.x(코드스타일)
    - jquery
    - javascript
    - bootstrap4
    - css
    - html
    
## 구현기능
- 모든기능은 로그인 이후에 사용이 가능 만약 로그인을 하지 않을 경우, 로그인창으로 이동
- 실시간채팅(몽고DB에 저장), 채팅방의 내용은 로그아웃시에도 모두 저장하도록한다.
    - 모두에게 메시지보내기
    - 귓속말
        - 귓속말의 경우 아랫쪽의 귓속말 대상의 아이디를 입력한후, 메시지를 작성한다.
- 파일매니저
    - 압축파일(.tar, .zip), 소스코드(C, C++, javascript, python)만 업로드가능
        - 허가되지 않은 파일을 업로드할 경우 에러를 발생시키도록한다.
    - 소스파일 클릭시 소스의내용을 볼 수 있음
        - 수정이 필요할 경우 내용을 수정후 Ctrl + S 혹은, 저장버튼을 클릭시 저장
        - 실행할경우 화면의 이동이나 리다이렉트가 없이 ajax로 처리하도록한다.  
        실행의 순서는 저장 -> 실행결과를 보여준다.  
        만약, input(stdin)이 필요할경우, 위의 input박스를 이용하여 , 를 활용하여 입력한다.  
        ex) 두개의 입력이 필요할 경우 input박스내에 1, 2처럼 입력한다.
        - c, c++의경우 실행버튼을 클릭할시, 컴파일 -> 실행 순서로 처리한다. (단, 실행이후 컴파일한 파일은 자동으로 삭제하도록한다.)
        - python, js의경우 컴파일이 필요없으므로 단순 실행을한이후 결과값을 리턴해주도록한다.

## TODO
- 압축파일업로드시 압출풀어서 디랙토리구조 생성
- ES5 OR ES6 문법통일
- 파일리스트  
a/b/a.c  
a/b/b.py  
위와 같이 폴더구조로 생성하도록 변경