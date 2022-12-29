const { redisClient } = require('../schemas/index.schema');

// 1시간마다 자동으로 최신화 문서를 db에 저장하고, 항상 총 6개의 문서로 관리
module.exports = async document => {
  console.log('autosave.util document', document);
  // app.js에서 setInterval이 발동될 때, date 객체를 생성하고 이를 ISO string으로 변환하여 저장
  const currentDate = new Date();
  const createdAt = currentDate.toISOString();
  // db에서 pageData 조회
  const pageData = await redisClient.json.get('pageData', {
    path: '.pages',
  });
  // db에 저장된 pageData가 없다면, 생성
  if (!pageData) {
    await redisClient.json.set('pageData', '$', {
      pages: [{ pageId: 0, createdAt, document }],
    });
    return;
  }
  // db에서 조회한 pageData의 length가 6보다 작다면, 6이 될때까지 데이터 밀어 넣어 주기
  if (pageData.length < 6) {
    pageData.push({ createdAt, document, pageId: pageData.length });
    await redisClient.json.set('pageData', '$', {
      pages: pageData,
    });
    return;
  }
  // [queue 구현]
  pageData.shift(); // db에서 불러온 pageData 배열에서 첫번째 obj 삭제
  pageData.push({ createdAt, document }); // db에서 불러온 pageData 배열 맨 뒤에 obj 추가
  // for 문을 돌면서, 수정된 pageData의 pageId 값을 갱신
  for (let i = 0; i < pageData.length; i++) {
    pageData[i].pageId = i;
  }
  // 갱신된 pageData를 cache db에 저장
  await redisClient.json.set('pageData', '$', {
    pages: pageData,
  });
};
