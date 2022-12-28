const express = require('express');
const { Server } = require('http');
const cors = require('cors');
const indexRouter = require('./routes/index.route');
const {
  errorHandler,
  errorLogger,
} = require('./middlewares/error-handler.middleware');
const { redisClient, connect } = require('./schemas/index.schema');

connect();
const app = express();
const http = Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', indexRouter);

const randomNickNameGenerator = require('./util/generateRandomName.util');

const socketIdMap = {};
const nicknameToSocketIdMap = {};
let document = null;

setInterval(async () => {
  const currentDate = new Date();
  ('2022-12-28 오후 2:28:00');
  const createdAt = currentDate.toLocaleString('ko-KR', { timeZone: 'UTC' });
  const timeStamp = currentDate.getTime();
  const previousDate = new Date(timeStamp - 1000 * 60 * 60 * 6).toLocaleString(
    'ko-KR',
    { timeZone: 'UTC' },
  );
  const page = { createdAt, document };
  // db에서 page list를 불러오기
  // cache data 중 createdAt === previousDate 이면,
  // 삭제하고 currentDate으로 생성
  let pageData;
  await redisClient.lRange('page', 0, -1, function (err, reply) {
    console.log(reply);
    pageData = JSON.parse(reply);
  });
}, 1000 * 60 * 60);

function connectedUsersList() {
  let usersList = [];
  for (const [key, value] of Object.entries(socketIdMap)) {
    usersList.push({ socketId: key, nickname: value });
  }
  return usersList;
}

io.on('connection', sock => {
  const nickname = randomNickNameGenerator();
  while (nicknameToSocketIdMap[nickname]) {
    nickname = randomNickNameGenerator();
  }
  nicknameToSocketIdMap[nickname] = sock.id;
  socketIdMap[sock.id] = nickname;
  io.emit('nickname', {
    newUser: nickname,
    usersList: connectedUsersList(),
  });

  sock.on('disconnect', () => {
    const disconnectedUser = socketIdMap[sock.id];
    nicknameToSocketIdMap[socketIdMap[sock.id]] = null;
    delete socketIdMap[sock.id];
    let usersList = [];
    for (const [key, value] of Object.entries(socketIdMap)) {
      usersList.push({ id: key, nickname: value });
    }
    io.emit('disconnectedUser', {
      disconnectedUser,
      usersList: connectedUsersList(),
    });
  });

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
