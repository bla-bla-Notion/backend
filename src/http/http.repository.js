const { redisClient } = require('../schemas/index.schema');
class HttpRepository {
  findPage = async () => {
    const result = await redisClient.json.get('pageData:test', {
      path: '.pages',
    });
    return result;
  };
}

module.exports = HttpRepository;
