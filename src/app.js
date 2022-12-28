const express = require('express');
const { Server } = require('http');
const cors = require('cors');

const app = express();
const http = Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const randomNickNameGenerator = require('./util/generateRandomName.util');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use('/public', express.static(`${__dirname}/public`));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

//  프로젝트 요구사항
// 입장한 유저별로 랜덤 닉네임을 생성해서 클라로 보내주기
// textarea 작업 내용 실시간 렌더링
// socket.on("정해야 함!!", (msg) => {})
// 퇴장한 유저 닉네임 제거한 유저들 닉네임 배열 클라로 보내주기

app.get('/', (req, res) => {
  res.status(200).send('bla-bla-Notion backend');
});

const socketIdMap = {};
const nicknameToSocketIdMap = {};

io.on('connection', sock => {
  const nickname = randomNickNameGenerator();
  while (nicknameToSocketIdMap[nickname]) {
    nickname = randomNickNameGenerator();
  }
  nicknameToSocketIdMap[nickname] = sock.id;
  socketIdMap[sock.Id] = nickname;
  io.emit('nickname', {
    connectedUser: nickname,
    usersList: Object.values(socketIdMap),
  });
});

io.on('connection', sock => {});

http.listen(8080, () => {
  console.log('8080포트로 서버가 요청을 받을 준비가 됐어요');
});
