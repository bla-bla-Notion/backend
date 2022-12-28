const { redisClient } = require('../schemas/index.schema');

class HttpService {
  constructor() {
    this.httpRepository = new HttpController();
  }
}

module.exports = HttpService;
