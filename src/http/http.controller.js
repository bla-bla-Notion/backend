const HttpService = require('./http.service');
//const {} = require('../exception/index.exception.js');

class HttpController {
  constructor() {
    this.httpService = new HttpService();
  }
  pageList = async (req, res, next) => {
    try {
      const pages = await this.httpService.findPageList();
      if (!pages) throw new ValidationError('페이지가 없습니다.', 404);
      res.status(200).json({ data: pages });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = HttpController;
