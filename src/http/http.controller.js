const HttpService = require('./http.service');
const { ValidationError } = require('../exceptions/index.exception');
//예외처리 모듈, 서비스 모듈 불러오기
class HttpController {
  constructor() {
    this.httpService = new HttpService();
  }
  //메인 페이지에 작성된 페이지리스트를 불러오는 API
  pageList = async (req, res, next) => {
    try {
      //서비스 레이어 메서드 사용
      const pages = await this.httpService.findPageList();
      //목록 값이 없을 경우 예외처리
      if (!pages) throw new ValidationError('페이지가 없습니다.', 404);
      res.status(200).json({ data: pages });
      //에러핸들링
    } catch (error) {
      next(error);
    }
  };
  getDetailPage = async (req, res, next) => {
    try {
      const { pageId } = req.params;
      const page = await this.httpService.getDetailPage(pageId);

      res.status(200).json({ data: page });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = HttpController;
