const axios = require("axios");
const Buffer = require("buffer").Buffer; // Base64 인코딩을 위한 Buffer 추가

// Toss Payments API 설정
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY; // Toss Payments에서 발급받은 Secret Key
const BASE_URL = "https://api.tosspayments.com/v1/payments";

exports.handlePayment = async (req, res) => {
  const { name, amount } = req.body;

  console.log("Received payment request:", name, amount);  // 요청 내용 로그

  // 유효성 검사 (amount가 적절한 값인지 체크)
  if (!name || !amount || amount < 100) {
    console.error("Invalid payment data:", req.body);  // 잘못된 요청 로그
    return res.status(400).json({ message: "Invalid payment data" });
  }

  try {
    // Toss Payments API 요청 준비
    const response = await axios.post(
      `${BASE_URL}/ready`,
      {
        orderId: `order-${Date.now()}`, // 고유 주문 ID 생성
        amount,
        orderName: name,
        successUrl: "http://localhost:3000/payment/success", // 성공시 리디렉션 URL
        failUrl: "http://localhost:3000/payment/fail", // 실패시 리디렉션 URL
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64")}`, // 인증 헤더
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Toss API response:", response.data);  // Toss API 응답 로그

    // 결제 페이지 URL 반환
    res.status(200).json({ paymentUrl: response.data.nextRedirectUrl });
  } catch (error) {
    // Toss API 호출 중 오류 처리
    if (error.response) {
      console.error("API 응답 오류:", error.response.data);  // API에서 받은 오류 메시지
      return res.status(500).json({ message: "결제 요청 오류", error: error.response.data });
    } else {
      console.error("API 호출 중 오류:", error.message);  // 네트워크나 다른 오류
      return res.status(500).json({ message: "서버 내부 오류 발생", error: error.message });
    }
  }
};
