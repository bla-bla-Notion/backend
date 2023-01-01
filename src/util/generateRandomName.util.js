// 랜덤 닉네임을 만들기 위한 기초 데이터 셋
const data = {
  header: [
    '매니저',
    'E반의',
    '연예인',
    '과학자',
    '모범생',
    '광야의',
    '밤하늘의',
    '얼령뚱땅',
    '천방지축',
    '재치꾼',
    '발명꾼',
    '디버거',
    '프로개발자',
    '모함꾼',
  ],
  body: [
    '김수완',
    '김수정',
    '김영재',
    '김재민',
    '김주향',
    '김혁찬',
    '김현우',
    '김혜란',
    '김혜주',
    '노연수',
    '류제승',
    '백세현',
    '변진아',
    '손유진',
    '송지수',
    '이성배',
    '이성배',
    '이재정',
    '이학준',
    '전상국',
    '전유진',
    '최예나',
    '최혜연',
    '한요셉',
    '류현',
    '박동석',
    '박동석',
    '박동석',
  ],
};

// 0 ~ 최대값 사이의 랜덤 숫자를 생성해주는 함수
function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}

// 랜덤 닉네임 생성 함수를 모듈화
module.exports = () => {
  // header와 body 배열에 대하여 랜덤 index 값을 꺼내오기 위해, 각 배열에 대한 랜덤 번호 생성
  const randomHeader = getRandomNum(data.header.length);
  const randomBody = getRandomNum(data.body.length);

  // header배열과 body 배열에서 랜덤 인덱스로 조회한 값을 더하여 반환
  return data.header[randomHeader] + data.body[randomBody];
};
