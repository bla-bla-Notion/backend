# bla-bla-Notion
1시간동안 사이트에 접속한 모든 유저와 공동으로 낙서를 즐길 수 있는 공동 낙서장입니다.

### 웹사이트
https://63a439d111e256656d561b76--dapper-bombolone-cb620b.netlify.app/

### 데모 영상


### 소개
- 사이트로 접속한 모든 유저는 실시간 공동 편집이 가능합니다.
- 1시간 단위로 페이지에 있는 데이터를 db에 저장하고, 페이지를 백지로 갱신합니다.
- 1시간 단위로 저장된 페이지는 왼쪽 메뉴바 하단 목록에서 조회 가능하며, 이 또한 생성된지 1시간이 지나면 자동 소멸됩니다.

### 기술 스택
`frontend`
- javascript
- react
- axios
- socket.io

`backend`
- node
- express
- socket.io

`deploy`
- AWS EC2 (ubuntu)

`database`
- redis

`etc Tools`
- github 
  - PR 요청을 통한 코드 리뷰 
  - front-back 통합 Project work-flow board 사용 (레포지토리별 issue 연동)
- notion
  - S.A.
  - 와이어프레임, ERD, API 명세서 관리

### 핵심 기능
##### 메인페이지 공동 편집 기능
- 
  
##### 1시간 단위 페이지 자동 저장 및 조회
- 
  
##### front-back HTTPS 통신
- backend 서버에서 nginx 및 reverse proxy 설정을 통해 HTTPS로 요청을 보내는 front req에 대응

