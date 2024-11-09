import React, { useState, useRef } from "react";
import { View, Button, Alert } from "react-native";
import { WebView } from 'react-native-webview';

const clientKey = "test_ck_XZYkKL4Mrj1yLepyJKwkV0zJwlEW";

export function Checkout() {
  const [ready, setReady] = useState(false);
  const [amount, setAmount] = useState(50000);
  const successUrl = "http://192.168.215.249:8080/success";  // 실제 성공 URL로 교체
  const failUrl = "http://192.168.35.111:8080/fail";        // 실제 실패 URL로 교체
  const webviewRef = useRef(null); // useRef로 webviewRef 정의

  const handlePayment = () => {
    if (!ready) return;

    // 요청할 결제 정보를 웹뷰에 전달합니다.
    webviewRef.current.postMessage(
      JSON.stringify({
        clientKey,
        orderId: generateRandomString(),
        orderName: "토스 티셔츠 외 2건",
        amount,
        successUrl,
        failUrl,
      })
    );
  };

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef} // ref를 useRef로 설정한 webviewRef에 연결
        source={{ uri: "https:/js.tosspayments.com" }} // 결제 페이지 URL 설정
        onLoadEnd={() => setReady(true)}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);

          if (data.status === "success") {
            Alert.alert("결제 성공", "결제가 완료되었습니다.");
          } else {
            Alert.alert("결제 실패", "결제에 실패했습니다.");
          }
        }}
      />
      <Button
        title="결제하기"
        onPress={handlePayment}
        disabled={!ready}
      />
    </View>
  );
}

export default Checkout;
