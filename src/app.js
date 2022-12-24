const express = require('express');
const { Server } = require('http');
const socketIo = require('socket.io');
const randomNickNameGenerator = require('./util/generateRandomName.util');

const app = express();
const http = Server(app);
const io = socketIo(http);

app.use(express.static('assets'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const socketIdMap = {};

function estimateSamePageViewerCount() {
  const countByUrl = Object.values(socketIdMap).reduce((acc, url) => {
    return {
      ...acc,
      [url]: acc[url] ? acc[url] + 1 : 1,
    };
  }, {});

  console.log(countByUrl);
  for (const [socketId, url] of Object.entries(socketIdMap)) {
    const count = countByUrl[url];
    io.to(socketId).emit('SAME_PAGE_VIEWER_COUNT', count);
  }
}

// sock 변수에는 접속한 사용자 정보가 담겨 있음
io.on('connection', sock => {
  //  프로젝트 요구사항
  // 입장한 유저별로 랜덤 닉네임을 생성해서 클라로 보내주기
  // textarea 작업 내용 실시간 렌더링
  // socket.on("정해야 함!!", (msg) => {})
  // 퇴장한 유저 닉네임 제거한 유저들 닉네임 배열 클라로 보내주기

  socketIdMap[sock.id] = randomNickNameGenerator();
  console.log(socketIdMap[sock.id], '유저가 소켓에 연결하였습니다.');

  sock.on('BUY', data => {
    console.log(data);
    const emitData = {
      nickname: data.nickname,
      goodsId: data.goodsId,
      goodsName: data.goodsName,
      date: new Date().toISOString(),
    };

    io.emit('BUY_GOODS', emitData);
  });

  sock.on('CHANGED_PAGE', data => {
    console.log(sock.id, '님이', data, '상세페이지에 접속하셨습니다.');
    socketIdMap[sock.id] = data;
    estimateSamePageViewerCount();
  });

  sock.on('disconnect', () => {
    socketIdMap[sock.id] = null;
    console.log(sock.id, '유저가 소켓 연결을 끊었습니다.');
  });
});

app.use('/api', require('./routes/index.js'));

http.listen(8080, () => {
  console.log('서버가 요청을 받을 준비가 됐어요');
});
