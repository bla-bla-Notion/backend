require('dotenv').config();
const { createClient } = require('redis');

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
});

const connect = async () => {
  redisClient.on('error', err => {
    console.error('Redis Client Error', err);
  });
  await redisClient.connect();
  console.log('Redis connected!');
};

connect();

(async () => {
  // redis 기본 자료 구조 사용하여 list 생성
  await redisClient.rPush('page', `{ id: 3, content: 'asdf' }`);

  // db에서 자료 조회 -> list의 length 조회
  await redisClient.lLen('page', function (err, reply) {
    console.log(reply);
  });

  // db에서 자료 조회 -> list 전체 조회
  let data;
  await redisClient.lRange('page', 0, -1, function (err, reply) {
    console.log(reply);
    data = reply;
    // reply를 JSON.parse() 메서드 사용해서 JS에서 사용 할 수 있는 형태로 가공
  });

  // redisJSON 모듈을 사용하여 JSON 객체 형태로 바로 처리
  // db에 자료 생성
  await redisClient.json.set('pageData', '$', {
    pages: [
      {
        pageId: 1,
        createdAt: new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
        content: 'asdfsdfsdfa',
      },
      {
        pageId: 2,
        createdAt: new Date().toLocaleString('ko-KR', { timeZone: 'UTC' }),
        content: 'asdfsdfsdfa',
      },
    ],
  });

  // db에서 자료 조회
  const result = await redisClient.json.get('pageData', {
    path: '.pages',
  });
  console.log(result);
})();

module.exports = { redisClient, connect };
