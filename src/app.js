const express = require('express');
const { Server } = require('http');
const cors = require('cors');
const { connect } = require('./schemas/index.schema'); //레디스 모듈
const indexRouter = require('./routes/index.route');
const {
  errorHandler,
  errorLogger,
} = require('./middlewares/error-handler.middleware');
const randomNickNameGenerator = require('./util/generateRandomName.util');
const pageAutoSaver = require('./util/autoSavePage.util');

const app = express();
const http = Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
connect(); // redis 연결
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexRouter);
//소켓에사용할 객체
const socketIdMap = {};
const nicknameToSocketIdMap = {};
let document = {};
//1시간 간격으로 문서 저장, 초기화
setInterval(() => {
  pageAutoSaver(document);
  document = null;
}, 1000 * 60 * 60);
//소켓에 연결된 유저리스트를 생성
function connectedUsersList() {
  let usersList = [];
  for (const [key, value] of Object.entries(socketIdMap)) {
    usersList.push({ socketId: key, nickname: value });
  }
  return usersList;
}
//클라이언트와 연결되면 닉네임 생성
io.on('connection', sock => {
  const nickname = randomNickNameGenerator();
  //닉네임이 중복되지 않도록 검사 후 재생성
  while (nicknameToSocketIdMap[nickname]) {
    nickname = randomNickNameGenerator();
  }
  nicknameToSocketIdMap[nickname] = sock.id;
  socketIdMap[sock.id] = nickname;
  //추가된 유저닉네임과 현재 유저리스트를 뿌려줌
  io.emit('nickname', {
    newUser: nickname,
    usersList: connectedUsersList(),
  });
  //사용자 연결이 종료되었을 경우 닉네임 초기화
  sock.on('disconnect', () => {
    const disconnectedUser = socketIdMap[sock.id];
    nicknameToSocketIdMap[socketIdMap[sock.id]] = null;
    delete socketIdMap[sock.id];
    let usersList = [];
    //닉네임 리스트에서 재생성
    for (const [key, value] of Object.entries(socketIdMap)) {
      usersList.push({ id: key, nickname: value });
    }
    //연결이 종료된 사용자, 남아있는 유저리스트를 뿌려준다
    io.emit('disconnectedUser', {
      disconnectedUser,
      usersList: connectedUsersList(),
    });
  });
  //문서가 작성될 때 모든사용자에게 내용을 업데이트
  sock.emit('load-document', document);
  sock.on('send-changes', delta => {
    sock.broadcast.emit('receive-changes', delta);
  });
  sock.on('save-document', async data => {
    document = data;
  });
});

app.use(errorLogger); // Error Logger
app.use(errorHandler); // Error Handler

http.listen(3000, () => {
  console.log('3000포트로 서버가 요청을 받을 준비가 됐어요');
});
