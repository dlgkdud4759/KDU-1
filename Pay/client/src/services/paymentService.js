import axios from "axios";

// 결제 요청을 위한 함수
export const makePayment = async (name, amount) => {
  try {
    const response = await axios.post("http://localhost:5000/api/payment", {
      name,
      amount,
    });
    return response.data.paymentUrl;  // 결제 URL 반환
  } catch (error) {
    console.error("결제 요청 중 오류 발생:", error);
    throw error;  // 오류 발생 시 다시 던져서 처리할 수 있도록 함
  }
};
