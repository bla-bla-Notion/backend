const errorLogger = (error, request, response, next) => {
  console.error(error); // morgan 또는 winston 모듈 받아서 에러로깅 추가하기
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (error.name.includes('redis')) {
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
  res.status(error.status || 400).json({
    errorMessage: error.message || '알 수 없는 오류가 발생했습니다.',
  });
};

module.exports = { errorLogger, errorHandler };
