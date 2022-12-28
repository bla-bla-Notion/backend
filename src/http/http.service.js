const HttpRepository = require('./http.repository');
const { ValidationError } = require('../exceptions/index.exception');

class HttpService {
  constructor() {
    this.httpRepository = new HttpRepository();
  }
  findPageList = async () => {
    const pageList = await this.httpRepository.findPage();
    return pageList.map(post => {
      return {
        pageId: post.pageId,
        createdAt: post.createdAt,
      };
    });
  };

  getDetailPage = async pageId => {
    const getPage = await this.httpRepository.findPage();
    if (!getPage[pageId])
      throw new ValidationError('해당 게시물을 찾을 수 없습니다.', 404);

    return getPage;
  };
}

module.exports = HttpService;
