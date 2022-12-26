const express = require('express');
const { Server } = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const randomNickNameGenerator = require('./util/generateRandomName.util');

const app = express();
const http = Server(app);
const io = socketIo(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

app.use(corse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** 고민거리
 * case 1
 socketIdMap의 key 값을 socket.id로 하고, value에 닉네임을 저장하면, 새로운 유저가 접속했을 때, 랜덤으로 생성된 닉네임이 이미 사용 중인지 확인하기 위해, Object.values()로 array를 생성 후, 해당 배열을 for문으로 돌면서 있는지 확인해야 한다.
 => Array search time complexity = O(n) 동시 접속자 수가 많아지면 엄청난 비효율이 발생한다. 
 * case2
 중복 닉네임 검사 속도를 올리기 위해서는 key 값을 nickname으로 하고, socket.id를 value로 하는 nicknameToSocketIdMap 객체를 하나 더 생성하면 된다. 
 => Object search time complexity = O(1)  같은 데이터를 하나 더 복제하는 셈으로, 메모리 낭비이다.
 * 어떤 방법이 좋을지 몰라서 일단 case2로 구현함. 
 */
const socketIdMap = {};
const nicknameToSocketIdMap = {};

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

  sock.on('message', text => {
    console.log(text);
    io.emit('message', text);
  });
});

http.listen(3000, () => {
  console.log('8080포트로 서버가 요청을 받을 준비가 됐어요');
});
