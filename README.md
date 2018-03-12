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
	    - mongoose(db Connection)
	    - multer(파일업로드)
	    - baseModule
	        - process_child(코드실행 - 자식프로세스를 실행하여준다. 즉, 서버 내에서 코드를 실행한후, 결과값을 리턴할 수 있도록 사용)
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
