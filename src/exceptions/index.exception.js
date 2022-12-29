// req로 받아야 하는 값이 없을 경우 사용하는 에러 객체로 Error 객체를 extends
class InvalidParamsError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 400;
    this.name = 'InvalidParamsError';
    if (!message) this.message = '요청한 데이터 형식이 올바르지 않습니다.';
  }
}

// 값이 유효하지 않은 경우 사용하는 에러 객체로 Error 객체를 extends
class ValidationError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 400;
    this.name = 'ValidationError';
    if (!message) this.message = '알 수 없는 오류가 발생했습니다.';
  }
}

// 두 커스텀 에러 객체 모듈화
module.exports = { InvalidParamsError, ValidationError };
