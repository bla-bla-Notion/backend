const HttpRepository = require('./http.repository');
class HttpService {
  constructor() {
    this.httpRepository = new HttpRepository();
  }
  findPageList = async () => {
    const pageList = await this.httpRepository.findPage();
    pageList.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return pageList.map(post => {
      return {
        pageId: post.pageId,
        createdAt: post.createdAt,
      };
    });
  };
}
module.exports = HttpService;
