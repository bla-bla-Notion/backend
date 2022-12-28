//값이 존재하지않거나 잘못된 값으로 들어왔을때
class InvalidParamsError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 400;
    this.name = 'InvalidParamsError';
    if (!message) this.message = '요청한 데이터 형식이 올바르지 않습니다.';
  }
}

// 유효성 인증 x
class ValidationError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 400;
    this.name = 'ValidationError';
    if (!message) this.message = '알 수 없는 오류가 발생했습니다.';
  }
}

module.exports = { InvalidParamsError, ValidationError };
