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
  ],
};

function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}

module.exports = () => {
  const randomHeader = getRandomNum(data.header.length);
  const randomBody = getRandomNum(data.body.length);

  return data.header[randomHeader] + data.body[randomBody];
};
