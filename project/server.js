const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load TOSS_SECRET_KEY from environment variables
const secretKey = process.env.TOSS_SECRET_KEY || "test_sk_Gv6LjeKD8aBgxkD5Ezbe3wYxAdXy";

app.post("/api/payment", async (req, res) => {
  const { name, amount } = req.body;

  if (!name || !amount || amount <= 0) {
    return res.status(400).send({ error: "유효하지 않은 요청 데이터입니다." });
  }

  try {
    // Generate Base64 authorization header
    const base64Auth = Buffer.from(`${secretKey}:`).toString("base64");

    // Send request to Toss Payments API
    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments",
      {
        method: "카드", // 결제 수단
        amount: amount, // 결제 금액
        orderId: `order-${Date.now()}`, // 주문 ID
        orderName: name, // 주문 이름
        successUrl: "http://192.168.199.59:5000/payment/success", // 결제 성공 URL
        failUrl: "http://192.168.199.59:5000/payment/fail", // 결제 실패 URL
      },
      {
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentUrl = response.data.checkout.url;

    // Send the payment URL to the client
    res.status(200).send({ paymentUrl });
  } catch (error) {
    console.error("결제 요청 중 오류 발생:", error.response?.data || error.message);
    res.status(500).send({
      error: "결제 요청 실패",
      details: error.response?.data || error.message,
    });
  }
});

// Success URL handler
app.get("/payment/success", (req, res) => {
  res.send("결제가 성공적으로 처리되었습니다!");
});

// Fail URL handler
app.get("/payment/fail", (req, res) => {
  res.send("결제 처리에 실패했습니다.");
});


app.listen(port, () => {
  console.log(`Server is running on http://192.168.199.59:${port}`);
});