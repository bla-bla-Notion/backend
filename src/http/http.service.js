const HttpRepository = require('./http.repository');
const { ValidationError } = require('../exceptions/index.exception');

class HttpService {
  constructor() {
    this.httpRepository = new HttpRepository();
  }
  //서비스 페이지 리스트를 불러오는 API
  findPageList = async () => {
    //레포지토레 레이어 메서드 사용
    const pageList = await this.httpRepository.findPage();
    //레포지토리에서 불러온 데이터를 형식에 맞게 정리
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

    return getPage[pageId];
  };
}

module.exports = HttpService;
