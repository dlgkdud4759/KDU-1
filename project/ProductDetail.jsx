import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert, Text } from 'react-native';  // Text 임포트 추가
import { WebView } from 'react-native-webview';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  // 결제 준비 API 호출 후 카카오페이 결제 URL 받아오기
  const initiatePayment = async () => {
    setLoading(true);
  
    try {
      const response = await fetch('https://yourserver.com/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: parseInt(product.price.replace('원', '').replace(',', '')),
          orderId: `order-${product.id}`,
        }),
      });
  
      // 응답 내용 확인
      const responseText = await response.text();
      console.log('서버 응답:', responseText); // 응답 로그 추가
  
      // 서버에서 JSON 응답을 반환하도록 보장
      const data = JSON.parse(responseText); // JSON 파싱
  
      if (data.next_redirect_pc_url) {
        setPaymentUrl(data.next_redirect_pc_url); // 결제 페이지 URL 설정
      } else {
        Alert.alert('결제 준비 실패');
      }
    } catch (error) {
      console.error('결제 요청 오류', error);
      Alert.alert('결제 요청 오류');
    } finally {
      setLoading(false);
    }
  };
  

  // 결제 페이지 로딩 중에 표시할 로딩 화면
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // 결제 URL이 설정되면 WebView로 결제 페이지를 렌더링
  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(event) => {
          // 결제 완료 후 리디렉션된 URL에서 결제 결과를 처리할 수 있습니다
          if (event.url.includes('success')) {
            Alert.alert('결제 완료');
            setPaymentUrl(null);
          } else if (event.url.includes('fail') || event.url.includes('cancel')) {
            Alert.alert('결제 취소 또는 실패');
            setPaymentUrl(null);
          }
        }}
        startInLoadingState
      />
    );
  }

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>{product.price}</Text>
      <Button title="결제하기" onPress={initiatePayment} />
    </View>
  );
};

export default ProductDetail;
