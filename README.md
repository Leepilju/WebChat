
# Node.js를 활용한 채팅 & 웹 코드실행기
  
  
### Run
- `service mongodb start` - 몽고디비를 시작시켜준다.  
- `npm install && npm start`- 서버실행
- 프론트앤드 라이브러리가 없을경우 따로 설치하여 진행
    - `codemirror`- 다운로드 -> public/javascript/codemirror
    - `marked` - 다운로드 -> public/jvascripts/marked 

### Stack
- back-end
    - Node.js 6.12(Language)
        - express.js 4.x(frameWork)
	    - socket.io(채팅에사용)
	    - mongoose(몽고디비 관련모듈)
	    - multer(파일업로드 관련모듈)
        - execa(자식프로세스를 위하여 사용 [코드실행, 압축파일])
        - node-dir(저장된 파일과 디렉토리 구조를 한번에 표시하기위하여 사용)
	    - baseModule
	        - fs(파일업로드, 및 불러오기 관련 사용)
	        - path(파일 및 폴더의 경로를 불러오기위하여 사용)
	        - crypto(해쉬화에 사용)
            - url
    - mongoDB 3.2
- front-ent
    - ejs(템플릿엔진)
    - codemirror5.x(코드스타일)
    - jquery
    - javascript
    - bootstrap4
    - css
    - html
    - marked(markdown문법을 ejs템플릿엔진에서 불러오기위하여 사용)  
    
### 구현기능
- 모든기능은 로그인 이후에 사용이 가능 만약 로그인을 하지 않을 경우, 로그인창으로 이동
- 실시간채팅(몽고DB에 저장), 채팅방의 내용은 로그아웃시에도 모두 저장하도록한다.
    - 채팅방 입/퇴장시 다른 사용자들에게 표시(단, 저장되지않는다.)
    - 모두에게 메시지보내기(현재 접속중이지 않은 사용자도 나중에 메시지를 볼 수 있도록 모든 메시지를 저장한다.)
    - 귓속말
        - 귓속말의 경우 아랫쪽의 귓속말 대상의 아이디를 입력한후, 메시지를 작성한다.
        - 귓속말 대상과, 본인만 볼 수 있다.
- 파일매니저
    - 압축파일(.tar, .zip), 소스코드(C, C++, javascript, python)만 업로드가능
        - 사용자가 업로드한 파일은 uploads/ 위치
        - 허가되지 않은 파일을 업로드할 경우 에러를 발생시키도록한다.
    - 소스파일 클릭시 소스의내용을 볼 수 있음
        - 수정이 필요할 경우 내용을 수정후 Ctrl + S 혹은, 저장버튼을 클릭시 저장(저장과 실행은 ajax로 처리)
        - 실행할경우 화면의 이동이나 리다이렉트 없이 ajax로 처리하도록한다.  
            - 순서: 저장 -> 실행결과  
            코드가 정상적으로 실행될 경우 결과값을 보여준다.  
            소스코드에 문제가 있을경우, 소스코드의 애러내용을 보여준다.  
            만약, input(stdin)이 필요할경우, 위의 input박스를 이용하여 , 를 활용하여 입력한다.  
            ex) 두개의 입력이 필요할 경우 input박스내에 1, 2처럼 입력한다.
        - 컴파일이 필요한 언어일경우   
          컴파일 -> 실행 순서로 처리한다. (단, 실행이후 컴파일된 파일은 자동으로 삭제하도록한다.)
        - python, js의경우 컴파일이 필요없으므로 단순 실행을한이후 결과값을 리턴해주도록한다.

### 구조
- `config`: 설정(dbHost, secretKey)을 작성
- `database`: database Connection 관련 설정
- `middleware` 
    - chat.js
    - isAuthenticated.js(세션확인)
    - multer.js(파일 스토리지설정, 파일 이름, mimeType확인)를 미들웨어및 핸들러로 작성  
- `models`
    - mongodb의 table관련내용  
- `public`: 정적파일위치(front에서 사용하는 라이브러리)
- `route`: Controller의 기능과 database의 쿼리 기능  
    - chatting.js: 채팅내역불러오기
    - fileManager.js: 파일 업로드, 수정, 파일리스트, 코드보기
    - index.js: 메인페이지, 로그인, 로그아웃, 회원가입)
    - run.js: 코드실행
- `uploads`: 파일스토리지
- `util`: crypot.js 암호화관련 유틸