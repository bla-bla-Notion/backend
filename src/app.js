const express = require('express');
const { Server } = require('http');
const cors = require('cors');
const randomNickNameGenerator = require('./util/generateRandomName.util');

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

// app.set('view engine', 'pug');
// app.set('views', __dirname + '/views');
// app.use('/public', express.static(__dirname + '/public'));
// app.get('/', (_, res) => res.render('home'));
// app.get('/*', (_, res) => res.redirect('/'));

const socketIdMap = {};
const nicknameToSocketIdMap = {};
let document;

io.on('connection', sock => {
  const nickname = randomNickNameGenerator();
  while (nicknameToSocketIdMap[nickname]) {
    nickname = randomNickNameGenerator();
  }
  nicknameToSocketIdMap[nickname] = sock.id;
  socketIdMap[sock.id] = nickname;
  io.emit('nickname', {
    newUser: nickname,
    usersList: Object.values(socketIdMap),
  });

  sock.on('disconnect', () => {
    const disconnectedUser = socketIdMap[sock.id];
    nicknameToSocketIdMap[socketIdMap[sock.id]] = null;
    delete socketIdMap[sock.id];
    io.emit('disconnectedUser', {
      disconnectedUser,
      usersList: Object.values(socketIdMap),
    });
  });

  sock.emit('message', document);
  sock.on('message', text => {
    sock.broadcast.emit('message', text);
    sock.emit('message', text);
    document = text;
  });
});

http.listen(3000, () => {
  console.log('3000포트로 서버가 요청을 받을 준비가 됐어요');
});
