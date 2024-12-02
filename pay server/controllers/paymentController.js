// paymentController.js
const axios = require("axios");
const Buffer = require("buffer").Buffer;

// Toss Payments API 설정
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const BASE_URL = "https://api.tosspayments.com/v1/payments";

exports.handlePayment = async (req, res) => {
  const { name, amount } = req.body;

  console.log("Received payment request:", name, amount);

  // 유효성 검사
  if (!name || !amount || amount < 100) {
    console.error("Invalid payment data:", req.body);
    return res.status(400).json({ message: "Invalid payment data" });
  }

  try {
    // Toss Payments API 요청 준비
    const response = await axios.post(
      `${BASE_URL}/ready`,  // ready 엔드포인트 사용
      {
        orderId: `order-${Date.now()}`,
        amount,
        orderName: name,
        successUrl: "http://localhost:3000/payment/success",
        failUrl: "http://localhost:3000/payment/fail",
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Toss API response:", response.data);
    res.status(200).json({ paymentUrl: response.data.nextRedirectUrl });  // 결제 페이지 URL 반환
  } catch (error) {
    if (error.response) {
      console.error("API 응답 오류:", error.response.data);
      return res.status(500).json({ message: "결제 요청 오류", error: error.response.data });
    } else {
      console.error("API 호출 중 오류:", error.message);
      return res.status(500).json({ message: "서버 내부 오류 발생", error: error.message });
    }
  }
};
