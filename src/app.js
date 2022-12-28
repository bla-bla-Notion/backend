const express = require('express');
const { Server } = require('http');
const cors = require('cors');
const { redisClient, connect } = require('./schemas/index.schema');
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

const randomNickNameGenerator = require('./util/generateRandomName.util');

const socketIdMap = {};
const nicknameToSocketIdMap = {};
let document = null;
pageAutoSaver(document);

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
