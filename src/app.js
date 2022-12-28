const express = require('express');
const { Server } = require('http');
const cors = require('cors');
const randomNickNameGenerator = require('./util/generateRandomName.util');
const { ConnectionTimeoutError } = require('redis');

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

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const socketIdMap = {};
let document;
io.on('connection', sock => {
  let nickname = randomNickNameGenerator();
  //닉네임 검증하기
  let keys = Object.keys(socketIdMap);
  let found = keys.find(element => element == nickname);
  console.log(found);
  socketIdMap[nickname] = sock.id;

  io.emit('nickname', {
    newUser: nickname,
    usersList: socketIdMap,
  });
  sock.on('disconnect', () => {
    const disconnectedUser = socketIdMap[nickname];
    delete socketIdMap[nickname];

    io.emit('disconnectedUser', {
      disconnectedUser,
      usersList: socketIdMap,
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
