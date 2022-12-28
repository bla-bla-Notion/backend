const HttpService = require('./http.service');
const { ValidationError } = require('../exceptions/index.exception');

class HttpController {
  constructor() {
    this.httpService = new HttpService();
  }
  pageList = async (req, res, next) => {
    try {
      const pages = await this.httpService.findPageList();
      res.status(200).json({ data: pages });
    } catch (error) {
      next(error);
    }
  };
  getDetailPage = async (req, res, next) => {
    try {
       const { pageId } = req.params; 
       const page = await this.httpService.getDetailPage( pageId );
        
        res.status(200).json({ data: page});
    } catch(err) {
        next(err);
    }
  };
}



module.exports = HttpController;
