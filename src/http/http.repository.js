const { redisClient } = require('../schemas/index.schema'); //레디스모듈을 불러오기
class HttpRepository {
  findPage = async () => {
    //레디스DB에 저장된 페이지들을 불러온다
    const result = await redisClient.json.get('pageData', {
      path: '.pages',
    });
    return result;
  };
}

module.exports = HttpRepository;
