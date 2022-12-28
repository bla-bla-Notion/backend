const HttpService = require('./http.service');

class HttpController {
  constructor() {
    this.httpService = new HttpService();
  }

  findAllPages = async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  };
}

module.exports = HttpController;
