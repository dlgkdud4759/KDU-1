const axios = require('axios');
require('dotenv').config();  // .env 파일에서 환경 변수 불러오기

// 환경 변수에서 Toss 시크릿 키 불러오기
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

// Toss 결제 요청을 처리하는 함수
const tossPayment = async (amount) => {
  try {
    const response = await axios.post('https://api.toss.im/v1/payments', {
      amount,
      // 결제와 관련된 추가 정보 입력
    }, {
      headers: {
        'Authorization': `Bearer ${TOSS_SECRET_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('결제 요청 실패: ' + error.message);
  }
};

module.exports = { tossPayment };
