modul.exports = setInterval(async document => {
  // setInterval이 발동될 때, date 객체를 생성하고 이를 현지 시간 string으로 변경
  const currentDate = new Date();
  const createdAt = currentDate.toISOString();
  // db에서 pageData 조회
  const pageData = await redisClient.json.get('pageData', {
    path: '.pages',
  });
  if (!pageData) {
    await redisClient.json.set('pageData', '$', {
      pages: [{ pageId: 1, createdAt, document }],
    });
    return;
  }
  if (pageData.length < 6) {
    pageData.push({ createdAt, document });
    for (let i = 0; i < pageData.length; i++) {
      pageData[i].pageId = i + 1;
    }
    await redisClient.json.set('pageData', '$', {
      pages: pageData,
    });
    return;
  }
  pageData.shift(); // db에서 불러온 pageData 배열에서 첫번째 obj 삭제
  pageData.push({ createdAt, document }); // db에서 불러온 pageData 배열 맨 뒤에 obj 추가

  // for 문을 돌면서, 수정된 pageData의 pageId 값을 갱신
  for (let i = 0; i < pageData.length; i++) {
    pageData[i].pageId = i + 1;
  }
  // 갱신된 pageData를 cache db에 저장
  await redisClient.json.set('pageData', '$', {
    pages: pageData,
  });
}, 1000 * 60 * 60);
