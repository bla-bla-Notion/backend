const { redisClient } = require('../schemas/index.schema');

class HttpRepository {
  constructor() {
    this.redisClient = redisClient;
  }
}

module.exports = HttpRepository;
