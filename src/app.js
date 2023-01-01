// app에서 사용할 모듈 import
const express = require('express');
const { Server } = require('http');
const { connect } = require('./schemas/index.schema');
const indexRouter = require('./routes/index.route');
const {
  errorHandler,
  errorLogger,
} = require('./middlewares/error-handler.middleware');
const randomNickNameGenerator = require('./util/generateRandomName.util');
const pageAutoSaver = require('./util/autoSavePage.util');

// express()로 app을 시작
const app = express();
// express app을 http 서버객체로 만들어 줌
const http = Server(app);
// http 서버로 연 express app에서 CORS를 처리할 수 있도록 하고,
// socket 통신을 http 서버를 통해 하도록 처리
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// redis client 연결
connect();
// req.body로 들어오는 값을 parsing하기 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// '/api' URI로 들어오는 req는 indexRouter로 넘김
app.use('/api', indexRouter);

// 소켓에 접속하는 유저별 {socket.id = nickname}의 형태로 담아줄 객체 선언
const socketIdMap = {};
// 랜덤 닉네임당 소켓 아디이를 {nickname = socket.id}의 형태로 담아줄 객체 선언
const nicknameToSocketIdMap = {};
// 소캣에서 넘어오는 document를 전역에 저장 (새로운 유저 유입 및 문서 자동저장에 사용)
let document = {};
// 1시간마다 소캣에서 넘어오는 최신 document를 db에 저장하고, document = null 처리해주는 함수
setInterval(() => {
  pageAutoSaver(document);
  document = null;
  // 여기서 바로 모든 소켓의 텍스트 에디터를 갱신해주도록 처리하고 싶었으나 잘 되지 않음
}, 1000 * 60 * 60);

// 소캣에 연결되어 있는 유저 리스트를 생성하는 함수
function connectedUsersList() {
  let usersList = [];
  // socketIdMap 객체의 key와 value를 프런트에서 요청한 [{socketId: id1, nickname: name1}, {socketId: id2, nickname: name2},...] 형식으로 담아줌
  for (const [key, value] of Object.entries(socketIdMap)) {
    usersList.push({ socketId: key, nickname: value });
  }
  // usersList 배열을 반환
  return usersList;
}

// socket이 연결됨
io.on('connection', sock => {
  // 랜덤 닉네임 생성 함수로 접속한 닉네임을 생성
  const nickname = randomNickNameGenerator();
  // 생성한 닉네임이 중복으로 생성된 닉네임인지 확인 후 중복되지 않을 때까지 계속해서 생성
  while (nicknameToSocketIdMap[nickname]) {
    nickname = randomNickNameGenerator();
  }
  // 중복검사를 거치 닉네임을 nicknameToSocketIdMap과 socketIdMap에 저장
  nicknameToSocketIdMap[nickname] = sock.id;
  socketIdMap[sock.id] = nickname;
  // 신규 유저의 닉네임과 현재 접속적인 유저의 닉네임 리스트를 모든 소켓에 전송
  io.emit('nickname', {
    newUser: nickname,
    usersList: connectedUsersList(),
  });
  // 접속을 종료한 소켓의 정보를 가져와 닉네임 처리하기
  sock.on('disconnect', () => {
    // 접속 종료한 소켓의 아이디를 사용해 부여했던 닉네임 찾기을 찾아 disconnectedUser에 할당
    const disconnectedUser = socketIdMap[sock.id];
    // 찾은 닉네임으로 소켓 아이디를 저장했던 nicknameToSocketIdMap을 비워줌
    nicknameToSocketIdMap[socketIdMap[sock.id]] = null;
    // socketIdMap에서는 더이상 해당 소켓의 아이디와 닉네임이 필요 없어 삭제
    delete socketIdMap[sock.id];
    // 접속 종료한 유저의 닉네임과 새로 갱신된 usersList를 전체 소켓에 전달
    io.emit('disconnectedUser', {
      disconnectedUser,
      // 위에서 정의한 유저 닉네임 리스트 생성 함수를 콜해서 유저리스트 갱신
      usersList: connectedUsersList(),
    });
  });

  // 처음 접속한 유저에게 현재까지 작성된 document 데이터 전송
  sock.emit('load-document', document);
  // 하나의 소켓에서 입력한 값을 전송 받고, 받은 값을 그대로 나를 제외한 전체 소켓에 전달
  sock.on('send-changes', delta => {
    sock.broadcast.emit('receive-changes', delta);
  });
  // 텍스트 에디터에 변화가 생길때마다, document 단위의 데이터를 함께 전송 받음
  sock.on('save-document', async data => {
    // 전송 받은 데이터를 전역에서 선언한 document에 저장
    document = data;
  });
});

// 에러 로거 및 핸들러 미들웨어 사용
app.use(errorLogger); // Error Logger
app.use(errorHandler); // Error Handler

// 3000번 포트로 앱을 열어 줌
http.listen(3000, () => {
  console.log('3000포트로 서버가 요청을 받을 준비가 됐어요');
});
