const express = require('express');
const { Server } = require('http');
const socketIo = require('socket.io');
const randomNickNameGenerator = require('./util/generateRandomName.util');

const app = express();
const http = Server(app);
const io = socketIo(http);

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  프로젝트 요구사항
// 입장한 유저별로 랜덤 닉네임을 생성해서 클라로 보내주기
// textarea 작업 내용 실시간 렌더링
// socket.on("정해야 함!!", (msg) => {})
// 퇴장한 유저 닉네임 제거한 유저들 닉네임 배열 클라로 보내주기

io.on('connection', sock => {});

http.listen(8080, () => {
  console.log('8080포트로 서버가 요청을 받을 준비가 됐어요');
});
