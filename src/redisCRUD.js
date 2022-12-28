require('dotenv').config();
const { createClient } = require('redis');

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
});

(async () => {
  redisClient.on('error', err => {
    console.error('Redis Client Error', err);
  });
  await redisClient.connect();
  console.log('Redis connected!');
})();

// const document = { ops: [{ insert: '가나다라\n' }] };
// (async () => {
//   // setInterval이 발동될 때, date 객체를 생성하고 이를 현지 시간 string으로 변경
//   const currentDate = new Date();
//   console.log(currentDate);
//   const createdAt = currentDate.toLocaleString('ko-KR', { timeZone: 'UTC' });
//   console.log(createdAt);
//   // db에서 pageData 조회
//   const pageData = await redisClient.json.get('pageData:test2', {
//     path: '.pages',
//   });
//   console.log(pageData);
//   if (!pageData) {
//     await redisClient.json.set('pageData:test2', '$', {
//       pages: [{ pageId: 1, createdAt, document }],
//     });
//     return;
//   }
//   if (pageData.length < 6) {
//     pageData.push({ createdAt, document });
//     for (let i = 0; i < pageData.length; i++) {
//       pageData[i].pageId = i + 1;
//     }
//     await redisClient.json.set('pageData:test2', '$', {
//       pages: pageData,
//     });
//     return;
//   }
//   pageData.shift(); // db에서 불러온 pageData 배열에서 첫번째 obj 삭제
//   pageData.push({ createdAt, document }); // db에서 불러온 pageData 배열 맨 뒤에 obj 추가

//   // for 문을 돌면서, 수정된 pageData의 pageId 값을 갱신
//   for (let i = 0; i < pageData.length; i++) {
//     pageData[i].pageId = i + 1;
//   }
//   await redisClient.json.set('pageData:test2', '$', {
//     pages: pageData,
//   });
// })();
