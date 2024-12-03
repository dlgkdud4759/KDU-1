import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function PaymentCheckoutPage() {
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 관리

  const amount = 50000;  // 결제 금액
  const orderName = "토스 티셔츠 외 2건";  // 주문명

  // 결제 요청 URL을 생성하여 WebView로 결제 창을 띄우는 함수
  const requestPayment = async () => {
    setIsLoading(true);  // 로딩 상태 시작

    try {
      // 서버에 결제 URL을 요청
      const response = await fetch("http://192.168.215.249:3000/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          orderName: orderName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentUrl(data.paymentUrl);  // 서버에서 받은 URL을 WebView에서 사용
      } else {
        console.error("서버에서 결제 URL을 받지 못했습니다.");
        alert("결제 URL을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 요청에 실패했습니다.");
    }

    setIsLoading(false);  // 로딩 상태 종료
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!paymentUrl ? (
        // 결제하기 버튼
        <Button title={isLoading ? "결제 준비 중..." : "결제하기"} onPress={requestPayment} disabled={isLoading} />
      ) : (
        // WebView를 사용하여 결제 창 띄우기
        <WebView
          source={{ uri: paymentUrl }}
          style={{ width: "100%", height: 600 }}
          onNavigationStateChange={(navState) => {
            // WebView 내에서 결제 후 리다이렉트 처리 (성공/실패)
            if (navState.url.includes("success")) {
              alert("결제가 성공적으로 완료되었습니다.");
            } else if (navState.url.includes("fail")) {
              alert("결제가 실패했습니다.");
            }
          }}
        />
      )}
    </View>
  );
}
