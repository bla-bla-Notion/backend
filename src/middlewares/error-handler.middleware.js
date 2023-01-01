// 아래서 에러 로거 모듈을 추가하려고 하였으나 하지 못함
const errorLogger = (error, request, response, next) => {
  console.error(error); // morgan 또는 winston 모듈 받아서 에러로깅 추가하기
  // 다음 라우터(에러 핸들러)로 에러 객체를 넘김
  next(error);
};

// http 통신 중 발생한 에러는 모두 위의 에러 로거를 거쳐 이곳 핸들러로 들어와서 처리 됨
const errorHandler = (error, req, res, next) => {
  // redis db 에러 예외 처리
  if (error.name.includes('redis')) {
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
  // 그 외의 모든 에러는 아래서 resonse 처리를 하며, 메세지와 status가 정해지지 않은 경우, 기본으로 400번 & '알 수 없는 오류가 발생했습니다.'로 처리
  res.status(error.status || 400).json({
    errorMessage: error.message || '알 수 없는 오류가 발생했습니다.',
  });
};

// 에러 로거와 핸들러 모듈화
module.exports = { errorLogger, errorHandler };
