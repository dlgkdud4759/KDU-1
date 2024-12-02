const axios = require('axios');
require('dotenv').config();  // .env 파일에서 환경 변수 불러오기

// 환경 변수에서 Toss 시크릿 키 불러오기
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

// Toss 결제 요청을 처리하는 함수
const tossPayment = async (amount) => {
  try {
    // Base64로 인코딩된 시크릿 키
    const base64Auth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

    const response = await axios.post('https://api.tosspayments.com/sandbox/v1/payments', {  // 샌드박스 URL로 수정
      amount,
      // 결제와 관련된 추가 정보 입력
    }, {
      headers: {
        'Authorization': `Basic ${base64Auth}`,  // Basic 인증 방식으로 변경
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('결제 요청 실패: ' + error.message);
  }
};

module.exports = { tossPayment };
