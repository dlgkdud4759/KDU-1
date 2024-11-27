require("dotenv").config();  // .env 파일에서 환경 변수 로드
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Buffer = require('buffer').Buffer; // Base64 인코딩을 위한 Buffer 추가

const app = express();
const PORT = process.env.PORT || 5000;  // .env에서 PORT 설정 가능
const secretKey = process.env.TOSS_SECRET_KEY; 

// CORS 설정 추가
app.use(
  cors({
    origin: "http://localhost:3000", // React 앱 도메인 (클라이언트 URL)
    methods: ["GET", "POST"], // 허용할 HTTP 메서드
    credentials: true, // 인증 정보 포함 허용 (필요 시)
  })
);

// JSON 요청 처리
app.use(express.json());

// API 라우트 (예: 결제 API)
app.post("/api/payment", async (req, res) => {
  const { name, amount } = req.body;

  if (!name || !amount) {
    return res.status(400).send({ error: "Invalid request data" });
  }

  try {
    // 1. secretKey와 :을 결합하고 Base64로 인코딩
    const keyWithColon = `${secretKey}:`;
    const base64Auth = Buffer.from(keyWithColon).toString('base64');

    // 2. Toss Payments 결제 요청
    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments", 
      {
        amount, // 결제 금액
        orderId: `order-${Date.now()}`, // 고유 주문 ID 생성 (타임스탬프 기반)
        paymentMethod: "CARD", // 결제 방법: 카드 (TEST 환경)
      },
      {
        headers: {
          "Authorization": `Basic ${base64Auth}`, // Base64 인코딩된 인증 정보를 Authorization 헤더에 추가
        }
      }
    );

    // 결제 성공 시 반환되는 URL
    const paymentUrl = response.data.paymentUrl;

    // 클라이언트에게 결제 URL 전달
    res.status(200).send({ paymentUrl });
  } catch (error) {
    console.error("결제 요청 중 오류 발생:", error);
    res.status(500).send({ error: "결제 요청 실패" });
  }
});

// React 앱을 개발 모드로 실행하면 static 파일을 제공할 필요 없음
// 클라이언트 요청에 대해 React 앱이 처리하도록 리디렉션 설정
app.get('*', (req, res) => {
  res.send('React App will handle this route!');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
